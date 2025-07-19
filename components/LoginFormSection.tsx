"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

interface LoginFormSectionProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function LoginFormSection({ onSuccess, onClose }: LoginFormSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          setMessage("Please verify your email before logging in.");
          return;
        }

        setMessage("Login successful!");

        if (onSuccess) onSuccess();
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);
        setMessage("Signup successful! Please check your email for verification.");
        setIsLogin(true); // Switch to login after signup

        if (onSuccess) onSuccess();
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessage(err.message);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {message && (
        <p
          className={`text-sm text-center ${
            message.toLowerCase().includes("successful") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="w-4 h-4 mr-2" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="w-4 h-4 mr-2" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isLogin ? (
            <span className="flex justify-center items-center gap-2">
              <LogIn className="w-4 h-4" /> Login
            </span>
          ) : (
            <span className="flex justify-center items-center gap-2">
              <UserPlus className="w-4 h-4" /> Sign Up
            </span>
          )}
        </button>
      </form>

      <p className="text-sm text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>

      {onClose && (
        <div className="text-center mt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}
