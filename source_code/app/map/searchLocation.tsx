'use client';
import React, {useMemo, useState, useCallback} from 'react';
import { useMap } from 'react-leaflet';
import type { Marker as LeafletMarker, Map as LeafletMap } from 'leaflet';
import type { LocationRecord } from './data-cards';

type Props={
    locations: LocationRecord[];
    markersRef: React.MutableRefObject<Map<number,LeafletMarker>>;
};

export default function SearchLocation({locations, markersRef} : Props){
    const map: LeafletMap= useMap();
    const [query, setQuery]= useState("");
    const [open, setOpen]= useState(false);

    const matches= useMemo(()=>{
        const q = query.trim();
        if(!q) return[];
        const lower= q.toLowerCase();
        const filtered= locations.filter(
            (loc)=> loc.name && loc.name.toLowerCase().startsWith(lower)
        );
        return filtered.slice(0,4);   
    },[locations, query]);

    const shouldShowDropdown= open && query.trim().length >0 && matches.length>0;
    
    const handleChange= useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        const val= e.target.value;
        setQuery(val);
        setOpen(val.trim().length>0);
    },[]);

    const handleSelect= useCallback(
        (loc:LocationRecord)=>{
            if(loc.latitude != null && loc.longitude != null){
                map.setView([loc.latitude, loc.longitude], 16, {animate: true, duration:1});
                setTimeout(()=>{
                    const marker= markersRef.current.get(loc.id);
                    marker?.openPopup();
                }, 450);
            }
            setQuery(loc.name ?? "");
            setOpen(false);
        },
        [map,markersRef]
    );

    const handleBlurContainer= useCallback(()=>{
        setTimeout(()=> setOpen(false),100);
    }, []);

    const handleFocusInput= useCallback(()=>{
        setOpen(query.trim().length>0 && matches.length>0);
    }, [query, matches.length]);

    return(
        <div
        className='relative pointer-events-auto'
        onBlur= {handleBlurContainer}
        onFocus={handleFocusInput}
        >
            <input
            name="Search_Bar"
            type="text"
            placeholder='Search for location...'
            value={query}
            onChange={handleChange}
            className="w-[600px] h-[52px] px-4 py-2 mt-6 bg-[#E5E7EF] rounded-full text-[#333] placeholder-[#989A9D] hover:bg-[#eceaea] focus:outline-none focus:ring-2 focus:ring-[#D6B1B1]"
            aria-autocomplete="list"
            aria-expanded={shouldShowDropdown}
            aria-controls="location-suggestions"
            />
            {shouldShowDropdown&&(
                <ul
                    id="location-suggestions"
                    role="listbox"
                    className='absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl bg-white/90 backdrop-blur border border-[#E5E7EF] shadow-lg'
                >
                    {matches.map((loc)=>(
                        <li
                            key={loc.id}
                            role="option"
                            aria-selected={false}
                            tabIndex={0}
                            onMouseDown={(e)=> e.preventDefault()}
                            onClick={()=>handleSelect(loc)}
                            className='px-4 py-2 cursor-pointer hover:bg-[#F9F8F8]'
                            >
                                {loc.name}
                            </li>
                    ))}
                </ul>
            )}
        </div>
    )
}