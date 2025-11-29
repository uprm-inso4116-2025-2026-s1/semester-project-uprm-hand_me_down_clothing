"use client"

import { CheckIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { PieceRepository } from '@/src/repositories/pieceRepository';
import { PieceFactory } from '@/src/factories/pieceFactory';
import { ImageUploader } from '../../../src/components/imageUploader';

const dummyUserId = "00000000-0000-0000-0000-000000000000"; // placeholder UUID

export default function SellPiece() {
  // State hooks for each Piece field
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [color, setColor] = useState("")
  const [brand, setBrand] = useState("")
  const [gender, setGender] = useState("")
  const [size, setSize] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState("")
  const [reason, setReason] = useState("")
  const [images, setImages] = useState<Array<string>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter();
  const listingId = `sell-${Date.now()}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // TODO: add this once Auth is set up (meaning signup and login screens with a logout button somewhere )
    // Get the current user
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   alert("You must be logged in to publish a piece.");
    //   return;
    // }

    // Validate minimum 1 image
    if (!images.length) {
      alert("Please upload at least one image.")
      return
    }

    // Individual field validation
    if (!name.trim()) {
      alert("Please enter a name for your piece.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }
    if (!color.trim()) {
      alert("Please specify the color of the piece.");
      return;
    }
    if (!brand.trim()) {
      alert("Please enter the brand.");
      return;
    }
    if (!gender) {
      alert("Please select a gender.");
      return;
    }
    if (!size) {
      alert("Please select a size.");
      return;
    }
    if (!condition) {
      alert("Please select the condition of your piece.");
      return;
    }
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      alert("Price must be a valid number.");
      return;
    }
    if (parsedPrice < 0) {
      alert("Price cannot be negative.");
      return;
    }

    setIsSubmitting(true)

    try {
      const factory = new PieceFactory();
      const repository = new PieceRepository();
    try {
      const factory = new PieceFactory();
      const repository = new PieceRepository();

      const piece = factory.makePiece({
        id: 0,
        name: name,
        category: category,
        color: color,
        brand: brand,
        gender: gender,
        size: size,
        price: parsedPrice.toFixed(2),
        condition: condition,
        reason: reason,
        images: images,
        user_id: dummyUserId,
        // user_id: user.id, 
      });

      const result = await repository.createPiece(piece);

      if (result instanceof Error) {
        alert("Failed to publish: " + (result as Error).message);
      } else {
        alert("Piece published successfully!");
        router.push("/");
      }
    } catch (err) {
      console.error("Error publishing piece:", err);
      alert("Failed to publish. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-3 text-[#2b2b2b]">
      {/* Title */}
      <h1 className="italic text-5xl sm:text-6xl font-bold mb-8">
        Sell your clothing!
      </h1>

      {/* Shared width wrapper */}
      <div className="mx-auto w-340 space-y-12">
        {/* Steps widget — Primary (#abc8c1), evenly spaced */}
        <div className="rounded-3xl w-full bg-[#abc8c1] p-6 text-center">
          <div className="grid grid-cols-3 justify-items-center">
            {step(1, "Add Photos")}
            {step(2, "Fill Details")}
            {step(3, "Publish Listing")}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Photos */}
          <section id="photos" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
            <h2 className="text-3xl font-bold italic mb-2">Add photos*</h2>
            <p className="text-[#666666] mb-6">Min 1, max 8 — clear, bright, and true to color.</p>
            
            {/* ImageUploader integration */}
            <ImageUploader
              listingId={listingId}
              onUploadComplete={(urls) => setImages(urls)}
            />

            {images.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {images.length} image(s) uploaded successfully
              </p>
            )}
          </section>

          {/* Piece Details Form */}
          <section id="piece-details" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8 mt-5">
            <h2 className="text-3xl font-bold italic mb-6">Piece Details</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Nike Hoodie"
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              {/* Category */}
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                >
                  <option value="" disabled>Select category</option>
                  <option value="SHIRT">Shirt</option>
                  <option value="DRESS">Dress</option>
                  <option value="JACKET">Jacket</option>
                  <option value="PANTS">Pants</option>
                  <option value="UNDERWEAR">Underwear</option>
                  <option value="SOCKS">Socks</option>
                  <option value="SCARF">Scarf</option>
                  <option value="HOODIE">Hoodie</option>
                  <option value="COAT">Coat</option>
                </select>
              </div>
              {/* Color */}
              <div className="sm:col-span-3">
                <label htmlFor="color" className="block text-sm font-medium">Color *</label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  placeholder="e.g., Lavender"
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                />
              </div>
              {/* Brand */}
              <div className="sm:col-span-3">
                <label htmlFor="brand" className="block text-sm font-medium">Brand *</label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="e.g., Nike"
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                />
              </div>
              {/* Gender */}
              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm font-medium">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
              {/* Size */}
              <div className="sm:col-span-3">
                <label htmlFor="size" className="block text-sm font-medium">Size *</label>
                <select
                  id="size"
                  name="size"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                >
                  <option value="" disabled>Select size</option>
                  <option value="SMALL_X2">2x-Small</option>
                  <option value="SMALL_X">x-Small</option>
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                  <option value="LARGE_X">x-Large</option>
                  <option value="LARGE_X2">2x-Large</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              {/* Price */}
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium">Price ($) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="e.g., 25"
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              {/* Condition */}
              <div className="sm:col-span-3">
                <label htmlFor="condition" className="block text-sm font-medium">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                >
                  <option value="" disabled>Select condition</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="USED">Used</option>
                  <option value="WORN">Worn</option>
                  <option value="OLD">Old</option>
                </select>
              </div>
              {/* Reason */}
              <div className="col-span-full">
                <label htmlFor="reason" className="block text-sm font-medium">Reason for selling (optional)</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  placeholder="Why are you selling this piece?"
                  className="mt-2 block w-full rounded-2xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
              {/* This is commented out because we wont use it but it does provide some insight into how to upload with user id */}
              {/* User ID */}
              {/* <div className="sm:col-span-3">
                <label htmlFor="user_id" className="block text-sm font-medium">User ID *</label>
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  placeholder="Enter your user ID"
                  className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#d7b1b1]"
                  value={user_id}
                  onChange={e => setUserId(e.target.value)}
                />
              </div> */}
            </div>
          </section>

          {/* Preview Section */}
          <section id="preview" className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold italic">How it will look</h2>
              <button
                type="button"
                className="text-sm text-[#36534b] underline hover:text-[#2b2b2b] transition-colors"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} preview
              </button>
            </div>

            {showPreview && (
              <div className="max-w-sm">
                {(() => {
                  const hasEnumsSelected = Boolean(category && gender && size && condition);
                  if (!hasEnumsSelected) {
                    const coverImage = images && images.length > 0 ? images[0] : 'https://placehold.co/600x400?text=No+photos+yet';
                    return (
                      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-md bg-white">
                        <img src={coverImage} alt="Listing cover" className="h-48 w-full object-cover" />
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#2b2b2b]">{name || 'Untitled item'}</h3>
                            <p className="text-xs text-gray-500 mt-1">{category || 'No category'} • {condition || 'No condition'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">Size</p>
                              <p className="text-gray-600">{size || 'Not set'}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">For</p>
                              <p className="text-gray-600">{gender || 'Not set'}</p>
                            </div>
                            {price && (
                              <div>
                                <p className="font-medium text-gray-900">Price</p>
                                <p className="text-gray-600">${price}</p>
                              </div>
                            )}
                          </div>
                          <div className="pt-2">
                            <span className="inline-flex rounded-full bg-[#abc8c1]/20 text-[#36534b] px-3 py-1 text-xs font-medium">Fill required fields to preview</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Create a temporary Piece object for preview from form data
                  const factory = new PieceFactory();
                  const previewPiece = factory.makePiece({
                    id: 0,
                    name: name || 'Untitled item',
                    category: category,
                    color: color,
                    brand: brand,
                    gender: gender,
                    size: size,
                    price: price ? Number(price) : 0,
                    condition: condition,
                    reason: reason,
                    images: images,
                    user_id: dummyUserId,
                    latitude: null,
                    longitude: null,
                    status: Status.ACTIVE,
                  });
                  return <ListingPreview piece={previewPiece} />;
                })()}
              </div>
            )}
          </section>

          <div className="flex flex-wrap gap-3 justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 h-13 rounded-full inline-flex items-center text-white transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#d7b1b1] hover:bg-[#cda0a0]'
              }`}
              aria-label="Publish listing"
            >
              <CheckIcon className="mr-2 size-5" aria-hidden="true" />
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

function step(index: number, s: string){
  return (<div className="space-y-1">
              <h3 className="text-2xl font-bold italic text-[#2b2b2b]">Step {index}</h3>
              <p className="text-sm text-white/85">{s}</p>
            </div>);
}

// ATTENTION:

// The following lines are to visualize the changes in the DB.
// To use the lines, you MUST comment everything above the "ATTENTION" marker 
// and uncomment everything beneath this line. Reverse that action when finished.

// import { ReactElement } from "react";
// import { Piece } from "@/app/types/piece";
// import { PieceRepository } from "@/src/repositories/pieceRepository";

// export default async function Home() {
//   const pieces = await (new PieceRepository().getPieces());

//   return (
//     <main className="px-10 py-6 flex flex-col items-center">
//       <div className="items-center pb-7 flex space-x-7">
//         <h1 className="text-3xl">
//           Listings
//         </h1>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
//         {cards(pieces)}
//         <div />
//       </div>
//     </main>
//   );
// }

// function cards(listings: Array<Piece>): Array<ReactElement> {
//   if (listings == null) {
//     return [<div>Empty</div>]
//   }
//   return listings.map((piece, index) => card(index, piece));
// }

// function card(key: number, piece: Piece): ReactElement {
//   return (
//     <div
//       key={key}
//       className="w-25rem bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
//     >
//       <img
//         className="h-64 w-full object-cover"
//         src={piece.images?.[0] || "/placeholder.jpg"}
//         alt={piece.name}
//       />

//       <div className="p-5 flex flex-col justify-between h-52">
//         <div>
//           <h5 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
//             {piece.name}
//           </h5>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             {piece.brand} · {piece.category}
//           </p>

//           <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
//             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
//               {piece.size}
//             </span>
//             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
//               {piece.condition}
//             </span>
//             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
//               {piece.gender}
//             </span>
//           </div>
//         </div>

//         <div className="mt-4 flex flex-col items-center justify-between">
//           <span className="text-xl font-bold text-gray-900 dark:text-white">
//             {piece.getFormattedPrice()}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }