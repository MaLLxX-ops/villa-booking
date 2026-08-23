"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Phone,
  MapPin,
  BedDouble,
  DollarSign,
  FileText,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/data";

export default function OwnersRegistrationForm() {
  const t = useTranslations("Owners");

  const [formData, setFormData] = useState({
    namaVilla: "",
    namaPemilik: "",
    nomorWA: "",
    lokasi: "",
    jumlahKamar: "3",
    rentangHarga: "",
    deskripsi: "",
    socialLink: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedWALink, setGeneratedWALink] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.namaVilla.trim())
      newErrors.namaVilla = "Nama villa wajib diisi";
    if (!formData.namaPemilik.trim())
      newErrors.namaPemilik = "Nama pemilik wajib diisi";
    if (!formData.nomorWA.trim())
      newErrors.nomorWA = "Nomor WhatsApp wajib diisi";
    if (!formData.lokasi.trim())
      newErrors.lokasi = "Lokasi villa wajib diisi";
    if (!formData.rentangHarga.trim())
      newErrors.rentangHarga = "Rentang harga per malam wajib diisi";
    if (!formData.deskripsi.trim())
      newErrors.deskripsi = "Deskripsi singkat wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format WhatsApp message to Admin (082163240141)
    const cleanWA = formData.nomorWA.replace(/[^0-9+]/g, "");
    const message = `*PENDAFTARAN VILLA BARU — STAYVILLA* 🌴✨

Halo Admin StayVilla, saya ingin mendaftarkan properti villa saya untuk kanal booking langsung:

📋 *Detail Properti:*
• *Nama Villa:* ${formData.namaVilla}
• *Nama Pemilik/Pengelola:* ${formData.namaPemilik}
• *WhatsApp Pemilik:* ${cleanWA}
• *Lokasi:* ${formData.lokasi}
• *Jumlah Kamar:* ${formData.jumlahKamar} Kamar
• *Rentang Harga:* ${formData.rentangHarga} / malam

📝 *Deskripsi & Keunggulan:*
${formData.deskripsi}

🌐 *Social Media / Website:*
${formData.socialLink.trim() || "-"}

Mohon konfirmasi langkah verifikasi & kurasi listing selanjutnya. Terima kasih!`;

    const waUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    setGeneratedWALink(waUrl);
    setIsSubmitted(true);

    // Open WhatsApp in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand shadow-xl shadow-navy/8">
      {/* Header Form */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark text-xs font-bold mb-3 border border-terracotta/30">
          <Sparkles className="w-3.5 h-3.5" />
          {t("adminNumberBadge")}
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
          {t("formTitle")}
        </h3>
        <p className="mt-2 text-stone text-sm sm:text-base font-medium">
          {t("formSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nama Villa */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5">
              {t("labelVillaName")} <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
                errors.namaVilla
                  ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                  : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
              }`}
            >
              <Building2 className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                name="namaVilla"
                placeholder={t("phVillaName")}
                value={formData.namaVilla}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
              />
            </div>
            {errors.namaVilla && (
              <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.namaVilla}
              </p>
            )}
          </div>

          {/* Nama Pemilik */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5">
              {t("labelOwnerName")} <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
                errors.namaPemilik
                  ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                  : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
              }`}
            >
              <User className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                name="namaPemilik"
                placeholder={t("phOwnerName")}
                value={formData.namaPemilik}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
              />
            </div>
            {errors.namaPemilik && (
              <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.namaPemilik}
              </p>
            )}
          </div>

          {/* WhatsApp Pemilik */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5 flex items-center justify-between">
              <span>
                {t("labelWhatsApp")} <span className="text-red-500">*</span>
              </span>
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
                errors.nomorWA
                  ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                  : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
              }`}
            >
              <Phone className="w-4 h-4 text-sage-dark shrink-0" />
              <input
                type="tel"
                name="nomorWA"
                placeholder={t("phWhatsApp")}
                value={formData.nomorWA}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
              />
            </div>
            <p className="text-[11px] text-stone mt-1">{t("waHelper")}</p>
            {errors.nomorWA && (
              <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nomorWA}
              </p>
            )}
          </div>

          {/* Lokasi Villa */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5">
              {t("labelLocation")} <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
                errors.lokasi
                  ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                  : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
              }`}
            >
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <input
                type="text"
                name="lokasi"
                placeholder={t("phLocation")}
                value={formData.lokasi}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
              />
            </div>
            {errors.lokasi && (
              <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.lokasi}
              </p>
            )}
          </div>

          {/* Jumlah Kamar */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5">
              {t("labelBedrooms")} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
              <BedDouble className="w-4 h-4 text-terracotta shrink-0" />
              <select
                name="jumlahKamar"
                value={formData.jumlahKamar}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} Kamar Tidur
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rentang Harga per Malam */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1.5">
              {t("labelPriceRange")} <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-cream transition-all ${
                errors.rentangHarga
                  ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                  : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
              }`}
            >
              <DollarSign className="w-4 h-4 text-sage-dark shrink-0" />
              <input
                type="text"
                name="rentangHarga"
                placeholder={t("phPriceRange")}
                value={formData.rentangHarga}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
              />
            </div>
            {errors.rentangHarga && (
              <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.rentangHarga}
              </p>
            )}
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="text-xs font-bold text-charcoal block mb-1.5">
            {t("labelDesc")} <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-start gap-2 p-4 rounded-xl border bg-cream transition-all ${
              errors.deskripsi
                ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                : "border-sand focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15"
            }`}
          >
            <FileText className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <textarea
              name="deskripsi"
              rows={3}
              placeholder={t("phDesc")}
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none resize-none"
            />
          </div>
          {errors.deskripsi && (
            <p className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.deskripsi}
            </p>
          )}
        </div>

        {/* Instagram / Website Link */}
        <div>
          <label className="text-xs font-bold text-charcoal block mb-1.5">
            {t("labelSocial")}
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand bg-cream focus-within:bg-white focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15 transition-all">
            <Instagram className="w-4 h-4 text-stone shrink-0" />
            <input
              type="text"
              name="socialLink"
              placeholder={t("phSocial")}
              value={formData.socialLink}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-charcoal font-semibold outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 text-center space-y-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-10 py-4 rounded-2xl font-black text-base shadow-lg shadow-terracotta/25 hover:shadow-xl hover:shadow-terracotta/35 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
            {t("submitBtn")}
          </motion.button>
          <p className="text-xs text-stone font-medium max-w-lg mx-auto">
            {t("submitNotice")}
          </p>
        </div>
      </form>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-8 p-6 rounded-2xl bg-sage/15 border border-sage/40 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-sage-dark text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-navy">
              Pendaftaran Anda Siap Dikirim ke WhatsApp Admin!
            </h4>
            <p className="text-sm text-charcoal max-w-md mx-auto font-medium">
              Jika aplikasi WhatsApp tidak otomatis terbuka, silakan klik tombol
              di bawah untuk melanjutkan pengiriman data pendaftaran Anda.
            </p>
            {generatedWALink && (
              <a
                href={generatedWALink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-sage-dark hover:bg-navy text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Buka WhatsApp Admin (0821-6324-0141)
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
