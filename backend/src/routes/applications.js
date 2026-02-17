import express from 'express';
import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   POST /api/applications
// @desc    Apply for an opportunity (Artist only)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can apply for opportunities' });
    }

    const { opportunityId, coverLetter, proposedRate, portfolioLinks } = req.body;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if opportunity is still open
    if (opportunity.status !== 'open') {
      return res.status(400).json({ message: 'This opportunity is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      opportunity: opportunityId,
      artist: user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    // Create application
    const application = await Application.create({
      opportunity: opportunityId,
      artist: user._id,
      coverLetter,
      proposedRate,
      portfolioLinks
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my
// @desc    Get current user's applications (Artist)
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can view their applications' });
    }

    const applications = await Application.find({ artist: user._id })
      .populate('opportunity')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/opportunity/:opportunityId
// @desc    Get applications for a specific opportunity (Hirer only)
// @access  Private
router.get('/opportunity/:opportunityId', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'hirer') {
      return res.status(403).json({ message: 'Only hirers can view applications for their opportunities' });
    }

    // Check if the opportunity belongs to this hirer
    const opportunity = await Opportunity.findById(req.params.opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.postedBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this opportunity' });
    }

    const applications = await Application.find({ opportunity: req.params.opportunityId })
      .populate('artist', 'name email profileImage bio skills portfolio location')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get opportunity applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Hirer only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'hirer') {
      return res.status(403).json({ message: 'Only hirers can update application status' });
    }

    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('opportunity');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the hirer owns the opportunity
    if (application.opportunity.postedBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;

    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application (Artist only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can withdraw their applications' });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the artist owns this application
    if (application.artist.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    // Can only withdraw if still pending
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Can only withdraw pending applications' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
