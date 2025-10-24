'use client'

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { LocationMarkers, LocationRecord } from "./data-cards";
import type { FilterRecord } from '../utils/filters/mapFilter';
import {supabase} from '../auth/supabaseClient';
import {openNow, nearMe}  from '../utils/filters/mapFilter';
import SearchLocation from "./searchLocation";

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
const Routing = dynamic(
  () => import('./routing'), 
  { ssr: false }
);
import { useMap } from "react-leaflet";

function LocateControlSimple() {
  const map = useMap();

  useEffect(() => {
    let control: any;
    let disposed = false;

    (async () => {
      const mod = await import("leaflet.locatecontrol");
      if (disposed) return;

      const LocateControl =
        (mod as any).LocateControl ?? (mod as any).default?.LocateControl;
      if (!LocateControl) {
        console.error("LocateControl class not found in leaflet.locatecontrol module");
        return;
      }

      control = new LocateControl({
        position: "topleft",
        setView: "always", // Allows continuous follow for better live accuracy 
        flyTo: true,
        showPopup: true,
        drawMarker: true,
        drawCircle: true,
        strings: { title: "Show my location" },
        locateOptions: { enableHighAccuracy: true, maximumAge: 0, timeout: 5_000 },
      }).addTo(map);
    })();

    return () => {
      disposed = true;
      try { control?.remove?.(); } catch {}
    };
  }, [map]);

  return null;
} 

function CustomControl({ 
  locations, 
  markersRef,
  filterFunction
}: { 
  locations: LocationRecord[];
  markersRef: React.MutableRefObject<Map<number, LeafletMarker>>;
  filterFunction: (filterName: string, map: LeafletMap) => void;
}) {
  const map: LeafletMap = useMap();
  
  useEffect(() => {
    let custom: any;

    // Wait until the map is ready so control corners exist
    map.whenReady(() => {
      import("leaflet").then((L) => {
        // Remove existing control if it exists
        const existingControl = document.querySelector(".custom-map-control");
        if (existingControl) existingControl.remove();

      const CustomControlClass = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create("div", "custom-map-control");

          container.style.display = "flex";
          container.style.gap = "8px";
          container.style.flexDirection = "row";
          container.style.position = "relative";
          container.style.right = "10px"; 
          container.style.marginRight = "40px";
          container.style.zIndex = "1000";

          /** LOCATIONS BUTTON **/
          const mapButton = L.DomUtil.create("button", "custom-map-btn", container);
          mapButton.innerHTML = "🗺️";
          mapButton.title = "Locations";

          /** FILTERS BUTTON **/
          const filters: FilterRecord[] = [{'name': 'Open Now'}, {'name': 'Near Me'}, {'name': 'Clear Filters'}];

          const filterButton = L.DomUtil.create("button", "custom-map-btn", container);
          filterButton.innerHTML = "🧩";
          filterButton.title = "Filters";

          /** LOCATIONS MENU **/
          const mapMenu = L.DomUtil.create("div", "custom-map-menu", container);
          const locationsList = locations.length > 0 
            ? locations.map(loc => `
                <li data-location-id="${loc.id}" style="padding: 8px; cursor: pointer; transition: background 0.2s, color 0.2s;">
                  ${loc.name || 'Unnamed Location'}
                </li>
              `).join('')
            : '<li style="padding: 8px; color: #666;">No locations available</li>';
          
          mapMenu.innerHTML = `
            <ul style="list-style:none; padding:0; margin:0; max-height: 300px; overflow-y: auto;">
              ${locationsList}
            </ul>
          `;

          /** FILTERS MENU **/
          const filterMenu = L.DomUtil.create("div", "custom-map-menu", container);
          const filtersList = filters.length > 0
            ? filters.map(f => `
                <li data-filter-name="${f.name}" style="padding: 8px; cursor: pointer; transition: background 0.2s, color 0.2s;">
                  ${f.name}
                </li>
              `).join('')
            : '<li style="padding: 8px; color: #666;">No filters available</li>';

          filterMenu.innerHTML = `
            <ul style="list-style:none; padding:0; margin:0; max-height: 200px; overflow-y: auto;">
              ${filtersList}
            </ul>
          `;

          /** Shared dropdown styling **/
          [mapMenu, filterMenu].forEach(menu => {
            menu.style.transform = "scaleY(0)";
            menu.style.transformOrigin = "top";
            menu.style.opacity = "0";
            menu.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            menu.style.background = "rgba(255, 182, 193, 0.9)";
            menu.style.border = "1px solid rgba(255, 182, 193, 0.7)";
            menu.style.borderRadius = "8px";
            menu.style.minWidth = "200px";
            menu.style.boxShadow = "0 4px 12px rgba(255, 182, 193, 0.4)";
            menu.style.padding = "0";
            menu.style.overflow = "hidden";
            menu.style.position = "absolute";
            menu.style.top = "45px";
            menu.style.zIndex = "999";
          });

          /** Offset filter menu slightly left so both menus fit */
          filterMenu.style.right = "0px";
          mapMenu.style.right = "50px";

          /** Hover effects **/
          const applyHoverEffect = (menu: HTMLElement) => {
            const liElements = menu.querySelectorAll("li");
            liElements.forEach(li => {
              const htmlLi = li as HTMLElement;
              htmlLi.onmouseenter = () => {
                htmlLi.style.background = "rgba(255, 182, 193, 0.6)";
                htmlLi.style.color = "#fff";
              };
              htmlLi.onmouseleave = () => {
                htmlLi.style.background = "transparent";
                htmlLi.style.color = "#000";
              };
            });
          };
          applyHoverEffect(mapMenu);
          applyHoverEffect(filterMenu);

          /** Location click **/
          const locElements = mapMenu.querySelectorAll("li[data-location-id]");
          locElements.forEach(li => {
            const htmlLi = li as HTMLElement;
            htmlLi.onclick = () => {
              const locationId = parseInt(htmlLi.getAttribute("data-location-id") || "0");
              const location = locations.find(loc => loc.id === locationId);
              
              if (location && location.latitude && location.longitude) {
                map.setView([location.latitude, location.longitude], 16, {
                  animate: true,
                  duration: 1
                });
                setTimeout(() => {
                  const marker = markersRef.current.get(locationId);
                  if (marker) marker.openPopup();
                }, 500);

                hideMenus();
              }
            };
          });

          /** Filter click **/
          const filterElements = filterMenu.querySelectorAll("li[data-filter-name]");
          filterElements.forEach(li => {
            const htmlLi = li as HTMLElement;
            htmlLi.onclick = () => {
              const filterName = htmlLi.getAttribute("data-filter-name") || "";
              filterFunction(filterName, map);
              // console.log("Applying filter:", filterName);
              hideMenus();
            };
          });

          /** Menu helpers **/
          const toggleMenu = (menu: HTMLElement) => {
            const isVisible = menu.style.transform === "scaleY(1)";
            hideMenus();
            if (!isVisible) {
              menu.style.transform = "scaleY(1)";
              menu.style.opacity = "1";
            }
          };

          const hideMenus = () => {
            [mapMenu, filterMenu].forEach(menu => {
              menu.style.transform = "scaleY(0)";
              menu.style.opacity = "0";
            });
          };

          /** Button actions **/
          mapButton.onclick = (e) => {
            e.stopPropagation();
            toggleMenu(mapMenu);
          };
          filterButton.onclick = (e) => {
            e.stopPropagation();
            toggleMenu(filterMenu);
          };

          /** Hide all when clicking on the map **/
          map.on("click", hideMenus);

          return container;
        },
      });

      new CustomControlClass({ position: "topright" }).addTo(map);
      });
    });
  }, [map, locations, markersRef]);

  return null;
}


