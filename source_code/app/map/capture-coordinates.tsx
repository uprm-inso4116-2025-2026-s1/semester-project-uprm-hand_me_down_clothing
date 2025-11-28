import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Map as LeafletMap, Marker, Icon } from "leaflet";
import mapMarker from "../map/MapMarkerIcon.png";

const MiniMapModal = ({
  isOpen,
  onClose,
  onLocationSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mapInstance: LeafletMap | null = null;

    import("leaflet").then((leaflet) => {
      if (mapContainerRef.current && !mapRef.current) {
        // Custom icon
        const icon = new leaflet.Icon({
          iconUrl: mapMarker.src, // path to your icon
          iconSize: [30, 40],
          iconAnchor: [15, 40],
        });

        // Initialize map
        mapInstance = leaflet.map(mapContainerRef.current, {
          center: [18.201, -67.139],
          zoom: 13,
        });

        leaflet
          .tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          )
          .addTo(mapInstance);

        // Click handler
        mapInstance.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          setSelectedCoords({ lat, lng });

          // Remove previous marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          const newMarker = leaflet.marker([lat, lng], { icon }).addTo(mapInstance!);
          markerRef.current = newMarker;
        });

        mapRef.current = mapInstance;
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      setSelectedCoords(null);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-4 w-[400px] h-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-2">Select a Location</h2>

        {/* Map container */}
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "300px", borderRadius: 12 }}
        ></div>

        {/* Show selected coordinates */}
        {selectedCoords && (
          <p className="mt-2 text-sm text-gray-700">
            Selected: Lat {selectedCoords.lat.toFixed(5)}, Lng {selectedCoords.lng.toFixed(5)}
          </p>
        )}

        <div className="flex space-x-2 mt-3">
          <button
            className="flex-1 py-2 bg-green-500 text-white rounded-lg"
            onClick={() => {
              if (selectedCoords) {
                onLocationSelect(selectedCoords);
              }
              onClose();
            }}
          >
            Confirm
          </button>

          <button
            className="flex-1 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniMapModal;
