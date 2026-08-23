"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const { user, isLoading: isAuthLoading } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const syncedUserId = useRef<string | null>(null);

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

  useEffect(() => {
    if (!isHydrated || isAuthLoading || !user || syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    const syncWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");
        if (!response.ok) return;
        const remote = (await response.json()) as { villaIds?: string[] };
        const localIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const mergedIds = Array.from(
          new Set([
            ...(Array.isArray(localIds) ? localIds : []),
            ...(remote.villaIds || []),
          ])
        );
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ villaIds: mergedIds }),
        });
        setSavedIds(mergedIds);
      } catch {
        // Keep the local wishlist available if the remote sync is unavailable.
      }
    };

    syncWishlist();
  }, [isAuthLoading, isHydrated, user]);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const toggleWishlist = useCallback((id: string) => {
    const isCurrentlySaved = savedIds.includes(id);
    setSavedIds((prev) =>
      isCurrentlySaved ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (user) {
      fetch("/api/wishlist", {
        method: isCurrentlySaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isCurrentlySaved ? { villaId: id } : { villaIds: [id] }
        ),
      }).catch(() => undefined);
    }
  }, [savedIds, user]);

  const removeWishlist = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
    if (user) {
      fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ villaId: id }),
      }).catch(() => undefined);
    }
  }, [user]);

  const clearWishlist = useCallback(() => {
    const previousIds = savedIds;
    setSavedIds([]);
    if (user) {
      Promise.all(
        previousIds.map((villaId) =>
          fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ villaId }),
          })
        )
      ).catch(() => undefined);
    }
  }, [savedIds, user]);

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
