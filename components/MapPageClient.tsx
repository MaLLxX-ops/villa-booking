"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Map as MapIcon,
  ArrowLeft,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";
import InteractiveMap from "@/components/InteractiveMap";
import { useCurrency } from "@/context/CurrencyContext";

interface MapPageClientProps {
  villas: Villa[];
}

export default function MapPageClient({ villas }: MapPageClientProps) {
  const t = useTranslations("Map");
  const { formatEstimate } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeVillaId, setActiveVillaId] = useState<string | undefined>(undefined);

  const filteredVillas = useMemo(() => {
    if (selectedCategory === "all") return villas;
    return villas.filter((v) => v.kategori_key === selectedCategory);
  }, [villas, selectedCategory]);

  const handleSelectVilla = useCallback((id: string) => {
    setActiveVillaId(id);
    const cardEl = document.getElementById(`map-card-${id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-charcoal hover:text-terracotta transition-colors text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t("backHome")}</span>
          </Link>
        </div>

        {/* Header & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-sand shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30 text-xs font-bold mb-3">
                <MapIcon className="w-3.5 h-3.5" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-2 text-stone text-base sm:text-lg max-w-2xl">
                {t("subtitle")}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              {[
                { key: "all", label: t("allCategories") },
                { key: "luxury", label: t("catLuxury") },
                { key: "family", label: t("catFamily") },
                { key: "studio", label: t("catStudio") },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setActiveVillaId(undefined);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? "bg-terracotta text-white shadow-md shadow-terracotta/30"
                      : "bg-cream text-charcoal hover:bg-sand/60 border border-sand"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Map and Side Card List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Villa Cards Sidebar / Scroll list (4 cols on lg) */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-4 max-h-[650px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-stone uppercase tracking-wider">
                {t("villasCount", { count: filteredVillas.length })}
              </span>
              <Link
                href="/cari"
                className="text-xs font-bold text-terracotta hover:underline"
              >
                {t("viewList")}
              </Link>
            </div>

            {filteredVillas.map((villa) => {
              const estimate = formatEstimate(villa.harga_per_malam);
              const isActive = activeVillaId === villa.id;

              return (
                <motion.div
                  id={`map-card-${villa.id}`}
                  key={villa.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectVilla(villa.id)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "border-terracotta ring-2 ring-terracotta/40 shadow-lg bg-terracotta/5"
                      : "border-sand hover:border-terracotta/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-sand">
                      <Image
                        src={villa.galeri_foto[0]}
                        alt={villa.nama}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-navy/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {villa.kategori}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-navy truncate">
                        {villa.nama}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-stone font-medium mt-1">
                        <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                        <span className="truncate">{villa.lokasi}</span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <span className="text-sm font-black text-terracotta-dark">
                            {formatHarga(villa.harga_per_malam)}
                          </span>
                          {estimate && (
                            <span className="text-[10px] text-stone font-bold block">
                              {estimate}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/villa/${villa.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-bold text-terracotta hover:text-terracotta-dark"
                        >
                          <span>{t("viewDetail")}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Map Container (8 cols on lg) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <InteractiveMap
              villas={filteredVillas}
              selectedVillaId={activeVillaId}
              onSelectVilla={handleSelectVilla}
              className="w-full h-[450px] sm:h-[550px] lg:h-[650px] sticky top-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
