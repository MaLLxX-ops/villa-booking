"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";

interface SearchPageClientProps {
  villas: Villa[];
}

export default function SearchPageClient({ villas }: SearchPageClientProps) {
  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">
            Cari Villa
          </h1>
          <p className="mt-2 text-stone">
            Menampilkan {villas.length} villa tersedia
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 sm:p-5 mb-8 border border-sand/50 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau lokasi..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand bg-cream text-sm text-charcoal placeholder:text-stone-light focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select className="px-4 py-3 rounded-xl border border-sand bg-cream text-sm text-charcoal focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all">
              <option value="">Semua Kategori</option>
              <option value="Villa Mewah">Villa Mewah</option>
              <option value="Villa Keluarga">Villa Keluarga</option>
              <option value="Studio Minimalis">Studio Minimalis</option>
            </select>

            {/* Sort */}
            <select className="px-4 py-3 rounded-xl border border-sand bg-cream text-sm text-charcoal focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all">
              <option value="">Urutkan</option>
              <option value="harga-asc">Harga: Terendah</option>
              <option value="harga-desc">Harga: Tertinggi</option>
              <option value="kapasitas">Kapasitas Terbesar</option>
            </select>

            {/* Filter Button */}
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {villas.map((villa, i) => (
            <VillaCard key={villa.id} villa={villa} index={i} />
          ))}
        </div>

        {/* No Results Placeholder */}
        {villas.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">
              Tidak ada villa ditemukan
            </h3>
            <p className="text-stone">
              Coba ubah filter pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
