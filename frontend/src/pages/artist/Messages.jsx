import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Paperclip,
  Send,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { getToken, getUser, messagesAPI, uploadFile } from "../../services/api";
import { connectSocket } from "../../socket";

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const toInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m`;
  if (h < 24) return `${h}h`;
  if (d < 7) return `${d}d`;
  return new Date(dateString).toLocaleDateString();
};

const formatMsgTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatBytes = (bytes) => {
  const v = Number(bytes);
  if (!v || isNaN(v)) return "";
  if (v < 1024) return `${v} B`;
  if (v < 1048576) return `${(v / 1024).toFixed(1)} KB`;
  return `${(v / 1048576).toFixed(1)} MB`;
};

const normalizeMessage = (msg, currentUserId) => ({
  id: msg._id,
  from: msg.sender?._id === currentUserId ? "me" : "them",
  text: msg.content,
  attachment: msg.attachment || null,
  time: formatMsgTime(msg.createdAt),
  read: Boolean(msg.isRead),
});

const toConversation = (item) => ({
  id: item.user?._id,
  name: item.user?.name || "Unknown user",
  avatar: toInitials(item.user?.name),
  photo: item.user?.avatar || item.user?.photo || "",
  time: formatRelativeTime(item.lastMessage?.createdAt),
  preview: item.lastMessage?.content || "Start a conversation",
  unread: item.unreadCount || 0,
});

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ initials, photo, size = 44 }) {
  const [err, setErr] = useState(false);
  if (photo && !err) {
    return (
      <img
        src={photo}
        alt={initials}
        onError={() => setErr(true)}
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          objectFit: "cover",
          flexShrink: 0,
          border: "1px solid rgba(201,169,97,0.12)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        flexShrink: 0,
        background: "#2d3139",
        color: "#c9a961",
        fontWeight: 700,
        fontSize: size * 0.3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        border: "1px solid rgba(201,169,97,0.08)",
      }}
    >
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function Messages() {
  const location = useLocation();
  const currentUser = getUser();
  const currentUserId = currentUser?._id;

  /* refs */
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* state */
  const [conversations, setConversations] = useState([]);
  const [messagesByConv, setMessagesByConv] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"
  const [inputFocused, setInputFocused] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  /* ── scroll to bottom ── */
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [selectedId, messagesByConv]);

  /* ── Auto-open keyboard when chat view becomes active ──────────────────
     Three-layer approach so it works on iOS, Android, and desktop:
     1. focus() after 80 ms — layout and animation have settled
     2. A second focus() at 300 ms catches slow Android keyboards
     3. visualViewport resize listener scrolls to bottom after keyboard open
  ── */
  useEffect(() => {
    if (mobileView !== "chat" || !selectedId) return;

    const t1 = setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 80);

    const t2 = setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mobileView, selectedId]);

  /* ── Visual-viewport resize = keyboard appeared/disappeared ── */
  useEffect(() => {
    const onViewportResize = () => {
      scrollToBottom();
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportResize);
      return () =>
        window.visualViewport.removeEventListener("resize", onViewportResize);
    }
  }, []);

  /* ── Load conversations ── */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await messagesAPI.getConversations();
        if (!mounted) return;
        const mapped = data.map(toConversation);

        const params = new URLSearchParams(location.search);
        const urlId = params.get("userId");
        const urlName = params.get("name");

        /* inject conv from Nearby Artists if not already in the list */
        if (urlId && !mapped.find((c) => c.id === urlId)) {
          mapped.unshift({
            id: urlId,
            name: urlName || "Artist",
            avatar: toInitials(urlName || "A"),
            photo: "",
            time: "",
            preview: "Start a conversation",
            unread: 0,
          });
        }

        setConversations(mapped);
        const preferred =
          mapped.find((c) => c.id === urlId)?.id || mapped[0]?.id || null;
        setSelectedId((prev) => prev || preferred);
        /* open chat view directly when coming in from a link */
        if (urlId) setMobileView("chat");
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location.search]);

  /* ── Load thread messages ── */
  useEffect(() => {
    if (!selectedId || !currentUserId) return;
    let mounted = true;
    (async () => {
      try {
        const data = await messagesAPI.getThread(selectedId);
        if (!mounted) return;
        setMessagesByConv((prev) => ({
          ...prev,
          [selectedId]: data.map((m) => normalizeMessage(m, currentUserId)),
        }));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c)),
        );
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedId, currentUserId]);

  /* ── Socket real-time ── */
  useEffect(() => {
    const token = getToken();
    if (!token || !currentUserId) return;
    const socket = connectSocket(token);

    const onNew = (msg) => {
      const senderId = msg.sender?._id;
      const receiverId = msg.receiver?._id;
      const otherId = senderId === currentUserId ? receiverId : senderId;
      if (!otherId) return;

      setMessagesByConv((prev) => {
        const list = prev[otherId] || [];
        if (list.some((m) => m.id === msg._id)) return prev;
        return {
          ...prev,
          [otherId]: [...list, normalizeMessage(msg, currentUserId)],
        };
      });

      setConversations((prev) => {
        const existing = prev.find((c) => c.id === otherId);
        const meSent = senderId === currentUserId;
        const unreadInc = !meSent && selectedId !== otherId ? 1 : 0;
        if (!existing) {
          const name = meSent ? msg.receiver?.name : msg.sender?.name;
          return [
            {
              id: otherId,
              name: name || "Unknown",
              avatar: toInitials(name),
              photo: "",
              time: formatRelativeTime(msg.createdAt),
              preview: msg.content,
              unread: unreadInc,
            },
            ...prev,
          ];
        }
        return [
          {
            ...existing,
            preview: msg.content,
            time: formatRelativeTime(msg.createdAt),
            unread: existing.unread + unreadInc,
          },
          ...prev.filter((c) => c.id !== otherId),
        ];
      });
    };

    const onRead = ({ conversationWith, readBy }) => {
      if (readBy === currentUserId || conversationWith !== selectedId) return;
      setMessagesByConv((prev) => ({
        ...prev,
        [conversationWith]: (prev[conversationWith] || []).map((m) =>
          m.from === "me" ? { ...m, read: true } : m,
        ),
      }));
    };

    socket.on("new_message", onNew);
    socket.on("messages_read", onRead);
    return () => {
      socket.off("new_message", onNew);
      socket.off("messages_read", onRead);
    };
  }, [currentUserId, selectedId]);

  /* ── Derived state ── */
  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId),
    [conversations, selectedId],
  );
  const currentMessages = messagesByConv[selectedId] || [];
  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Actions ── */
  const selectConv = (id) => {
    setSelectedId(id);
    setMobileView("chat");
    /* Keyboard focus is handled by the useEffect above */
  };

  const handleSend = async () => {
    const content = input.trim();
    if ((!content && !selectedFile) || !selectedId) return;
    setInput("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
    /* Refocus after send so keyboard stays open */
    setTimeout(() => inputRef.current?.focus(), 50);
    try {
      let attachment;
      if (fileToSend) {
        const up = await uploadFile(fileToSend, {
          bucket: "chat-files",
          type: "chat",
          fieldName: "file",
        });
        attachment = {
          url: up.url,
          name: fileToSend.name,
          mimeType: fileToSend.type,
          size: fileToSend.size,
        };
      }
      await messagesAPI.sendMessage({
        receiverId: selectedId,
        content: content || attachment?.name || "Attachment",
        attachment,
      });
    } catch (e) {
      console.error(e);
      setInput(content);
      setSelectedFile(fileToSend);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* Whether to hide the global FAB */
  const chatOpen = mobileView === "chat" && !!selectedId;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        /* ── Scrollbar ── */
        .msg-scroll::-webkit-scrollbar { width: 3px; }
        .msg-scroll::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.15); border-radius: 4px; }
        .msg-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,169,97,0.15) transparent; }

        /* ── FAB hide ──
           When the chat thread is open on mobile, hide the Sidebar FAB
           so it doesn't sit on top of the message input bar.
        ── */
        .msg-hide-fab .sb-fab,
        .msg-hide-fab .fab-btn {
          display: none !important;
          pointer-events: none !important;
        }

        /* ── Root ──
           100dvh = dynamic viewport height — automatically shrinks when
           the soft keyboard opens on iOS / Android, so the layout
           compresses upward rather than the keyboard covering the input.
        ── */
        .msg-root {
          display: flex;
          height: 100dvh;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #1a1d24;
        }

        /* ── Content wrapper (right of sidebar on desktop) ── */
        .msg-content {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-width: 0;
        }
        @media (min-width: 1024px) {
          .msg-content { margin-left: 248px; }
        }

        /* ── Conversation list panel ── */
        .msg-list {
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-shrink: 0;
          border-right: 1px solid rgba(201,169,97,0.10);
          background: #1a1d24;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .msg-list { width: clamp(240px, 28%, 300px); }
        }
        /* Hide list on mobile when chat thread is open */
        .msg-list.hidden-mobile { display: none; }
        @media (min-width: 768px) {
          .msg-list.hidden-mobile { display: flex; }
        }

        /* ── Chat thread panel ── */
        .msg-thread {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
          background: #1a1d24;
        }
        /* Hide thread on mobile when list is shown */
        .msg-thread.hidden-mobile { display: none; }
        @media (min-width: 768px) {
          .msg-thread.hidden-mobile { display: flex; }
        }

        /* ── List header ──
           Mobile: 56px top padding clears the floating hamburger button.
           Tablet+: normal 24px.
        ── */
        .msg-list-header {
          padding: 56px 18px 12px;
          flex-shrink: 0;
        }
        @media (min-width: 640px)  { .msg-list-header { padding: 24px 18px 12px; } }
        @media (min-width: 1024px) { .msg-list-header { padding: 28px 20px 12px; } }

        /* ── Thread header ──
           Mobile: 56px top padding so back arrow clears the hamburger.
           Tablet+: normal 14px.
        ── */
        .msg-thread-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 56px clamp(14px, 2.5vw, 20px) 13px;
          border-bottom: 1px solid rgba(201,169,97,0.10);
          flex-shrink: 0;
          background: #1a1d24;
        }
        @media (min-width: 640px) {
          .msg-thread-header { padding: 14px clamp(14px, 2.5vw, 20px); }
        }

        /* ── Messages scroll area ── */
        .msg-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px clamp(14px, 2.5vw, 24px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* ── Input bar ──
           sticky + bottom:0 keeps it glued to the bottom of its flex
           container, which itself shrinks with 100dvh when the keyboard
           opens — so the bar rises with the keyboard automatically.
        ── */
        .msg-input-bar {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px clamp(12px, 2vw, 18px);
          border-top: 1px solid rgba(201,169,97,0.10);
          background: #1a1d24;
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
        }

        /* ── Back button ── */
        .msg-back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,169,97,0.20);
          color: #c9a961;
          cursor: pointer;
          outline: none;
          flex-shrink: 0;
          transition: background 0.14s, border-color 0.14s, transform 0.14s;
        }
        .msg-back:hover {
          background: rgba(201,169,97,0.12);
          border-color: rgba(201,169,97,0.42);
          transform: translateX(-2px);
        }
        .msg-back:active { transform: scale(0.94); }

        /* ── Conversation item ── */
        .conv-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 14px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.13s;
        }
        .conv-item:hover { background: rgba(255,255,255,0.025); }

        /* ── Input field ── */
        .msg-input {
          flex: 1;
          padding: 10px 14px;
          background: #2d3139;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 11px;
          color: #c4d5e0;
          font-size: 13.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.14s, box-shadow 0.14s;
        }
        .msg-input:focus {
          border-color: rgba(201,169,97,0.38);
          box-shadow: 0 0 0 2px rgba(201,169,97,0.14);
        }
        .msg-input::placeholder { color: #3a4e5e; }

        /* ── Send button ── */
        .msg-send {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border-radius: 11px; border: none; flex-shrink: 0;
          transition: opacity 0.14s, transform 0.14s;
        }
        .msg-send:hover:not(:disabled) { opacity: 0.86; transform: scale(1.06); }
        .msg-send:active:not(:disabled){ transform: scale(0.94); }
        .msg-send:disabled { cursor: not-allowed; }

        /* ── Attach button ── */
        .msg-attach {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; flex-shrink: 0;
          background: transparent; border: none; cursor: pointer;
          color: #5a6e7d; transition: color 0.14s;
        }
        .msg-attach:hover { color: #c9a961; }

        /* ── Search input ── */
        .msg-search {
          width: 100%;
          padding: 9px 12px 9px 33px;
          background: #2d3139;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #c4d5e0;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.14s;
        }
        .msg-search:focus { border-color: rgba(201,169,97,0.35); }
        .msg-search::placeholder { color: #3a4e5e; }
      `}</style>

      {/* Root — hides FAB when chat is open */}
      <div className={`msg-root${chatOpen ? " msg-hide-fab" : ""}`}>
        <Sidebar />

        <div className="msg-content">
          {/* ══════════════════════════════════════════
              CONVERSATION LIST
          ══════════════════════════════════════════ */}
          <div
            className={`msg-list${mobileView === "chat" ? " hidden-mobile" : ""}`}
          >
            {/* Header */}
            <div className="msg-list-header">
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(20px,4vw,22px)",
                  fontWeight: 700,
                  color: "#c4d5e0",
                  lineHeight: 1.2,
                }}
              >
                Messages
              </h1>
              <p
                style={{ margin: "4px 0 0", fontSize: 12.5, color: "#3a4e5e" }}
              >
                Connect with hirers and opportunities
              </p>
            </div>

            {/* Search */}
            <div style={{ padding: "0 14px 12px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: searchFocused ? "#c9a961" : "#3a4e5e",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search conversations…"
                  className="msg-search"
                />
              </div>
            </div>

            {/* Conversation items */}
            <div className="msg-scroll" style={{ flex: 1, overflowY: "auto" }}>
              {filteredConvs.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#3a4e5e",
                    fontSize: 13,
                    marginTop: 32,
                  }}
                >
                  No conversations found
                </p>
              ) : (
                filteredConvs.map((conv) => (
                  <div
                    key={conv.id}
                    className="conv-item"
                    onClick={() => selectConv(conv.id)}
                    style={{
                      background:
                        conv.id === selectedId
                          ? "rgba(201,169,97,0.08)"
                          : "transparent",
                      borderLeft: `2px solid ${conv.id === selectedId ? "#c9a961" : "transparent"}`,
                    }}
                  >
                    <Avatar
                      initials={conv.avatar}
                      photo={conv.photo}
                      size={44}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: conv.id === selectedId ? 700 : 600,
                            color:
                              conv.id === selectedId ? "#c4d5e0" : "#8a9faf",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "calc(100% - 40px)",
                          }}
                        >
                          {conv.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            color: "#3a4e5e",
                            flexShrink: 0,
                            marginLeft: 6,
                          }}
                        >
                          {conv.time}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12.5,
                            color: "#3a4e5e",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {conv.preview}
                        </p>
                        {conv.unread > 0 && (
                          <span
                            style={{
                              marginLeft: 6,
                              flexShrink: 0,
                              minWidth: 18,
                              height: 18,
                              background: "#c9a961",
                              color: "#1a1d24",
                              borderRadius: 20,
                              fontSize: 10,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0 5px",
                            }}
                          >
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              CHAT THREAD
          ══════════════════════════════════════════ */}
          <div
            className={`msg-thread${mobileView === "list" ? " hidden-mobile" : ""}`}
          >
            {selected ? (
              <>
                {/* ── Thread header ── */}
                <div className="msg-thread-header">
                  {/*
                    Back arrow — gold, clearly visible.
                    On mobile: returns to conversation list.
                    On desktop: always shown as a visual nav anchor.
                  */}
                  <button
                    className="msg-back"
                    onClick={() => setMobileView("list")}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={17} strokeWidth={2.3} />
                  </button>

                  <Avatar
                    initials={selected.avatar}
                    photo={selected.photo}
                    size={38}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "#c4d5e0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selected.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 11.5, color: "#3a4e5e" }}>
                      Messages
                    </p>
                  </div>

                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#5a6e7d",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <MoreVertical size={15} />
                  </button>
                </div>

                {/* ── Messages scroll area ── */}
                <div className="msg-body msg-scroll">
                  {currentMessages.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "48px 20px",
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: "rgba(201,169,97,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Search
                          size={22}
                          style={{ color: "rgba(201,169,97,0.35)" }}
                        />
                      </div>
                      <p
                        style={{ margin: 0, fontSize: 13.5, color: "#3a4e5e" }}
                      >
                        Start a conversation
                      </p>
                    </div>
                  ) : (
                    currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          maxWidth: "70%",
                          alignSelf:
                            msg.from === "me" ? "flex-end" : "flex-start",
                          alignItems:
                            msg.from === "me" ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 14px",
                            borderRadius:
                              msg.from === "me"
                                ? "18px 18px 3px 18px"
                                : "18px 18px 18px 3px",
                            fontSize: 13.5,
                            lineHeight: 1.55,
                            background:
                              msg.from === "me" ? "#c9a961" : "#2d3139",
                            color: msg.from === "me" ? "#1a1d24" : "#c4d5e0",
                            fontWeight: msg.from === "me" ? 500 : 400,
                          }}
                        >
                          {msg.attachment?.url && (
                            <a
                              href={msg.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "block",
                                marginBottom: 4,
                                textDecoration: "underline",
                                color:
                                  msg.from === "me" ? "#1a1d24" : "#c9a961",
                              }}
                            >
                              {msg.attachment.name || "Open attachment"}
                            </a>
                          )}
                          {msg.text}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 4,
                          }}
                        >
                          <span style={{ fontSize: 10.5, color: "#3a4e5e" }}>
                            {msg.time}
                          </span>
                          {msg.from === "me" &&
                            (msg.read ? (
                              <CheckCheck
                                size={12}
                                style={{ color: "#c9a961" }}
                              />
                            ) : (
                              <Check size={12} style={{ color: "#3a4e5e" }} />
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* ── File attachment preview ── */}
                {selectedFile && (
                  <div
                    style={{
                      padding: "0 16px 6px",
                      fontSize: 11.5,
                      color: "#8ba390",
                      background: "#1a1d24",
                      flexShrink: 0,
                    }}
                  >
                    Attached: {selectedFile.name} (
                    {formatBytes(selectedFile.size)}){" "}
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      style={{
                        color: "#c9a961",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* ── Input bar ──
                    sticky + bottom:0 keeps the bar glued to the bottom
                    of the flex container. Since the container uses
                    100dvh (dynamic viewport), it naturally shrinks when
                    the soft keyboard appears — the bar rises with the
                    keyboard without any JS intervention needed.
                ── */}
                <div className="msg-input-bar">
                  {/* Attach file */}
                  <button
                    type="button"
                    className="msg-attach"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach file"
                  >
                    <Paperclip size={17} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setSelectedFile(f);
                      e.target.value = "";
                    }}
                  />

                  {/* Message input — auto-focused when chat opens */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      setInputFocused(true);
                      /* Extra scroll-to-bottom after keyboard is fully up */
                      setTimeout(scrollToBottom, 250);
                    }}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Type your message…"
                    className="msg-input"
                    autoComplete="off"
                    enterKeyHint="send" /* shows "Send" on mobile keyboard */
                  />

                  {/* Send */}
                  <button
                    className="msg-send"
                    onClick={handleSend}
                    disabled={!input.trim() && !selectedFile}
                    aria-label="Send message"
                    style={{
                      background:
                        input.trim() || selectedFile ? "#c9a961" : "#2d3139",
                      color:
                        input.trim() || selectedFile ? "#1a1d24" : "#3a4e5e",
                      cursor:
                        input.trim() || selectedFile
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    <Send size={16} strokeWidth={2.2} />
                  </button>
                </div>
              </>
            ) : (
              /* ── No conversation selected ── */
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    background: "rgba(201,169,97,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search
                    size={24}
                    style={{ color: "rgba(201,169,97,0.35)" }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: "#3a4e5e" }}>
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
