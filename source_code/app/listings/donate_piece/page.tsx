import React from "react";

export default function DonateWireframe() {
  return (
    <div className="donate-page max-w-3xl mx-auto p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Donate Item</h1>
        <p className="text-gray-600">
          Please provide the details of the item you wish to donate. Fields
          marked with <span className="text-lg font-semibold">*</span> are required.
        </p>
      </header>

      {/* Donation Form */}
      <form className="donate-form space-y-6">
        {/* Item Title */}
        <label className="block">
          <span className="text-lg font-semibold">Item Title *</span>
          <input
            type="text"
            placeholder="e.g., Yellow sundress"
            className="mt-1 block w-full border rounded-lg p-2"
            required
          />
        </label>

        {/* Photos */}
        <section>
          <h2 className="text-lg font-semibold">Upload Photos *</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            className="block w-full text-gray-700 border rounded-lg p-2"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            You can upload one or more photos of your item.
          </p>
        </section>

        {/* Category */}
        {/* If we have an official list of categories, I can't seem to find it... 
            This basic input field can be replaced with a different kind of menu like 
            an autocomplete dropdown menu if we ever have a set list of categories. */}
        <label className="block">
          <span className="text-lg font-semibold">Category *</span>
          <input
            type="text"
            placeholder="e.g., Outerwear, Formal, Winter"
            className="mt-1 block w-full border rounded-lg p-2"
            required
          />
        </label>

        {/* Condition */}
        <label className="block">
          <span className="text-lg font-semibold">Condition *</span>
          <select
            className="mt-1 block w-full border rounded-lg p-2"
            required
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </label>

        {/* Quantity */}
        <label className="block">
          <span className="text-lg font-semibold">Quantity *</span>
          <input
            type="number"
            min="1"
            defaultValue="1"
            className="mt-1 block w-full border rounded-lg p-2"
            required
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-lg font-semibold">Description</span>
          <textarea
            placeholder="Add any details about your item."
            className="mt-1 block w-full border rounded-lg p-2"
          />
        </label>

        {/* Tags */}
        {/* Same thing as the categories; this can be replaced if we ever get an official
            list of tags by something like a dropdown. */}
        <section>
            <label className="block">
            <span className="text-lg font-semibold">Tags</span>
            <input
                type="text"
                placeholder="e.g., winter, casual, cotton"
                className="mt-1 block w-full border rounded-lg p-2"
            />
            </label>
            <p className="text-sm text-gray-500 mt-1">
                Tags must be comma separated.
            </p>
        </section>

        {/* Handoff Method */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Handoff Method *</h2>

          {/* Pickup Option */}
          <div className="border rounded-lg p-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="handoff" value="pickup" required />
              <span className="font-medium">Pickup at my location</span>
            </label>
            <label className="block">
              <span className="text-gray-700">Location *</span>
              <input
                type="text"
                placeholder="Enter your address"
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Neighborhood</span>
              <input
                type="text"
                placeholder="Enter your neighborhood"
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">
                Preferred Days/Times
              </span>
              <input
                type="text"
                placeholder="e.g., Weekdays after 6 PM"
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>
          </div>

          {/* Drop-off Option */}
          <div className="border rounded-lg p-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="handoff" value="dropoff" required />
              <span className="font-medium">Drop-off at designated point</span>
            </label>
            <label className="block">
              <span className="text-gray-700">Location *</span>
              <input
                type="text"
                placeholder="Enter drop-off location"
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">
                Preferred Days/Times
              </span>
              <input
                type="text"
                placeholder="e.g., Saturday mornings"
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </label>
          </div>
        </section>

        {/* Contact Method */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Contact Method *</h2>
          <select className="block w-full border rounded-lg p-2" required>
            <option value="">Select contact method</option>
            <option value="in-app">In-app messages</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
        </section>

        {/* Submit */}
        <section>
          <button
            type="submit"
            className="block w-full border rounded-lg p-2"
          >
            Submit Donation
          </button>
        </section>
      </form>

    </div>
  );
}
