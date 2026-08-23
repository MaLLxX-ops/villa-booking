"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, AlertCircle } from "lucide-react";
import {
  getTodayString,
  getTomorrowString,
} from "@/lib/date-utils";

interface DateRangeInputsProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  checkInError?: string;
  checkOutError?: string;
  layout?: "grid" | "stack";
  variant?: "hero" | "card";
}

export default function DateRangeInputs({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  checkInError,
  checkOutError,
  layout = "grid",
  variant = "hero",
}: DateRangeInputsProps) {
  const tValidation = useTranslations("Validation");
  const todayStr = getTodayString();
  const minCheckOutStr = checkIn ? getTomorrowString(checkIn) : getTomorrowString();

  const handleCheckInChange = (newVal: string) => {
    onCheckInChange(newVal);

    // If new check-in makes current check-out invalid, reset check-out
    if (checkOut && newVal && checkOut <= newVal) {
      onCheckOutChange("");
    }
  };

  const handleCheckOutChange = (newVal: string) => {
    onCheckOutChange(newVal);
  };

  const isStack = layout === "stack";

  return (
    <div
      className={
        isStack
          ? "space-y-4"
          : "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      }
    >
      {/* Check-In Input */}
      <div className="relative">
        <label className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between">
          <span>{tValidation("checkInLabel")}</span>
          {checkIn && (
            <span className="text-[11px] text-sage-dark font-bold">
              ✓ {tValidation("validSelection")}
            </span>
          )}
        </label>
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
            checkInError
              ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
              : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
          }`}
        >
          <CalendarDays
            className={`w-4 h-4 shrink-0 ${
              checkInError ? "text-red-500" : "text-terracotta"
            }`}
          />
          <input
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none cursor-pointer"
            aria-invalid={Boolean(checkInError)}
          />
        </div>

        {/* Inline Error Message */}
        <AnimatePresence>
          {checkInError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 mt-1.5 text-xs font-bold text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{checkInError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Check-Out Input */}
      <div className="relative">
        <label className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between">
          <span>{tValidation("checkOutLabel")}</span>
          {checkOut && (
            <span className="text-[11px] text-sage-dark font-bold">
              ✓ {tValidation("validSelection")}
            </span>
          )}
        </label>
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
            checkOutError
              ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
              : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
          }`}
        >
          <CalendarDays
            className={`w-4 h-4 shrink-0 ${
              checkOutError ? "text-red-500" : "text-terracotta"
            }`}
          />
          <input
            type="date"
            min={minCheckOutStr}
            value={checkOut}
            onChange={(e) => handleCheckOutChange(e.target.value)}
            className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none cursor-pointer"
            aria-invalid={Boolean(checkOutError)}
          />
        </div>

        {/* Inline Error Message */}
        <AnimatePresence>
          {checkOutError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 mt-1.5 text-xs font-bold text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{checkOutError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
