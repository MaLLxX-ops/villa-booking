"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  X,
} from "lucide-react";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";
import DateRangeInputs from "@/components/DateRangeInputs";
import {
  calculateNights,
  isCheckOutValid,
} from "@/lib/date-utils";

interface SearchPageClientProps {
  villas: Villa[];
}

function SearchPageContent({ villas }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("Search");
  const tValidation = useTranslations("Validation");

  const initialQuery = searchParams.get("q") || "";
  const initialCategoryKey = searchParams.get("cat") || "";
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(initialCategoryKey);
  const [selectedSort, setSelectedSort] = useState("");

  // Date Filter State
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(
    Boolean(initialCheckIn || initialCheckOut)
  );

  const nights = calculateNights(checkIn, checkOut);
  const hasValidDates = nights > 0;

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

  // Derive dynamic category labels
  const localizedCategoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    villas.forEach((v) => {
      if (v.kategori_key) {
        map[v.kategori_key] = v.kategori;
      }
    });
    return map;
  }, [villas]);

  // Filter & Sort Logic
  const filteredVillas = useMemo(() => {
    return villas
      .filter((villa) => {
        const matchesSearch =
          !searchTerm ||
          villa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          villa.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          villa.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          villa.fasilitas.some((f) =>
            f.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesCategory =
          !selectedCategoryKey || villa.kategori_key === selectedCategoryKey;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (selectedSort === "harga-asc")
          return a.harga_per_malam - b.harga_per_malam;
        if (selectedSort === "harga-desc")
          return b.harga_per_malam - a.harga_per_malam;
        if (selectedSort === "kapasitas")
          return b.kapasitas_tamu - a.kapasitas_tamu;
        if (selectedSort === "kamar")
          return b.jumlah_kamar - a.jumlah_kamar;
        return 0;
      });
  }, [villas, searchTerm, selectedCategoryKey, selectedSort]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategoryKey("");
    setSelectedSort("");
    setCheckIn("");
    setCheckOut("");
    setCheckInError("");
    setCheckOutError("");
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategoryKey || selectedSort || checkIn || checkOut
  );

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
            {t("title")}
          </h1>
          <p
            className="mt-2 text-stone font-semibold text-base sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: t.raw("resultsFound").replace(
                "{count}",
                filteredVillas.length.toString()
              ),
            }}
          />
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 mb-8 border border-sand shadow-md space-y-4"
        >
          {/* Main Controls Row */}
          <div className="flex flex-col md:flex-row gap-3.5">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-semibold text-charcoal placeholder:text-stone focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategoryKey}
              onChange={(e) => setSelectedCategoryKey(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-bold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all cursor-pointer"
            >
              <option value="">{t("allCategories")}</option>
              <option value="luxury">
                {localizedCategoryMap["luxury"] || "Luxury"}
              </option>
              <option value="family">
                {localizedCategoryMap["family"] || "Family"}
              </option>
              <option value="studio">
                {localizedCategoryMap["studio"] || "Studio"}
              </option>
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-bold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all cursor-pointer"
            >
              <option value="">{t("sortPlaceholder")}</option>
              <option value="harga-asc">{t("sortPriceAsc")}</option>
              <option value="harga-desc">{t("sortPriceDesc")}</option>
              <option value="kapasitas">{t("sortGuests")}</option>
              <option value="kamar">{t("sortBedrooms")}</option>
            </select>

            {/* Date Filter Toggle Button */}
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer shrink-0 ${
                hasValidDates || showDateFilter
                  ? "bg-navy text-white shadow-xs"
                  : "bg-cream text-charcoal hover:bg-sand/60 border border-sand"
              }`}
            >
              <Calendar className="w-4 h-4 text-terracotta" />
              <span>
                {hasValidDates ? `${nights} Malam Terpilih` : "Tanggal Menginap"}
              </span>
            </button>

            {/* Reset Button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-sand/70 hover:bg-sand text-charcoal text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                {t("resetBtn")}
              </motion.button>
            )}
          </div>

          {/* Collapsible Date Range Filter Section */}
          <AnimatePresence>
            {showDateFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 border-t border-sand"
              >
                <div className="bg-cream/50 p-4 rounded-xl border border-sand">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-terracotta" />
                      {t("stayDatesTitle")}
                    </span>
                    {(checkIn || checkOut) && (
                      <button
                        onClick={() => {
                          setCheckIn("");
                          setCheckOut("");
                        }}
                        className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        {t("clearDates")}
                      </button>
                    )}
                  </div>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-sand/60">
            <span className="text-xs font-bold text-stone py-1 mr-1 flex items-center">
              {t("quickCategoryLabel")}
            </span>
            <button
              onClick={() => setSelectedCategoryKey("")}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                !selectedCategoryKey
                  ? "bg-terracotta text-white shadow-xs"
                  : "bg-cream text-stone hover:text-charcoal hover:bg-sand/60 border border-sand"
              }`}
            >
              {t("allCategories")}
            </button>
            {["luxury", "family", "studio"].map((key) => {
              const label = localizedCategoryMap[key] || key;
              const isSelected = selectedCategoryKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategoryKey(key)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? "bg-terracotta text-white shadow-xs"
                      : "bg-cream text-stone hover:text-charcoal hover:bg-sand/60 border border-sand"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Grid with Smooth Filter Transition (AnimatePresence) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredVillas.map((villa, i) => (
              <motion.div
                key={villa.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <VillaCard villa={villa} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State with Animation */}
        <AnimatePresence>
          {filteredVillas.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20 bg-white rounded-2xl border border-sand p-8 max-w-lg mx-auto shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-terracotta/15 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-terracotta" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy mb-2">
                {t("emptyTitle")}
              </h2>
              <p className="text-stone font-medium text-sm sm:text-base mb-6">
                {t("emptyDesc")}
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                {t("resetAllBtn")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPageClient({ villas }: SearchPageClientProps) {
  const t = useTranslations("Search");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone font-bold">{t("loading")}</p>
          </div>
        </div>
      }
    >
      <SearchPageContent villas={villas} />
    </Suspense>
  );
}
