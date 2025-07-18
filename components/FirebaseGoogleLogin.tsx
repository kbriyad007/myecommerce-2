// components/FirebaseGoogleLogin.tsx
"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useState } from "react";

interface FirebaseGoogleLoginProps {
  onSuccess?: () => void;
}

export default function FirebaseGoogleLogin({ onSuccess }: FirebaseGoogleLoginProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        setMessage(`✅ Logged in as ${user.email}`);
        if (onSuccess) onSuccess();
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Google login failed.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
        disabled={loading}
        aria-label="Continue with Google"
      >
        <span className="text-red-600 font-bold">G</span>
        Sign in with Google
      </button>
      {message && (
        <p className="text-sm text-center text-gray-600">{message}</p>
      )}
    </div>
  );
}
