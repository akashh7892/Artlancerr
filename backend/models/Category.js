const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Category name
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Category description
  description: {
    type: String
  },
  // Icon name (for UI)
  icon: {
    type: String
  },
  // Category type
  type: {
    type: String,
    enum: ['art', 'project', 'skill'],
    default: 'art'
  },
  // Parent category (for subcategories)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  // Sort order
  order: {
    type: Number,
    default: 0
  },
  // Is active
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
