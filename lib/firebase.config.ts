// lib/firebase.config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmjMRWUdKCWXW9q8n1WxroHMf6jOXwLok",
  authDomain: "next-js-37f1d.firebaseapp.com",
  projectId: "next-js-37f1d",
  storageBucket: "next-js-37f1d.firebasestorage.app",
  messagingSenderId: "59141633941",
  appId: "1:59141633941:web:c9394eacae61b03413e89c",
  measurementId: "G-05QHTEWP3W",
};

// Make sure we don’t re-initialize Firebase if it's already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

