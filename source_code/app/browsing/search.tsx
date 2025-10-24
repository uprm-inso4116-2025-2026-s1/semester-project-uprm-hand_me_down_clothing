'use client'
import React from "react";
import { createRoot } from 'react-dom/client';
import {Piece} from "../types/piece";
import {PieceRepository} from "../../src/repositories/pieceRepository";


type Props = {
  id?: string;
  className?: string;
};
//Used to avoid the "any" type error message in the element mount.
type MountableDiv= HTMLDivElement & {_root?: ReturnType<typeof createRoot>};

//Displays found pieces
export default function ResultsPanel({ id = 'search-results', className }: Props) {
  return <div id={id} className={className ?? ''} />;
}

//splits query by words
function splitQuery(query : string) : string[]{
    if(query.trim() === ""){
        return []
    }
    return query.split(' ');
}

//Deals with Supabase promises.
async function resolveWord(map: Map<number, Promise<Piece[]>[]>, i:number) : Promise<Piece[]>{
    const promises= map.get(i) ?? [];
    if(promises.length === 0) return[];
    const groups= await Promise.all(promises);
    const flat= groups.flat();
    //De-dupes words. 
    return Array.from(new Map(flat.map(p=>[p.id,p])).values());
}

//Will only keep the pieces that mutually match every word in query. (Intersect)
async function intersectPieces(map : Map<number, Array<Promise<Piece[]>>>, index: number) : Promise<Piece[]>{
    if(index===0){
        return await resolveWord(map,0);
    }
    const prev= await intersectPieces(map, index-1);
    const curr= await resolveWord(map, index);
    if(prev.length===0){
        return curr;
    }
    const currIds= new Set(curr.map(piece=>piece.id));
    return prev.filter(x=> currIds.has(x.id));
}

async function filteredPieces(splitQuery : string[]){  
    const pieceRepo= new PieceRepository()

    const pieces_per_word: Map<number, Array<Promise<Piece[]>>> = new Map();
    const final_pieces: Array<Promise<Piece[]>>= [];
    //Creates a map to access the matching pieces(values) for each word(key)
    splitQuery.forEach((query, index)=>{
        const pieces: Array<Promise<Piece[]>> = [
            pieceRepo.filterPieces({ name: query }),
            pieceRepo.filterPieces({ category: query }),
            pieceRepo.filterPieces({ color: query }),
            pieceRepo.filterPieces({ brand: query }),
            pieceRepo.filterPieces({ gender: query }),
            pieceRepo.filterPieces({ size: query }),
            pieceRepo.filterPieces({ condition: query }),
        ];
        pieces_per_word.set(index,pieces);
    });
    //Fills the piece array w/ all pieces if the query is empty, otherwise, the array fills with the intersected Pieces.
    if(pieces_per_word.size===0){
        final_pieces.push(pieceRepo.getPieces());
    }else{
        final_pieces.push(intersectPieces(pieces_per_word, pieces_per_word.size-1));
    }
    
    //Fetches the batch of final pieces from the Supabase
    const batches= await Promise.all(final_pieces);
    const allMatches: Piece[] = batches.flat();

    //De-dupes the pieces in the final array.
    const uniquePieces = Array.from(
        new Map(allMatches.map(p => [p.id, p])).values()
    );
    //Creates the elements for evey piece in uniquePieces.
    const elements= uniquePieces.map((piece)=> (
        <button
            key={piece.id}
            id="Featured_Item_btn"
            className="flex flex-col text-left indent-4 w-78 h-94 hover:bg-[#F9F8F8] border-2 border-[#E5E7EF] m-auto rounded-3xl">
            <div className="w-full h-50 text-center indent-0 bg-[#aac7c0] p-3 flex space-x-2 rounded-3xl">
              <div className="w-18 h-6 bg-[#f6e5e6] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">{piece.getFormattedCondition()}</div>
              <div className="w-18 h-6 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-sm text-[#666666] rounded-xl">{piece.getFormattedPrice()}</div>
              <div className="w-8 h-8 bg-[#F9F8F8] border-2 border-[#E5E7EF] text-xl text-[#f495ba] ml-23 rounded-full">♥</div>
            </div>
            <p className="text-lg font-bold italic pt-2">{piece.name}</p>
            <p className="text-md text-[#666666]">Size: {piece.getFormattedSize()}</p>
            <p className="text-md text-[#666666]">Condition: {piece.getFormattedCondition()}</p>
            <p className="text-md text-[#666666]">Category: {piece.getFormattedCategory()}</p>
          </button>
    ))
    return   <div className="flex flex-wrap justify-center gap-6">
                {elements}
            </div>

}
//Mounts the pieces to be displayed so Results Panel can render them.
export async function mountPieceElements(e : React.FormEvent<HTMLFormElement>,query :string | null){
    e.preventDefault();
    const form= e.target as HTMLFormElement;
    let input :HTMLInputElement;
    let in_value :string;
    if(query===null){
        input= form.elements.namedItem('Search_Bar') as HTMLInputElement;
        in_value= input.value
    }else{
        in_value= query
    }
    const split_query : string[]= splitQuery(in_value);
    
    const elements= await filteredPieces(split_query);

    let mount= document.getElementById('search-results') as MountableDiv | null;
    if(!mount){
        mount=document.createElement('div') as MountableDiv;
        mount.id = 'search-results';
        form.parentElement?.appendChild(mount);
    }
    if(!mount._root){
        mount._root= createRoot(mount);
    }
    mount._root.render(
        <div className= "mt-10 px-10 flex flex-col gap-6">
            {elements}
        </div>
    );
}

//main function
export async function Search(e : React.FormEvent<HTMLFormElement>, query :string | null){
    e.preventDefault();
    mountPieceElements(e, query);
    
}

