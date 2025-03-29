import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-chat-app-fe8cc.firebaseapp.com",
  projectId: "ai-chat-app-fe8cc",
  storageBucket: "ai-chat-app-fe8cc.firebasestorage.app",
  messagingSenderId: "531040868671",
  appId: "1:531040868671:web:d2c7f879d09ff1104f9b8a",
  measurementId: "G-M7JTEG3YWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);