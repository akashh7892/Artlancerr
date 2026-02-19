const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// @route   GET /api/payments
// @desc    Get user's payments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    // Filter by user type
    if (req.userType === 'Artist') {
      query.artist = req.user._id;
    } else if (req.userType === 'Hirer') {
      query.hirer = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate('artist', 'name avatar username')
      .populate('hirer', 'name companyName avatar')
      .populate('task', 'title milestone')
      .populate('opportunity', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/stats
// @desc    Get payment statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.userType === 'Artist') {
      query.artist = req.user._id;
    } else if (req.userType === 'Hirer') {
      query.hirer = req.user._id;
    }

    // Get stats
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      pending: 0,
      completed: 0,
      count: 0
    };

    stats.forEach(s => {
      result.count += s.count;
      if (s._id === 'completed') {
        result.completed = s.total;
        result.total += s.total;
      } else if (s._id === 'pending' || s._id === 'processing') {
        result.pending += s.total;
        result.total += s.total;
      }
    });

    // Get this month's stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await Payment.aggregate([
      { 
        $match: { 
          ...query, 
          createdAt: { $gte: startOfMonth } 
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    result.thisMonth = monthlyStats[0]?.total || 0;

    res.json(result);
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('artist', 'name avatar username email')
      .populate('hirer', 'name companyName avatar email')
      .populate('task')
      .populate('opportunity', 'title');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    const isArtist = payment.artist._id.toString() === req.user._id.toString();
    const isHirer = payment.hirer._id.toString() === req.user._id.toString();

    if (!isArtist && !isHirer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
