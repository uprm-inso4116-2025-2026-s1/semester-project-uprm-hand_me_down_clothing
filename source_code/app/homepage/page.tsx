'use client'
import Link from 'next/link';
import ChatWidget from '../chatbot/ui';
import {DonatePiecePage as DonateWireframe } from '../listings/transactions';
import { supabase } from '../auth/supabaseClient';
import FilterableFeaturedItems from './filterableListing';
import {useRouter} from "next/navigation";
import {useEffect, useState} from 'react';
import { PieceRepository } from '@/src/repositories/pieceRepository';
import { Piece } from '../types/piece';

// Categories for 'Browse by category' section
const browse_categories = [
  { id: 1, name: "Streetwear", filter: "streetwear" },
  { id: 2, name: "Formal", filter: "formal" },
  { id: 3, name: "Athleisure", filter: "athleisure" },
  { id: 4, name: "Vintage", filter: "vintage" },
  { id: 5, name: "Kids", filter: "kids" },
];

// Items for 'Featured items' section
// const featured_items = [
//   {id: 1, name: "Nike Hoodie", size: "M", condition: "Used", category: "Hoodie", price: "Free"},
//   {id: 2, name: "Adidas Sneakers", size: "9", condition: "New", category: "Shoes", price: "$10"},
//   {id: 3, name: "Zara Dress", size: "S", condition: "New", category: "Dress", price: "Free"},
//   {id: 4, name: "Uniqlo", size: "L", condition: "Used", category: "Sweater", price: "$5"},
//   {id: 5, name: "Levi's Jeans", size: "32", condition: "Used", category: "Jeans", price: "Free"},
//   {id: 6, name: "Puma Jacket", size: "L", condition: "New", category: "Jacket", price: "$12"},
//   {id: 7, name: "H&M Top", size: "M", condition: "New", category: "Top", price: "Free"},
//   {id: 8, name: "Converse Shoes", size: "8", condition: "Used", category: "Shoes", price: "$8"},
// ];

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
  const router= useRouter();
  const [featuredItems, setFeaturedItems]= useState<Piece[]>([]);

  useEffect(()=>{
    async function getFeaturedItems() {
      const pieceRepo = new PieceRepository();
      const pieces = await pieceRepo.getPieces();

      const uniqueById = Array.from(
        new Map(pieces.map((p) => [p.id, p])).values()
      );

      setFeaturedItems(uniqueById.slice(1, 7));
    }

    getFeaturedItems();
  }, []);

  function open_browsing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form= e.target as HTMLFormElement;
    const input= form.elements.namedItem("Search_Bar") as HTMLInputElement;
    const query= input.value.trim();
    router.push(`../browsing?query=${encodeURIComponent(query)}`);
  }

  if (featuredItems.length <= 0) {
    return (
        <div className="flex items-center justify-center w-full h-64">
          <div className="flex flex-col items-center justify-center bg-[#F9F8F8] rounded-3xl border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
            <p className="text-2xl font-semibold italic text-[#666666]">
              Loading Store...
            </p>
            <p className="text-md text-[#9A9A9A] mt-2">
            </p>
          </div>
        </div>
    )
  } 

  return (
    <div className="p-3">

      {/* Hero Section */}
      <div className="w-full max-w-340 p-5 pl-10 mx-auto p-6 bg-[#f5f6f3] rounded-xl">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
      
          <div className="flex flex-col pt-3 flex-1">
            <h1 className="italic text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Give clothes a second life
            </h1>
            <p className="text-lg sm:text-xl text-[#666666]">
              Discover, donate, and share styles with your community — sustainably and affordably.
            </p>

            <div className="flex flex-wrap gap-3 pt-5 text-[#666666] font-bold italic">
              <Link href="../browsing">
                <button className="px-4 py-2 bg-[#e6dac7] hover:bg-[#d8c8b4] rounded-full">
                  Start Browsing
                </button>
              </Link>

              <Link href="../listings/donate_piece">
                <button className="px-4 py-2 bg-[#f9f8f8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 rounded-full">
                  Donate Item
                </button>
              </Link>

              <Link href="../listings/sell_piece">
                <button className="px-4 py-2 bg-[#f9f8f8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 rounded-full">
                  Sell Item
                </button>
              </Link>
            </div>

            <form onSubmit={open_browsing}>
              <input
                name="Search_Bar"
                type="text"
                placeholder="Search for clothing..."
                className="w-full sm:w-96 px-4 py-3 mt-6 bg-[#E5E7EF] rounded-full text-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]"
              />
            </form>
          </div>

          <img 
            src="https://packstar.mx/wp-content/uploads/2024/04/como-el-empaque-afecta-la-imagen-de-tu-marca-3.jpg"
            alt="Hero image"
            className="w-full lg:max-w-120 h-full max-h-100 xl:h-90 mt-6 lg:mt-0 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Browse by Category */}
      <h2 className="text-3xl font-bold italic pt-10 text-center lg:text-left lg:pl-8">Browse by category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4 pt-4">
        {browse_categories.map((cat) => (
          <button 
            key={cat.id} 
            className="w-full bg-[#F9F8F8] hover:bg-[#eceaea] border-[#E5E7EF] border-2 p-4 rounded-xl text-left"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-full w-7 h-7 bg-[#D6B1B1]"></div>
              <h3 className="text-lg font-bold italic">{cat.name}</h3>
            </div>
            <p className="text-sm text-[#666666] pl-9">Explore {cat.filter} →</p>
          </button>
        ))}
      </div>

      <FilterableFeaturedItems initialItems={featuredItems}/>

      {/* How it works: explanation of the platform process */}
     <h2 className="text-3xl font-bold italic pl-15 pt-10">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-15 py-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-[#F9F8F8] border-2 border-[#E5E7EF] rounded-2xl p-4"
          >
            <h3 className="text-xl font-bold italic mb-2">{step.step}</h3>
            <p className="text-sm text-[#666666]">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-3 gap-6 bg-[#e6dac7] rounded-3xl p-6 my-12 max-w-6xl mx-auto text-center">
        <div>
          <h2 className="text-4xl font-bold italic">12,4080</h2>
          <p className="text-sm text-[#666666]">Items re-homed</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold italic">18,200 lbs</h2>
          <p className="text-sm text-[#666666]">Textiles diverted</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold italic">3,150</h2>
          <p className="text-sm text-[#666666]">Active donors</p>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-3xl font-bold italic pt-2 text-center lg:text-left lg:pl-8">What our community says</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pt-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[#F9F8F8] border-[#E5E7EF] border-2 p-4 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 bg-[#D6B1B1]"></div>
              <h3 className="text-lg font-bold italic">{comment.username}</h3>
            </div>
            <p className="text-sm text-[#666666] pl-11">{comment.comment}</p>
          </div>
        ))}
      </div>

      <ChatWidget />
    </div>
  );
}