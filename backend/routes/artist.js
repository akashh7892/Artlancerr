const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const Portfolio = require('../models/Portfolio');
const Application = require('../models/Application');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// @route   GET /api/artist/profile
// @desc    Get current artist's profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artist/profile
// @desc    Update artist profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = [
      'name', 'username', 'phone', 'location', 'bio', 'avatar',
      'artCategory', 'experience', 'instagram', 'twitter', 'youtube', 'website',
      'notifications', 'rates', 'availability', 'equipment'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const artist = await Artist.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(artist);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artist/payment
// @desc    Update payment details
// @access  Private
router.put('/payment', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      paymentMethod, paypalEmail, bankName, accountNumber,
      routingNumber, upiId, minimumPayout, payoutSchedule
    } = req.body;

    const updates = {
      paymentMethod, paypalEmail, bankName, accountNumber,
      routingNumber, upiId, minimumPayout, payoutSchedule
    };

    const artist = await Artist.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ message: 'Payment details updated', artist });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artist/portfolio
// @desc    Get artist's portfolio
// @access  Private
router.get('/portfolio', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const portfolio = await Portfolio.find({ artist: req.user._id }).sort({ createdAt: -1 });
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/artist/portfolio
// @desc    Add portfolio item
// @access  Private
router.post('/portfolio', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const portfolio = await Portfolio.create({
      ...req.body,
      artist: req.user._id
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Add portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artist/portfolio/:id
// @desc    Update portfolio item
// @access  Private
router.put('/portfolio/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, artist: req.user._id },
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/artist/portfolio/:id
// @desc    Delete portfolio item
// @access  Private
router.delete('/portfolio/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artist/applications
// @desc    Get artist's applications
// @access  Private
router.get('/applications', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ artist: req.user._id })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artist/tasks
// @desc    Get artist's tasks
// @access  Private
router.get('/tasks', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tasks = await Task.find({ artist: req.user._id })
      .populate('opportunity')
      .populate('hirer', 'name companyName avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artist/task/:id
// @desc    Update task status
// @access  Private
router.put('/task/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, progress, rejectionReason } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, artist: req.user._id },
      { status, progress, rejectionReason },
      { new: true }
    ).populate('opportunity').populate('hirer', 'name companyName');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artist/payments
// @desc    Get artist's payments
// @access  Private
router.get('/payments', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payments = await Payment.find({ artist: req.user._id })
      .populate('hirer', 'name companyName')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artist/:id
// @desc    Get artist public profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).select('-password');
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Increment profile views
    artist.profileViews += 1;
    await artist.save();

    // Get portfolio
    const portfolio = await Portfolio.find({ artist: req.params.id, isPublic: true });

    res.json({
      ...artist.getPublicProfile(),
      portfolio
    });
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
