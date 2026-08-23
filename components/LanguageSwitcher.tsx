"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, Locale } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "id", label: "Indonesia", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", nativeLabel: "English (US)", flag: "🇬🇧" },
  { code: "fr", label: "Français", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "zh", label: "Chinese", nativeLabel: "简体中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
];

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    languages.find((l) => l.code === currentLocale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-sand/80 text-charcoal font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        aria-label={t("language")}
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="font-extrabold uppercase tracking-wide text-navy hidden sm:inline">
          {currentLang.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone transition-transform duration-200 ${
            isOpen ? "rotate-180 text-terracotta" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-1.5 shadow-xl border border-sand z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-sand/50 mb-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-stone uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-terracotta" />
                <span>{t("language")}</span>
              </div>
            </div>

            <div className="space-y-0.5 max-h-64 overflow-y-auto scrollbar-none">
              {languages.map((lang) => {
                const isActive = lang.code === currentLocale;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs sm:text-sm ${
                      isActive
                        ? "bg-terracotta/10 text-terracotta-dark font-black"
                        : "hover:bg-cream text-charcoal font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span className="font-bold">{lang.nativeLabel}</span>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-terracotta shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
