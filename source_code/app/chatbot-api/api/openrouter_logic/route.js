// app/api/chat/route.js
import { NextResponse } from "next/server";
import { LocationRepository } from "@/src/repositories/locationRepository";

// Server-side function to fetch stores directly from Supabase
// This function runs on the server only and never exposes database to the frontend
async function fetchStoresFromDatabase() {
  try {
    const locationRepo = new LocationRepository();
    const locations = await locationRepo.fetchAllLocations();
    
    // Convert Location domain objects to plain data
    const storesData = locations.map(loc => ({
      id: loc.getID(),
      name: loc.getName(),
      address: loc.getAddress(),
      latitude: loc.getLatitude(),
      longitude: loc.getLongitude(),
      description: loc.getDescription(),
      contact_info: loc.getContactInfo(),
      store_hours: loc.getStoreHours(),
      thumbnailUrl: loc.getThumbnailUrl(),
    }));
    
    return storesData;
  } catch (error) {
    console.error("Error fetching stores from Supabase:", error);
    return [];
  }
}

// Helper function to format store data for AI context
function formatStoreDataForAI(stores) {
  if (!stores || stores.length === 0) {
    return "No store information available.";
  }

  return stores.map((store, index) => {
    let storeInfo = `\n${index + 1}. ${store.name || 'Unnamed Store'}`;
    
    if (store.address) {
      storeInfo += `\n   Address: ${store.address}`;
    }
    
    if (store.description) {
      storeInfo += `\n   Description: ${store.description}`;
    }
    
    if (store.contact_info) {
      storeInfo += `\n   Contact: ${store.contact_info}`;
    }
    
    if (store.store_hours) {
      storeInfo += `\n   Store Hours:`;
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      days.forEach(day => {
        const hours = store.store_hours[day];
        if (hours && hours.open && hours.close) {
          storeInfo += `\n      ${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${hours.close}`;
        } else {
          storeInfo += `\n      ${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`;
        }
      });
    }
    
    if (store.latitude && store.longitude) {
      storeInfo += `\n   Coordinates: ${store.latitude}, ${store.longitude}`;
    }
    
    return storeInfo;
  }).join('\n');
}

export async function POST(req) {    
  const { message } = await req.json();  //req is incoming message from frontend

  try {
    // Fetch store data directly from Supabase using server-side function
    // This never exposes the database to the frontend
    let storeContext = "";
    try {
      const storesData = await fetchStoresFromDatabase();
      storeContext = formatStoreDataForAI(storesData);
    } catch (storeError) {
      console.error("Error fetching store data from Supabase:", storeError);
      // Continue without store context if fetch fails
    }

    // Create enhanced message with store context
    const enhancedMessage = storeContext 
      ? `[SYSTEM CONTEXT - Store Information]\n${storeContext}\n\n[USER QUESTION]\n${message}`
      : message;

    //forwarding message to pythonanywhere 
    const response = await fetch("https://dev2604.pythonanywhere.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: enhancedMessage }),
    });

    const data = await response.json();
    return NextResponse.json(data);   //returning response back to frontend
  } catch (err) {
    console.error("Error in chatbot API:", err);
    return NextResponse.json({ error: "Error contacting PythonAnywhere API" }, { status: 500 });
  }
}

