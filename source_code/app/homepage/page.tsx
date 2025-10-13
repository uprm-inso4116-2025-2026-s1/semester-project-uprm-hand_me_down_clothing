import Link from 'next/link';
import DonateWireframe from '../listings/donate_piece/page';

// Categories for 'Browse by category' section
const browse_categories = [
  { id: 1, name: "Streetwear", filter: "streetwear" },
  { id: 2, name: "Formal", filter: "formal" },
  { id: 3, name: "Athleisure", filter: "athleisure" },
  { id: 4, name: "Vintage", filter: "vintage" },
  { id: 5, name: "Kids", filter: "kids" },
];

// Categories for 'Featured items' section
const featured_categories = [
  { id: 1, name: "Tops", filter: "tops" },
  { id: 2, name: "Bottoms", filter: "bottoms" },
  { id: 3, name: "Dresses", filter: "dresses" },
  { id: 4, name: "Shoes", filter: "shoes" },
  { id: 5, name: "Outerwear", filter: "outerwear" },
  { id: 6, name: "Accessories", filter: "accessories" },
  { id: 7, name: "Kids", filter: "kids" },
  { id: 8, name: "Unisex", filter: "unisex" },
];

// Items for 'Featured items' section
const featured_items = [
  {id: 1, name: "Nike Hoodie", size: "M", condition: "Used", category: "Hoodie", price: "Free"},
  {id: 2, name: "Adidas Sneakers", size: "9", condition: "New", category: "Shoes", price: "$10"},
  {id: 3, name: "Zara Dress", size: "S", condition: "New", category: "Dress", price: "Free"},
  {id: 4, name: "Uniqlo", size: "L", condition: "Used", category: "Sweater", price: "$5"},
  {id: 5, name: "Levi's Jeans", size: "32", condition: "Used", category: "Jeans", price: "Free"},
  {id: 6, name: "Puma Jacket", size: "L", condition: "New", category: "Jacket", price: "$12"},
  {id: 7, name: "H&M Top", size: "M", condition: "New", category: "Top", price: "Free"},
  {id: 8, name: "Converse Shoes", size: "8", condition: "Used", category: "Shoes", price: "$8"},
];

// Comments for 'Community' section
const comments = [
  {id: 1, username: "Dani", comment: "I swapped 3 items and saved $$$. Love the vibe!"},
  {id: 2, username: "Luis", comment: "Easy pickup in my neighborhood. Super convenient."},
  {id: 3, username: "Ana", comment: "Great for kids clothes that they outgrow fast."},
];

// Steps for 'How it works' section
const steps = [
  { id: 1, step: "List or request items", description: "Post what you have or need" },
  { id: 2, step: "Match & message", description: "We'll notify you instantly" },
  { id: 3, step: "Meet up or ship sustainably", description: "Pick the eco-friendly option" },
];

