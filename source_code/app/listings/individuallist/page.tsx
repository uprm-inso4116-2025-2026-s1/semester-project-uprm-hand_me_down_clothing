"use client";
import React, { useState } from "react";

export default function IndividualListing() {
  const brand = {
    pink: "#E7A4A4",
    mint: "#C7E2E0",
    beige: "#F8E4D9",
    red: "#E68A8A",
    borderStrong: "#B0B0B0",
  } as const;

  const product = {
    title: "Nike Hoodie — Lavender",
    categoryTrail: ["Home", "Hoodies"],
    description: {
      material: "80% Cotton, 20% Polyester",
      care: "Machine wash cold, tumble dry low.",
      measurements: [
        { label: "Chest (pit-to-pit)", value: "21in" },
        { label: "Length", value: "27in" },
        { label: "Sleeve", value: "24in" },
      ],
      notes: [
        "Worn twice, no visible flaws",
        "Comes from smoke-free, pet-free home",
        "Slightly oversized fit",
      ],
      tip: "Meet in a public place for local swaps. For shipping, use tracked methods.",
    },
    price: "Free",
    badges: ["New", "M"],
    tags: ["Unisex fit", "New"],
    details: {
      category: "Jacket",
      location: "Mayagüez, PR",
      condition: "Like New",
      size: "M (Unisex)",
    },
    donor: {
      initials: "D",
      name: "Dani M.",
      rating: 4.8,
      stats: "23 donations",
      response: "High",
    },
  };

  const suggestions = [
    { title: "H&M Hoodie", meta: "Size: M • Like New" },
    { title: "Champion Crew", meta: "Size: M • Like New" },
    { title: "Zara Pullover", meta: "Size: M • Like New" },
    { title: "Vintage Hoodie", meta: "Size: M • Like New" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-600 mt-6">
        <nav className="flex items-center gap-2">
          {product.categoryTrail.map((c) => (
            <React.Fragment key={c}>
              <a href="#" className="hover:text-neutral-900">{c}</a>
              <span>/</span>
            </React.Fragment>
          ))}
          <span className="text-neutral-900 font-medium">{product.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          <div
            className="rounded-3xl overflow-hidden border border-neutral-200 aspect-[4/3] flex items-center justify-center"
            style={{ backgroundColor: brand.mint }}
          >
            <div className="text-neutral-600">Main Image</div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n, i) => (
              <button
                key={n}
                onClick={() => setActiveIndex(i)}
                className={`rounded-2xl border bg-white aspect-[5/4] flex items-center justify-center text-xs ${
                  activeIndex === i ? "border-neutral-400" : "border-neutral-200"
                }`}
              >
                Thumb {n}
              </button>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-tight" style={{ fontFamily: 'Lato, system-ui, sans-serif' }}>
                  {product.title}
                </h1>
                <div className="text-2xl font-semibold" style={{ color: brand.mint }}> {product.price} </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ backgroundColor: brand.beige, borderColor: brand.beige }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-neutral-500">Category:</dt>
                <dd className="col-span-2">{product.details.category}</dd>
                <dt className="text-neutral-500">Location:</dt>
                <dd className="col-span-2">{product.details.location}</dd>
                <dt className="text-neutral-500">Condition:</dt>
                <dd className="col-span-2">{product.details.condition}</dd>
                <dt className="text-neutral-500">Size:</dt>
                <dd className="col-span-2">{product.details.size}</dd>
              </dl>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm"
                  style={{ borderColor: brand.borderStrong }}
                >
                  <span>💗</span> Save
                </button>

                {/*^ Call to api to add to favorites array */}


                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs hover:shadow-sm"
                  style={{ borderColor: brand.borderStrong }}
                >
                  <span>↗</span> Share
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium hover:opacity-90"
                  style={{ backgroundColor: brand.beige }}
                >
                  Contact
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full border" style={{ backgroundColor: brand.beige, borderColor: brand.beige }}>
                  {product.tags[0]}
                </span>
                <span className="px-3 py-1 rounded-full border" style={{ backgroundColor: brand.pink, borderColor: brand.pink, color: '#2b2b2b' }}>
                  {product.tags[1]}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center font-semibold text-white border shadow-sm aspect-square"
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderColor: brand.borderStrong,
                    width: '48px',
                    borderRadius: '50%',
                  }}
                >
                  {product.donor.initials}
                </div>
                <div>
                  <div className="font-medium">{product.donor.name}</div>
                  <div className="text-xs text-neutral-600">{product.donor.rating} ★ • {product.donor.stats} • Response: {product.donor.response}</div>
                </div>
              </div>
              <button className="text-xs rounded-full border px-3 py-1.5 hover:bg-neutral-50" style={{ borderColor: brand.borderStrong }}>View profile</button>
            </div>
          </div>
        </aside>
      </main>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 p-6 relative overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p><span className="font-medium">Material:</span> {product.description.material}</p>
              <p><span className="font-medium">Care:</span> {product.description.care}</p>
              <div className="mt-4">
                <h3 className="text-base font-medium">Measurements:</h3>
                <ul className="mt-2 space-y-1">
                  {product.description.measurements.map((m) => (
                    <li key={m.label}>• {m.label}: {m.value}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium">Notes:</h3>
              <ul className="mt-2 space-y-1">
                {product.description.notes.map((n, idx) => (
                  <li key={idx}>• {n}</li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="mt-6 -mb-6 -mx-6 px-6 py-3 text-xs"
            style={{ backgroundColor: brand.beige, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
          >
            <span className="font-medium">Tip:</span> {product.description.tip}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-lg font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestions.map((s) => (
            <a key={s.title} href="#" className="group rounded-3xl border border-neutral-200 overflow-hidden p-4 hover:shadow-sm transition">
              <div
                className="rounded-2xl aspect-[16/11] flex items-center justify-center"
                style={{ backgroundColor: brand.mint }}
              />
              <div className="mt-3">
                <div className="text-sm font-semibold italic group-hover:underline">{s.title}</div>
                <div className="text-xs text-neutral-600 mt-0.5">{s.meta}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}