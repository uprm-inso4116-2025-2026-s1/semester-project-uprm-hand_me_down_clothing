"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useFavoritesReader,
  useFavoritesMutator,
} from "@/app/Favorites/FavoritesProvider";
import { PieceRepository } from "@/src/repositories/pieceRepository";
import { createClient } from '@/app/utils/supabase/client'
import type { Piece } from "@/app/types/piece";
import { HeartIcon, HeartFilledIcon, ShareIcon, MessageIcon, EditIcon, DeleteIcon, SettingsIcon } from '@/src/components/Icons'

const brand = {
  pink: "#E7A4A4",
  mint: "#C7E2E0",
  beige: "#F8E4D9",
  red: "#E68A8A",
  borderStrong: "#B0B0B0",
} as const;

// As part of the data integration for Favorites, I had to adjust the logic so the url showed the real id linked to the listings.
//To access the page, use the following format (id number will vary):
//http://localhost:3000/listings/individuallist?id=1

export default function IndividualListing() {

  // Get listing ID from URL query params. This is used to load the correct piece.
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const idParam = searchParams.get("id");
  const listingId = idParam ? Number(idParam) : NaN;
  const router = useRouter();

  const { isFavorite } = useFavoritesReader();
  const { toggleFavorite } = useFavoritesMutator();

  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null)

  
  const isSaved =
    !Number.isNaN(listingId) && isFavorite(listingId);


  // Load piece from piece repository
  useEffect(() => {
    if (Number.isNaN(listingId)) {
      setPiece(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const repo = new PieceRepository();
      const result = await repo.getPieceById(listingId);
      if (!cancelled) {
        setPiece(result);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  // Load current user from Supabase for permission checks
  useEffect(() => {
    const supabase = createClient()
    let cancelled = false
    const loadUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (!cancelled) {
          if (!error) setCurrentUser(user)
          else setCurrentUser(null)
        }
      } catch {
        if (!cancelled) setCurrentUser(null)
      }
    }
    loadUser()
    return () => { cancelled = true }
  }, [])

  if (Number.isNaN(listingId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-600">
          No listing id provided in the URL.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-600">Loading listing…</p>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-600">Listing not found.</p>
      </div>
    );
  }

  const suggestions = [
    { title: "H&M Hoodie", meta: "Size: M • Like New" },
    { title: "Champion Crew", meta: "Size: M • Like New" },
    { title: "Zara Pullover", meta: "Size: M • Like New" },
    { title: "Vintage Hoodie", meta: "Size: M • Like New" },
  ];


  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-600 mt-6">
        <nav className="flex items-center gap-2">
          {piece.getCategoryTrail().map((c: string) => (
            <React.Fragment key={c}>
              <a href="#" className="hover:text-neutral-900">
                {c}
              </a>
              <span>/</span>
            </React.Fragment>
          ))}
          <span className="text-neutral-900 font-medium">
            {piece.getTitle()}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          <div className="rounded-3xl overflow-hidden border border-neutral-200 aspect-[4/3] flex items-center justify-center bg-white">
            {piece.images && piece.images.length > 0 ? (
              // show selected image
              <img
                src={piece.images[activeIndex]}
                alt={piece.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-neutral-600">No image available</div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-4">
            {(piece.images && piece.images.length > 0 ? piece.images : [null, null, null, null, null]).map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-2xl border bg-white aspect-[5/4] flex items-center justify-center text-xs ${
                  activeIndex === i ? 'border-neutral-400' : 'border-neutral-200'
                }`}
              >
                {url ? (
                  <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-neutral-500">—</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between">
                <h1
                  className="text-3xl md:text-4xl font-extrabold italic tracking-tight"
                  style={{ fontFamily: "Lato, system-ui, sans-serif" }}
                >
                  {piece.getTitle()}
                </h1>
                <div
                  className="text-2xl md:text-4xl font-extrabold italic tracking-tight"
                  style={{ color: brand.mint }}
                >
                  {piece.getFormattedPrice()}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {piece.getBadges().map((b: string) => (
                  <span
                    key={b}
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: brand.beige,
                      borderColor: brand.beige,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-4">
                  <dt className="w-28 text-neutral-500 text-sm">Category</dt>
                  <dd className="text-sm text-neutral-800">{piece.getFormattedCategory() || 'N/A'}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-28 text-neutral-500 text-sm">Location</dt>
                  <dd className="text-sm text-neutral-800">{piece.getLocation() || 'N/A'}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-28 text-neutral-500 text-sm">Condition</dt>
                  <dd className="text-sm text-neutral-800">{piece.getFormattedCondition() || 'N/A'}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-28 text-neutral-500 text-sm">Size</dt>
                  <dd className="text-sm text-neutral-800">{piece.getFormattedSize() || 'N/A'}</dd>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {/* Owner-specific actions */}
                {currentUser && piece && currentUser.id === piece.user_id ? (
                  <>
                    <button
                      onClick={() => router.push(`/listings/edit_piece?id=${listingId}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm transition"
                      style={{ borderColor: brand.borderStrong }}
                    >
                      <EditIcon size={16} /> Edit
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) return
                        const repo = new PieceRepository()
                        const ok = await repo.deletePiece(listingId)
                        if (ok) {
                          alert('Listing deleted')
                          router.push('/')
                        } else {
                          alert('Failed to delete listing')
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm transition"
                      style={{ borderColor: '#e55353' }}
                    >
                      <DeleteIcon size={16} color="#e55353" /> Delete
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium hover:opacity-90"
                      style={{ backgroundColor: brand.beige }}
                      onClick={() => router.push(`/listings/${listingId}/manage`)}
                    >
                      <SettingsIcon size={16} /> Manage
                    </button>
                  </>
                ) : (
                  // Viewer actions
                  <>
                    <button
                      onClick={() => toggleFavorite(listingId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm transition"
                      style={{ borderColor: brand.borderStrong }}
                      aria-pressed={isSaved}
                      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      {isSaved ? (
                        <HeartFilledIcon size={16} />
                      ) : (
                        <HeartIcon size={16} />
                      )}
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm"
                      style={{ borderColor: brand.borderStrong }}
                    >
                      <ShareIcon size={16} /> Share
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium hover:opacity-90"
                      style={{ backgroundColor: brand.beige }}
                    >
                      <MessageIcon size={16} /> Contact
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span
                  className="px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: brand.beige,
                    borderColor: brand.beige,
                  }}
                >
                  {piece.getTags()[0]}
                </span>
                <span
                  className="px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: brand.pink,
                    borderColor: brand.pink,
                    color: "#2b2b2b",
                  }}
                >
                  {piece.getFormattedCondition()}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center font-semibold text-white border shadow-sm aspect-square"
                  style={{
                    backgroundColor: "#1A1A1A",
                    borderColor: brand.borderStrong,
                    width: "48px",
                    borderRadius: "50%",
                  }}
                >
                  {piece.getDonorInitials()}
                </div>
                <div>
                  <div className="font-medium">{piece.user_id || 'Unknown'}</div>
                  <div className="text-xs text-neutral-600">
                    N/A ★ • N/A •
                    Response: N/A
                  </div>
                </div>
              </div>
              <button
                className="text-xs rounded-full border px-3 py-1.5 hover:bg-neutral-50"
                style={{ borderColor: brand.borderStrong }}
              >
                View profile
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Description + “you might also like” kept the same as before */}
      {/* ... your same sections ... */}
    </div>
  );
}
