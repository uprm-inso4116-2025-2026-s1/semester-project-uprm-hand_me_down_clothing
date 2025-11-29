import { Piece } from "../types/piece";
import { PieceRepository } from "../../src/repositories/pieceRepository";

//splits query by words
function splitQuery(query: string): string[] {
  if (query.trim() === "") {
    return [];
  }
  return query.split(" ");
}

//Deals with Supabase promises.
async function resolveWord(
  map: Map<number, Promise<Piece[]>[]>,
  i: number
): Promise<Piece[]> {
  const promises = map.get(i) ?? [];
  if (promises.length === 0) return [];

  const groups = await Promise.all(promises);
  const flat = groups.flat();

  return Array.from(new Map(flat.map((p) => [p.id, p])).values());
}

//Will only keep the pieces that mutually match every word in query. (Intersect)
async function intersectPieces(
  map: Map<number, Array<Promise<Piece[]>>>,
  index: number
): Promise<Piece[]> {
  if (index === 0) {
    return await resolveWord(map, 0);
  }

  const prev = await intersectPieces(map, index - 1);
  const curr = await resolveWord(map, index);

  if (prev.length === 0) {
    return curr;
  }

  const currIds = new Set(curr.map((piece) => piece.id));
  return prev.filter((x) => currIds.has(x.id));
}

async function filteredPieces(splitQuery: string[]): Promise<Piece[]> {
  const pieceRepo = new PieceRepository();

  const pieces_per_word: Map<number, Array<Promise<Piece[]>>> = new Map();
  const final_pieces: Array<Promise<Piece[]>> = [];

  //Creates a map to access the matching pieces(values) for each word(key)
  splitQuery.forEach((query, index) => {
    const pieces: Array<Promise<Piece[]>> = [
      pieceRepo.filterPieces({ name: query }),
      pieceRepo.filterPieces({ category: query }),
      pieceRepo.filterPieces({ color: query }),
      pieceRepo.filterPieces({ brand: query }),
      pieceRepo.filterPieces({ gender: query }),
      pieceRepo.filterPieces({ size: query }),
      pieceRepo.filterPieces({ condition: query }),
    ];
    pieces_per_word.set(index, pieces);
  });

  //Fills the piece array w/ all pieces if the query is empty, otherwise, the array fills with the intersected Pieces.
  if (pieces_per_word.size === 0) {
    final_pieces.push(pieceRepo.getPieces());
  } else {
    final_pieces.push(
      intersectPieces(pieces_per_word, pieces_per_word.size - 1)
    );
  }

  const batches = await Promise.all(final_pieces);
  const allMatches: Piece[] = batches.flat();

  //De-dupes the pieces in the final array.
  const uniquePieces = Array.from(
    new Map(allMatches.map((p) => [p.id, p])).values()
  );

  return uniquePieces;
}

//main function
export async function fetchPieces(query: string | null): Promise<Piece[]> {
  const split_query = query ? splitQuery(query) : [];
  return filteredPieces(split_query);
}
