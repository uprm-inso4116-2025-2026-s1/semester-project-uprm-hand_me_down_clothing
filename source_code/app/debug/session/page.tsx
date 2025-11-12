import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DebugSessionPage() {
  // Pass the cookies function (do NOT await) — auth-helpers will call it correctly.
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  return (
    <div className="p-6">
      <h1 className="text-lg font-medium mb-4">Debug: Server Session</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({ session, error: error?.message ?? null }, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-gray-600">
        If session is null here after signing in with a client using createPagesBrowserClient,
        your browser did not receive the cookie or the cookie wasn't sent back to the server.
      </p>
    </div>
  )
}