// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);

    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address.");
      setSubmitting(false);
      return;
    }

    // Call helper – but DO NOT reveal whether the email exists
    const { error } = await requestPasswordReset(trimmed);
    if (error) {
      // Log it, but don’t expose to user
      console.warn("Password reset request error:", error);
    }

    setMessage(
      "If an account exists for this email, we’ve sent password reset instructions."
    );
    setSubmitting(false);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Forgot your password?</h1>
      <p className="mb-6 text-sm text-gray-600">
        Enter the email associated with your account and we’ll send you a link
        to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>

        {message && (
          <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Sending email…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remembered your password?{" "}
        <Link href="/Login" className="text-blue-600 underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
