'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { Piece } from "../types/piece";
import { fetchPieces } from "./search";

// Haversine formula used to calculate two points in a sphere distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type DistanceFilterButtonProps = {
  query: string | null;  // current search query
  onNearbyResults?: (pieces: Piece[]) => void;
  onLocationDenied?: () => void;
};

export default function DistanceFilterButton({
  query,
  onNearbyResults,
  onLocationDenied,
}: DistanceFilterButtonProps) {
  const [showDistances, setShowDistances] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const distances = [
    { label: 'No Near Me filter', value: null },
    { label: '4km', value: 4 },
    { label: '8km', value: 8 },
    { label: '16km', value: 16 },
    { label: '24km', value: 24 },
    { label: '32km', value: 32 },
  ];

  const handleDistanceClick = (radiusKm: number | null) => {
  setErrorMsg(null);

  // No Near Me filter will reset to normal search results
  if (radiusKm === null) {
    setIsLoading(true);
    setSelectedDistance(null); // clear the label

    (async () => {
      try {
        const allPieces: Piece[] = await fetchPieces(query);
        if (onNearbyResults) onNearbyResults(allPieces);
      } catch (err) {
        console.error(err);
        setErrorMsg("There was a problem loading items.");
      } finally {
        setIsLoading(false);
        setShowDistances(false);
      }
    })();
    return;
  }

  // Chosen distance will use geolocation & filter
  if (!("geolocation" in navigator)) {
    setErrorMsg("Geolocation is not supported on this device.");
    if (onLocationDenied) onLocationDenied();
    setShowDistances(false);
    return;
  }

  setIsLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Fetch pieces using existing backend logic
        const allPieces: Piece[] = await fetchPieces(query);

        // Filter by distance
        const nearbyPieces = allPieces.filter((piece) => {
          const pieceLat = piece.getLatitude();
          const pieceLng = piece.getLongitude();

          if (pieceLat == null || pieceLng == null) return false;

          const dist = getDistance(
            latitude,
            longitude,
            pieceLat,
            pieceLng
          );

          return dist <= radiusKm;
        });

        if (onNearbyResults) onNearbyResults(nearbyPieces);
        setSelectedDistance(radiusKm);
      } catch (err) {
        console.error(err);
        setErrorMsg("There was a problem fetching nearby items.");
      } finally {
        setIsLoading(false);
        setShowDistances(false);
      }
    },
    (error) => {
      console.error(error);
      setIsLoading(false);
      setShowDistances(false);
      setErrorMsg("Location permission denied or unavailable.");
      if (onLocationDenied) onLocationDenied();
    }
  );
};
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
        Near Me {selectedDistance !== null ? `: ${selectedDistance}km` : ""}
      </button>

      {/* Distance Popup */}
      {showDistances && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowDistances(false)}
          />
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
                  key={d.value ?? 'none'}
                  type="button"
                  onClick={() => handleDistanceClick(d.value)}
                  className="h-11 rounded-full bg-[#e6dac7] text-[#666666] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2]"
                  disabled={isLoading}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
