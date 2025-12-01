"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useFavoritesReader,
  useFavoritesMutator,
} from "@/app/Favorites/FavoritesProvider";
import { PieceRepository } from "@/src/repositories/pieceRepository";
import type { Piece } from "@/app/types/piece";
import { Category, Condition, Size } from "@/app/types/classifications";

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

  const { isFavorite } = useFavoritesReader();
  const { toggleFavorite } = useFavoritesMutator();

  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);


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

  // Map Piece → your old "product" shape where needed
  const product = {
    title: piece.name,
    categoryTrail: ["Home", "Hoodies"], // can make this smarter later
    description: {
      material: "80% Cotton, 20% Polyester",
      care: "Machine wash cold, tumble dry low.",
      measurements: [
        { label: "Chest (pit-to-pit)", value: "21in" },
        { label: "Length", value: "27in" },
        { label: "Sleeve", value: "24in" },
      ],
      notes: [
        "Comes from smoke-free, pet-free home",
        "Slightly oversized fit",
      ],
      tip: "Meet in a public place for local swaps. For shipping, use tracked methods.",
    },
    price:
      (piece as any).getFormattedPrice?.() ??
      (piece.price != null ? piece.price.toString() : "0"),
    badges: [
      Condition[piece.condition] ?? "Used",
      Size[piece.size] ?? "N/A",
    ],
    tags: ["Unisex fit", "New"],
    details: {
      category: Category[piece.category] ?? "Clothing",
      location: "Mayagüez, PR", // placeholder; plug real location if you have it
      condition: Condition[piece.condition] ?? "Used",
      size: Size[piece.size] ?? "N/A",
    },
    donor: {
      initials: "D",
      name: "Donor",
      rating: 4.8,
      stats: "23 donations",
      response: "High",
    },
  };

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
          {product.categoryTrail.map((c) => (
            <React.Fragment key={c}>
              <a href="#" className="hover:text-neutral-900">
                {c}
              </a>
              <span>/</span>
            </React.Fragment>
          ))}
          <span className="text-neutral-900 font-medium">
            {product.title}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          <div
            className="rounded-3xl overflow-hidden border border-neutral-200 aspect-[4/3] flex items-center justify-center"
            style={{ backgroundColor: brand.mint }}
          >
            <div className="text-neutral-600">Main Image</div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n, i) => (
              <button
                key={n}
                onClick={() => setActiveIndex(i)}
                className={`rounded-2xl border bg-white aspect-[5/4] flex items-center justify-center text-xs ${activeIndex === i
                    ? "border-neutral-400"
                    : "border-neutral-200"
                  }`}
              >
                Thumb {n}
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
                  {product.title}
                </h1>
                <div
                  className="text-2xl font-semibold"
                  style={{ color: brand.mint }}
                >
                  {product.price}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {product.badges.map((b) => (
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

              <dl className="mt-5 grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-neutral-500">Category:</dt>
                <dd className="col-span-2">{product.details.category}</dd>
                <dt className="text-neutral-500">Location:</dt>
                <dd className="col-span-2">{product.details.location}</dd>
                <dt className="text-neutral-500">Condition:</dt>
                <dd className="col-span-2">{product.details.condition}</dd>
                <dt className="text-neutral-500">Size:</dt>
                <dd className="col-span-2">{product.details.size}</dd>
              </dl>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {/*Favorite button using real listingId from ?id=*/}
                <button
                  onClick={() => toggleFavorite(listingId)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm transition"
                  style={{ borderColor: brand.borderStrong }}
                  aria-pressed={isSaved}
                  aria-label={
                    isSaved
                      ? "Remove from favorites"
                      : "Save to favorites"
                  }
                >
                  <span
                    className={
                      isSaved ? "text-[#f495ba]" : "text-neutral-500"
                    }
                  >
                    {isSaved ? "♥" : "💗"}
                  </span>
                  <span>{isSaved ? "Saved" : "Save"}</span>
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
                <span
                  className="px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: brand.beige,
                    borderColor: brand.beige,
                  }}
                >
                  {product.tags[0]}
                </span>
                <span
                  className="px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: brand.pink,
                    borderColor: brand.pink,
                    color: "#2b2b2b",
                  }}
                >
                  {product.tags[1]}
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
                  {product.donor.initials}
                </div>
                <div>
                  <div className="font-medium">{product.donor.name}</div>
                  <div className="text-xs text-neutral-600">
                    {product.donor.rating} ★ • {product.donor.stats} •
                    Response: {product.donor.response}
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
