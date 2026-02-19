const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // The opportunity this task belongs to
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  // Artist working on this task
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  // Hirer who posted the task
  hirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hirer',
    required: true
  },
  // Milestone name
  milestone: {
    type: String,
    required: true
  },
  // Amount for this task/milestone
  amount: {
    type: Number,
    required: true
  },
  // Due date
  dueDate: {
    type: Date,
    required: true
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'overdue'],
    default: 'pending'
  },
  // Progress percentage
  progress: {
    type: Number,
    default: 0
  },
  // Rejection reason
  rejectionReason: {
    type: String
  },
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  // Payment status
  paymentStatus: {
    type: String,
    enum: ['pending', 'in_escrow', 'released', 'disputed'],
    default: 'pending'
  },
  // Payment release date
  paymentReleasedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ artist: 1, status: 1 });
taskSchema.index({ hirer: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
