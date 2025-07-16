"use client";

import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Loader2,
  Facebook,
  MailCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose?: () => void;
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
        if (onSuccess) onSuccess();
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
    <div className="relative w-full max-w-[300px] mx-auto mt-16 bg-white rounded-2xl shadow-xl p-5 font-sans border border-gray-100 transition-all">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        aria-label="Close login form"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Icon & Title */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-100 text-blue-600 rounded-full p-2">
          {authMode === "login" ? (
            <LogIn className="w-5 h-5" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          {authMode === "login" ? "Login" : "Register"}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-blue-500 transition">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="username"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-blue-500 transition">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete={authMode === "login" ? "current-password" : "new-password"}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-3 text-center text-xs text-gray-600 whitespace-pre-wrap">{message}</p>
      )}

      {/* Divider */}
      <div className="flex items-center my-5">
        <hr className="flex-grow border-gray-200" />
        <span className="mx-3 text-gray-400 text-xs uppercase tracking-widest">or</span>
        <hr className="flex-grow border-gray-200" />
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition"
        >
          <MailCheck className="w-4 h-4 text-red-500" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          Continue with Facebook
        </button>
      </div>

      {/* Toggle Auth Mode */}
      <p className="text-center text-sm text-gray-500 mt-5">
        {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          className="text-blue-600 font-semibold hover:underline"
        >
          {authMode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
