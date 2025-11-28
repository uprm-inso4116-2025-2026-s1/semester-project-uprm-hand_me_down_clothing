// utils/supabase/getAuthUserWithProfile.ts
import { createServerSupabaseClient } from './supabaseServerClient'

export async function getAuthUserWithProfile () {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      user: null,
      profile: null,
      error
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile: profile ?? null,
    error: profileError ?? null
  }
}
