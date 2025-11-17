"use client";
import React from "react";
import { FavoriteItem } from "../lib/favoritesApi";
import { removeFavorite } from "../lib/favoritesApi";

/* -------------------- Tiny inline SVG icons (no deps) -------------------- */
const Icon = {
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Filter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false" {...props}>
      <path d="M3 6h18M6 12h312M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Tag: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false" {...props}>
      <path d="M3 12l9-9 9 9-9 9-9-9z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Heart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden focusable="false" {...props}>
      <path d="M19.5 3.9a5.5 5.5 0 0 0-7.78 0L12 4.18l.28-.28a5.5 5.5 0 1 0-7.78 7.78L12 19.18l7.5-7.5a5.5 5.5 0 0 0 0-7.78Z" fill="currentColor" />
    </svg>
  ),
};




export default function FavoritesLayout() {
  const skeletonCards = Array.from({ length: 8 });

  //Yamilette Alemany: Loading safeguards
    const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  //Yamilette Alemany: End here

  async function handleRemoveFavorite(listingId: string) {
    const previous = favorites;
    setFavorites((curr) => curr.filter((f) => f.id !== listingId));

    try {
      await removeFavorite(listingId); // calls your API file
    } catch (err) {
      setFavorites(previous); // rollback
      console.error(err);
      alert("Could not remove from favorites.");
    }
  }

    // Yamilette Alemany: call api

    React.useEffect(() => {
      async function loadFavorites() {
      setStatus("loading");
      setErrorMessage(null);

      try {
        // ⬇️ CHANGE THIS to match real backend URL
        const res = await fetch("/api/favorites", {
        });

        if (!res.ok) {
          throw new Error("Failed to load favorites");
        }

        const data = (await res.json()) as FavoriteItem[];
        setFavorites(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage((err as Error).message);
      }
    }

      loadFavorites();
    }, []);

  //Yamilette Alemany: these variables will help with conditional rendering later. All skeleton cards load regardless of data state. When 
  //integrating with backend, these will help show the right UI states.

  const showSkeletons = status === "loading" || status === "idle";
  const showEmpty = status === "success" && favorites.length === 0;
  const showList = status === "success" && favorites.length > 0;


  //Yamilette Alemany: End here


  return (
    <div
      className="min-h-[100dvh] bg-white text-zinc-900"
      style={{
        ["--brand" as any]: "#e6dac7",
        fontFamily:
          "Lato, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      {/* Header / Hero strip */}
      <header className="bg-[#f5f6f3] border-b border-[#E5E7EF]">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap gap-6 items-center justify-between">
          <h1 className="font-bold leading-tight text-5xl sm:text-6xl">Favorites</h1>

          {/* Search (presentational) */}
          <label className="relative w-full max-w-xl" aria-label="Search favorites">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden>
              <Icon.Search className="h-5 w-5 text-[#989A9D]" />
            </span>
            <input
              id="Search_Bar_Favorites"
              placeholder="Search for clothing..."
              className="w-full h-12 pl-11 pr-4 rounded-full bg-[#E5E7EF] text-[#45484c] placeholder:text-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]"
              readOnly
            />
          </label>
        </div>
      </header>

      {/* Featured category chips (static) */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <h2 className="font-bold text-3xl">Featured</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {["Tops", "Bottoms", "Dresses", "Shoes", "Outerwear", "Accessories", "Kids", "Unisex"].map((name) => (
            <button
              key={name}
              className="h-11 px-5 rounded-full bg-[#e6dac7] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2] text-[#333333] font-normal cursor-default"
              type="button"
              aria-disabled
            >
              {name}
            </button>
          ))}
        </div>
      </section>


      {/* Controls row (static chips + select-look) */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-wrap items-center gap-3">
          <ChipGroup label="Category" options={["all", "Tops", "Bottoms", "Dresses", "Shoes", "Outerwear", "Accessories"]} />
          <ChipGroup label="Size" options={["all", "XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10"]} />
          <ChipGroup label="Brand" options={["all", "Nike", "Adidas", "Zara", "Levi's", "Uniqlo", "Converse"]} />

          <div className="ml-auto">
            <SelectPill
              label="Sort"
              options={[
                { value: "recent", label: "Most Recent" },
                { value: "priceAsc", label: "Price: Low to High" },
                { value: "priceDesc", label: "Price: High to Low" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Items grid — skeleton cards only */}

      {/* Yamilette Alemany - modified skeleton keys to show real data when available */}

      <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Error message, if any */}
        {status === "error" && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            We couldn’t load your favorites. Please refresh or try again later.
            {errorMessage && (
              <span className="block text-xs mt-1 opacity-70">{errorMessage}</span>
            )}
          </div>
      )}

      {/* Loading skeletons */}
      {showSkeletons && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skeletonCards.map((_, i) => (
            <li key={i}>
                    <article className="flex flex-col rounded-3xl border border-[#E5E7EF] bg-white">
                {/* Top container with chips + heart */}
                <div className="w-full h-52 bg-[#aac7c0] p-3 rounded-3xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 px-3 bg-[#f6e5e6] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                      Condition
                    </span>
                    <span className="inline-flex items-center justify-center h-6 px-3 bg-[#F9F8F8] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                      Price
                    </span>
                    <button
                      type="button"
                      className="ml-auto inline-flex items-center justify-center w-8 h-8 bg-[#F9F8F8] border border-[#E5E7EF] text-xl text-[#f495ba] rounded-full cursor-default"
                      aria-label="Remove from favorites"
                      aria-disabled
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </article>
            </li>
           ))}
          </ul>
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon.Heart className="h-10 w-10 text-[#d6b1b1]" aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold">No favorites yet</h2>
          <p className="mt-2 max-w-md text-sm text-zinc-600">
            Start exploring listings and tap the heart icon to save items you love.
          </p>
        </div>
      )}

      {/* List of real favorites */}
      {showList && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((item) => (
            <li key={item.id}>
              <article className="flex flex-col rounded-3xl border border-[#E5E7EF] bg-white">
                {/* Top container with chips + heart */}
                <div className="w-full h-52 bg-[#aac7c0] p-3 rounded-3xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 px-3 bg-[#f6e5e6] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                      {item.conditionLabel}
                    </span>
                    <span className="inline-flex items-center justify-center h-6 px-3 bg-[#F9F8F8] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                      ${item.priceLabel}
                    </span>
                    <button
                      type="button"
                      className="ml-auto inline-flex items-center justify-center w-8 h-8 bg-[#F9F8F8] border border-[#E5E7EF] text-xl text-[#f495ba] rounded-full cursor-default"
                      aria-label="Remove from favorites"
                      aria-pressed="true"
                      onClick={() => handleRemoveFavorite(item.listingId)}
                    >
                      ♥
                    </button>
                  </div>

                  {/* Image */}
                  <div className="mt-3 h-[140px] w-full rounded-xl border border-white/40 bg-white/30 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-white/40" />
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-3">
                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EF] px-2 py-0.5 text-[0.8rem] text-zinc-600"
                      >
                        <Icon.Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>


    {/* Image placeholder */}
    <div className="mt-3 h-[140px] w-full rounded-xl border border-white/40 bg-white/30 animate-pulse" />

    {/* Body placeholders */}
    <div className="px-5 py-3">
      <div className="h-5 w-3/4 bg-zinc-200 rounded mb-2 animate-pulse" />
      <div className="space-y-1">
        <div className="h-3 w-5/6 bg-zinc-200 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-zinc-200 rounded animate-pulse" />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EF] px-2 py-0.5 text-[0.8rem] text-zinc-600"
          >
            <Icon.Tag className="h-3 w-3" />
            <span className="h-3 w-10 bg-zinc-200 rounded animate-pulse inline-block" />
          </span>
        ))}
      </div>
    </div>
  </div>
  );
  }

/* -------------------- Presentational Subcomponents -------------------- */

function ChipGroup({ label, options }: { label: string; options: (string | number)[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#666666]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, idx) => {
          const isFirst = idx === 0; // visually indicate a "selected" chip
          return (
            <button
              key={String(opt)}
              type="button"
              className={
                isFirst
                  ? "h-9 px-4 rounded-full bg-[#e6dac7] text-[#333333] border border-transparent font-normal cursor-default"
                  : "h-9 px-4 rounded-full bg-[#F9F8F8] text-[#666666] border border-[#E5E7EF] cursor-default"
              }
              aria-disabled
            >
              {String(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectPill({
  label,
  options,
}: {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#666666]">{label}</span>
      <div className="relative">
        <select
          className="h-9 pl-4 pr-9 rounded-full bg-[#F9F8F8] text-[#333333] border border-[#E5E7EF] cursor-default"
          aria-disabled
          defaultValue={options[0]?.value}
          onChange={() => {}}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon.Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      </div>
    </div>
  );
}
