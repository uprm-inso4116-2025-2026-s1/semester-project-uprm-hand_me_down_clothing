// This file implements a FavoritesProvider using React Context and hooks,
// following the Interface Segregation Principle (ISP) by splitting reader
// and mutator roles. The latter is part of a Lecture Topic Task.

// ISP: split into reader and mutator roles

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type FavoriteId = number;

type FavoritesContextValue = {
  favorites: FavoriteId[];
  isFavorite: (id: FavoriteId) => boolean;
  addFavorite: (id: FavoriteId) => void;
  removeFavorite: (id: FavoriteId) => void;
  toggleFavorite: (id: FavoriteId) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

// 🔹 ISP: reader-only interface
export type FavoritesReader = {
  favorites: FavoriteId[];
  isFavorite: (id: FavoriteId) => boolean;
};

// 🔹 ISP: writer-only interface
export type FavoritesMutator = {
  addFavorite: (id: FavoriteId) => void;
  removeFavorite: (id: FavoriteId) => void;
  toggleFavorite: (id: FavoriteId) => void;
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteId[]>([]);

  // Load from localStorage
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

  // Persist to localStorage
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

// 🔹 ISP: reader-only hook
export function useFavoritesReader(): FavoritesReader {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavoritesReader must be used within a FavoritesProvider");
  }
  const { favorites, isFavorite } = ctx;
  return { favorites, isFavorite };
}

// 🔹 ISP: writer-only hook
export function useFavoritesMutator(): FavoritesMutator {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavoritesMutator must be used within a FavoritesProvider");
  }
  const { addFavorite, removeFavorite, toggleFavorite } = ctx;
  return { addFavorite, removeFavorite, toggleFavorite };
}

// (Optional) legacy full hook if you still need it anywhere:
// export function useFavorites(): FavoritesContextValue { ... }
