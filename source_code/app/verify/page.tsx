"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "used">("loading");
  const [message, setMessage] = useState<string>("Verifying your email...");

  useEffect(() => {
    // Guard against searchParams being null
    if (!searchParams) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // Supabase sends token_hash and type in verification links
    if (!token_hash || !type) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    async function verify() {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token_hash as string,
        type: type as "signup" | "recovery" | "email_change",
      });

      if (error) {
        console.error("Verification error:", error.message);
        if (error.message.includes("expired")) {
          setStatus("expired");
          setMessage("This verification link has expired. Please sign up again or request a new one.");
        } else if (error.message.includes("used")) {
          setStatus("used");
          setMessage("This verification link has already been used. You can sign in instead.");
        } else {
          setStatus("error");
          setMessage("Invalid or expired verification link. Please try again.");
        }
        return;
      }

      setStatus("success");
      setMessage("✅ Your email has been successfully verified! You can now sign in.");
    }

    verify();
  }, [searchParams, supabase]);

  const handleRedirect = () => {
    if (status === "success") router.push("/Login");
    else router.push("/sign-up");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-sm rounded-2xl p-6 text-center border border-gray-100">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-gray-500 animate-spin mb-3" />
            <p className="text-gray-700">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
            <h1 className="text-lg font-semibold text-green-700 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={handleRedirect}
              className="mt-5 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Go to Sign In
            </button>
          </div>
        )}

        {(status === "error" || status === "expired" || status === "used") && (
          <div className="flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-600 mb-3" />
            <h1 className="text-lg font-semibold text-red-700 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={handleRedirect}
              className="mt-5 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
