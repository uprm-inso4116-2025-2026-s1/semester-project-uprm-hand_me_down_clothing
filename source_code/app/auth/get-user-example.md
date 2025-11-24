# 🔐 Using Authentication & Profile Data in Pages

A unified guide for accessing **auth session** and **user profile data** in both client and server components.  
This includes usage of the helper functions:

- `useSupabaseAuth()` — client-side session & user state
- `getAuthUserWithProfile()` — server-side user + profile
- `getProfileByUserId(userId)` — client-side profile fetch

---

## ✅ 1. Client Components

Add this at the top of the file:

```ts
'use client'
```

Import the necessary helpers

```ts
import { useSupabaseAuth } from '@/app/auth/useSupabaseAuth'
import { getProfileByUserId } from '@/app/auth/getUserProfile'
```

Access the auth session

```tsx
const { user, session, loading } = useSupabaseAuth()
```

Fetch the profile (client-side)

```tsx
const [profile, setProfile] = useState(null)

useEffect(() => {
  async function load() {
    if (!user) return
    const { profile, error } = await getProfileByUserId(user.id)
    setProfile(profile)
  }
  load()
}, [user])
```

Protecting a client-side page

```tsx
if (loading) return <div>Loading…</div>
if (!user) return <Redirect to='/login' />
```

## 🖥️ 2. Server Components

Import server helpers

```ts
import { createClient } from '@/app/utils/supabase/supabaseServerClient'
import { getAuthUserWithProfile } from '@/app/auth/getAuthUserWithProfile'
```

Fetch user + profile on the server

```tsx
const supabase = await createClient()
const { user, profile, error } = await getAuthUserWithProfile()
```

Protecting a server-side page

```tsx
if (!user) {
  redirect('/login')
}
```

Using the profile

```tsx
return <div>Welcome, {profile.display_name}</div>
```

---

🧪 Example: Fully Protected Client Page

```tsx
'use client'

import { useSupabaseAuth } from '@/app/auth/useSupabaseAuth'
import { useEffect, useState } from 'react'
import { getProfileByUserId } from '@/app/auth/getUserProfile'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  useEffect(() => {
    if (!user) return
    async function load() {
      const { profile } = await getProfileByUserId(user.id)
      setProfile(profile)
    }
    load()
  }, [user])

  if (loading || !profile) return <div>Loading…</div>

  return <div>Hello {profile.display_name}</div>
}
```

---

🧪 Example: Fully Protected Server Page

```tsx
import { redirect } from 'next/navigation'
import { getAuthUserWithProfile } from '@/app/auth/getAuthUserWithProfile'

export default async function Dashboard() {
  const { user, profile } = await getAuthUserWithProfile()

  if (!user) redirect('/login')

  return <div>Dashboard for {profile.display_name}</div>
}
```
