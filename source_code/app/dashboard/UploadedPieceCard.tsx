"use client";

import { useState } from "react";

type PlainPiece = {
  id: number | string;
  name: string;
  price: number | null | undefined;
};

export default function UploadedPieceCard({ piece }: { piece: PlainPiece }) {
  const [isActive, setIsActive] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null; // frontend-only delete

  // Safe price formatting
  const formattedPrice = `$${Number(piece.price ?? 0).toFixed(2)}`;

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isActive ? "hover:shadow-lg" : "opacity-70"
      }`}
    >
      {/* Top block */}
      <div
        className={`h-64 w-full ${
          isActive ? "bg-[#abc8c1]" : "bg-[#1f2933]"
        }`}
      />

      {/* Bottom */}
      <div className="p-5 flex flex-col justify-between h-40">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h5
            className={`text-lg font-semibold truncate ${
              isActive ? "text-black" : "text-[#e5e7eb]"
            }`}
          >
            {piece.name}
          </h5>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isActive
                ? "bg-[#abc8c1]/30 text-[#2b2b2b]"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isActive ? "On sale" : "Inactive"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-xl font-bold ${
              isActive ? "text-black" : "text-[#f9fafb]"
            }`}
          >
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 pt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full 
            border border-[#abc8c1] text-[#2b2b2b]
            bg-[#abc8c1]/20 
            hover:bg-[#abc8c1]/40 
            transition"

        >
          {isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          type="button"
          onClick={() => setIsDeleted(true)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
