"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet"; 
import "leaflet/dist/leaflet.css";

// React-Leaflet components (client-side only)
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});

type LocationRecord = {
  id: string;
  name: string;
  description?: string;
  coords: [number, number]; // [latitude, longitude]
  address?: string;
  services?: string[];
  hours?: string;
  thumbnailUrl?: string;
  href?: string;
};

// Dummy location for testing
const DUMMY_LOCATION: LocationRecord[] = [
  {
    id: "loc-1",
    name: "Bazar del Carmen Thrift Shop",
    description: "Your local favorite thrift shop.",
    coords: [18.20708744486451, -67.14946878538534], // 18.20708744486451, -67.14946878538534
    address: "246 C. Méndez Vigo, Mayagüez, 00682",
    services: ["Clothes, Shoes, Hats"],
    hours: "Mon-Fri 7am–11pm",
    thumbnailUrl:
      "https://cdn.dribbble.com/userupload/2919739/file/original-f80d0820a6dc79dc861192da6e40b348.png?resize=1600x1200&vertical=center", // This is a dummy link
    href: "#", // For additional info. If place has a web page it could be added here.
  },
];

// Fix Leaflet default marker icons (Next/Webpack)
function useFixDefaultMarkerIcons() {
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      // @ts-ignore patch runtime option (DO NOT DELTE)
      delete L.Icon.Default.prototype._getIconUrl;

      const iconRetina = (await import("leaflet/dist/images/marker-icon-2x.png")).default;
      const icon = (await import("leaflet/dist/images/marker-icon.png")).default;
      const shadow = (await import("leaflet/dist/images/marker-shadow.png")).default;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetina,
        iconUrl: icon,
        shadowUrl: shadow,
      });
    })();
  }, []);
}

// Close popups on map background click
function OutsideClickCloser({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: () => onClose(),
  });
  return null;
}

export default function MapWithPopups({
  locations = DUMMY_LOCATION,
  initialCenter = DUMMY_LOCATION[0]?.coords ?? [18.2012, -67.1397],
  initialZoom = 14,
}: {
  locations?: LocationRecord[];
  initialCenter?: [number, number];
  initialZoom?: number;
}) {
  useFixDefaultMarkerIcons();

  const [openId, setOpenId] = useState<string | null>(null);

  // Close popup on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full h-[70vh] rounded-2xl overflow-hidden border">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
        closePopupOnClick
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Close on background click */}
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
              eventHandlers={{
                click: () => setOpenId(loc.id),
              }}
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
                      <div
                        aria-hidden="true"
                        className="w-full max-w-[220px] h-[90px] bg-gray-200 rounded-md mb-2 grid place-items-center text-xs"
                      >
                        No image
                      </div>
                    )}

                    <p className="text-sm mb-1">
                      {loc.description || "No description provided."}
                    </p>

                    <div className="text-xs leading-snug mb-2">
                      {loc.address ? (
                        <div>
                          <strong>Address:</strong> {loc.address}
                        </div>
                      ) : (
                        <div>
                          <strong>Coordinates:</strong> {lat.toFixed(5)}, {lng.toFixed(5)}
                        </div>
                      )}
                      {loc.services?.length ? (
                        <div>
                          <strong>Services:</strong> {loc.services.join(", ")}
                        </div>
                      ) : null}
                      {loc.hours ? (
                        <div>
                          <strong>Hours:</strong> {loc.hours}
                        </div>
                      ) : null}
                    </div>

                    {loc.href && (
                      <a
                        href={loc.href}
                        className="inline-block text-xs underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
                      >
                        View more
                      </a>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
