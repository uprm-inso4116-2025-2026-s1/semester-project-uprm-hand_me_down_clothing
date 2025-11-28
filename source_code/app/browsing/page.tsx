'use client'

import React, { useEffect, useState } from "react";
import {fetchPieces, SearchPieces as handleSearch, mountPieceElements} from "./search";
import ResultsPanel from "./search";
import { useSearchParams } from "next/navigation";
import DistanceFilterButton from "./distance_filter";
import { Piece } from "../types/piece";
import * as filterListings from '../utils/filters/listingsFilter'
import { frequently_searched_words } from "./frequent_words";

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

export default function Browsing() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [loading, setLoading] = useState(true);
    const [currentItems, setCurrentItems] = useState<Piece[]>([]);
    const [filteredItems, setFilteredItems] = useState<Piece[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [locationDenied, setLocationDenied] = useState(false);
    useEffect(() => {
        async function mount() {
            const items = await fetchPieces(query);
            setCurrentItems(items); // store to have a persistent user query when changing filters
            setFilteredItems(items); // store for filtering
            setLoading(false);
        }
        mount();
    }, [query]);


    function handleInputChange(value: string){
        setSearchInput(value);

        if(!value.trim()){
            setSuggestions([]);
            return;
        }
    //Finds the matches and sets the maximum of suggestions to 6
        const matches= frequently_searched_words.filter(word=>word.toLowerCase().includes(value.toLowerCase())).slice(0,6);

        setSuggestions(matches);
    }

    async function handleSuggestionClick(word:string){
        setSearchInput(word);
        setSuggestions([]);
        setLoading(true);
        const items= await fetchPieces(word);
        setCurrentItems(items);
        setFilteredItems(items);
        setLoading(false);
    }

    // Example filter function
    // handles the click and which filter to apply to the items
    const handleFilter = (filter: string) => {

        let result;

        switch (filter) {
            case 'tops':
            case 'bottoms':
            case 'dresses':
            case 'shoes':
            case 'outerwear':
            case 'accessories':
                result = filterListings.filterByCategory(currentItems, filter);
                break;
            case 'unisex':
                result = filterListings.filterByGender(currentItems, filter);
                break;
            case 'kids':
                result = filterListings.filterByAge(currentItems, filter);
                break;
            default:
                result = currentItems;
        }

        setFilteredItems(result);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-64">
                <div className="flex flex-col items-center justify-center bg-[#F9F8F8] rounded-3xl border-2 border-[#E5E7EF] shadow-sm px-10 py-12">
                    <p className="text-2xl font-semibold italic text-[#666666]">
                    Loading items...
                    </p>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="flex justify-center relative">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const input = (e.target as HTMLFormElement).elements.namedItem('Search_Bar') as HTMLInputElement;
                    setLoading(true);
                    const items = await fetchPieces(input.value);
                    setCurrentItems(items);
                    setFilteredItems(items);
                    setLoading(false);
                    setSuggestions([]);
                }}>
                <input
                    value={searchInput}
                    onChange={(e)=> handleInputChange(e.target.value)} //used for Search Suggestions
                    name="Search_Bar"
                    type="text"
                    placeholder="Search for clothing..."
                    className="w-150 h-13 px-4 py-2 mt-6 mb-6 bg-[#E5E7EF] rounded-full text-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]">
                </input>
                {suggestions.length > 0 && (
                    <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-150 max-h-48 overflow-y-auto z-10">
                    {suggestions.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(word)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            {word}
                            </button>
                            ))}
                    </div>
                )}
                </form>
                <DistanceFilterButton
                    query={query}
                    onNearbyResults={(pieces) => {
                        setCurrentItems(pieces);
                        setFilteredItems(pieces);
                    }}
                    onLocationDenied={() => setLocationDenied(true)}
                />
            </div>
            {/* Location denied or Location is off message*/}
            {locationDenied && (
                <div className="flex justify-center mb-4 px-4">
                <div className="w-full max-w-xl rounded-2xl border border-[#E5E7EF] bg-[#FFF4F4] px-4 py-3 text-sm text-[#7A2E2E]">
                    Location is turned off or permission was denied. Please enable
                    location access for this webpage to use the “Near Me” filter.
                </div>
                </div>
            )}
            <h2 className="text-3xl font-bold italic pl-15 ">Filter your search...</h2>
            <div className="flex space-x-auto mb-6 px-13 pt-4 pl-18 pr-18">
                {featured_categories.map((cat) => (
                <button
                    onClick={() => handleFilter(cat.filter)}
                    key={cat.id}
                    id="Featured_Category_btn"
                    className="w-39 h-11 bg-[#e6dac7] hover:bg-[#d8c8b4] focus:bg-[#c9b8a2] px-4 m-auto rounded-full">
                    <div className="text-md text-[#666666]">{cat.name}</div>
                </button>
                ))}
            </div>

            <ResultsPanel items={filteredItems}/>
        </>
    );
}