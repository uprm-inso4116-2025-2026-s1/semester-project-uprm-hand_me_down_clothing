import { supabase } from './supabaseClient'

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
  return { data, error }
}

// Log in (sign in) an existing user
export async function signIn (email: string, password: string) {
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
export async function requestPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

// Update password using access token (from email link)

// Password update is handled via Supabase's magic link flow.
// After user clicks the reset link in their email, direct them to a page to set a new password using supabase.auth.updateUser({ password: newPassword })
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

// Send email verification (for new users or sensitive changes)

// Email verification is handled automatically by Supabase via magic links sent on sign-up or sensitive changes.
// To check if a user's email is verified, use getUser() and inspect user.email_confirmed_at.

// Handle email verification (Supabase uses magic links)
// Typically, this is handled automatically when user clicks the link in their email.
// You can check verification status via supabase.auth.getUser()
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}
