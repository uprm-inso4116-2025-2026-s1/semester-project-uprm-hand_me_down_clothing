'use client';
import { Store } from '@/app/map/marker';
import type { LocationRecord } from '../../map/data-cards';

export type FilterRecord = {
    name: string;
}

type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

function getCurrentTime() {
    const now = new Date();

    const hour = now.getHours();
    const minutes = now.getMinutes();

    const result = hour + (minutes / 100);

    return result;
}

function toDecimalTime(time: string) {
    // time in form of HH:MM

    if (time.at(0) === '0') {
        time = time.substring(1);
    }

    const hour_minutes: number[] = time.split(':').map((s) => Number(s));
    const hour = hour_minutes[0];
    const minutes = hour_minutes[1];

    const result = hour + (minutes / 100);

    return result;
}

export function openNow(locations: LocationRecord[]) {
    const now = new Date();

    // current local day as a string 
    let curDay = now.toLocaleDateString(undefined, { weekday: "long" }).toLowerCase();

    // current local time in 24h format 
    const curTime = getCurrentTime();

    // console.log(curDay + ' -- ' + curTime);

    let filteredLocations: LocationRecord[] = locations.filter( (location) => {

        const openTime = toDecimalTime(location.store_hours?.[curDay as Day]?.open || "");
        const closeTime = toDecimalTime(location.store_hours?.[curDay as Day]?.close || "");

        // console.log(openTime + ' -- ' + closeTime);

        return (openTime < curTime && closeTime > curTime);

    });

    return filteredLocations;
}

// haversine formula to get the distance between two points on a sphere
// result will be in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // radius to the sphere of interest (Earth)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function nearMe(locations: LocationRecord[], userLocation: [number, number]) {
    const filteredLocations: LocationRecord[] = locations.filter((location) => {
        const distance = getDistance(userLocation[0], userLocation[1], location.latitude || 0, location.longitude || 0);
        return distance <= 8;
    });

    return filteredLocations;
}