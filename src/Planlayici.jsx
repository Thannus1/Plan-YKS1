import React, { useState, useEffect } from "react";
import TreeGarden from './components/TreeGarden';
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const TOPIC_BANK = {
  "Tyt Turkce": [
    { name: "Ses Bilgisi", weight: 1 },
    { name: "Cümlede Anlam", weight: 2 },
    { name: "Paragrafta Yapı / Konu – Ana", weight: 2 },
    { name: "Fiil Çatısı", weight: 2 },
    { name: "Yazım Kuralları / Noktalama", weight: 2 },
    { name: "Sözcük Yapısı (kök, ekler)", weight: 2 },
    { name: "Fiilde Anlam", weight: 2 },
    { name: "Anlatım Bozukluğu", weight: 3 },
    { name: "Cümle Türleri", weight: 3 },
    { name: "Atasözleri / Deyimler", weight: 3 },
    { name: "Paragraf Teknikleri", weight: 3 },
    { name: "Cümlenin Ögeleri", weight: 3 },
    { name: "Fiiller (tüm yönleriyle)", weight: 3 },
    { name: "Fiilimsi", weight: 3 },
    { name: "Sözcük Türleri Ek Fiil", weight: 3 }
  ],
  "Tyt Cografya": [
    { name: "Harita Bilgisi", weight: 1 },
    { name: "Atmosfer ve Sıcaklık", weight: 1 },
    { name: "Doğal Afetler", weight: 1 },
    { name: "İklim Bilgisi (Katmanlar)", weight: 2 },
    { name: "Dış Kuvvetler", weight: 2 },
    { name: "Bölgeler (genel)", weight: 2 },
    { name: "Ekonomik Faaliyetler (sektör)", weight: 2 },
    { name: "Nüfus & Yerleşme (temel)", weight: 2 },
    { name: "Ekonomik Faaliyetler", weight: 3 },
    { name: "Nüfus ve Yerleşme (detaylı)", weight: 3 },
    { name: "Bölgeler (detaylı analiz)", weight: 3 }
  ],
  "Tyt Din": [
    { name: "Bilgi ve İnanç", weight: 1 },
    { name: "Din ve İslam", weight: 1 },
    { name: "Allah İnsan İlişkisi", weight: 1 },
    { name: "Hz. Muhammed (S.A.V)", weight: 2 },
    { name: "Vahiy ve Akıl", weight: 1 },
    { name: "İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar", weight: 1 },
    { name: "Din, Kültür ve Medeniyet", weight: 1 },
  ],
  "Tyt Felsefe": [
    { name: "Felsefenin Konusu", weight: 1 },
    { name: "Bilgi Felsefesi", weight: 1 },
    { name: "Varlık Felsefesi", weight: 1 },
    { name: "Din,Kültür ve Medeniyet", weight: 1 },
    { name: "Ahlak Felsefesi", weight: 1 },
    { name: "Sanat Felsefesi", weight: 1 },
    { name: "Din Felsefesi", weight: 1 },
    { name: "Siyaset Felsefesi", weight: 1 },
    { name: "Bilim Felsefesi", weight: 1 },
  ],
  "Tyt Matematik": [
    { name: "Temel Kavramlar", weight: 1 },
    { name: "Sayı Basamakları", weight: 1 },
    { name: "Bölme ve Bölünebilme", weight: 1 },
    { name: "EBOB – EKOK", weight: 1 },
    { name: "Mutlak Değer", weight: 1 },
    { name: "Oran – Orantı", weight: 1 },
    { name: "Rasyonel Sayılar", weight: 2 },
    { name: "Üslü Sayılar", weight: 2 },
    { name: "Köklü Sayılar", weight: 2 },
    { name: "Çarpanlara Ayırma", weight: 2 },
    { name: "Denklem Çözme", weight: 2 },
    { name: "Fonksiyonlar", weight: 2 },
    { name: "2. Dereceden Denklemler", weight: 2 },
    { name: "Kümeler – Kartezyen Çarpım", weight: 2 },
    { name: "Polinomlar", weight: 2 },
    { name: "Permütasyon & Kombinasyon", weight: 2 },
    { name: "Sayı Problemleri", weight: 2 },
    { name: "Kesir Problemleri", weight: 3 },
    { name: "Yaş Problemleri", weight: 2 },
    { name: "Hareket – Hız Problemleri", weight: 3 },
    { name: "İşçi – Emek Problemleri", weight: 3 },
    { name: "Yüzde Problemleri", weight: 2 },
    { name: "Kar – Zarar Problemleri", weight: 3 },
    { name: "Karışım Problemleri", weight: 2 },
    { name: "Grafik Problemleri", weight: 3 },
    { name: "Rutin Olmayan Problemler", weight: 3 }
  ],
  "Tyt Fizik": [
    { name: "Fizik Bilimine Giriş", weight: 1 },
    { name: "Madde ve Özellikleri", weight: 1 },
    { name: "Hareket: Temel Kavramlar (yol, hız, ivme)", weight: 1 },
    { name: "Hareket ve Grafikler", weight: 2 },
    { name: "Newton’un Hareket Yasaları", weight: 2 },
    { name: "Kuvvet ve Hareket (Detaylı + Soru Çözümü)", weight: 3 },
    { name: "Basınç (Gazlar / Akışkanlar)", weight: 2 },
    { name: "Isı, Sıcaklık ve Genleşme", weight: 3 },
    { name: "Elektrik ve Manyetizma", weight: 3 },
    { name: "Dalgalar", weight: 2 },
    { name: "Optik", weight: 3 },
  ],
  "Tyt Kimya": [
    { name: "Kimya Bilimi", weight: 1 },
    { name: "Atom ve Yapısı", weight: 2 },
    { name: "Periyodik Sistem", weight: 2 },
    { name: "Kimyasal Türler Arası Etkileşimler", weight: 2 },
    { name: "Maddenin Halleri", weight: 2 },
    { name: "Kimyanın Temel Kanunları", weight: 1 },
    { name: "Asit, Baz ve Tuz", weight: 1 },
    { name: "Kimyasal Hesaplamalar", weight: 2 },
    { name: "Karışımlar", weight: 2 },
    { name: "Doğa ve Kimya", weight: 1 },
    { name: "Kimya Her Yerde", weight: 1 },
    { name: "Endüstride ve Canlılarda Enerji", weight: 2 }
  ],
  "Tyt Biyoloji": [
    { name: "Canlıların Ortak Özellikleri", weight: 1 },
    { name: "Canlıların Temel Bileşenleri", weight: 1 },
    { name: "Hücre Zarı ve Madde Geçişleri", weight: 2 },
    { name: "Hücre ve Organeller", weight: 2 },
    { name: "Canlıların Sınıflandırılması", weight: 2 },
    { name: "Ekosistem", weight: 2 },
    { name: "Hücrede Bölünme", weight: 3 },
    { name: "Üreme", weight: 3 },
    { name: "Kalıtım", weight: 3 },
    { name: "Bitki Biyolojisi", weight: 3 }
  ],
  "Ayt Fizik": [
    { name: "Vektörler", weight: 1 },
    { name: "Basit Makineler", weight: 1 },
    { name: "Kuvvet, Tork ve Denge", weight: 2 },
    { name: "Kütle Merkezi", weight: 2 },
    { name: "Hareket", weight: 2 },
    { name: "Newton’un Hareket Yasaları", weight: 2 },
    { name: "İş, Güç ve Enerji II", weight: 2 },
    { name: "Atışlar", weight: 2 },
    { name: "İtme ve Momentum", weight: 2 },
    { name: "Basit Harmonik Hareket", weight: 2 },
    { name: "Dalga Mekaniği ve Elektromanyetik Dalgalar", weight: 2 },
    { name: "Çembersel Hareket", weight: 3 },
    { name: "Dönme, Yuvarlanma ve Açısal Momentum", weight: 3 },
    { name: "Kütle Çekim ve Kepler Yasaları", weight: 3 },
    { name: "Elektrik Alan ve Potansiyel", weight: 3 },
    { name: "Paralel Levhalar ve Sığa", weight: 3 },
    { name: "Manyetik Alan ve Manyetik Kuvvet", weight: 3 },
    { name: "İndüksiyon, Alternatif Akım ve Transformatörler", weight: 3 },
    { name: "Atom Modelleri", weight: 3 },
    { name: "Radyoaktivite", weight: 3 },
    { name: "Kara Cisim Işıması", weight: 3 },
    { name: "Fotoelektrik Olay ve Compton Olayı", weight: 3 },
    { name: "Özel Görelilik", weight: 3 },
    { name: "Büyük Patlama ve Parçacık Fiziği", weight: 3 },
    { name: "Modern Fiziğin Teknolojideki Uygulamaları", weight: 3 }
  ],
  "Ayt Kimya": [
    { name: "Modern Atom Teorisi", weight: 1 },
    { name: "Organik Kimyaya Giriş", weight: 1 },
    { name: "Enerji Kaynakları ve Bilimsel Gelişmeler", weight: 1 },
    { name: "Gazlar", weight: 2 },
    { name: "Sıvı Çözeltiler", weight: 2 },
    { name: "Kimyasal Tepkimelerde Enerji", weight: 2 },
    { name: "Organik Kimya", weight: 2 },
    { name: "Kategori Konular", weight: 3 },
    { name: "Kimyasal Tepkimelerde Hız", weight: 3 },
    { name: "Kimyasal Tepkimelerde Denge", weight: 3 },
    { name: "Asit-Baz Dengesi", weight: 3 },
    { name: "Çözünürlük Dengesi", weight: 3 },
    { name: "Kimya ve Elektrik", weight: 3 }
  ],
  "Ayt Biyoloji": [
    { name: "Sinir Sistemi", weight: 2 },
    { name: "Endokrin Sistem ve Hormonlar", weight: 2 },
    { name: "Duyu Organları", weight: 2 },
    { name: "Destek ve Hareket Sistemi", weight: 2 },
    { name: "Sindirim Sistemi", weight: 2 },
    { name: "Üriner Sistem (Boşaltım Sistemi)", weight: 2 },
    { name: "Üreme Sistemi ve Embriyonik Gelişim", weight: 2 },
    { name: "Komünite Ekolojisi", weight: 2 },
    { name: "Popülasyon Ekolojisi", weight: 2 },
    { name: "Dolaşım ve Bağışıklık Sistemi", weight: 3 },
    { name: "Solunum Sistemi", weight: 3 },
    { name: "Genden Proteine", weight: 3 },
    { name: "Nükleik Asitler", weight: 1 },
    { name: "Genetik Şifre ve Protein Sentezi", weight: 1 },
    { name: "Canlılık ve Enerji", weight: 1 },
    { name: "Canlılarda Enerji Dönüşümleri", weight: 3 },
    { name: "Fotosentez", weight: 3 },
    { name: "Kemosentez", weight: 1 },
    { name: "Hücresel Solunum", weight: 3 },
    { name: "Bitki Biyolojisi", weight: 3 },
    { name: "Canlılar ve Çevre", weight: 3 }
  ],
  "Ayt Matematik": [
    { name: "Polinomlarda Bölme", weight: 1 },
    { name: "Polinom Denklemi Oluşturma", weight: 1 },
    { name: "2. Dereceden Denklemler", weight: 1 },
    { name: "Denklem Sistemleri", weight: 1 },
    { name: "Parabol", weight: 1 },
    { name: "Sıralama", weight: 1 },
    { name: "Kosinüs Teoremi", weight: 1 },
    { name: "Sinüs Teoremi ve Alan", weight: 1 },
    { name: "Periyot ve Grafikler", weight: 1 },
    { name: "0/0 Belirsizliği", weight: 1 },
    { name: "Türevin Fiziksel ve Geometrik Yorumu", weight: 1 },
    { name: "Fonksiyon", weight: 2 },
    { name: "Polinom", weight: 2 },
    { name: "Fonksiyon Uygulamaları", weight: 2 },
    { name: "Karmaşık Sayılar", weight: 2 },
    { name: "Eşitsizlikler ve Sistemler", weight: 2 },
    { name: "Permütasyon", weight: 2 },
    { name: "Permütasyon ve Kombinasyon", weight: 2 },
    { name: "Binom ve Olasılık", weight: 2 },
    { name: "İstatistik", weight: 2 },
    { name: "Trigonometri (Trigo1)", weight: 2 },
    { name: "Trigonometri 2", weight: 2 },
    { name: "Logaritma", weight: 2 },
    { name: "Aritmetik Dizi", weight: 2 },
    { name: "Geometrik Dizi", weight: 2 },
    { name: "Limit Hesabı ve Özellikleri", weight: 2 },
    { name: "Parçalı ve Mutlak Değer Fonksiyonların Limiti", weight: 2 },
    { name: "Süreklilik", weight: 2 },
    { name: "Artan Azalan / f", weight: 2 },
    { name: "Türev", weight: 3 },
    { name: "İntegral", weight: 3 },
    { name: "Parçalı ve Mutlak Fonksiyonların İntegrali", weight: 3 },
    { name: "Riemann Toplamı", weight: 3 }
  ],
  "Tyt Tarih": [
    { name: "İlk ve Orta Çağlarda Türk Dünyası", weight: 2 },
    { name: "Türklerin İslamiyet’i Kabulü ve İlk Türk İslam Devletleri", weight: 2 },
    { name: "Beylikten Devlete Osmanlı", weight: 2 },
    { name: "Dünya Gücü Osmanlı", weight: 2 },
    { name: "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)", weight: 3 },
    { name: "Milli Mücadele", weight: 3 },
    { name: "Atatürkçülük ve Türk İnkılabı", weight: 3 }
  ],
   "AYT Türkçe" : [
    { name: "Anlam Bilgisi", weight: 1 },
    { name: "Şiir Bilgisi", weight: 2 },
    { name: "Edebi Sanatlar", weight: 2 },
    { name: "Metin Türleri", weight: 2 },
    { name: "Edebi Akımlar", weight: 3 },
    { name: "Yazar-Eser Bilgisi", weight: 3 },
    { name: "Cumhuriyet Dönemi Edebiyatı", weight: 3 },
    { name: "Divan Edebiyatı", weight: 3 },
    { name: "Tanzimat ve Servet-i Fünun Edebiyatı", weight: 3 },
    { name: "Halk Edebiyatı", weight: 3 },
    { name: "Batı Edebiyat Akımları", weight: 3 }
],
  "AYT Tarih" : [
    { name: "Tarih ve Zaman", weight: 1 },
    { name: "İnsanlığın İlk Dönemleri", weight: 1 },
    { name: "Orta Çağ’da Dünya", weight: 2 },
    { name: "İlk ve Orta Çağlarda Türk Dünyası", weight: 2 },
    { name: "İslam Medeniyetinin Doğuşu", weight: 2 },
    { name: "Türklerin İslamiyet’i Kabulü ve İlk Türk İslam Devletleri", weight: 2 },
    { name: "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi", weight: 2 },
    { name: "Beylikten Devlete Osmanlı Siyaseti", weight: 2 },
    { name: "Devletleşme Sürecinde Savaşçılar ve Askerler", weight: 2 },
    { name: "Beylikten Devlete Osmanlı Medeniyeti", weight: 2 },
    { name: "Dünya Gücü Osmanlı", weight: 2 },
    { name: "Sultan ve Osmanlı Merkez Teşkilatı", weight: 3 },
    { name: "Klasik Çağda Osmanlı Toplum Düzeni", weight: 3 },
    { name: "Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti", weight: 3 },
    { name: "Değişim Çağında Avrupa ve Osmanlı", weight: 3 },
    { name: "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)", weight: 3 },
    { name: "Devrimler Çağında Değişen Devlet-Toplum İlişkileri", weight: 3 },
    { name: "Sermaye ve Emek", weight: 3 },
    { name: "XIX. ve XX. Yüzyılda Değişen Gündelik Hayat", weight: 3 },
    { name: "XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya", weight: 3 },
    { name: "Milli Mücadele", weight: 3 },
    { name: "Atatürkçülük ve Türk İnkılabı", weight: 3 },
    { name: "İki Savaş Arasındaki Dönemde Türkiye ve Dünya", weight: 3 },
    { name: "II. Dünya Savaşı Sürecinde Türkiye ve Dünya", weight: 3 },
    { name: "II. Dünya Savaşı Sonrasında Türkiye ve Dünya", weight: 3 },
    { name: "Toplumsal Devrim Çağında Dünya ve Türkiye", weight: 3 },
    { name: "XXI. Yüzyılın Eşiğinde Türkiye ve Dünya", weight: 3 }
],
   "AYT Coğrafya" : [
    { name: "Ekosistem", weight: 2 },
    { name: "Biyoçeşitlilik", weight: 2 },
    { name: "Biyomlar", weight: 2 },
    { name: "Ekosistemin Unsurları", weight: 2 },
    { name: "Enerji Akışı ve Madde Döngüsü", weight: 3 },
    { name: "Ekstrem Doğa Olayları", weight: 3 },
    { name: "Küresel İklim Değişimi", weight: 3 },
    { name: "Nüfus Politikaları", weight: 2 },
    { name: "Türkiye’de Nüfus ve Yerleşme", weight: 2 },
    { name: "Ekonomik Faaliyetler ve Doğal Kaynaklar", weight: 2 },
    { name: "Göç ve Şehirleşme", weight: 2 },
    { name: "Türkiye Ekonomisi", weight: 2 },
    { name: "Türkiye’nin Ekonomi Politikaları", weight: 3 },
    { name: "Türkiye Ekonomisinin Sektörel Dağılımı", weight: 2 },
    { name: "Türkiye’de Tarım", weight: 2 },
    { name: "Türkiye’de Hayvancılık", weight: 2 },
    { name: "Türkiye’de Madenler ve Enerji Kaynakları", weight: 2 },
    { name: "Türkiye’de Sanayi", weight: 2 },
    { name: "Türkiye’de Ulaşım", weight: 2 },
    { name: "Türkiye’de Ticaret ve Turizm", weight: 2 },
    { name: "Geçmişten Geleceğe Şehir ve Ekonomi", weight: 3 },
    { name: "Türkiye’nin İşlevsel Bölgeleri ve Kalkınma Projeleri", weight: 3 },
    { name: "Hizmet Sektörünün Ekonomideki Yeri", weight: 2 },
    { name: "Küresel Ticaret", weight: 3 },
    { name: "Bölgeler ve Ülkeler", weight: 2 },
    { name: "İlk Uygarlıklar", weight: 1 },
    { name: "Kültür Bölgeleri ve Türk Kültürü", weight: 2 },
    { name: "Sanayileşme Süreci: Almanya", weight: 3 },
    { name: "Tarım ve Ekonomi İlişkisi Fransa – Somali", weight: 3 },
    { name: "Ülkeler Arası Etkileşim", weight: 3 },
    { name: "Jeopolitik Konum", weight: 2 },
    { name: "Çatışma Bölgeleri", weight: 3 },
    { name: "Küresel ve Bölgesel Örgütler", weight: 3 },
    { name: "Çevre ve Toplum", weight: 2 },
    { name: "Çevre Sorunları ve Türleri", weight: 3 },
    { name: "Madenler ve Enerji Kaynaklarının Çevreye Etkisi", weight: 3 },
    { name: "Doğal Kaynakların Sürdürülebilir Kullanımı", weight: 3 },
    { name: "Ekolojik Ayak İzi", weight: 3 },
    { name: "Doğal Çevrenin Sınırlılığı", weight: 3 },
    { name: "Çevre Politikaları", weight: 3 },
    { name: "Çevresel Örgütler", weight: 3 },
    { name: "Çevre Anlaşmaları", weight: 3 },
    { name: "Doğal Afetler", weight: 3 }
],
  "AYT Felsefe" : [
    { name: "Felsefe’nin Konusu", weight: 1 },
    { name: "Bilgi Felsefesi", weight: 2 },
    { name: "Varlık Felsefesi", weight: 2 },
    { name: "Ahlak Felsefesi", weight: 2 },
    { name: "Sanat Felsefesi", weight: 2 },
    { name: "Din Felsefesi", weight: 2 },
    { name: "Siyaset Felsefesi", weight: 2 },
    { name: "Bilim Felsefesi", weight: 2 },
    { name: "İlk Çağ Felsefesi", weight: 3 },
    { name: "MÖ 6. Yüzyıl – MS 2. Yüzyıl Felsefesi", weight: 3 },
    { name: "MS 2. Yüzyıl – MS 15. Yüzyıl Felsefesi", weight: 3 },
    { name: "15. Yüzyıl – 17. Yüzyıl Felsefesi", weight: 3 },
    { name: "18. Yüzyıl – 19. Yüzyıl Felsefesi", weight: 3 },
    { name: "20. Yüzyıl Felsefesi", weight: 3 },
    { name: "Mantığa Giriş", weight: 1 },
    { name: "Klasik Mantık", weight: 2 },
    { name: "Mantık ve Dil", weight: 2 },
    { name: "Sembolik Mantık", weight: 3 },
    { name: "Psikoloji Bilimini Tanıyalım", weight: 1 },
    { name: "Psikolojinin Temel Süreçleri", weight: 2 },
    { name: "Öğrenme Bellek Düşünme", weight: 2 },
    { name: "Ruh Sağlığının Temelleri", weight: 2 },
    { name: "Sosyolojiye Giriş", weight: 1 },
    { name: "Birey ve Toplum", weight: 2 },
    { name: "Toplumsal Yapı", weight: 2 },
    { name: "Toplumsal Değişme ve Gelişme", weight: 3 },
    { name: "Toplum ve Kültür", weight: 2 },
    { name: "Toplumsal Kurumlar", weight: 3 }
],
  "AYT Din" : [
    { name: "Dünya ve Ahiret", weight: 1 },
    { name: "Kur’an’a Göre Hz. Muhammed", weight: 1 },
    { name: "Kur’an’da Bazı Kavramlar", weight: 2 },
    { name: "Kur’an’dan Mesajlar", weight: 2 },
    { name: "İnançla İlgili Meseleler", weight: 2 },
    { name: "İslam ve Bilim", weight: 3 },
    { name: "Anadolu'da İslam", weight: 2 },
    { name: "İslam Düşüncesinde Tasavvufi Yorumlar ve Mezhepler", weight: 3 },
    { name: "Güncel Dini Meseleler", weight: 3 },
    { name: "Yaşayan Dinler", weight: 2 }
],
  "TYT Geometri" : [
    { name: "Temel Kavramlar", weight: 1 },
    { name: "Doğruda Açılar", weight: 1 },
    { name: "Üçgende Açılar", weight: 1 },
    { name: "Özel Üçgenler", weight: 2 },
    { name: "Dik Üçgen", weight: 2 },
    { name: "İkizkenar Üçgen", weight: 2 },
    { name: "Eşkenar Üçgen", weight: 2 },
    { name: "Açıortay", weight: 2 },
    { name: "Kenarortay", weight: 2 },
    { name: "Üçgende Alan", weight: 2 },
    { name: "Üçgende Benzerlik", weight: 3 },
    { name: "Açı Kenar Bağıntıları", weight: 3 },
    { name: "Çokgenler", weight: 2 },
    { name: "Dörtgenler", weight: 2 },
    { name: "Özel Dörtgenler", weight: 2 },
    { name: "Deltoid", weight: 2 },
    { name: "Paralelkenar", weight: 2 },
    { name: "Eşkenar Dörtgen", weight: 2 },
    { name: "Dikdörtgen", weight: 2 },
    { name: "Kare", weight: 2 },
    { name: "Yamuk", weight: 2 },
    { name: "Çember ve Daire", weight: 2 },
    { name: "Çemberde Açı", weight: 2 },
    { name: "Çemberde Uzunluk", weight: 3 },
    { name: "Dairede Çevre ve Alan", weight: 2 },
    { name: "Analitik Geometri", weight: 3 },
    { name: "Noktanın Analitiği", weight: 3 },
    { name: "Doğrunun Analitiği", weight: 3 },
    { name: "Dönüşüm Geometrisi", weight: 3 },
    { name: "Katı Cisimler", weight: 3 },
    { name: "Prizmalar", weight: 3 },
    { name: "Küp", weight: 3 },
    { name: "Silindir", weight: 3 },
    { name: "Piramit", weight: 3 },
    { name: "Koni", weight: 3 },
    { name: "Küre", weight: 3 },
    { name: "Çemberin Analitiği", weight: 3 }
],
  "AYT Geometri" : [
    { name: "Temel Kavramlar", weight: 1 },
    { name: "Doğruda Açılar", weight: 1 },
    { name: "Üçgende Açılar", weight: 1 },
    { name: "Özel Üçgenler", weight: 2 },
    { name: "Dik Üçgen", weight: 2 },
    { name: "İkizkenar Üçgen", weight: 2 },
    { name: "Eşkenar Üçgen", weight: 2 },
    { name: "Açıortay", weight: 2 },
    { name: "Kenarortay", weight: 2 },
    { name: "Üçgende Alan", weight: 2 },
    { name: "Üçgende Benzerlik", weight: 3 },
    { name: "Açı Kenar Bağıntıları", weight: 3 },
    { name: "Çokgenler", weight: 2 },
    { name: "Dörtgenler", weight: 2 },
    { name: "Özel Dörtgenler", weight: 2 },
    { name: "Deltoid", weight: 2 },
    { name: "Paralelkenar", weight: 2 },
    { name: "Eşkenar Dörtgen", weight: 2 },
    { name: "Dikdörtgen", weight: 2 },
    { name: "Kare", weight: 2 },
    { name: "Yamuk", weight: 2 },
    { name: "Çember ve Daire", weight: 2 },
    { name: "Çemberde Açı", weight: 2 },
    { name: "Çemberde Uzunluk", weight: 3 },
    { name: "Dairede Çevre ve Alan", weight: 2 },
    { name: "Analitik Geometri", weight: 3 },
    { name: "Noktanın Analitiği", weight: 3 },
    { name: "Doğrunun Analitiği", weight: 3 },
    { name: "Dönüşüm Geometrisi", weight: 3 },
    { name: "Katı Cisimler", weight: 3 },
    { name: "Prizmalar", weight: 3 },
    { name: "Küp", weight: 3 },
    { name: "Silindir", weight: 3 },
    { name: "Piramit", weight: 3 },
    { name: "Koni", weight: 3 },
    { name: "Küre", weight: 3 },
    { name: "Çemberin Analitiği", weight: 3 }
]

};

