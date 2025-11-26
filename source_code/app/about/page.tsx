// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Hand-Me-Down",
  description:
    "Learn more about Hand-Me-Down — a student-powered clothing marketplace built to give clothes a second life.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        
        {/* About Header */}
        <section className="space-y-4 max-w-2xl">
          <h1 className="text-6xl font-semibold tracking-tight">
            About Us
          </h1>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Hand-Me-Down is a student-powered clothing marketplace that keeps
            good pieces in circulation, saves money, and makes it easier to find
            outfits that feel like you, without hurting your wallet or the
            planet.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Mission & Vision</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-3">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-700">
                Mission
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Our mission is to make reusing clothes the easiest and most
                natural choice for students. We connect people who have pieces
                they no longer use with people who will love them next — through
                simple flows, local pickups, and a warm, community-first
                experience.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-3">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-700">
                Vision
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                We imagine campuses where closets feel shared, clothes stay in
                circulation for years, and sustainability is not a buzzword but
                a habit. Hand-Me-Down aims to become the default way students
                refresh their wardrobe; affordable, intentional, and fun.
              </p>
            </div>
          </div>
        </section>

        {/* Who are we? */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Who are we?</h2>

          {/* First image + text */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
              <Image
                src="/images/clothing_about_us.jpeg"
                alt="Students participating in a clothing swap event"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                Hand-Me-Down started as a student project when we realized how
                many good pieces were sitting in closets, drawers, and suitcases
                around campus. Instead of letting them collect dust, we wanted a
                cozy, low-pressure way to pass them on, like borrowing from a
                friend&apos;s closet.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                We are students, designers, and engineers working together to
                design a space that feels familiar, simple, and welcoming.
              </p>
            </div>
          </div>

          {/* Second text + image */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                We care about accessibility, community, and sustainability.
                Every choice, from the layout to the interactions, is aimed at
                making the platform easy to use and kind to our environment.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hand-Me-Down is built for students by students, one thoughtful
                feature at a time, always with the goal of making second-hand
                feel like the first choice.
              </p>
            </div>

            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
              <Image
                src="/images/clothing_about_us_2.jpeg"
                alt="Students exchanging clothes sustainably"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
