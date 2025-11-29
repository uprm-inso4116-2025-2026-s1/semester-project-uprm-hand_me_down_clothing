"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PieceRepository } from "@/src/repositories/pieceRepository";
import { createClient } from '@/app/auth/supabaseClient'
import type { Piece } from "@/app/types/piece";

export default function IndividualListing() {
  const brand = {
    pink: "#E7A4A4",
    mint: "#C7E2E0",
    beige: "#F8E4D9",
    red: "#E68A8A",
    borderStrong: "#B0B0B0",
  } as const;

  // Get listing ID from URL query params. This is used to load the correct piece.
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const idParam = searchParams.get("id");
  const listingId = idParam ? Number(idParam) : NaN;
  const router = useRouter();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null)


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
=======
  const product = {
    title: "Nike Hoodie — Lavender",
    categoryTrail: ["Home", "Hoodies"],
    description: {
      material: "80% Cotton, 20% Polyester",
      care: "Machine wash cold, tumble dry low.",
      measurements: [
        { label: "Chest (pit-to-pit)", value: "21in" },
        { label: "Length", value: "27in" },
        { label: "Sleeve", value: "24in" },
      ],
      notes: [
        "Worn twice, no visible flaws",
        "Comes from smoke-free, pet-free home",
        "Slightly oversized fit",
      ],
      tip: "Meet in a public place for local swaps. For shipping, use tracked methods.",
    },
    price: "Free",
    badges: ["New", "M"],
    tags: ["Unisex fit", "New"],
    details: {
      category: "Jacket",
      location: "Mayagüez, PR",
      condition: "Like New",
      size: "M (Unisex)",
    },
    donor: {
      initials: "D",
      name: "Dani M.",
      rating: 4.8,
      stats: "23 donations",
      response: "High",
    },
  };
>>>>>>> origin/main

  const suggestions = [
    { title: "H&M Hoodie", meta: "Size: M • Like New" },
    { title: "Champion Crew", meta: "Size: M • Like New" },
    { title: "Zara Pullover", meta: "Size: M • Like New" },
    { title: "Vintage Hoodie", meta: "Size: M • Like New" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-600 mt-6">
        <nav className="flex items-center gap-2">
          {piece.getCategoryTrail().map((c: string) => (
            <React.Fragment key={c}>
              <a href="#" className="hover:text-neutral-900">{c}</a>
              <span>/</span>
            </React.Fragment>
          ))}
<<<<<<< HEAD
          <span className="text-neutral-900 font-medium">
            {piece.getTitle()}
          </span>
=======
          <span className="text-neutral-900 font-medium">{product.title}</span>
>>>>>>> origin/main
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
<<<<<<< HEAD
                  activeIndex === i ? 'border-neutral-400' : 'border-neutral-200'
=======
                  activeIndex === i ? "border-neutral-400" : "border-neutral-200"
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
                <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-tight" style={{ fontFamily: 'Lato, system-ui, sans-serif' }}>
                  {product.title}
                </h1>
                <div className="text-2xl font-semibold" style={{ color: brand.mint }}> {product.price} </div>
>>>>>>> origin/main
              </div>

              <div className="mt-3 flex items-center gap-2">
                {piece.getBadges().map((b: string) => (
                  <span
                    key={b}
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ backgroundColor: brand.beige, borderColor: brand.beige }}
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
<<<<<<< HEAD
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
=======
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm"
                  style={{ borderColor: brand.borderStrong }}
                >
                  <span>💗</span> Save
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm"
                  style={{ borderColor: brand.borderStrong }}
                >
                  <span>↗</span> Share
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium hover:opacity-90"
                  style={{ backgroundColor: brand.beige }}
                >
                  Contact
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full border" style={{ backgroundColor: brand.beige, borderColor: brand.beige }}>
                  {product.tags[0]}
                </span>
                <span className="px-3 py-1 rounded-full border" style={{ backgroundColor: brand.pink, borderColor: brand.pink, color: '#2b2b2b' }}>
                  {product.tags[1]}
>>>>>>> origin/main
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center font-semibold text-white border shadow-sm aspect-square"
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderColor: brand.borderStrong,
                    width: '48px',
                    borderRadius: '50%',
                  }}
                >
                  {piece.getDonorInitials()}
                </div>
                <div>
<<<<<<< HEAD
                  <div className="font-medium">{piece.user_id || 'Unknown'}</div>
                  <div className="text-xs text-neutral-600">
                    N/A ★ • N/A •
                    Response: N/A
                  </div>
=======
                  <div className="font-medium">{product.donor.name}</div>
                  <div className="text-xs text-neutral-600">{product.donor.rating} ★ • {product.donor.stats} • Response: {product.donor.response}</div>
>>>>>>> origin/main
                </div>
              </div>
              <button className="text-xs rounded-full border px-3 py-1.5 hover:bg-neutral-50" style={{ borderColor: brand.borderStrong }}>View profile</button>
            </div>
          </div>
        </aside>
      </main>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 p-6 relative overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p><span className="font-medium">Material:</span> {product.description.material}</p>
              <p><span className="font-medium">Care:</span> {product.description.care}</p>
              <div className="mt-4">
                <h3 className="text-base font-medium">Measurements:</h3>
                <ul className="mt-2 space-y-1">
                  {product.description.measurements.map((m) => (
                    <li key={m.label}>• {m.label}: {m.value}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium">Notes:</h3>
              <ul className="mt-2 space-y-1">
                {product.description.notes.map((n, idx) => (
                  <li key={idx}>• {n}</li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="mt-6 -mb-6 -mx-6 px-6 py-3 text-xs"
            style={{ backgroundColor: brand.beige, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
          >
            <span className="font-medium">Tip:</span> {product.description.tip}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-lg font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestions.map((s) => (
            <a key={s.title} href="#" className="group rounded-3xl border border-neutral-200 overflow-hidden p-4 hover:shadow-sm transition">
              <div
                className="rounded-2xl aspect-[16/11] flex items-center justify-center"
                style={{ backgroundColor: brand.mint }}
              />
              <div className="mt-3">
                <div className="text-sm font-semibold italic group-hover:underline">{s.title}</div>
                <div className="text-xs text-neutral-600 mt-0.5">{s.meta}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}