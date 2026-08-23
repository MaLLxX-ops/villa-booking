"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot";
}

export default function AuthDrawer({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthDrawerProps) {
  const { user, signInWithGoogle, signInWithPassword, signUp, resetPassword } =
    useAuth();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form when opening or changing mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen, initialMode]);

  // Close automatically if user becomes authenticated
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const switchMode = (newMode: "login" | "register" | "forgot") => {
    setMode(newMode);
    clearMessages();
  };

  const handleGoogleLogin = async () => {
    clearMessages();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghubungkan ke Google. Silakan coba lagi.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Basic Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Email wajib diisi.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    if (mode === "forgot") {
      setIsSubmitting(true);
      try {
        await resetPassword(cleanEmail);
        setSuccessMessage(
          "Tautan reset password telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau spam."
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal mengirim link reset password.";
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage("Password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi password tidak cocok.");
        return;
      }

      setIsSubmitting(true);
      try {
        await signUp(cleanEmail, password, fullName.trim() || undefined);
        setSuccessMessage(
          "Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi akun jika verifikasi diaktifkan."
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Pendaftaran gagal. Silakan gunakan email lain atau coba lagi.";
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === "login") {
      setIsSubmitting(true);
      try {
        await signInWithPassword(cleanEmail, password);
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Email atau password yang Anda masukkan salah.";
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-xs cursor-pointer"
            aria-label="Tutup panel login"
          />

          {/* Slide-in Right Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-sand"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-sand bg-cream/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
                    {mode === "login" ? (
                      <LogIn className="w-4 h-4" />
                    ) : mode === "register" ? (
                      <UserPlus className="w-4 h-4" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-navy leading-tight">
                      {mode === "login"
                        ? "Masuk ke StayVilla"
                        : mode === "register"
                          ? "Daftar Akun Baru"
                          : "Reset Password"}
                    </h3>
                    <p className="text-[11px] text-stone font-semibold">
                      {mode === "login"
                        ? "Kelola booking & villa favorit Anda"
                        : mode === "register"
                          ? "Nikmati kemudahan sewa villa di Bali"
                          : "Masukkan email untuk menerima tautan reset"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-stone hover:text-charcoal hover:bg-sand/60 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Tabs (Masuk vs Daftar) */}
              {mode !== "forgot" && (
                <div className="px-6 pt-5">
                  <div className="flex p-1 rounded-xl bg-cream border border-sand">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        mode === "login"
                          ? "bg-white text-navy shadow-xs"
                          : "text-stone hover:text-charcoal"
                      }`}
                    >
                      Masuk
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        mode === "register"
                          ? "bg-white text-navy shadow-xs"
                          : "text-stone hover:text-charcoal"
                      }`}
                    >
                      Daftar
                    </button>
                  </div>
                </div>
              )}

              {/* Body Form */}
              <div className="p-6 space-y-4">
                {/* Back to Login link when in Forgot mode */}
                {mode === "forgot" && (
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline mb-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke menu Masuk</span>
                  </button>
                )}

                {/* Status Messages */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Full Name (Register only) */}
                  {mode === "register" && (
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1.5">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama Anda"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream text-xs sm:text-sm font-semibold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream text-xs sm:text-sm font-semibold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password (Login & Register) */}
                  {mode !== "forgot" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-charcoal">
                          Password
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => switchMode("forgot")}
                            className="text-[11px] font-bold text-terracotta hover:underline cursor-pointer"
                          >
                            Lupa password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand bg-cream text-xs sm:text-sm font-semibold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password (Register only) */}
                  {mode === "register" && (
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1.5">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand bg-cream text-xs sm:text-sm font-semibold text-charcoal focus:bg-white focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-terracotta text-white text-xs sm:text-sm font-bold shadow-md shadow-terracotta/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        {mode === "login" && <span>Masuk ke Akun</span>}
                        {mode === "register" && <span>Buat Akun Baru</span>}
                        {mode === "forgot" && (
                          <span>Kirim Tautan Reset Password</span>
                        )}
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sand" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-bold text-stone uppercase tracking-wider">
                    <span className="bg-white px-3">atau lanjutkan dengan</span>
                  </div>
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl border border-sand bg-white hover:bg-sand/30 text-charcoal text-xs sm:text-sm font-bold shadow-xs hover:border-stone/40 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Google</span>
                </button>
              </div>
            </div>

            {/* Footer Trust Info */}
            <div className="p-6 bg-cream/60 border-t border-sand text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Koneksi aman dengan enkripsi Supabase SSL</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
