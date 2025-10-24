import Link from 'next/link';
import React from 'react';

export default function Donate() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      <div
        style={{
          width: "1500px",
          height: "550px",
          backgroundColor: "#ead6d6",
          borderRadius: "20px",
          margin: "0 auto",
          position: "relative", 
          overflow: "hidden",   
        }}
      >
       
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "5%",
            width: "650px",
            fontSize: "45px",
            fontWeight: "bold",
            color: "grey",
            textAlign: "center",
            lineHeight: "1.3",
          }}
        >
          OH! Looks like you haven't put anything up for donation!
        </div>

        
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "25%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Link href="/listings/donate_piece">
            <button
              style={{
                width: "500px",
                height: "80px",
                fontSize: "25px",
                fontWeight: "bold",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#abc8c1",
                color: "grey",
              }}
            >
              Donate
            </button>
          </Link>
        </div>

         
         
        <img
          src="/images/vintage-shop.jpeg" 
          alt="Donate illustration"
          style={{
            position: "absolute",
            top: 50,
            right: 50,
            width: "35%",       
            height: "80%",     
            objectFit: "cover", 
            borderRadius: "20px",
          }}
        />
      </div>
    </div>
  );
}
