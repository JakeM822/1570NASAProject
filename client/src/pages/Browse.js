import { useEffect, useState, useMemo } from "react";
import api from "../api/axiosConfig";
import "../styles/browse.css";
import FloatingAsteroids from "../components/FloatingAsteroids";

export default function Browse() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);

  // Filters
  const [orbitingBody, setOrbitingBody] = useState("all");
  const [hazard, setHazard] = useState("all");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    api.get(`/asteroids/browse?page=${page}`).then(res => setData(res.data));
  }, [page]);

  // Derived filtered + sorted asteroids
  const filteredAsteroids = useMemo(() => {
    if (!data?.near_earth_objects) return [];

    let asteroids = [...data.near_earth_objects];

    // Filter by orbiting body
    if (orbitingBody !== "all") {
      asteroids = asteroids.filter(a => {
      const body = a.close_approach_data?.[0]?.orbiting_body?.toLowerCase();
      return body === orbitingBody.toLowerCase();
      });
    }

    // Filter by hazard level
    if (hazard !== "all") {
      const isHaz = hazard === "hazardous";
      asteroids = asteroids.filter(a => a.is_potentially_hazardous_asteroid === isHaz);
    }

    // Sorting
    if (sortBy === "alpha") {
      asteroids.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (sortBy === "size") {
      asteroids.sort((a, b) => {
        const aSize = a.estimated_diameter.meters.estimated_diameter_max;
        const bSize = b.estimated_diameter.meters.estimated_diameter_max;
        return bSize - aSize;
      });
    } 
    else if (sortBy === "velocity") {
      asteroids.sort((a, b) => {
        const aVel = parseFloat(a.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 0);
        const bVel = parseFloat(b.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 0);
        return bVel - aVel;
      });
    }

    return asteroids;
  }, [data, orbitingBody, hazard, sortBy]);

  return (
    <div className="browse-container">
      <FloatingAsteroids />
      <h2>Browse Near-Earth Asteroids</h2>

      {/* Filter Bar */}
      <div className="filters">
        <select value={orbitingBody} onChange={e => setOrbitingBody(e.target.value)}>
          <option value="all">All Orbits</option>
          <option value="earth">Earth</option>
          <option value="mars">Mars</option>
          <option value="jupiter">Jupiter</option>
          <option value="venus">Venus</option>
          <option value="merc">Mercury</option>
          <option value="saturn">Saturn</option>
        </select>

        <select value={hazard} onChange={e => setHazard(e.target.value)}>
          <option value="all">All Safety Levels</option>
          <option value="hazardous">Hazardous Only</option>
          <option value="safe">Safe Only</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">No Sorting</option>
          <option value="alpha">Alphabetical (A→Z)</option>
          <option value="size">Largest → Smallest</option>
          <option value="velocity">Fastest → Slowest</option>
        </select>
      </div>

      {/* Result Count */}
      <p className="results-count">
        Showing {filteredAsteroids.length} asteroids
      </p>

      {/* Asteroid Cards */}
      <div className="asteroid-grid">
        {filteredAsteroids.map(ast => (
          <div key={ast.id} className="asteroid-card">
            <h3>{ast.name}</h3>

            <p>
              <strong>Orbiting:</strong> 
              {ast.close_approach_data?.[0]?.orbiting_body || "Unknown"}
            </p>
            <p>
              <strong>Max Diameter:</strong>{" "}
              {ast.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m
            </p>
            <p>
              <strong>Velocity:</strong>{" "}
              {parseFloat(ast.close_approach_data[0]?.relative_velocity.kilometers_per_hour)
                .toFixed(0)} km/h
            </p>

            <p className={ast.is_potentially_hazardous_asteroid ? "hazard" : "safe"}>
              {ast.is_potentially_hazardous_asteroid ? "⚠️ Hazardous" : "✓ Safe"}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 0}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
