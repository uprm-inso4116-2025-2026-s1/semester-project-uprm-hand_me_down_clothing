'use client'

import React from "react";
import {Search as handleSearch, mountPieceElements} from "./search";
import ResultsPanel from "./search";
import { useSearchParams } from "next/navigation";

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

export default function Browsing(){
    const searchParams= useSearchParams();
    const query= searchParams.get("query");
    //Mounts the query once the page is opened
    React.useEffect(()=>{
        const form= document.querySelector('form') as HTMLFormElement | null;
        const fakeEvent= {preventDefault: ()=> {}, target: form?? document.createElement('form')} as unknown as React.FormEvent<HTMLFormElement>; 
        mountPieceElements(fakeEvent,query);
    }, [query]);

    return (
        <>
            <div className= "flex justify-center">
                <form onSubmit={(e)=> handleSearch(e,null)}>
                    <input
                        //onChange={(e)=> } use for Search Suggestions
                        name="Search_Bar"
                        type="text"
                        placeholder="Search for clothing..."
                        className="w-150 h-13 px-4 py-2 mt-6 bg-[#E5E7EF] rounded-full text-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]">
                    </input>
                </form>
            </div>
            <h2 className="text-3xl font-bold italic pl-15 ">Filter your search...</h2>
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
            <ResultsPanel className="mt-10 px-10" />
        </>
    );
}