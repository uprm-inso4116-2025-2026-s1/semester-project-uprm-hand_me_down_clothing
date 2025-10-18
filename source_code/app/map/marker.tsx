"use client";
import React from "react";
import * as L from 'leaflet';
import { Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import iconPng from './MapMarkerIcon.png';
//import stores file with logic 


//Future implementaion, 
//If we want to distinguish Stores and Bins markers displayed, create a type that can be either Store or Bin. 
//When creating the marker, check the type and assign the appropriate icon/information based of the current type.
// type Location = Store | Bin; or something along those lines

/////////////////////////////////////////////////////////////////////
//Dummy Data used for testing in this section.
export class Store{
    //ID generated is faulty, will 100% avoid duplicates once supabase is integrated.
    id: number= Math.floor(Math.random() * 10000);
    constructor(public name: string, public address: string, public latitude: number, public longitude: number){
        this.name=name;
        this.address=address;  
        this.latitude=latitude;
        this.longitude=longitude;    
    }
    getPosition(): [number, number] {
        return [this.latitude, this.longitude];
    }
    getId(): number { return this.id; }
}

//Array of dummy data to populate the map with markers
// const storeArray: Store[]=[
//     new Store("Store 1", "Address 1", 18.2010, -67.1390), // JTorres: "These dummy pins can be removed. I will start implementing the responsive pins
//     new Store("Store 2", "Address 2", 18.2100, -67.1300), // with the data cards.""
// ]
/////////////////////////////////////////////////////////////////////

//Class to represent each marker on the map
export class MapMarker {
    icon: L.Icon= L.icon({
        iconUrl: iconPng.src,
        iconSize: [25, 41], 
        iconAnchor: [12, 41],// Optional custom icon
    });

    constructor(public store: Store){ 
        this.store=store;
    }  
    getId(): number { return this.store.getId(); }
    getPosition(): [number, number] { return this.store.getPosition(); }   
    getIcon(): L.Icon { return this.icon; }   
}

//Colletion class to manage the markers collection
export class MapMarkers{
    private markers = new Map<number, MapMarker>();
    constructor(){} 

    addMarker(marker: MapMarker): void {
        this.markers.set(marker.getId(), marker);
    }
    removeMarker(id: number): void {
        this.markers.delete(id);    
    };
    getMarkers(): Map<number, MapMarker> {
        return this.markers;    
    }
    getMarker(id: number): MapMarker | undefined {
        return this.markers.get(id);
    }
}
//Creates a singleton of the map markers collection
export const markersCollection= new MapMarkers();

/////////////////////////////////////////////////////////////////////////
//Dummy Data Used for testing in this section.

//Populate the singleton with the dummy data
// storeArray.forEach((store) => {
//     markersCollection.addMarker(new MapMarker(store));
// });
/////////////////////////////////////////////////////////////////////////

//Creates each marker component to be used in the map, returns each component. 
//Function is later used in the map page to display all markers.
export default function MapMarkerComponent(){ 
    //Creates an array with each value (marker of type MapMarker) in markersCollection and iterates through it (.map).
    //Automatically stores the elements variable with each marker COMPONENT created.
    //Uses map function to create an array of the return values.
    const elements = Array.from(markersCollection.getMarkers().values()).map((marker) => (
        //Creates a marker component with its respective information.
        <Marker position= {marker.getPosition()} icon={marker.getIcon()} key={marker.getId()}/>
    ));
    //Returns all the marker components created.
    return <>{elements}</>;
}
