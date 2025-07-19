"use client";

import { useState } from "react";
import {
  auth,
} from "@/lib/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Mail, Lock } from "lucide-react";

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
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Optionally send email verification
        if (userCredential.user) {
          await userCredential.user.sendEmailVerification();
          setMessage(
            "✅ Signup successful! Please check your email to verify your account."
          );
        }
      }
    } catch (error) {
      const err = error as Error;
      setMessage(`❌ ${err.message}`);
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
      } else {
        setMessage("❌ Google login failed. No user returned.");
      }
    } catch (error) {
      const err = error as Error;
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {message && (
        <div
          className={`text-sm text-center font-medium ${
            message.startsWith("❌") ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}

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

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center gap-2 border border-gray-300 text-sm w-full py-2 rounded hover:bg-gray-100 transition"
      >
        <span className="text-red-600 font-bold">G</span>
        Continue with Google
      </button>

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
