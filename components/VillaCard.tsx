"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Users } from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";

interface VillaCardProps {
  villa: Villa;
  index: number;
}

export default function VillaCard({ villa, index }: VillaCardProps) {
  const t = useTranslations("Listing");

  const categoryBadgeClasses: Record<string, string> = {
    luxury: "bg-navy/90 text-gold-light border-gold-light/40",
    family: "bg-navy/90 text-sage-light border-sage-light/40",
    studio: "bg-navy/90 text-terracotta-light border-terracotta-light/40",
  };

  const badgeClass =
    categoryBadgeClasses[villa.kategori_key] ||
    "bg-navy/90 text-white border-white/30";

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
      <Link href={`/villa/${villa.id}`} className="group block h-full">
        <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-navy/10 transition-all duration-300 border border-sand hover:border-terracotta/35 flex flex-col justify-between">
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
                  loading={index < 4 ? "eager" : "lazy"}
                />
              )}

              {/* Gradient Scrim for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-black/20 z-10 pointer-events-none" />

              {/* Category Badge */}
              <div className="absolute top-3.5 left-3.5 z-20">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-xs ${badgeClass}`}
                >
                  {villa.kategori}
                </span>
              </div>

              {/* Price Overlay */}
              <div className="absolute bottom-3.5 left-3.5 z-20">
                <div className="bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2 shadow-md border border-white/50">
                  <span className="text-terracotta-dark font-black text-lg block leading-none">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                  <span className="text-stone font-bold text-[11px] block mt-1">
                    {t("perNight")}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-navy group-hover:text-terracotta-dark transition-colors line-clamp-1">
                {villa.nama}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-stone font-medium text-sm">
                <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                <span className="truncate">{villa.lokasi}</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between pt-4 border-t border-sand">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <BedDouble className="w-4 h-4 text-sage-dark shrink-0" />
                <span>
                  {villa.jumlah_kamar} {t("bedrooms")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <Bath className="w-4 h-4 text-sage-dark shrink-0" />
                <span>
                  {villa.jumlah_kamar_mandi} {t("bathrooms")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                <Users className="w-4 h-4 text-sage-dark shrink-0" />
                <span>
                  {villa.kapasitas_tamu} {t("guests")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
