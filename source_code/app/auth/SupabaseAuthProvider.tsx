"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);

      // 1️⃣ Read session from storage
      const { data, error } = await supabase.auth.getSession();
      console.log("bootstrap session result", data, error);

      if (cancelled) return;

      if (error || !data.session) {
        if (error) {
          console.warn("Error getting initial session:", error);
        }
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // 2️⃣ Validate session with backend
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (userError || !userData?.user) {
        console.warn(
          "Invalid or expired session detected during bootstrap. Signing out.",
          userError
        );

        // ❗ Clear invalid session
        await supabase.auth.signOut();

        // ❗ Store a one-time flash message for the login page
        try {
          window.sessionStorage.setItem(
            "hmdd:auth:lastError",
            "Your session expired or became invalid. Please sign in again."
          );
        } catch {
          // storage might be unavailable; ignore
        }

        // ❗ Redirect to login (only if we're still mounted)
        if (!cancelled) {
          router.replace("/login");
        }

        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // ✅ Session is valid
      setSession(data.session);
      setUser(userData.user);
      setLoading(false);
    }

    bootstrap();

    // 3️⃣ Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);

  const value: AuthContextValue = { user, session, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider");
  }
  return ctx;
}
