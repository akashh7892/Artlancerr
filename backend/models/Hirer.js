const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hirerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  companyName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    trim: true
  },
  // Industry and company details
  industry: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  // Company size preference
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10'
  },
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['paypal', 'bank', 'upi'],
    default: 'paypal'
  },
  paypalEmail: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  routingNumber: {
    type: String,
    trim: true
  },
  upiId: {
    type: String,
    trim: true
  },
  // Notifications
  notifications: {
    emailPromos: { type: Boolean, default: true },
    emailMessages: { type: Boolean, default: true },
    emailPayments: { type: Boolean, default: true },
    emailApplications: { type: Boolean, default: true },
    pushPromos: { type: Boolean, default: true },
    pushMessages: { type: Boolean, default: true },
    pushPayments: { type: Boolean, default: true },
    pushApplications: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  // Stats
  totalSpent: {
    type: Number,
    default: 0
  },
  artistsHired: {
    type: Number,
    default: 0
  },
  activeProjects: {
    type: Number,
    default: 0
  },
  inEscrow: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
hirerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
hirerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
hirerSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    companyName: this.companyName,
    avatar: this.avatar,
    location: this.location,
    bio: this.bio,
    industry: this.industry,
    companyWebsite: this.companyWebsite,
    companySize: this.companySize,
    artistsHired: this.artistsHired,
    totalSpent: this.totalSpent,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Hirer', hirerSchema);