const SUBJECTS = [
  "Türkçe",
  "Tarih",
  "Coğrafya",
  "Felsefe",
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Geometri"
];

function distributeTopics(topics, n) {
  console.log("distributeTopics input:", { topics, n });

  if (!topics || !Array.isArray(topics) || topics.length === 0 || n <= 0) {
    console.log("Geçersiz giriş: topics veya n uygun değil, boş array döndürülüyor");
    return Array(n).fill([]);
  }

  const wrap = (t) => ({
    name: t.name || "Bilinmeyen Konu",
    level: t.level || "",
    difficulty: t.weight === 3 ? "Zor" : t.weight === 2 ? "Orta" : "Kolay"
  });

  const total = topics.length;
  console.log(`Total topics: ${total}, weeks: ${n}`);

  if (total === 0) {
    console.log("Konu sayısı sıfır, boş array döndürülüyor");
    return Array(n).fill([]);
  }

  const allTopics = topics.map(wrap).filter(t => t.name);
  console.log("Wrapped topics:", allTopics);

  if (allTopics.length === 0) {
    console.log("Geçerli konu yok, boş array döndürülüyor");
    return Array(n).fill([]);
  }

  const result = Array.from({ length: n }, () => []);
  const minPerWeek = Math.floor(total / n);
  let extra = total % n;
  console.log(`Min per week: ${minPerWeek}, extra: ${extra}`);

  let topicIndex = 0;
  for (let week = 0; week < n; week++) {
    const topicsThisWeek = minPerWeek + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;

    console.log(`Hafta ${week + 1}: ${topicsThisWeek} konu atanacak`);

    for (let i = 0; i < topicsThisWeek && topicIndex < allTopics.length; i++) {
      result[week].push(allTopics[topicIndex++]);
    }
  }

  console.log("Final distribution result:", result);
  return result;
}

