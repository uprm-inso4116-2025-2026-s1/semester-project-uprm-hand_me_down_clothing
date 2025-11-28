'use client';
import { useState } from 'react';
import * as filterListings from '../utils/filters/listingsFilter'
import { Category, Condition, Gender, Size } from "@/app/types/classifications";
import { Piece } from '../types/piece';
import { FavoriteHeartButton } from '../Favorites/FavoriteHeartButton';


const featured_categories = [
  {id: 0, name: "All", filter: "all"},
  { id: 1, name: "Tops", filter: "tops" },
  { id: 2, name: "Bottoms", filter: "bottoms" },
  { id: 3, name: "Dresses", filter: "dresses" },
  { id: 4, name: "Shoes", filter: "shoes" },
  { id: 5, name: "Outerwear", filter: "outerwear" },
  { id: 6, name: "Accessories", filter: "accessories" },
  { id: 7, name: "Kids", filter: "kids" },
  { id: 8, name: "Unisex", filter: "unisex" },
];

type Props = {
  initialItems: Piece[];
};

export default function FilterableFeaturedItems({initialItems}: any) {
    const [filtered, setFilter] = useState(initialItems);
 
    // handles the click and which filter to apply to the items
    const handleFilter = (filter: string) => {

        let result;

        switch (filter) {
            case 'all':
                result = initialItems;
                break;
            case 'tops':
            case 'bottoms':
            case 'dresses':
            case 'shoes':
            case 'outerwear':
            case 'accessories':
                result = filterListings.filterByCategory(initialItems, filter);
                break;
            case 'unisex':
                result = filterListings.filterByGender(initialItems, filter);
                break;
            case 'kids':
                result = filterListings.filterByAge(initialItems, filter);
                break;
            default:
                result = initialItems;
        }

        setFilter(result);
    }

    let content;
    if (filtered.length > 0) {
      content = (
        <div className="flex flex-wrap justify-center gap-6 m-4">
          {filtered.map((item: Piece) => (
            // changed from <button> to <div> so we don’t nest a button inside
            <div
              key={item.id}
              id="Featured_Item_btn"
              className="flex flex-col text-left indent-4 w-78 h-94 hover:bg-[#F9F8F8] border-2 border-[#E5E7EF] m-1 rounded-3xl"
            >
              <div className="w-full h-50 text-center indent-0 bg-[#aac7c0] p-3 flex space-x-2 rounded-3xl">
                <div className="w-18 h-6 bg-[#f6e5e6] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">
                  {Condition[item.condition]}
                </div>
                <div className="w-18 h-6 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">
                  {item.getFormattedPrice()}$
                </div>
                {/* right-aligned heart button using shared favorites logic */}
                <div className="ml-auto">
                  <FavoriteHeartButton listingId={item.id} />
                </div>
              </div>
              <p className="text-lg font-bold italic pt-2">{item.name}</p>
              <p className="text-md text-[#666666]">Size: {Size[item.size]}</p>
              <p className="text-md text-[#666666]">Condition: {Condition[item.condition]}</p>
              <p className="text-md text-[#666666]">Category: {Category[item.category]}</p>
            </div>
          ))}
        </div>
      );
    } else {
      content = (
        <div className="flex items-center justify-center w-full h-64">
          <div className="flex flex-col items-center justify-center bg-[#F9F8F8] rounded-3xl border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
            <p className="text-2xl font-semibold italic text-[#666666]">
              No items found 😔
            </p>
            <p className="text-md text-[#9A9A9A] mt-2">
              Try adjusting your filters or check back later.
            </p>
          </div>
        </div>
      );
    }

    return (
    <>
      {/* Featured items: displays highlighted clothing listings */}
      <h2 className="text-3xl font-bold text-center lg:text-left italic lg:pl-8 pt-13">Featured items</h2>

      <div className="flex flex-wrap justify-center pt-4 px-5">
        {featured_categories.map((cat) => (
          <button
            onClick={() => handleFilter(cat.filter)}
            key={cat.id}
            id="Featured_Category_btn"
            className="w-auto h-11 bg-[#e6dac7] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2] px-10 m-1 rounded-full"
          >
            <div className="text-md text-[#666666]">{cat.name}</div>
          </button>
        ))}
      </div>
      
      <div>{content}</div>
        
    </>
  );
}
