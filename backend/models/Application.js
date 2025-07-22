const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant_email: {
      type: String,
      required: true,
      trim: true,
    },
    applicant_name: {
      type: String,
      required: true,
      trim: true,
    },
    resume_url: {
      type: String,
      trim: true,
    },
    cover_letter: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    // Additional fields that might be useful
    company_name: String, // Denormalized for easier queries
    company_logo: String, // Denormalized for easier display
    created_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ job_id: 1, applicant_email: 1 }, { unique: true });

// Index for querying applications by job
applicationSchema.index({ job_id: 1, status: 1 });

// Index for querying applications by applicant
applicationSchema.index({ applicant_email: 1, status: 1 });

// Virtual to populate job details
applicationSchema.virtual("job", {
  ref: "Job",
  localField: "job_id",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtual fields are serialized
applicationSchema.set("toJSON", { virtuals: true });
applicationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Application", applicationSchema);
