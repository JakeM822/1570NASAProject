const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// ---------------------- SIGNUP ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      passwordHash: hash,
    });

    // store user in session
    req.session.userId = user._id;

    return res.json({ message: "Signup successful", user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed." });
  }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.passwordHash === "GITHUB_OAUTH") {
      return res
        .status(400)
        .json({ error: "This account is GitHub-only. Use GitHub login." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    req.session.userId = user._id;

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed." });
  }
});

// ---------------------- LOGOUT ----------------------
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// ---------------------- CHECK SESSION ----------------------
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }

  const user = await User.findById(req.session.userId).lean();
  if (!user) return res.json({ user: null });

  return res.json({
  user: {
    id: user._id,
    name: user.name || "",
    email: user.email,
    role: user.role || "user",
    createdAt: user.createdAt,
    }
  });
});

module.exports = router;
