import React from "react";
import "./FloatingAsteroids.css";

const images = [
  "https://static.vecteezy.com/system/resources/previews/059/494/136/non_2x/dark-gray-asteroid-3d-render-on-transparent-background-free-png.png",
  "https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-round-asteroid-with-rough-cratered-surface-png-image_16209671.png",
  "https://static.vecteezy.com/system/resources/thumbnails/023/575/370/small_2x/asteroid-floating-on-a-clear-canvas-appearing-almost-within-reach-with-its-realistic-details-and-textures-generative-ai-png.png",
  "https://png.pngtree.com/png-clipart/20250415/original/pngtree-realistic-3d-model-of-an-asteroid-in-space-png-image_20691706.png"
];

export default function FloatingAsteroids() {
  return (
    <div className="asteroid-background">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          className="floating-asteroid"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${80 + Math.random() * 120}px`
          }}
        />
      ))}
    </div>
  );
}
