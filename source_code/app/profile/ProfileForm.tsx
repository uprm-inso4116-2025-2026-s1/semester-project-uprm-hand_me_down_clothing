'use client';

import React, { useState, useEffect } from 'react';
import { validateEmail } from './validator';
import { supabase } from '@/app/auth/supabaseClient';
import { useSupabaseAuth } from '@/app/auth/useSupabaseAuth';

type Profile = {
  id: string;
  email?: string | null;
  display_name?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  role?: string | null;
};

export default function ProfileForm({
  initialProfile,
}: {
  initialProfile: Profile | null;
}) {
  // 🔁 Use your own auth context instead of @supabase/auth-helpers-react
  const { user } = useSupabaseAuth();

  const [email, setEmail] = useState(
    initialProfile?.email ?? user?.email ?? ''
  );
  const [firstname, setFirstname] = useState(initialProfile?.firstname ?? '');
  const [lastname, setLastname] = useState(initialProfile?.lastname ?? '');
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialProfile?.email ?? user?.email ?? '');
    setFirstname(initialProfile?.firstname ?? '');
    setLastname(initialProfile?.lastname ?? '');
    setDisplayName(initialProfile?.display_name ?? '');
  }, [initialProfile, user]);

  // If somehow user is still missing, *then* show this:
  if (!user) {
    return <div>Please sign in to edit your profile.</div>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Basic client validation
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const upsertObj = {
        id: user?.id,
        email,
        display_name: displayName,
        firstname,
        lastname,
        // DO NOT allow client to set role other than 'user'; server/RLS/trigger protects it.
        role: 'user',
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(upsertObj, { onConflict: 'id' });

      if (upsertError) {
        console.error('Profile upsert error', upsertError);
        setError(upsertError.message);
      } else {
        setMessage('Profile saved successfully.');
      }
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">First name</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Last name</label>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </form>
  );
}
