// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

console.log("authController contents:", authController);

// ------------------ Local Auth Endpoints ------------------
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

// ------------------ GitHub OAuth ------------------
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

// ------------------ EXPORT ROUTER AT THE END ------------------
module.exports = router;
