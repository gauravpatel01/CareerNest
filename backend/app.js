const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Import routes
// const userRoutes = require('./routes/userRoutes');
const User = require("./models/User");
const Internship = require("./models/Internship");
const seedRoutes = require("./routes/seed");
const googleAuthRoutes = require("./routes/googleAuth");

const app = express();

// In-memory user storage
// const users = []; // This line is removed as per the edit hint.
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(seedRoutes);
app.use("/api", googleAuthRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
// app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("CareerNest Backend API");
});
// Route to fetch all internships
app.get("/internships", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch internships." });
  }
});
// Route to fetch a single internship by ID
app.get("/internships/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch internship." });
  }
});
// Register route
app.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    location,
    education_level,
    field_of_study,
    graduation_year,
    skills,
    experience,
    bio,
    resume_url,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      education_level,
      field_of_study,
      graduation_year,
      skills,
      experience,
      bio,
      resume_url,
    });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        education_level: user.education_level,
        field_of_study: user.field_of_study,
        graduation_year: user.graduation_year,
        skills: user.skills,
        experience: user.experience,
        bio: user.bio,
        resume_url: user.resume_url,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error registering user." });
  }
});
// Login route
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or role." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }
    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        education_level: user.education_level,
        field_of_study: user.field_of_study,
        graduation_year: user.graduation_year,
        skills: user.skills,
        experience: user.experience,
        bio: user.bio,
        resume_url: user.resume_url,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});
// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
