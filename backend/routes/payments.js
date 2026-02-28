const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');
const razorpay = require('../config/razorpay');

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order (amount in paise, INR)
// @access  Private (Hirer)
router.post('/create-order', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Only hirers can create payments' });
    }
    const { amount, artistId, taskId, opportunityId, description, projectName } = req.body;
    const amountNum = Math.round(Number(amount));
    if (!amountNum || amountNum < 1) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }
    const amountPaise = Math.round(amountNum * 100);
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `artlancerr_${Date.now()}`,
    });
    const paymentRecord = await Payment.create({
      artist: artistId || undefined,
      hirer: req.user._id,
      task: taskId || undefined,
      opportunity: opportunityId || undefined,
      amount: amountNum,
      currency: 'INR',
      status: 'pending',
      type: 'milestone',
      description: description || 'Payment',
      projectName: projectName || undefined,
      razorpayOrderId: order.id,
    });
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentRecordId: paymentRecord._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay HMAC-SHA256 and mark payment completed
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing verification fields' });
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, hirer: req.user._id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'completed',
        paidAt: new Date(),
        transactionId: razorpay_payment_id,
      },
      { new: true }
    ).populate('artist', 'name avatar').populate('opportunity', 'title');
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }
    res.json({ message: 'Payment verified', payment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
