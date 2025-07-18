const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  role: { type: String, enum: ['student', 'recruiter'], required: true },
  // Student profile fields
  phone: String,
  location: String,
  education_level: String,
  field_of_study: String,
  graduation_year: String,
  skills: String,
  experience: String,
  bio: String,
  resume_url: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 