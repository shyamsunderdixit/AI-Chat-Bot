import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJO_GoS2VkpCcCRWl9fN7uPf4ykwjsPI8",
  authDomain: "ai-chat-app-54fc0.firebaseapp.com",
  projectId: "ai-chat-app-54fc0",
  storageBucket: "ai-chat-app-54fc0.firebasestorage.app",
  messagingSenderId: "425560376864",
  appId: "1:425560376864:web:015f7a71957f1d9042de45",
  measurementId: "G-61NWJRQEXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);