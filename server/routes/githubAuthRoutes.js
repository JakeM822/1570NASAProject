// routes/githubAuthRoutes.js
const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/login-failed",
  }),
  (req, res) => {
    // Successful auth → redirect to frontend profile page
    res.redirect("http://localhost:3000/profile");
  }
);

router.get("/login-failed", (req, res) => {
  res.status(401).json({ error: "GitHub login failed" });
});

module.exports = router;
