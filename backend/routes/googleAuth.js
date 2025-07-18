const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const { email, name } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: '', // No password for Google users
        role: user_type,
      });
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

module.exports = router; 