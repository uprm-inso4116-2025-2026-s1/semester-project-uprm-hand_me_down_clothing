"use client";

import React from "react";
import { Category, Condition, Size } from "@/app/types/classifications";
import type { Piece } from "@/app/types/piece";
import { FavoriteHeartButton } from "@/app/Favorites/FavoriteHeartButton";

export function ListingCard({ listing }: { listing: Piece }) {
  return (
    <button className="flex flex-col ...">
      <div className="w-full h-50 ...">
        <div>{Condition[listing.condition]}</div>
        <div>{listing.getFormattedPrice()}$</div>

        <FavoriteHeartButton listingId={listing.id} />
      </div>

      <p>{listing.name}</p>
      <p>Size: {Size[listing.size]}</p>
      <p>Condition: {Condition[listing.condition]}</p>
      <p>Category: {Category[listing.category]}</p>
    </button>
  );
}
