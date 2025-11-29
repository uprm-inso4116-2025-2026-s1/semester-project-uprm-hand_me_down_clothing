// Client-side auth helpers (use in "use client" components)

// Log in (sign in) an existing user
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient'
import { setAuthPersistence } from './storage'
import { supabase } from './supabaseClient'
import { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  email?: string | null
  display_name?: string | null
  firstname?: string | null
  lastname?: string | null
  role?: string | null
  bio: string | null
  followers_count: number
  following_count: number
  donations_count: number
}

// 🔹 Domain model view of the authenticated user.
// Our app doesn't need all of Supabase.User; we keep a small, stable shape.
export type DomainUser = {
  id: string
  email: string | null
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export type OAuthProvider = 'google' | 'facebook' | 'apple'

/**
 * Start an OAuth sign-in flow with Supabase.
 * This will redirect the browser to the provider and then back to our app.
 */
export async function signInWithOAuth (
  provider: OAuthProvider,
  redirectPath: string = '/' // or "/" if you prefer
) {
  // In Next.js "use client" components, window is defined
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}${redirectPath}`
      : undefined

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo // Supabase will send the user back here after login
    }
  })

  return { data, error }
}

// Sign up (register) a new user
export async function signUp (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  const fullname = firstname + ' ' + lastname
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname,
        firstname,
        lastname
      }
    }
  })
  if (error) return { data: null, error }
  try {
    const userId = data?.user?.id
    if (userId) {
      const { error: upsertErr } = await supabase.from('profiles').upsert(
        {
          id: userId,
          email,
          display_name: fullname,
          firstname,
          lastname,
          role: 'user' // explicit default role
        },
        { onConflict: 'id' }
      )
      if (upsertErr) {
        // non-fatal: log for debugging
        console.warn('Profile upsert after signup failed:', upsertErr)
      }
    } else {
      // No user ID returned now (common when email confirmation is required).
      // Option: client can upsert profile later (on first successful sign-in).
    }
  } catch (e) {
    console.warn('Unexpected error upserting profile after signup:', e)
  }

  return { data, error }
}

export async function signIn (
  email: string,
  password: string,
  remember = false
) {
  // store persistence preference so the storage adapter picks it up
  try {
    setAuthPersistence(remember)
  } catch (e) {
    // non-fatal
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Log out the current user
export async function signOut () {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Request password reset email
export async function requestPasswordReset (email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/reset-password` // 👈 this route we’ll create below
  })

  // IMPORTANT: for security, callers should *not* differ UI
  // whether error is "user not found" or not. Just log and
  // always show a generic success message.
  if (error) {
    console.warn('resetPasswordForEmail error:', error)
  }

  return { data, error }
}

// Complete password update (called from reset-password page)
export async function finishPasswordReset (newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('updateUser password error:', error)
  }

  return { data, error }
}

// Update password using access token (from email link)

// Password update is handled via Supabase's magic link flow.
// After user clicks the reset link in their email, direct them to a page to set a new password using supabase.auth.updateUser({ password: newPassword })
export async function updatePassword (newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

// Send email verification (for new users or sensitive changes)

// Email verification is handled automatically by Supabase via magic links sent on sign-up or sensitive changes.
// To check if a user's email is verified, use getUser() and inspect user.email_confirmed_at.

// Handle email verification (Supabase uses magic links)
// Typically, this is handled automatically when user clicks the link in their email.
// You can check verification status via supabase.auth.getUser()
export async function getUser () {
  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}

// --- Phone-based 2FA helpers ---
// Send OTP to phone for sign-in or verification
export async function signInWithPhone (phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ phone })
  return { data, error }
}

// Verify phone OTP (type 'sms') and, on success, mark phone as verified in user metadata
export async function verifyPhoneOtp (phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  })
  if (error) return { data, error }

  // On successful verification, update user's metadata to mark phone verification and enable 2FA
  try {
    // store phone and 2fa flag in user metadata
    await supabase.auth.updateUser({ data: { phone, phone_2fa: 'enabled' } })
  } catch (e) {
    // ignore metadata update failure but return success for verification
  }

  return { data, error }
}

export type UserWithProfileResult = {
  user: User | null
  profile: Profile | null
  error: Error | null
}

/**
 * Generic helper that works with both:
 *  - client-side supabase client (browser)
 *  - server-side supabase client (SSR / route handlers)
 *
 * You pass *your* supabase instance, we do:
 *  - supabase.auth.getUser()
 *  - SELECT * FROM profiles WHERE id = user.id
 */
export async function getAuthUserWithProfile (
  supabaseClient: SupabaseClient
): Promise<UserWithProfileResult> {
  // 1) Get the current auth user
  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser()

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      error: userError ?? new Error('No authenticated user')
    }
  }

  // 2) Get that user's profile
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<Profile>() // safer than .single() if row might not exist

  return {
    user,
    profile: profile ?? null,
    error: profileError ?? null
  }
}

export async function getProfileByUserId (
  supabaseClient: SupabaseClient,
  userId: string
): Promise<{ profile: Profile | null; error: Error | null }> {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle<Profile>()

  return {
    profile: data ?? null,
    error: error ?? null
  }
}

// 🔁 Anti-Corruption Layer translator:
// Convert Supabase.User to our internal DomainUser shape.
export function toDomainUser (user: User | null): DomainUser | null {
  if (!user) return null

  return {
    id: user.id,
    email: user.email ?? null
  }
}
