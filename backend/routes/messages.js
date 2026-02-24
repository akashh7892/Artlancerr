const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/auth");

// GET conversation list
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username")
      .sort({ createdAt: -1 });

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
          unread: 0,
        };
      }

      if (
        !msg.isRead &&
        msg.receiver._id.toString() === userId.toString()
      ) {
        conversations[key].unread += 1;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET messages with specific user
router.get("/:userId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// SEND MESSAGE
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      senderModel: req.userType,
      receiver: receiverId,
      receiverModel: req.userType === "Artist" ? "Hirer" : "Artist",
      content,
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name avatar username")
      .populate("receiver", "name avatar username");

    // 🔥 Socket emit
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (onlineUsers && io) {
      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", populated);
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;