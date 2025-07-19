const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

router.post('/auth/google', async (req, res) => {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Request body:', req.body);
  const { credential, user_type } = req.body;
  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name } = payload;

    // Create full name from Google data
    const fullName = name || `${given_name || ''} ${family_name || ''}`.trim() || 'User';

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: fullName,
        email,
        password: '', // No password for Google users
        role: user_type,
      });
      await user.save();
    } else {
      // Update existing user's name if it changed
      if (user.name !== fullName) {
        user.name = fullName;
        await user.save();
      }
    }

    // Create JWT
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Return both token and user data
    res.json({ 
      token,
      user: {
        name: user.name,
        full_name: user.name, // Add full_name for consistency
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// Form-based login for students
router.post('/auth/student/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email, role: 'student' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user has a password (Google users might not have one)
    if (!user.password) {
      return res.status(401).json({ error: 'Please use Google login for this account' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Return user data and token
    res.json({
      token,
      user: {
        name: user.name,
        full_name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Student login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Form-based login for recruiters
router.post('/auth/recruiter/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email, role: 'recruiter' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user has a password (Google users might not have one)
    if (!user.password) {
      return res.status(401).json({ error: 'Please use Google login for this account' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Return user data and token
    res.json({
      token,
      user: {
        name: user.name,
        full_name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Recruiter login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router; 