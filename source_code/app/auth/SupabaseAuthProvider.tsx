"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
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

  useEffect(() => {
    let cancelled = false;

    // 1️⃣ Initial bootstrap from stored session
    async function bootstrap() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      console.log("bootstrap session result", data, error);

      if (cancelled) return;

      if (error) {
        console.warn("Error getting initial session:", error);
        setSession(null);
        setUser(null);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    }

    bootstrap();

    // 2️⃣ Subscribe to auth state changes (login, logout, token refresh)
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
  }, []);

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
