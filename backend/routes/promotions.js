const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const { protect } = require('../middleware/auth');

const toDateAfterDays = (days) => {
  const n = Number(days);
  const safeDays = Number.isFinite(n) && n > 0 ? n : 7;
  return new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000);
};

// @route   GET /api/promotions
// @desc    Get current user's promotions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const promotions = await Promotion.find({
      target: req.user._id,
      targetType: req.userType
    }).sort({ createdAt: -1 });

    res.json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/promotions
// @desc    Create promotion for current user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type, duration, price, image, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const promotion = await Promotion.create({
      title,
      description,
      type,
      targetType: req.userType,
      target: req.user._id,
      duration: Number(duration) || 7,
      price: Number(price) || 0,
      image: image || undefined,
      link: link || undefined,
      startDate: new Date(),
      endDate: toDateAfterDays(duration)
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/promotions/:id
// @desc    Update own promotion
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['title', 'description', 'type', 'duration', 'price', 'status', 'image', 'link'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (updates.duration !== undefined) {
      updates.endDate = toDateAfterDays(updates.duration);
    }

    const promotion = await Promotion.findOneAndUpdate(
      { _id: req.params.id, target: req.user._id, targetType: req.userType },
      updates,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json(promotion);
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/promotions/:id
// @desc    Cancel own promotion
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const promotion = await Promotion.findOneAndUpdate(
      { _id: req.params.id, target: req.user._id, targetType: req.userType },
      { status: 'cancelled' },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json({ message: 'Promotion cancelled', promotion });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
