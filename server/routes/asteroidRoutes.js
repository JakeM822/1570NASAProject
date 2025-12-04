// server/routes/asteroidRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const asteroidController = require("../controllers/asteroidController");
const { requireAuth } = require("../middleware/authMiddleware");

// Favorites – require login FIRST
router.get("/favorites/list", requireAuth, asteroidController.getFavorites);
router.post("/favorites", requireAuth, asteroidController.addFavorite);
router.delete("/favorites/:asteroidId", requireAuth, asteroidController.removeFavorite);

// Public endpoints
router.get("/feed", asteroidController.getFeed);
router.get("/browse", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const pagesToFetch = 5; // fetch 5 NASA pages at once
    const size = 20; // NASA default
    const API_KEY = process.env.NASA_API_KEY;

    let combined = [];

    // Fetch multiple pages
    for (let i = 0; i < pagesToFetch; i++) {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page +
        i}&size=${size}&api_key=${API_KEY}`;

      const nasaRes = await axios.get(url);

      combined.push(...nasaRes.data.near_earth_objects);
    }

    res.json({
      page,
      total_objects: combined.length,
      near_earth_objects: combined
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch combined asteroid data." });
  }
});


// THIS MUST BE LAST
router.get("/:id", asteroidController.getAsteroidById);

module.exports = router;
