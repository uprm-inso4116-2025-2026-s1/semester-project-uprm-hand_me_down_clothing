'use client'

import { CheckIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { ImageUploader } from '../../../src/components/imageUploader'
import { useParams, useRouter } from 'next/navigation'
import { PieceRepository } from '@/src/repositories/pieceRepository'
import { Piece } from '@/app/types/piece'
import { Category, Condition, Gender, Size } from '@/app/types/classifications'
import { createClient } from '@/app/utils/supabase/client'

const MAX_IMAGES = 8

export default function EditPiece() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id || ''
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    image_urls: [] as string[],
    city: '',
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

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pieceRepository = new PieceRepository()
  const supabaseAuth = createClient()

  // Check authentication and fetch listing
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check authentication using separate auth client
        const { data: { user }, error } = await supabaseAuth.auth.getUser()
        if (error || !user) {
          alert('You must be logged in to edit listings.')
          router.push('/login')
          return
        }
        setCurrentUser(user)

        // Fetch listing data
        const pieceId = parseInt(listingId as string)
        if (isNaN(pieceId)) {
          throw new Error('Invalid listing ID')
        }

        const piece = await pieceRepository.getPieceById(pieceId)
        
        if (!piece) {
          alert('Unable to load listing. It may not exist or may have been deleted.')
          router.push('/dashboard')
          return
        }

        // Authorization check
        if (piece.user_id !== user.id) {
          alert('You do not have permission to edit this listing.')
          router.push('/dashboard')
          return
        }

        // Pre-fill form with existing data
        setFormData({
          image_urls: (piece as any).images || [],
          city: (piece as any).city || '',
          handoff: (piece as any).handoff || '',
          contact: (piece as any).contact || 'In-app messages',
          title: piece.name || '',
          category: piece.category ? String(piece.category) : '',
          condition: piece.condition ? String(piece.condition) : '',
          quantity: (piece as any).quantity ?? 1,
          size: piece.size ? String(piece.size) : '',
          sex: piece.gender ? String(piece.gender) : '',
          description: (piece as any).description || ''
        })
        setExistingImages(((piece as any).images || []) as string[])
      } catch (err) {
        console.error('Error loading listing:', err)
        alert('An unexpected error occurred while loading the listing.')
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [listingId, router])

  // Handle image removal
  const handleRemoveImage = (url: string) => {
    const newImageUrls = formData.image_urls.filter((u) => u !== url)
    const newExistingImages = existingImages.filter((u) => u !== url)
    
    setExistingImages(newExistingImages)
    setFormData({
      ...formData,
      image_urls: newImageUrls
    })
    setRemovedImages([...removedImages, url])
  }

  // Check if we can add more images
  const canAddMoreImages = formData.image_urls.length < MAX_IMAGES

  // Validate form data
  const validateForm = (): string | null => {
    if (!formData.image_urls || formData.image_urls.length === 0) {
      return 'Please upload at least one image.'
    }
    if (formData.image_urls.length > MAX_IMAGES) {
      return `Maximum ${MAX_IMAGES} images allowed.`
    }
    if (!formData.city.trim()) {
      return 'Please enter a city.'
    }
    if (!formData.handoff) {
      return 'Please select a handoff method.'
    }
    if (!formData.title.trim()) {
      return 'Please enter an item name.'
    }
    if (!formData.category) {
      return 'Please select a category.'
    }
    if (!formData.condition) {
      return 'Please select a condition.'
    }
    if (!formData.size) {
      return 'Please select a size.'
    }
    if (!formData.sex) {
      return 'Please select a gender.'
    }
    if (formData.quantity < 1) {
      return 'Quantity must be at least 1.'
    }
    return null
  }

  // Convert form data to Piece domain object
  const formDataToPiece = (): Piece => {
    const pieceId = parseInt(listingId as string)
    
    const data: any = {
      id: pieceId,
      name: formData.title,
      category: formData.category as unknown as Category,
      size: formData.size as unknown as Size,
      gender: formData.sex as unknown as Gender,
      condition: formData.condition as unknown as Condition,
      price: 0,
      reason: formData.description,
      images: formData.image_urls,
      user_id: currentUser.id,
      city: formData.city,
      handoff: formData.handoff,
      contact: formData.contact,
      quantity: formData.quantity,
      description: formData.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return data as Piece
  }

  // Handle save using repository pattern
  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      // Convert form data to Piece domain object and update using repository
      const piece = formDataToPiece()
      const result = await pieceRepository.updatePiece(piece)

      if (result instanceof Error) {
        throw new Error('Failed to update listing in database.')
      }

      // Delete removed images from storage using repository
      if (removedImages.length > 0) {
        const imagePaths = removedImages.map(url => {
          const path = url.split('/storage/v1/object/public/piece_images/')[1]
          return path || url
        })

        await pieceRepository.deleteImages(imagePaths)
      }

      alert('Listing updated successfully!')
      router.push(`/listings/${listingId}`)
    } catch (err) {
      console.error('Error updating listing:', err)
      alert(err instanceof Error ? err.message : 'Failed to update listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="p-3 text-[#2b2b2b] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#abc8c1] mb-4"></div>
          <p className="text-lg">Loading listing...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-3 text-[#2b2b2b]">
      <h1 className="italic text-5xl sm:text-6xl font-bold mb-8">Edit your listing</h1>

      <div className="mx-auto w-340 space-y-12">
        {/* Step 1: Images */}
        <section id="photos" className="bg-white border-2 border-[#E5E7EF] rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold italic mb-2">Edit photos*</h2>
          <p className="text-[#666666] mb-6">
            Add, remove, or replace images. [Min. 1, Max. {MAX_IMAGES}]
            {formData.image_urls.length > 0 && (
              <span className="ml-2 font-semibold">
                ({formData.image_urls.length}/{MAX_IMAGES})
              </span>
            )}
          </p>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img 
                    src={url} 
                    alt={`Image ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow-lg transition-colors"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Image uploader */}
          {canAddMoreImages ? (
            <ImageUploader
              listingId={`edit-${listingId}-${Date.now()}`}
              onUploadComplete={(urls) => {
                const newTotal = formData.image_urls.length + urls.length
                if (newTotal > MAX_IMAGES) {
                  alert(`You can only add ${MAX_IMAGES - formData.image_urls.length} more image(s).`)
                  return
                }
                setFormData({
                  ...formData,
                  image_urls: [...formData.image_urls, ...urls]
                })
              }}
            />
          ) : (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <p className="text-gray-600">
                Maximum number of images ({MAX_IMAGES}) reached. Remove an image to add a new one.
              </p>
            </div>
          )}
        </section>

        {/* Step 2: Location & Handoff */}
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="col-span-full">
              <fieldset className="mt-2">
                <legend className="text-sm font-medium">Handoff method *</legend>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="accent-[#abc8c1] cursor-pointer"
                      checked={formData.handoff === 'pickup'}
                      onChange={() => setFormData({ ...formData, handoff: 'pickup' })}
                    />
                    <span>Pickup at my location</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="accent-[#abc8c1] cursor-pointer"
                      checked={formData.handoff === 'dropoff'}
                      onChange={() => setFormData({ ...formData, handoff: 'dropoff' })}
                    />
                    <span>Drop-off at designated point</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="col-span-full">
              <label htmlFor="contact" className="block text-sm font-medium">How can we reach you? *</label>
              <select
                id="contact"
                name="contact"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
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

        {/* Step 3: Item details */}
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium">Category *</label>
              <select
                id="category"
                name="category"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
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
                placeholder="1"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium">Size *</label>
              <select
                id="size"
                name="size"
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
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
                className="mt-2 block w-full rounded-xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
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
                placeholder="Highlight what makes this item special for someone else."
                className="mt-2 block w-full rounded-2xl bg-[#f3f3f3] border border-[#d1d5db] px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#abc8c1]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Footer: Save & Cancel */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push(`/listings/${listingId}`)}
            disabled={isSubmitting}
            className="px-5 py-2 h-13 rounded-full inline-flex items-center bg-gray-200 hover:bg-gray-300 text-[#2b2b2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 h-13 rounded-full inline-flex items-center text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#abc8c1] hover:bg-[#8bb5aa]'
            }`}
          >
            <CheckIcon className="mr-2 size-5" aria-hidden="true" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </main>
  )
}