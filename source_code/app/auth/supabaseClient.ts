import { createClient } from '@supabase/supabase-js'
import storageAdapter from './storage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: storageAdapter
	}
})
