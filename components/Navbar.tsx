"use client";

import { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
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
  User as UserIcon,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySelector from "@/components/CurrencySelector";
import Logo from "@/components/Logo";
import AuthDrawer from "@/components/AuthDrawer";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { user, isLoading: isAuthLoading, signOut } = useAuth();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for ?auth=login or custom event to open AuthDrawer automatically (only when not logged in)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (!user && (authParam === "login" || authParam === "register")) {
        setAuthMode(authParam);
        setIsAuthDrawerOpen(true);
      }

      const handleAuthEvent = (e: Event) => {
        const customEvent = e as CustomEvent<{ mode?: "login" | "register" }>;
        if (!user) {
          setAuthMode(customEvent.detail?.mode || "login");
          setIsAuthDrawerOpen(true);
        }
      };
      window.addEventListener("stayvilla:open-auth", handleAuthEvent);
      return () =>
        window.removeEventListener("stayvilla:open-auth", handleAuthEvent);
    }
  }, [pathname, user]);

  // Clean URL query parameters once user is logged in
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("auth") || url.searchParams.has("error")) {
        url.searchParams.delete("auth");
        url.searchParams.delete("error");
        window.history.replaceState(
          {},
          "",
          url.pathname + (url.search ? url.search : "")
        );
      }
    }
  }, [user]);

  const openAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthDrawerOpen(true);
    setIsMobileNavOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileNavOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Tamu";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/cari", label: t("search"), icon: Search },
    { href: "/peta", label: t("map"), icon: Map },
    { href: "/#listing", label: t("collection"), icon: Sparkles },
    { href: "/untuk-pemilik", label: t("forOwners"), icon: Building2 },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-sand shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6 xl:gap-8">
            {/* ZONA 1: Brand Logo (Left) */}
            <div className="flex items-center shrink-0 min-w-[130px] xl:min-w-[160px]">
              <Link href="/" className="group" aria-label="StayVilla Home">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Logo size="md" />
                </motion.div>
              </Link>
            </div>

            {/* ZONA 2: Main Navigation Tabs (Center Floating Pill - Desktop >= lg) */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-4">
              <div className="inline-flex items-center gap-1 xl:gap-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md border border-sand/80 shadow-xs hover:border-terracotta/30 transition-all">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href.replace("/#", "/"));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 xl:px-4 py-1.5 rounded-full text-xs xl:text-sm font-bold transition-all ${
                        isActive
                          ? "bg-terracotta text-white shadow-xs shadow-terracotta/20"
                          : "text-charcoal/80 hover:text-terracotta hover:bg-cream"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ZONA 3: Action Cluster & User Status (Right - Desktop >= md) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 xl:gap-3 shrink-0">
              {/* Wishlist Link with Badge */}
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
                    className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Compare Link with Badge */}
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
                    className="absolute -top-0.5 -right-0.5 bg-navy text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {compareCount}
                  </motion.span>
                </Link>
              )}

              {/* Currency & Language Selectors */}
              <div className="flex items-center gap-1">
                <CurrencySelector />
                <LanguageSwitcher />
              </div>

              {/* User Account / Login Button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-bold text-charcoal hover:border-terracotta shadow-xs transition-all cursor-pointer"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-black text-white">
                      {userInitial}
                    </span>
                    <span className="max-w-28 truncate">{userName}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-stone transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-sand z-50 space-y-1 text-xs"
                      >
                        <div className="px-3 py-2 border-b border-sand/60">
                          <p className="font-bold text-navy truncate">
                            {userName}
                          </p>
                          <p className="text-[11px] text-stone truncate font-medium">
                            {userEmail}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-charcoal font-semibold hover:bg-sand/40 hover:text-terracotta transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-terracotta" />
                          <span>Akun Saya</span>
                        </Link>

                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-charcoal font-semibold hover:bg-sand/40 hover:text-terracotta transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-terracotta" />
                            <span>Wishlist Saya</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="bg-terracotta text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          href="/bandingkan"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-charcoal font-semibold hover:bg-sand/40 hover:text-terracotta transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Scale className="w-4 h-4 text-terracotta" />
                            <span>Bandingkan Villa</span>
                          </div>
                          {compareCount > 0 && (
                            <span className="bg-navy text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                              {compareCount}
                            </span>
                          )}
                        </Link>

                        <div className="border-t border-sand/60 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar (Logout)</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  disabled={isAuthLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3.5 py-1.5 text-xs font-bold text-charcoal hover:border-terracotta hover:text-terracotta shadow-xs transition-all cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-terracotta" />
                  <span>Masuk</span>
                </button>
              )}

              {/* Global CTA Button */}
              <Link
                href="/cari"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-4 py-2 rounded-full font-bold text-xs xl:text-sm shadow-md shadow-terracotta/25 hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t("bookingBtn")}</span>
              </Link>
            </div>

            {/* Mobile Header Right Toolbar (< md) */}
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

              {/* Quick Mobile User Button */}
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-black text-white"
                  aria-label="Profil Akun"
                >
                  {userInitial}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="p-1.5 text-charcoal hover:bg-sand/60 rounded-xl"
                  aria-label="Masuk Akun"
                >
                  <LogIn className="h-5 w-5 text-terracotta" />
                </button>
              )}

              {/* Hamburger Button (< md) */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="p-1.5 rounded-xl text-charcoal hover:bg-sand/60 transition-colors cursor-pointer"
                aria-label="Menu navigasi"
              >
                {isMobileNavOpen ? (
                  <X className="w-6 h-6 text-charcoal" />
                ) : (
                  <Menu className="w-6 h-6 text-charcoal" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Slide-in Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-[95] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-sand z-10"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-sand bg-cream/50">
                  <Logo size="sm" />
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-2 rounded-xl text-stone hover:text-charcoal hover:bg-sand/60 transition-colors cursor-pointer"
                    aria-label="Tutup menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Profile Card inside Mobile Drawer */}
                <div className="p-4 border-b border-sand bg-cream/30">
                  {user ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-black text-sm shrink-0">
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-navy truncate">
                            {userName}
                          </h4>
                          <p className="text-xs text-stone truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-sand text-xs font-bold text-terracotta hover:border-terracotta shrink-0"
                      >
                        Akun
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-3.5 border border-sand shadow-xs space-y-2">
                      <p className="text-xs font-bold text-navy">
                        Masuk untuk kelola pesanan & wishlist Anda
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openAuth("login")}
                          className="flex-1 py-2 px-3 rounded-xl bg-terracotta text-white text-xs font-bold text-center shadow-xs cursor-pointer"
                        >
                          Masuk
                        </button>
                        <button
                          type="button"
                          onClick={() => openAuth("register")}
                          className="flex-1 py-2 px-3 rounded-xl bg-cream border border-sand text-charcoal text-xs font-bold text-center cursor-pointer"
                        >
                          Daftar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav Links */}
                <div className="p-3 space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <Home className="w-4 h-4 text-terracotta" />
                    <span>{t("home")}</span>
                  </Link>

                  <Link
                    href="/cari"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <Search className="w-4 h-4 text-terracotta" />
                    <span>{t("search")}</span>
                  </Link>

                  <Link
                    href="/peta"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <Map className="w-4 h-4 text-terracotta" />
                    <span>{t("map")}</span>
                  </Link>

                  <Link
                    href="/#listing"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-terracotta" />
                    <span>{t("collection")}</span>
                  </Link>

                  <Link
                    href="/untuk-pemilik"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-terracotta" />
                    <span>{t("forOwners")}</span>
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-terracotta" />
                    <span>Pusat Bantuan</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-terracotta" />
                      <span>{t("wishlist")}</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-terracotta text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/bandingkan"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-sand/40 text-charcoal font-semibold text-sm transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-terracotta" />
                      <span>{t("compare")}</span>
                    </div>
                    {compareCount > 0 && (
                      <span className="bg-navy text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-sand bg-cream/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone">
                    Pilihan Bahasa:
                  </span>
                  <LanguageSwitcher />
                </div>

                <Link
                  href="/cari"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md w-full transition-all active:scale-98 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("bookingNowBtn")}</span>
                </Link>

                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-red-600 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Auth Slide-in Right Drawer */}
      <AuthDrawer
        isOpen={isAuthDrawerOpen}
        onClose={() => setIsAuthDrawerOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
