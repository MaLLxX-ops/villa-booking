"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Flame, ArrowRight } from "lucide-react";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";
import { Link } from "@/i18n/routing";

interface TrendingSectionProps {
  villas: Villa[];
}

export default function TrendingSection({ villas }: TrendingSectionProps) {
  const t = useTranslations("Trending");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pick 4-5 popular/trending villas
  const trendingVillas = villas.slice(0, 5);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 bg-cream border-t border-sand relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-black mb-3">
              <Flame className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{t("badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-2 text-stone text-base sm:text-lg max-w-xl">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Controls & CTA Link */}
          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <Link
              href="/cari"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-terracotta hover:text-terracotta-dark transition-colors mr-2 group"
            >
              <span>{t("viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Scroll Buttons for Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full bg-white hover:bg-cream-dark border border-sand text-charcoal flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full bg-white hover:bg-cream-dark border border-sand text-charcoal flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trendingVillas.map((villa, index) => (
            <div
              key={villa.id}
              className="min-w-[280px] sm:min-w-[340px] md:min-w-[360px] max-w-[380px] shrink-0 snap-start h-[460px]"
            >
              <VillaCard villa={villa} index={index} isPopular={true} />
            </div>
          ))}
        </div>

        {/* Mobile Swipe Indicator */}
        <p className="text-center text-xs text-stone-light mt-2 sm:hidden flex items-center justify-center gap-1.5">
          <span>👈</span>
          <span>{t("scrollHint")}</span>
          <span>👉</span>
        </p>
      </div>
    </section>
  );
}
