"use client";

import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import type { StaticImageData } from "next/image";
import googleLogo from "@/logos/google.png";
import facebookLogo from "@/logos/facebook.png";
import appleLogo from "@/logos/apple.png";

import { validators } from "./validate";

type FieldKey = keyof typeof validators;

export default function SignupOneToOne() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setField = (k: FieldKey, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: validators[k](v) }));
  };

  const onBlur = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));

  const isValid = Object.entries(values).every(
    ([k, v]) => validators[k as FieldKey](v) === ""
  );

  async function handleCreateAccount() {
    setMessage(null);
    setMessageType(null);
    setBusy(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            fullname: `${values.first} ${values.last}`,
            firstname: values.first,
            lastname: values.last,
          },
        },
      });

      if (error) {
        setMessage(error.message ?? "Sign-up failed. Please try again.");
        setMessageType("error");
        return;
      }

      if ((data as any)?.session) {
        router.push("/profile");
      } else {
        setMessage(
          "✅ Account created successfully! Please check your email to verify your account before signing in."
        );
        setMessageType("success");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error during signup.");
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Top-right helper link */}
      <div className="absolute right-8 top-6 text-sm text-gray-500">
        <span className="hidden sm:inline">Already registered?</span>{" "}
        <a href="/Login" className="font-medium text-gray-800 hover:underline">
          Sign in
        </a>
      </div>

      {/* Centered column */}
      <div className="mx-auto flex min-h-screen w-full max-w-[720px] items-start justify-center">
        <div className="w-full px-6 pt-24 sm:px-8">
          <div className="mx-auto w-full max-w-[420px]">
            <h1 className="text-[24px] sm:text-[28px] font-semibold text-gray-900 mb-6">
              Create your account
            </h1>

            {/* First/Last name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="First name"
                  value={values.first}
                  onChange={(e) => setField("first", e.target.value)}
                  onBlur={() => onBlur("first")}
                  aria-invalid={!!errors.first && touched.first}
                  aria-describedby="first-help"
                  className={`h-12 text-base ${touched.first && errors.first
                      ? "border-red-500"
                      : "border-[#00000033]"
                    }`}
                />
                {touched.first && errors.first && (
                  <p id="first-help" className="mt-1 text-[13px] text-red-600">
                    {errors.first}
                  </p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Last name"
                  value={values.last}
                  onChange={(e) => setField("last", e.target.value)}
                  onBlur={() => onBlur("last")}
                  aria-invalid={!!errors.last && touched.last}
                  aria-describedby="last-help"
                  className={`h-12 text-base ${touched.last && errors.last
                      ? "border-red-500"
                      : "border-[#00000033]"
                    }`}
                />
                {touched.last && errors.last && (
                  <p id="last-help" className="mt-1 text-[13px] text-red-600">
                    {errors.last}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <Input
                placeholder="Email"
                type="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                aria-invalid={!!errors.email && touched.email}
                aria-describedby="email-help"
                className={`h-12 text-base ${touched.email && errors.email
                    ? "border-red-500"
                    : "border-[#00000033]"
                  }`}
              />
              {touched.email && errors.email && (
                <p id="email-help" className="mt-1 text-[13px] text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <div className="relative w-full">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={() => onBlur("password")}
                  aria-invalid={!!errors.password && touched.password}
                  aria-describedby="password-help"
                  className={`pr-12 h-12 text-base w-full ${touched.password && errors.password
                      ? "border-red-500"
                      : "border-[#00000033]"
                    }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {touched.password && errors.password && (
                <p id="password-help" className="mt-1 text-[13px] text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* --- ✅ User Message Section --- */}
            {message && (
              <div
                className={`mt-5 flex items-start gap-2 rounded-md p-3 text-sm ${messageType === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                  }`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="h-5 w-5 mt-[2px]" />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-[2px]" />
                )}
                <p>{message}</p>
              </div>
            )}

            {/* Primary CTA */}
            <button
              type="button"
              disabled={!isValid}
              className={`mt-5 w-full rounded-md border border-[#00000033] bg-gray-300 text-gray-700 text-sm sm:text-base font-medium h-12 ${!isValid ? "opacity-60 cursor-not-allowed" : ""
                }`}
              onClick={handleCreateAccount}
            >
              {busy ? "Creating account..." : "Create personal account"}
            </button>

            {/* Divider */}
            <div className="mt-6 mb-3 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">Or continue with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="flex items-center gap-4">
              <SocialButton label="Google" imgSrc={googleLogo} />
              <SocialButton label="Facebook" imgSrc={facebookLogo} />
              <SocialButton label="Apple" imgSrc={appleLogo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-12 w-full rounded-md border bg-gray-100 px-3 text-base text-gray-900",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300",
        className,
      ].join(" ")}
    />
  );
}

function SocialButton({
  label,
  imgSrc,
}: {
  label: string;
  imgSrc: string | StaticImageData;
}) {
  const src = typeof imgSrc === "string" ? imgSrc : imgSrc.src;
  return (
    <button
      type="button"
      className="flex h-10 flex-1 items-center justify-center gap-3 rounded-md border border-[#00000033] bg-gray-100 px-3 text-sm sm:text-base text-gray-700 hover:bg-gray-200"
    >
      <img src={src} alt="" className="h-5 w-5 object-contain" />
      <span className="leading-none">{label}</span>
    </button>
  );
}
