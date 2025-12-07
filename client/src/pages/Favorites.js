import { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/Fav.css";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [details, setDetails] = useState({}); // store asteroid NASA data

  useEffect(() => {
    api.get("/asteroids/favorites/list").then(async (res) => {
      const favs = res.data.favorites;
      setFavorites(favs);

      // Load NASA details for every favorite
      const detailPromises = favs.map((fav) =>
        api.get(`/asteroids/${fav.asteroidId}`)
      );

      const results = await Promise.all(detailPromises);

      const detailMap = {};
      results.forEach((r) => {
        detailMap[r.data.id] = r.data;
      });

      setDetails(detailMap);
    });
  }, []);

  const removeFavorite = async (asteroidId) => {
    await api.delete(`/asteroids/favorites/${asteroidId}`);
    setFavorites(favorites.filter((f) => f.asteroidId !== asteroidId));
  };

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">{user?.name}'s Favorite Asteroids</h1>

      {favorites.length === 0 && (
        <p className="favorites-empty">No favorites yet. Add some from the Feed!</p>
      )}

      <div className="favorites-grid">
        {favorites.map((fav) => {
          const info = details[fav.asteroidId];

          return (
            <div key={fav.asteroidId} className="favorite-card">
              <h2>{fav.name}</h2>

              <p className="hazard">
                Hazardous:
                <span className={fav.hazardous ? "danger" : "safe"}>
                  {fav.hazardous ? " YES" : " NO"}
                </span>
              </p>

              {info && (
                <div className="details">
                  <p><strong>Magnitude:</strong> {info.absolute_magnitude_h}</p>

                  <p>
                    <strong>Diameter:</strong>{" "}
                    {Math.round(
                      info.estimated_diameter.meters.estimated_diameter_max
                    )}{" "}
                    m
                  </p>

                  <p>
                    <strong>Closest Velocity:</strong>{" "}
                    {Math.round(
                      info.close_approach_data?.[0]?.relative_velocity
                        ?.kilometers_per_hour
                    ).toLocaleString()}{" "}
                    km/h
                  </p>

                  <p>
                    <strong>Miss Distance:</strong>{" "}
                    {Math.round(
                      info.close_approach_data?.[0]?.miss_distance?.kilometers
                    ).toLocaleString()}{" "}
                    km
                  </p>

                  <p>
                    <strong>Orbiting Body:</strong>{" "}
                    {info.close_approach_data?.[0]?.orbiting_body}
                  </p>
                </div>
              )}

              <button
                className="remove-btn"
                onClick={() => removeFavorite(fav.asteroidId)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
