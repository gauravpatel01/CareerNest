const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

// Get all applications (for recruiters - only their posted jobs/internships)
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const { status, applicant_email, job_id, internship_id, application_type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (applicant_email) filter.applicant_email = applicant_email;
    if (job_id) filter.job_id = job_id;
    if (internship_id) filter.internship_id = internship_id;
    if (application_type) filter.application_type = application_type;

    // If user is a recruiter, only show applications for their posted jobs/internships
    if (req.user.role === 'recruiter') {
      const recruiterEmail = req.user.email;
      
      // Get all jobs posted by this recruiter
      const recruiterJobs = await Job.find({ posted_by: recruiterEmail }).select('_id');
      const recruiterJobIds = recruiterJobs.map(job => job._id);
      
      // Get all internships posted by this recruiter
      const recruiterInternships = await Internship.find({ posted_by: recruiterEmail }).select('_id');
      const recruiterInternshipIds = recruiterInternships.map(internship => internship._id);
      
      // Filter applications to only show those for recruiter's jobs/internships
      const jobApplications = await Application.find({ 
        ...filter, 
        job_id: { $in: recruiterJobIds },
        application_type: 'job'
      }).populate('job_id');
      
      const internshipApplications = await Application.find({ 
        ...filter, 
        internship_id: { $in: recruiterInternshipIds },
        application_type: 'internship'
      }).populate('internship_id');
      
      const allApplications = [...jobApplications, ...internshipApplications];
      allApplications.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      
      return res.json(allApplications);
    }

    // For other users (admin, etc.), show all applications
    const applications = await Application.find(filter)
      .populate("job_id")
      .populate("internship_id")
      .sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Get single application by ID
router.get("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job_id")
      .populate("internship_id");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
});

// Create new application (for both jobs and internships)
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { job_id, internship_id, application_type } = req.body;

    // Validate application type and corresponding ID
    if (application_type === 'job') {
      if (!job_id) {
        return res.status(400).json({ error: "job_id is required for job applications" });
      }
      
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
        message: "Job application submitted successfully",
        application,
      });
    } else if (application_type === 'internship') {
      if (!internship_id) {
        return res.status(400).json({ error: "internship_id is required for internship applications" });
      }
      
      // Verify internship exists
      const internship = await Internship.findById(internship_id);
      if (!internship) {
        return res.status(404).json({ error: "Internship not found" });
      }

      // Add internship details to application
      const applicationData = {
        ...req.body,
        company_name: internship.company,
        company_logo: internship.company_logo,
      };

      const application = new Application(applicationData);
      await application.save();

      res.status(201).json({
        message: "Internship application submitted successfully",
        application,
      });
    } else {
      return res.status(400).json({ error: "Invalid application_type. Must be 'job' or 'internship'" });
    }
  } catch (error) {
    next(error);
  }
});

// Update application status
router.patch("/:id/status", authenticateJWT, async (req, res, next) => {
  try {
    const { status } = req.body;
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
      application_type: 'job'
    })
    .populate('job_id')
    .sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Get applications by internship ID
router.get("/internship/:internshipId", async (req, res, next) => {
  try {
    const applications = await Application.find({
      internship_id: req.params.internshipId,
      application_type: 'internship'
    })
    .populate('internship_id')
    .sort({ created_date: -1 });

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
      .populate("internship_id")
      .sort({ created_date: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
