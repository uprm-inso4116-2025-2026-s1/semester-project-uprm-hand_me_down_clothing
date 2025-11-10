"use client";
import React, { useState } from "react";

export default function ProfilePage() {
  const profile = {
    display_name: "JohnHandmedown",
    followers: 0,
    following: 0,
  };

  const [activeTab, setActiveTab] = useState("Shop");
  const [filters, setFilters] = useState({
    Category: "",
    Brand: "",
    Size: "",
    Price: "",
  });

  const items = Array.from({ length: 6 });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="min-h-[100dvh] bg-white text-zinc-900"
      style={{
        ["--brand" as any]: "#e6dac7",
        fontFamily:
          "Lato, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      <section className="px-10 pt-10 pb-6 text-left">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {profile.display_name}
            </h1>

            <div className="mt-1 flex gap-1 text-gray-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="mt-1 text-sm text-gray-600">
              has donated more than 10 pieces of clothing
            </p>

            <div className="mt-3 flex items-center gap-6 text-sm font-semibold text-black">
              <span>{profile.followers} Followers</span>
              <span>{profile.following} Following</span>
              <button
                disabled
                className="ml-4 px-4 py-1 rounded bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                Edit
              </button>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-gray-800 font-medium">
                {profile.display_name}’s shop
              </p>
              <p className="text-gray-600 leading-relaxed">
                Description
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="px-10 mt-4">
        <div className="flex gap-10 border-b border-gray-300 pb-2">
          {["Shop", "Favorites", "History"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-medium ${
                activeTab === tab
                  ? "border-b-2 border-black pb-1 text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="px-10 mt-4 flex flex-wrap gap-3">
        {["Category", "Brand", "Size", "Price"].map((filter) => (
          <div key={filter} className="relative">
            <select
              onChange={(e) => handleFilterChange(filter, e.target.value)}
              value={filters[filter as keyof typeof filters]}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e6dac7]"
            >
              <option value="">{filter}</option>
              <option disabled>— Empty —</option>
            </select>
          </div>
        ))}
      </section>

      <section className="px-10 mt-6 pb-16">
        {activeTab === "Shop" && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((_, i) => (
              <li key={i}>
                <article className="flex flex-col rounded-3xl border border-[#E5E7EF] bg-white">
                  <div className="w-full h-52 bg-[#aac7c0] p-3 rounded-3xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-6 px-3 bg-[#f6e5e6] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                        Condition
                      </span>
                      <span className="inline-flex items-center justify-center h-6 px-3 bg-[#F9F8F8] border border-[#E5E7EF] text-sm text-[#444] rounded-xl">
                        Price
                      </span>
                    </div>
                    <div className="mt-3 h-[140px] w-full rounded-xl border border-white/40 bg-white/30 animate-pulse" />
                  </div>

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
                          <svg
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            aria-hidden
                            focusable="false"
                            className="h-3 w-3 text-zinc-600"
                          >
                            <path
                              d="M3 12l9-9 9 9-9 9-9-9z"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                          <span className="h-3 w-10 bg-zinc-200 rounded animate-pulse inline-block" />
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {activeTab !== "Shop" && (
          <div className="text-center text-gray-500 mt-20">
            <p>{activeTab} section coming soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
