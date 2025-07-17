const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();
const users = []; // Use a DB in production
const JWT_SECRET = "yoursecret"; // Move to .env in production

// Register Route
router.post("/register", async (req, res) => {
  const {
    full_name,
    email,
    password,
    role = "student",
    phone,
    location,
    education_level,
    field_of_study,
    graduation_year,
    experience,
    skills,
    bio,
    resume_url
  } = req.body;
  console.log("Registering user:", req.body); // Log the request body for debugging

  if (!full_name || !email || !password || !role || !phone || !location || !education_level || !field_of_study || !graduation_year || !experience || !skills || !bio || !resume_url) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name: full_name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      education_level,
      field_of_study,
      graduation_year,
      experience,
      skills,
      bio,
      resume_url
    };
    users.push(newUser);

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error("Registration error:", err); // This will help you debug
    res.status(500).json({ error: "Error registering user." });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(404).json({ error: "User not found." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token });
});

module.exports = router;
