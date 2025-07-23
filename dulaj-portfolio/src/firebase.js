// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Fixed Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKLsSw1zmvckES9BfEGqQf7Gf9go5x4q4",
  authDomain: "dulaj-portfolio.firebaseapp.com",
  projectId: "dulaj-portfolio",
  storageBucket: "dulaj-portfolio.appspot.com", // ✅ Corrected this line
  messagingSenderId: "1086066482215",
  appId: "1:1086066482215:web:79fcf69950a2ad19a78202"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services (optional, but needed for auth/login, db, etc.)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
