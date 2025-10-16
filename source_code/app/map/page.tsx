'use client'

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from "leaflet";
import { LocationMarkers, DUMMY_LOCATION } from "./data-cards";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const MapMarkerComponent = dynamic(
  () => import("./marker").then((mod) => mod.default),
  { ssr: false }
);
import { useMap } from "react-leaflet";

function CustomControl() {
  const map: LeafletMap = useMap();

  useEffect(() => {
    import("leaflet").then(L => {
      if (document.querySelector(".custom-map-control")) return;

      const CustomControlClass = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create("div", "custom-map-control");

          const button = L.DomUtil.create("button", "custom-map-btn", container);
          button.innerHTML = "🗺️";
          button.title = "Map Info";

          const menu = L.DomUtil.create("div", "custom-map-menu", container);
          menu.innerHTML = `
            <ul style="list-style:none; padding:0; margin:0;">
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          `;

          // Initial hidden style
          menu.style.transform = "scaleY(0)";
          menu.style.transformOrigin = "top";
          menu.style.opacity = "0";
          menu.style.transition = "transform 0.3s ease, opacity 0.3s ease";
          menu.style.background = "rgba(255, 182, 193, 0.9)";
          menu.style.border = "1px solid rgba(255, 182, 193, 0.7)";
          menu.style.borderRadius = "8px";
          menu.style.minWidth = "140px";
          menu.style.boxShadow = "0 4px 12px rgba(255, 182, 193, 0.4)";
          menu.style.padding = "0";
          menu.style.overflow = "hidden";

          // Style list items
          const liElements = menu.querySelectorAll("li");
          liElements.forEach((li) => {
            li.style.padding = "8px";
            li.style.cursor = "pointer";
            li.style.transition = "background 0.2s, color 0.2s";
            li.onmouseenter = () => {
              li.style.background = "rgba(255, 182, 193, 0.6)";
              li.style.color = "#fff";
            };
            li.onmouseleave = () => {
              li.style.background = "transparent";
              li.style.color = "#000";
            };
            li.onclick = () => alert(`${li.textContent} clicked!`);
          });

          // Show dropdown
          button.onclick = (e) => {
            e.stopPropagation();
            button.style.display = "none";
            menu.style.transform = "scaleY(1)";
            menu.style.opacity = "1";
          };

          // Hide dropdown
          map.on("click", () => {
            menu.style.transform = "scaleY(0)";
            menu.style.opacity = "0";
            setTimeout(() => {
              button.style.display = "block";
            }, 300);
          });

          return container;
        },
      });

      new CustomControlClass({ position: "topright" }).addTo(map);
    });
  }, [map]);

  return null;
}

export default function Map() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header placeholder space */}
      <div style={{ height: "150px" }}></div>

      <style>{`
        .leaflet-left .leaflet-control-zoom {
          top: 50% !important;
          transform: translateY(400%);
          left: 10px !important;
        }

        .leaflet-control-zoom {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          font-weight: bold;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
          width: 36px;
          height: 36px;
          line-height: 36px;
          text-align: center;
        }

        .leaflet-control-zoom-in { color: #ffb6c1 !important; }
        .leaflet-control-zoom-in:hover { color: #ff87a2 !important; }
        .leaflet-control-zoom-out { color: #ffb6c1 !important; }
        .leaflet-control-zoom-out:hover { color: #ff87a2 !important; }

        .custom-map-btn {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          color: #ffb6c1;
          font-size: 18px;
          font-weight: bold;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .custom-map-btn:hover {
          color: #ff87a2;
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* Map container */}
      <MapContainer
        center={[18.2010, -67.1390]}
        zoom={13}
        style={{ height: "700px", width: "100%" }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others'
        />
        <CustomControl />
        <LocationMarkers locations={DUMMY_LOCATION} />
        <MapMarkerComponent />
      </MapContainer>
    </div>
  );
}
