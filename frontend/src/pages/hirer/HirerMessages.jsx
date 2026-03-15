import { motion } from "motion/react";
import {
  ArrowLeft,
  Send,
  Search,
  Paperclip,
  Check,
  CheckCheck,
  Users,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { getToken, getUser, messagesAPI, uploadFile } from "../../services/api";
import { connectSocket } from "../../socket";

/* ─── Design tokens (same as HirerDashboard) ───────────────────────────── */
const C = {
  bg: "#191d25",
  card: "#22252e",
  cardAlt: "#1e2230",
  border: "rgba(201,169,97,0.12)",
  borderHover: "rgba(201,169,97,0.28)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldBg: "rgba(201,169,97,0.10)",
  text: "#e8e4d8",
  muted: "#5a6e7d",
  sub: "#7a8fa0",
  selectedBg: "rgba(201,169,97,0.07)",
};

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const formatTime = (date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};
const formatMsgTime = (d) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatBytes = (b) => {
  const v = Number(b);
  if (!v || isNaN(v)) return "";
  if (v < 1024) return `${v} B`;
  if (v < 1048576) return `${(v / 1024).toFixed(1)} KB`;
  return `${(v / 1048576).toFixed(1)} MB`;
};
const toInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ title, size = 40, src }) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <img
        src={src}
        alt={title}
        onError={() => setErr(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: `1.5px solid ${C.border}`,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg,rgba(201,169,97,0.18),rgba(201,169,97,0.06))`,
        border: `1.5px solid ${C.border}`,
        color: C.gold,
        fontWeight: 700,
        fontSize: size * 0.38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {title}
    </div>
  );
}

/* ─── Conversation list item ─────────────────────────────────────────────── */
function ConvItem({ conv, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="hm-conv-item"
      style={{
        background: selected ? C.selectedBg : "transparent",
        border: `1px solid ${selected ? C.border : "transparent"}`,
      }}
    >
      <Avatar title={conv.initials} size={44} src={conv.avatar} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: C.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "calc(100% - 40px)",
            }}
          >
            {conv.artistName}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: C.muted,
              flexShrink: 0,
              marginLeft: 6,
            }}
          >
            {formatTime(conv.timestamp)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              color: conv.unread > 0 ? C.text : C.muted,
              fontWeight: conv.unread > 0 ? "600" : "400",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "calc(100% - 28px)",
            }}
          >
            {conv.lastMessage || "Start a conversation"}
          </p>
          {conv.unread > 0 && (
            <span
              style={{
                minWidth: 18,
                height: 18,
                background: C.gold,
                color: "#1a1e26",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
                flexShrink: 0,
                marginLeft: 6,
              }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function HirerMessages() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const threadRef = useRef(null);
  const currentUser = getUser();
  const currentUserId = currentUser?._id;

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messagesByConv, setMessagesByConv] = useState({});
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  /* ── Scroll to bottom ── */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [selectedId, messagesByConv]);

  /* ── Load conversations ── */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await messagesAPI.getConversations();
        if (!mounted) return;
        const mapped = data.map((item) => ({
          id: item.user?._id,
          artistName: item.user?.name || "Unknown",
          initials: toInitials(item.user?.name),
          avatar: item.user?.avatar || item.user?.photo || "",
          lastMessage: item.lastMessage?.content || "",
          timestamp: new Date(item.lastMessage?.createdAt || Date.now()),
          unread: item.unreadCount || 0,
        }));

        const fromStateId = state?.artist?._id || state?.artist?.id;
        if (fromStateId && !mapped.find((c) => c.id === fromStateId)) {
          mapped.unshift({
            id: fromStateId,
            artistName: state?.artist?.name || "New artist",
            initials: toInitials(state?.artist?.name),
            avatar: state?.artist?.avatar || "",
            lastMessage: "",
            timestamp: new Date(),
            unread: 0,
          });
        }
        setConversations(mapped);
        setSelectedId((prev) => prev || fromStateId || mapped[0]?.id || null);

        /* If opened from another page with a userId param, open thread immediately */
        if (fromStateId) setMobileShowThread(true);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [state]);

  /* ── Load thread ── */
  useEffect(() => {
    if (!selectedId || !currentUserId) return;
    let mounted = true;
    (async () => {
      try {
        const data = await messagesAPI.getThread(selectedId);
        if (!mounted) return;
        setMessagesByConv((prev) => ({
          ...prev,
          [selectedId]: data.map((m) => ({
            id: m._id,
            senderId: m.sender?._id === currentUserId ? "hirer" : "artist",
            text: m.content,
            attachment: m.attachment || null,
            timestamp: new Date(m.createdAt),
            read: Boolean(m.isRead),
          })),
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

  /* ── Socket ── */
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
        if (list.some((i) => i.id === msg._id)) return prev;
        return {
          ...prev,
          [otherId]: [
            ...list,
            {
              id: msg._id,
              senderId: senderId === currentUserId ? "hirer" : "artist",
              text: msg.content,
              attachment: msg.attachment || null,
              timestamp: new Date(msg.createdAt),
              read: Boolean(msg.isRead),
            },
          ],
        };
      });

      setConversations((prev) => {
        const exists = prev.find((c) => c.id === otherId);
        const meSent = senderId === currentUserId;
        const unreadInc = !meSent && selectedId !== otherId ? 1 : 0;
        const name = meSent ? msg.receiver?.name : msg.sender?.name;
        if (!exists)
          return [
            {
              id: otherId,
              artistName: name || "Unknown",
              initials: toInitials(name),
              avatar: "",
              lastMessage: msg.content,
              timestamp: new Date(msg.createdAt),
              unread: unreadInc,
            },
            ...prev,
          ];
        return [
          {
            ...exists,
            lastMessage: msg.content,
            timestamp: new Date(msg.createdAt),
            unread: exists.unread + unreadInc,
          },
          ...prev.filter((c) => c.id !== otherId),
        ];
      });
    };

    const onRead = ({ conversationWith, readBy }) => {
      if (readBy === currentUserId || selectedId !== conversationWith) return;
      setMessagesByConv((prev) => ({
        ...prev,
        [conversationWith]: (prev[conversationWith] || []).map((m) =>
          m.senderId === "hirer" ? { ...m, read: true } : m,
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

  /* ── Keyboard-aware: scroll thread up when soft keyboard appears ── */
  useEffect(() => {
    if (!mobileShowThread) return;

    const onResize = () => {
      /* visualViewport shrinks when keyboard opens */
      scrollToBottom();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
      return () =>
        window.visualViewport.removeEventListener("resize", onResize);
    }
  }, [mobileShowThread]);

  /* ── Auto-focus input when thread opens on mobile ── */
  useEffect(() => {
    if (mobileShowThread && selectedId) {
      /* slight delay to let layout settle before focusing */
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [mobileShowThread, selectedId]);

  const filteredConvs = conversations.filter((c) =>
    c.artistName.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId),
    [conversations, selectedId],
  );
  const currentMessages = messagesByConv[selectedId] || [];

  const selectConv = (id) => {
    setSelectedId(id);
    setMobileShowThread(true);
  };

  const sendMessage = async () => {
    const content = messageText.trim();
    if ((!content && !selectedFile) || !selectedId) return;
    setMessageText("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
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
      setMessageText(content);
      setSelectedFile(fileToSend);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* Whether to hide the global FAB — hide it when a chat thread is open */
  const hideFab = mobileShowThread && selectedId;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        /* ── Root ── */
        .hm-root {
          display: flex;
          min-height: 100dvh;
          background: ${C.bg};
          font-family: 'Plus Jakarta Sans','Inter','Segoe UI',sans-serif;
        }

        /* ── Main area ── */
        .hm-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100dvh;
          overflow: hidden;
          /* On desktop: offset for the fixed sidebar */
          margin-left: 0;
        }
        @media (min-width: 1024px) { .hm-main { margin-left: 242px; } }

        /* ── Top bar ── */
        .hm-topbar {
          padding: 14px clamp(14px, 3vw, 24px);
          border-bottom: 1px solid ${C.border};
          background: ${C.bg};
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          /* On mobile: give room for the hamburger button top-left */
          padding-top: 56px;
        }
        @media (min-width: 640px)  { .hm-topbar { padding-top: 18px; } }
        @media (min-width: 1024px) { .hm-topbar { padding-top: 18px; } }

        /* ── Body row (list + thread) ── */
        .hm-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          /* Mobile: full height for chat, use visual viewport */
          height: 0;
        }

        /* ── Conversation list panel ── */
        .hm-list {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid ${C.border};
          background: ${C.bg};
          overflow: hidden;
        }
        /* Desktop: fixed width side panel */
        @media (min-width: 768px) {
          .hm-list {
            width: clamp(240px, 28%, 300px);
          }
        }
        /* Mobile: hide when thread is open */
        .hm-list.hm-hidden-mobile { display: none; }
        @media (min-width: 768px) { .hm-list.hm-hidden-mobile { display: flex; } }

        /* ── Thread panel ── */
        .hm-thread {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
          /* Use visual viewport height so keyboard doesn't overlap input */
          height: 100%;
        }
        .hm-thread.hm-hidden-mobile { display: none; }
        @media (min-width: 768px) { .hm-thread.hm-hidden-mobile { display: flex; } }

        /* ── Message scroll area ── */
        .hm-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px clamp(14px, 2.5vw, 24px);
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* ── Input bar ── */
        .hm-input-bar {
          padding: 10px clamp(12px, 2vw, 20px);
          border-top: 1px solid ${C.border};
          display: flex;
          gap: 7px;
          align-items: flex-end;
          flex-shrink: 0;
          background: ${C.bg};
          /* Stick to bottom above keyboard */
          position: sticky;
          bottom: 0;
        }

        /* ── Conv item ── */
        .hm-conv-item {
          width: 100%;
          padding: 11px 12px;
          display: flex;
          gap: 11px;
          align-items: flex-start;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          margin-bottom: 3px;
          outline: none;
          transition: background 0.15s;
        }
        .hm-conv-item:hover { background: ${C.selectedBg} !important; }

        /* ── Scrollbars ── */
        .hm-scroll::-webkit-scrollbar { width: 3px; }
        .hm-scroll::-webkit-scrollbar-track { background: transparent; }
        .hm-scroll::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.18); border-radius: 4px; }

        /* ── FAB override: hide when thread is open on mobile ── */
        .hm-hide-fab .sb-fab,
        .hm-hide-fab .hs-fab { display: none !important; }

        /* ── Back button ── */
        .hm-back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 9px;
          border: 1px solid ${C.border};
          background: transparent;
          color: ${C.text};
          cursor: pointer;
          outline: none;
          flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
        }
        .hm-back-btn:hover { border-color: ${C.gold}; background: ${C.goldBg}; }

        /* ── Input field ── */
        .hm-textarea {
          flex: 1;
          padding: 10px 13px;
          background: ${C.card};
          border: 1px solid ${C.border};
          border-radius: 11px;
          color: ${C.text};
          font-size: 13.5px;
          outline: none;
          resize: none;
          line-height: 1.5;
          font-family: 'Plus Jakarta Sans',sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          max-height: 120px;
        }
        .hm-textarea:focus { border-color: ${C.gold}; box-shadow: 0 0 0 2px ${C.goldGlow}; }
        .hm-textarea::placeholder { color: ${C.muted}; }

        /* ── Send button ── */
        .hm-send {
          padding: 10px 13px;
          border: none;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .hm-send:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
        .hm-send:disabled { cursor: not-allowed; }

        /* ── Attach button ── */
        .hm-attach {
          padding: 10px;
          background: transparent;
          border: 1px solid ${C.border};
          border-radius: 10px;
          color: ${C.muted};
          display: flex;
          align-items: center;
          cursor: pointer;
          outline: none;
          flex-shrink: 0;
          transition: border-color 0.15s, color 0.15s;
        }
        .hm-attach:hover { border-color: ${C.gold}; color: ${C.gold}; }

        /* ── Search input ── */
        .hm-search {
          width: 100%;
          padding: 9px 12px 9px 33px;
          background: ${C.card};
          border: 1px solid ${C.border};
          border-radius: 9px;
          color: ${C.text};
          font-size: 13px;
          outline: none;
          font-family: 'Plus Jakarta Sans',sans-serif;
          transition: border-color 0.15s;
        }
        .hm-search:focus { border-color: ${C.gold}; }
        .hm-search::placeholder { color: ${C.muted}; }
      `}</style>

      {/* Wrapper — adds class to hide FAB when thread is open */}
      <div className={`hm-root${hideFab ? " hm-hide-fab" : ""}`}>
        <HirerSidebar />

        <div className="hm-main">
          {/* ── Top bar ── */}
          <div className="hm-topbar">
            {/* Back button: on mobile shows when thread is open */}
            {mobileShowThread && (
              <button
                className="hm-back-btn md:hidden"
                onClick={() => setMobileShowThread(false)}
              >
                <ArrowLeft size={17} />
              </button>
            )}
            {/* Desktop back to browse */}
            <button
              className="hm-back-btn hidden lg:flex"
              onClick={() => navigate("/hirer/browse-artists")}
            >
              <ArrowLeft size={17} />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(17px,3.5vw,21px)",
                  fontWeight: 700,
                  color: C.text,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                {mobileShowThread && selected
                  ? selected.artistName
                  : "Messages"}
              </h1>
              {(!mobileShowThread || !selected) && (
                <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>
                  Connect with talented artists
                </p>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="hm-body">
            {/* ── Conversation list ── */}
            <div
              className={`hm-list${mobileShowThread ? " hm-hidden-mobile" : ""}`}
            >
              {/* Search */}
              <div
                style={{
                  padding: "11px 11px",
                  borderBottom: `1px solid ${C.border}`,
                  flexShrink: 0,
                }}
              >
                <div style={{ position: "relative" }}>
                  <Search
                    size={14}
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: searchFocused ? C.gold : C.muted,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search conversations..."
                    className="hm-search"
                  />
                </div>
              </div>

              {/* List */}
              <div
                className="hm-scroll"
                style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}
              >
                {filteredConvs.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: C.muted,
                      fontSize: 13,
                      marginTop: 32,
                    }}
                  >
                    No conversations found
                  </p>
                ) : (
                  filteredConvs.map((conv) => (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      selected={selected?.id === conv.id}
                      onClick={() => selectConv(conv.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── Chat thread ── */}
            <div
              className={`hm-thread${!mobileShowThread ? " hm-hidden-mobile" : ""}`}
            >
              {selected ? (
                <>
                  {/* Thread header */}
                  <div
                    style={{
                      padding: "12px clamp(14px,2.5vw,22px)",
                      borderBottom: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      flexShrink: 0,
                    }}
                  >
                    <Avatar
                      title={selected.initials}
                      size={36}
                      src={selected.avatar}
                    />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {selected.artistName}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={threadRef} className="hm-messages hm-scroll">
                    {currentMessages.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "48px 20px",
                          color: C.muted,
                        }}
                      >
                        <Users
                          size={40}
                          style={{
                            opacity: 0.25,
                            marginBottom: 12,
                            display: "block",
                            margin: "0 auto 12px",
                          }}
                        />
                        <p style={{ margin: 0, fontSize: 13 }}>
                          Start a conversation
                        </p>
                      </div>
                    ) : (
                      currentMessages.map((msg) => {
                        const isOut = msg.senderId === "hirer";
                        return (
                          <div
                            key={msg.id}
                            style={{
                              display: "flex",
                              justifyContent: isOut ? "flex-end" : "flex-start",
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "72%",
                                padding: "10px 13px",
                                borderRadius: isOut
                                  ? "16px 16px 3px 16px"
                                  : "16px 16px 16px 3px",
                                background: isOut
                                  ? `linear-gradient(135deg,${C.gold},#a8863d)`
                                  : C.card,
                                border: isOut
                                  ? "none"
                                  : `1px solid ${C.border}`,
                              }}
                            >
                              <p
                                style={{
                                  margin: "0 0 4px",
                                  fontSize: 13.5,
                                  lineHeight: 1.5,
                                  color: isOut ? "#1a1e26" : C.text,
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
                                      color: isOut ? "#1a1e26" : C.gold,
                                    }}
                                  >
                                    {msg.attachment.name || "Open attachment"}
                                  </a>
                                )}
                                {msg.text}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    color: isOut
                                      ? "rgba(26,29,36,0.6)"
                                      : C.muted,
                                  }}
                                >
                                  {formatMsgTime(msg.timestamp)}
                                </span>
                                {isOut &&
                                  (msg.read ? (
                                    <CheckCheck
                                      size={11}
                                      color="rgba(26,29,36,0.7)"
                                    />
                                  ) : (
                                    <Check
                                      size={11}
                                      color="rgba(26,29,36,0.7)"
                                    />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Attached file preview */}
                  {selectedFile && (
                    <div
                      style={{
                        padding: "0 16px 6px",
                        color: C.muted,
                        fontSize: 11.5,
                        background: C.bg,
                        flexShrink: 0,
                      }}
                    >
                      Attached: {selectedFile.name} (
                      {formatBytes(selectedFile.size)}){" "}
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        style={{
                          color: C.gold,
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

                  {/* ── Input bar — keyboard-aware via sticky bottom ── */}
                  <div className="hm-input-bar">
                    <button
                      type="button"
                      className="hm-attach"
                      onClick={() =>
                        document.getElementById("hm-file-input")?.click()
                      }
                    >
                      <Paperclip size={16} />
                    </button>
                    <input
                      id="hm-file-input"
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setSelectedFile(f);
                        e.target.value = "";
                      }}
                    />

                    <textarea
                      ref={inputRef}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        /* Auto-grow */
                        e.target.style.height = "auto";
                        e.target.style.height =
                          Math.min(e.target.scrollHeight, 120) + "px";
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        setInputFocused(true);
                        /* Scroll to bottom when keyboard opens */
                        setTimeout(scrollToBottom, 200);
                      }}
                      onBlur={() => setInputFocused(false)}
                      placeholder="Type your message…"
                      rows={1}
                      className="hm-textarea"
                    />

                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim() && !selectedFile}
                      className="hm-send"
                      style={{
                        background:
                          messageText.trim() || selectedFile
                            ? `linear-gradient(135deg,${C.gold},#a8863d)`
                            : "rgba(255,255,255,0.06)",
                        color:
                          messageText.trim() || selectedFile
                            ? "#1a1e26"
                            : C.muted,
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.muted,
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <Users size={36} style={{ opacity: 0.2 }} />
                  <p style={{ margin: 0, fontSize: 13.5 }}>
                    Select a conversation to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
