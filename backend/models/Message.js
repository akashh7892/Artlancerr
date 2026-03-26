const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    /* ================= SENDER ================= */
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Artist", "Hirer"],
    },

    /* ================= RECEIVER ================= */
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Artist", "Hirer"],
    },

    /* ================= MESSAGE CONTENT ================= */
    content: {
      type: String,
      trim: true,
      default: "",
    },

    /* ================= ATTACHMENT ================= */
    attachment: {
      url: { type: String, trim: true },
      name: { type: String, trim: true },
      mimeType: { type: String, trim: true },
      size: { type: Number },
    },

    /* ================= OPTIONAL LINKS ================= */
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },

    /* ================= READ STATUS ================= */
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

/* ================= VALIDATION ================= */
// ❗ Prevent empty message (VERY IMPORTANT)
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.attachment?.url) {
    return next(new Error("Message must have content or attachment"));
  }
  next();
});

/* ================= INDEXES ================= */

// Fast conversation queries
messageSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: -1,
});

// Reverse direction (important!)
messageSchema.index({
  receiver: 1,
  sender: 1,
  createdAt: -1,
});

// Unread messages
messageSchema.index({
  receiver: 1,
  isRead: 1,
});

// Optional: for sorting recent chats
messageSchema.index({
  createdAt: -1,
});

/* ================= EXPORT ================= */
module.exports = mongoose.model("Message", messageSchema);