export default function Map() {
  const [locations, setLocations] = React.useState<LocationRecord[]>([]);
  const markersRef = useRef<globalThis.Map<number, LeafletMarker>>(new globalThis.Map());
  const [openNowFilter, setOpenNowFilter] = useState(false);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleFilter = (filterName: string, map: LeafletMap) => {
    switch (filterName) {
      case "Open Now":
        setLocations(openNow(locations));
        setOpenNowFilter(true);
        break;
      case "Near Me":
        if (userLocation) {
          setLocations(nearMe(locations, userLocation));
        } else {
          map.once('locationfound', (e: any) => {
            const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
            setUserLocation(coords);
            setLocations(nearMe(locations, coords));
          });
          map.locate({ setView: true, maxZoom: 13 });
        }
        break;
      case "Clear Filters":
        setLocations([]);
        setOpenNowFilter(false);
        break;
    }
  };
  
  useEffect(() => {
    if (locations.length > 0 || openNowFilter) return; // Only run when locations is empty or open now filter was ran and no locations were open
    (async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, latitude, longitude, address, contact_info, store_hours');
      if (error) {
        console.error("Error fetching locations:", error);
      } else if (data) {
        // Cast each item to LocationRecord
        const castedLocations: LocationRecord[] = data.map(item => ({
          id: item.id,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.address,
          contact_info: item.contact_info,
          store_hours: item.store_hours
        }));
        setLocations(castedLocations);
      }
    })();
  }, [locations]);
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

        .leaflet-control-locate {
          margin-top: +120px !important;
          margin-left: +20px !important;
        }
      `}</style>
      <div className= "relative w-full" style= {{height:700}}>
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
          <LocateControlSimple />
          <CustomControl locations={locations} markersRef={markersRef} filterFunction={handleFilter}/>
          <LocationMarkers locations={locations} markersRef={markersRef} />
          <MapMarkerComponent />
          <Routing />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
            <SearchLocation 
              locations={locations} 
              markersRef={markersRef} 
            />
        </div>
        </MapContainer>
      </div>
    </div>
  );
}
