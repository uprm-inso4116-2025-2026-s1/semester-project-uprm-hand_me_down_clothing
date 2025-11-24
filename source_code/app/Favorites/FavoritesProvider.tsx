"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export type FavoriteId = number;

// This file implements a FavoritesProvider using React Context and hooks,
// following the Interface Segregation Principle (ISP) by splitting reader
// and mutator roles. The latter is part of a Lecture Topic Task.

// ISP: split into reader and mutator roles

export type FavoritesReader = {
  favorites: FavoriteId[];
  isFavorite: (id: FavoriteId) => boolean;
};

export type FavoritesMutator = {
  addFavorite: (id: FavoriteId) => Promise<void>;
  removeFavorite: (id: FavoriteId) => Promise<void>;
  toggleFavorite: (id: FavoriteId) => Promise<void>;
};

// Internal “fat” service = reader + mutator
type FavoritesContextValue = FavoritesReader & FavoritesMutator;

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "hm_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteId[]>([]);

  // This is a placeholder while the the auth system's implementation is finished.
  const userId: string | null = null;

  // Backend interactions (currently placeholders)

  async function loadFavoritesFromBackend(): Promise<FavoriteId[]> {
    // TODO: Replace with api call
    //
    // const { data, error } = await supabase
    //   .from("favorites")
    //   .select("listing_id")
    //   .eq("user_id", userId);
    // if (error) throw error;
    // return data.map((row) => row.listing_id as FavoriteId);

    // Temporary implementation using local storage
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as FavoriteId[];
    } catch {
      return [];
    }
  }

  async function persistFavoriteAdd(id: FavoriteId): Promise<void> {
    // TODO: when auth is ready, call database to insert to favorites array

    // if (!userId) return;

    if (typeof window === "undefined") return;
    const merged = Array.from(new Set([...favorites, id]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  async function persistFavoriteRemove(id: FavoriteId): Promise<void> {
        // TODO: when auth is ready, call database to delete from favorites array

    if (typeof window === "undefined") return;
    const filtered = favorites.filter((f) => f !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }


  useEffect(() => {
  
    loadFavoritesFromBackend()
      .then((loaded) => setFavorites(loaded))
      .catch((err) => {
        console.error("Failed to load favorites", err);
        setFavorites([]);
      });
  }, []);

  // isFavorite functions as a reader method.

  function isFavorite(id: FavoriteId) {
    return favorites.includes(id);
  }

  // addFavorite, remove Favorite, and toggleFavorite are mutator methods.

  async function addFavorite(id: FavoriteId) {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    // temporary, missing call to backend
    await persistFavoriteAdd(id);
  }

  async function removeFavorite(id: FavoriteId) {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    await persistFavoriteRemove(id);
  }

  async function toggleFavorite(id: FavoriteId) {
    if (isFavorite(id)) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
  }

  const value: FavoritesContextValue = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}


function useFavoritesInternal(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error(
      "Favorites hooks must be used within a FavoritesProvider"
    );
  }
  return ctx;
}

// ISP: public narrow hooks

export function useFavoritesReader(): FavoritesReader {
  const { favorites, isFavorite } = useFavoritesInternal();
  return { favorites, isFavorite };
}

export function useFavoritesMutator(): FavoritesMutator {
  const { addFavorite, removeFavorite, toggleFavorite } = useFavoritesInternal();
  return { addFavorite, removeFavorite, toggleFavorite };
}

