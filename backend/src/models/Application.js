import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Reference to the opportunity
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  // Reference to the artist who applied
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Application status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  // Cover letter or message from the artist
  coverLetter: {
    type: String,
    default: ''
  },
  // Artist's proposed rate (optional)
  proposedRate: {
    type: String
  },
  // Portfolio links or attachments
  portfolioLinks: [{
    type: String
  }],
  // Hirer's notes
  notes: {
    type: String,
    default: ''
  },
  // Application date
  appliedAt: {
    type: Date,
    default: Date.now
  },
  // Last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index to ensure one application per artist per opportunity
applicationSchema.index({ opportunity: 1, artist: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
