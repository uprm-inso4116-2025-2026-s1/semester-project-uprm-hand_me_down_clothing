// Log in (sign in) an existing user
import { setAuthPersistence } from './storage'
import { supabase } from './supabaseClient'
import { User } from '@supabase/supabase-js'
import { mapAuthError, logAuthError } from './errorMapper'

export type Profile = {
  id: string
  email?: string | null
  display_name?: string | null
  firstname?: string | null
  lastname?: string | null
  role?: string | null
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
  if (error) {
    logAuthError('signUp', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }
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
  if (error) {
    logAuthError('signIn', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }
  return { data, error }
}

// Log out the current user
export async function signOut () {
  const { error } = await supabase.auth.signOut()
  if (error) logAuthError('signOut', error)
  return { error }
}

// Request password reset email
export async function requestPasswordReset (email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) {
    logAuthError('requestPasswordReset', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
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
  if (error) {
    logAuthError('updatePassword', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }
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
  if (error) {
    logAuthError('getUser', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }
  return { data, error }
}

// --- Phone-based 2FA helpers ---
// Send OTP to phone for sign-in or verification
export async function signInWithPhone (phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ phone })
  if (error) {
    logAuthError('signInWithPhone', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }
  return { data, error }
}

// Verify phone OTP (type 'sms') and, on success, mark phone as verified in user metadata
export async function verifyPhoneOtp (phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  })
  if (error) {
    logAuthError('verifyPhoneOtp', error)
    return { data: null, error: { ...error, message: mapAuthError(error) } }
  }

  // On successful verification, update user's metadata to mark phone verification and enable 2FA
  try {
    // store phone and 2fa flag in user metadata
    await supabase.auth.updateUser({ data: { phone, phone_2fa: 'enabled' } })
  } catch (e) {
    // ignore metadata update failure but return success for verification
  }

  return { data, error }
}
