
// src/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-start p-10">
      {/* Başlık */}
      <h1 className="text-5xl font-extrabold text-center text-black mb-12">
        ⭐ Seviyene Özel Koçluk
      </h1>

      {/* Özellik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {/* İlerleme Tarlası Buton-Kart */}
        <Link to="/plan?tab=garden">
          <div className="cursor-pointer bg-black text-yellow-300 p-10 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <h2 className="text-3xl font-bold mb-4">🌱 İlerleme Tarlası</h2>
            <p className="text-lg">
              Konuları bitirdikçe fidanını büyüt, çiçek açtır ve meyve toplamanı izle.
            </p>
          </div>
        </Link>

        {/* Planlayıcı Buton-Kart */}
        <Link to="/plan?tab=planner">
          <div className="cursor-pointer bg-black text-yellow-300 p-10 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <h2 className="text-3xl font-bold mb-4">📖 Planlayıcı</h2>
            <p className="text-lg">
              Tüm konularını düzenle, kendine özel çalışma planı oluştur.
            </p>
          </div>
        </Link>

        {/* Deneme Analiz Sistemi Buton-Kart */}
        <Link to="/analysis">
          <div className="cursor-pointer bg-black text-yellow-300 p-10 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <h2 className="text-3xl font-bold mb-4">📊 Deneme Analiz Sistemi</h2>
            <p className="text-lg">
              Girdiğin denemeleri analiz et, hangi konulara öncelik vermen gerektiğini öğren.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
