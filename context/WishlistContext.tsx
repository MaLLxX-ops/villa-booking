"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface WishlistContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  removeWishlist: (id: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "stayvilla_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
        }
      }
    } catch {
      // ignore JSON parse error
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // localStorage may be full or blocked
    }
  }, [savedIds, isHydrated]);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const toggleWishlist = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const removeWishlist = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setSavedIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        savedIds,
        isSaved,
        toggleWishlist,
        removeWishlist,
        clearWishlist,
        count: savedIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
