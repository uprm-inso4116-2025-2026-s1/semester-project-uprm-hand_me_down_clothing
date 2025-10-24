'use client'

import React, { useState, ReactNode } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useEnsureProfileOnSignIn } from '../lib/useEnsureProfileOnSignIn'

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  // create browser supabase client once
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  // upsert profile automatically on SIGNED_IN
  useEnsureProfileOnSignIn()

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
      {children}
    </SessionContextProvider>
  )
}