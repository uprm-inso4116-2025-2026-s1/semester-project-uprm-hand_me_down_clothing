'use client'
import React from "react";
import {Piece} from "../types/piece";
import { Category, Condition, Size } from "@/app/types/classifications";


type ResultsPanelProps = {
  items: Piece[];
  className?: string;
};
export default function ResultPanel({items, className}: ResultsPanelProps){
    if (items.length <= 0) {
        return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="flex flex-col items-center justify-center bg-[#F9F8F8] rounded-3xl border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
          <p className="text-2xl font-semibold italic text-[#666666]">
            No items found 😔
          </p>
          <p className="text-md text-[#9A9A9A] mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      </div>
    );
  }
  return(
    <div className={className ?? ""}>
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {items.map((piece) => (
          <div
            key={piece.id}
            className="flex flex-col text-left indent-4 w-78 h-94 hover:bg-[#F9F8F8] border-2 border-[#E5E7EF] m-auto rounded-3xl"
          >
            <button
              id="Featured_Item_btn"
              className="flex flex-col text-left w-full h-full rounded-3xl"
            >
              <div className="w-full h-50 text-center indent-0 bg-[#aac7c0] p-3 flex space-x-2 rounded-3xl">
                <div className="w-18 h-6 bg-[#f6e5e6] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl flex items-center justify-center">
                  {Condition[piece.condition]}
                </div>
                <div className="w-18 h-6 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl flex items-center justify-center">
                  {piece.getFormattedPrice()}
                </div>
                <div className="w-8 h-8 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-xl text-[#f495ba] ml-23 rounded-full flex items-center justify-center">
                  ♥
                </div>
              </div>
              <p className="text-lg font-bold italic pt-2">{piece.name}</p>
              <p className="text-md text-[#666666]">
                Size: {Size[piece.size]}
              </p>
              <p className="text-md text-[#666666]">
                Condition: {Condition[piece.condition]}
              </p>
              <p className="text-md text-[#666666]">
                Category: {Category[piece.category]}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
