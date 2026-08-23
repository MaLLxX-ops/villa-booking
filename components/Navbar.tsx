"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, Building2, Globe, Coins } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySelector from "@/components/CurrencySelector";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-sand shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Authentic Logo */}
          <Link href="/" className="group shrink-0">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Logo size="md" />
            </motion.div>
          </Link>

          {/* Desktop Nav (>= md) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
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
            <Link
              href="/untuk-pemilik"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-terracotta" />
              {t("forOwners")}
            </Link>

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Global Booking CTA -> navigates to /cari to browse and select a villa */}
            <Link
              href="/cari"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-terracotta/25 hover:shadow-lg hover:shadow-terracotta/35 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              {t("bookingBtn")}
            </Link>
          </div>

          {/* Mobile Header Right Toolbar (< md): Currency, Language, Hamburger */}
          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            <CurrencySelector />
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-charcoal hover:bg-sand/60 transition-colors"
              aria-label="Menu navigasi"
            >
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-cream border-b border-sand shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
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
                href="/untuk-pemilik"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Building2 className="w-5 h-5 text-terracotta" />
                {t("forOwners")}
              </Link>

              {/* Mobile CTA */}
              <div className="pt-2">
                <Link
                  href="/cari"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-5 py-3 rounded-xl font-bold shadow-md w-full transition-all active:scale-98 cursor-pointer"
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
