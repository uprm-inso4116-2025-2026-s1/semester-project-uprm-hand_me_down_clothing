'use client'

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Marker as LeafletMarker } from "leaflet";
import SuperclusterLayer, { ClusterPoint } from "./cluster-layer";
import { Location } from "../types/location";


// Dynamically import React-Leaflet components
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false });
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, { ssr: false });

// Export the type definition for a location
// export type LocationRecord = {
//   id: number;
//   name?: string;
//   description?: string;
//   latitude?: number;
//   longitude?: number;
//   thumbnailUrl?: string;
//   address?: string;
//   contact_info?: string;
//   store_hours?: store_hours;
// };

// export type store_hours = {
//   monday?: {open: string; close: string};
//   tuesday?: {open: string; close: string};
//   wednesday?: {open: string; close: string};
//   thursday?: {open: string; close: string};
//   friday?: {open: string; close: string};
//   saturday?: {open: string; close: string};
//   sunday?: {open: string; close: string};
// };

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
function MapClickHandler({ markersRef }: { markersRef: React.MutableRefObject<Map<number, LeafletMarker>> }) {
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
export function LocationMarkers({ 
  locations, 
  markersRef 
}: { 
  locations: Location[];
  markersRef?: React.MutableRefObject<Map<number, LeafletMarker>>;
}) {
  useFixDefaultMarkerIcons();
  const internalMarkersRef = useRef<Map<number, LeafletMarker>>(new Map());
  const activeMarkersRef = markersRef || internalMarkersRef;

  // Effect to close popup on 'Escape' key press
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        activeMarkersRef.current.forEach((marker) => {
          marker.closePopup();
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Convert to ClusterPoint[]
  const points: ClusterPoint<Location>[] = useMemo(
    () =>
      locations
        .filter((loc) => Number.isFinite(loc.getLatitude()) && Number.isFinite(loc.getLongitude()))
        .map((loc) => ({
          id: loc.getID(),
          lat: loc.getLatitude() as number,
          lng: loc.getLongitude() as number,
          data: loc,
        })),
    [locations]
  );

  return (
    <>
      <MapClickHandler markersRef={activeMarkersRef} />
      <SuperclusterLayer<Location>
        points={points}
        radius={60}
        maxZoom={18}
        renderPoint={(p) => {
          const loc = p.data!;

        return (
          <Marker
            key={loc.getID()}
            position={[p.lat, p.lng]}
            ref={(ref) => {
              if (ref) {
                // @ts-ignore - ref is a React-Leaflet wrapper, need to access the Leaflet marker
                activeMarkersRef.current.set(loc.getID(), ref);
              }
            }}
            eventHandlers={{
              click: (e) => {
                // @ts-ignore - Leaflet event has originalEvent
                e.originalEvent?.stopPropagation();
                // Close other popups first
                activeMarkersRef.current.forEach((marker, id) => {
                  if (id !== loc.getID()) {
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
                <div role="dialog" aria-labelledby={`h-${loc.getID()}`}>
                  <h3 id={`h-${loc.getID()}`} className="font-semibold text-base mb-1">
                    {loc.getName() || "Untitled Location"}
                  </h3>

                  {loc.getThumbnailUrl() ? (
                    <img
                      src={loc.getThumbnailUrl()}
                      alt={loc.getName() ? `${loc.getName()} thumbnail` : "Location image"}
                      className="w-full max-w-[220px] rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full max-w-[220px] h-[90px] bg-gray-200 rounded-md mb-2 grid place-items-center text-xs">
                      No image
                    </div>
                  )}

                  <p className="text-sm mb-1">{loc.getDescription() || "No description provided."}</p>

                  <div className="text-xs leading-snug mb-2">
                    {loc.getAddress() && <div className="mb-2"><strong>Address:</strong> {loc.getAddress()}</div>}
                    {loc.getContactInfo() && <div className="mb-2"><strong>Contact:</strong> {loc.getContactInfo()}</div>}
                    {loc.getStoreHours() && (
                      <div><strong>Hours:</strong>
                        <div className="ml-2 mt-1 space-y-0.5">
                          {Object.entries(loc.getStoreHours()).map(([day, hours]) => 
                            hours && typeof hours === 'object' && 'open' in hours && 'close' in hours && (
                              <div key={day} className="text-xs flex justify-between">
                                <span className="capitalize font-medium">{day}:</span>
                                <span>{hours.open} - {hours.close}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
          </Marker>
        );
      }}
     />
   </>
  );
}