"use client";

import { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, Trash2, Search, Sparkles } from "lucide-react";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistPageClientProps {
  villas: Villa[];
}

export default function WishlistPageClient({ villas }: WishlistPageClientProps) {
  const t = useTranslations("Wishlist");
  const { savedIds, clearWishlist, count } = useWishlist();

  const savedVillas = useMemo(() => {
    return villas.filter((villa) => savedIds.includes(villa.id));
  }, [villas, savedIds]);

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
            {t("backHome")}
          </Link>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-sand shadow-sm mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30 text-xs font-bold mb-3">
                <Heart className="w-3.5 h-3.5 fill-terracotta" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-2 text-stone text-base sm:text-lg max-w-2xl">
                {t("subtitle")}
              </p>
            </div>

            {savedVillas.length > 0 && (
              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                <span className="text-xs font-black bg-cream-dark text-charcoal px-3.5 py-2 rounded-xl border border-sand">
                  {t("savedCount", { count: savedVillas.length })}
                </span>
                <button
                  onClick={clearWishlist}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-terracotta-dark hover:bg-terracotta/10 border border-terracotta/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t("clearAll")}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        {savedVillas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-10 sm:p-16 border border-sand text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-terracotta/10 border border-terracotta/25 flex items-center justify-center mx-auto mb-6 text-terracotta">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy">
              {t("emptyTitle")}
            </h2>
            <p className="mt-3 text-stone text-base max-w-md mx-auto">
              {t("emptyDesc")}
            </p>
            <div className="mt-8">
              <Link
                href="/cari"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md shadow-terracotta/25 hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                {t("browseVillas")}
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {savedVillas.map((villa, index) => (
                <VillaCard key={villa.id} villa={villa} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
