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

const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  text: "#ffffff",
  muted: "#9ca3af",
  selectedBg: "rgba(201,169,97,0.08)",
};

const formatTime = (date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatMsgTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return "";
  const val = Number(bytes);
  if (val < 1024) return `${val} B`;
  if (val < 1024 * 1024) return `${(val / 1024).toFixed(1)} KB`;
  return `${(val / (1024 * 1024)).toFixed(1)} MB`;
};

const toInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

function Avatar({ title, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.gold,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {title}
    </div>
  );
}

function ConvItem({ conv, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 3 }}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 14px",
        display: "flex",
        gap: "11px",
        alignItems: "flex-start",
        background: selected ? C.selectedBg : "transparent",
        border: `1px solid ${selected ? C.border : "transparent"}`,
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: "4px",
      }}
    >
      <Avatar title={conv.initials} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "3px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>
            {conv.artistName}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: C.muted,
              flexShrink: 0,
              marginLeft: "6px",
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
              fontSize: "12px",
              color: conv.unread > 0 ? C.text : C.muted,
              fontWeight: conv.unread > 0 ? "600" : "400",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "160px",
            }}
          >
            {conv.lastMessage || "Start a conversation"}
          </p>
          {conv.unread > 0 && (
            <span
              style={{
                minWidth: "18px",
                height: "18px",
                background: C.gold,
                color: "#1a1d24",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
                flexShrink: 0,
                marginLeft: "6px",
              }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function HirerMessages() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, messagesByConv]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await messagesAPI.getConversations();
        if (!mounted) return;

        const mapped = data.map((item) => ({
          id: item.user?._id,
          artistName: item.user?.name || "Unknown user",
          initials: toInitials(item.user?.name),
          lastMessage: item.lastMessage?.content || "",
          timestamp: new Date(item.lastMessage?.createdAt || Date.now()),
          unread: item.unreadCount || 0,
        }));

        const fromStateId = state?.artist?._id || state?.artist?.id;
        const existing = mapped.find((c) => c.id === fromStateId);
        if (fromStateId && !existing) {
          mapped.unshift({
            id: fromStateId,
            artistName: state?.artist?.name || "New artist",
            initials: toInitials(state?.artist?.name),
            lastMessage: "",
            timestamp: new Date(),
            unread: 0,
          });
        }

        setConversations(mapped);
        setSelectedId((prev) => prev || fromStateId || mapped[0]?.id || null);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [state]);

  useEffect(() => {
    if (!selectedId || !currentUserId) return;
    let mounted = true;
    const loadThread = async () => {
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
        if (list.some((item) => item.id === msg._id)) return prev;
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

        if (!exists) {
          return [
            {
              id: otherId,
              artistName: name || "Unknown user",
              initials: toInitials(name),
              lastMessage: msg.content,
              timestamp: new Date(msg.createdAt),
              unread: unreadInc,
            },
            ...prev,
          ];
        }

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

    const onMessagesRead = ({ conversationWith, readBy }) => {
      if (readBy === currentUserId || selectedId !== conversationWith) return;
      setMessagesByConv((prev) => ({
        ...prev,
        [conversationWith]: (prev[conversationWith] || []).map((m) =>
          m.senderId === "hirer" ? { ...m, read: true } : m,
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

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: C.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      <HirerSidebar />
      <div
        className="flex-1 flex flex-col lg:ml-72"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          style={{
            padding: "18px clamp(16px, 3vw, 28px)",
            borderBottom: `1px solid ${C.border}`,
            background: C.bg,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {mobileShowThread && (
            <button
              className="lg:hidden"
              onClick={() => setMobileShowThread(false)}
              style={{
                background: "transparent",
                border: "none",
                color: C.text,
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/hirer/browse-artists")}
            className="hidden lg:flex"
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.text,
              cursor: "pointer",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={17} />
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: "700", color: C.text }}>
              Messages
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: C.muted }}>
              Connect with talented artists
            </p>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div
            className={mobileShowThread ? "hidden lg:flex" : "flex"}
            style={{
              width: "clamp(260px, 30%, 320px)",
              flexShrink: 0,
              flexDirection: "column",
              borderRight: `1px solid ${C.border}`,
              background: C.bg,
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: "11px",
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
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 32px",
                    background: C.card,
                    border: `1px solid ${searchFocused ? C.gold : C.border}`,
                    borderRadius: "9px",
                    color: C.text,
                    fontSize: "13px",
                    outline: "none",
                    boxShadow: searchFocused ? `0 0 0 2px ${C.goldGlow}` : "none",
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
              {filteredConvs.length === 0 ? (
                <p style={{ textAlign: "center", color: C.muted, fontSize: "13px", marginTop: "32px" }}>
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

          <div
            className={mobileShowThread ? "flex" : "hidden lg:flex"}
            style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}
          >
            {selected ? (
              <>
                <div
                  style={{
                    padding: "14px clamp(16px, 2.5vw, 24px)",
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <Avatar title={selected.initials} size={38} />
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: C.text }}>
                      {selected.artistName}
                    </p>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "20px clamp(16px, 2.5vw, 28px)" }}>
                  {currentMessages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted }}>
                      <Users size={48} style={{ opacity: 0.4, marginBottom: "14px" }} />
                      Start a conversation
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
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "72%",
                              padding: "10px 14px",
                              borderRadius: isOut
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                              background: isOut
                                ? `linear-gradient(135deg, ${C.gold}, #a8863d)`
                                : C.card,
                              border: isOut ? "none" : `1px solid ${C.border}`,
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 5px",
                                fontSize: "13px",
                                lineHeight: "1.5",
                                color: isOut ? "#1a1d24" : C.text,
                              }}
                            >
                              {msg.attachment?.url && (
                                <a
                                  href={msg.attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "block",
                                    marginBottom: "4px",
                                    textDecoration: "underline",
                                    color: isOut ? "#1a1d24" : C.gold,
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
                                gap: "3px",
                                justifyContent: "flex-end",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: isOut ? "rgba(26,29,36,0.65)" : C.muted,
                                }}
                              >
                                {formatMsgTime(msg.timestamp)}
                              </span>
                              {isOut &&
                                (msg.read ? (
                                  <CheckCheck size={11} color="rgba(26,29,36,0.7)" />
                                ) : (
                                  <Check size={11} color="rgba(26,29,36,0.7)" />
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div
                  style={{
                    padding: "12px clamp(14px, 2.5vw, 22px)",
                    borderTop: `1px solid ${C.border}`,
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => document.getElementById("hirer-chat-file-input")?.click()}
                    style={{
                      padding: "10px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: "10px",
                      color: C.muted,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Paperclip size={16} />
                  </button>
                  <input
                    id="hirer-chat-file-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                      e.target.value = "";
                    }}
                  />
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Type your message..."
                    rows={1}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      background: C.card,
                      border: `1px solid ${inputFocused ? C.gold : C.border}`,
                      borderRadius: "10px",
                      color: C.text,
                      fontSize: "13px",
                      outline: "none",
                      resize: "none",
                      lineHeight: "1.5",
                      boxShadow: inputFocused ? `0 0 0 2px ${C.goldGlow}` : "none",
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim() && !selectedFile}
                    style={{
                      padding: "10px 14px",
                      background: messageText.trim() || selectedFile
                        ? `linear-gradient(135deg, ${C.gold}, #a8863d)`
                        : "rgba(255,255,255,0.06)",
                      border: "none",
                      borderRadius: "10px",
                      color: messageText.trim() || selectedFile ? "#1a1d24" : C.muted,
                      cursor: messageText.trim() || selectedFile ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
                {selectedFile && (
                  <div
                    style={{
                      padding: "0 22px 10px",
                      color: C.muted,
                      fontSize: "11.5px",
                    }}
                  >
                    Attached: {selectedFile.name} ({formatBytes(selectedFile.size)}){" "}
                    <button
                      type="button"
                      style={{ color: C.gold, background: "transparent", border: "none", cursor: "pointer" }}
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.muted,
                }}
              >
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
