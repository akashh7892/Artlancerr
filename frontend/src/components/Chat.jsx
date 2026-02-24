import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = ({ userId, otherUserId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Register user when component loads
    socket.emit("registerUser", userId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      senderId: userId,
      receiverId: otherUserId,
      message
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId === userId ? "You" : "Other"}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;