// app/auth/supabaseClient.ts

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import storageAdapter from './storage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Shared singleton client (good default)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter
  }
})

// Optional factory if you ever need a fresh instance
export function createClient () {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: storageAdapter
    }
  })
}
