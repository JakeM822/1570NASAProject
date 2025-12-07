import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Feed() {
  const { user, loading } = useAuth();  // <-- FIXED

  const [asteroids, setAsteroids] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  useEffect(() => {
    loadAsteroids();
  }, []);

  const loadAsteroids = async () => {
    try {
      setLoadingFeed(true);

      const today = "2024-01-01";
      const tomorrow = "2024-01-02";

      const res = await api.get("/asteroids/feed", {
        params: { start_date: today, end_date: tomorrow },
      });

      const nearEarthObjects = res.data.near_earth_objects[today] || [];
      setAsteroids(nearEarthObjects);
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoadingFeed(false);
    }
  };

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

  // ---------------------------
  // FIX: Do not redirect until AuthContext is done loading
  // ---------------------------
  if (loading) {
    return null; // or a loading screen
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <div>
      <h1 className="glow">Asteroid Feed</h1>

      {loadingFeed && <p className="glow">Loading holographic data...</p>}

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
