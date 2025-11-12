'use client';

import React, { useState } from 'react';
import Image from "next/image";

export default function DistanceFilterButton() {
  const [showDistances, setShowDistances] = useState(false);

  const distances = ['4km', '8km', '16km', '24km', '32km'];

  return (
    <>
      {/* Near Me Button */}
      <button
        type="button"
        onClick={() => setShowDistances(true)} 
        className="h-12 px-5 mt-6 ml-2 rounded-full bg-[#e6dac7] text-[#333333] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]"
      >
        <Image
            src="/images/locationIcon.png"
            alt="Location Marker Icon"
            width={18}
            height={18}
            className="inline-block"
        />
        Near Me
      </button>

      {/* Distance Popup */}
      {showDistances && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 bg-white p-6 rounded-2xl shadow-lg w-full max-w-[440px]">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold italic">
                Select desired distance from you:
              </h3>
              <button
                onClick={() => setShowDistances(false)}
                className="rounded-full px-2 py-1 text-[#666666] hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {distances.map((d) => (
                <button
                  key={d}
                  className="h-11 rounded-full bg-[#e6dac7] text-[#666666] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2]"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
