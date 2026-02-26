require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const Artist = require("./models/Artist");
const Hirer = require("./models/Hirer");

// Import routes
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

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for this origin"));
    },
  }),
);
app.use(express.json());

const corsOriginCheck = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error("CORS not allowed for this origin"));
};

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Artlancing API is running" });
});

const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true,
  },
});

app.set("io", io);

const JWT_SECRET = process.env.JWT_SECRET || "artlancing-secret-key-2024";

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token =
      socket.handshake.auth?.token || socket.handshake.query?.token || bearerToken;

    if (!token) {
      return next(new Error("Not authorized"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = await Artist.findById(decoded.id).select("_id");
    let userType = "Artist";

    if (!user) {
      user = await Hirer.findById(decoded.id).select("_id");
      userType = "Hirer";
    }

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = { _id: user._id.toString(), userType };
    return next();
  } catch (error) {
    return next(new Error("Not authorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user._id;
  socket.join(`user:${userId}`);

  socket.on("join_chat", ({ otherUserId }) => {
    if (!otherUserId) return;
    const room = [userId, String(otherUserId)].sort().join(":");
    socket.join(`chat:${room}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