export default function Planlayici() {
  const [plans, setPlans] = useState({});
  const [weeksCount, setWeeksCount] = useState(20);
  const [weeks, setWeeks] = useState(Array.from({ length: weeksCount }, (_, i) => i + 1));
  const [user, setUser] = useState(null);
  const [completedTopics, setCompletedTopics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubjectForPlan, setSelectedSubjectForPlan] = useState(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);
  const [inputWeeks, setInputWeeks] = useState(10);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeTargetSubject, setRemoveTargetSubject] = useState(null);
  const [removeMode, setRemoveMode] = useState(null);
  const [selectedTemplateForRemoval, setSelectedTemplateForRemoval] = useState(null);
  const [selectedTopicsToRemove, setSelectedTopicsToRemove] = useState([]);

  useEffect(() => {
    setWeeks(Array.from({ length: weeksCount }, (_, i) => i + 1));
  }, [weeksCount]);

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? currentUser.uid : "null");
      setUser(currentUser);

      if (currentUser) {
        try {
          setIsLoading(true);
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("Firebase'den ham veri:", userData);

            // Veri yapısını temizle ve doğrula
            const cleanedPlans = cleanPlansData(userData.plans || {});
            const cleanedCompletedTopics = userData.completedTopics || {};

            console.log("Temizlenmiş planlar:", cleanedPlans);
            console.log("Temizlenmiş completed topics:", cleanedCompletedTopics);

            setPlans(cleanedPlans);
            setCompletedTopics(cleanedCompletedTopics);

            let maxWeeks = 20;
            Object.values(cleanedPlans).forEach(subjectPlans => {
              if (Array.isArray(subjectPlans)) {
                subjectPlans.forEach(plan => {
                  if (plan && plan.weeks && plan.weeks > maxWeeks) {
                    maxWeeks = plan.weeks;
                  }
                });
              }
            });
            setWeeksCount(maxWeeks);

            setDataLoaded(true);
          } else {
            console.log("Yeni kullanıcı, boş doküman oluşturuluyor");
            await setDoc(userDocRef, {
              plans: {},
              completedTopics: {},
              createdAt: new Date()
            });
            setPlans({});
            setCompletedTopics({});
            setDataLoaded(true);
          }
        } catch (error) {
          console.error("Firebase'den veri yüklenirken hata:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setPlans({});
        setCompletedTopics({});
        setDataLoaded(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase'e veri kaydetme - debounced
  useEffect(() => {
    if (!user || !dataLoaded || isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        console.log("Firebase'e veri kaydediliyor...", { plans, completedTopics });

        const userDocRef = doc(db, "users", user.uid);

        const cleanPlans = JSON.parse(JSON.stringify(plans, (key, value) => {
          if (Array.isArray(value)) {
            return value.map(plan => ({
              ...plan,
              assignments: Array.isArray(plan.assignments) ? plan.assignments : []
            }));
          }
          return value;
        }));

        await setDoc(userDocRef, {
          plans: cleanPlans,
          completedTopics,
          lastUpdated: new Date()
        }, { merge: true });

        console.log("Firebase'e başarıyla kaydedildi");
      } catch (error) {
        console.error("Firebase'e kaydetme hatası:", error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [plans, completedTopics, user, dataLoaded, isLoading]);

  // Helper functions
  const cleanPlansData = (plans) => {
  try {
    console.log("cleanPlansData'ya gelen veri:", plans);
    const cleaned = {};
    for (const [subject, planArray] of Object.entries(plans)) {
      if (!Array.isArray(planArray)) {
        console.warn(`Plan array geçersiz: ${subject}`, planArray);
        continue;
      }
      cleaned[subject] = planArray.map(plan => {
        if (!plan) {
          console.warn(`Plan null: ${subject}`);
          return null;
        }

        console.log(`${subject} planı işleniyor:`, plan);

        let cleanedAssignments;
        // Check if assignments is an array and if it contains valid content
        if (Array.isArray(plan.assignments) && plan.assignments.every(week => Array.isArray(week) && week.every(item => item && item.name))) {
          cleanedAssignments = plan.assignments;
        } else {
          // If the assignments are invalid, redistribute topics to create a valid plan
          console.warn(`Assignments geçersiz, yeniden oluşturuluyor: ${subject}`, plan.assignments);
          cleanedAssignments = distributeTopics(plan.topics || [], plan.weeks || 10);
        }

        const cleanedPlan = {
          title: plan.title || 'Unknown',
          level: plan.level || 'Unknown',
          topics: Array.isArray(plan.topics) ? plan.topics.filter(t => t && t.name) : [],
          assignments: cleanedAssignments,
          weeks: typeof plan.weeks === 'number' ? plan.weeks : cleanedAssignments.length
        };

        console.log(`${subject} temizlenmiş plan:`, cleanedPlan);
        return cleanedPlan;
      }).filter(plan => plan !== null);
    }
    console.log("Temizlenmiş tüm veri:", cleaned);
    return cleaned;
  } catch (error) {
    console.error("Error cleaning plans data:", error);
    return {};
  }
};

  const topicsForSubject = (subject) => {
    try {
      const arr = (plans[subject] || []).flatMap(p => {
        if (!p || !Array.isArray(p.topics)) return [];
        return p.topics;
      });
      const uniq = [];
      const seen = new Set();
      for (let t of arr) {
        if (t && t.name && !seen.has(t.name)) {
          seen.add(t.name);
          uniq.push(t);
        }
      }
      return uniq;
    } catch (error) {
      console.error(`Error getting topics for subject ${subject}:`, error);
      return [];
    }
  };

  const lessonProgress = (subject) => {
    const all = topicsForSubject(subject);
    if (all.length === 0) return 0;
    const done = all.filter(t => completedTopics[`${subject}::${t.name}`]).length;
    return Math.round((done / all.length) * 100);
  };

  const overallProgress = () => {
    let total = 0, done = 0;
    for (let s of SUBJECTS) {
      const tps = topicsForSubject(s);
      total += tps.length;
      done += tps.filter(t => completedTopics[`${s}::${t.name}`]).length;
    }
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const createPlanForSubject = (subject, templateKey, wkCount) => {
    if (!subject || !templateKey || wkCount <= 0) {
      console.error("Geçersiz parametreler:", { subject, templateKey, wkCount });
      return;
    }

    try {
      const template = TOPIC_BANK[templateKey] || [];
      console.log("Selected template:", template);
      if (!Array.isArray(template) || template.length === 0) {
        console.error(`Template ${templateKey} boş veya geçersiz`);
        return;
      }

      const level = templateKey.toUpperCase().startsWith("TYT") ? "TYT" : "AYT";
      const topics = template.map(t => ({
        name: t.name,
        weight: t.weight,
        level
      }));
      console.log("Topics for plan:", topics);

      const assignments = distributeTopics(topics, wkCount);
      console.log("Generated assignments:", assignments);

      setPlans(prev => {
        const existing = prev[subject] || [];
        const newPlan = {
          title: templateKey,
          level,
          topics,
          assignments,
          weeks: wkCount
        };
        console.log(`Plan created for ${subject} with ${templateKey}:`, newPlan);
        return { ...prev, [subject]: [...existing, newPlan] };
      });

      if (wkCount > weeksCount) {
        setWeeksCount(wkCount);
      }

      setShowCreateModal(false);
      setSelectedTemplateKey(null);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const openRemoveModal = (subject) => {
    setRemoveTargetSubject(subject);
    setRemoveMode(null);
    setSelectedTemplateForRemoval(null);
    setSelectedTopicsToRemove([]);
    setShowRemoveModal(true);
  };

  const confirmRemove = (mode) => {
    if (!removeTargetSubject) return;

    if (mode === "topics") {
      setPlans(prev => {
        const copy = { ...prev };
        copy[removeTargetSubject] = (copy[removeTargetSubject] || []).map(plan => {
          if (plan.level === selectedTemplateForRemoval) {
            const updatedTopics = plan.topics.filter(t => !selectedTopicsToRemove.includes(t.name));
            const newAssignments = distributeTopics(updatedTopics, plan.weeks);
            return { ...plan, topics: updatedTopics, assignments: newAssignments };
          }
          return plan;
        });
        return copy;
      });
    } else if (mode === "tyt") {
      setPlans(prev => {
        const copy = { ...prev };
        copy[removeTargetSubject] = (copy[removeTargetSubject] || []).filter(p => p.level !== "TYT");
        return copy;
      });
    } else if (mode === "ayt") {
      setPlans(prev => {
        const copy = { ...prev };
        copy[removeTargetSubject] = (copy[removeTargetSubject] || []).filter(p => p.level !== "AYT");
        return copy;
      });
    } else if (mode === "all") {
      setPlans(prev => {
        const copy = { ...prev };
        delete copy[removeTargetSubject];
        return copy;
      });
    }

    setShowRemoveModal(false);
    setRemoveMode(null);
    setSelectedTopicsToRemove([]);
    setSelectedTemplateForRemoval(null);
    setRemoveTargetSubject(null);
  };

  const toggleComplete = (subject, topicName) => {
    const key = `${subject}::${topicName}`;
    setCompletedTopics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const topicsForCell = (subject, weekIndex) => {
    try {
      const plansForSubject = plans[subject] || [];
      const cell = [];

      console.log(`topicsForCell çağrıldı: ${subject}, hafta ${weekIndex + 1}`);
      console.log(`${subject} için planlar:`, plansForSubject);

      for (let p of plansForSubject) {
        if (!p || !Array.isArray(p.assignments)) {
          console.warn(`Plan assignments is not valid for ${subject}:`, p);
          continue;
        }

        console.log(`Plan ${p.title} assignments:`, p.assignments);

        if (weekIndex >= p.assignments.length) {
          console.log(`Hafta ${weekIndex + 1} assignments dizisi dışında`);
          continue;
        }

        const weekAss = p.assignments[weekIndex];
        console.log(`Raw weekAss for week ${weekIndex + 1}:`, weekAss);

        if (!Array.isArray(weekAss)) {
          console.log(`Hafta ${weekIndex + 1} için assignment yok veya geçersiz:`, weekAss);
          continue;
        }

        console.log(`Hafta ${weekIndex + 1} assignments:`, weekAss);

        for (let t of weekAss) {
          if (t && t.name) {
            const topic = {
              name: t.name,
              level: p.level || 'Unknown',
              difficulty: t.difficulty || 'Normal'
            };
            console.log(`Konu ekleniyor:`, topic);
            cell.push(topic);
          }
        }
      }

      console.log(`${subject} hafta ${weekIndex + 1} final cell:`, cell);
      return cell;
    } catch (error) {
      console.error(`Error in topicsForCell for ${subject}, week ${weekIndex + 1}:`, error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Planlayıcı</h1>
          <p className="text-gray-600 mb-4">Lütfen giriş yapın</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 rounded"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Planlayıcı</h1>
            <p className="text-sm text-gray-600">
              Kullanıcı: {user.email} | Genel İlerleme: {overallProgress()}%
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                if (window.confirm('Tüm veriler silinecek! Emin misiniz?')) {
                  setPlans({});
                  setCompletedTopics({});
                  if (user) {
                    await setDoc(doc(db, "users", user.uid), {
                      plans: {},
                      completedTopics: {},
                      resetAt: new Date()
                    });
                  }
                }
              }}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Tüm Verileri Sıfırla
            </button>
            <TreeGarden progress={overallProgress()} />
          </div>
        </header>

        <div className="grid grid-cols-8 gap-3 mb-6">
          {SUBJECTS.map((s) => {
            const subjectPlans = plans[s] || [];
            const progress = lessonProgress(s);

            return (
              <div key={s} className="bg-white p-3 rounded shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-sm">{s}</strong>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedSubjectForPlan(s);
                        setShowCreateModal(true);
                      }}
                      className="text-xs px-2 py-1 bg-yellow-400 rounded shadow hover:bg-yellow-500"
                    >
                      Plan Yükle
                    </button>
                    <button
                      onClick={() => openRemoveModal(s)}
                      className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  İlerleme: {progress}%
                  {subjectPlans.length > 0 && (
                    <span className="ml-2">({topicsForSubject(s).length} konu)</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {subjectPlans.length > 0
                    ? subjectPlans.map(pl => `${pl.title} (${pl.level})`).join(" • ")
                    : "Plan yok"
                  }
                </div>
                {subjectPlans.length > 0 && (
                  <div className="text-xs text-blue-500 mt-1">
                    Debug: {subjectPlans.length} plan,
                    {subjectPlans.reduce((total, plan) => total + (plan.assignments?.length || 0), 0)} hafta
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="overflow-auto border rounded bg-white mb-6">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 p-2 border-r font-semibold">Hafta</th>
                {SUBJECTS.map((s) => (
                  <th key={s} className="p-2 text-left border-r font-semibold">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((wIdx) => (
                <tr key={wIdx} className="hover:bg-gray-50">
                  <td className="p-2 font-medium border-r bg-gray-50">{wIdx}. Hafta</td>
                  {SUBJECTS.map((s) => {
                    const cellTopics = topicsForCell(s, wIdx - 1);
                    return (
                      <td key={s + wIdx} className="p-2 border-r align-top">
                        {cellTopics.length === 0 ? (
                          <div className="text-xs text-gray-400">&nbsp;</div>
                        ) : (
                          <ul className="text-sm space-y-1">
                            {cellTopics.map((t, i) => (
                              <li key={i}>
                                <label className="flex items-start space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!completedTopics[`${s}::${t.name}`]}
                                    onChange={() => toggleComplete(s, t.name)}
                                    className="mt-1 flex-shrink-0"
                                  />
                                  <span className={`text-sm ${completedTopics[`${s}::${t.name}`] ? "line-through text-gray-500" : ""}`}>
                                    {t.name}
                                    {t.level && <span className="text-xs text-gray-400 ml-1">— {t.level}</span>}
                                    {t.difficulty && <span className="ml-1 text-xs text-blue-500">({t.difficulty})</span>}
                                  </span>
                                </label>
                              </li>
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

        {showCreateModal && selectedSubjectForPlan && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded shadow-lg max-w-2xl w-full p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold">{selectedSubjectForPlan} için Plan Yükle</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Şablon Seç</h3>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {Object.keys(TOPIC_BANK).map((tk) => (
                      <button
                        key={tk}
                        onClick={() => setSelectedTemplateKey(tk)}
                        className={`w-full text-left p-2 rounded border hover:bg-gray-50 ${selectedTemplateKey === tk ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
                      >
                        <div className="font-medium text-sm">{tk}</div>
                        <div className="text-xs text-gray-500">{TOPIC_BANK[tk].length} konu</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Ayarlar</h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Kaç haftada bitsin?</label>
                    <input
                      type="number"
                      value={inputWeeks}
                      onChange={(e) => setInputWeeks(Math.max(1, Number(e.target.value || 1)))}
                      className="w-32 p-2 border rounded"
                      min="1"
                      max="52"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedTemplateKey) {
                          createPlanForSubject(selectedSubjectForPlan, selectedTemplateKey, inputWeeks);
                        }
                      }}
                      disabled={!selectedTemplateKey}
                      className={`px-4 py-2 rounded ${selectedTemplateKey ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                      Planla
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setSelectedTemplateKey(null);
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRemoveModal && removeTargetSubject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded shadow-lg w-full max-w-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">{removeTargetSubject} için Silme Seçenekleri</h2>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {!removeMode && (
                <div className="space-y-2">
                  <button
                    onClick={() => setRemoveMode("topics")}
                    className="w-full px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded"
                  >
                    Konu Sil
                  </button>
                  <button
                    onClick={() => setRemoveMode("all")}
                    className="w-full px-4 py-2 bg-red-200 hover:bg-red-300 rounded"
                  >
                    Hepsini Sil
                  </button>
                  <button
                    onClick={() => setShowRemoveModal(false)}
                    className="w-full px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              )}

              {removeMode === "topics" && !selectedTemplateForRemoval && (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTemplateForRemoval("TYT")}
                    className="w-full px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded"
                  >
                    TYT Konuları
                  </button>
                  <button
                    onClick={() => setSelectedTemplateForRemoval("AYT")}
                    className="w-full px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded"
                  >
                    AYT Konuları
                  </button>
                  <button
                    onClick={() => setRemoveMode(null)}
                    className="w-full px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Geri
                  </button>
                </div>
              )}

              {removeMode === "topics" && selectedTemplateForRemoval && (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {(() => {
                    const topicsList = (plans[removeTargetSubject] || [])
                      .filter(p => p.level === selectedTemplateForRemoval)
                      .flatMap(p => p.topics || []);
                    const uniq = [];
                    const seen = new Set();
                    topicsList.forEach(t => {
                      if (!seen.has(t.name)) {
                        seen.add(t.name);
                        uniq.push(t);
                      }
                    });
                    return uniq.map((t, i) => (
                      <div key={i} className="flex items-center space-x-2 p-1">
                        <input
                          type="checkbox"
                          checked={selectedTopicsToRemove.includes(t.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTopicsToRemove(prev => [...prev, t.name]);
                            } else {
                              setSelectedTopicsToRemove(prev => prev.filter(x => x !== t.name));
                            }
                          }}
                          className="flex-shrink-0"
                        />
                        <span className="text-sm">{t.name}</span>
                      </div>
                    ));
                  })()}

                  <button
                    onClick={() => confirmRemove("topics")}
                    disabled={selectedTopicsToRemove.length === 0}
                    className={`w-full px-4 py-2 rounded mt-2 ${selectedTopicsToRemove.length > 0 ? "bg-red-400 hover:bg-red-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Seçilen Konuları Sil ({selectedTopicsToRemove.length})
                  </button>

                  <button
                    onClick={() => setSelectedTemplateForRemoval(null)}
                    className="w-full px-4 py-2 border rounded mt-2 hover:bg-gray-50"
                  >
                    Geri
                  </button>
                </div>
              )}

              {removeMode === "all" && (
                <div className="space-y-2">
                  <button
                    onClick={() => confirmRemove("tyt")}
                    className="w-full px-4 py-2 bg-red-300 hover:bg-red-400 rounded"
                  >
                    Sadece TYT Sil
                  </button>
                  <button
                    onClick={() => confirmRemove("ayt")}
                    className="w-full px-4 py-2 bg-red-300 hover:bg-red-400 rounded"
                  >
                    Sadece AYT Sil
                  </button>
                  <button
                    onClick={() => confirmRemove("all")}
                    className="w-full px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded"
                  >
                    Tümünü Sil
                  </button>
                  <button
                    onClick={() => setRemoveMode(null)}
                    className="w-full px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Geri
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}