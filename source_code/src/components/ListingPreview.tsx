"use client"

import React from 'react'
import type { Piece } from '@/app/types/piece'

export type ListingPreviewProps = {
  piece: Piece
}

export default function ListingPreview({ piece }: ListingPreviewProps) {
  const coverImage =
    piece.images && piece.images.length > 0
      ? piece.images[0]
      : 'https://placehold.co/600x400?text=No+photos+yet'

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-md bg-white">
      {/* Cover Image */}
      <img
        src={coverImage}
        alt="Listing cover"
        className="h-48 w-full object-cover"
      />
      
      {/* Card Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-[#2b2b2b]">
            {piece.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {piece.getFormattedCategory()} • {piece.getFormattedCondition()}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium text-gray-900">Size</p>
            <p className="text-gray-600">{piece.getFormattedSize()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">For</p>
            <p className="text-gray-600">{piece.getFormattedGender()}</p>
          </div>
          {piece.price && piece.price > 0 && (
            <div>
              <p className="font-medium text-gray-900">Price</p>
              <p className="text-gray-600">{piece.getFormattedPrice()}</p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="pt-2">
          <span className="inline-flex rounded-full bg-[#abc8c1]/20 text-[#36534b] px-3 py-1 text-xs font-medium">
            Ready to publish
          </span>
        </div>

        {/* Additional Images */}
        {piece.images && piece.images.length > 1 && (
          <div>
            <p className="text-xs font-medium text-gray-900 mb-2">Additional photos ({piece.images.length - 1})</p>
            <div className="flex flex-wrap gap-2">
              {piece.images.slice(1).map((url, index) => (
                <img
                  key={url + index}
                  src={url}
                  alt={`Additional ${index + 1}`}
                  className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
