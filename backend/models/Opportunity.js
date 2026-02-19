const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Film & TV Production',
      'Advertising & Commercial Shoots',
      'Music Videos',
      'Event Videography',
      'Wedding Cinematography',
      'Documentary Production',
      'Streaming Content Production',
      'YouTubers Hiring Editors',
      'Influencers Hiring Videographers',
      'Podcast Production Teams',
      'Social Media Content Studios',
      'Brand Creator Collaborations',
      'Game Cinematics',
      'Motion Capture Crews',
      '3D Animation Teams',
      'Virtual Production Specialists',
      'Unreal Engine Artists',
      'Corporate Video Production',
      'Training Content Creation',
      'Marketing Media Teams',
      'Internal Communication Studios',
      'acting',
      'dance',
      'cinematography',
      'music',
      'costume',
      'makeup',
      'editing',
      'other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  budgetMin: {
    type: Number,
    default: 0
  },
  budgetMax: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  maxSlots: {
    type: Number,
    default: 1
  },
  availableSlots: {
    type: Number,
    default: 1
  },
  // Reference to hirer who posted this
  hirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hirer',
    required: true
  },
  company: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  // Application count
  applicationCount: {
    type: Number,
    default: 0
  },
  // Requirements
  requirements: [{
    type: String
  }],
  // Skills needed
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for searching
opportunitySchema.index({ title: 'text', description: 'text', type: 'text' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
