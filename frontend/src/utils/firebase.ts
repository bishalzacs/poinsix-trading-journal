import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCfgbWrXQAqcDQUAQX0_1r8OLYHgrg7jg",
  authDomain: "poinsix-journal.firebaseapp.com",
  projectId: "poinsix-journal",
  storageBucket: "poinsix-journal.firebasestorage.app",
  messagingSenderId: "643891970172",
  appId: "1:643891970172:web:ebb4c1963d6809f0f989f9",
  measurementId: "G-EET9KPFEEH"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
