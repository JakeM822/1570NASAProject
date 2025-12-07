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
// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function setCache(key, data) {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}
router.get("/feed", asteroidController.getFeed);
router.get("/browse", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const pagesToFetch = 1;
    const size = 20;
    const API_KEY = process.env.NASA_API_KEY;

    const cacheKey = `browse_${page}_${pagesToFetch}`;

    // ---- CHECK CACHE FIRST ----
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({
        fromCache: true,
        ...cached
      });
    }

    // ---- FETCH NASA PAGES ----
    let combined = [];

    for (let i = 0; i < pagesToFetch; i++) {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page + i}&size=${size}&api_key=${API_KEY}`;
      const nasaRes = await axios.get(url);
      combined.push(...nasaRes.data.near_earth_objects.map(obj => ({
        id: obj.id,
        name: obj.name,
        nasa_jpl_url: obj.nasa_jpl_url,
        estimated_diameter: obj.estimated_diameter,
        is_potentially_hazardous_asteroid: obj.is_potentially_hazardous_asteroid,
        close_approach_data: obj.close_approach_data
      })));
    }

    const payload = {
      page,
      total_objects: combined.length,
      near_earth_objects: combined,
    };

    // ---- STORE IN CACHE ----
    setCache(cacheKey, payload);

    return res.json({
      fromCache: false,
      ...payload
    });

  } catch (err) {
    console.error("BROWSE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch asteroid data." });
  }
});


// THIS MUST BE LAST
router.get("/:id", asteroidController.getAsteroidById);

module.exports = router;
