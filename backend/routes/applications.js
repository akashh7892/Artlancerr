const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { protect } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Apply to an opportunity
// @access  Private (Artist only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Only artists can apply' });
    }

    const { opportunityId, coverLetter, proposedBudget, availability, portfolioLinks, startDate } = req.body;

    if (!opportunityId) {
      return res.status(400).json({ message: 'Opportunity ID is required' });
    }

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'active') {
      return res.status(400).json({ message: 'This opportunity is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      artist: req.user._id,
      opportunity: opportunityId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this opportunity' });
    }

    // Create application
    const application = await Application.create({
      opportunity: opportunityId,
      artist: req.user._id,
      hirer: opportunity.hirer,
      coverLetter,
      proposedBudget,
      availability,
      portfolioLinks,
      startDate,
      statusHistory: [{
        status: 'pending',
        date: Date.now(),
        note: 'Application submitted'
      }]
    });

    // Update opportunity application count
    await Opportunity.findByIdAndUpdate(opportunityId, {
      $inc: { applicationCount: 1 }
    });

    const populated = await Application.findById(application._id)
      .populate('opportunity')
      .populate('artist', 'name username avatar location');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my
// @desc    Get current user's applications
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ artist: req.user._id })
      .populate('opportunity')
      .populate('hirer', 'name companyName avatar')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('opportunity')
      .populate('artist', 'name username avatar location bio')
      .populate('hirer', 'name companyName avatar');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized
    const isArtist = application.artist._id.toString() === req.user._id.toString();
    const isHirer = application.hirer._id.toString() === req.user._id.toString();

    if (!isArtist && !isHirer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private (Artist only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Only artists can update applications' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      artist: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow updates if still pending
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update application after status change' });
    }

    const { coverLetter, proposedBudget, availability, portfolioLinks, startDate } = req.body;

    application.coverLetter = coverLetter || application.coverLetter;
    application.proposedBudget = proposedBudget || application.proposedBudget;
    application.availability = availability || application.availability;
    application.portfolioLinks = portfolioLinks || application.portfolioLinks;
    application.startDate = startDate || application.startDate;

    await application.save();

    const populated = await Application.findById(application._id)
      .populate('opportunity')
      .populate('artist', 'name username avatar');

    res.json(populated);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (Artist only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Artist') {
      return res.status(403).json({ message: 'Only artists can withdraw applications' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      artist: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update status to withdrawn instead of deleting
    application.status = 'withdrawn';
    application.statusHistory.push({
      status: 'withdrawn',
      date: Date.now(),
      note: 'Application withdrawn by artist'
    });
    await application.save();

    // Update opportunity count
    await Opportunity.findByIdAndUpdate(application.opportunity, {
      $inc: { applicationCount: -1 }
    });

    res.json({ message: 'Application withdrawn' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
