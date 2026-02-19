const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const artistSchema = new mongoose.Schema({
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
  username: {
    type: String,
    unique: true,
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
  bio: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  artCategory: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  // Social links
  instagram: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  youtube: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
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
  minimumPayout: {
    type: Number,
    default: 50
  },
  payoutSchedule: {
    type: String,
    default: 'Weekly (every Friday)'
  },
  // Notifications
  notifications: {
    emailPromos: { type: Boolean, default: true },
    emailMessages: { type: Boolean, default: true },
    emailPayments: { type: Boolean, default: true },
    emailOpportunities: { type: Boolean, default: false },
    pushPromos: { type: Boolean, default: true },
    pushMessages: { type: Boolean, default: true },
    pushPayments: { type: Boolean, default: true },
    pushOpportunities: { type: Boolean, default: true },
    smsPayments: { type: Boolean, default: false },
    smsMessages: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  // Profile sections used in artist profile page
  rates: {
    daily: { type: String, default: '' },
    weekly: { type: String, default: '' },
    project: { type: String, default: '' }
  },
  availability: {
    blockedDates: [{ type: String }],
    freeDates: [{ type: String }]
  },
  equipment: [{
    name: { type: String, trim: true },
    model: { type: String, trim: true },
    category: { type: String, trim: true },
    rental: { type: String, trim: true },
    rentalOn: { type: Boolean, default: true },
    img: { type: String, default: null }
  }],
  // Profile stats
  profileViews: {
    type: Number,
    default: 0
  },
  totalEarnings: {
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
artistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
artistSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
artistSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    username: this.username,
    avatar: this.avatar,
    location: this.location,
    bio: this.bio,
    artCategory: this.artCategory,
    experience: this.experience,
    instagram: this.instagram,
    twitter: this.twitter,
    youtube: this.youtube,
    website: this.website,
    profileViews: this.profileViews,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Artist', artistSchema);
