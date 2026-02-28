const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Artist receiving the payment
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  // Hirer making the payment
  hirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hirer',
    required: true
  },
  // Related task
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  // Related opportunity
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  // Amount
  amount: {
    type: Number,
    required: true
  },
  // Currency
  currency: {
    type: String,
    default: 'INR'
  },
  // Razorpay
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  // Type
  type: {
    type: String,
    enum: ['milestone', 'bonus', 'refund'],
    default: 'milestone'
  },
  // Description
  description: {
    type: String
  },
  // Project name
  projectName: {
    type: String
  },
  // Transaction ID (from payment provider)
  transactionId: {
    type: String
  },
  // Paid at
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
paymentSchema.index({ artist: 1, status: 1 });
paymentSchema.index({ hirer: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
