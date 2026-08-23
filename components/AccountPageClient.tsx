"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Heart,
  Scale,
  LogOut,
  KeyRound,
  ExternalLink,
  Trash2,
  Sparkles,
  MapPin,
  BedDouble,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { formatHarga, type Villa } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useCurrency } from "@/context/CurrencyContext";

interface AccountPageClientProps {
  villas: Villa[];
}

export default function AccountPageClient({ villas }: AccountPageClientProps) {
  const { user, isLoading, signOut, resetPassword } = useAuth();
  const { savedIds, removeWishlist } = useWishlist();
  const { count: compareCount } = useCompare();
  const { formatEstimate } = useCurrency();
  const router = useRouter();
  const t = useTranslations("Account");

  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  // Protected Route: redirect to home and open login drawer if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/?auth=login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-16">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta mx-auto" />
          <p className="text-sm font-bold text-stone">
            {t("loadingAccount")}
          </p>
        </div>
      </div>
    );
  }

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Tamu StayVilla";
  const userEmail = user.email || "";
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const userInitial = userName.charAt(0).toUpperCase();

  const providers: string[] = user.app_metadata?.providers || [
    user.app_metadata?.provider || "email",
  ];
  const isGoogleLinked =
    providers.includes("google") ||
    user.identities?.some((i) => i.provider === "google");
  const isEmailLinked =
    providers.includes("email") ||
    user.identities?.some((i) => i.provider === "email");

  const createdAtFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  // Filter villas in wishlist
  const wishlistVillas = villas.filter((v) => savedIds.includes(v.id));

  const handlePasswordReset = async () => {
    if (!userEmail) return;
    setIsResetting(true);
    setResetMessage("");
    setResetError("");
    try {
      await resetPassword(userEmail);
      setResetMessage(t("resetSuccessMsg"));
    } catch (err: unknown) {
      setResetError(
        err instanceof Error ? err.message : t("resetErrorMsg")
      );
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/15 text-terracotta-dark text-xs font-bold border border-terracotta/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("dashboardBadge")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy tracking-tight">
            {t("greeting", { name: userName })}
          </h1>
          <p className="text-sm sm:text-base text-stone font-medium">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Profile Card & Key Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-sand">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-sand shrink-0">
                    <Image
                      src={avatarUrl}
                      alt={userName}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-navy to-terracotta text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md shrink-0">
                    {userInitial}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-navy">
                      {userName}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t("verifiedGuest")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-stone font-semibold">
                    <Mail className="w-4 h-4 text-terracotta shrink-0" />
                    <span>{userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Providers & Connection Badges */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {isGoogleLinked && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sand shadow-xs text-xs font-bold text-navy">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google Terhubung</span>
                  </div>
                )}

                {isEmailLinked && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream border border-sand text-xs font-bold text-charcoal">
                    <Mail className="w-3.5 h-3.5 text-terracotta" />
                    <span>Email & Password</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-cream/50 border border-sand space-y-1">
                <div className="flex items-center gap-2 text-stone font-bold">
                  <Calendar className="w-4 h-4 text-terracotta" />
                  <span>{t("memberSince")}</span>
                </div>
                <p className="font-bold text-navy text-sm">
                  {createdAtFormatted}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream/50 border border-sand space-y-1">
                <div className="flex items-center gap-2 text-stone font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t("accountStatus")}</span>
                </div>
                <p className="font-bold text-emerald-700 text-sm">
                  {isGoogleLinked && isEmailLinked
                    ? "Akun Terintegrasi (Email & Google)"
                    : t("activeAndSecure")}
                </p>
              </div>
            </div>

            {/* Password Reset Notice / Action */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sand/20 border border-sand/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-navy flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-terracotta" />
                    <span>{t("securityTitle")}</span>
                  </h4>
                  <p className="text-xs text-stone mt-0.5 font-medium">
                    {t("securitySubtitle")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResetting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-sand hover:border-terracotta text-xs font-bold text-charcoal hover:text-terracotta shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("sendingLink")}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t("sendResetEmailBtn")}</span>
                    </>
                  )}
                </button>
              </div>

              {resetMessage && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resetMessage}</span>
                </div>
              )}

              {resetError && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats & Logout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl p-6 border border-sand shadow-sm space-y-4">
              <h3 className="text-sm font-black text-navy uppercase tracking-wider">
                {t("activitySummary")}
              </h3>

              <div className="space-y-3">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-cream hover:bg-sand/40 border border-sand transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-terracotta text-terracotta" />
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-navy group-hover:text-terracotta transition-colors block">
                        {t("savedVillas")}
                      </span>
                      <span className="text-[11px] text-stone font-medium">
                        {t("viewAllWishlist")}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-terracotta-dark">
                    {savedIds.length}
                  </span>
                </Link>

                {compareCount > 0 && (
                  <Link
                    href="/bandingkan"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-cream hover:bg-sand/40 border border-sand transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-navy/15 text-navy flex items-center justify-center">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-navy group-hover:text-terracotta transition-colors block">
                          {t("comparedVillas")}
                        </span>
                        <span className="text-[11px] text-stone font-medium">
                          {t("viewComparison")}
                        </span>
                      </div>
                    </div>
                    <span className="text-base font-black text-navy">
                      {compareCount}
                    </span>
                  </Link>
                )}
              </div>

              <div className="pt-2 border-t border-sand">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("logoutBtn")}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wishlist Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy">
                {t("wishlistSectionTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-stone font-medium">
                {t("wishlistSectionSubtitle", { count: wishlistVillas.length })}
              </p>
            </div>

            {wishlistVillas.length > 0 && (
              <Link
                href="/wishlist"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline"
              >
                <span>{t("viewAllWishlist")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {wishlistVillas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistVillas.map((villa) => (
                <div
                  key={villa.id}
                  className="bg-white rounded-3xl overflow-hidden border border-sand shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Villa Thumbnail */}
                    <div className="relative aspect-[16/10] bg-sand">
                      <Image
                        src={
                          villa.galeri_foto[0] ||
                          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80"
                        }
                        alt={villa.nama}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeWishlist(villa.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone hover:text-red-600 hover:bg-white transition-colors shadow-sm cursor-pointer"
                        title={t("removeWishlistBtn")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-terracotta/15 text-terracotta-dark">
                          {villa.kategori}
                        </span>
                        <span className="text-xs font-black text-terracotta-dark">
                          {formatHarga(villa.harga_per_malam)}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-navy truncate">
                        {villa.nama}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-stone font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="truncate">{villa.lokasi}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-stone pt-2 border-t border-sand/60">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-terracotta" />
                          {villa.jumlah_kamar} kamar
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-navy" />
                          {villa.kapasitas_tamu} tamu
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/villa/${villa.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cream hover:bg-sand/60 text-navy font-bold text-xs border border-sand transition-colors"
                    >
                      <span>{t("viewDetailBtn")}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-terracotta" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sand text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sand/40 text-stone flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-navy">
                  {t("emptyWishlistTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-stone max-w-md mx-auto">
                  {t("emptyWishlistDesc")}
                </p>
              </div>
              <Link
                href="/cari"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
              >
                <Search className="w-4 h-4" />
                <span>{t("exploreVillasBtn")}</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
