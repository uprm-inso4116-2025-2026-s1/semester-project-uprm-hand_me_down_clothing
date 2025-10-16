'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";


// Dynamically import React-Leaflet components
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false });
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, { ssr: false });

// Export the type definition for a location
export type LocationRecord = {
  id: string;
  name: string;
  description?: string;
  coords: [number, number];
  address?: string;
  services?: string[];
  hours?: string;
  thumbnailUrl?: string;
  href?: string;
};

// Export the dummy location data
export const DUMMY_LOCATION: LocationRecord[] = [
  {
    id: "loc-1",
    name: "Bazar del Carmen Thrift Shop",
    description: "Your local favorite thrift shop.",
    coords: [18.207087, -67.149468],
    address: "246 C. Méndez Vigo, Mayagüez, 00682",
    services: ["Clothes, Shoes, Hats"],
    hours: "Mon-Fri 7am-11pm",
    thumbnailUrl: "https://cdn.dribbble.com/userupload/2919739/file/original-f80d0820a6dc79dc861192da6e40b348.png?resize=1600x1200&vertical=center",
    href: "#",
  },
  // You can add more locations here
];

// Custom hook to fix Leaflet's default marker icons in Next.js
function useFixDefaultMarkerIcons() {
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      const customIcon = (await import("./MapMarkerIcon.png")).default;
      const shadowUrl = (await import("leaflet/dist/images/marker-shadow.png")).default;

      L.Icon.Default.mergeOptions({
        iconUrl: customIcon.src,
        iconRetinaUrl: customIcon.src,
        shadowUrl: shadowUrl.src,
      });
    })();
  }, []);
}

// Component to close popups when clicking on the map background
function OutsideClickCloser({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: () => onClose(),
  });
  return null;
}

// This is the main component you will import into page.tsx
export function LocationMarkers({ locations }: { locations: LocationRecord[] }) {
  useFixDefaultMarkerIcons();
  const [openId, setOpenId] = useState<string | null>(null);

  // Effect to close popup on 'Escape' key press
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <OutsideClickCloser onClose={() => setOpenId(null)} />
      {locations.map((loc) => {
        const [lat, lng] = loc.coords || [];
        const valid = Number.isFinite(lat) && Number.isFinite(lng);
        if (!valid) return null;

        const isOpen = openId === loc.id;

        return (
          <Marker
            key={loc.id}
            position={loc.coords}
            eventHandlers={{ click: () => setOpenId(loc.id) }}
          >
            {isOpen && (
              <Popup
                autoPan
                closeButton
                eventHandlers={{
                  remove: () => {
                    if (openId === loc.id) setOpenId(null);
                  },
                }}
              >
                {/* Popup Content */}
                <div role="dialog" aria-labelledby={`h-${loc.id}`}>
                  <h3 id={`h-${loc.id}`} className="font-semibold text-base mb-1">
                    {loc.name || "Untitled Location"}
                  </h3>

                  {loc.thumbnailUrl ? (
                    <img
                      src={loc.thumbnailUrl}
                      alt={loc.name ? `${loc.name} thumbnail` : "Location image"}
                      className="w-full max-w-[220px] rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full max-w-[220px] h-[90px] bg-gray-200 rounded-md mb-2 grid place-items-center text-xs">
                      No image
                    </div>
                  )}

                  <p className="text-sm mb-1">{loc.description || "No description provided."}</p>

                  <div className="text-xs leading-snug mb-2">
                    {loc.address && <div><strong>Address:</strong> {loc.address}</div>}
                    {loc.services?.length && <div><strong>Services:</strong> {loc.services.join(", ")}</div>}
                    {loc.hours && <div><strong>Hours:</strong> {loc.hours}</div>}
                  </div>

                  {loc.href && (
                    <a href={loc.href} className="inline-block text-xs underline">
                      View more
                    </a>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}