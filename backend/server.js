require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Artist = require("./models/Artist");
const Hirer = require("./models/Hirer");

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
const uploadRoutes = require("./routes/upload");

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

/* ================= CORS CONFIG ================= */

const normalizeOrigin = (value) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return String(value).trim().replace(/\/+$/, "");
  }
};

const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const defaultDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const allowedOrigins = new Set(
  process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [...configuredOrigins, ...defaultDevOrigins]
);

const corsOriginCheck = (origin, callback) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!origin || allowedOrigins.has(normalizedOrigin)) {
    return callback(null, true);
  }
  return callback(new Error("CORS not allowed for this origin"));
};

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  })
);

/* =============================================== */

app.use(express.json());
app.use(mongoSanitize());

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
app.use("/api/upload", uploadRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Artlancing API is running" });
});

/* ========== SOCKET.IO CORS ========= */
const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true,
  },
});
/* =================================== */

app.set("io", io);

const JWT_SECRET = process.env.JWT_SECRET || "artlancing-secret-key-2024";

/* socket auth middleware unchanged */
io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      bearerToken;

    if (!token) return next(new Error("Not authorized"));

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = await Artist.findById(decoded.id).select("_id");
    let userType = "Artist";

    if (!user) {
      user = await Hirer.findById(decoded.id).select("_id");
      userType = "Hirer";
    }

    if (!user) return next(new Error("User not found"));

    socket.user = { _id: user._id.toString(), userType };
    next();
  } catch {
    next(new Error("Not authorized"));
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));