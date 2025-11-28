'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'

import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { getAuthWithProfile, type Profile, type Role } from './auth'

type AuthContextValue = {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: Role
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<AuthContextValue>({
    user: null,
    session: null,
    profile: null,
    role: 'user',
    loading: true
  })

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setValue(v => ({ ...v, loading: true }))
      const { data } = await getAuthWithProfile(supabase)
      if (cancelled) return
      setValue({ ...data, loading: false })
    }

    bootstrap()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      bootstrap()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useSupabaseAuth must be used inside SupabaseAuthProvider')
  }
  return ctx
}
