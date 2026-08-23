"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  CreditCard,
  Building2,
  Calendar,
  Search,
  Phone,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/data";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "payment" | "host";
}

export default function HelpPageClient() {
  const t = useTranslations("Help");
  const tDetail = useTranslations("Detail");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<string[]>(["booking-1", "payment-1"]);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQItem[] = [
    // Category: Booking & Reservations
    {
      id: "booking-1",
      question: t("qBookingFlow"),
      answer: t("aBookingFlow"),
      category: "booking",
    },
    {
      id: "booking-2",
      question: t("qNoReply"),
      answer: t("aNoReply"),
      category: "booking",
    },
    {
      id: "booking-3",
      question: t("qCancellation"),
      answer: t("aCancellation"),
      category: "booking",
    },

    // Category: Payments & Pricing
    {
      id: "payment-1",
      question: t("qPaymentOnSite"),
      answer: t("aPaymentOnSite"),
      category: "payment",
    },
    {
      id: "payment-2",
      question: t("qPriceFinal"),
      answer: t("aPriceFinal"),
      category: "payment",
    },
    {
      id: "payment-3",
      question: t("qCurrency"),
      answer: t("aCurrency"),
      category: "payment",
    },

    // Category: Hosts & Support
    {
      id: "host-1",
      question: t("qListVilla"),
      answer: t("aListVilla"),
      category: "host",
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat =
      activeCategory === "all" || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const categories = [
    { key: "all", label: t("allCategories"), icon: HelpCircle },
    { key: "booking", label: t("catBooking"), icon: Calendar },
    { key: "payment", label: t("catPayment"), icon: CreditCard },
    { key: "host", label: t("catHost"), icon: Building2 },
  ];

  const adminWaUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Admin StayVilla, saya ingin bertanya seputar pemesanan villa di Bali."
  )}`;

  return (
    <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone hover:text-terracotta-dark transition-colors text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{tDetail("backHome")}</span>
          </Link>
        </div>

        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-6 sm:p-12 border border-sand shadow-sm mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/15 text-terracotta-dark border border-terracotta/30 text-xs font-black uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-stone text-base sm:text-lg max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Quick Search */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cream border border-sand text-sm font-semibold text-charcoal placeholder:text-stone focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-navy text-white shadow-md shadow-navy/20"
                    : "bg-white text-charcoal hover:bg-sand/40 border border-sand"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold-light" : "text-terracotta"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-sand text-center">
              <HelpCircle className="w-10 h-10 text-stone mx-auto mb-3 opacity-60" />
              <h3 className="font-bold text-navy text-lg">
                {t("emptyFaqTitle")}
              </h3>
              <p className="text-stone text-sm mt-1">
                {t("emptyFaqDesc")}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-cream/20 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-xl bg-terracotta/10 text-terracotta-dark font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q
                      </span>
                      <h3 className="font-bold text-base sm:text-lg text-navy text-left leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full bg-cream flex items-center justify-center shrink-0 border border-sand transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-terracotta/15 text-terracotta-dark" : "text-charcoal"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-stone text-sm sm:text-base leading-relaxed border-t border-sand/40 pl-14 sm:pl-16">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Contact & Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Support Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sage/15 text-sage-dark flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-navy">
                {t("stillNeedHelpTitle")}
              </h3>
              <p className="mt-2 text-stone text-sm leading-relaxed">
                {t("stillNeedHelpDesc")}
              </p>
            </div>

            <div className="mt-6">
              <a
                href={adminWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sage-dark to-sage hover:from-sage hover:to-sage-dark text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>{t("chatAdminBtn")}</span>
              </a>
            </div>
          </div>

          {/* Villa Host CTA Box */}
          <div className="bg-navy rounded-3xl p-6 sm:p-8 border border-white/10 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-light flex items-center justify-center mb-4 border border-gold-light/30">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t("forOwnersCta")}
              </h3>
              <p className="mt-2 text-cream/80 text-sm leading-relaxed">
                {t("forOwnersCtaDesc")}
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/untuk-pemilik"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-terracotta/30 transition-all hover:scale-102 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t("forOwnersBtn")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
