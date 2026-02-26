const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/auth");
const { Types } = require("mongoose");

// @route   GET /api/messages
// @desc    Get user's conversations
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.userType;

    // Get unique conversations
    const messages = await Message.find({
      $or: [
        { sender: userId, senderModel: userType },
        { receiver: userId, receiverModel: userType },
      ],
    })
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username")
      .populate("opportunity", "title")
      .sort({ createdAt: -1 });

    // Group by conversation
    const conversations = {};
    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId.toString()
          ? msg.receiver
          : msg.sender;
      const key = otherUser._id.toString();

      if (!conversations[key]) {
        conversations[key] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        };
      }

      if (!msg.isRead && msg.receiver._id.toString() === userId.toString()) {
        conversations[key].unreadCount += 1;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
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

// @route   GET /api/messages/:userId
// @desc    Get messages with specific user
// @access  Private
router.get("/:userId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: userId,
        },
      ],
    })
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username")
      .populate("opportunity", "title")
      .sort({ createdAt: 1 });

    // Mark messages as read
    const readResult = await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true, readAt: Date.now() },
    );

    if (readResult.modifiedCount > 0) {
      const io = req.app.get("io");
      io.to(`user:${userId.toString()}`).to(`user:${otherUserId}`).emit(
        "messages_read",
        {
          conversationWith: otherUserId,
          readBy: userId.toString(),
          readAt: new Date().toISOString(),
        },
      );
    }

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, receiverModel, content, opportunityId, applicationId } =
      req.body;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ message: "Receiver and content are required" });
    }

    if (!Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver id" });
    }
    if (opportunityId && !Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({ message: "Invalid opportunity id" });
    }
    if (applicationId && !Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const safeContent = String(content || "").trim();
    if (!safeContent) {
      return res
        .status(400)
        .json({ message: "Message content cannot be empty" });
    }

    const message = await Message.create({
      sender: req.user._id,
      senderModel: req.userType,
      receiver: receiverId,
      receiverModel:
        receiverModel || (req.userType === "Artist" ? "Hirer" : "Artist"),
      content: safeContent,
      opportunity: opportunityId,
      application: applicationId,
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username");

    const io = req.app.get("io");
    io.to(`user:${req.user._id.toString()}`).to(`user:${receiverId}`).emit(
      "new_message",
      populated,
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
