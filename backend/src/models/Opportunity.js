import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
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
  duration: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Acting', 'Dance', 'Cinematography', 'Costume Design', 'Music', 'Directing', 'Writing', 'Other']
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  // Reference to the hirer who posted this opportunity
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Application deadline
  deadline: {
    type: Date
  },
  // Requirements
  requirements: [{
    type: String
  }],
  // Skills needed
  skillsNeeded: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
opportunitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
