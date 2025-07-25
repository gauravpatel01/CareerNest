const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      enum: ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"],
    },
    salary_min: {
      type: Number,
      min: 0,
    },
    salary_max: {
      type: Number,
      min: 0,
    },
    stipend: {
      type: String, // For internships - can be used instead of salary_min/max
    },
    job_type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    experience_level: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    remote_option: {
      type: Boolean,
      default: false,
    },
    posted_by: {
      type: String, // Email of recruiter who posted
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    company_logo: {
      type: String, // Company logo URL
    },
    duration: {
      type: String, // For internships
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// Indexes for faster queries
jobSchema.index({ job_type: 1, location: 1, status: 1 });
jobSchema.index({ posted_by: 1 });
jobSchema.index({ status: 1, postedAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
