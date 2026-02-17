import express from 'express';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
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

// @route   GET /api/opportunities
// @desc    Get all opportunities (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, location, status = 'open' } = req.query;
    
    let query = { status };
    
    if (type && type !== 'All') {
      query.type = type;
    }
    
    if (location && location !== 'All locations') {
      query.location = location;
    }

    const opportunities = await Opportunity.find(query)
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/:id
// @desc    Get single opportunity by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'name company email');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/opportunities
// @desc    Create a new opportunity (Hirer only)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Verify user is a hirer
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'hirer') {
      return res.status(403).json({ message: 'Only hirers can post opportunities' });
    }

    const {
      title,
      company,
      description,
      location,
      budget,
      duration,
      type,
      deadline,
      requirements,
      skillsNeeded
    } = req.body;

    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      location,
      budget,
      duration,
      type,
      postedBy: user._id,
      deadline,
      requirements,
      skillsNeeded
    });

    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/opportunities/:id
// @desc    Update an opportunity
// @access  Private (only the hirer who posted it)
router.put('/:id', auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if user is the one who posted this opportunity
    if (opportunity.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this opportunity' });
    }

    const {
      title,
      company,
      description,
      location,
      budget,
      duration,
      type,
      status,
      deadline,
      requirements,
      skillsNeeded
    } = req.body;

    if (title) opportunity.title = title;
    if (company) opportunity.company = company;
    if (description) opportunity.description = description;
    if (location) opportunity.location = location;
    if (budget) opportunity.budget = budget;
    if (duration) opportunity.duration = duration;
    if (type) opportunity.type = type;
    if (status) opportunity.status = status;
    if (deadline) opportunity.deadline = deadline;
    if (requirements) opportunity.requirements = requirements;
    if (skillsNeeded) opportunity.skillsNeeded = skillsNeeded;

    const updatedOpportunity = await opportunity.save();

    res.json(updatedOpportunity);
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete an opportunity
// @access  Private (only the hirer who posted it)
router.delete('/:id', auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if user is the one who posted this opportunity
    if (opportunity.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
    }

    // Delete all applications for this opportunity
    await Application.deleteMany({ opportunity: req.params.id });

    await opportunity.deleteOne();

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/opportunities/my-postings
// @desc    Get opportunities posted by current hirer
// @access  Private (Hirer only)
router.get('/my/postings', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing_secret_key');
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'hirer') {
      return res.status(403).json({ message: 'Only hirers can view their postings' });
    }

    const opportunities = await Opportunity.find({ postedBy: user._id })
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    console.error('Get my postings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
