"use client";

import React, { useEffect, useState } from "react";
import { useFavoritesReader } from "@/app/Favorites/FavoritesProvider";
import type { Piece } from "@/app/types/piece";
import { PieceRepository } from '@/src/repositories/pieceRepository';
import { ListingCard } from "@/src/components/ReusableListingCard";

export default function FavoritesPage() {
  const { favorites } = useFavoritesReader(); // 🔹 reader-only usage
  const [items, setItems] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!favorites.length) {
      setItems([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      setLoading(true);
      setError(null);

      try {
        const repo = new PieceRepository();

        const results = await Promise.all(
          favorites.map((id) => repo.getPieceById(id))
        );

        const valid = results.filter((p): p is Piece => Boolean(p));

        if (!cancelled) {
          setItems(valid);
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load favorite listings.");
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-sm text-zinc-600">Loading favorites…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center">
        <p className="text-2xl font-semibold">No favorites yet</p>
        <p className="mt-2 text-sm text-zinc-600">
          Tap the ♥ icon on any listing to save it.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white text-zinc-900">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
