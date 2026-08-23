"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Coins } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) ||
    SUPPORTED_CURRENCIES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-sand/80 text-charcoal font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        aria-label="Select Currency"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{activeConfig.flag}</span>
        <span className="font-extrabold uppercase tracking-wide text-navy">
          {activeConfig.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone transition-transform duration-200 ${
            isOpen ? "rotate-180 text-terracotta" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-1.5 shadow-xl border border-sand z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-sand/50 mb-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-stone uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5 text-terracotta" />
                <span>Mata Uang / Currency</span>
              </div>
            </div>

            <div className="space-y-0.5 max-h-64 overflow-y-auto scrollbar-none">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isActive = curr.code === currency;
                return (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs sm:text-sm ${
                      isActive
                        ? "bg-terracotta/10 text-terracotta-dark font-black"
                        : "hover:bg-cream text-charcoal font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{curr.flag}</span>
                      <div>
                        <span className="font-bold">{curr.code}</span>
                        <span className="text-[11px] text-stone block font-medium">
                          {curr.label} ({curr.symbol})
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-terracotta shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
