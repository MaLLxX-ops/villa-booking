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
  const [direction, setDirection] = useState(0);

  const nextImage = () => {
    setDirection(1);
    setActiveImage((prev) =>
      prev === villa.galeri_foto.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setDirection(-1);
    setActiveImage((prev) =>
      prev === 0 ? villa.galeri_foto.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number) => {
    setDirection(index > activeImage ? 1 : -1);
    setActiveImage(index);
  };

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-charcoal hover:text-terracotta-dark transition-colors text-sm font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Photo Gallery with smooth Motion transitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          {/* Main Photo Viewer */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-3.5 bg-sand shadow-lg border border-sand">
            {/* Animated Photo Transition */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeImage}
                custom={direction}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={villa.galeri_foto[activeImage]}
                  alt={`${villa.nama} foto ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-black/20 pointer-events-none z-10" />

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-20 bg-navy/85 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
              {activeImage + 1} / {villa.galeri_foto.length}
            </div>

            {/* Navigation Arrows */}
            {villa.galeri_foto.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-lg cursor-pointer border border-sand"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-charcoal" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-lg cursor-pointer border border-sand"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5 text-charcoal" />
                </motion.button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {villa.galeri_foto.map((photo, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectImage(i)}
                className={`shrink-0 w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                  i === activeImage
                    ? "border-terracotta ring-2 ring-terracotta/40 shadow-md opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`${villa.nama} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Detail Section (Fade in) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title & Rating */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30">
                  {villa.kategori}
                </span>
                <div className="flex items-center gap-1.5 text-gold">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-black text-charcoal">4.9</span>
                  <span className="text-stone font-semibold text-sm">
                    (128 ulasan tamu)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                {villa.nama}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-stone font-semibold text-base">
                <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                <span>{villa.lokasi}</span>
              </div>
            </div>

            {/* Quick Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: BedDouble,
                  value: villa.jumlah_kamar,
                  label: "Kamar Tidur",
                  color: "text-terracotta",
                  bg: "bg-terracotta/15",
                },
                {
                  icon: Bath,
                  value: villa.jumlah_kamar_mandi,
                  label: "Kamar Mandi",
                  color: "text-sage-dark",
                  bg: "bg-sage/15",
                },
                {
                  icon: Users,
                  value: villa.kapasitas_tamu,
                  label: "Tamu Maks",
                  color: "text-navy",
                  bg: "bg-navy/15",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 text-center border border-sand shadow-xs"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} mb-2.5 shadow-xs`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-navy">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Comprehensive Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-navy mb-4">
                Tentang Villa Ini
              </h2>
              <p className="text-charcoal/90 leading-relaxed text-base sm:text-lg font-normal">
                {villa.deskripsi}
              </p>
            </div>

            {/* Facilities List with Icons */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-navy mb-6">
                Fasilitas Unggulan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {villa.fasilitas.map((f) => {
                  const Icon = getFacilityIcon(f);
                  return (
                    <div
                      key={f}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-cream border border-sand/70 hover:border-terracotta/40 hover:bg-cream-dark transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sage/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-sage-dark" />
                      </div>
                      <span className="text-sm sm:text-base text-charcoal font-bold">
                        {f}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sticky Booking Sidebar with Fade-In + Slide from Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-xl shadow-navy/8">
              {/* Price Display */}
              <div className="mb-6 pb-6 border-b border-sand">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-terracotta-dark tracking-tight">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                </div>
                <span className="text-stone font-bold text-sm block mt-0.5">
                  per malam (termasuk pajak)
                </span>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-sand text-sm font-medium bg-cream text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-sand text-sm font-medium bg-cream text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Jumlah Tamu
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-sand text-sm font-bold bg-cream text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all">
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

              {/* Price Breakdown Calculation */}
              <div className="border-t border-sand pt-4 mb-6 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone font-medium">
                    {formatHarga(villa.harga_per_malam)} × 1 malam
                  </span>
                  <span className="text-charcoal font-bold">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone font-medium">Biaya layanan</span>
                  <span className="text-charcoal font-bold">
                    {formatHarga(Math.round(villa.harga_per_malam * 0.1))}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black pt-3 border-t border-sand">
                  <span className="text-navy">Total Estimasi</span>
                  <span className="text-terracotta-dark text-lg">
                    {formatHarga(
                      villa.harga_per_malam +
                        Math.round(villa.harga_per_malam * 0.1)
                    )}
                  </span>
                </div>
              </div>

              {/* Booking CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-terracotta to-terracotta-dark text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-terracotta/25 hover:shadow-xl hover:shadow-terracotta/35 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-gold-light" />
                Booking Sekarang
              </motion.button>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-stone">
                <ShieldCheck className="w-4 h-4 text-sage-dark shrink-0" />
                Pembayaran aman & konfirmasi instan
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
