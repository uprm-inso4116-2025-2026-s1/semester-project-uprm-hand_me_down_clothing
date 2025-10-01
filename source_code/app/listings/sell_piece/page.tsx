import {
  CheckIcon,
  LinkIcon,
} from '@heroicons/react/20/solid'

export default function SellPiece() {
  return (
    <main className="flex flex-col gap-20 p-8 sm:p-20 text-white">
      <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Sell your Clothing!
        </h1>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">

        {/* TODO: add functionality for previewing */}
        <span className="ml-3 sm:block pr-3 sm:pr-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"
          >
            <LinkIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-white" />
            View
          </button>
        </span>

        {/* TODO: Data integration issue #138 picks up here */}
        <span className="sm:ml-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <CheckIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
            Publish
          </button>
        </span>

      </div>
    </div>
      {/* Step 1 – Photos */}
      <section id="photos" className="w-full">
        <h2 className="text-2xl font-bold mb-4">Add Photos</h2>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-10">
          <div className="text-center">
            <p className="mb-2 text-gray-300">Add Photos (min 1, max 8)</p>
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
            <p className="pl-1 text-gray-400">or drag and drop</p>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <div className="ml-6 pt-3 text-gray-400 text-sm">
          <h3>
            Tips:
          </h3>
          <ul className="ml-3 mt-1 list-disc list-inside">
            <li>Use natural lighting or a bright room.</li>
            <li>Photograph the item from multiple angles.</li>
            <li>Keep the background clean and uncluttered.</li>
            <li>Show close-ups of important details or flaws.</li>
          </ul>
        </div>
      </section>

      {/* Step 2 – Item Details */}
      <section id="details" className="w-full">
        <h2 className="text-2xl font-bold mb-4">Item Details</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-medium">Item Name *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Nike Hoodie - Lavender"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium">Category *</label>
            <select
              id="category"
              name="category"
              defaultValue=""
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
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
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
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
              min="1"
              placeholder="e.g. 1"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium">Price ($) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              placeholder="e.g. 25"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="deliveryFee" className="block text-sm font-medium">Delivery Fee (optional)</label>
            <input
              id="deliveryFee"
              name="deliveryFee"
              type="number"
              min="0"
              placeholder="e.g. 5"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="description" className="block text-sm font-medium">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Include material, style, and any flaws"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="size" className="block text-sm font-medium">Size *</label>
            <select
              id="size"
              name="size"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
              defaultValue="Large"
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
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
              defaultValue="Unisex"
            >
              <option value="" disabled>Select sex</option>
              <option>Male</option>
              <option>Female</option>
              <option>Unisex</option>
            </select>
          </div>
        </div>
      </section>

      {/* Step 3 – Location & Delivery */}
      <section id="location" className="w-full">
        <h2 className="text-2xl font-bold mb-4">Location & Delivery</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="city" className="block text-sm font-medium">City *</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="e.g. Mayagüez"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="neighborhood" className="block text-sm font-medium">Neighborhood (optional)</label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              placeholder="e.g. Terrace"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            />
          </div>
          <div className="col-span-full">
            <fieldset className="mt-2">
              <legend className="text-sm font-medium">Delivery Method *</legend>
              <div className="mt-4 space-y-4">
                <div>
                  <input id="pickup" name="delivery" type="radio" className="mr-2" />
                  <label htmlFor="pickup">Local Pickup only</label>
                </div>
                <div>
                  <input id="delivery" name="delivery" type="radio" className="mr-2" />
                  <label htmlFor="delivery">Delivery available</label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="col-span-full">
            <label htmlFor="contact" className="block text-sm font-medium">Contact Method *</label>
            <select
              id="contact"
              name="contact"
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline  outline-gray-500 focus:outline-2 focus:outline-indigo-500"
            >
              <option>In-app messages</option>
              <option>Phone</option>
              <option>Email</option>
            </select>
          </div>
        </div>
      </section>
    </main>
  );
}
