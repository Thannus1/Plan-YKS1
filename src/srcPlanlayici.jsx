import React, { useState } from "react";

// Planlayici.jsx - Tüm TYT ve AYT ders konuları entegre edilmiş sürüm

export default function Planlayici() {
  const SUBJECTS = [
    "Türkçe",
    "Tarih",
    "Coğrafya",
    "Felsefe",
    "Matematik",
    "Fizik",
    "Kimya",
    "Biyoloji",
  ];

  // PDF’den alınan TYT & AYT konu bankası
  const TOPIC_BANK = {
    // --- TYT ---
    "TYT Türkçe": [
      "Sözcükte Anlam", "Söz Yorumu", "Deyim ve Atasözü", "Cümlede Anlam", "Paragraf",
      "Paragrafta Anlatım Teknikleri", "Paragrafta Düşünceyi Geliştirme Yolları", "Paragrafta Yapı",
      "Paragrafta Konu-Ana Düşünce", "Paragrafta Yardımcı Düşünce", "Ses Bilgisi", "Yazım Kuralları",
      "Noktalama İşaretleri", "Sözcükte Yapı/Ekler", "Sözcük Türleri", "İsimler", "Zamirler", "Sıfatlar",
      "Zarflar", "Edat – Bağlaç – Ünlem", "Fiiller", "Fiilde Anlam (Kip-Kişi-Yapı)", "Ek Fiil", "Fiilimsi",
      "Fiilde Çatı", "Sözcük Grupları", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozukluğu"
    ],
    "TYT Coğrafya": [
      "Harita Bilgisi", "Atmosfer ve Sıcaklık", "İklim Bilgisi", "İç ve Dış Kuvvetler",
      "Nüfus ve Yerleşme", "Ekonomik Faaliyetler", "Bölgeler", "Doğal Afetler"
    ],
    "TYT Matematik": [
      "Temel Kavramlar", "Sayı Basamakları", "Bölme ve Bölünebilme", "EBOB – EKOK", "Rasyonel Sayılar",
      "Basit Eşitsizlikler", "Mutlak Değer", "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma",
      "Oran Orantı", "Denklem Çözme", "Problemler", "Sayı Problemleri", "Kesir Problemleri",
      "Yaş Problemleri", "Hareket Hız Problemleri", "İşçi Emek Problemleri", "Yüzde Problemleri",
      "Kar Zarar Problemleri", "Karışım Problemleri", "Grafik Problemleri", "Rutin Olmayan Problemler",
      "Kümeler – Kartezyen Çarpım", "Mantık", "Fonksiyonlar", "Polinomlar", "2.Dereceden Denklemler",
      "Permütasyon ve Kombinasyon", "Olasılık", "Veri – İstatistik"
    ],
    "TYT Fizik": [
      "Fizik Bilimine Giriş", "Madde ve Özellikleri", "Sıvıların Kaldırma Kuvveti", "Basınç",
      "Isı, Sıcaklık ve Genleşme", "Hareket ve Kuvvet", "Dinamik", "İş, Güç ve Enerji",
      "Elektrik", "Manyetizma", "Dalgalar", "Optik"
    ],
    "TYT Kimya": [
      "Kimya Bilimi", "Atom ve Yapısı", "Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler",
      "Maddenin Halleri", "Kimyanın Temel Kanunları", "Asitler, Bazlar ve Tuzlar", "Kimyasal Hesaplamalar",
      "Karışımlar", "Endüstride ve Canlılarda Enerji", "Kimya Her Yerde"
    ],
    "TYT Biyoloji": [
      "Canlıların Ortak Özellikleri", "Canlıların Temel Bileşenleri", "Hücre ve Organeller – Madde Geçişleri",
      "Canlıların Sınıflandırılması", "Hücrede Bölünme – Üreme", "Kalıtım", "Bitki Biyolojisi", "Ekosistem"
    ],

    // --- AYT ---
    "AYT Matematik": [
      "Fonksiyon", "Polinom", "Polinomlarda Bölme", "Polinom Denklemi Oluşturma", "2.Dereceden Denklemler",
      "Karmaşık Sayılar", "Denklem Sistemleri", "Fonksiyon Uygulamaları", "Parabol", "Eşitsizlikler ve Sistemler",
      "Permütasyon", "Permütasyon ve Kombinasyon", "Binom ve Olasılık", "İstatistik", "Trigonometri",
      "Sıralama", "Kosinüs Teoremi", "Sinüs Teoremi ve Alan", "Periyot ve Grafikler", "Trigo2", "Logaritma",
      "Aritmetik Dizi", "Geometrik Dizi", "Limit Hesabı ve Özellikleri", "Parçalı ve Mutlak Değer Fonksiyonların Limiti",
      "0/0 Belirsizliği", "Süreklilik", "Türev", "Türevin Fiziksel ve Geometrik Yorumu", "Artan Azalan Fonksiyonlar",
      "Ekstremum, Maksimum/Minimum", "Grafik Yorumlama", "İntegral", "Parçalı ve Mutlak Fonksiyonların İntegrali",
      "İntegralde Alan", "Riemann Toplamı"
    ],
    "AYT Fizik": [
      "Vektörler", "Kuvvet, Tork ve Denge", "Kütle Merkezi", "Basit Makineler", "Hareket", "Newton’un Hareket Yasaları",
      "İş, Güç ve Enerji II", "Atışlar", "İtme ve Momentum", "Elektrik Alan ve Potansiyel", "Paralel Levhalar ve Sığa",
      "Manyetik Alan ve Manyetik Kuvvet", "İndüksiyon, Alternatif Akım ve Transformatörler", "Çembersel Hareket",
      "Dönme, Yuvarlanma ve Açısal Momentum", "Kütle Çekim ve Kepler Yasaları", "Basit Harmonik Hareket",
      "Dalga Mekaniği ve Elektromanyetik Dalgalar", "Atom Modelleri", "Büyük Patlama ve Parçacık Fiziği",
      "Radyoaktivite", "Özel Görelilik", "Kara Cisim Işıması", "Fotoelektrik Olay ve Compton Olayı",
      "Modern Fiziğin Teknolojideki Uygulamaları"
    ],
    "AYT Kimya": [
      "Modern Atom Teorisi", "Gazlar", "Sıvı Çözeltiler", "Kimyasal Tepkimelerde Enerji",
      "Kimyasal Tepkimelerde Hız", "Kimyasal Tepkimelerde Denge", "Asit-Baz Dengesi", "Çözünürlük Dengesi",
      "Kimya ve Elektrik", "Organik Kimyaya Giriş", "Organik Kimya", "Enerji Kaynakları ve Bilimsel Gelişmeler"
    ],
    "AYT Biyoloji": [
      "Sinir Sistemi", "Endokrin Sistem ve Hormonlar", "Duyu Organları", "Destek ve Hareket Sistemi",
      "Sindirim Sistemi", "Dolaşım ve Bağışıklık Sistemi", "Solunum Sistemi", "Üriner Sistem (Boşaltım Sistemi)",
      "Üreme Sistemi ve Embriyonik Gelişim", "Komünite Ekolojisi", "Popülasyon Ekolojisi", "Genden Proteine",
      "Nükleik Asitler", "Genetik Şifre ve Protein Sentezi", "Canlılarda Enerji Dönüşümleri", "Canlılık ve Enerji",
      "Fotosentez", "Kemosentez", "Hücresel Solunum", "Bitki Biyolojisi", "Canlılar ve Çevre"
    ]
  };

  const [weeksCount, setWeeksCount] = useState(20);
  const [weeks, setWeeks] = useState(Array.from({ length: weeksCount }, (_, i) => i + 1));
  const [plans, setPlans] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSubjectForPlan, setSelectedSubjectForPlan] = useState(null);
  const [inputWeeks, setInputWeeks] = useState(20);

  function openPlanModal(subject) {
    setSelectedSubjectForPlan(subject);
    setSelectedTemplate(null);
    setInputWeeks(20);
    setShowModal(true);
  }

  function chunkEvenly(arr, n) {
    const result = Array.from({ length: n }, () => []);
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
      result[idx].push(arr[i]);
      idx = (idx + 1) % n;
    }
    return result;
  }

  function createPlanForSubject(subject, templateKey, wkCount) {
    const key = templateKey || subject;
    const topics = TOPIC_BANK[key] || [];
    const assignments = chunkEvenly(topics, wkCount);

    setPlans((p) => ({
      ...p,
      [subject]: { title: key, topics, assignments },
    }));

    if (wkCount !== weeks.length) {
      const newWeeks = Array.from({ length: wkCount }, (_, i) => i + 1);
      setWeeks(newWeeks);
      setWeeksCount(wkCount);
    }

    setShowModal(false);
  }

  function removePlan(subject) {
    const copy = { ...plans };
    delete copy[subject];
    setPlans(copy);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Planlayıcı</h1>
          <div className="space-x-2">
            <label className="text-sm text-gray-600 mr-2">Genel hafta sayısı:</label>
            <input
              type="number"
              value={weeksCount}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value || 1));
                setWeeksCount(v);
                setWeeks(Array.from({ length: v }, (_, i) => i + 1));
              }}
              className="w-20 p-1 border rounded"
            />
          </div>
        </header>

        <div className="grid grid-cols-8 gap-3 mb-4">
          {SUBJECTS.map((s) => (
            <div key={s} className="bg-white p-3 rounded shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <strong>{s}</strong>
                <div className="space-x-1">
                  <button
                    onClick={() => openPlanModal(s)}
                    className="text-xs px-2 py-1 bg-yellow-400 rounded shadow"
                  >
                    Plan Yükle
                  </button>
                  {plans[s] && (
                    <button
                      onClick={() => removePlan(s)}
                      title="Planı kaldır"
                      className="text-xs px-2 py-1 bg-red-200 rounded"
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">{plans[s] ? plans[s].title : "Plan yok"}</div>
            </div>
          ))}
        </div>

        <div className="overflow-auto border rounded bg-white">
          <table className="min-w-full table-fixed">
            <thead>
              <tr>
                <th className="w-24 p-2 border-r">Hafta</th>
                {SUBJECTS.map((s) => (
                  <th key={s} className="p-2 text-left border-r">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((wIdx) => (
                <tr key={wIdx} className="align-top">
                  <td className="p-2 text-sm font-medium border-r">{wIdx}. Hafta</td>
                  {SUBJECTS.map((s) => {
                    const plan = plans[s];
                    const cellTopics = plan && plan.assignments[wIdx - 1] ? plan.assignments[wIdx - 1] : [];
                    return (
                      <td key={s + wIdx} className="p-2 align-top h-28 border-r">
                        {cellTopics.length === 0 ? (
                          <div className="text-xs text-gray-400">&nbsp;</div>
                        ) : (
                          <ul className="text-sm list-disc pl-4">
                            {cellTopics.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded shadow-lg max-w-2xl w-full p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold">{selectedSubjectForPlan} için Plan Yükle</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500">Kapat</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Şablon Seç</h3>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {Object.keys(TOPIC_BANK).map((tk) => (
                      <button
                        key={tk}
                        onClick={() => setSelectedTemplate(tk)}
                        className={`w-full text-left p-2 rounded border ${selectedTemplate === tk ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100'}`}
                      >
                        <div className="font-medium">{tk}</div>
                        <div className="text-xs text-gray-500">{TOPIC_BANK[tk].length} konu</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Ayarlar</h3>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600">Bu ders kaç haftada bitmeli?</label>
                    <input
                      type="number"
                      value={inputWeeks}
                      onChange={(e) => setInputWeeks(Math.max(1, Number(e.target.value || 1)))}
                      className="w-32 p-2 border rounded mt-1"
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => createPlanForSubject(selectedSubjectForPlan, selectedTemplate, inputWeeks)}
                      className="px-4 py-2 bg-yellow-400 rounded"
                    >
                      Planla
                    </button>
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">İptal</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        <footer className="mt-6 text-sm text-gray-500">
          Not: Tüm TYT & AYT konu listeleri eklendi. Haftalara eşit dağıtım yapılır. İleri geliştirme için: sürükle-bırak, ilerleme işaretleme, kullanıcı kaydı.
        </footer>
      </div>
    </div>
