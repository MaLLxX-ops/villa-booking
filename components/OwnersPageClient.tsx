"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  MessageCircle,
  Percent,
  Layers,
  HelpCircle,
} from "lucide-react";
import OwnersRegistrationForm from "@/components/OwnersRegistrationForm";

export default function OwnersPageClient() {
  const t = useTranslations("Owners");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const scrollToForm = () => {
    const el = document.getElementById("form-pendaftaran");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHow = () => {
    const el = document.getElementById("cara-kerja");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    {
      num: t("step1Num"),
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: Layers,
    },
    {
      num: t("step2Num"),
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: Sparkles,
    },
    {
      num: t("step3Num"),
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: TrendingUp,
    },
    {
      num: t("step4Num"),
      title: t("step4Title"),
      desc: t("step4Desc"),
      icon: MessageCircle,
    },
  ];

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-cream via-cream to-cream-dark border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/15 text-terracotta-dark text-xs sm:text-sm font-bold mb-6 border border-terracotta/30 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            {t("heroBadge")}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy tracking-tight max-w-4xl mx-auto leading-tight"
          >
            {t("heroTitle")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-stone max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-terracotta/25 hover:shadow-xl hover:shadow-terracotta/35 transition-all cursor-pointer"
            >
              {t("ctaRegister")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToHow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-navy border border-sand hover:border-navy px-8 py-4 rounded-2xl font-black text-base shadow-xs hover:bg-cream transition-all cursor-pointer"
            >
              {t("ctaLearnMore")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION CARA KERJA */}
      <section id="cara-kerja" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              {t("howTitle")}
            </h2>
            <p className="mt-3 text-stone text-base sm:text-lg font-medium">
              {t("howSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-sand shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-terracotta/40 group-hover:text-terracotta transition-colors">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-navy group-hover:bg-terracotta group-hover:text-white transition-colors">
                      <step.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone text-sm leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION PERBANDINGAN SEDERHANA */}
      <section className="py-20 bg-cream-dark border-y border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              {t("compTitle")}
            </h2>
            <p className="mt-3 text-stone text-base sm:text-lg font-medium">
              {t("compSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* OTA Konvensional Card */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 border border-sand/80 shadow-sm flex flex-col justify-between opacity-90"
            >
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-stone bg-sand/60 px-3 py-1 rounded-full">
                  Komparasi
                </span>
                <h3 className="text-xl font-black text-charcoal mt-4 mb-2">
                  {t("otaCardTitle")}
                </h3>
                <div className="my-6 p-5 rounded-2xl bg-cream border border-sand text-center">
                  <span className="text-3xl sm:text-4xl font-black text-red-600">
                    {t("otaCommission")}
                  </span>
                  <p className="text-xs text-stone font-bold mt-1">
                    {t("otaCommissionSub")}
                  </p>
                </div>
                <ul className="space-y-3.5 text-sm text-stone font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{t("otaPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{t("otaPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{t("otaPoint3")}</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* StayVilla Highlight Card */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-b from-navy to-navy/95 text-white rounded-3xl p-8 border-2 border-terracotta shadow-2xl shadow-navy/20 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-terracotta text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                Kanal Tambahan
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gold-light bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  StayVilla Partner
                </span>
                <h3 className="text-xl font-black text-white mt-4 mb-2">
                  {t("stayvillaCardTitle")}
                </h3>
                <div className="my-6 p-5 rounded-2xl bg-white/10 border border-white/15 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-gold-light">
                    {t("stayvillaCommission")}
                  </span>
                  <p className="text-xs text-sand font-semibold mt-1">
                    {t("stayvillaCommissionSub")}
                  </p>
                </div>
                <ul className="space-y-3.5 text-sm text-sand font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                    <span>{t("stayvillaPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                    <span>{t("stayvillaPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                    <span>{t("stayvillaPoint3")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                    <span className="font-bold text-white">
                      {t("stayvillaPoint4")}
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. SECTION FAQ */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta bg-terracotta/15 px-3.5 py-1.5 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              {t("faqTitle")}
            </h2>
            <p className="mt-3 text-stone text-base font-medium">
              {t("faqSubtitle")}
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-sand shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-navy hover:text-terracotta-dark transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-terracotta shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-stone text-sm sm:text-base font-medium leading-relaxed border-t border-sand/60 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION FORM PENDAFTARAN */}
      <section id="form-pendaftaran" className="py-20 bg-cream-dark border-t border-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OwnersRegistrationForm />
        </div>
      </section>
    </div>
  );
}
