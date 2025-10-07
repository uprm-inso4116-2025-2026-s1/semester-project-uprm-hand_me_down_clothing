import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function SellPiece() {
  return (
    <main className="p-3 text-[#2b2b2b] dark:text-[#f5f5dc]">
      {/* Title */}
      <h1 className="italic text-5xl sm:text-6xl font-bold mb-8">
        Sell your clothing!
      </h1>

      {/* Shared width wrapper */}
      <div className="mx-auto w-340 space-y-12">
        {/* Steps widget — Primary (#abc8c1), evenly spaced */}
        <div className="rounded-3xl w-full bg-[#abc8c1] p-6 text-center">
          <div className="grid grid-cols-3 justify-items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 1</h3>
              <p className="text-sm text-white/85">Add photos</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 2</h3>
              <p className="text-sm text-white/85">Set location & delivery</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 3</h3>
              <p className="text-sm text-white/85">Fill details</p>
            </div>
          </div>
        </div>

        {/* Photos */}
        <section id="photos" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-2">Add photos</h2>
          <p className="text-[#666666] mb-6">Min 1, max 8 — clear, bright, and true to color.</p>

          <div className="flex justify-center rounded-2xl border-2 border-dashed border-[#E5E7EF] bg-white/50 px-6 py-10">
            <div className="text-center">
              <p className="mb-2 text-[#666666]">Upload photos</p>
              {/* Accent PINK upload button (#d7b1b1) */}
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-full px-4 py-2 bg-[#d7b1b1] hover:bg-[#cda0a0] text-white inline-block transition-colors"
              >
                <span className="font-semibold italic">Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
              </label>
              <p className="pl-1 text-[#666666]">or drag and drop</p>
              <p className="text-xs text-[#666666] mt-2">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          <div className="pt-5 text-sm text-[#666666]">
            <h3 className="text-[#2b2b2b] dark:text-[#f5f5dc] font-semibold">Tips</h3>
            <ul className="ml-4 mt-2 list-disc">
              <li>Use natural lighting or a bright room.</li>
              <li>Photograph the item from multiple angles.</li>
              <li>Keep the background clean and uncluttered.</li>
              <li>Show close-ups of important details or flaws.</li>
            </ul>
          </div>
        </section>

        {/* Location & Delivery */}
        <section id="location" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-6">Location & delivery</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {/* Inputs/Selects — Donate page gray style */}
            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="e.g., Mayagüez"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="neighborhood" className="block text-sm font-medium">Neighborhood (optional)</label>
              <input
                id="neighborhood"
                name="neighborhood"
                type="text"
                placeholder="e.g., Terrace"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="col-span-full">
              <fieldset className="mt-2">
                <legend className="text-sm font-medium">Delivery method *</legend>
                <div className="mt-4 space-y-3">
                  <label htmlFor="pickup" className="flex items-center gap-2">
                    <input id="pickup" name="delivery" type="radio" className="accent-[#d7b1b1]" />
                    <span>Local pickup only</span>
                  </label>
                  <label htmlFor="delivery" className="flex items-center gap-2">
                    <input id="delivery" name="delivery" type="radio" className="accent-[#d7b1b1]" />
                    <span>Delivery available</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="col-span-full">
              <label htmlFor="contact" className="block text-sm font-medium">Contact method *</label>
              <select
                id="contact"
                name="contact"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                defaultValue="In-app messages"
              >
                <option>In-app messages</option>
                <option>Phone</option>
                <option>Email</option>
              </select>
            </div>
          </div>
        </section>

        {/* Item details */}
        <section id="details" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-6">Item details</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium">Item name *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Nike Hoodie — Lavender"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium">Category *</label>
              <select
                id="category"
                name="category"
                defaultValue=""
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              >
                <option value="" disabled>Select a category</option>
                <option>Shirt</option>
                <option>Dress</option>
                <option>Jacket</option>
                <option>Pants</option>
                <option>Underwear</option>
                <option>Socks</option>
                <option>Scarf</option>
                <option>Hoodie</option>
                <option>Coat</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="condition" className="block text-sm font-medium">Condition *</label>
              <select
                id="condition"
                name="condition"
                defaultValue=""
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              >
                <option value="" disabled>Select condition</option>
                <option>New</option>
                <option>Like New</option>
                <option>Used</option>
                <option>Worn</option>
                <option>Old</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                placeholder="e.g., 1"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium">Price ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                placeholder="e.g., 25"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="deliveryFee" className="block text-sm font-medium">Delivery fee (optional)</label>
              <input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                min={0}
                placeholder="e.g., 5"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Include material, style, fit, and any flaws"
                className="mt-2 block w-full rounded-2xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium">Size *</label>
              <select
                id="size"
                name="size"
                defaultValue=""
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              >
                <option value="" disabled>Select size</option>
                <option>2x-Small</option>
                <option>x-Small</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>x-Large</option>
                <option>2x-Large</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sex" className="block text-sm font-medium">Sex *</label>
              <select
                id="sex"
                name="sex"
                defaultValue=""
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
              >
                <option value="" disabled>Select sex</option>
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
            </div>
          </div>
        </section>

        {/* Footer action bar — Accent publish */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            className="px-5 py-2 h-13 bg-[#d7b1b1] hover:bg-[#cda0a0] rounded-full inline-flex items-center text-white transition-colors"
            aria-label="Publish listing"
          >
            <CheckIcon className="mr-2 size-5" aria-hidden="true" />
            Publish
          </button>
        </div>
      </div>
    </main>
  )
}
