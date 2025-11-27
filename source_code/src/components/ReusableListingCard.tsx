"use client";

import React from "react";
import { Category, Condition, Size } from "@/app/types/classifications";
import type { Piece } from "@/app/types/piece";
import { FavoriteHeartButton } from "@/app/Favorites/FavoriteHeartButton"; // if you split it, else inline below


/*This Reusable Listing Component was created during the data integration for the Favorites page.
The intent was to have a reusable ui component for the listings that could be called from anywhere.*/

type ListingCardProps = {
  listing: Piece;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="flex flex-col text-left indent-4 w-78 h-94 hover:bg-[#F9F8F8] border-2 border-[#E5E7EF] m-auto rounded-3xl">
      {/* Top section with condition, price and heart in top-right */}
      <div className="relative w-full h-50 bg-[#aac7c0] p-3 rounded-3xl">
        <div className="flex space-x-2">
          <div className="px-3 h-6 bg-[#f6e5e6] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl flex items-center">
            {Condition[listing.condition]}
          </div>
          <div className="px-3 h-6 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl flex items-center">
            {listing.getFormattedPrice()}$
          </div>
        </div>

        {/* ♥ top-right */}
        <div className="absolute top-3 right-3">
          <FavoriteHeartButton listingId={listing.id} />
        </div>
      </div>

      {/* Text section */}
      <p className="text-lg font-bold italic pt-2">{listing.name}</p>
      <p className="text-md text-[#666666]">Size: {Size[listing.size]}</p>
      <p className="text-md text-[#666666]">
        Condition: {Condition[listing.condition]}
      </p>
      <p className="text-md text-[#666666]">
        Category: {Category[listing.category]}
      </p>
    </article>
  );
}
