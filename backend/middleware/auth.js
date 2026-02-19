const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');
const Hirer = require('../models/Hirer');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user is Artist or Hirer
      let user;
      user = await Artist.findById(decoded.id).select('-password');
      
      if (!user) {
        user = await Hirer.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      req.userType = user.constructor.modelName; // 'Artist' or 'Hirer'
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign(
    { id, userType },
    process.env.JWT_SECRET || 'artlancing-secret-key-2024',
    { expiresIn: '30d' }
  );
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artlancing-secret-key-2024');
      
      let user = await Artist.findById(decoded.id).select('-password');
      
      if (!user) {
        user = await Hirer.findById(decoded.id).select('-password');
      }

      if (user) {
        req.user = user;
        req.userType = user.constructor.modelName;
      }
    } catch (error) {
      // Token invalid, but we continue without user
    }
  }

  next();
};

module.exports = { protect, generateToken, optionalAuth };
