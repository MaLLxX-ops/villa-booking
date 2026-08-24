"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, Locale } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check, Coins } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";

interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "id", label: "Indonesia", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "zh", label: "Chinese", nativeLabel: "简体中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
];

export default function LocaleCurrencySelector() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");
  const { currency, setCurrency } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"currency" | "language">("language");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCurrency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) ||
    SUPPORTED_CURRENCIES[0];
  const activeLang =
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

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Combined Trigger Button: e.g. "USD · EN" */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border border-sand/80 hover:border-terracotta/40 text-charcoal font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
        aria-label="Language and Currency Settings"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{activeLang.flag}</span>
        <span className="font-extrabold uppercase tracking-wide text-navy">
          {activeCurrency.code}
        </span>
        <span className="text-stone/40 font-light">·</span>
        <span className="font-extrabold uppercase tracking-wide text-stone">
          {activeLang.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone transition-transform duration-200 ${
            isOpen ? "rotate-180 text-terracotta" : ""
          }`}
        />
      </motion.button>

      {/* Popover Dropdown with Tabs */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl p-2.5 shadow-2xl border border-sand z-50 overflow-hidden"
          >
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-cream rounded-xl mb-2.5 border border-sand/50">
              <button
                type="button"
                onClick={() => setActiveTab("language")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "language"
                    ? "bg-white text-terracotta-dark shadow-xs"
                    : "text-stone hover:text-charcoal"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t("language")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("currency")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "currency"
                    ? "bg-white text-terracotta-dark shadow-xs"
                    : "text-stone hover:text-charcoal"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{t("currency")}</span>
              </button>
            </div>

            {/* Language Tab Content */}
            {activeTab === "language" && (
              <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-none">
                {languages.map((lang) => {
                  const isActive = lang.code === currentLocale;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                        isActive
                          ? "bg-terracotta/10 text-terracotta-dark font-black"
                          : "hover:bg-cream text-charcoal font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <span>{lang.nativeLabel}</span>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Currency Tab Content */}
            {activeTab === "currency" && (
              <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-none">
                {SUPPORTED_CURRENCIES.map((c) => {
                  const isActive = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectCurrency(c.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                        isActive
                          ? "bg-terracotta/10 text-terracotta-dark font-black"
                          : "hover:bg-cream text-charcoal font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{c.flag}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold">{c.code}</span>
                          <span className="text-[10px] text-stone">({c.symbol})</span>
                        </div>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
