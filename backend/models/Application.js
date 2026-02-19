const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  hirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hirer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'in_review', 'hired', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  // Application details
  coverLetter: {
    type: String
  },
  proposedBudget: {
    type: Number
  },
  availability: {
    type: String
  },
  // Portfolio links
  portfolioLinks: [{
    type: String
  }],
  // Timeline
  startDate: {
    type: Date
  },
  // Status timeline
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  // Notes from hirer
  notes: {
    type: String
  },
  // Rejection reason
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
applicationSchema.index({ opportunity: 1, artist: 1 });
applicationSchema.index({ artist: 1 });
applicationSchema.index({ hirer: 1 });

module.exports = mongoose.model('Application', applicationSchema);
