// server/controllers/asteroidController.js
const axios = require("axios");
const User = require("../models/User");

const NASA_BASE = "https://api.nasa.gov/neo/rest/v1";

function getApiKey() {
  return process.env.NASA_API_KEY || "DEMO_KEY";
}

// /api/asteroids/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
exports.getFeed = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date) {
      return res.status(400).json({ message: "start_date is required" });
    }

    const url = `${NASA_BASE}/feed`;
    const { data } = await axios.get(url, {
      params: {
        start_date,
        end_date,
        api_key: getApiKey()
      }
    });

    res.json(data);
  } catch (err) {
    console.error("getFeed error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching asteroid feed" });
  }
};

// /api/asteroids/browse?page=1
exports.browse = async (req, res) => {
  try {
    const page = req.query.page || 0;

    const url = `${NASA_BASE}/neo/browse`;
    const { data } = await axios.get(url, {
      params: { page, api_key: getApiKey() }
    });

    res.json(data);
  } catch (err) {
    console.error("browse error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error browsing asteroids" });
  }
};

// /api/asteroids/:id
exports.getAsteroidById = async (req, res) => {
  try {
    const { id } = req.params;

    const url = `${NASA_BASE}/neo/${id}`;
    const { data } = await axios.get(url, {
      params: { api_key: getApiKey() }
    });

    res.json(data);
  } catch (err) {
    console.error("getAsteroidById error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching asteroid" });
  }
};

// FAVORITES

// POST /api/asteroids/favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { asteroidId, name, hazardous } = req.body;

    if (!asteroidId || !name) {
      return res.status(400).json({ message: "asteroidId and name are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.favorites.some((fav) => fav.asteroidId === asteroidId);
    if (!exists) {
      user.favorites.push({ asteroidId, name, hazardous: !!hazardous });
      await user.save();
    }

    res.status(201).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    console.error("addFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/asteroids/favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    console.error("getFavorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/asteroids/favorites/:asteroidId
exports.removeFavorite = async (req, res) => {
  try {
    const { asteroidId } = req.params;

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter((fav) => fav.asteroidId !== asteroidId);
    await user.save();

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (err) {
    console.error("removeFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
