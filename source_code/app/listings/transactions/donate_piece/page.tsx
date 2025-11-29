'use client'

import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { ImageUploader } from '../../../src/components/imageUploader.tsx'
import { createClient } from '../../../app/auth/supabaseClient.ts';
import Link from 'next/link'

export default function DonatePiece() {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )

  // Form state including image URLs
  const [formData, setFormData] = useState({
    image_urls: [] as string[],
    city: '',
    neighborhood: '',
    handoff: '',
    contact: 'In-app messages',
    title: '',
    category: '',
    condition: '',
    quantity: 1,
    size: '',
    sex: '',
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Temporary listing ID for ImageUploader
  const listingId = `donate-${Date.now()}`

  const handleSubmit = async () => {
    // Validation
    if (!formData.image_urls || formData.image_urls.length === 0) {
      alert("Please upload at least one image.")
      return
    }
    if (!formData.city.trim()) {
      alert("Please enter a city.")
      return
    }
    if (!formData.handoff) {
      alert("Please select a handoff method.")
      return
    }
    if (!formData.title.trim()) {
      alert("Please enter an item name.")
      return
    }
    if (!formData.category) {
      alert("Please select a category.")
      return
    }
    if (!formData.condition) {
      alert("Please select a condition.")
      return
    }
    if (!formData.size) {
      alert("Please select a size.")
      return
    }
    if (!formData.sex) {
      alert("Please select a gender.")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([
          {
            title: formData.title,
            category: formData.category,
            condition: formData.condition,
            quantity: formData.quantity,
            size: formData.size,
            sex: formData.sex,
            description: formData.description,
            city: formData.city,
            neighborhood: formData.neighborhood,
            handoff: formData.handoff,
            contact: formData.contact,
            image_urls: formData.image_urls,
            type: 'donation',
            created_at: new Date()
          }
        ])

      if (error) throw error

      alert("Donation listing submitted successfully!")
      
      // Reset form
      setFormData({
        image_urls: [],
        city: '',
        neighborhood: '',
        handoff: '',
        contact: 'In-app messages',
        title: '',
        category: '',
        condition: '',
        quantity: 1,
        size: '',
        sex: '',
        description: ''
      })
    } catch (err) {
      console.error("Error creating donation listing:", err)
      alert("Failed to submit donation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-3 text-[#2b2b2b]">
      {/* Title */}
      <h1 className="italic text-5xl sm:text-6xl font-bold mb-8">
        Donate your clothing!
      </h1>

      {/* Shared width wrapper */}
      <div className="mx-auto w-340 space-y-12">
        {/* Steps widget — pink (#d7b1b1) */}
        <div className="rounded-3xl w-full bg-[#d7b1b1] p-6 text-center">
          <div className="grid grid-cols-3 justify-items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 1</h3>
              <p className="text-sm text-white/85">Add photos</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 2</h3>
              <p className="text-sm text-white/85">Set location & handoff</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step 3</h3>
              <p className="text-sm text-white/85">Provide item details</p>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <section id="photos" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-2">Add photos*</h2>
          <p className="text-[#666666] mb-6">Show your item clearly so it finds a new home! [Min. 1, Max. 8]</p>

          {/* Integrated ImageUploader */}
          <ImageUploader
            listingId={listingId}
            onUploadComplete={(urls) => setFormData({ ...formData, image_urls: urls })}
          />
        </section>

        {/* Location & Handoff */}
        <section id="location" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-6">Location & handoff</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="e.g., Mayagüez"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="neighborhood" className="block text-sm font-medium">Neighborhood (optional)</label>
              <input
                id="neighborhood"
                name="neighborhood"
                type="text"
                placeholder="e.g., Terrace"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>

            <div className="col-span-full">
              <fieldset className="mt-2">
                <legend className="text-sm font-medium">Handoff method *</legend>
                <div className="mt-4 space-y-3">
                  <label htmlFor="pickup" className="flex items-center gap-2">
                    <input 
                      id="pickup" 
                      name="handoff" 
                      type="radio" 
                      className="accent-[#abc8c1]" 
                      checked={formData.handoff === 'pickup'}
                      onChange={() => setFormData({ ...formData, handoff: 'pickup' })}
                    />
                    <span>Pickup at my location</span>
                  </label>
                  <label htmlFor="dropoff" className="flex items-center gap-2">
                    <input 
                      id="dropoff" 
                      name="handoff" 
                      type="radio" 
                      className="accent-[#abc8c1]" 
                      checked={formData.handoff === 'dropoff'}
                      onChange={() => setFormData({ ...formData, handoff: 'dropoff' })}
                    />
                    <span>Drop-off at designated point</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="col-span-full">
              <label htmlFor="contact" className="block text-sm font-medium">How can we reach you for pickup? *</label>
              <select
                id="contact"
                name="contact"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              >
                <option>In-app messages</option>
                <option>Phone</option>
                <option>Email</option>
              </select>
            </div>
          </div>
        </section>

        {/* Item Details */}
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium">Category *</label>
              <select
                id="category"
                name="category"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium">Size *</label>
              <select
                id="size"
                name="size"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
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
              <label htmlFor="sex" className="block text-sm font-medium">Designed for *</label>
              <select
                id="sex"
                name="sex"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
              >
                <option value="" disabled>Select sex</option>
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Highlight what makes this item special for someone else. Include material, style, and/or flaws."
                className="mt-2 block w-full rounded-2xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Footer action bar — green (#abc8c1) */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 h-13 rounded-full inline-flex items-center text-white transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#abc8c1] hover:bg-[#8bb5aa]'
            }`}
            aria-label="Submit donation"
          >
            <CheckIcon className="mr-2 size-5" aria-hidden="true" />
            {isSubmitting ? 'Submitting...' : 'Submit Donation!'}
          </button>
        </div>
      </div>
    </main>
  )
}