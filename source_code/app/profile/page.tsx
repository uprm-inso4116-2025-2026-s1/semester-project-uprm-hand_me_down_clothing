import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import ProfileForm from './ProfileForm'
import { cookies } from 'next/headers'

export default async function ProfilePage() {
  // server-side: create supabase client that reads cookies
  const supabase = createServerComponentClient({ cookies })

  // get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    // not signed in: show a message or redirect to sign-in page
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-4">You must be signed in to view this page. <a href="/Login" className="text-blue-600">Sign in</a></p>
      </div>
    )
  }

  // fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // If profile missing we pass null and the client component will upsert on save/sign-in
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm initialProfile={profile ?? null} />
      {error && (
        <div className="mt-4 text-red-600">Failed loading profile: {String(error.message)}</div>
      )}
    </div>
  )
}