"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Scale,
  ArrowLeft,
  X,
  Check,
  Minus,
  Search,
  BedDouble,
  Bath,
  Users,
  MapPin,
  Sparkles,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Villa, formatHarga } from "@/lib/data";
import { useCompare } from "@/context/CompareContext";
import { useCurrency } from "@/context/CurrencyContext";

interface ComparePageClientProps {
  villas: Villa[];
}

export default function ComparePageClient({ villas }: ComparePageClientProps) {
  const t = useTranslations("Compare");
  const { selectedIds, removeCompare, toggleCompare, clearCompare, count } =
    useCompare();
  const { formatEstimate } = useCurrency();

  const comparedVillas = useMemo(() => {
    return selectedIds
      .map((id) => villas.find((v) => v.id === id))
      .filter(Boolean) as Villa[];
  }, [villas, selectedIds]);

  // Non-compared villas available to add
  const availableVillas = useMemo(() => {
    return villas.filter((v) => !selectedIds.includes(v.id));
  }, [villas, selectedIds]);

  // Comprehensive list of all amenities present across compared villas
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    comparedVillas.forEach((v) => {
      v.fasilitas.forEach((f) => set.add(f));
    });
    return Array.from(set);
  }, [comparedVillas]);

  return (
    <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-charcoal hover:text-terracotta transition-colors text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-sand shadow-sm mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30 text-xs font-bold mb-3">
                <Scale className="w-3.5 h-3.5" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-2 text-stone text-base sm:text-lg max-w-2xl">
                {t("subtitle")}
              </p>
            </div>

            {comparedVillas.length > 0 && (
              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                <span className="text-xs font-black bg-cream-dark text-charcoal px-3.5 py-2 rounded-xl border border-sand">
                  {t("allVillasCompared", { count: comparedVillas.length })}
                </span>
                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-terracotta-dark hover:bg-terracotta/10 border border-terracotta/30 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  {t("clearAll")}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Empty State (< 2 villas selected) */}
        {comparedVillas.length < 2 ? (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-10 sm:p-14 border border-sand text-center max-w-2xl mx-auto shadow-sm"
            >
              <div className="w-20 h-20 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center mx-auto mb-6 text-navy">
                <Scale className="w-10 h-10" />
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
                  {t("selectVillasBtn")}
                </Link>
              </div>
            </motion.div>

            {/* Quick Pick from Catalog */}
            <div>
              <h3 className="text-xl font-bold text-navy mb-4">
                Pilih Cepat Villa untuk Dibandingkan:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableVillas.slice(0, 4).map((villa) => (
                  <div
                    key={villa.id}
                    className="bg-white rounded-2xl p-4 border border-sand shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={villa.galeri_foto[0]}
                          alt={villa.nama}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-navy truncate">
                          {villa.nama}
                        </h4>
                        <span className="text-xs text-terracotta font-black block">
                          {formatHarga(villa.harga_per_malam)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompare(villa.id)}
                      className="p-2 rounded-xl bg-cream hover:bg-terracotta hover:text-white text-navy transition-colors shrink-0"
                      title={t("addMoreBtn")}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Side-by-Side Comparison Table */
          <div className="bg-white rounded-3xl border border-sand shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-sand bg-cream/40">
                    <th className="p-4 sm:p-6 text-left w-48 sm:w-64 min-w-[180px] align-top text-navy font-black text-base sm:text-lg">
                      {t("feature")}
                    </th>
                    {comparedVillas.map((villa) => (
                      <th
                        key={villa.id}
                        className="p-4 sm:p-6 text-left min-w-[260px] sm:min-w-[300px] align-top relative border-l border-sand"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-terracotta/15 text-terracotta-dark">
                            {villa.kategori}
                          </span>
                          <button
                            onClick={() => removeCompare(villa.id)}
                            className="text-stone hover:text-terracotta p-1 rounded-lg hover:bg-sand/40 transition-colors"
                            title={t("removeColumn")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Villa Card Header */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 shadow-sm">
                          <Image
                            src={villa.galeri_foto[0]}
                            alt={villa.nama}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-navy line-clamp-1">
                          {villa.nama}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-stone font-medium mt-1">
                          <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                          <span className="truncate">{villa.lokasi}</span>
                        </div>
                      </th>
                    ))}

                    {/* Add Villa Placeholder Column if count < 3 */}
                    {comparedVillas.length < 3 && (
                      <th className="p-6 text-center min-w-[200px] align-middle border-l border-sand bg-cream-dark/30">
                        <Link
                          href="/cari"
                          className="inline-flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-sand hover:border-terracotta text-stone hover:text-terracotta transition-all group w-full"
                        >
                          <div className="w-10 h-10 rounded-full bg-sand/60 group-hover:bg-terracotta group-hover:text-white flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold">
                            {t("addMoreBtn")}
                          </span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-sand text-sm sm:text-base">
                  {/* Price Row */}
                  <tr className="hover:bg-cream/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-navy bg-cream/20">
                      {t("pricePerNight")}
                    </td>
                    {comparedVillas.map((villa) => {
                      const estimate = formatEstimate(villa.harga_per_malam);
                      return (
                        <td
                          key={villa.id}
                          className="p-4 sm:p-5 border-l border-sand"
                        >
                          <div className="text-lg sm:text-xl font-black text-terracotta-dark">
                            {formatHarga(villa.harga_per_malam)}
                          </div>
                          {estimate && (
                            <span className="text-xs font-bold text-stone">
                              {estimate}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>

                  {/* Location Row */}
                  <tr className="hover:bg-cream/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-navy bg-cream/20">
                      {t("location")}
                    </td>
                    {comparedVillas.map((villa) => (
                      <td
                        key={villa.id}
                        className="p-4 sm:p-5 border-l border-sand font-semibold text-charcoal"
                      >
                        {villa.lokasi}
                      </td>
                    ))}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>

                  {/* Bedrooms Row */}
                  <tr className="hover:bg-cream/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-navy bg-cream/20">
                      {t("bedrooms")}
                    </td>
                    {comparedVillas.map((villa) => (
                      <td
                        key={villa.id}
                        className="p-4 sm:p-5 border-l border-sand font-semibold text-charcoal"
                      >
                        <div className="flex items-center gap-2">
                          <BedDouble className="w-4 h-4 text-terracotta" />
                          <span>{villa.jumlah_kamar} Kamar</span>
                        </div>
                      </td>
                    ))}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>

                  {/* Bathrooms Row */}
                  <tr className="hover:bg-cream/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-navy bg-cream/20">
                      {t("bathrooms")}
                    </td>
                    {comparedVillas.map((villa) => (
                      <td
                        key={villa.id}
                        className="p-4 sm:p-5 border-l border-sand font-semibold text-charcoal"
                      >
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-sage-dark" />
                          <span>{villa.jumlah_kamar_mandi} Kamar Mandi</span>
                        </div>
                      </td>
                    ))}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>

                  {/* Guest Capacity Row */}
                  <tr className="hover:bg-cream/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-navy bg-cream/20">
                      {t("guests")}
                    </td>
                    {comparedVillas.map((villa) => (
                      <td
                        key={villa.id}
                        className="p-4 sm:p-5 border-l border-sand font-semibold text-charcoal"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-navy" />
                          <span>Maks {villa.kapasitas_tamu} Tamu</span>
                        </div>
                      </td>
                    ))}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>

                  {/* Section Divider: Amenities Matrix */}
                  <tr className="bg-cream-dark/50">
                    <td
                      colSpan={comparedVillas.length + (comparedVillas.length < 3 ? 2 : 1)}
                      className="p-4 font-black text-navy text-sm uppercase tracking-wider"
                    >
                      {t("amenities")}
                    </td>
                  </tr>

                  {/* Facility Checklist Rows */}
                  {allAmenities.map((amenity) => (
                    <tr
                      key={amenity}
                      className="hover:bg-cream/30 transition-colors"
                    >
                      <td className="p-3.5 sm:p-4 text-stone font-semibold bg-cream/20">
                        {amenity}
                      </td>
                      {comparedVillas.map((villa) => {
                        const hasFacility = villa.fasilitas.includes(amenity);
                        return (
                          <td
                            key={villa.id}
                            className="p-3.5 sm:p-4 border-l border-sand text-center"
                          >
                            {hasFacility ? (
                              <div className="w-6 h-6 rounded-full bg-sage/20 text-sage-dark flex items-center justify-center mx-auto">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-sand/30 text-stone-light flex items-center justify-center mx-auto">
                                <Minus className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                      {comparedVillas.length < 3 && (
                        <td className="border-l border-sand bg-cream-dark/10" />
                      )}
                    </tr>
                  ))}

                  {/* Action CTA Row */}
                  <tr className="bg-cream/40">
                    <td className="p-5 font-bold text-navy bg-cream/20">
                      Aksi
                    </td>
                    {comparedVillas.map((villa) => (
                      <td
                        key={villa.id}
                        className="p-5 border-l border-sand space-y-2.5"
                      >
                        <Link
                          href={`/villa/${villa.id}`}
                          className="block w-full text-center bg-navy hover:bg-navy-light text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm"
                        >
                          {t("viewDetail")}
                        </Link>
                      </td>
                    ))}
                    {comparedVillas.length < 3 && (
                      <td className="border-l border-sand bg-cream-dark/10" />
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
