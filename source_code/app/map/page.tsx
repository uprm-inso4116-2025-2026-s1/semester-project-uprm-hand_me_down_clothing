import Logo from "./Logo.png";

export default function Map() {

  const isSignedIn= false;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top notice bar */}
      <div className="bg-pink-100 text-gray-700 text-center text-sm py-1">
        Free local pickups all week ✨ | Join our community swap on Saturday
      </div>

      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        {/* Left side (logo + name) */}
        <div className="flex items-center">
        <img src={Logo.src} alt="Hand Me Down Logo" className="h-26 w-auto" />


          
        </div>

        {/* Right side (nav + heart + profile) */}
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">Browse</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Map</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Donate</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">My Account</a>
          </nav>
          <button className="text-gray-700 text-xl">❤️</button>

          {isSignedIn ? (
            <img
              src="https://via.placeholder.com/35"
              alt="User"
              className="rounded-full w-9 h-9"
            />
          ) : (
            <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded hover:bg-pink-200">
              Sign In
            </button>
          )}

        </div>

      </header>

      {/* Map container */}
      <main className="flex-grow">
        <div
          className="map-container"
          style={{
            height: "600px",
            width: "100%",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* Placeholder for map */}
        </div>
      </main>

      {/* Newsletter section */}
      <footer className="bg-gray-50 py-12">
        {/* Long rounded banner */}
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow">
          {/* Text */}
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-gray-800 text-lg">
              Get drops & community events
            </h2>
            <p className="text-gray-500 text-sm">
              Subscribe to our newsletter for new arrivals and swap days.
            </p>
          </div>

          {/* Email + button */}
          <div className="flex items-center">
            <input
              type="email"
              placeholder="email@domain.com"
              className="p-3 rounded-l-full border border-gray-300 w-64 focus:outline-none focus:ring-1 focus:ring-pink-300"
            />
            <button className="bg-[#b8a9a4] text-white font-medium px-6 py-3 rounded-r-full hover:bg-[#a89791]">
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright below */}
        <p className="text-gray-400 text-xs text-center mt-6">
          © 2025 Hand-Me-Down-Clothing
        </p>
      </footer>
    </div>
  );
}
