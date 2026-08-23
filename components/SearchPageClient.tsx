"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";

interface SearchPageClientProps {
  villas: Villa[];
}

function SearchPageContent({ villas }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("kategori") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("");

  const categories = ["Semua Kategori", "Villa Mewah", "Villa Keluarga", "Studio Minimalis"];

  // Filter & Sort Logic
  const filteredVillas = useMemo(() => {
    return villas
      .filter((villa) => {
        const matchesSearch =
          !searchTerm ||
          villa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          villa.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          villa.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          !selectedCategory ||
          selectedCategory === "Semua Kategori" ||
          villa.kategori === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (selectedSort === "harga-asc") return a.harga_per_malam - b.harga_per_malam;
        if (selectedSort === "harga-desc") return b.harga_per_malam - a.harga_per_malam;
        if (selectedSort === "kapasitas") return b.kapasitas_tamu - a.kapasitas_tamu;
        if (selectedSort === "kamar") return b.jumlah_kamar - a.jumlah_kamar;
        return 0;
      });
  }, [villas, searchTerm, selectedCategory, selectedSort]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSort("");
  };

  const hasActiveFilters = Boolean(
    searchTerm || (selectedCategory && selectedCategory !== "Semua Kategori") || selectedSort
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
            Cari Villa Impian
          </h1>
          <p className="mt-2 text-stone font-semibold text-base sm:text-lg">
            Menampilkan <span className="text-terracotta-dark font-black">{filteredVillas.length}</span> villa yang sesuai kriteria Anda
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 mb-8 border border-sand shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-3.5">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau lokasi (Ubud, Canggu...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-semibold text-charcoal placeholder:text-stone focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-bold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "Semua Kategori" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-sand bg-cream text-sm font-bold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all cursor-pointer"
            >
              <option value="">Urutkan Berdasarkan</option>
              <option value="harga-asc">Harga: Terendah ke Tertinggi</option>
              <option value="harga-desc">Harga: Tertinggi ke Terendah</option>
              <option value="kapasitas">Kapasitas Tamu Terbesar</option>
              <option value="kamar">Jumlah Kamar Terbanyak</option>
            </select>

            {/* Reset Button (Visible when filters are active) */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-sand/70 hover:bg-sand text-charcoal text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            )}
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-sand/60">
            <span className="text-xs font-bold text-stone py-1 mr-1 flex items-center">
              Kategori Cepat:
            </span>
            {categories.map((cat) => {
              const isSelected =
                (cat === "Semua Kategori" && !selectedCategory) ||
                selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat === "Semua Kategori" ? "" : cat)
                  }
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? "bg-terracotta text-white shadow-xs"
                      : "bg-cream text-stone hover:text-charcoal hover:bg-sand/60 border border-sand"
                  }`}
                >
                  {cat}
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
                Tidak Ada Villa yang Cocok
              </h2>
              <p className="text-stone font-medium text-sm sm:text-base mb-6">
                Tidak ada properti yang memenuhi filter pencarian Anda. Coba kurangi filter atau cari kata kunci lain.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Semua Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPageClient({ villas }: SearchPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone font-bold">Memuat villa...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent villas={villas} />
    </Suspense>
  );
}
