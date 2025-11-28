"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/app/auth/supabaseClient";
import { useSupabaseAuth } from "@/app/auth/useSupabaseAuth";
import { Profile } from "../auth/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();

  const [activeTab, setActiveTab] = useState<"Shop" | "Favorites" | "History">(
    "Shop"
  );
  const [filters, setFilters] = useState({
    Category: "",
    Brand: "",
    Size: "",
    Price: "",
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const items = Array.from({ length: 6 });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔐 Redirect if not logged in once auth is known
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // 📥 Fetch profile when we have a user
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (cancelled) return;

      if (error) {
        console.error("Failed loading profile:", error);
        setProfile(null);
        setProfileError(error.message);
      } else {
        setProfile(data as Profile);
      }

      setProfileLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ⏳ Global loading state (auth still bootstrapping)
  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-gray-600">Checking your session…</p>
      </div>
    );
  }

  // If user is missing, we already pushed to /login, but show fallback
  if (!user) {
    return null;
  }

  const displayName =
    profile?.display_name ||
    (profile?.firstname || profile?.lastname
      ? `${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim()
      : user.email ?? "Your shop");

  const followers =
    profile?.followers_count != null ? profile.followers_count : 0;
  const following =
    profile?.following_count != null ? profile.following_count : 0;

  const roleLabel = profile?.role ?? "user";
  const description =
    profile?.bio ??
    `Add a description to your profile to tell others about your style, preferences, or donation story.`;

  return (
    <div
      className="min-h-[100dvh] bg-white text-zinc-900"
      style={{
        ["--brand" as string]: "#e6dac7",
        fontFamily:
          "Lato, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      {/* Top section with avatar + basic info */}
      <section className="px-10 pt-10 pb-6 text-left">
        <div className="flex items-start gap-6">
          {/* Avatar placeholder – eventually you can bind to profile.avatar_url */}
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {profileLoading ? "Loading profile…" : displayName}
            </h1>

            {/* Role / rating row */}
            <div className="mt-2 flex items-center gap-4">
              {/* Fake 5-star row, can later bind to real rating */}
              <div className="flex gap-1 text-gray-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              <span className="text-xs font-medium uppercase tracking-wide text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
                {roleLabel}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              {/* This line can later be bound to a computed stat, e.g. donations count */}
              {profile?.donations_count
                ? `has donated more than ${Math.floor(profile.donations_count / 10) * 10} pieces of clothing`
                : "No donations yet"}
            </p>

            <div className="mt-3 flex items-center gap-6 text-sm font-semibold text-black">
              <span>{followers} Followers</span>
              <span>{following} Following</span>

              {/* Edit → send to your profile edit page that uses ProfileForm */}
              <button
                type="button"
                onClick={() => router.push("/profile/edit")}
                className="ml-4 px-4 py-1 rounded bg-black text-white hover:bg-zinc-800 text-xs md:text-sm"
              >
                Edit profile
              </button>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-gray-800 font-medium">{profile?.firstname}’s shop</p>
              <p className="text-gray-600 leading-relaxed">{description || "Add profile description..."}</p>
            </div>

            {profileError && (
              <p className="mt-2 text-sm text-red-600">
                Failed to load profile: {profileError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tabs: Shop / Favorites / History */}
      <section className="px-10 mt-4">
        <div className="flex gap-10 border-b border-gray-300 pb-2">
          {(["Shop", "Favorites", "History"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-medium ${activeTab === tab
                ? "border-b-2 border-black pb-1 text-black"
                : "text-gray-600 hover:text-black"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Filters (static for now) */}
      <section className="px-10 mt-4 flex flex-wrap gap-3">
        {["Category", "Brand", "Size", "Price"].map((filter) => (
          <div key={filter} className="relative">
            <label className="sr-only" htmlFor={`filter-${filter}`}>
              {filter}
            </label>
            <select
              id={`filter-${filter}`}
              aria-label={filter}
              onChange={(e) => handleFilterChange(filter, e.target.value)}
              value={filters[filter as keyof typeof filters]}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e6dac7]"
            >
              <option value="">{filter}</option>
              <option disabled>— Empty —</option>
            </select>
          </div>
        ))}
      </section>

      {/* Content grid */}
      <section className="px-10 mt-6 pb-16">
        {activeTab === "Shop" && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* TODO: replace this placeholder with real user pieces fetched with user.id */}
            {items.map((_, i) => (
              <li key={i}>
                <article className="flex flex-col rounded-3xl border border-[#E5E7EF] bg-white">
                  <div className="w-full h-52 bg-[#aac7c0] p-3 rounded-3xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-6 px-3 bg-[#f6e5e6] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                        Condition
                      </span>
                      <span className="inline-flex items-center justify-center h-6 px-3 bg-[#F9F8F8] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                        Price
                      </span>
                    </div>
                    <div className="mt-3 h-[140px] w-full rounded-xl border border-white/40 bg-white/30 animate-pulse" />
                  </div>

                  <div className="px-5 py-3">
                    <div className="h-5 w-3/4 bg-zinc-200 rounded mb-2 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3 w-5/6 bg-zinc-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-zinc-200 rounded animate-pulse" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {[0, 1, 2].map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EF] px-2 py-0.5 text-[0.8rem] text-zinc-600"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            aria-hidden
                            focusable="false"
                            className="h-3 w-3 text-zinc-600"
                          >
                            <path
                              d="M3 12l9-9 9 9-9 9-9-9z"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                          <span className="h-3 w-10 bg-zinc-200 rounded animate-pulse inline-block" />
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {activeTab !== "Shop" && (
          <div className="text-center text-gray-500 mt-20">
            <p>{activeTab} section coming soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
