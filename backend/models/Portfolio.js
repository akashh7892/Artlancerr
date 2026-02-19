const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  // Artist who owns this portfolio
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  // Title
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Description
  description: {
    type: String
  },
  // Category
  category: {
    type: String,
    required: true
  },
  // Type of work
  workType: {
    type: String,
    enum: ['video', 'image', 'audio', 'document', 'link'],
    default: 'video'
  },
  // Media URL (for video, image, audio)
  mediaUrl: {
    type: String
  },
  // Thumbnail URL
  thumbnailUrl: {
    type: String
  },
  // External link (for YouTube, Vimeo, etc.)
  externalLink: {
    type: String
  },
  // Project details
  projectName: {
    type: String
  },
  clientName: {
    type: String
  },
  // Role in the project
  role: {
    type: String
  },
  // Tools/Software used
  tools: [{
    type: String
  }],
  // Tags
  tags: [{
    type: String
  }],
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Views count
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
portfolioSchema.index({ artist: 1, category: 1 });
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ tags: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
