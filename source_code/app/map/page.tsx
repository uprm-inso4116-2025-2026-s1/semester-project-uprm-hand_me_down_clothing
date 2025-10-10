'use client'
import React from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Map() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Larger placeholder for header space */}
      <div style={{ height: '150px' }}></div>

      {/* Map container */}
      <MapContainer center={[18.2010, -67.1390]} zoom={13} style={{ height: '700px', width: '100%' }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others'
        />
      </MapContainer>
    </div>
  );
}
