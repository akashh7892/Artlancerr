import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Check,
  CheckCheck,
  Users,
  X,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import HirerSidebar from "./HirerSidebar";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  input: "#22262f",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldBg: "rgba(201,169,97,0.12)",
  goldGlow: "rgba(201,169,97,0.18)",
  text: "#ffffff",
  muted: "#9ca3af",
  selectedBg: "rgba(201,169,97,0.08)",
  msgOut: "#c9a961",
  msgIn: "#2d3139",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INIT_CONVERSATIONS = [
  {
    id: "1",
    artistName: "Alex Rivera",
    artistAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
    artistRole: "Cinematographer",
    lastMessage: "Thank you! I'd love to hear more about the opportunity.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    unread: 1,
    online: true,
    messages: [
      {
        id: "m1",
        senderId: "hirer",
        text: "Hi! We saw your portfolio and are very impressed.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
      {
        id: "m2",
        senderId: "artist",
        text: "Thank you! I'd love to hear more about the opportunity.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: false,
      },
    ],
  },
  {
    id: "2",
    artistName: "Maya Chen",
    artistAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop",
    artistRole: "Actress",
    lastMessage: "I'm available for auditions next week",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: 0,
    online: true,
    messages: [
      {
        id: "m3",
        senderId: "hirer",
        text: "Hey Maya, we're casting for a short film. Are you available?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
      },
      {
        id: "m4",
        senderId: "artist",
        text: "I'm available for auditions next week",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true,
      },
    ],
  },
  {
    id: "3",
    artistName: "Jordan Miles",
    artistAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop",
    artistRole: "Videographer",
    lastMessage: "Sounds great! When do we start?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 0,
    online: false,
    messages: [
      {
        id: "m5",
        senderId: "hirer",
        text: "We'd love to have you on our next project!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
        read: true,
      },
      {
        id: "m6",
        senderId: "artist",
        text: "Sounds great! When do we start?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
      },
    ],
  },
  {
    id: "4",
    artistName: "Emma Chen",
    artistAvatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&fit=crop",
    artistRole: "Makeup Artist",
    lastMessage: "I can do special effects and period looks.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: 2,
    online: false,
    messages: [
      {
        id: "m7",
        senderId: "artist",
        text: "I can do special effects and period looks.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: false,
      },
      {
        id: "m8",
        senderId: "artist",
        text: "My portfolio has examples from 3 major film sets.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        read: false,
      },
    ],
  },
];

// ─── Format timestamp ─────────────────────────────────────────────────────────
function formatTime(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatMsgTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Avatar with fallback ─────────────────────────────────────────────────────
function Avatar({ src, alt, size = 40, online }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {err ? (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: C.input,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Users size={size * 0.4} color={C.muted} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setErr(true)}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      {online !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: "1px",
            right: "1px",
            width: size * 0.27,
            height: size * 0.27,
            borderRadius: "50%",
            background: online ? "#4ade80" : C.muted,
            border: `2px solid ${C.bg}`,
          }}
        />
      )}
    </div>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────
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
        transition: "background 0.15s",
        marginBottom: "4px",
      }}
    >
      <Avatar
        src={conv.artistAvatar}
        alt={conv.artistName}
        size={44}
        online={conv.online}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "3px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: conv.unread > 0 ? "700" : "600",
              color: C.text,
            }}
          >
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
        <p style={{ margin: "0 0 3px", fontSize: "11px", color: C.muted }}>
          {conv.artistRole}
        </p>
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
            {conv.lastMessage}
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

