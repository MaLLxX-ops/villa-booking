"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Heart,
  Scale,
  Sparkles,
} from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";

interface VillaCardProps {
  villa: Villa;
  index: number;
  isPopular?: boolean;
}

export default function VillaCard({
  villa,
  index,
  isPopular = false,
}: VillaCardProps) {
  const t = useTranslations("Listing");
  const tCompare = useTranslations("Compare");
  const { formatEstimate } = useCurrency();
  const { isSaved, toggleWishlist } = useWishlist();
  const { isSelected, toggleCompare, isMaxReached } = useCompare();

  const saved = isSaved(villa.id);
  const compared = isSelected(villa.id);
  const estimate = formatEstimate(villa.harga_per_malam);

  const categoryBadgeClasses: Record<string, string> = {
    luxury: "bg-navy/90 text-gold-light border-gold-light/40",
    family: "bg-navy/90 text-sage-light border-sage-light/40",
    studio: "bg-navy/90 text-terracotta-light border-terracotta-light/40",
  };

  const badgeClass =
    categoryBadgeClasses[villa.kategori_key] ||
    "bg-navy/90 text-white border-white/30";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(villa.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(villa.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.12,
        ease: "easeOut",
      }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="h-full"
    >
      <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-navy/10 transition-all duration-300 border border-sand hover:border-terracotta/35 flex flex-col justify-between">
        <Link href={`/villa/${villa.id}`} className="group block">
          <div>
            {/* Image Container with Next.js Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              {villa.galeri_foto[0] && (
                <Image
                  src={villa.galeri_foto[0]}
                  alt={villa.nama}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              )}

              {/* Gradient Scrim for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-black/20 z-10 pointer-events-none" />

              {/* Category & Popular Badges */}
              <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-xs ${badgeClass}`}
                >
                  {villa.kategori}
                </span>

                {isPopular && (
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy shadow-md flex items-center gap-1 border border-gold-light/60 animate-pulse">
                    <Sparkles className="w-3 h-3 fill-navy text-navy" />
                    {t("popularBadge")}
                  </span>
                )}
              </div>

              {/* Wishlist Heart Button */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleWishlistClick}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${
                    saved
                      ? "bg-terracotta text-white shadow-terracotta/40"
                      : "bg-black/35 hover:bg-black/50 text-white border border-white/30"
                  }`}
                  aria-label={
                    saved ? t("removeFromWishlist") : t("saveToWishlist")
                  }
                  title={saved ? t("removeFromWishlist") : t("saveToWishlist")}
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      saved ? "fill-white text-white" : "text-white"
                    }`}
                  />
                </motion.button>
              </div>

              {/* Price Overlay */}
              <div className="absolute bottom-3.5 left-3.5 z-20">
                <div className="bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2 shadow-md border border-white/50">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-terracotta-dark font-black text-lg block leading-none">
                      {formatHarga(villa.harga_per_malam)}
                    </span>
                    {estimate && (
                      <span className="text-stone font-bold text-xs">
                        {estimate}
                      </span>
                    )}
                  </div>
                  <span className="text-stone font-bold text-[11px] block mt-1">
                    {t("perNight")}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 pb-3">
              <h3 className="text-lg font-bold text-navy group-hover:text-terracotta-dark transition-colors line-clamp-1">
                {villa.nama}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-stone font-medium text-sm">
                <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                <span className="truncate">{villa.lokasi}</span>
              </div>
            </div>
          </div>
        </Link>

          {/* Stats & Compare Bar */}
          <div className="px-5 pb-4">
            <dl className="flex items-center justify-between py-3 border-t border-sand">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <BedDouble className="w-4 h-4 text-sage-dark shrink-0" />
                <dt className="sr-only">{t("bedrooms")}</dt>
                <dd>{villa.jumlah_kamar} {t("bedrooms")}</dd>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <Bath className="w-4 h-4 text-sage-dark shrink-0" />
                <dt className="sr-only">{t("bathrooms")}</dt>
                <dd>{villa.jumlah_kamar_mandi} {t("bathrooms")}</dd>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <Users className="w-4 h-4 text-sage-dark shrink-0" />
                <dt className="sr-only">{t("guests")}</dt>
                <dd>{villa.kapasitas_tamu} {t("guests")}</dd>
              </div>
            </dl>

            {/* Compare Checkbox Trigger */}
            <div className="pt-2 border-t border-sand/60 flex items-center justify-between">
              <label
                onClick={handleCompareClick}
                className={`inline-flex items-center gap-2 text-xs font-bold cursor-pointer transition-colors select-none py-1 px-2.5 rounded-lg ${
                  compared
                    ? "bg-terracotta/15 text-terracotta-dark"
                    : "text-stone hover:text-navy hover:bg-sand/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={compared}
                  disabled={!compared && isMaxReached}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 text-terracotta rounded-sm border-sand focus:ring-terracotta cursor-pointer accent-terracotta"
                />
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  {t("compareCheckbox")}
                </span>
              </label>

              {compared && (
                <span className="text-[10px] font-bold text-terracotta-dark bg-terracotta/10 px-2 py-0.5 rounded-full">
                  {tCompare("ready")}
                </span>
              )}
            </div>
          </div>
      </article>
    </motion.div>
  );
}
