import { motion } from "motion/react";
import {
  ArrowLeft,
  Send,
  Search,
  Paperclip,
  Check,
  CheckCheck,
  Users,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";
import axios from "axios";
import socket from "../../socket";

/* ---------------- DESIGN TOKENS (UNCHANGED) ---------------- */
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
};

/* ---------------- TIME FORMATTERS ---------------- */
function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function HirerMessages() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  /* -------- LOAD CONVERSATIONS -------- */
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setConversations(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(console.error);
  }, [token]);

  /* -------- LOAD MESSAGES WHEN SELECTED -------- */
  useEffect(() => {
    if (!selected || !token) return;

    axios
      .get(
        `http://localhost:5000/api/messages/${selected.user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [selected, token]);

  /* -------- SOCKET -------- */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("registerUser", user._id);

    socket.on("newMessage", (msg) => {
      if (
        selected &&
        (msg.sender._id === selected.user._id ||
          msg.receiver._id === selected.user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [selected, user]);

  /* -------- AUTO SCROLL -------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------- SEND MESSAGE -------- */
  const sendMessage = async () => {
    if (!messageText.trim() || !selected) return;

    const res = await axios.post(
      "http://localhost:5000/api/messages",
      {
        receiverId: selected.user._id,
        content: messageText,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [...prev, res.data]);
    setMessageText("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: C.bg }}
    >
      <HirerSidebar />

      <div className="flex-1 flex lg:ml-72" style={{ height: "100vh" }}>
        {/* LEFT PANEL */}
        <div
          style={{
            width: "300px",
            borderRight: `1px solid ${C.border}`,
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <h2 style={{ color: C.text, marginBottom: "12px" }}>
            Messages
          </h2>

          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              color: C.text,
              marginBottom: "12px",
            }}
          />

          {filteredConversations.map((conv) => (
            <div
              key={conv.user._id}
              onClick={() => setSelected(conv)}
              style={{
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                background:
                  selected?.user._id === conv.user._id
                    ? C.selectedBg
                    : "transparent",
              }}
            >
              <strong style={{ color: C.text }}>
                {conv.user.name}
              </strong>
              <p style={{ color: C.muted, fontSize: "12px", margin: 0 }}>
                {conv.lastMessage?.content}
              </p>
            </div>
          ))}
        </div>

        {/* CHAT AREA */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selected ? (
            <>
              {/* HEADER */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: `1px solid ${C.border}`,
                  color: C.text,
                  fontWeight: "600",
                }}
              >
                Chat with {selected.user.name}
              </div>

              {/* MESSAGES */}
              <div
                style={{
                  flex: 1,
                  padding: "16px",
                  overflowY: "auto",
                }}
              >
                {messages.map((msg) => {
                  const isOut = msg.sender._id === user._id;

                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        justifyContent: isOut
                          ? "flex-end"
                          : "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          padding: "10px 14px",
                          borderRadius: "14px",
                          background: isOut
                            ? `linear-gradient(135deg, ${C.gold}, #a8863d)`
                            : C.card,
                          color: isOut ? "#1a1d24" : C.text,
                          fontSize: "13px",
                        }}
                      >
                        {msg.content}
                        <div
                          style={{
                            fontSize: "10px",
                            marginTop: "4px",
                            textAlign: "right",
                            opacity: 0.6,
                          }}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div
                style={{
                  padding: "12px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  gap: "8px",
                }}
              >
                <textarea
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(e.target.value)
                  }
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    color: C.text,
                    resize: "none",
                  }}
                />

                <button
                  onClick={sendMessage}
                  style={{
                    padding: "10px 16px",
                    background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                    border: "none",
                    borderRadius: "8px",
                    color: "#1a1d24",
                    cursor: "pointer",
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
              }}
            >
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}