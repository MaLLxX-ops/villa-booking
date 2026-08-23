"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, Phone } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-sand shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center shadow-md shadow-terracotta/25"
            >
              <Home className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              <span className="text-navy">Stay</span>
              <span className="text-terracotta">Villa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm"
            >
              {t("home")}
            </Link>
            <Link
              href="/cari"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm"
            >
              {t("search")}
            </Link>
            <Link
              href="/#listing"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm"
            >
              {t("collection")}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Booking Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/cari"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-terracotta/25 hover:shadow-lg hover:shadow-terracotta/35 transition-all"
              >
                <Search className="w-4 h-4" />
                {t("bookingBtn")}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Right Bar: Language Switcher + Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-charcoal hover:bg-sand/60 transition-colors"
              aria-label="Menu navigasi"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-cream border-b border-sand shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Home className="w-5 h-5 text-terracotta" />
                {t("home")}
              </Link>
              <Link
                href="/cari"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Search className="w-5 h-5 text-terracotta" />
                {t("search")}
              </Link>
              <Link
                href="/#listing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Phone className="w-5 h-5 text-terracotta" />
                {t("contact")}
              </Link>
              <div className="pt-2">
                <Link
                  href="/cari"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-5 py-3 rounded-full font-bold shadow-md w-full"
                >
                  <Search className="w-4 h-4" />
                  {t("bookingNowBtn")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
