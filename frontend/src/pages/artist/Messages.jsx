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

const toInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const value = new Date(dateString);
  const diffMs = Date.now() - value.getTime();
  const min = Math.floor(diffMs / 60000);
  const hours = Math.floor(min / 60);
  const days = Math.floor(hours / 24);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return value.toLocaleDateString();
};

const formatMsgTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return "";
  const val = Number(bytes);
  if (val < 1024) return `${val} B`;
  if (val < 1024 * 1024) return `${(val / 1024).toFixed(1)} KB`;
  return `${(val / (1024 * 1024)).toFixed(1)} MB`;
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
  time: formatRelativeTime(item.lastMessage?.createdAt),
  preview: item.lastMessage?.content || "Start a conversation",
  unread: item.unreadCount || 0,
  online: false,
});

export default function Messages() {
  const location = useLocation();
  const currentUser = getUser();
  const currentUserId = currentUser?._id;

  const [conversations, setConversations] = useState([]);
  const [messagesByConv, setMessagesByConv] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadConversations = async () => {
      try {
        const data = await messagesAPI.getConversations();
        if (!mounted) return;
        const mapped = data.map(toConversation);
        setConversations(mapped);

        const urlId = new URLSearchParams(location.search).get("userId");
        const preferred = mapped.find((c) => c.id === urlId)?.id || mapped[0]?.id || null;
        setSelectedId((prev) => prev || preferred);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    loadConversations();
    return () => {
      mounted = false;
    };
  }, [location.search]);

  useEffect(() => {
    if (!selectedId || !currentUserId) return;
    let mounted = true;
    const loadThread = async () => {
      try {
        const data = await messagesAPI.getThread(selectedId);
        if (!mounted) return;

        setMessagesByConv((prev) => ({
          ...prev,
          [selectedId]: data.map((m) => normalizeMessage(m, currentUserId)),
        }));

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedId ? { ...conv, unread: 0 } : conv,
          ),
        );
      } catch (error) {
        console.error("Failed to load thread:", error);
      }
    };

    loadThread();
    return () => {
      mounted = false;
    };
  }, [selectedId, currentUserId]);

  useEffect(() => {
    const token = getToken();
    if (!token || !currentUserId) return;
    const socket = connectSocket(token);

    const onNewMessage = (msg) => {
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
              name: name || "Unknown user",
              avatar: toInitials(name),
              time: formatRelativeTime(msg.createdAt),
              preview: msg.content,
              unread: unreadInc,
              online: false,
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

    const onMessagesRead = ({ conversationWith, readBy }) => {
      if (readBy === currentUserId || conversationWith !== selectedId) return;
      setMessagesByConv((prev) => ({
        ...prev,
        [conversationWith]: (prev[conversationWith] || []).map((msg) =>
          msg.from === "me" ? { ...msg, read: true } : msg,
        ),
      }));
    };

    socket.on("new_message", onNewMessage);
    socket.on("messages_read", onMessagesRead);
    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("messages_read", onMessagesRead);
    };
  }, [currentUserId, selectedId]);

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId),
    [conversations, selectedId],
  );
  const currentMessages = messagesByConv[selectedId] || [];
  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSend = async () => {
    const content = input.trim();
    if ((!content && !selectedFile) || !selectedId) return;
    setInput("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
    try {
      let attachment;
      if (fileToSend) {
        const uploaded = await uploadFile(fileToSend, {
          bucket: "chat-files",
          type: "chat",
          fieldName: "file",
        });
        attachment = {
          url: uploaded.url,
          name: fileToSend.name,
          mimeType: fileToSend.type,
          size: fileToSend.size,
        };
      }

      await messagesAPI.sendMessage({
        receiverId: selectedId,
        content: content || (attachment?.name || "Attachment"),
        attachment,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
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

  const selectConv = (id) => {
    setSelectedId(id);
    setMobileView("chat");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .msg-scrollbar::-webkit-scrollbar { width: 3px; }
        .msg-scrollbar::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.15); border-radius: 4px; }
        .msg-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(201,169,97,0.15) transparent; }
        .conv-item { transition: background 0.15s ease; }
        .conv-item:hover { background: rgba(255,255,255,0.03); }
        .send-btn { transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease; }
        .send-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .input-field:focus { outline: none; border-color: rgba(201,169,97,0.35) !important; }
        .attach-btn { transition: color 0.15s ease; }
        .attach-btn:hover { color: #c9a961 !important; }
      `}</style>

      <Sidebar />

      <div
        className="flex h-screen overflow-hidden lg:ml-[248px]"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: "#1a1d24",
        }}
      >
        <div
          className={`flex flex-col w-full lg:w-[300px] flex-shrink-0 ${mobileView === "chat" ? "hidden lg:flex" : "flex"}`}
          style={{
            borderRight: "1px solid rgba(201,169,97,0.10)",
            background: "#1a1d24",
          }}
        >
          <div className="px-5 pt-7 pb-4 flex-shrink-0">
            <h1
              className="text-[22px] font-bold leading-tight"
              style={{ color: "#c4d5e0" }}
            >
              Messages
            </h1>
            <p className="text-[12px] mt-[3px]" style={{ color: "#5a6e7d" }}>
              Connect with hirers and opportunities
            </p>
          </div>

          <div className="px-4 pb-3 flex-shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#5a6e7d" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="input-field w-full pl-9 pr-4 py-[9px] rounded-xl text-[13px]"
                style={{
                  background: "#2d3139",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#c4d5e0",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto msg-scrollbar">
            {filteredConvs.map((conv) => (
              <div
                key={conv.id}
                className="conv-item flex items-center gap-3 px-4 py-[13px] cursor-pointer"
                style={{
                  background:
                    conv.id === selectedId
                      ? "rgba(201,169,97,0.08)"
                      : "transparent",
                  borderLeft:
                    conv.id === selectedId
                      ? "2px solid #c9a961"
                      : "2px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onClick={() => selectConv(conv.id)}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-bold"
                    style={{ background: "#2d3139", color: "#c9a961" }}
                  >
                    {conv.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-[3px]">
                    <span
                      className="text-[13.5px] font-semibold truncate"
                      style={{
                        color: conv.id === selectedId ? "#c4d5e0" : "#8a9faf",
                      }}
                    >
                      {conv.name}
                    </span>
                    <span
                      className="text-[11px] flex-shrink-0 ml-2"
                      style={{ color: "#3a4e5e" }}
                    >
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[12px] truncate flex-1"
                      style={{ color: "#3a4e5e" }}
                    >
                      {conv.preview}
                    </p>
                    {conv.unread > 0 && (
                      <span
                        className="ml-2 flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "#c9a961", color: "#1a1d24" }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}
          style={{ background: "#1a1d24" }}
        >
          {selected ? (
            <>
              <div
                className="flex items-center gap-3 px-5 py-[14px] flex-shrink-0"
                style={{
                  borderBottom: "1px solid rgba(201,169,97,0.10)",
                  background: "#1a1d24",
                }}
              >
                <button
                  className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg mr-1"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#8a9faf",
                  }}
                  onClick={() => setMobileView("list")}
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold"
                    style={{ background: "#2d3139", color: "#c9a961" }}
                  >
                    {selected.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-[15px] font-semibold leading-tight"
                    style={{ color: "#c4d5e0" }}
                  >
                    {selected.name}
                  </h3>
                  <span className="text-[11.5px]" style={{ color: "#3a4e5e" }}>
                    Offline
                  </span>
                </div>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#5a6e7d",
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto msg-scrollbar px-5 py-5 flex flex-col gap-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[62%] ${msg.from === "me" ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className="px-4 py-[11px] rounded-2xl text-[13.5px] leading-relaxed"
                      style={
                        msg.from === "me"
                          ? {
                              background: "#c9a961",
                              color: "#1a1d24",
                              borderBottomRightRadius: "4px",
                              fontWeight: 500,
                            }
                          : {
                              background: "#2d3139",
                              color: "#c4d5e0",
                              borderBottomLeftRadius: "4px",
                            }
                      }
                    >
                      {msg.attachment?.url && (
                        <a
                          href={msg.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block underline mb-1"
                          style={{
                            color: msg.from === "me" ? "#1a1d24" : "#c9a961",
                          }}
                        >
                          {msg.attachment.name || "Open attachment"}
                        </a>
                      )}
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-[5px]">
                      <span
                        className="text-[10.5px]"
                        style={{ color: "#3a4e5e" }}
                      >
                        {msg.time}
                      </span>
                      {msg.from === "me" &&
                        (msg.read ? (
                          <CheckCheck size={12} style={{ color: "#c9a961" }} />
                        ) : (
                          <Check size={12} style={{ color: "#3a4e5e" }} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                style={{
                  borderTop: "1px solid rgba(201,169,97,0.10)",
                  background: "#1a1d24",
                }}
              >
                <button
                  className="attach-btn flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                  style={{ color: "#5a6e7d" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                    e.target.value = "";
                  }}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="input-field flex-1 px-4 py-[11px] rounded-xl text-[13.5px]"
                  style={{
                    background: "#2d3139",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#c4d5e0",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <button
                  className="send-btn flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{
                    background: input.trim() || selectedFile ? "#c9a961" : "#2d3139",
                    color: input.trim() || selectedFile ? "#1a1d24" : "#3a4e5e",
                  }}
                  onClick={handleSend}
                >
                  <Send size={16} strokeWidth={2.2} />
                </button>
              </div>
              {selectedFile && (
                <div className="px-4 pb-3 text-xs text-[#8ba390]">
                  Attached: {selectedFile.name} ({formatBytes(selectedFile.size)}){" "}
                  <button
                    type="button"
                    className="text-[#c9a961]"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(201,169,97,0.08)" }}
              >
                <Search size={24} style={{ color: "rgba(201,169,97,0.4)" }} />
              </div>
              <p className="text-[14px]" style={{ color: "#3a4e5e" }}>
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
