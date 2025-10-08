"use client";
import dynamic from "next/dynamic";

// Dynamically import the map component
const MapWithPopups = dynamic(() => import("./MapInfoCardsDemo"), { ssr: false });

export default function MapPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Map - Pin Click Popups</h1>
      <MapWithPopups />
    </main>
  );
}