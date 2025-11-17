// lib/favoritesApi.ts

//Yamilette Alemany: the fields for the FavoriteItem are temp since I dont know the exact names used in the backend
export type FavoriteItem = {
  id: string;
  //make sure listings have ids for posting and deleting
  listingId: string;
  title: string;
  priceLabel: number;
  conditionLabel: string;
  tags: string[];
  imageUrl?: string | null;
};

export async function fetchFavorites(): Promise<FavoriteItem[]> {

//match api request to real one (using temp)
  const res = await fetch("/api/favorites", {

    //verify if its necessary to include credentials
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load favorites");
  }

  return res.json();
}

//Add a listing to favorites
export async function addFavorite(listingId: string): Promise<FavoriteItem> {

//match api request to real one (using temp)
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ listingId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add favorite");
  }

  return res.json();
}

//Remove listing from favorites
export async function removeFavorite(listingId: string): Promise<void> {

  //match api request to real one (using temp)
  const res = await fetch(`/api/favorites/${listingId}`, {
    method: "DELETE",
    //verify if its necessary to include credentials
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to remove favorite");
  }
}

