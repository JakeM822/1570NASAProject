const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");
console.log("ADMIN ROUTES LOADED");
// GET ALL USERS
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PROMOTE USER TO ADMIN
router.put("/users/:id/make-admin", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DEMOTE USER TO REGULAR USER
router.put("/users/:id/make-user", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "user" },
      { new: true }
    );
    res.json({ message: "User demoted", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE USER
router.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
