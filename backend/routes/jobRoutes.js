const express = require("express");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const router = express.Router();

// Get all jobs/internships
router.get("/", async (req, res, next) => {
  try {
    const { job_type, location, status = "active" } = req.query;
    const filter = { status };

    if (job_type) filter.job_type = job_type;
    if (location) filter.location = location;

    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// Get single job/internship by ID
router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Create new job/internship
router.post("/", async (req, res, next) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
});

// Update job/internship
router.put("/:id", async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
});

// Delete job/internship
router.delete("/:id", async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Legacy routes for backward compatibility
// Get all internships (legacy - using Internship model)
router.get("/internships", async (req, res, next) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (error) {
    next(error);
  }
});

// Get single internship by ID (legacy)
router.get("/internships/:id", async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.json(internship);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
