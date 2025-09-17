// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 Firestore import

// Çevre değişkenlerinden Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Firestore doğru export edildi

// Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// Google ile giriş (POPUP ile)
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Popup ile giriş başarılı:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google login popup error:", error);
  }
};

// Çıkış
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("👋 Kullanıcı çıkış yaptı");
  } catch (error) {
    console.error("Logout error:", error);
  }
};