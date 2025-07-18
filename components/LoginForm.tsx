"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginForm() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Please provide both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { error } =
        authMode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage(
          authMode === "register"
            ? "✅ Signup successful! Check your email for confirmation."
            : "✅ Login successful!"
        );
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        setMessage(`✅ Logged in with Google as ${user.email}`);
        // Optional: You can save user info in your backend or redirect
      } else {
        setMessage("❌ Google login failed. No user returned.");
      }
    } catch (error: any) {
      const errorMsg = error?.message || "Google login failed.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="text-sm text-center font-medium text-red-500">
          {message}
        </div>
      )}

      {/* Email Input */}
      <div className="relative">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-4 py-2 pl-10 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Password Input */}
      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-4 py-2 pl-10 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded text-sm font-semibold transition"
      >
        {loading
          ? authMode === "login"
            ? "Logging in..."
            : "Signing up..."
          : authMode === "login"
          ? "Login"
          : "Register"}
      </button>

      {/* Google Login Button (via Firebase) */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center gap-2 border border-gray-300 text-sm w-full py-2 rounded hover:bg-gray-100 transition"
      >
        <LogIn className="w-4 h-4" />
        Continue with Google
      </button>

      {/* Toggle Auth Mode */}
      <div className="text-center text-sm text-gray-500 mt-2">
        {authMode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setAuthMode("register")}
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setAuthMode("login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
