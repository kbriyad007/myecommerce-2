"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EmailVerificationMessage() {
  const searchParams = useSearchParams();

  const error = searchParams?.get("error") ?? null;
  const errorDescription = searchParams?.get("error_description") ?? null;
  const errorCode = searchParams?.get("error_code") ?? null;

  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (error) {
      setMessage(`❌ ${errorDescription || "Email confirmation failed."}`);
    } else if (errorCode === "access_denied") {
      setMessage("❌ Email link is invalid or expired.");
    } else {
      setMessage("✅ Your email has been confirmed! You can now log in.");
    }
  }, [error, errorDescription, errorCode]);

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center font-sans">
      <h1 className="text-xl font-semibold mb-4">Email Confirmation</h1>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <EmailVerificationMessage />
      </Suspense>
    </div>
  );
}
