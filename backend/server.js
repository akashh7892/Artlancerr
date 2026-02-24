require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const artistRoutes = require("./routes/artist");
const hirerRoutes = require("./routes/hirer");
const opportunityRoutes = require("./routes/opportunities");
const applicationRoutes = require("./routes/applications");
const messageRoutes = require("./routes/messages");
const paymentRoutes = require("./routes/payments");
const categoryRoutes = require("./routes/categories");
const dashboardRoutes = require("./routes/dashboard");
const promotionRoutes = require("./routes/promotions");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/hirer", hirerRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/promotions", promotionRoutes);

// SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("registerUser", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

app.set("onlineUsers", onlineUsers);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});