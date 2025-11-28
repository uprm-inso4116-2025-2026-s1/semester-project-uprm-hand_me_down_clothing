// app/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/auth/supabaseClient";
import { finishPasswordReset } from "@/app/auth/auth";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Step 1: when user lands here, Supabase should already have set a recovery session
  useEffect(() => {
    async function checkRecoverySession() {
      setChecking(true);
      setError(null);
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("Invalid/expired recovery session:", error);
        setTokenValid(false);
        setError(
          "This reset link is invalid or has expired. Please request a new password reset email."
        );
      } else {
        setTokenValid(true);
      }

      setChecking(false);
    }

    checkRecoverySession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error } = await finishPasswordReset(password);

    if (error) {
      console.error("finishPasswordReset error:", error);
      setError(
        "We couldn’t update your password. This link may be invalid or expired. Please request a new reset email."
      );
    } else {
      setMessage("Your password has been updated. You can now sign in.");
      // Optional: redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }

    setSubmitting(false);
  }

  if (checking) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8">
        <p className="text-sm text-gray-600">Checking your reset link…</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8">
        <h1 className="mb-3 text-2xl font-semibold">Reset link problem</h1>
        <p className="mb-4 text-sm text-red-700">{error}</p>
        <button
          onClick={() => router.push("/forgot-password")}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Request a new reset link
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Set a new password</h1>
      <p className="mb-6 text-sm text-gray-600">
        Choose a strong password that you don’t use on other sites.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input
            type="password"
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm password</label>
          <input
            type="password"
            value={confirm}
            minLength={8}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Updating password…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
