'use client'

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker as LeafletMarker } from "leaflet";


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

      const style = document.createElement('style');
      style.textContent = `
        .leaflet-marker-icon {
          cursor: pointer !important;
          /* Add invisible padding/buffer around the marker for easier clicking */
          box-shadow: 0 0 0 15px transparent !important;
          /* Make the entire marker area clickable */
          pointer-events: auto !important;
        }
        /* Create an invisible clickable area around the marker */
        .leaflet-marker-icon::before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          cursor: pointer;
        }
      `;
      if (!document.querySelector('#marker-click-buffer-style')) {
        style.id = 'marker-click-buffer-style';
        document.head.appendChild(style);
      }
    })();
  }, []);
}

// Component to close popups when clicking on the map background
function MapClickHandler({ markersRef }: { markersRef: React.MutableRefObject<Map<string, LeafletMarker>> }) {
  const map = useMapEvents({
    popupopen: () => {
      // When a popup opens, we don't need to do anything special
    },
  });

  useEffect(() => {
    const handleMapClick = (e: any) => {
      // Check if the click target is a marker, popup, or their children
      const target = e.originalEvent?.target as HTMLElement;
      const isMarkerOrPopup = target && (
        target.classList.contains('leaflet-marker-icon') ||
        target.closest('.leaflet-marker-icon') ||
        target.closest('.leaflet-popup')
      );
      
      // Only close popups if we didn't click on a marker or popup
      if (!isMarkerOrPopup) {
        markersRef.current.forEach((marker) => {
          marker.closePopup();
        });
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, markersRef]);

  return null;
}

// This is the main component you will import into page.tsx
export function LocationMarkers({ locations }: { locations: LocationRecord[] }) {
  useFixDefaultMarkerIcons();
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());

  // Effect to close popup on 'Escape' key press
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        markersRef.current.forEach((marker) => {
          marker.closePopup();
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <MapClickHandler markersRef={markersRef} />
      {locations.map((loc) => {
        const [lat, lng] = loc.coords || [];
        const valid = Number.isFinite(lat) && Number.isFinite(lng);
        if (!valid) return null;

        return (
          <Marker
            key={loc.id}
            position={loc.coords}
            ref={(ref) => {
              if (ref) {
                // @ts-ignore - ref is a React-Leaflet wrapper, need to access the Leaflet marker
                markersRef.current.set(loc.id, ref);
              }
            }}
            eventHandlers={{ 
              click: (e) => {
                // @ts-ignore - Leaflet event has originalEvent
                e.originalEvent?.stopPropagation();
                // Close other popups first
                markersRef.current.forEach((marker, id) => {
                  if (id !== loc.id) {
                    marker.closePopup();
                  }
                });
              }
            }}
          >
            <Popup
              autoPan
              closeButton
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
          </Marker>
        );
      })}
    </>
  );
}