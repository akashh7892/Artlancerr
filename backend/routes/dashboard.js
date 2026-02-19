const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const Hirer = require('../models/Hirer');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/artist
// @desc    Get artist dashboard data
// @access  Private (Artist only)
router.get('/artist', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const artistId = req.user._id;

    // Get applications
    const applications = await Application.find({ artist: artistId })
      .populate('opportunity')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get tasks
    const tasks = await Task.find({ artist: artistId })
      .populate('opportunity')
      .populate('hirer', 'name companyName avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get payments
    const payments = await Payment.find({ artist: artistId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get stats
    const totalEarnings = await Payment.aggregate([
      { $match: { artist: artistId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingPayments = await Payment.aggregate([
      { $match: { artist: artistId, status: { $in: ['pending', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const applicationCount = await Application.countDocuments({ artist: artistId });
    const hiredCount = await Application.countDocuments({ artist: artistId, status: 'hired' });

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      receiver: artistId,
      receiverModel: 'Artist',
      isRead: false
    });

    res.json({
      stats: {
        profileViews: req.user.profileViews || 0,
        activeProjects: tasks.filter(t => t.status === 'in_progress').length,
        totalEarnings: totalEarnings[0]?.total || 0,
        pendingPayments: pendingPayments[0]?.total || 0,
        applicationCount,
        hiredCount,
        messages: unreadMessages
      },
      applications,
      tasks,
      recentPayments: payments
    });
  } catch (error) {
    console.error('Get artist dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/hirer
// @desc    Get hirer dashboard data
// @access  Private (Hirer only)
router.get('/hirer', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const hirerId = req.user._id;

    // Get opportunities
    const opportunities = await Opportunity.find({ hirer: hirerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get tasks
    const tasks = await Task.find({ hirer: hirerId })
      .populate('opportunity')
      .populate('artist', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get payments
    const payments = await Payment.find({ hirer: hirerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get stats
    const totalSpent = await Payment.aggregate([
      { $match: { hirer: hirerId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const inEscrow = await Task.aggregate([
      { $match: { hirer: hirerId, paymentStatus: 'in_escrow' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const opportunityCount = await Opportunity.countDocuments({ hirer: hirerId });
    const artistsHired = await Application.countDocuments({ hirer: hirerId, status: 'hired' });

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      receiver: hirerId,
      receiverModel: 'Hirer',
      isRead: false
    });

    // Get all applications for this hirer's opportunities
    const allOppIds = await Opportunity.find({ hirer: hirerId }).distinct('_id');
    const applicationCount = await Application.countDocuments({ opportunity: { $in: allOppIds } });

    res.json({
      stats: {
        activeProjects: opportunities.filter(o => o.status === 'active').length,
        totalSpent: totalSpent[0]?.total || 0,
        inEscrow: inEscrow[0]?.total || 0,
        artistsHired,
        opportunityCount,
        applicationCount,
        messages: unreadMessages
      },
      opportunities,
      tasks,
      recentPayments: payments
    });
  } catch (error) {
    console.error('Get hirer dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/nearby-artists
// @desc    Get nearby artists
// @access  Public
router.get('/nearby-artists', async (req, res) => {
  try {
    const { location, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const artists = await Artist.find(query)
      .select('name username avatar location bio artCategory profileViews')
      .skip(skip)
      .limit(Number(limit));

    const total = await Artist.countDocuments(query);

    res.json({
      artists,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get nearby artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
