"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Users } from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";

interface VillaCardProps {
  villa: Villa;
  index: number;
}

export default function VillaCard({ villa, index }: VillaCardProps) {
  const categoryColors: Record<string, string> = {
    "Villa Mewah": "bg-gold/20 text-gold-light border border-gold/30",
    "Villa Keluarga": "bg-sage/20 text-sage border border-sage/30",
    "Studio Minimalis":
      "bg-terracotta/20 text-terracotta border border-terracotta/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/villa/${villa.id}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-sand/50 hover:border-terracotta/30 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 shimmer-bg" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent z-10" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md ${
                  categoryColors[villa.kategori] || "bg-white/20 text-white"
                }`}
              >
                {villa.kategori}
              </span>
            </div>

            {/* Price Overlay */}
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
                <span className="text-terracotta font-bold text-lg">
                  {formatHarga(villa.harga_per_malam)}
                </span>
                <span className="text-stone-light text-xs block -mt-0.5">
                  per malam
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-navy group-hover:text-terracotta transition-colors">
              {villa.nama}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-stone-light text-sm">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              {villa.lokasi}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-sand/50">
              <div className="flex items-center gap-1.5 text-sm text-stone">
                <BedDouble className="w-4 h-4 text-sage" />
                <span>{villa.jumlah_kamar} Kamar</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-stone">
                <Bath className="w-4 h-4 text-sage" />
                <span>{villa.jumlah_kamar_mandi}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-stone">
                <Users className="w-4 h-4 text-sage" />
                <span>{villa.kapasitas_tamu}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
