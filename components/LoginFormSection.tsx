"use client";

import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Loader2,
  Facebook,
  MailCheck,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose?: () => void;  // Added onClose prop
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
    <div className="relative w-[320px] min-h-[540px] mx-auto mt-12 bg-white rounded-lg shadow-md p-5 font-sans border border-gray-200">
      
      {/* Close button */}
      <button
        onClick={() => onClose && onClose()}
        aria-label="Close login form"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
      >
        ×
      </button>

      <div className="flex flex-col items-center mb-5">
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none"
            autoComplete="username"
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm">
          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none"
            autoComplete={authMode === "login" ? "current-password" : "new-password"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
      )}

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs uppercase tracking-widest">or</span>
        <hr className="flex-grow border-gray-200" />
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          aria-label="Continue with Google"
        >
          <MailCheck className="w-4 h-4 text-red-600" />
          Google
        </button>

        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          aria-label="Continue with Facebook"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          Facebook
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-5">
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
