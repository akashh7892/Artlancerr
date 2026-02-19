const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  // Title
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Description
  description: {
    type: String,
    required: true
  },
  // Type of promotion
  type: {
    type: String,
    enum: ['featured', 'banner', 'spotlight', 'badge', 'email'],
    default: 'featured'
  },
  // Target (artist or hirer)
  targetType: {
    type: String,
    enum: ['Artist', 'Hirer'],
    required: true
  },
  // Reference to target
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  // Duration in days
  duration: {
    type: Number,
    default: 7
  },
  // Price
  price: {
    type: Number,
    default: 0
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  // Start date
  startDate: {
    type: Date,
    default: Date.now
  },
  // End date
  endDate: {
    type: Date
  },
  // Image/banner URL
  image: {
    type: String
  },
  // Link
  link: {
    type: String
  }
}, {
  timestamps: true
});

// Index
promotionSchema.index({ target: 1, status: 1 });
promotionSchema.index({ endDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
