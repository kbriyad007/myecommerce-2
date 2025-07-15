"use client";

import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginFormSection() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
        router.push("/admin"); // Redirect on successful login
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("✅ Registered successfully! Check your email to confirm.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[380px] mx-auto mt-12 bg-white rounded-md shadow-lg p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-2 mb-2">
          {authMode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {authMode === "login" ? "Login" : "Register"}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </label>

        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium text-sm disabled:opacity-60"
        >
          {loading ? "Please wait..." : authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-3 text-center text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
      )}

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-200" />
        <span className="mx-2 text-gray-400 text-sm">or</span>
        <hr className="flex-grow border-gray-200" />
      </div>

      {/* Toggle Mode */}
      <p className="text-center text-sm text-gray-500">
        {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          className="text-blue-600 font-medium hover:underline"
        >
          {authMode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
