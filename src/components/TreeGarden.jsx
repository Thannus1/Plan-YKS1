
// src/components/TreeGarden.jsx
import React from "react";
import "./TreeGarden.css";

export default function TreeGarden({ progress }) {
  // progress: % ilerleme (0–100)
  const getStage = () => {
    if (progress < 20) return "🌱 Fidan";
    if (progress < 50) return "🌿 Küçük Ağaç";
    if (progress < 80) return "🌸 Çiçek Açtı";
    return "🌳 Meyve Veren Ağaç";
  };

  return (
    <div className="tree-garden-container">
      <h2 className="text-xl font-bold mb-4">🌱 İlerleme Tarlası</h2>
      <div className="tree-stage text-6xl">{getStage()}</div>
      <p className="mt-2">İlerleme: %{progress}</p>
    </div>
  );
}
