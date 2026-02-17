import { useState } from "react";
import {
  Search,
  Paperclip,
  Send,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Circle,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Paramount Studios",
    avatar: "PS",
    time: "30m ago",
    preview: "We'd love to discuss the cinematog...",
    unread: 2,
    active: true,
    online: true,
  },
  {
    id: 2,
    name: "Warner Bros",
    avatar: "WB",
    time: "2h ago",
    preview: "When are you available for the shoot",
    unread: 0,
    active: false,
    online: false,
  },
  {
    id: 3,
    name: "Netflix Originals",
    avatar: "NO",
    time: "1d ago",
    preview: "Thanks for the quick response!",
    unread: 0,
    active: false,
    online: true,
  },
  {
    id: 4,
    name: "Disney Production",
    avatar: "DP",
    time: "2d ago",
    preview: "Looking forward to our collaboration",
    unread: 0,
    active: false,
    online: false,
  },
];

const MESSAGES = {
  1: [
    {
      id: 1,
      from: "them",
      text: "Hi! We saw your portfolio and are very impressed.",
      time: "1h ago",
    },
    {
      id: 2,
      from: "me",
      text: "Thank you! I'd love to hear more about the opportunity.",
      time: "45m ago",
      read: true,
    },
    {
      id: 3,
      from: "them",
      text: "We'd love to discuss the cinematography role",
      time: "30m ago",
    },
  ],
  2: [
    {
      id: 1,
      from: "them",
      text: "Hey! We have an exciting project for you.",
      time: "3h ago",
    },
    {
      id: 2,
      from: "me",
      text: "Sounds great, tell me more!",
      time: "2h ago",
      read: true,
    },
    {
      id: 3,
      from: "them",
      text: "When are you available for the shoot",
      time: "2h ago",
    },
  ],
  3: [
    {
      id: 1,
      from: "me",
      text: "I'll send over the files by end of day.",
      time: "1d ago",
      read: true,
    },
    {
      id: 2,
      from: "them",
      text: "Thanks for the quick response!",
      time: "1d ago",
    },
  ],
  4: [
    {
      id: 1,
      from: "them",
      text: "We'd love to work with you on our upcoming series.",
      time: "2d ago",
    },
    {
      id: 2,
      from: "me",
      text: "I'm very interested! Let's set up a call.",
      time: "2d ago",
      read: true,
    },
    {
      id: 3,
      from: "them",
      text: "Looking forward to our collaboration",
      time: "2d ago",
    },
  ],
};

export default function Messages() {
  const [selectedId, setSelectedId] = useState(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  const selected = CONVERSATIONS.find((c) => c.id === selectedId);
  const currentMessages = messages[selectedId] || [];

  const filteredConvs = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: "just now",
      read: false,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInput("");
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
        .send-btn { transition: opacity 0.15s ease, transform 0.15s ease; }
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
        {/* ── Conversation List ── */}
        <div
          className={`flex flex-col w-full lg:w-[300px] lg:flex flex-shrink-0 ${mobileView === "chat" ? "hidden lg:flex" : "flex"}`}
          style={{
            borderRight: "1px solid rgba(201,169,97,0.10)",
            background: "#1a1d24",
          }}
        >
          {/* Header */}
          <div className="px-5 pt-7 pb-4 flex-shrink-0">
            <h1
              className="text-[22px] font-bold leading-tight"
              style={{
                color: "#c4d5e0",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Messages
            </h1>
            <p className="text-[12px] mt-[3px]" style={{ color: "#5a6e7d" }}>
              Connect with hirers and opportunities
            </p>
          </div>

          {/* Search */}
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

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto msg-scrollbar">
            {filteredConvs.map((conv) => (
              <div
                key={conv.id}
                className="conv-item flex items-center gap-3 px-4 py-[13px] cursor-pointer relative"
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
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-bold"
                    style={{ background: "#2d3139", color: "#c9a961" }}
                  >
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: "#4ade80", borderColor: "#1a1d24" }}
                    />
                  )}
                </div>

                {/* Info */}
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

        {/* ── Chat Area ── */}
        <div
          className={`flex flex-col flex-1 min-w-0 ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}
          style={{ background: "#1a1d24" }}
        >
          {selected ? (
            <>
              {/* Chat Header */}
              <div
                className="flex items-center gap-3 px-5 py-[14px] flex-shrink-0"
                style={{
                  borderBottom: "1px solid rgba(201,169,97,0.10)",
                  background: "#1a1d24",
                }}
              >
                {/* Mobile back */}
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

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold"
                    style={{ background: "#2d3139", color: "#c9a961" }}
                  >
                    {selected.avatar}
                  </div>
                  {selected.online && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full border-2"
                      style={{ background: "#4ade80", borderColor: "#1a1d24" }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-[15px] font-semibold leading-tight"
                    style={{ color: "#c4d5e0" }}
                  >
                    {selected.name}
                  </h3>
                  <span
                    className="text-[11.5px]"
                    style={{ color: selected.online ? "#4ade80" : "#3a4e5e" }}
                  >
                    {selected.online ? "● Active now" : "● Offline"}
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

              {/* Messages */}
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

              {/* Input */}
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
                >
                  <Paperclip size={17} />
                </button>

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
                    background: input.trim() ? "#c9a961" : "#2d3139",
                    color: input.trim() ? "#1a1d24" : "#3a4e5e",
                    transition:
                      "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
                  }}
                  onClick={handleSend}
                >
                  <Send size={16} strokeWidth={2.2} />
                </button>
              </div>
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
