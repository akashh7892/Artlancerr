const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/opportunities
// @desc    Get all opportunities (with filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      type, location, search, minBudget, maxBudget, 
      duration, posted, page = 1, limit = 20 
    } = req.query;

    const query = { status: 'active' };

    if (type && type !== 'All') {
      query.type = type;
    }

    if (location && location !== 'All locations') {
      query.location = { $regex: location.split(',')[0], $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minBudget || maxBudget) {
      if (minBudget) {
        query.budgetMax = { ...(query.budgetMax || {}), $gte: Number(minBudget) };
      }
      if (maxBudget) {
        query.budgetMin = { ...(query.budgetMin || {}), $lte: Number(maxBudget) };
      }
    }

    const skip = (page - 1) * limit;

    const opportunities = await Opportunity.find(query)
      .populate('hirer', 'name companyName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Opportunity.countDocuments(query);

    // Check if user has applied to any
    let appliedIds = [];
    if (req.user) {
      const applications = await Application.find({ artist: req.user._id });
      appliedIds = applications.map(a => a.opportunity.toString());
    }

    const opportunitiesWithApplied = opportunities.map(opp => ({
      ...opp.toObject(),
      hasApplied: appliedIds.includes(opp._id.toString())
    }));

    res.json({
      opportunities: opportunitiesWithApplied,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/categories/list
// @desc    Get opportunity categories
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = [
    'All',
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
    'Internal Communication Studios'
  ];
  res.json(categories);
});

// @route   GET /api/opportunities/:id
// @desc    Get single opportunity
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('hirer', 'name companyName avatar location');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/opportunities/:id
// @desc    Update opportunity
// @access  Private (Hirer only)
router.put('/:id', protect, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.hirer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity
// @access  Private (Hirer only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.hirer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
