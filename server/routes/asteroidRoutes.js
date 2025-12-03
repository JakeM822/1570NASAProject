// server/routes/asteroidRoutes.js
const express = require("express");
const router = express.Router();
const asteroidController = require("../controllers/asteroidController");
const { requireAuth } = require("../middleware/authMiddleware");

// Favorites – require login FIRST
router.get("/favorites/list", requireAuth, asteroidController.getFavorites);
router.post("/favorites", requireAuth, asteroidController.addFavorite);
router.delete("/favorites/:asteroidId", requireAuth, asteroidController.removeFavorite);

// Public endpoints
router.get("/feed", asteroidController.getFeed);
router.get("/browse", asteroidController.browse);

// THIS MUST BE LAST
router.get("/:id", asteroidController.getAsteroidById);

module.exports = router;
