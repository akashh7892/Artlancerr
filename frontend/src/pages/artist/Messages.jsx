import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../socket";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  // Load Conversations
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConversations(res.data))
      .catch(console.error);
  }, [token]);

  // Load Messages when user selected
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(
        `http://localhost:5000/api/messages/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [selectedUser, token]);

  // Socket
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    socket.on("newMessage", (msg) => {
      if (
        selectedUser &&
        (msg.sender._id === selectedUser._id ||
          msg.receiver._id === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [selectedUser, user]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const res = await axios.post(
      "http://localhost:5000/api/messages",
      {
        receiverId: selectedUser._id,
        content: input,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [...prev, res.data]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#1a1d24",
        color: "#c4d5e0",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid rgba(201,169,97,0.15)",
          padding: "20px",
          background: "#1a1d24",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Messages</h2>

        {conversations.map((conv) => (
          <div
            key={conv.user._id}
            onClick={() => setSelectedUser(conv.user)}
            style={{
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                selectedUser?._id === conv.user._id
                  ? "rgba(201,169,97,0.15)"
                  : "transparent",
              border:
                selectedUser?._id === conv.user._id
                  ? "1px solid #c9a961"
                  : "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <strong>{conv.user.name}</strong>
            <div style={{ fontSize: "12px", opacity: 0.6 }}>
              {conv.lastMessage?.content}
            </div>
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
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid rgba(201,169,97,0.15)",
                fontWeight: "600",
              }}
            >
              Chat with {selectedUser.name}
            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg) => {
                const isMe = msg.sender._id === user._id;

                return (
                  <div
                    key={msg._id}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      background: isMe ? "#c9a961" : "#2d3139",
                      color: isMe ? "#1a1d24" : "#c4d5e0",
                      padding: "10px 14px",
                      borderRadius: "14px",
                      maxWidth: "60%",
                      fontSize: "14px",
                    }}
                  >
                    {msg.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div
              style={{
                padding: "15px",
                borderTop: "1px solid rgba(201,169,97,0.15)",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#2d3139",
                  color: "#c4d5e0",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#c9a961",
                  color: "#1a1d24",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}