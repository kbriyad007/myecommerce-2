"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase.config";
import { supabase } from "@/lib/supabaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose?: () => void;
  useSupabase?: boolean;
}

export default function LoginFormSection({
  onSuccess,
  onClose,
  useSupabase = false,
}: LoginFormSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (useSupabase) {
        // Supabase auth
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          setMessage("✅ Please check your email to confirm your account.");
        }
      } else {
        // Firebase auth
        if (isLogin) {
          const result = await signInWithEmailAndPassword(auth, email, password);
          const user = result.user;

          if (!user.emailVerified) {
            setError("❌ Email not verified. Please check your inbox.");
            return;
          }
        } else {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          const user = result.user;

          if (user) {
            await sendEmailVerification(user);
            setMessage("✅ Signup successful. Please verify your email before logging in.");
            return; // prevent auto-login after signup
          }
        }
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Google User:", user);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || "Google login failed");
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
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setMessage(null);
          }}
          className="text-blue-600 hover:underline font-medium"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>

      {!useSupabase && (
        <div className="my-4 border-t pt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Continue with Google
          </button>
        </div>
      )}
    </section>
  );
}
