"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Wifi,
  UtensilsCrossed,
  Car,
  Waves,
  Tv,
  Wind,
  TreePalm,
  Dumbbell,
  Coffee,
  Eye,
  Sparkles,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";

interface VillaDetailClientProps {
  villa: Villa;
}

const facilityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  "wifi kecepatan tinggi": Wifi,
  dapur: UtensilsCrossed,
  "dapur lengkap": UtensilsCrossed,
  "dapur professional": UtensilsCrossed,
  "dapur kecil (kitchenette)": UtensilsCrossed,
  kitchenette: UtensilsCrossed,
  parkir: Car,
  "parkir pribadi": Car,
  "kolam renang": Waves,
  "kolam renang pribadi": Waves,
  "kolam renang infinity": Waves,
  "infinity pool": Waves,
  "kolam renang 25m": Waves,
  "smart tv": Tv,
  ac: Wind,
  "ac sentral": Wind,
  "kipas angin & ac": Wind,
  taman: TreePalm,
  "taman tropis": TreePalm,
  "taman 1 hektar": TreePalm,
  gym: Dumbbell,
  "gym pribadi": Dumbbell,
  "sarapan lokal inklusif": Coffee,
  "pemandangan laut": Eye,
  "pemandangan sawah": Eye,
  "balkon laut": Eye,
};

function getFacilityIcon(facility: string): React.ElementType {
  const key = facility.toLowerCase();
  return facilityIcons[key] || Check;
}

export default function VillaDetailClient({ villa }: VillaDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone hover:text-terracotta transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Main Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-3 bg-sand">
            <div className="absolute inset-0 shimmer-bg" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent z-10" />

            {/* Image Navigation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 shimmer-bg"
              />
            </AnimatePresence>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full">
              {activeImage + 1} / {villa.galeri_foto.length}
            </div>

            {/* Nav Arrows */}
            {villa.galeri_foto.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? villa.galeri_foto.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-lg cursor-pointer"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-charcoal" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === villa.galeri_foto.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-lg cursor-pointer"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5 text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {villa.galeri_foto.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  i === activeImage
                    ? "border-terracotta shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <div className="w-full h-full shimmer-bg" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title & Location */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20">
                  {villa.kategori}
                </span>
                <div className="flex items-center gap-1 text-gold">
                  <Star className="w-4 h-4 fill-gold" />
                  <span className="text-sm font-semibold">4.9</span>
                  <span className="text-stone-light text-sm">(128 ulasan)</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-navy">
                {villa.nama}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-stone">
                <MapPin className="w-4 h-4 text-terracotta" />
                <span>{villa.lokasi}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: BedDouble,
                  value: villa.jumlah_kamar,
                  label: "Kamar Tidur",
                  color: "text-terracotta",
                  bg: "bg-terracotta/10",
                },
                {
                  icon: Bath,
                  value: villa.jumlah_kamar_mandi,
                  label: "Kamar Mandi",
                  color: "text-sage",
                  bg: "bg-sage/10",
                },
                {
                  icon: Users,
                  value: villa.kapasitas_tamu,
                  label: "Tamu Maks",
                  color: "text-navy",
                  bg: "bg-navy/10",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 text-center border border-sand/50"
                >
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${stat.bg} mb-2`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-navy">
                    {stat.value}
                  </div>
                  <div className="text-xs text-stone-light mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/50">
              <h2 className="text-xl font-bold text-navy mb-4">
                Tentang Villa Ini
              </h2>
              <p className="text-stone leading-relaxed">{villa.deskripsi}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/50">
              <h2 className="text-xl font-bold text-navy mb-6">
                Fasilitas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {villa.fasilitas.map((f) => {
                  const Icon = getFacilityIcon(f);
                  return (
                    <div
                      key={f}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream hover:bg-sage/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-sage" />
                      </div>
                      <span className="text-sm text-charcoal font-medium">
                        {f}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sidebar — Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl p-6 sm:p-8 border border-sand/50 shadow-lg shadow-navy/5">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-terracotta">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                </div>
                <span className="text-stone-light text-sm">per malam</span>
              </div>

              {/* Date Inputs */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-medium text-stone block mb-1.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-sand text-sm bg-cream focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone block mb-1.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-sand text-sm bg-cream focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone block mb-1.5">
                    Jumlah Tamu
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-sand text-sm bg-cream focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all">
                    {Array.from(
                      { length: villa.kapasitas_tamu },
                      (_, i) => i + 1
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} Tamu
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-sand/50 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone">
                    {formatHarga(villa.harga_per_malam)} × 1 malam
                  </span>
                  <span className="text-charcoal font-medium">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Biaya layanan</span>
                  <span className="text-charcoal font-medium">
                    {formatHarga(Math.round(villa.harga_per_malam * 0.1))}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-sand/50">
                  <span className="text-navy">Total</span>
                  <span className="text-terracotta">
                    {formatHarga(
                      villa.harga_per_malam +
                        Math.round(villa.harga_per_malam * 0.1)
                    )}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-terracotta to-terracotta-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-terracotta/20 hover:shadow-terracotta/40 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Booking Sekarang
              </button>

              {/* Trust Badges */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-light">
                <ShieldCheck className="w-4 h-4 text-sage" />
                Pembayaran aman & terenkripsi
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
