const express = require("express");
const Internship = require("../models/Internship");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

// Get all internships (only approved ones for students)
router.get("/", async (req, res, next) => {
  try {
    const { location, status = "approved", posted_by } = req.query;
    const filter = { status };
    
    // Only show approved internships to students (unless admin is requesting)
    const isAdmin = req.headers['x-admin-auth'] === 'true';
    if (!isAdmin) {
      filter.status = "approved";
    }

    if (location) filter.location = location;
    if (posted_by) filter.posted_by = posted_by;

    const internships = await Internship.find(filter).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    next(error);
  }
});

// Get single internship by ID
router.get("/:id", async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    
    // Check if user can view this internship (approved or admin)
    const isAdmin = req.headers['x-admin-auth'] === 'true';
    if (!isAdmin && internship.status !== "approved") {
      return res.status(403).json({ error: "Internship not available" });
    }
    
    res.json(internship);
  } catch (error) {
    next(error);
  }
});

// Create new internship
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    // Only allow recruiters to post internships
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: "Only recruiters can post internships" });
    }
    
    const internship = new Internship({
      ...req.body,
      posted_by: req.user.email,
      status: "pending" // Default status
    });
    
    await internship.save();
    res.status(201).json({
      message: "Internship created successfully and pending admin approval",
      internship,
    });
  } catch (error) {
    next(error);
  }
});

// Update internship
router.put("/:id", authenticateJWT, async (req, res, next) => {
  try {
    // Find the internship first to check ownership
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    
    // Only allow the recruiter who posted the internship to update it
    if (internship.posted_by !== req.user.email) {
      return res.status(403).json({ error: "You can only update internships you posted" });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Internship updated successfully",
      internship: updatedInternship,
    });
  } catch (error) {
    next(error);
  }
});

// Delete internship
router.delete("/:id", authenticateJWT, async (req, res, next) => {
  try {
    // Find the internship first to check ownership
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    
    // Only allow the recruiter who posted the internship to delete it
    if (internship.posted_by !== req.user.email) {
      return res.status(403).json({ error: "You can only delete internships you posted" });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Internship deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Admin approval endpoint
router.put("/:id/approve", async (req, res, next) => {
  try {
    const { status, comments } = req.body;
    const isAdmin = req.headers['x-admin-auth'] === 'true';
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can approve internships" });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    internship.status = status;
    if (comments) {
      internship.admin_comments = comments;
    }
    
    await internship.save();
    
    res.json({
      message: `Internship ${status} successfully`,
      internship,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 