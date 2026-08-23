"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center shadow-lg shadow-terracotta/20 group-hover:shadow-terracotta/40 transition-shadow">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-navy">Stay</span>
              <span className="text-terracotta">Villa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-stone hover:text-terracotta transition-colors font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/cari"
              className="text-stone hover:text-terracotta transition-colors font-medium"
            >
              Cari Villa
            </Link>
            <Link
              href="/#listing"
              className="text-stone hover:text-terracotta transition-colors font-medium"
            >
              Koleksi
            </Link>
            <Link
              href="/cari"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-5 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-terracotta/30 transition-all hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              Booking
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sand/50 transition-colors"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-xl border-b border-sand/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/50 text-stone hover:text-terracotta transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                Beranda
              </Link>
              <Link
                href="/cari"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/50 text-stone hover:text-terracotta transition-colors font-medium"
              >
                <Search className="w-5 h-5" />
                Cari Villa
              </Link>
              <Link
                href="/#listing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/50 text-stone hover:text-terracotta transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </Link>
              <div className="pt-2">
                <Link
                  href="/cari"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark text-white px-5 py-3 rounded-full font-medium w-full"
                >
                  <Search className="w-4 h-4" />
                  Booking Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
