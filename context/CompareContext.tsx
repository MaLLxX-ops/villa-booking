"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface CompareContextType {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  count: number;
  maxAllowed: number;
  isMaxReached: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "stayvilla_compare";
const MAX_ALLOWED = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed.slice(0, MAX_ALLOWED));
        }
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // ignore
    }
  }, [selectedIds, isHydrated]);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const toggleCompare = useCallback(
    (id: string): boolean => {
      if (selectedIds.includes(id)) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        return true;
      }
      if (selectedIds.length >= MAX_ALLOWED) {
        return false; // Max reached
      }
      setSelectedIds((prev) => [...prev, id]);
      return true;
    },
    [selectedIds]
  );

  const removeCompare = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        isSelected,
        toggleCompare,
        removeCompare,
        clearCompare,
        count: selectedIds.length,
        maxAllowed: MAX_ALLOWED,
        isMaxReached: selectedIds.length >= MAX_ALLOWED,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
