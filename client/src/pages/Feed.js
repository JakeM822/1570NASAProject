import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function Feed() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch asteroids from backend
  const loadAsteroids = async () => {
    try {
      setLoading(true);

      const today = "2024-01-01"; // DEFAULT START DATE
      const tomorrow = "2024-01-02";

      const res = await api.get("/asteroids/feed", {
        params: { start_date: today, end_date: tomorrow },
      });

      // NASA feed response is weird: asteroids are in a date-keyed object
      const nearEarthObjects = res.data.near_earth_objects[today] || [];

      setAsteroids(nearEarthObjects);
      setLoading(false);
    } catch (err) {
      console.error("Feed error:", err);
      setLoading(false);
    }
  };

  // Add favorite
  const addFavorite = async (asteroid) => {
    try {
      await api.post("/asteroids/favorites", {
        asteroidId: asteroid.id,
        name: asteroid.name,
        hazardous: asteroid.is_potentially_hazardous_asteroid,
      });

      alert("Added to favorites!");
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  useEffect(() => {
    loadAsteroids();
  }, []);

  return (
    <div>
      <h1 className="glow">Asteroid Feed</h1>

      {loading && <p className="glow">Loading holographic data...</p>}

      {asteroids.map((a) => (
        <div key={a.id} className="holo-card">
          <h2>{a.name}</h2>
          <p>Hazardous: {a.is_potentially_hazardous_asteroid ? "YES" : "NO"}</p>
          <p>Magnitude: {a.absolute_magnitude_h}</p>

          <button className="cyber-btn" onClick={() => addFavorite(a)}>
            Add to Favorites
          </button>
        </div>
      ))}
    </div>
  );
}

export default Feed;
