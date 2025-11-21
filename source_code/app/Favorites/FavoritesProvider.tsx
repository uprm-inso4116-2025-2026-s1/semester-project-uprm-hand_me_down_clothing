"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type FavoriteId = number;

type FavoritesContextValue = {
  favorites: FavoriteId[];
  isFavorite: (id: FavoriteId) => boolean;
  toggleFavorite: (id: FavoriteId) => void;
  addFavorite: (id: FavoriteId) => void;
  removeFavorite: (id: FavoriteId) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteId[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("hm_favorites");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FavoriteId[];
        setFavorites(parsed);
      } catch {
        // ignore bad JSON
      }
    }
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("hm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  function isFavorite(id: FavoriteId) {
    return favorites.includes(id);
  }

  function addFavorite(id: FavoriteId) {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeFavorite(id: FavoriteId) {
    setFavorites((prev) => prev.filter((x) => x !== id));
  }

  function toggleFavorite(id: FavoriteId) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const value: FavoritesContextValue = {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
