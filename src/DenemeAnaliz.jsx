// src/DenemeAnaliz.jsx
import React, { useState, useEffect } from "react";
import { TOPIC_BANK } from "./Planlayici";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Soru sayıları
const SORU_SAYILARI = {
  "Tyt Turkce": 40,
  "Tyt Tarih": 5,
  "Tyt Cografya": 5,
  "Tyt Felsefe": 5,
  "Tyt Din": 5,
  "Tyt Matematik": 30,
  "Tyt Fizik": 7,
  "Tyt Kimya": 7,
  "Tyt Biyoloji": 6,
  "Ayt Matematik": 32,
  "Ayt Fizik": 14,
  "Ayt Kimya": 13,
  "Ayt Biyoloji": 13,
  "Ayt Edebiyat": 14,
  "Ayt Tarih" : 21,
  "Ayt Coğrafya" : 17,
  "Ayt Felsefe" : 12,
  "Ayt Din" : 6,
  "Ayt Geometri" : 8,
  "Tyt Geometri" : 10,
};

export default function DenemeAnaliz() {
  const [denemeler, setDenemeler] = useState([]);
  const [denemeAdi, setDenemeAdi] = useState("");
  const [tur, setTur] = useState("Tyt");
  const [activeCell, setActiveCell] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, "users", user.uid, "denemeler");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDenemeler(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const denemeEkle = async () => {
    if (!denemeAdi || !user) return;
    const ref = collection(db, "users", user.uid, "denemeler");
    await addDoc(ref, { ad: denemeAdi, tur, yanlislar: {} });
    setDenemeAdi("");
  };

  const denemeSil = async (denemeId) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "denemeler", denemeId);
    await deleteDoc(ref);
  };

  const toggleDurum = async (denemeId, ders, konu, type) => {
    const hedef = denemeler.find((d) => d.id === denemeId);
    if (!hedef) return;
    const mevcutDurum = hedef?.yanlislar?.[ders]?.[konu]?.[type] || false;
    const ref = doc(db, "users", user.uid, "denemeler", denemeId);
    await updateDoc(ref, {
      [`yanlislar.${ders}.${konu}.${type}`]: !mevcutDurum,
    });

    const yeniDenemeler = denemeler.map((d) =>
      d.id === denemeId
        ? {
            ...d,
            yanlislar: {
              ...d.yanlislar,
              [ders]: {
                ...(d.yanlislar?.[ders] || {}),
                [konu]: {
                  ...(d.yanlislar?.[ders]?.[konu] || { yanlis: false, bos: false }),
                  [type]: !mevcutDurum,
                },
              },
            },
          }
        : d
    );
    setDenemeler(yeniDenemeler);
  };

  const analizYap = () => {
    const sayac = {};
    denemeler.forEach((d) => {
      Object.entries(d.yanlislar || {}).forEach(([ders, konular]) => {
        Object.entries(konular).forEach(([konu, durum]) => {
          if (durum.yanlis) {
            sayac[konu] = (sayac[konu] || 0) + 1;
          }
        });
      });
    });

    const oncelik1 = [], oncelik2 = [], oncelik3 = [];
    Object.entries(sayac).forEach(([konu, count]) => {
      if (count >= 3) oncelik1.push(konu);
      else if (count === 2) oncelik2.push(konu);
      else if (count === 1) oncelik3.push(konu);
    });

    return { oncelik1, oncelik2, oncelik3 };
  };

  const { oncelik1, oncelik2, oncelik3 } = analizYap();

  const Modal = ({ ders, denemeId, denemeler }) => {
    const deneme = denemeler.find((d) => d.id === denemeId);
    if (!deneme) return null;
    const dersKey = Object.keys(TOPIC_BANK).find(
      (k) =>
        k.toLowerCase().includes(deneme.tur.toLowerCase()) &&
        k.toLowerCase().includes(ders.toLowerCase())
    );
    const konular = TOPIC_BANK[dersKey] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {deneme.ad} - {ders} Konuları
          </h2>
          {konular.map((k) => (
            <div key={k.name} className="flex items-center gap-2 mb-2">
              <span className="flex-1">{k.name}</span>
              <label>
                <input
                  type="checkbox"
                  checked={!!deneme?.yanlislar?.[ders]?.[k.name]?.yanlis}
                  onChange={() => toggleDurum(deneme.id, ders, k.name, "yanlis")}
                /> ❌
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!deneme?.yanlislar?.[ders]?.[k.name]?.bos}
                  onChange={() => toggleDurum(deneme.id, ders, k.name, "bos")}
                /> ⭕
              </label>
            </div>
          ))}
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 rounded"
            onClick={() => setActiveCell(null)}
          >
            Kapat
          </button>
        </div>
      </div>
    );
  };

  const dersListesi = Object.keys(TOPIC_BANK)
    .filter((key) => key.toLowerCase().startsWith(tur.toLowerCase()))
    .map((k) => k.replace(new RegExp(`^${tur}\\s`, "i"), ""));

  const hesaplaNet = (deneme) => {
    let toplamDogru = 0, toplamYanlis = 0, toplamBos = 0;
    Object.entries(deneme.yanlislar || {}).forEach(([ders, konular]) => {
      const dersKey = Object.keys(SORU_SAYILARI).find(
        (k) =>
          k.toLowerCase().includes(deneme.tur.toLowerCase()) &&
          k.toLowerCase().includes(ders.toLowerCase())
      );
      const soruSayisi = SORU_SAYILARI[dersKey] || 0;
      let yanlis = 0, bos = 0;
      Object.values(konular).forEach((durum) => {
        if (durum.yanlis) yanlis++;
        if (durum.bos) bos++;
      });
      const dogru = Math.max(0, soruSayisi - yanlis - bos);
      toplamDogru += dogru;
      toplamYanlis += yanlis;
      toplamBos += bos;
    });
    const net = toplamDogru - toplamYanlis / 4;
    return { dogru: toplamDogru, yanlis: toplamYanlis, bos: toplamBos, net };
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Deneme Analiz Sistemi</h1>

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Deneme adı"
          value={denemeAdi}
          onChange={(e) => setDenemeAdi(e.target.value)}
          className="border p-2 flex-1"
        />
        <select value={tur} onChange={(e) => setTur(e.target.value)}>
          <option value="Tyt">TYT</option>
          <option value="Ayt">AYT</option>
        </select>
        <button
          onClick={denemeEkle}
          className="px-4 py-2 bg-yellow-500 font-bold rounded"
        >
          ➕ Ekle
        </button>
      </div>

      {/* Tablo: YAN YANA SIRALAMA DÜZELTİLDİ */}
      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="border px-4 py-2 w-32">Dersler</th>
              {denemeler.map((d) => (
                <th key={d.id} className="border px-4 py-2 w-40 text-center">
                  {d.ad}
                  <button
                    onClick={() => denemeSil(d.id)}
                    className="text-red-500 ml-2"
                  >
                    🗑
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dersListesi.map((ders) => (
              <tr key={ders}>
                <td className="border px-4 py-2 font-bold">{ders}</td>
                {denemeler.map((d) => (
                  <td
                    key={d.id}
                    className="border px-4 py-2 text-center cursor-pointer hover:bg-yellow-100"
                    onClick={() => setActiveCell({ ders, denemeId: d.id })}
                  >
                    📌
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeCell && (
        <Modal ders={activeCell.ders} denemeId={activeCell.denemeId} denemeler={denemeler} />
      )}

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📈 Net Sonuçları</h2>
        {denemeler.map((d) => {
          const { dogru, yanlis, bos, net } = hesaplaNet(d);
          return (
            <div key={d.id} className="mb-2">
              <strong>{d.ad}</strong>: ✅ {dogru} ❌ {yanlis} ⭕ {bos} → 🔢 Net: {net.toFixed(2)}
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">📌 Konu Çalışma Listesi</h2>
        <div>
          <h3 className="font-bold">1. Öncelikli Konular</h3>
          <ul className="list-disc ml-6">
            {oncelik1.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">2. Öncelikli Konular</h3>
          <ul className="list-disc ml-6">
            {oncelik2.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">3. Öncelikli Konular</h3>
          <ul className="list-disc ml-6">
            {oncelik3.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
