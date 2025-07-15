"use client";

import { useState } from "react";
import { Mail, Lock, UserPlus, LogIn, Loader2, Facebook, Github, MailCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginFormSectionProps {
  onSuccess?: () => void;
}

export default function LoginFormSection({ onSuccess }: LoginFormSectionProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
        onSuccess?.();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/auth/callback",
          },
        });
        if (error) throw error;
        setMessage("✅ Registered successfully! Check your email to confirm.");
      }
    } catch (err: any) {
      setMessage("❌ " + err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/auth/callback",
      },
    });
    if (error) setMessage(`❌ ${error.message}`);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-xl rounded-2xl p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-2">
          {authMode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {authMode === "login" ? "Login" : "Register"}
        </h2>
        <p className="text-sm text-gray-500">
          {authMode === "login"
            ? "Welcome back! Please enter your details."
            : "Create an account to get started."}
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-semibold transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
      )}

      {/* Divider */}
      <div className="flex items-center my-5">
        <hr className="flex-grow border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs uppercase">or continue with</span>
        <hr className="flex-grow border-gray-200" />
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <MailCheck className="w-4 h-4 text-red-500" />
          Continue with Gmail
        </button>

        <button
          onClick={() => handleOAuthLogin("facebook")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <Facebook className="w-4 h-4 text-blue-500" />
          Continue with Facebook
        </button>
      </div>

      {/* Toggle Auth Mode */}
      <p className="text-center text-sm text-gray-500 mt-6">
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
  );
}
