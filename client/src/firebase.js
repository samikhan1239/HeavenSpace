// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "heaven-space.firebaseapp.com",
  projectId: "heaven-space",
  storageBucket: "heaven-space.appspot.com",
  messagingSenderId: "190111359234",
  appId: "1:190111359234:web:37f0ece631fa536a6e221b",
  measurementId: "G-6MP02Q2Y0F",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
