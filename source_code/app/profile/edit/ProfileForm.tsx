'use client';

import React, { useState, useEffect } from 'react';
import { validateEmail } from './validator';
import { supabase } from '@/app/auth/supabaseClient';
import { useSupabaseAuth } from '@/app/auth/useSupabaseAuth';
import type { Profile } from '@/app/auth/auth';

type ProfileFormProps = {
  initialProfile: Profile | null;
};

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { user } = useSupabaseAuth();

  const [email, setEmail] = useState(initialProfile?.email ?? user?.email ?? '');
  const [firstname, setFirstname] = useState(initialProfile?.firstname ?? '');
  const [lastname, setLastname] = useState(initialProfile?.lastname ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // keep a copy of the original email to detect changes
  const originalEmail =
    initialProfile?.email ?? user?.email ?? null;

  useEffect(() => {
    setEmail(initialProfile?.email ?? user?.email ?? '');
    setFirstname(initialProfile?.firstname ?? '');
    setLastname(initialProfile?.lastname ?? '');
    setBio(initialProfile?.bio ?? '');
  }, [initialProfile, user]);

  if (!user) {
    return <div>Please sign in to edit your profile.</div>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // build display_name from first + last
    const displayName = `${firstname.trim()} ${lastname.trim()}`.trim();
    if (!displayName) {
      setError('Please enter at least a first or last name.');
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ If email changed, update it via Supabase Auth (this sends confirmation)
      if (originalEmail && email !== originalEmail) {
        const { error: emailErr } = await supabase.auth.updateUser({
          email,
        });

        if (emailErr) {
          console.error('Error updating auth email', emailErr);
          setError(
            emailErr.message ??
            'Could not update your email. Please try again.'
          );
          setLoading(false);
          return;
        }

        // let the user know they must confirm the new email
        setMessage(
          'We sent a confirmation link to your new email. Please confirm it to finish the change.'
        );
      }

      // 2️⃣ Upsert profile row (mirror data into profiles table)
      const upsertObj: Partial<Profile> & { id: string | undefined } = {
        id: user?.id,
        email, // mirror email, but auth is the source of truth
        firstname,
        lastname,
        display_name: displayName,
        bio,
        role: initialProfile?.role ?? 'user',
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(upsertObj, { onConflict: 'id' });

      if (upsertError) {
        console.error('Profile upsert error', upsertError);
        setError(upsertError.message);
      } else if (!originalEmail || email === originalEmail) {
        // only show generic success if we didn’t already show the email-change message
        setMessage('Profile saved successfully.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 w-100">
      {/* First name */}
      <div>
        <label className="block text-sm font-medium">First name</label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          title="First name"
          placeholder="Enter your first name"
        />
      </div>

      {/* Last name */}
      <div>
        <label className="block text-sm font-medium">Last name</label>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          title="Last name"
          placeholder="Enter your last name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          title="Email"
          placeholder="Enter your email address"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2 min-h-[100px]"
          title="Bio"
          placeholder="Tell other users a bit about yourself and your style."
        />
      </div>

      {/* Read-only stats */}
      {initialProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
          <div className="rounded border px-3 py-2 bg-gray-50">
            <div className="font-semibold">
              {initialProfile.followers_count ?? 0}
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="rounded border px-3 py-2 bg-gray-50">
            <div className="font-semibold">
              {initialProfile.following_count ?? 0}
            </div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
          <div className="rounded border px-3 py-2 bg-gray-50">
            <div className="font-semibold">
              {initialProfile.donations_count ?? 0}
            </div>
            <div className="text-xs text-gray-500">Donations</div>
          </div>
        </div>
      )}

      {/* Actions / messages */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </form>
  );
}
