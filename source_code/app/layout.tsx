import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/src/components/announcementBar";
import TopNav from "@/src/components/nav_bar";
import Footer from "@/src/components/Footer";
import { SupabaseAuthProvider } from "@/app/auth/SupabaseAuthProvider";



const lato = Lato({
  weight: ["400", "700"], // normal + bold
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hand Me Down Clothing",
  description: "Online resale marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        {/* Skip link for accessibility */}
        <SupabaseAuthProvider>

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded bg-white px-3 py-2 shadow"
          >
            Skip to content
          </a>

          <AnnouncementBar />
          <TopNav />

          {/* Page content + footer */}
          <main id="main" className="min-h-screen flex flex-col">
            {children}
            <Footer />
          </main>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}

