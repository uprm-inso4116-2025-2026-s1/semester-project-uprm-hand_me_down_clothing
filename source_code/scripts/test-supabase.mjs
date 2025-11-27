import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local explicitly
dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase URL or Key in .env.local')
  process.exit(2)
}

const supabase = createClient(url, key)

async function test() {
  try {
    const { data, error } = await supabase.from('pieces').select('id').limit(1)
    if (error) {
      console.error('Supabase error:', error)
      process.exit(3)
    }
    console.log('Supabase connected. Sample row:', data)
    process.exit(0)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

test()
