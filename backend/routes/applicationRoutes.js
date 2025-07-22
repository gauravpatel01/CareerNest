const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const router = express.Router();

// Get all applications
router.get("/", async (req, res, next) => {
  try {
    const { status, applicant_email, job_id } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (applicant_email) filter.applicant_email = applicant_email;
    if (job_id) filter.job_id = job_id;

    const applications = await Application.find(filter)
      .populate("job_id")
      .sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Get single application by ID
router.get("/:id", async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job_id"
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
});

// Create new application
router.post("/", async (req, res, next) => {
  try {
    const { job_id } = req.body;

    // Verify job exists
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Add job details to application
    const applicationData = {
      ...req.body,
      company_name: job.company,
      company_logo: job.company_logo,
    };

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
});

// Update application status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    if (
      !["pending", "reviewed", "shortlisted", "rejected", "hired"].includes(
        status
      )
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
});

// Delete application
router.delete("/:id", async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Get applications by job ID
router.get("/job/:jobId", async (req, res, next) => {
  try {
    const applications = await Application.find({
      job_id: req.params.jobId,
    }).sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Get applications by applicant email
router.get("/applicant/:email", async (req, res, next) => {
  try {
    const applications = await Application.find({
      applicant_email: req.params.email,
    })
      .populate("job_id")
      .sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
