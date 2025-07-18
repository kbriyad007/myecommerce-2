"use client";

import { X, Mail, Lock, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage("❌ Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Registered! Please check your email for confirmation.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Supabase Google OAuth redirect flow:
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
      setMessage("✅ Redirecting to Google login...");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("❌ Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
          {authMode === "login" ? (
            <>
              <Lock className="w-5 h-5 text-blue-600" />
              <span>Login</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Register</span>
            </>
          )}
        </h2>

        {/* Message */}
        {message && (
          <p
            className={`mb-3 text-center font-semibold ${
              message.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full text-sm bg-transparent focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-sm bg-transparent focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (authMode === "login" ? "Logging in..." : "Registering...") : authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-400">or</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium text-gray-700 disabled:opacity-50"
          type="button"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </button>

        {/* Auth Mode Switch */}
        <div className="mt-4 text-sm text-center text-gray-600">
          {authMode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
