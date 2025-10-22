'use client';
import type { LocationRecord } from '../../map/data-cards';

export type FilterRecord = {
    name: string;
}

export default function openNow(locations: LocationRecord[]) {
    const now = new Date();

    // current local day as a string (e.g. "Monday")
    let curDay = 'monday' // now.toLocaleDateString(undefined, { weekday: "long" });

    // current local time in 24h format (e.g. "14:35")
    const curTime = 12 // now.toLocaleTimeString(undefined, { hour12: false }).split(":").map(val => Number(val)).at(0) || 0;

    let filteredLocations: LocationRecord[] = [];
    locations.forEach( (location) => {

        switch (curDay) {
            case 'monday':
                let openTime = location.store_hours?.monday?.open.split(":").map(val => Number(val)).at(0) || 0;
                let closeTime = location.store_hours?.monday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'tuesday':
                openTime = location.store_hours?.tuesday?.open.split(":").map(val => Number(val)).at(0) || 0;
                closeTime = location.store_hours?.tuesday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'wednesday':
                 openTime = location.store_hours?.wednesday?.open.split(":").map(val => Number(val)).at(0) || 0;
                 closeTime = location.store_hours?.wednesday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'thursday':
                 openTime = location.store_hours?.thursday?.open.split(":").map(val => Number(val)).at(0) || 0;
                 closeTime = location.store_hours?.thursday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'friday':
                 openTime = location.store_hours?.friday?.open.split(":").map(val => Number(val)).at(0) || 0;
                 closeTime = location.store_hours?.friday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'saturday':
                 openTime = location.store_hours?.saturday?.open.split(":").map(val => Number(val)).at(0) || 0;
                 closeTime = location.store_hours?.saturday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            case 'sunday':
                 openTime = location.store_hours?.sunday?.open.split(":").map(val => Number(val)).at(0) || 0;
                 closeTime = location.store_hours?.sunday?.close.split(":").map(val => Number(val)).at(0) || 0;
                if (openTime < curTime && closeTime > curTime) {
                    filteredLocations.push(location);
                } 
                break;
            default:
                break;

        }
    });

    console.log(filteredLocations);
    return filteredLocations;
}