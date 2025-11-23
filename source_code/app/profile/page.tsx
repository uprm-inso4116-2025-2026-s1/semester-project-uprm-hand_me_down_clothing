// app/profile/page.tsx  (adjust path if different)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProfileForm from "./ProfileForm";
import { supabase } from "@/app/auth/supabaseClient";
import { useSupabaseAuth } from "@/app/auth/useSupabaseAuth";
import { getAuthUserWithProfile, getProfileByUserId, Profile } from "../auth/auth";

export default function ProfilePage() {
  const { user, loading } = useSupabaseAuth();


  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch profile whenever we have a logged-in user
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);

      if (!user?.id) {
        setProfile(null);
        setProfileError("User ID is missing.");
        setProfileLoading(false);
        return;
      }
      const { profile, error } = await getProfileByUserId(supabase, user.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed loading profile:", error);
        setProfile(null);
        setProfileError(error.message);
      } else {
        setProfile(profile);
        setProfileError(null);
      }

      setProfileLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Still figuring out auth state
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-4">Checking your session…</p>
      </div>
    );
  }

  // No user after auth finished → require sign-in
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-4">
          You must be signed in to view this page.{" "}
          <Link href="/Login" className="text-blue-600 underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // User is logged in; show profile form (and optional loading/error UI)
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {profileLoading && (
        <p className="mb-4 text-sm text-gray-500">Loading your profile…</p>
      )}

      <ProfileForm initialProfile={profile ?? null} />

      {profileError && (
        <div className="mt-4 text-red-600">
          Failed loading profile: {profileError}
        </div>
      )}
    </div>
  );
}
