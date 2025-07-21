const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  role: { type: String, enum: ['student', 'recruiter'], required: true },
  phone: String,
  // Student fields
  education_level: String,
  field_of_study: String,
  graduation_year: String,
  skills: String,
  experience: String,
  bio: String,
  // Recruiter fields
  company_name: String,
  company_size: String,
  industry: String,
  job_title: String,
  company_website: String,
  company_description: String,
  // Common fields
  location: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  github: String,
  linkedin: String,
  portfolio: String,
  about: String,
  image: String, // URL or base64
});

module.exports = mongoose.model('User', userSchema); 