'use client'

import { useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

// The hook accepts either shape returned by useSession() across helper versions:
// - some versions return Session | null
// - others return { data: Session | null }
// We normalise that into `session`.
export function useEnsureProfileOnSignIn() {
  const supabase = useSupabaseClient()
  const maybeSession = useSession() // could be Session | null OR { data: Session | null }

  // Normalize the session object (robust to different helper versions)
  const session = (maybeSession as any)?.data ?? (maybeSession as any)

  useEffect(() => {
    if (!session?.user) return
    const user = session.user

      ; (async () => {
        try {
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              email: user.email,
              display_name: user.user_metadata?.fullname ?? null,
              firstname: user.user_metadata?.firstname ?? null,
              lastname: user.user_metadata?.lastname ?? null,
              role: 'user' // client should only set 'user'
            },
            { onConflict: 'id' }
          )
        } catch (e) {
          console.warn('Failed to upsert profile on sign-in', e)
        }
      })()
  }, [session, supabase])
}