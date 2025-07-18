"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Facebook, Lock, Mail } from "lucide-react";
import FirebaseGoogleLogin from "@/components/FirebaseGoogleLogin";

interface LoginFormSectionProps {
  onSuccess?: () => void;
}

export default function LoginFormSection({ onSuccess }: LoginFormSectionProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      let response;
      if (isLogin) {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        response = await supabase.auth.signUp({ email, password });
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setMessage(`✅ ${isLogin ? "Login" : "Signup"} successful`);
      onSuccess?.();
    } catch (error) {
      const err =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setMessage(`❌ ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "facebook") => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });

      if (error) throw error;
    } catch (error) {
      const err =
        error instanceof Error ? error.message : "OAuth login failed.";
      setMessage(`❌ ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto px-4 py-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isLogin ? "Log in to your account" : "Create a new account"}
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2">
          <Mail className="w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2">
          <Lock className="w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <FirebaseGoogleLogin onSuccess={onSuccess} />

        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          aria-label="Continue with Facebook"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          Facebook
        </button>

        {message && (
          <p className="text-sm text-center mt-2 text-gray-700">{message}</p>
        )}
      </div>
    </section>
  );
}
