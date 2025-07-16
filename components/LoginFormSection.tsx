"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Loader2,
  Facebook,
  MailCheck,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export default function LoginFormSection({ onSuccess, onClose }: LoginFormSectionProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
        onSuccess?.();
        onClose(); // close after success
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("✅ Registered! Check your email to confirm.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    });
    if (error) setMessage("❌ " + error.message);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose} // close modal if clicking outside form box
    >
      <div
        className="relative w-full max-w-[320px] bg-white rounded-xl shadow-xl p-5 font-sans border border-gray-100 transition-all"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg font-bold"
          aria-label="Close login form"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-2">
            {authMode === "login" ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mt-2">
            {authMode === "login" ? "Login" : "Register"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold flex justify-center items-center gap-2 disabled:opacity-60 text-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-2 text-center text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
        )}

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-2 text-xs text-gray-400 uppercase">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        {/* OAuth */}
        <div className="space-y-2">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <MailCheck className="w-4 h-4 text-red-600" />
            Google
          </button>
          <button
            onClick={() => handleOAuth("facebook")}
            className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </button>
        </div>

        {/* Toggle login/register */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
