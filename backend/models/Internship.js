const mongoose = require("mongoose");
const internshipSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      enum: ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"],
    },
    stipend: String,
    duration: String,
    requirements: [String],
    skills: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    posted_by: String, // Email of recruiter who posted
    company_logo: String,
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Internship", internshipSchema);
