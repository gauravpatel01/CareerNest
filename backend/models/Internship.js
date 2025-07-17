const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  stipend: String,
  duration: String,
  requirements: String,
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema); 