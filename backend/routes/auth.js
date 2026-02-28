const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const Artist = require('../models/Artist');
const Hirer = require('../models/Hirer');
const { generateToken, protect } = require('../middleware/auth');
const { sendOTPEmail } = require('../config/mailer');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// In-memory reset flow store.
// For production, move this to Redis or a persistent store.
const resetStoreByEmail = new Map();
const resetStoreByToken = new Map();

// @route   POST /api/auth/signup
// @desc    Register a new artist or hirer
// @access  Public
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['artist', 'hirer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user already exists in either collection
    const existingArtist = await Artist.findOne({ email: email.toLowerCase() });
    const existingHirer = await Hirer.findOne({ email: email.toLowerCase() });

    if (existingArtist || existingHirer) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    let user;
    if (role === 'artist') {
      // Generate username from name
      const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      
      user = await Artist.create({
        name,
        email: email.toLowerCase(),
        password,
        username
      });
    } else {
      user = await Hirer.create({
        name,
        email: email.toLowerCase(),
        password
      });
    }

    const token = generateToken(user._id, role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password and role' });
    }

    let user;
    let userRole;

    // Try to find in Artist collection
    if (role === 'artist') {
      user = await Artist.findOne({ email: email.toLowerCase() });
      userRole = 'artist';
    } else if (role === 'hirer') {
      user = await Hirer.findOne({ email: email.toLowerCase() });
      userRole = 'hirer';
    } else {
      // Try both collections
      user = await Artist.findOne({ email: email.toLowerCase() });
      if (user) {
        userRole = 'artist';
      } else {
        user = await Hirer.findOne({ email: email.toLowerCase() });
        userRole = 'hirer';
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, userRole);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: String(req.userType || '').toLowerCase(),
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Check both collections
    let user = await Artist.findOne({ email: email.toLowerCase() });
    let userRole = user ? 'artist' : null;

    if (!user) {
      user = await Hirer.findOne({ email: email.toLowerCase() });
      userRole = user ? 'hirer' : null;
    }

    // Don't reveal if user exists or not
    if (!user) {
      return res.json({ message: 'If an account exists, a reset code has been sent' });
    }

    // Generate OTP and hold reset state.
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    resetStoreByEmail.set(email.toLowerCase(), {
      otp,
      otpExpiresAt,
      resetToken: null,
      role: userRole
    });

    try {
      await sendOTPEmail(email.toLowerCase(), otp);
    } catch (mailErr) {
      console.error('Send OTP email error:', mailErr);
      resetStoreByEmail.delete(email.toLowerCase());
      return res.status(500).json({ message: 'Failed to send reset code. Please try again.' });
    }

    res.json({ message: 'If an account exists, a reset code has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    const payload = resetStoreByToken.get(token);
    if (!payload || payload.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const email = payload.email.toLowerCase();

    let user = await Artist.findOne({ email });
    if (!user) {
      user = await Hirer.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    resetStoreByToken.delete(token);
    resetStoreByEmail.delete(email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = req.user;
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const record = resetStoreByEmail.get(email.toLowerCase());

    if (!record || record.otpExpiresAt < Date.now() || record.otp !== String(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

    resetStoreByEmail.set(email.toLowerCase(), {
      ...record,
      resetToken
    });
    resetStoreByToken.set(resetToken, {
      email: email.toLowerCase(),
      expiresAt
    });

    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
