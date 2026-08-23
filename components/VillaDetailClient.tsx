"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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
  Calendar,
  CheckCircle2,
  X,
  Phone,
  MessageCircle,
  Heart,
  Scale,
  Share2,
  Copy,
  ExternalLink,
  Navigation,
  ShoppingBag,
  Send,
  Facebook,
} from "lucide-react";
import {
  formatHarga,
  Villa,
  ADMIN_WHATSAPP_NUMBER,
} from "@/lib/data";
import { generateBookingWhatsAppUrl } from "@/lib/whatsapp-templates";
import DateRangeInputs from "@/components/DateRangeInputs";
import InteractiveMap from "@/components/InteractiveMap";
import {
  calculateNights,
  isCheckOutValid,
} from "@/lib/date-utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";

interface VillaDetailClientProps {
  villa: Villa;
}

const facilityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  dapur: UtensilsCrossed,
  kitchen: UtensilsCrossed,
  cuisine: UtensilsCrossed,
  kitchenette: UtensilsCrossed,
  parkir: Car,
  parking: Car,
  kolam: Waves,
  pool: Waves,
  piscine: Waves,
  infinity: Waves,
  tv: Tv,
  ac: Wind,
  climatisation: Wind,
  taman: TreePalm,
  garden: TreePalm,
  jardin: TreePalm,
  gym: Dumbbell,
  fitness: Dumbbell,
  sarapan: Coffee,
  breakfast: Coffee,
  "petit-déjeuner": Coffee,
  laut: Eye,
  ocean: Eye,
  mer: Eye,
  sawah: Eye,
  "rice field": Eye,
  rizières: Eye,
  balkon: Eye,
  balcon: Eye,
  balcony: Eye,
  spa: Waves,
  sauna: Waves,
  tennis: Dumbbell,
  yoga: TreePalm,
};

function getFacilityIcon(facility: string): React.ElementType {
  const lower = facility.toLowerCase();
  for (const [key, icon] of Object.entries(facilityIcons)) {
    if (lower.includes(key)) return icon;
  }
  return Check;
}