// ─── Message bubble ───────────────────────────────────────────────────────────
function MsgBubble({ msg, isOut }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
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
          borderRadius: isOut ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
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
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HirerMessages() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [conversations, setConversations] = useState(() => {
    // If navigated with an artist, auto-start a conversation
    if (state?.artist) {
      const exists = INIT_CONVERSATIONS.find(
        (c) => c.artistName === state.artist.name,
      );
      if (exists) return INIT_CONVERSATIONS;
      const newConv = {
        id: String(Date.now()),
        artistName: state.artist.name,
        artistAvatar: state.artist.photo || "",
        artistRole: state.artist.role,
        lastMessage: "Start a conversation...",
        timestamp: new Date(),
        unread: 0,
        online: state.artist.available || false,
        messages: [],
      };
      return [newConv, ...INIT_CONVERSATIONS];
    }
    return INIT_CONVERSATIONS;
  });

  const [selected, setSelected] = useState(() => {
    if (state?.artist) {
      return (
        conversations.find((c) => c.artistName === state.artist.name) ||
        conversations[0]
      );
    }
    return conversations[0];
  });

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const filteredConvs = conversations.filter((c) =>
    c.artistName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectConv = (conv) => {
    // Mark unread as read
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              unread: 0,
              messages: c.messages.map((m) => ({ ...m, read: true })),
            }
          : c,
      ),
    );
    setSelected({
      ...conv,
      unread: 0,
      messages: conv.messages.map((m) => ({ ...m, read: true })),
    });
    setMobileShowThread(true);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selected) return;
    const newMsg = {
      id: String(Date.now()),
      senderId: "hirer",
      text: messageText.trim(),
      timestamp: new Date(),
      read: false,
    };
    const updatedConvs = conversations.map((c) => {
      if (c.id !== selected.id) return c;
      return {
        ...c,
        messages: [...c.messages, newMsg],
        lastMessage: newMsg.text,
        timestamp: newMsg.timestamp,
      };
    });
    setConversations(updatedConvs);
    setSelected((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: newMsg.text,
    }));
    setMessageText("");
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
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <HirerSidebar />

      <div
        className="flex-1 flex flex-col lg:ml-72"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* Page Header */}
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
          {/* Mobile back from thread */}
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
          {/* Desktop back nav */}
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
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.card)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <ArrowLeft size={17} />
          </motion.button>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(18px, 2.5vw, 22px)",
                fontWeight: "700",
                color: C.text,
              }}
            >
              Messages
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: C.muted }}>
              Connect with talented artists
            </p>
          </div>
        </div>

        {/* Main 2-pane layout */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* ── Conversation List ─────────────────────────── */}
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
            {/* Search */}
            <div
              style={{
                padding: "12px 14px",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: "11px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: searchFocused ? C.gold : C.muted,
                    transition: "color 0.2s",
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
                    boxShadow: searchFocused
                      ? `0 0 0 2px ${C.goldGlow}`
                      : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
              {filteredConvs.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: C.muted,
                    fontSize: "13px",
                    marginTop: "32px",
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
                    onClick={() => selectConv(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── Chat Thread ───────────────────────────────── */}
          <div
            className={mobileShowThread ? "flex" : "hidden lg:flex"}
            style={{
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {selected ? (
              <>
                {/* Thread header */}
                <div
                  style={{
                    padding: "14px clamp(16px, 2.5vw, 24px)",
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    background: C.bg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar
                      src={selected.artistAvatar}
                      alt={selected.artistName}
                      size={38}
                      online={selected.online}
                    />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: "700",
                          color: C.text,
                        }}
                      >
                        {selected.artistName}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: selected.online ? "#4ade80" : C.muted,
                        }}
                      >
                        {selected.online ? "Online" : selected.artistRole}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[Phone, Video, Info].map((Icon, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "8px",
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          borderRadius: "8px",
                          color: C.muted,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          transition: "border-color 0.2s, color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = C.gold;
                          e.currentTarget.style.color = C.gold;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = C.border;
                          e.currentTarget.style.color = C.muted;
                        }}
                      >
                        <Icon size={15} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Messages area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px clamp(16px, 2.5vw, 28px)",
                  }}
                >
                  {selected.messages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px" }}>
                      <Avatar
                        src={selected.artistAvatar}
                        alt={selected.artistName}
                        size={64}
                      />
                      <p
                        style={{
                          margin: "16px 0 6px",
                          fontSize: "15px",
                          fontWeight: "700",
                          color: C.text,
                        }}
                      >
                        {selected.artistName}
                      </p>
                      <p
                        style={{ margin: 0, fontSize: "13px", color: C.muted }}
                      >
                        Start a conversation
                      </p>
                    </div>
                  ) : (
                    selected.messages.map((msg) => (
                      <MsgBubble
                        key={msg.id}
                        msg={msg}
                        isOut={msg.senderId === "hirer"}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div
                  style={{
                    padding: "12px clamp(14px, 2.5vw, 22px)",
                    borderTop: `1px solid ${C.border}`,
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                    flexShrink: 0,
                    background: C.bg,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "10px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: "10px",
                      color: C.muted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.gold;
                      e.currentTarget.style.color = C.gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.color = C.muted;
                    }}
                  >
                    <Paperclip size={16} />
                  </motion.button>

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
                      boxShadow: inputFocused
                        ? `0 0 0 2px ${C.goldGlow}`
                        : "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      maxHeight: "120px",
                      overflowY: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />

                  <motion.button
                    whileHover={messageText.trim() ? { scale: 1.06 } : {}}
                    whileTap={messageText.trim() ? { scale: 0.95 } : {}}
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    style={{
                      padding: "10px 14px",
                      background: messageText.trim()
                        ? `linear-gradient(135deg, ${C.gold}, #a8863d)`
                        : "rgba(255,255,255,0.06)",
                      border: "none",
                      borderRadius: "10px",
                      color: messageText.trim() ? "#1a1d24" : C.muted,
                      cursor: messageText.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.muted,
                  fontSize: "14px",
                }}
              >
                <Users
                  size={48}
                  color={C.muted}
                  style={{ opacity: 0.4, marginBottom: "14px" }}
                />
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #6b7280; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.18); border-radius: 3px; }
      `}</style>
    </div>
  );
}
