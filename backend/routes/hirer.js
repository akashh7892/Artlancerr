const express = require('express');
const router = express.Router();
const Hirer = require('../models/Hirer');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { Types } = require('mongoose');

// @route   GET /api/hirer/profile
// @desc    Get current hirer's profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hirer/profile
// @desc    Update hirer profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = [
      'name', 'companyName', 'phone', 'location', 'bio', 'avatar',
      'industry', 'companyWebsite', 'companySize', 'notifications'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const hirer = await Hirer.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(hirer);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hirer/payment
// @desc    Update payment method
// @access  Private
router.put('/payment', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      paymentMethod, paypalEmail, bankName, accountNumber,
      routingNumber, upiId
    } = req.body;

    const updates = {
      paymentMethod, paypalEmail, bankName, accountNumber,
      routingNumber, upiId
    };

    const hirer = await Hirer.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ message: 'Payment details updated', hirer });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/hirer/opportunity
// @desc    Post a new opportunity
// @access  Private
router.post('/opportunity', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      title,
      type,
      description,
      location,
      budget,
      duration,
      startDate,
      maxSlots,
      availableSlots,
      budgetMin,
      budgetMax
    } = req.body;

    if (!title || !type || !description || !location || !budget || !duration) {
      return res.status(400).json({ message: 'Missing required opportunity fields' });
    }

    const safeMaxSlots = Number(maxSlots) || 1;
    const safeAvailableSlots = Number(availableSlots) || safeMaxSlots;
    if (safeAvailableSlots > safeMaxSlots) {
      return res.status(400).json({ message: 'Available slots cannot exceed max slots' });
    }

    const opportunity = await Opportunity.create({
      ...req.body,
      title: String(title).trim(),
      type: String(type).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      budget: String(budget).trim(),
      duration: String(duration).trim(),
      startDate: startDate || undefined,
      maxSlots: safeMaxSlots,
      availableSlots: safeAvailableSlots,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      hirer: req.user._id,
      company: req.user.companyName || req.user.name
    });

    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hirer/opportunities
// @desc    Get hirer's opportunities
// @access  Private
router.get('/opportunities', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const opportunities = await Opportunity.find({ hirer: req.user._id })
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hirer/applications
// @desc    Get applications for hirer's opportunities
// @access  Private
router.get('/applications', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const opportunities = await Opportunity.find({ hirer: req.user._id });
    const opportunityIds = opportunities.map(o => o._id);

    const applications = await Application.find({ 
      opportunity: { $in: opportunityIds }
    })
      .populate('artist', 'name username avatar location artCategory')
      .populate('opportunity')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hirer/application/:id
// @desc    Update application status
// @access  Private
router.put('/application/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, notes, rejectionReason } = req.body;
    const allowedStatuses = new Set(['pending', 'shortlisted', 'in_review', 'hired', 'rejected']);
    if (!allowedStatuses.has(String(status || '').toLowerCase())) {
      return res.status(400).json({ message: 'Invalid application status' });
    }
    const nextStatus = String(status).toLowerCase();

    // Verify the hirer owns this application
    const application = await Application.findById(req.params.id)
      .populate('opportunity');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.opportunity.hirer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const previousStatus = application.status;
    application.status = nextStatus;
    if (notes) application.notes = notes;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    
    application.statusHistory.push({
      status: nextStatus,
      date: Date.now(),
      note: notes || ''
    });

    await application.save();

    // Keep available slots in sync when changing hired state
    if (previousStatus !== 'hired' && nextStatus === 'hired') {
      await Opportunity.findByIdAndUpdate(application.opportunity._id, { $inc: { availableSlots: -1 } });
    } else if (previousStatus === 'hired' && nextStatus !== 'hired') {
      await Opportunity.findByIdAndUpdate(application.opportunity._id, { $inc: { availableSlots: 1 } });
    }

    // Notify artist via chat thread so status updates are visible immediately
    if (previousStatus !== nextStatus) {
      const statusLabel = nextStatus === 'hired' ? 'accepted' : nextStatus;
      const infoMessage = await Message.create({
        sender: req.user._id,
        senderModel: 'Hirer',
        receiver: application.artist,
        receiverModel: 'Artist',
        opportunity: application.opportunity._id,
        content: `Your application for "${application.opportunity.title}" was ${statusLabel}.`,
      });

      const populatedMessage = await Message.findById(infoMessage._id)
        .populate('sender', 'name avatar username')
        .populate('receiver', 'name avatar username');

      const io = req.app.get('io');
      io.to(`user:${req.user._id.toString()}`).to(`user:${application.artist.toString()}`).emit('new_message', populatedMessage);
    }

    const populatedApplication = await Application.findById(application._id)
      .populate('artist', 'name username avatar location artCategory')
      .populate('opportunity');

    res.json(populatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hirer/tasks
// @desc    Get hirer's tasks
// @access  Private
router.get('/tasks', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tasks = await Task.find({ hirer: req.user._id })
      .populate('opportunity')
      .populate('artist', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/hirer/task
// @desc    Create a task
// @access  Private
router.post('/task', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = await Task.create({
      ...req.body,
      hirer: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hirer/task/:id
// @desc    Update task status
// @access  Private
router.put('/task/:id', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, rejectionReason } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, hirer: req.user._id },
      { status, rejectionReason },
      { new: true }
    ).populate('artist', 'name username').populate('opportunity');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/hirer/task/:id/release-payment
// @desc    Release payment for task
// @access  Private
router.post('/task/:id/release-payment', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, hirer: req.user._id },
      { 
        status: 'approved',
        paymentStatus: 'released',
        paymentReleasedAt: Date.now()
      },
      { new: true }
    ).populate('artist').populate('opportunity');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Create payment record
    await Payment.create({
      artist: task.artist._id,
      hirer: req.user._id,
      task: task._id,
      opportunity: task.opportunity._id,
      amount: task.amount,
      type: 'milestone',
      description: `Payment for ${task.milestone}`,
      projectName: task.opportunity.title,
      status: 'completed',
      paidAt: Date.now()
    });

    // Update hirer stats
    await Hirer.findByIdAndUpdate(req.user._id, {
      $inc: { totalSpent: task.amount }
    });

    res.json({ message: 'Payment released', task });
  } catch (error) {
    console.error('Release payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hirer/payments
// @desc    Get hirer's payments
// @access  Private
router.get('/payments', protect, async (req, res) => {
  try {
    if (req.userType !== 'Hirer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payments = await Payment.find({ hirer: req.user._id })
      .populate('artist', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
