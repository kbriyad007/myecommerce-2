"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase.config";
import { supabase } from "@/lib/supabaseClient";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function LoginFormSection({
  onSuccess,
  onClose,
}: LoginFormSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false); // Toggle between Firebase & Supabase
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (useSupabase) {
        // Supabase email/password login/signup
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
        }
      } else {
        // Firebase email/password login/signup
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Google User:", user);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google login failed";
      setError(message);
    }
  };

  return (
    <section className="relative w-full max-w-md mx-auto px-4 py-6 bg-white rounded-lg shadow">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close login form"
        >
          &times;
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useSupabase}
            onChange={() => setUseSupabase(!useSupabase)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm select-none">
            Use Supabase Auth (uncheck for Firebase)
          </span>
        </label>
      </div>

      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline font-medium"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>

      <div className="my-4 border-t pt-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Continue with Google (Firebase only)
        </button>
      </div>
    </section>
  );
}
