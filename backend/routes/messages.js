const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/auth");
const { Types } = require("mongoose");

/* ================= GET CONVERSATIONS ================= */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.userType;

    const messages = await Message.find({
      $or: [
        { sender: userId, senderModel: userType },
        { receiver: userId, receiverModel: userType },
      ],
    })
      .populate("sender", "name avatar photo username")
      .populate("receiver", "name avatar photo username")
      .populate("opportunity", "title")
      .sort({ createdAt: -1 });

    const conversations = {};

    messages.forEach((msg) => {
      // ✅ FIX: prevent crash
      if (!msg.sender || !msg.receiver) {
        console.warn("Invalid message skipped:", msg._id);
        return;
      }

      const senderId = msg.sender?._id?.toString();
      const receiverId = msg.receiver?._id?.toString();
      const myId = userId.toString();

      if (!senderId || !receiverId) return;

      const otherUser = senderId === myId ? msg.receiver : msg.sender;

      if (!otherUser || !otherUser._id) return;

      const key = otherUser._id.toString();

      if (!conversations[key]) {
        conversations[key] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        };
      }

      if (!msg.isRead && receiverId === myId) {
        conversations[key].unreadCount += 1;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UNREAD COUNT ================= */
router.get("/unread/count", protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      receiverModel: req.userType,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET THREAD ================= */
router.get("/:userId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    if (!Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate("sender", "name avatar photo username")
      .populate("receiver", "name avatar photo username")
      .populate("opportunity", "title")
      .sort({ createdAt: 1 });

    const readResult = await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    if (readResult.modifiedCount > 0) {
      const io = req.app.get("io");
      io.to(`user:${userId.toString()}`)
        .to(`user:${otherUserId}`)
        .emit("messages_read", {
          conversationWith: otherUserId,
          readBy: userId.toString(),
          readAt: new Date().toISOString(),
        });
    }

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SEND MESSAGE ================= */
router.post("/", protect, async (req, res) => {
  try {
    const {
      receiverId,
      receiverModel,
      content,
      opportunityId,
      applicationId,
      attachment,
    } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    if (!Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver id" });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    const safeContent = String(content || "").trim();

    const safeAttachment =
      attachment && attachment.url
        ? {
            url: String(attachment.url),
            name: String(attachment.name || ""),
            mimeType: String(attachment.mimeType || ""),
            size: Number(attachment.size) || undefined,
          }
        : undefined;

    if (!safeContent && !safeAttachment) {
      return res.status(400).json({ message: "Message content required" });
    }

    const resolvedReceiverModel =
      receiverModel || (req.userType === "Artist" ? "Hirer" : "Artist");

    const message = await Message.create({
      sender: req.user._id,
      senderModel: req.userType,
      receiver: receiverId,
      receiverModel: resolvedReceiverModel,
      content: safeContent,
      opportunity: opportunityId || undefined,
      application: applicationId || undefined,
      attachment: safeAttachment,
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name avatar photo username")
      .populate("receiver", "name avatar photo username");

    const io = req.app.get("io");

    io.to(`user:${req.user._id.toString()}`)
      .to(`user:${receiverId}`)
      .emit("new_message", populated);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
