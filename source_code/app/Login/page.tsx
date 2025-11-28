"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/auth/auth";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null); // 👈 NEW

  const router = useRouter();

  useEffect(() => {
    try {
      const msg = window.sessionStorage.getItem("hmdd:auth:lastError");
      if (msg) {
        setAuthInfo(msg);
        window.sessionStorage.removeItem("hmdd:auth:lastError");
      }
    } catch {
      // ignore
    }
    try { const saved = localStorage.getItem("hmd_last_email"); if (saved) setEmail(saved); } catch { }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!email || !pw) {
      return setErr("Email and password are required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setErr("Enter a valid email.");
    }

    setBusy(true);
    try {
      // 🔑 Real Supabase sign-in
      const { data, error } = await signIn(email, pw, remember);

      if (error) {
        // Supabase will send helpful messages like "Invalid login credentials"
        setErr(error.message || "Invalid email or password.");
        return;
      }

      // Optionally keep your “last email” helper UX
      try {
        if (remember) {
          localStorage.setItem("hmd_last_email", email);
        } else {
          localStorage.removeItem("hmd_last_email");
        }
      } catch {
        // non-fatal
      }

      // If sign-in succeeded, redirect
      router.push("/");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }


  return (
    <main className="min-h-[calc(100vh-0px)] grid place-items-center bg-[white] px-4 py-12">
      <section className="w-full max-w-md">
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-3xl font-extrabold">Welcome back!</h1>
          <p className="text-2xl text-black-800 font-bold">Sign in to your account</p>
        </div>

        {/* 🔔 One-time auth info message (e.g. expired session) */}
        {authInfo && (
          <div className="mb-4 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            {authInfo}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</div>}

          <label className="block">
            <input
              className="mt-1 w-full rounded-xl border border-black-300 bg-gray-300 px-3 py-2 focus:border-[#abc8c1] focus:ring-2 focus:ring-[#abc8c1]/20"
              type="email" autoComplete="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="relative">
              <input
                className="mt-1 w-full rounded-xl bg-gray-300 border border-black-300 px-3 py-2 pr-10 focus:border-[#abc8c1] focus:ring-2 focus:ring-[#abc8c1]/20"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 right-1 flex items-center"
              >
                <Image
                  src="/images/pw-view.png"
                  alt="Toggle password visibility"
                  width={40}
                  height={40}
                  className={`opacity-70 hover:opacity-100 transition ${show ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="border border-gray-30 w-full bg-gray-30 rounded-xl bg-gray-300 text-gray-600 font-semibold py-3 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Continue"}
          </button>


          <div className="text-center font-semibold underline hover:opacity-80">
            Forgot Password?</div>


          <div className="relative text-center text-xs text-gray-500 py-2">
            <span className="bg-white px-2 relative z-10">Or</span>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="flex items-center justify-center w-full gap-3 rounded-[0.5vw] border border-black-300 bg-white px-6 py-2 shadow-sm hover:bg-gray-50 active:scale-[.99] transition"
            >
              <Image
                src="/images/google.png"
                alt="Google logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-bold">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full gap-3 rounded-[0.5vw] border border-black-300 bg-white px-6 py-2 shadow-sm hover:bg-gray-50 active:scale-[.99] transition"
            >
              <Image
                src="/images/fb2.png"
                alt="Facebook logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-bold">Facebook</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full gap-3 rounded-[0.5vw] border border-black-300 bg-white px-6 py-2 shadow-sm hover:bg-gray-50 active:scale-[.99] transition">
              <Image
                src="/images/appleLogo.png"
                alt="Apple logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-bold">Apple</span>
            </button>

          </div>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-semibold hover:underline">Sign Up</Link>
        </p>
      </section>
    </main>
  );
}
