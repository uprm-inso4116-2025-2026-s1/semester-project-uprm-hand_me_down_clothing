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
