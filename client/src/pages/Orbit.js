import React, { useEffect, useRef, useState } from "react"; 
import api from "../api/axiosConfig";
import "../styles/Orbit.css";

export default function Orbit() {
  const canvasRef = useRef(null);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch asteroid data
  useEffect(() => {
    const load = async () => {
      try {
        const today = "2024-01-01";
        const tomorrow = "2024-01-02";

        const res = await api.get("/asteroids/feed", {
          params: { start_date: today, end_date: tomorrow },
        });

        const objects = res.data.near_earth_objects[today] || [];

        // Take up to 15 asteroids and add angle + speed for rotation
        const simplified = objects.slice(0, 15).map((a) => {
          const approach = a.close_approach_data?.[0];
          const missKm = approach
            ? parseFloat(approach.miss_distance.kilometers)
            : null;

          return {
            id: a.id,
            name: a.name,
            hazardous: a.is_potentially_hazardous_asteroid,
            missKm,
            angle: Math.random() * Math.PI * 2,      // 🔥 NEW
            speed: 0.002 + Math.random() * 0.002      // 🔥 NEW
          };
        });

        setAsteroids(simplified.filter((a) => a.missKm !== null));
      } catch (err) {
        console.error("Orbit fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Draw + Animate Orbit Diagram
  useEffect(() => {
    if (!canvasRef.current || asteroids.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const distances = asteroids.map((a) => a.missKm);
    const minD = Math.min(...distances);
    const maxD = Math.max(...distances);

    const minOrbit = 80;
    const maxOrbit = Math.min(width, height) / 2 - 30;

    const scaleRadius = (d) => {
      if (maxD === minD) return (minOrbit + maxOrbit) / 2;
      const t = (d - minD) / (maxD - minD);
      return minOrbit + t * (maxOrbit - minOrbit);
    };

    function drawFrame() {
      // Background
      ctx.fillStyle = "#02030a";
      ctx.fillRect(0, 0, width, height);

      // Earth
      const earthRadius = 30;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1e90ff";
      ctx.fill();
      ctx.strokeStyle = "#66ffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Title
      ctx.fillStyle = "#66ffff";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Near-Earth Objects (not to scale)", cx, 30);

      // Draw each asteroid
      asteroids.forEach((a) => {
        a.angle += a.speed; // 🔥 ROTATION UPDATE

        const orbitR = scaleRadius(a.missKm);
        const x = cx + orbitR * Math.cos(a.angle);
        const y = cy + orbitR * Math.sin(a.angle);

        // Orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Asteroid
        ctx.beginPath();
        ctx.arc(x, y, a.hazardous ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = a.hazardous ? "#ff4444" : "#00ff88";
        ctx.fill();

        // Label
        ctx.font = "11px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(a.name, x + 8, y - 4);
      });

      requestAnimationFrame(drawFrame); // 🔥 create animation loop
    }

    drawFrame();
  }, [asteroids]);

  return (
    <div className="orbit-page">
      <h1 className="orbit-title">Orbital Diagram</h1>

      {loading && <p className="orbit-loading">Loading orbit data...</p>}

      <div className="orbit-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={700}
          height={500}
          className="orbit-canvas"
        />
      </div>

      <p className="orbit-caption">
        Rings show relative miss distance from Earth for selected near-Earth
        asteroids (data from NASA NEO API, not to scale).
      </p>
    </div>
  );
}
