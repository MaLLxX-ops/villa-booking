"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { villaDataRaw, getLocalizedVilla, Locale } from "@/lib/data";

export default function CompareFloatingBar() {
  const { selectedIds, removeCompare, clearCompare, count } = useCompare();
  const t = useTranslations("Compare");
  const locale = useLocale() as Locale;

  // Retrieve selected villas
  const selectedVillas = useMemo(() => {
    return selectedIds
      .map((id) => villaDataRaw.find((v) => v.id === id))
      .filter(Boolean)
      .map((raw) => getLocalizedVilla(raw!, locale));
  }, [selectedIds, locale]);

  if (count < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 pointer-events-auto"
      >
        <div className="bg-navy/95 backdrop-blur-xl border border-gold-light/30 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-white">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Info & Thumbnails */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-terracotta-light" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold truncate">
                    {t("floatingBarTitle")}
                  </span>
                  <span className="text-[11px] font-black bg-terracotta text-white px-2 py-0.5 rounded-full shrink-0">
                    {count}/3
                  </span>
                </div>

                {/* Thumbnails of selected villas */}
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto">
                  {selectedVillas.map((villa) => (
                    <div
                      key={villa.id}
                      className="relative group shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-white/20"
                    >
                      <Image
                        src={villa.galeri_foto[0]}
                        alt={villa.nama}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeCompare(villa.id)}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={t("removeVilla")}
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clearCompare}
                className="p-2 rounded-xl text-stone-light hover:text-white hover:bg-white/10 transition-colors"
                title={t("clearAll")}
                aria-label={t("clearAll")}
              >
                <Trash2 className="w-4 h-4 text-sand" />
              </button>

              <Link
                href="/bandingkan"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-terracotta/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{t("compareNowBtn", { count })}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
