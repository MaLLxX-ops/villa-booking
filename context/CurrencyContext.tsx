"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CurrencyCode,
  SUPPORTED_CURRENCIES,
  FALLBACK_RATES,
  formatCurrencyEstimate,
} from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: Record<string, number> | null;
  formatEstimate: (amountInIdr: number) => string | null;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const STORAGE_KEY = "stayvilla_currency_preference";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR");
  const [rates, setRates] = useState<Record<string, number> | null>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Restore saved currency preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (
        saved &&
        SUPPORTED_CURRENCIES.some((c) => c.code === saved)
      ) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage errors in private modes
    }
  }, []);

  // Fetch updated exchange rates from /api/currency
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/currency")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rates");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => {
        console.warn("Using fallback exchange rates:", err);
        if (isMounted) {
          setRates(FALLBACK_RATES);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(STORAGE_KEY, newCurrency);
    } catch {
      // Ignore
    }
  };

  const formatEstimate = (amountInIdr: number): string | null => {
    return formatCurrencyEstimate(amountInIdr, currency, rates);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        formatEstimate,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