export default function VillaDetailClient({ villa }: VillaDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const t = useTranslations("Detail");
  const tCompare = useTranslations("Compare");
  const tValidation = useTranslations("Validation");
  const { formatEstimate } = useCurrency();
  const { isSaved, toggleWishlist } = useWishlist();
  const { isSelected, toggleCompare } = useCompare();

  const saved = isSaved(villa.id);
  const compared = isSelected(villa.id);

  // Booking Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);

  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [ownerWALink, setOwnerWALink] = useState("");

  // Night and Price Calculation
  const nights = calculateNights(checkIn, checkOut);
  const hasValidDates = nights > 0;
  const activeNights = hasValidDates ? nights : 1;

  const basePrice = villa.harga_per_malam * activeNights;
  const serviceFee = Math.round(basePrice * 0.1);
  const totalPrice = basePrice + serviceFee;

  const nightEstimate = formatEstimate(villa.harga_per_malam);
  const basePriceEstimate = formatEstimate(basePrice);
  const serviceFeeEstimate = formatEstimate(serviceFee);
  const totalPriceEstimate = formatEstimate(totalPrice);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (checkInError) setCheckInError("");
    if (checkOut && !isCheckOutValid(val, checkOut)) {
      setCheckOut("");
      setCheckOutError("");
    }
  };

  const handleCheckOutChange = (val: string) => {
    setCheckOut(val);
    if (checkOutError) setCheckOutError("");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!checkIn) {
      setCheckInError(tValidation("errorCheckInRequired"));
      hasError = true;
    } else {
      setCheckInError("");
    }

    if (!checkOut) {
      setCheckOutError(tValidation("errorCheckOutRequired"));
      hasError = true;
    } else if (checkIn && !isCheckOutValid(checkIn, checkOut)) {
      setCheckOutError(tValidation("errorInvalidCheckOut"));
      hasError = true;
    } else {
      setCheckOutError("");
    }

    if (hasError) return;

    // Generate strictly English WhatsApp reservation message for the owner
    const { url: waUrl } = generateBookingWhatsAppUrl({
      villaName: villa.nama,
      villaLocation: villa.lokasi,
      checkIn,
      checkOut,
      nights: activeNights,
      guests: guestCount,
      totalPriceFormatted: formatHarga(totalPrice),
      ownerWhatsAppNumber: villa.nomor_whatsapp_pemilik,
    });

    setOwnerWALink(waUrl);
    setIsBookingSuccess(true);

    // Open WhatsApp directly in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${villa.koordinat.lat},${villa.koordinat.lng}`;

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-charcoal hover:text-terracotta-dark transition-colors text-sm font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backHome")}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-20">
        {/* Photo Gallery with smooth Motion transitions & Next.js Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          {/* Main Photo Viewer */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-3.5 bg-sand shadow-lg border border-sand">
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
                <Image
                  src={villa.galeri_foto[activeImage]}
                  alt={`${villa.nama} foto ${activeImage + 1}`}
                  fill
                  priority={activeImage === 0}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-black/20 pointer-events-none z-10" />

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-20 bg-navy/85 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
              {t("photoCount", {
                current: activeImage + 1,
                total: villa.galeri_foto.length,
              })}
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
                <Image
                  src={photo}
                  alt={`${villa.nama} thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30">
                    {villa.kategori}
                  </span>
                  <div className="flex items-center gap-1.5 text-gold">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="text-sm font-black text-charcoal">4.9</span>
                    <span className="text-stone font-semibold text-sm">
                      (128 {t("reviews")})
                    </span>
                  </div>
                </div>

                {/* Quick Actions: Wishlist, Compare & Share */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleWishlist(villa.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border cursor-pointer ${
                      saved
                        ? "bg-terracotta text-white border-terracotta shadow-terracotta/30"
                        : "bg-cream text-charcoal border-sand hover:border-terracotta"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        saved ? "fill-white text-white" : "text-terracotta"
                      }`}
                    />
                    <span>{saved ? t("savedWishlist") : t("saveWishlist")}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCompare(villa.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border cursor-pointer ${
                      compared
                        ? "bg-navy text-white border-navy"
                        : "bg-cream text-charcoal border-sand hover:border-navy"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-terracotta" />
                    <span>{compared ? tCompare("compared") : t("compareVilla")}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsShareModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cream text-charcoal border border-sand hover:border-terracotta transition-all cursor-pointer"
                    title={t("shareVilla")}
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone" />
                    <span>{t("shareVilla")}</span>
                  </motion.button>
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
                  label: t("bedrooms"),
                  color: "text-terracotta",
                  bg: "bg-terracotta/15",
                },
                {
                  icon: Bath,
                  value: villa.jumlah_kamar_mandi,
                  label: t("bathrooms"),
                  color: "text-sage-dark",
                  bg: "bg-sage/15",
                },
                {
                  icon: Users,
                  value: villa.kapasitas_tamu,
                  label: t("maxGuests"),
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
                {t("aboutTitle")}
              </h2>
              <p className="text-charcoal/90 leading-relaxed text-base sm:text-lg font-normal">
                {villa.deskripsi}
              </p>
            </div>

            {/* Facilities List with Icons */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-navy mb-6">
                {t("facilitiesTitle")}
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

            {/* Location & Interactive Map Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30 text-xs font-bold mb-2">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t("locationTitle")}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-navy">
                    {villa.nama} — {villa.lokasi}
                  </h2>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream hover:bg-sand/60 text-navy font-bold text-xs sm:text-sm border border-sand transition-all hover:scale-102 self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-terracotta" />
                  <span>{t("openGoogleMaps")}</span>
                </a>
              </div>

              {/* Embedded Leaflet Map centered on this villa */}
              <div className="rounded-2xl overflow-hidden border border-sand">
                <InteractiveMap
                  villas={[villa]}
                  singleVillaMode={true}
                  zoomLevel={14}
                  className="w-full h-[320px] sm:h-[380px]"
                />
              </div>

              {/* Nearby Highlights / Proximity Cards */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-stone uppercase tracking-wider mb-3">
                  {t("nearbyAttractions")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Car, text: t("airportDistance"), color: "text-navy" },
                    { icon: Waves, text: t("beachDistance"), color: "text-sage-dark" },
                    { icon: Coffee, text: t("diningDistance"), color: "text-terracotta" },
                    { icon: ShoppingBag, text: t("martDistance"), color: "text-gold" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-sand/60 text-xs sm:text-sm font-semibold text-charcoal"
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guest Reviews & Rating Breakdown Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand pb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-navy">
                    {t("reviewsTitle")}
                  </h2>
                  <p className="text-stone text-xs sm:text-sm mt-1">
                    Berdasarkan 128 ulasan terverifikasi tamu yang menginap
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-cream px-4 py-2.5 rounded-2xl border border-sand self-start sm:self-auto shrink-0">
                  <Star className="w-6 h-6 fill-gold text-gold" />
                  <div>
                    <span className="text-2xl font-black text-navy block leading-none">
                      4.9
                    </span>
                    <span className="text-[11px] font-bold text-stone">/ 5.0 Luar Biasa</span>
                  </div>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t("cleanliness"), score: "4.9", pct: "98%" },
                  { label: t("locationScore"), score: "5.0", pct: "100%" },
                  { label: t("serviceScore"), score: "4.9", pct: "98%" },
                  { label: t("valueScore"), score: "4.8", pct: "96%" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-charcoal">
                      <span>{item.label}</span>
                      <span className="font-black text-terracotta-dark">{item.score}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sand/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-terracotta to-gold rounded-full"
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Verified Reviews */}
              <div className="space-y-4 pt-4 border-t border-sand">
                {[
                  {
                    name: "Alexander & Sophie",
                    country: "🇦🇺 Australia",
                    date: "Agustus 2026",
                    comment:
                      "Liburan terbaik kami di Bali! Komunikasi WhatsApp dengan pemilik sangat lancar, villa persis seperti di foto, dan suasananya luar biasa privat serta bersih.",
                  },
                  {
                    name: "Rian & Keluarga",
                    country: "🇮🇩 Jakarta, Indonesia",
                    date: "Juli 2026",
                    comment:
                      "Proses booking super cepat dan transparan. Kolam renang bersih, dapur lengkap, dan lokasi sangat strategis dekat kafe-kafe hits.",
                  },
                  {
                    name: "Kenji & Mai",
                    country: "🇯🇵 Tokyo, Japan",
                    date: "Juni 2026",
                    comment:
                      "Exceptional hospitality and peaceful atmosphere. Everything was arranged directly with the host via WhatsApp without any hassle.",
                  },
                ].map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-cream/60 border border-sand/60 space-y-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-navy">
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-black">
                          {rev.name[0]}
                        </div>
                        <div>
                          <span className="block leading-snug">{rev.name}</span>
                          <span className="text-xs text-stone font-medium">
                            {rev.country} • {rev.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-gold text-xs">
                        {"★★★★★"}
                      </div>
                    </div>
                    <p className="text-stone text-xs sm:text-sm leading-relaxed pl-10 font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sticky Booking Sidebar with Direct WhatsApp Routing */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-1"
          >
            <div
              id="booking-card-sidebar"
              className="lg:sticky lg:top-28 bg-white rounded-2xl p-5 sm:p-8 border border-sand shadow-xl shadow-navy/8"
            >
              {/* Price Display */}
              <div className="mb-6 pb-6 border-b border-sand">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-terracotta-dark tracking-tight">
                    {formatHarga(villa.harga_per_malam)}
                  </span>
                  {nightEstimate && (
                    <span className="text-stone font-bold text-xs sm:text-sm">
                      {nightEstimate}
                    </span>
                  )}
                </div>
                <span className="text-stone font-bold text-xs sm:text-sm block mt-0.5">
                  {t("perNight")} {t("includesTax")}
                </span>
              </div>

              {/* Form with Real-time Calculations & WhatsApp Submission */}
              <form onSubmit={handleBookingSubmit} noValidate>
                {/* Date Inputs with Validation */}
                <div className="mb-4">
                  <DateRangeInputs
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={handleCheckInChange}
                    onCheckOutChange={handleCheckOutChange}
                    checkInError={checkInError}
                    checkOutError={checkOutError}
                    layout="stack"
                  />
                </div>

                {/* Guest Count Selection */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    {t("guestsCount")}
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-sand text-sm font-bold bg-cream text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all cursor-pointer"
                  >
                    {Array.from(
                      { length: villa.kapasitas_tamu },
                      (_, i) => i + 1
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} {t("guestUnit")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stay Duration & Dynamic Calculation Breakdown */}
                <div className="border-t border-sand pt-4 mb-6 space-y-3">
                  {/* Duration Badge */}
                  <div className="flex items-center justify-between text-xs font-bold py-1.5 px-3 rounded-lg bg-sand/40 text-stone">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-terracotta" />
                      {t("durationLabel")}:
                    </span>
                    <span
                      className={`font-black ${
                        hasValidDates ? "text-terracotta-dark" : "text-stone"
                      }`}
                    >
                      {hasValidDates
                        ? t("nightsCount", { count: nights })
                        : t("selectDatesPrompt")}
                    </span>
                  </div>

                  {/* Calculation Line */}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone font-medium">
                      {t("priceTimesNight", {
                        price: formatHarga(villa.harga_per_malam),
                        nights: activeNights,
                      })}
                    </span>
                    <div className="text-right">
                      <span className="text-charcoal font-bold block">
                        {formatHarga(basePrice)}
                      </span>
                      {basePriceEstimate && (
                        <span className="text-[11px] text-stone font-medium block">
                          {basePriceEstimate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone font-medium">
                      {t("serviceFee")}
                    </span>
                    <div className="text-right">
                      <span className="text-charcoal font-bold block">
                        {formatHarga(serviceFee)}
                      </span>
                      {serviceFeeEstimate && (
                        <span className="text-[11px] text-stone font-medium block">
                          {serviceFeeEstimate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-baseline text-base font-black pt-3 border-t border-sand">
                    <span className="text-navy">{t("totalEstimate")}</span>
                    <div className="text-right">
                      <span className="text-terracotta-dark text-xl block">
                        {formatHarga(totalPrice)}
                      </span>
                      {totalPriceEstimate && (
                        <span className="text-xs text-stone font-bold block">
                          {totalPriceEstimate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Booking Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  {t("bookingButton")}
                </motion.button>
              </form>

              {/* Trust Badge with Owner WA notice */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-stone">
                <ShieldCheck className="w-4 h-4 text-sage-dark shrink-0" />
                {t("securePayment")}
              </div>

              {/* Currency Exchange Disclaimer */}
              <p className="mt-3 text-[11px] leading-relaxed text-stone/80 text-center font-medium bg-sand/20 rounded-xl p-2.5 border border-sand/40">
                ℹ️ {t("currencyDisclaimer")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Floating Booking Action Bar (only visible on < lg screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-sand px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-black text-terracotta-dark leading-tight">
              {formatHarga(villa.harga_per_malam)}
            </span>
            {nightEstimate && (
              <span className="text-[10px] sm:text-xs text-stone font-bold">
                {nightEstimate}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone font-semibold block">
            {t("perNight")} {t("includesTax")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const formEl = document.getElementById("booking-card-sidebar");
            if (formEl) {
              formEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t("bookingButton")}</span>
        </button>
      </div>

      {/* Direct WhatsApp Confirmation Modal Dialog */}
      <AnimatePresence>
        {isBookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setIsBookingSuccess(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-stone hover:bg-sand/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-navy mb-2">
                  {t("bookingSuccessTitle")}
                </h3>
                <p className="text-stone text-sm leading-relaxed mb-6 font-medium">
                  {t("bookingSuccessDesc", {
                    villaName: villa.nama,
                    nights: activeNights,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    guests: guestCount,
                  })}
                </p>

                <div className="bg-cream rounded-2xl p-4 mb-6 border border-sand text-left space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone">Villa</span>
                    <span className="font-bold text-navy">{villa.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">WhatsApp Pemilik</span>
                    <span className="font-bold text-emerald-700">
                      +{villa.nomor_whatsapp_pemilik}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">Durasi</span>
                    <span className="font-bold text-navy">
                      {activeNights} Malam ({checkIn} → {checkOut})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">Tamu</span>
                    <span className="font-bold text-navy">
                      {guestCount} Orang
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sand font-black text-base">
                    <span className="text-navy">Total Estimasi</span>
                    <span className="text-terracotta-dark">
                      {formatHarga(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {ownerWALink && (
                    <a
                      href={ownerWALink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("openWhatsAppBtn")}
                    </a>
                  )}
                  <button
                    onClick={() => setIsBookingSuccess(false)}
                    className="w-full bg-sand/60 hover:bg-sand text-charcoal py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    {t("closeModal")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand shadow-2xl relative"
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-stone hover:bg-sand/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-left">
                <div className="w-12 h-12 rounded-2xl bg-terracotta/15 text-terracotta-dark flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-navy">
                  {t("shareTitle")}
                </h3>
                <p className="text-stone text-xs sm:text-sm mt-1 leading-relaxed">
                  {t("shareDesc")}
                </p>

                {/* Villa Mini Preview */}
                <div className="my-5 flex items-center gap-3 p-3 rounded-2xl bg-cream border border-sand">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-sand">
                    <Image
                      src={villa.galeri_foto[0]}
                      alt={villa.nama}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-navy truncate">
                      {villa.nama}
                    </h4>
                    <p className="text-xs text-stone truncate">{villa.lokasi}</p>
                    <span className="text-xs font-black text-terracotta-dark">
                      {formatHarga(villa.harga_per_malam)} / malam
                    </span>
                  </div>
                </div>

                {/* Copy Link Input */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-sand/40 border border-sand mb-4">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-transparent px-3 text-xs text-stone font-semibold truncate outline-none flex-1"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage-light" />
                        <span>{t("copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t("copyLink")}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Lihat villa cantik ini di Bali: ${villa.nama} — ${currentUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      currentUrl
                    )}&text=${encodeURIComponent(villa.nama)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      currentUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
