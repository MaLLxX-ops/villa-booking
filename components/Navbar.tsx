"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  Building2,
  Heart,
  Map,
  Scale,
  LogIn,
  LogOut,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySelector from "@/components/CurrencySelector";
import Logo from "@/components/Logo";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { user, isLoading: isAuthLoading, signInWithGoogle, signOut } = useAuth();
  const [authError, setAuthError] = useState("");

  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch {
      setAuthError("Login Google gagal. Silakan coba lagi.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      setAuthError("Logout gagal. Silakan coba lagi.");
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || "Tamu";
  const userInitial = userName.charAt(0).toUpperCase();

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
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
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
              href="/peta"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm flex items-center gap-1"
            >
              <Map className="w-3.5 h-3.5 text-terracotta" />
              {t("map")}
            </Link>
            <Link
              href="/#listing"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm"
            >
              {t("collection")}
            </Link>
            <Link
              href="/untuk-pemilik"
              className="text-charcoal hover:text-terracotta font-semibold transition-colors text-sm flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-terracotta" />
              {t("forOwners")}
            </Link>

            {/* Wishlist Link with Dynamic Badge */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-charcoal hover:text-terracotta hover:bg-sand/40 transition-colors"
              title={t("wishlist")}
              aria-label={t("wishlist")}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  wishlistCount > 0
                    ? "fill-terracotta text-terracotta"
                    : "text-charcoal"
                }`}
              />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Compare Link with Dynamic Badge (if any selected) */}
            {compareCount > 0 && (
              <Link
                href="/bandingkan"
                className="relative p-2 rounded-full text-charcoal hover:text-terracotta hover:bg-sand/40 transition-colors"
                title={t("compare")}
                aria-label={t("compare")}
              >
                <Scale className="w-5 h-5 text-terracotta" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-navy text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                >
                  {compareCount}
                </motion.span>
              </Link>
            )}

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {user ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3 py-2 text-xs font-bold text-charcoal hover:border-terracotta"
                title="Logout"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs text-white">
                  {userInitial}
                </span>
                <span className="max-w-24 truncate">{userName}</span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3 py-2 text-xs font-bold text-charcoal hover:border-terracotta disabled:opacity-60"
              >
                <LogIn className="h-4 w-4 text-terracotta" />
                Login dengan Google
              </button>
            )}

            {/* Global Booking CTA */}
            <Link
              href="/cari"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-4 py-2 rounded-full font-bold text-sm shadow-md shadow-terracotta/25 hover:shadow-lg hover:shadow-terracotta/35 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              {t("bookingBtn")}
            </Link>
          </div>

          {/* Mobile Header Right Toolbar (< md): Wishlist Icon, Currency, Language, Hamburger */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:hidden">
            <Link
              href="/wishlist"
              className="relative p-1.5 rounded-xl text-charcoal hover:bg-sand/60 transition-colors"
              aria-label={t("wishlist")}
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlistCount > 0
                    ? "fill-terracotta text-terracotta"
                    : "text-charcoal"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-terracotta text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <CurrencySelector />
            <LanguageSwitcher />
            {user ? (
              <button
                onClick={handleLogout}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-black text-white"
                aria-label="Logout"
                title={`Logout ${userName}`}
              >
                {userInitial}
              </button>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="rounded-xl p-1.5 text-charcoal hover:bg-sand/60 disabled:opacity-60"
                aria-label="Login dengan Google"
                title="Login dengan Google"
              >
                <LogIn className="h-5 w-5" />
              </button>
            )}
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

              {authError && (
                <p className="px-4 text-xs font-bold text-red-600">{authError}</p>
              )}
              <Link
                href="/cari"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Search className="w-5 h-5 text-terracotta" />
                {t("search")}
              </Link>
              <Link
                href="/peta"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <Map className="w-5 h-5 text-terracotta" />
                {t("map")}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-terracotta" />
                  <span>{t("wishlist")}</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-terracotta text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/bandingkan"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-sand/60 text-charcoal font-semibold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-terracotta" />
                  <span>{t("compare")}</span>
                </div>
                {compareCount > 0 && (
                  <span className="bg-navy text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {compareCount}
                  </span>
                )}
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
