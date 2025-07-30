const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// Seed 3 sample internships
router.post('/seed-internships', async (req, res) => {
  try {
    const samples = [
      {
        title: 'Frontend Developer Intern',
        company: 'Tech Innovators',
        description: 'Work on exciting frontend projects using React.',
        location: 'Bangalore',
        stipend: '₹10,000/month',
        duration: '3 months',
        requirements: 'Basic knowledge of React and JavaScript.'
      },
      {
        title: 'Data Analyst Intern',
        company: 'DataWiz',
        description: 'Assist in data analysis and visualization tasks.',
        location: 'Delhi',
        stipend: '₹12,000/month',
        duration: '6 months',
        requirements: 'Familiarity with Python and Excel.'
      },
      {
        title: 'Marketing Intern',
        company: 'BrandBoost',
        description: 'Support digital marketing campaigns and content creation.',
        location: 'Mumbai',
        stipend: '₹8,000/month',
        duration: '2 months',
        requirements: 'Good communication skills and social media knowledge.'
      }
    ];
    await Internship.insertMany(samples);
    res.json({ message: 'Sample internships seeded!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed internships.' });
  }
});

// Add internship creation endpoint for recruiters
router.post('/internships/create', async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.status(201).json({ 
      message: 'Internship created successfully and pending admin approval', 
      internship 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create internship.' });
  }
});

// Admin approval endpoint for internships
router.put('/internships/:id/approve', async (req, res) => {
  try {
    const { status, comments } = req.body;
    const adminEmail = req.headers['x-admin-email'] || 'admin@careernest.com';
    
    const updateData = {
      status,
      admin_review: {
        reviewed_by: adminEmail,
        reviewed_at: new Date(),
        comments: comments || ""
      }
    };

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    
    res.json({
      message: `Internship ${status} successfully`,
      internship,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update internship status.' });
  }
});

// PUT update internship status by id (legacy)
router.put('/internships/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json({ message: 'Internship status updated', internship });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update internship status.' });
  }
});

// GET all internships (optionally filter by status)
router.get('/internships', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    // Only show approved internships to students (unless admin is requesting)
    const isAdmin = req.headers['x-admin-auth'] === 'true';
    if (!isAdmin) {
      filter.status = "approved";
    }
    
    const internships = await Internship.find(filter).sort({ postedAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch internships.' });
  }
});

module.exports = router; 