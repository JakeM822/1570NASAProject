const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json(null);
    }

    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.json(null);

    return res.json({
      id: user._id,
      name: user.name || "",
      email: user.email,
      createdAt: user.createdAt,
    });

  } catch (err) {
    console.error("ME route error:", err);
    res.status(500).json({ error: "Failed to load user." });
  }
});

module.exports = router;
