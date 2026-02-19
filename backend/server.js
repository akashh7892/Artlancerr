require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artist');
const hirerRoutes = require('./routes/hirer');
const opportunityRoutes = require('./routes/opportunities');
const applicationRoutes = require('./routes/applications');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const categoryRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/hirer', hirerRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Artlancing API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
