// src/lib/firebase.ts
// Central Firebase initialisation — import from here, never re-initialise elsewhere.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ─── Your Firebase project config (nirman-af3c3) ────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCR3vATntZmT8Na_IInbzkmZq2jZYdM484",
  authDomain: "nirman-af3c3.firebaseapp.com",
  projectId: "nirman-af3c3",
  storageBucket: "nirman-af3c3.appspot.com",
  messagingSenderId: "563386907649",
  appId: "1:563386907649:web:0bfc758a0882f29d419400",
};

// Prevent multiple initialisation in hot-reload environments
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
