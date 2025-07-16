"use client";

import { Loader2, Facebook } from "lucide-react";
import { useState } from "react";
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
    <div className="w-[320px] mx-auto mt-10 bg-white border border-gray-300 rounded-md p-6 font-sans text-center shadow-sm">
      <h1 className="text-4xl font-bold font-serif mb-4 tracking-wider">MyApp</h1>
      <p className="text-gray-500 text-sm mb-4">Sign in to see updates from your account</p>

      {/* Facebook Login Button */}
      <button
        onClick={() => handleOAuth("facebook")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-medium mb-4 flex items-center justify-center gap-2"
      >
        <Facebook className="w-4 h-4" />
        Log in with Facebook
      </button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-400 text-xs uppercase tracking-wide">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Email / Password */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Mobile Number or Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoComplete={authMode === "login" ? "current-password" : "new-password"}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 font-medium text-sm flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {authMode === "login" ? "Log In" : "Register"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
      )}

      <div className="mt-4 text-xs text-gray-500 px-1 leading-tight">
        People who use our service may have uploaded your contact info.{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Learn More
        </a>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        By signing up, you agree to our{" "}
        <a href="#" className="text-blue-500 hover:underline">Terms</a>,{" "}
        <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> and{" "}
        <a href="#" className="text-blue-500 hover:underline">Cookies Policy</a>.
      </p>

      {/* Footer toggle */}
      <p className="text-sm text-gray-600 mt-5">
        {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-600 font-medium hover:underline"
          onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
        >
          {authMode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}

