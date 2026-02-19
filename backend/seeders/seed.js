require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const Artist = require('../models/Artist');
const Hirer = require('../models/Hirer');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Payment = require('../models/Payment');
const Promotion = require('../models/Promotion');
const Portfolio = require('../models/Portfolio');
const Category = require('../models/Category');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Artist.deleteMany({});
    await Hirer.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await Task.deleteMany({});
    await Message.deleteMany({});
    await Payment.deleteMany({});
    await Promotion.deleteMany({});
    await Portfolio.deleteMany({});
    await Category.deleteMany({});

    console.log('Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Film Director', type: 'art', icon: 'film', order: 1 },
      { name: 'Actor / Actress', type: 'art', icon: 'user', order: 2 },
      { name: 'Cinematographer', type: 'art', icon: 'camera', order: 3 },
      { name: 'Screenwriter', type: 'art', icon: 'edit', order: 4 },
      { name: 'Composer', type: 'art', icon: 'music', order: 5 },
      { name: 'Editor', type: 'art', icon: 'scissors', order: 6 },
      { name: 'Producer', type: 'art', icon: 'briefcase', order: 7 },
      { name: 'Animator', type: 'art', icon: 'play', order: 8 },
      { name: 'Dance / Choreography', type: 'art', icon: 'heart', order: 9 },
      { name: 'Costume Design', type: 'art', icon: 'shirt', order: 10 },
      { name: 'Makeup Artist', type: 'art', icon: 'sparkles', order: 11 },
    ]);
    console.log('Created categories');

    // Create Artists (Dummy data)
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const artists = await Artist.insertMany([
      {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: hashedPassword,
        username: 'alexrivera',
        phone: '+1 (555) 012-3456',
        location: 'Los Angeles, CA',
        bio: 'Professional filmmaker and visual storyteller. Specializing in narrative short films and music videos.',
        artCategory: 'Film Director',
        experience: '5+ years',
        profileViews: 1248,
        totalEarnings: 8500,
        instagram: '@alexrivera',
        twitter: '@alexrivera',
        youtube: 'AlexRiveraFilms',
        website: 'https://alexrivera.com'
      },
      {
        name: 'Maya Chen',
        email: 'maya@example.com',
        password: hashedPassword,
        username: 'mayachen',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Award-winning cinematographer with a passion for documentary storytelling.',
        artCategory: 'Cinematographer',
        experience: '7+ years',
        profileViews: 2156,
        totalEarnings: 15000,
        instagram: '@mayacinema'
      },
      {
        name: 'Jordan Miles',
        email: 'jordan@example.com',
        password: hashedPassword,
        username: 'jordanmiles',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        bio: 'Versatile actor with experience in theatre, film, and commercial work.',
        artCategory: 'Actor / Actress',
        experience: '3+ years',
        profileViews: 892,
        totalEarnings: 5200,
        instagram: '@jordanactors'
      },
      {
        name: 'Sarah Kim',
        email: 'sarah@example.com',
        password: hashedPassword,
        username: 'sarahkim',
        phone: '+1 (555) 345-6789',
        location: 'Atlanta, GA',
        bio: 'Creative editor specializing in fast-paced commercials and music videos.',
        artCategory: 'Editor',
        experience: '4+ years',
        profileViews: 654,
        totalEarnings: 7800,
        youtube: 'SarahEdits'
      },
      {
        name: 'Michael Torres',
        email: 'michael@example.com',
        password: hashedPassword,
        username: 'michaeltorres',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        bio: 'Talented composer creating original scores for film and television.',
        artCategory: 'Composer',
        experience: '6+ years',
        profileViews: 1023,
        totalEarnings: 12000,
        website: 'https://michaeltorresmusic.com'
      },
      {
        name: 'Emily Watson',
        email: 'emily@example.com',
        password: hashedPassword,
        username: 'emilywatson',
        phone: '+1 (555) 567-8901',
        location: 'Chicago, IL',
        bio: 'Professional choreographer for music videos and live performances.',
        artCategory: 'Dance / Choreography',
        experience: '8+ years',
        profileViews: 1876,
        totalEarnings: 18500,
        instagram: '@emilydance'
      },
      {
        name: 'David Park',
        email: 'david@example.com',
        password: hashedPassword,
        username: 'davidpark',
        phone: '+1 (555) 678-9012',
        location: 'Seattle, WA',
        bio: '3D animator with expertise in character animation and VFX.',
        artCategory: 'Animator',
        experience: '5+ years',
        profileViews: 1456,
        totalEarnings: 9500,
        youtube: 'DavidAnimates'
      },
      {
        name: 'Lisa Johnson',
        email: 'lisa@example.com',
        password: hashedPassword,
        username: 'lisajohnson',
        phone: '+1 (555) 789-0123',
        location: 'Miami, FL',
        bio: 'Makeup artist specializing in SFX and period pieces.',
        artCategory: 'Makeup Artist',
        experience: '10+ years',
        profileViews: 2341,
        totalEarnings: 22000,
        instagram: '@lisamakeup'
      }
    ]);
    console.log('Created artists');

    // Create Hirers
    const hirers = await Hirer.insertMany([
      {
        name: 'John Smith',
        email: 'john@stellarproductions.com',
        password: hashedPassword,
        companyName: 'Stellar Productions',
        phone: '+1 (555) 111-2222',
        location: 'Los Angeles, CA',
        industry: 'Film Production',
        companySize: '11-50',
        totalSpent: 45000,
        artistsHired: 12
      },
      {
        name: 'Emily Brown',
        email: 'emily@moonlightstudios.com',
        password: hashedPassword,
        companyName: 'Moonlight Studios',
        phone: '+1 (555) 222-3333',
        location: 'New York, NY',
        industry: 'Film & TV',
        companySize: '51-200',
        totalSpent: 75000,
        artistsHired: 25
      },
      {
        name: 'Robert Wilson',
        email: 'robert@rhythmlabs.com',
        password: hashedPassword,
        companyName: 'Rhythm Productions',
        phone: '+1 (555) 333-4444',
        location: 'Atlanta, GA',
        industry: 'Music Videos',
        companySize: '1-10',
        totalSpent: 28000,
        artistsHired: 8
      }
    ]);
    console.log('Created hirers');

    // Create Opportunities
    const opportunities = await Opportunity.insertMany([
      {
        title: 'Lead Cinematographer – Feature Film',
        type: 'Film & TV Production',
        description: 'Looking for an experienced cinematographer for a feature film shoot in Los Angeles.',
        location: 'Los Angeles, CA',
        budget: '$8,000 – $12,000',
        budgetMin: 8000,
        budgetMax: 12000,
        duration: '4 weeks',
        startDate: new Date('2026-03-01'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[0]._id,
        company: 'Stellar Productions',
        applicationCount: 23,
        status: 'active'
      },
      {
        title: 'Director of Photography for TV Pilot',
        type: 'Film & TV Production',
        description: 'Seeking a DoP for a new TV pilot project.',
        location: 'Atlanta, GA',
        budget: '$10,000 – $15,000',
        budgetMin: 10000,
        budgetMax: 15000,
        duration: '3 weeks',
        startDate: new Date('2026-02-15'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[1]._id,
        company: 'Moonlight Studios',
        applicationCount: 15,
        status: 'active'
      },
      {
        title: 'Videographer for Nike Campaign',
        type: 'Advertising & Commercial Shoots',
        description: 'Need a skilled videographer for a national advertising campaign.',
        location: 'New York, NY',
        budget: '$5,000 – $8,000',
        budgetMin: 5000,
        budgetMax: 8000,
        duration: '1 week',
        startDate: new Date('2026-02-01'),
        maxSlots: 2,
        availableSlots: 2,
        hirer: hirers[2]._id,
        company: 'Rhythm Productions',
        applicationCount: 11,
        status: 'active'
      },
      {
        title: 'Commercial Shoot – Auto Brand',
        type: 'Advertising & Commercial Shoots',
        description: 'Looking for a creative team for an automotive commercial shoot.',
        location: 'Detroit, MI',
        budget: '$6,000 – $9,000',
        budgetMin: 6000,
        budgetMax: 9000,
        duration: '5 days',
        startDate: new Date('2026-02-10'),
        maxSlots: 3,
        availableSlots: 3,
        hirer: hirers[0]._id,
        company: 'Stellar Productions',
        applicationCount: 8,
        status: 'active'
      },
      {
        title: 'Music Video Director',
        type: 'Music Videos',
        description: 'Seeking a visionary director for an upcoming music video.',
        location: 'New York, NY',
        budget: '$3,000 – $5,000',
        budgetMin: 3000,
        budgetMax: 5000,
        duration: '1 week',
        startDate: new Date('2026-01-25'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[2]._id,
        company: 'Rhythm Productions',
        applicationCount: 18,
        status: 'active'
      },
      {
        title: 'Cinematographer for Hip-Hop Video',
        type: 'Music Videos',
        description: 'Need a cinematographer with experience in music videos.',
        location: 'Los Angeles, CA',
        budget: '$4,000 – $6,000',
        budgetMin: 4000,
        budgetMax: 6000,
        duration: '3 days',
        startDate: new Date('2026-01-20'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[2]._id,
        company: 'Rhythm Productions',
        applicationCount: 12,
        status: 'active'
      },
      {
        title: 'Event Videographer – Tech Summit',
        type: 'Event Videography',
        description: 'Looking for videographers for a tech industry summit.',
        location: 'San Francisco, CA',
        budget: '$2,000 – $3,500',
        budgetMin: 2000,
        budgetMax: 3500,
        duration: '2 days',
        startDate: new Date('2026-02-05'),
        maxSlots: 4,
        availableSlots: 4,
        hirer: hirers[1]._id,
        company: 'Moonlight Studios',
        applicationCount: 9,
        status: 'active'
      },
      {
        title: 'Wedding Cinematographer – Luxury Package',
        type: 'Wedding Cinematography',
        description: 'Seeking an experienced wedding cinematographer for luxury events.',
        location: 'Miami, FL',
        budget: '$3,500 – $5,000',
        budgetMin: 3500,
        budgetMax: 5000,
        duration: '2 days',
        startDate: new Date('2026-03-15'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[0]._id,
        company: 'Stellar Productions',
        applicationCount: 7,
        status: 'active'
      },
      {
        title: 'Cinematographer for Feature Documentary',
        type: 'Documentary Production',
        description: 'Need a skilled cinematographer for a feature documentary.',
        location: 'San Francisco, CA',
        budget: '$7,000 – $10,000',
        budgetMin: 7000,
        budgetMax: 10000,
        duration: '4 weeks',
        startDate: new Date('2026-04-01'),
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[1]._id,
        company: 'Moonlight Studios',
        applicationCount: 14,
        status: 'active'
      },
      {
        title: 'Video Editor for Tech YouTube Channel',
        type: 'YouTubers Hiring Editors',
        description: 'Looking for a video editor for ongoing YouTube content.',
        location: 'Remote',
        budget: '$2,000 – $3,500/mo',
        budgetMin: 2000,
        budgetMax: 3500,
        duration: 'Ongoing',
        maxSlots: 1,
        availableSlots: 1,
        hirer: hirers[2]._id,
        company: 'Rhythm Productions',
        applicationCount: 21,
        status: 'active'
      }
    ]);
    console.log('Created opportunities');

    // Create Applications
    const applications = await Application.insertMany([
      {
        opportunity: opportunities[0]._id,
        artist: artists[0]._id,
        hirer: hirers[0]._id,
        status: 'shortlisted',
        coverLetter: 'I would love to be part of this exciting project...',
        proposedBudget: 10000,
        statusHistory: [
          { status: 'pending', date: Date.now() - 5 * 24 * 60 * 60 * 1000 },
          { status: 'shortlisted', date: Date.now() - 2 * 24 * 60 * 60 * 1000 }
        ]
      },
      {
        opportunity: opportunities[0]._id,
        artist: artists[1]._id,
        hirer: hirers[0]._id,
        status: 'in_review',
        coverLetter: 'With my experience in feature films...',
        proposedBudget: 11000,
        statusHistory: [
          { status: 'pending', date: Date.now() - 3 * 24 * 60 * 60 * 1000 }
        ]
      },
      {
        opportunity: opportunities[1]._id,
        artist: artists[1]._id,
        hirer: hirers[1]._id,
        status: 'hired',
        coverLetter: 'I am excited about this opportunity...',
        proposedBudget: 14000,
        statusHistory: [
          { status: 'pending', date: Date.now() - 7 * 24 * 60 * 60 * 1000 },
          { status: 'shortlisted', date: Date.now() - 5 * 24 * 60 * 60 * 1000 },
          { status: 'hired', date: Date.now() - 1 * 24 * 60 * 60 * 1000 }
        ]
      }
    ]);
    console.log('Created applications');

    // Create Tasks
    const tasks = await Task.insertMany([
      {
        title: 'Principal Photography',
        description: 'Complete all shooting for the music video',
        opportunity: opportunities[1]._id,
        artist: artists[1]._id,
        hirer: hirers[1]._id,
        milestone: 'Principal Photography',
        amount: 5000,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'submitted',
        progress: 100,
        paymentStatus: 'in_escrow'
      },
      {
        title: 'Initial Consultation & Planning',
        description: 'Research phase and location scouting',
        opportunity: opportunities[0]._id,
        artist: artists[0]._id,
        hirer: hirers[0]._id,
        milestone: 'Initial Consultation & Planning',
        amount: 2500,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'in_progress',
        progress: 60,
        paymentStatus: 'pending'
      },
      {
        title: 'Post-Production Edit',
        description: 'Final edit for the commercial',
        opportunity: opportunities[3]._id,
        artist: artists[3]._id,
        hirer: hirers[0]._id,
        milestone: 'Post-Production Edit',
        amount: 3000,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        progress: 85,
        paymentStatus: 'pending'
      }
    ]);
    console.log('Created tasks');

    // Create Payments
    await Payment.insertMany([
      {
        artist: artists[0]._id,
        hirer: hirers[0]._id,
        task: tasks[0]._id,
        opportunity: opportunities[1]._id,
        amount: 3500,
        type: 'milestone',
        description: 'Brand Commercial Shoot',
        projectName: 'Brand Commercial Shoot',
        status: 'completed',
        paidAt: new Date('2026-02-15')
      },
      {
        artist: artists[1]._id,
        hirer: hirers[1]._id,
        task: tasks[2]._id,
        opportunity: opportunities[1]._id,
        amount: 5000,
        type: 'milestone',
        description: 'Documentary Series',
        projectName: 'Documentary Series',
        status: 'pending'
      }
    ]);
    console.log('Created payments');

    // Create Messages
    await Message.insertMany([
      {
        sender: artists[0]._id,
        senderModel: 'Artist',
        receiver: hirers[0]._id,
        receiverModel: 'Hirer',
        content: 'Hi! I am interested in the cinematographer position. Could you tell me more about the project?',
        opportunity: opportunities[0]._id,
        isRead: true,
        readAt: Date.now() - 1 * 24 * 60 * 60 * 1000
      },
      {
        sender: hirers[0]._id,
        senderModel: 'Hirer',
        receiver: artists[0]._id,
        receiverModel: 'Artist',
        content: 'Thank you for your interest! It is a feature film about...',
        opportunity: opportunities[0]._id,
        isRead: false
      }
    ]);
    console.log('Created messages');

    // Create Portfolio items for artists
    await Portfolio.insertMany([
      {
        artist: artists[0]._id,
        title: 'Midnight Echo - Short Film',
        description: 'Award-winning short film about a musician finding her voice.',
        category: 'Film Director',
        workType: 'video',
        projectName: 'Midnight Echo',
        clientName: 'Independent',
        role: 'Director',
        views: 234,
        isPublic: true,
        isFeatured: true
      },
      {
        artist: artists[1]._id,
        title: 'City Lights Documentary',
        description: 'Documentary exploring life in urban neighborhoods.',
        category: 'Cinematographer',
        workType: 'video',
        projectName: 'City Lights',
        clientName: 'Independent',
        role: 'Cinematographer',
        views: 456,
        isPublic: true,
        isFeatured: true
      },
      {
        artist: artists[3]._id,
        title: 'Commercial Reel 2024',
        description: 'Showreel of commercial editing work.',
        category: 'Editor',
        workType: 'video',
        projectName: 'Commercial Reel',
        views: 189,
        isPublic: true,
        isFeatured: false
      }
    ]);
    console.log('Created portfolio items');

    // Create Promotions
    await Promotion.insertMany([
      {
        title: 'Featured Artist - Alex Rivera',
        description: 'Get featured on our homepage for maximum visibility',
        type: 'featured',
        targetType: 'Artist',
        target: artists[0]._id,
        duration: 7,
        price: 49,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Spotlight - Stellar Productions',
        description: 'Get highlighted in our artist searches',
        type: 'spotlight',
        targetType: 'Hirer',
        target: hirers[0]._id,
        duration: 14,
        price: 99,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log('Created promotions');

    console.log('Seed data created successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Artist: alex@example.com / password123');
    console.log('Hirer: john@stellarproductions.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
