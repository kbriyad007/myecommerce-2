// components/FirebaseGoogleLogin.tsx
"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase.config";

export default function FirebaseGoogleLogin() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Firebase user:", user);
      // Optional: Send user info to Firestore or display it
    } catch (error) {
      console.error("❌ Firebase Google login error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
}
