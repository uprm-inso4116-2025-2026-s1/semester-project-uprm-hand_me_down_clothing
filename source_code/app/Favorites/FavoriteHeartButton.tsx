"use client";

import React from "react";
import {
  useFavoritesReader,
  useFavoritesMutator,
} from "@/app/Favorites/FavoritesProvider";

type Props = {
  listingId: number;
};

export function FavoriteHeartButton({ listingId }: Props) {
  const { isFavorite } = useFavoritesReader();   // 🔹 read-only
  const { toggleFavorite } = useFavoritesMutator(); // 🔹 write-only

  const active = isFavorite(listingId);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFavorite(listingId);
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={handleClick}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9F8F8] border-2 border-[#E5E7EF] text-xl transition hover:scale-105"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={active ? "text-[#f495ba]" : "text-[#9a9a9a]"}>
        {active ? "♥" : "♡"}
      </span>
    </button>
  );
}
