// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {    
  const { message } = await req.json();  //req is incoming message from frontend

  try {  //forwarding message to pythonanywhere 
    const response = await fetch("https://dev2604.pythonanywhere.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return NextResponse.json(data);   //returning response back to frontend
  } catch (err) {
    return NextResponse.json({ error: "Error contacting PythonAnywhere API" }, { status: 500 });
  }
}