export default function Homepage() {
  return (
    <div className="p-3">

      {/* Hero section: intro message, tagline, and hero image */}
      <div className="w-340 h-100 p-5 pl-10 mx-auto bg-[#f5f6f3] rounded-xl">
        <div className="flex space-x-4">
          <div className="flex flex-col pt-3">
            <h1 className="italic text-6xl font-bold mb-4">Give clothes a second life</h1>
            <p className="text-xl text-[#666666]">
              Discover, donate, and share styles with your community — sustainably and affordably.
            </p>
            <div className="flex space-x-4 pt-5 text-[#666666] font-bold italic">
              <button id="Start_Browsing_btn" className="px-4 py-2 w-55 h-13 bg-[#e6dac7] hover:bg-[#d8c8b4] rounded-full">
                Start Browsing
              </button>
              <Link href="../listings/donate_piece">
                <button id="Donate_Item_btn" className="px-4 py-2 w-55 h-13 bg-[#f9f8f8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 rounded-full">
                  Donate Item
                </button>
              </Link>
              <Link href="../listings/sell_piece">
                <button id="Donate_Item_btn" className="px-4 py-2 w-55 h-13 bg-[#f9f8f8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 rounded-full">
                  Sell Item
                </button>
              </Link>
            </div>
            <input
              id="Search_Bar"
              type="text"
              placeholder="Search for clothing..."
              className="w-150 h-13 px-4 py-2 mt-6 bg-[#E5E7EF] rounded-full text-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]">
            </input>
          </div>
          <img 
            src={"https://packstar.mx/wp-content/uploads/2024/04/como-el-empaque-afecta-la-imagen-de-tu-marca-3.jpg"}
            alt="Person putting folded clothes into a box"
            className="w-120 h-90 rounded-xl bg-[#aac7c0] ml-5 object-cover">
          </img>
        </div>
      </div>

      {/* Browse by category: Links to explore different clothing categories */}
      <h2 className="text-3xl font-bold italic pl-15 pt-15">Browse by category</h2>
      <div className="flex space-x-auto px-13 pt-4">
        {browse_categories.map((cat) => (
          <button 
            key={cat.id} 
            id="Browse_Category_btn" 
            className="w-55 h-40 bg-[#F9F8F8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 px-4 m-auto rounded-xl">
            <div className="flex space-x-2 py-3">
              <div className="rounded-full w-7 h-7 bg-[#D6B1B1]"></div>
              <h3 className="text-lg font-bold italic">{cat.name}</h3>
            </div>
            <p className="text-sm text-[#666666] text-left pl-9">Explore {cat.filter} →</p>
          </button>
        ))}
      </div>

      {/* Featured items: displays highlighted clothing listings */}
      <h2 className="text-3xl font-bold italic pl-15 pt-13">Featured items</h2>
      <div className="flex space-x-auto px-13 pt-4 pl-18 pr-18">
        {featured_categories.map((cat) => (
          <button
            key={cat.id}
            id="Featured_Category_btn"
            className="w-39 h-11 bg-[#e6dac7] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2] px-4 m-auto rounded-full">
            <div className="text-md text-[#666666]">{cat.name}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1 px-15 py-4">
        {featured_items.map((cat) => (
          <button
            key={cat.id}
            id="Featured_Item_btn"
            className="flex flex-col text-left indent-4 w-78 h-94 hover:bg-[#F9F8F8] border-2 border-[#E5E7EF] m-auto rounded-3xl">
            <div className="w-full h-50 text-center indent-0 bg-[#aac7c0] p-3 flex space-x-2 rounded-3xl">
              <div className="w-18 h-6 bg-[#f6e5e6] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">{cat.condition}</div>
              <div className="w-18 h-6 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">{cat.price}</div>
              <div className="w-8 h-8 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-xl text-[#f495ba] ml-23 rounded-full">♥</div>
            </div>
            <p className="text-lg font-bold italic pt-2">{cat.name}</p>
            <p className="text-md text-[#666666]">Size: {cat.size}</p>
            <p className="text-md text-[#666666]">Condition: {cat.condition}</p>
            <p className="text-md text-[#666666]">Category: {cat.category}</p>
          </button>
        ))}
      </div>

      {/* How it works: explanation of the platform process */}
      <h2 className="text-3xl font-bold italic pl-15 pt-10">How it works</h2>
      <div className="flex space-x-auto px-12 pt-4">
        {steps.map((cat) => (
          <div
            key={cat.id}  
            className="w-100 h-35 bg-[#F9F8F8] border-[#E5E7EF] border-2 p-4 m-auto rounded-xl">
            <div className="flex space-x-2 py-3">
              <div className="rounded-full py-2 mx-3 w-8 h-8 bg-[#D6B1B1] text-center text-sm font-bold italic text-[#ffffff]">{cat.id}</div>
              <h3 className="text-lg font-bold italic indent-2">{cat.step}</h3>
            </div>
            <p className="text-sm text-[#666666] text-left indent-3 pl-9">{cat.description}</p>
          </div>
        ))}
      </div>

      {/* Impact statistics: summary metrics showing sustainability impact */}
      <div className="flex rounded-3xl w-340 h-40 bg-[#e6dac7] mx-auto my-15">
        <div className="flex flex-col space-y-4 mx-auto justify-center text-center">
          <h2 className="text-4xl font-bold italic">12,4080</h2>
          <p className="text-sm text-[#666666]">Items re-homed</p>
        </div>
        <div className="flex flex-col space-y-4 mx-auto justify-center text-center">
          <h2 className="text-4xl font-bold italic">18,200 lbs</h2>
          <p className="text-sm text-[#666666]">Textiles diverted</p>
        </div>
        <div className="flex flex-col space-y-4 mx-auto justify-center text-center">
          <h2 className="text-4xl font-bold italic">3,150</h2>
          <p className="text-sm text-[#666666]">Active donors</p>
        </div>
      </div>
      
      {/* What our community says: quotes and feedback from platform users */}
      <h2 className="text-3xl font-bold italic pl-15 pt-2">What our community says</h2>
      <div className="flex space-x-auto px-18 pt-6">
        {comments.map((comment) => (
          <div
            key={comment.id}  
            className="w-110 h-35 bg-[#F9F8F8] border-[#E5E7EF] border-2 p-4 m-auto rounded-xl">
            <div className="flex space-x-2 py-3">
              <div className="rounded-full py-2 mx-3 w-8 h-8 bg-[#D6B1B1] text-center text-sm font-bold italic text-[#ffffff]"></div>
              <h3 className="text-lg font-bold italic indent-2">{comment.username}</h3>
            </div>
            <p className="text-sm text-[#666666] text-left indent-3 pl-9">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
