'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';
import useSupercluster from 'use-supercluster';

const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });

export type ClusterPoint<T = unknown> = {
  id: number | string;
  lat: number;
  lng: number;
  data?: T; // your original record
};

export type SuperclusterLayerProps<T = unknown> = {
  points: ClusterPoint<T>[];
  renderPoint: (p: ClusterPoint<T>) => React.ReactNode;
  radius?: number;   // pixel radius for clustering (higher = more aggressive clustering)
  maxZoom?: number;  // Max zoom level where clustering still applies
  minZoom?: number;  // Min zoom level
  makeClusterIcon?: (count: number) => any; // returns a Leaflet Icon
};

/**
 * Default blue cluster icon with count
 */
function defaultClusterIcon(count: number) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require('leaflet');
  const size = count < 10 ? 32 : count < 50 ? 38 : 44; 
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      display:grid;place-items:center;
      background:#4F46E5;border:2px solid white;
      color:white;font-weight:600;">
      ${count}
    </div>
  `;
  return L.divIcon({ html, className: 'supercluster-icon', iconSize: [size, size] });
}

// helper to avoid redundant state updates 
// checks if bounds are unchanged
function sameBounds(
  a: [number, number, number, number],
  b: [number, number, number, number]
) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

// Main component that handles marker clustering on the map
export default function SuperclusterLayer<T>({
  points,  // List of points (each has id, lat, lng, and optional data)
  renderPoint,  // Function defines how a single (non-clustered) point should look
  radius = 60,   // How close points must be (in pixels) to form a cluster
  maxZoom = 0,  // Up to which zoom level clusters will appear
  minZoom = 0,   // Minimum zoom level for clustering calculations
  makeClusterIcon = defaultClusterIcon,  // Function that creates the cluster icon (bubble with number)
}: SuperclusterLayerProps<T>) {
  // Access Leaflet map instance from react-leaflet
  const map = useMap();

  // Track map zoom and bounds 
  const [zoom, setZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState<[number, number, number, number]>(() => {
    const b = map.getBounds();
    return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  });
  //refs that coordinate effect behavior without causing renders
  const programmaticMoveRef = useRef(false);
  const listeningRef = useRef(false);
  const afRef = useRef<number | null>(null);
  const prevBoundsRef = useRef(bounds);
  const prevZoomRef = useRef(zoom);

  useEffect(() => {
    if (listeningRef.current) return;
    listeningRef.current = true;

    //Schedule updates with animated frames as to avoid multiple setStates per tick
    const scheduleUpdate = () => {
      if (programmaticMoveRef.current) {
        programmaticMoveRef.current = false;
      }

      if (afRef.current != null) cancelAnimationFrame(afRef.current);
      afRef.current = requestAnimationFrame(() => {
        const b = map.getBounds();
        const nextBounds: [number, number, number, number] = [
          b.getWest(), b.getSouth(), b.getEast(), b.getNorth()
        ];
        const nextZoom = map.getZoom();

        //only commit state when values actually changed
        if (!sameBounds(prevBoundsRef.current, nextBounds)) {
          prevBoundsRef.current = nextBounds;
          setBounds(nextBounds);
        }
        if (prevZoomRef.current !== nextZoom) {
          prevZoomRef.current = nextZoom;
          setZoom(nextZoom);
        }
      });
    };

    map.on('moveend', scheduleUpdate);
    scheduleUpdate();

    return () => {
      //Clean up animation frames
      if (afRef.current != null) cancelAnimationFrame(afRef.current);
      map.off('moveend', scheduleUpdate);
      listeningRef.current = false;
    };
  }, [map]);

  // to GeoJSON for supercluster
  const geoPoints = useMemo(
    () =>
      points.map((p) => ({
        type: 'Feature' as const,
        properties: { cluster: false, pointId: p.id, original: p },
        geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
      })),
    [points]
  );

  // Get clusters for current zoom and area
  const { clusters, supercluster } = useSupercluster({
    points: geoPoints,
    bounds,
    zoom,
    options: { radius, maxZoom, minZoom },
  });

  // Zoom into a cluster when clicked
  const zoomToCluster = (clusterId: number) => {
    const nextZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), maxZoom);
    const clusterData = clusters.find((c: any) => c.properties.cluster && c.properties.cluster_id === clusterId) as any;
    if (clusterData == null) return;
    const [lng, lat] = clusterData.geometry.coordinates;
    programmaticMoveRef.current = true;
    map.setView([lat, lng], nextZoom, { animate: true, duration: 0.8 });
  };

  return (
    <>
      {clusters.map((f: any) => {
        const [lng, lat] = f.geometry.coordinates;
        const props = f.properties;
        if (props.cluster) {
          const count = props.point_count as number;
          return (
            <Marker
              key={`cluster-${props.cluster_id ?? f.id}`}
              position={[lat, lng]}
              // @ts-ignore Leaflet Icon type
              icon={makeClusterIcon(count)}
              eventHandlers={{
                click: (e) => {
                  // @ts-ignore
                  e.originalEvent?.stopPropagation?.();
                  zoomToCluster(props.cluster_id ?? f.id);
                },
              }}
            />
          );
        }
        const original = props.original as ClusterPoint<T>;
        return <React.Fragment key={original.id}>{renderPoint(original)}</React.Fragment>;
      })}
    </>
  );
}
