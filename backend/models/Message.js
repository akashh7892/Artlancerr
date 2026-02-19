const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender (can be Artist or Hirer)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['Artist', 'Hirer']
  },
  // Receiver
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['Artist', 'Hirer']
  },
  // Message content
  content: {
    type: String,
    required: true
  },
  // Related opportunity (optional)
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  // Related application (optional)
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  // Read at timestamp
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
