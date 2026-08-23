"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, AlertCircle } from "lucide-react";
import {
  getTodayString,
  getTomorrowString,
  isDateBeforeToday,
  isCheckOutValid,
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
}: DateRangeInputsProps) {
  const tValidation = useTranslations("Validation");

  const [todayStr, setTodayStr] = useState(getTodayString());
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  // Sync today's date on mount to prevent any SSR/client timezone mismatch
  useEffect(() => {
    setTodayStr(getTodayString());
  }, []);

  const minCheckOutStr = checkIn
    ? getTomorrowString(checkIn)
    : getTomorrowString(todayStr);

  const handleCheckInChange = (newVal: string) => {
    // If entered date is in the past, reject and do not allow
    if (newVal && isDateBeforeToday(newVal)) {
      onCheckInChange("");
      return;
    }

    onCheckInChange(newVal);

    // If new check-in makes current check-out invalid (checkout <= checkin), reset check-out
    if (checkOut && newVal && checkOut <= newVal) {
      onCheckOutChange("");
    }
  };

  const handleCheckOutChange = (newVal: string) => {
    // If entered date is in the past or before/same as check-in, reject
    if (newVal && (isDateBeforeToday(newVal) || (checkIn && newVal <= checkIn))) {
      onCheckOutChange("");
      return;
    }

    onCheckOutChange(newVal);
  };

  const isStack = layout === "stack";

  return (
    <div
      className={
        isStack
          ? "space-y-3 sm:space-y-4"
          : "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      }
    >
      {/* Check-In Input */}
      <div className="relative min-w-0">
        <label className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between">
          <span className="truncate">{tValidation("checkInLabel")}</span>
          {checkIn && !isDateBeforeToday(checkIn) && (
            <span className="text-[10px] sm:text-[11px] text-sage-dark font-bold shrink-0 ml-1">
              ✓ {tValidation("validSelection")}
            </span>
          )}
        </label>
        <div
          onClick={() => {
            try {
              checkInRef.current?.showPicker?.();
            } catch {
              checkInRef.current?.focus();
            }
          }}
          className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border bg-cream transition-all cursor-pointer min-w-0 max-w-full overflow-hidden ${
            checkInError
              ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
              : "border-sand hover:border-terracotta/50 focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
          }`}
        >
          <CalendarDays
            className={`w-4 h-4 shrink-0 ${
              checkInError ? "text-red-500" : "text-terracotta"
            }`}
          />
          <input
            ref={checkInRef}
            id="checkin-date-input"
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full min-w-0 max-w-full bg-transparent text-base sm:text-sm text-charcoal font-semibold outline-none cursor-pointer [color-scheme:light]"
            aria-label={tValidation("checkInLabel")}
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
              <span className="break-words">{checkInError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Check-Out Input */}
      <div className="relative min-w-0">
        <label
          htmlFor="checkout-date-input"
          className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between"
        >
          <span className="truncate">{tValidation("checkOutLabel")}</span>
          {checkOut && isCheckOutValid(checkIn || todayStr, checkOut) && (
            <span className="text-[10px] sm:text-[11px] text-sage-dark font-bold shrink-0 ml-1">
              ✓ {tValidation("validSelection")}
            </span>
          )}
        </label>
        <div
          onClick={() => {
            try {
              checkOutRef.current?.showPicker?.();
            } catch {
              checkOutRef.current?.focus();
            }
          }}
          className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border bg-cream transition-all cursor-pointer min-w-0 max-w-full overflow-hidden ${
            checkOutError
              ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
              : "border-sand hover:border-terracotta/50 focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
          }`}
        >
          <CalendarDays
            className={`w-4 h-4 shrink-0 ${
              checkOutError ? "text-red-500" : "text-terracotta"
            }`}
          />
          <input
            ref={checkOutRef}
            id="checkout-date-input"
            type="date"
            min={minCheckOutStr}
            value={checkOut}
            onChange={(e) => handleCheckOutChange(e.target.value)}
            className="w-full min-w-0 max-w-full bg-transparent text-base sm:text-sm text-charcoal font-semibold outline-none cursor-pointer [color-scheme:light]"
            aria-label={tValidation("checkOutLabel")}
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
              <span className="break-words">{checkOutError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
