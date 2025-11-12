'use client'

import React, { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // createPagesBrowserClient returns a client that integrates with pages/api/auth/[...supabase].ts
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}