'use client';

import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';

type LatLng = [number, number];

export default function RouteMini() {
  const map = useMap() as LeafletMap;

  const [useMyLocation, setUseMyLocation] = useState(true);
  const [A, setA] = useState<LatLng | null>(null);
  const [B, setB] = useState<LatLng | null>(null);
  const [picking, setPicking] = useState<'A' | 'B' | null>(null);
  const [etaMin, setEtaMin] = useState<number | null>(null);
  const [distKm, setDistKm] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const routingRef = useRef<L.Routing.Control | null>(null);

  // Global marker interception (no edits in data-cards needed)
  useEffect(() => {
    if (!map) return;

    const handleMarkerClick = (e: any) => {
      if (!picking) return;

      // Stop popup and default behavior
      e.originalEvent?.stopImmediatePropagation?.();
      e.originalEvent?.preventDefault?.();

      const layer = e.target;
      if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();
        if (picking === 'A') {
          setA([lat, lng]);
          setUseMyLocation(false);
        } else {
          setB([lat, lng]);
        }
        setPicking(null);
      }
    };

    const handlePopupOpen = (e: any) => {
      // Close popup immediately if in picking mode
      if (picking) e.popup._close?.();
    };

    // Attach to existing and future markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) layer.on('click', handleMarkerClick, true);
    });
    map.on('layeradd', (e: any) => {
      if (e.layer instanceof L.Marker) e.layer.on('click', handleMarkerClick, true);
    });

    map.on('popupopen', handlePopupOpen);

    return () => {
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) layer.off('click', handleMarkerClick, true);
      });
      map.off('layeradd');
      map.off('popupopen', handlePopupOpen);
    };
  }, [map, picking]);

  // Click map to set A or B
  useEffect(() => {
    if (!map) return;
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!picking) return;
      const ll: LatLng = [e.latlng.lat, e.latlng.lng];
      if (picking === 'A') {
        setA(ll);
        setUseMyLocation(false);
      } else {
        setB(ll);
      }
      setPicking(null);
    };
    map.on('click', handleMapClick);
    return () => {
        map.off('click', handleMapClick); // Ensure nothing is returned
    }
  }, [map, picking]);

  // Use device location for A
  useEffect(() => {
    if (!useMyLocation) return;
    if (!navigator.geolocation) {
      setErr('Geolocation not supported.');
      return;
    }

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setA([pos.coords.latitude, pos.coords.longitude]);
        setErr(null);
      },
      (e) => {
        if (cancelled) return;
        setErr(`Couldn't get your location (${e.message}).`);
        setUseMyLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => { cancelled = true; };
  }, [useMyLocation]);

  // Build / refresh route
  useEffect(() => {
    (async () => {
      if (!A || !B) { setEtaMin(null); setDistKm(null); }

      await import('leaflet-routing-machine');

      if (routingRef.current) {
        try { map.removeControl(routingRef.current); } catch {}
        routingRef.current = null;
      }

      if (!A || !B) return;

      const plan = L.Routing.plan(
        [L.latLng(A[0], A[1]), L.latLng(B[0], B[1])],
        { draggableWaypoints: true, addWaypoints: false }
      );

      const control = L.Routing.control({
        plan,
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
        routeWhileDragging: true,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: {
          extendToWaypoints: true,
          missingRouteTolerance: 0,
          styles: [{ weight: 6, opacity: 0.9 }],
        },
      })
        .on('routesfound', (e: any) => {
          const r = e.routes?.[0];
          if (!r) return;
          setEtaMin(Math.round(r.summary.totalTime / 60));
          setDistKm(r.summary.totalDistance / 1000);
          setErr(null);
        })
        .on('routingerror', (e: any) => {
          console.error('Routing error:', e?.error || e);
          setErr('Routing error. Try different points or check your connection.');
          setEtaMin(null); setDistKm(null);
        })
        .addTo(map);

      routingRef.current = control;
    })();

    return () => {
      try { routingRef.current && map.removeControl(routingRef.current); } catch {}
      routingRef.current = null;
    };
  }, [map, A, B]);

  const swap = () => { setA(B ?? null); setB(A ?? null); setUseMyLocation(false); };
  const fmt = (n: number, d = 2) => Number.isFinite(n) ? n.toFixed(d) : '';

  return (
    <div className="absolute left-3 bottom-3 z-[1100] w-[300px] rounded-xl shadow bg-white/95 backdrop-blur p-3 space-y-2 text-sm">
      <div className="font-semibold">Route</div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={useMyLocation} onChange={(e) => setUseMyLocation(e.target.checked)} />
        Use my location as A
      </label>

      <div className="flex gap-2">
        <button className="px-2 py-1 rounded border" onClick={() => setPicking('A')} disabled={useMyLocation}>Pick A</button>
        <button className="px-2 py-1 rounded border" onClick={() => setPicking('B')}>Pick B</button>
        <button className="px-2 py-1 rounded border" onClick={swap}>Swap</button>
      </div>

      <div className="text-xs text-gray-600">
        {A ? <>A: {A[0].toFixed(4)}, {A[1].toFixed(4)}</> : 'A: not set'}
        <br />
        {B ? <>B: {B[0].toFixed(4)}, {B[1].toFixed(4)}</> : 'B: not set'}
      </div>

      {etaMin !== null && distKm !== null && (
        <div className="rounded bg-gray-100 px-2 py-1">
          <div><strong>ETA:</strong> ~{etaMin} min</div>
          <div><strong>Distance:</strong> {fmt(distKm)} km</div>
          <div className="text-xs text-gray-600">Average time (no live traffic).</div>
        </div>
      )}

      {picking && (
        <div className="text-xs text-blue-700">
          Click a marker or the map to set <strong>{picking}</strong>.
        </div>
      )}
      {err && <div className="text-xs text-red-600">{err}</div>}
    </div>
  );
}

