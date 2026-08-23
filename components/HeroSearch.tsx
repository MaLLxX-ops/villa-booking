"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import DateRangeInputs from "@/components/DateRangeInputs";
import { isCheckOutValid } from "@/lib/date-utils";

export default function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("Hero");
  const tValidation = useTranslations("Validation");

  const [lokasi, setLokasi] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (checkInError) setCheckInError("");
    if (checkOut && !isCheckOutValid(val, checkOut)) {
      setCheckOut("");
      setCheckOutError("");
    }
  };

  const handleCheckOutChange = (val: string) => {
    setCheckOut(val);
    if (checkOutError) setCheckOutError("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!checkIn) {
      setCheckInError(tValidation("errorCheckInRequired"));
      hasError = true;
    } else {
      setCheckInError("");
    }

    if (!checkOut) {
      setCheckOutError(tValidation("errorCheckOutRequired"));
      hasError = true;
    } else if (checkIn && !isCheckOutValid(checkIn, checkOut)) {
      setCheckOutError(tValidation("errorInvalidCheckOut"));
      hasError = true;
    } else {
      setCheckOutError("");
    }

    if (hasError) {
      return;
    }

    const params = new URLSearchParams();
    if (lokasi.trim()) params.set("q", lokasi.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    router.push(`/cari${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
      noValidate
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-navy/8 p-4 sm:p-5 border border-sand">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
          {/* Location Input (4 cols) */}
          <div className="lg:col-span-4 relative">
            <label className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between">
              <span>{t("locationLabel")}</span>
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                placeholder={t("locationPlaceholder")}
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal font-semibold placeholder:text-stone-light outline-none"
              />
            </div>
          </div>

          {/* Date Range Inputs (Check-in & Check-out) (8 cols) */}
          <div className="lg:col-span-8">
            <DateRangeInputs
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              checkInError={checkInError}
              checkOutError={checkOutError}
              layout="grid"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 pt-3 border-t border-sand/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone font-medium text-left">
            * Pilih tanggal check-in & check-out untuk mengecek ketersediaan villa
          </p>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-terracotta/25 hover:shadow-lg hover:shadow-terracotta/35 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            {t("searchBtn")}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
