// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config — make sure storageBucket matches your actual bucket
const firebaseConfig = {
  apiKey: "AIzaSyBKLsSw1zmvckES9BfEGqQf7Gf9go5x4q4",
  authDomain: "dulaj-portfolio.firebaseapp.com",
  projectId: "dulaj-portfolio",
  storageBucket: "dulaj-portfolio.firebasestorage.app", // Corrected bucket here
  messagingSenderId: "1086066482215",
  appId: "1:1086066482215:web:79fcf69950a2ad19a78202"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
