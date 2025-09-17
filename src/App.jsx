
// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Planlayici from "./Planlayici";
import DenemeAnaliz from "./DenemeAnaliz";
import { auth, loginWithGoogle, logout } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Normal auth state listener (popup ile giriş sonrası kullanıcıyı yakalar)
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      {/* Üst bar */}
      <div className="flex justify-end items-center gap-4 p-4 bg-yellow-100 shadow">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt="pp"
              className="w-8 h-8 rounded-full border"
            />
            <span className="font-medium">{user.displayName}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Çıkış
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Google ile Giriş Yap
          </button>
        )}
      </div>

      {/* Sayfa yönlendirmeleri */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Planlayici user={user} />} />
        <Route path="/analysis" element={<DenemeAnaliz user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
