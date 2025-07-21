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
    res.status(201).json({ message: 'Internship created successfully', internship });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create internship.' });
  }
});

module.exports = router; 