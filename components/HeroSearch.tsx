"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, MapPin, CalendarDays } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("Hero");
  const [lokasi, setLokasi] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (lokasi) params.set("q", lokasi);
    router.push(`/cari${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-navy/8 p-4 sm:p-5 border border-sand">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Location */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-terracotta-dark z-10">
              {t("locationLabel")}
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream/50 focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                placeholder={t("locationPlaceholder")}
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal font-medium placeholder:text-stone-light outline-none"
              />
            </div>
          </div>

          {/* Check-In */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-terracotta-dark z-10">
              {t("checkInLabel")}
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream/50 focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
              <CalendarDays className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal font-medium placeholder:text-stone-light outline-none"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-terracotta-dark z-10">
              {t("checkOutLabel")}
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream/50 focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
              <CalendarDays className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal font-medium placeholder:text-stone-light outline-none"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex justify-end">
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
