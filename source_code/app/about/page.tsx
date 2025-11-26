// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Hand-Me-Down",
  description:
    "About Hand-Me-Down — a student-powered clothing marketplace built to promote sustainable student clothing reuse.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#6B6B6B]">
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">


{/* ABOUT US */}
<section className="text-center max-w-2xl mx-auto space-y-6">
  <h1 className="text-7xl font-semibold italic tracking-tight text-[#2b2b2b]">
    About Us
  </h1>


  <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden border border-[#E5E7EF] shadow-sm">
    <Image
      src="/images/clothing_about_us.jpeg"
      alt="Students participating in a clothing swap event"
      fill
      className="object-cover"
      priority
    />
  </div>


  <div className="rounded-3xl bg-[#F9F8F8] border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
    <p className="text-base md:text-lg leading-relaxed text-[#6B6B6B]">
      Hand-Me-Down is a student-powered clothing marketplace that keeps
      good pieces in circulation, saves money, and makes it easier to find
      outfits that feel like you, without hurting your wallet or the
      planet.
    </p>
  </div>
</section>




        <section className="grid md:grid-cols-2 gap-8">

          {/* Mission */}
          <div className="space-y-4 text-center">
            <h2 className="text-5xl font-semibold italic text-[#2b2b2b]">
              Mission
            </h2>
            <div className="rounded-3xl bg-[#F9F8F8] border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
              <p className="text-base leading-relaxed text-[#6B6B6B]">
                Our mission is to make reusing clothes the easiest and most
                natural choice for students. We connect people who have pieces
                they no longer use with people who will love them next—through
                simple flows, local pickups, and a warm, community-first
                experience.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="space-y-4 text-center">
            <h2 className="text-5xl font-semibold italic text-[#2b2b2b]">
              Vision
            </h2>
            <div className="rounded-3xl bg-[#F9F8F8] border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
              <p className="text-base leading-relaxed text-[#6B6B6B]">
                We imagine campuses where closets feel shared, clothes stay in
                circulation for years, and sustainability is not a buzzword
                but a habit. Hand-Me-Down aims to become the default way
                students refresh their wardrobe that is affordable, intentional,
                and fun.
              </p>
            </div>
          </div>

        </section>



        <section className="space-y-8 text-center">
          <h2 className="text-5xl font-semibold italic text-[#2b2b2b]">
            Who Are We?
          </h2>


          <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden border border-[#E5E7EF] shadow-sm">
            <Image
              src="/images/clothing_about_us_2.jpeg"
              alt="Students exchanging clothes sustainably"
              fill
              className="object-cover"
            />
          </div>


          <div className="rounded-3xl bg-[#F9F8F8] border-2 border-[#E5E7EF] shadow-sm px-10 py-12 space-y-4">
            <p className="text-base leading-relaxed text-[#6B6B6B]">
              Hand-Me-Down started as a student project when we realized how
              many good pieces were sitting in closets, drawers, and suitcases
              around campus. We wanted a cozy, low-pressure way to pass them on, 
              like borrowing from a friend's closet.
            </p>
            <p className="text-base leading-relaxed text-[#6B6B6B]">
              We care about accessibility, community, and sustainability. Every
              choice, from the layout to the interactions, is aimed at making
              the platform easy to use and kind to our environment.
            </p>
          </div>
        </section>


      </div>
    </main>
  );
}
