"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CalendarDays } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [lokasi, setLokasi] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/cari");
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-navy/10 p-3 sm:p-4 border border-sand/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Location */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-terracotta z-10">
              Lokasi
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/10 transition-all">
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                placeholder="Kemana tujuan Anda?"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal placeholder:text-stone-light outline-none"
              />
            </div>
          </div>

          {/* Check-In */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-terracotta z-10">
              Check-in
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/10 transition-all">
              <CalendarDays className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal placeholder:text-stone-light outline-none"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-terracotta z-10">
              Check-out
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/10 transition-all">
              <CalendarDays className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm text-charcoal placeholder:text-stone-light outline-none"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-3 sm:mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto sm:float-right inline-flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-terracotta/20 hover:shadow-terracotta/40 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Cari Villa
          </button>
          <div className="clear-both" />
        </div>
      </div>
    </motion.form>
  );
}
