"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Crown, Users, Minimize2, ArrowRight } from "lucide-react";

export default function CategoriesSection() {
  const t = useTranslations("Categories");

  const categories = [
    {
      key: "luxury",
      title: t("luxuryTitle"),
      desc: t("luxuryDesc"),
      icon: Crown,
      gradient: "from-gold/15 to-gold/5",
      iconBg: "bg-gold/20",
      iconColor: "text-gold",
      filterValue: "luxury",
    },
    {
      key: "family",
      title: t("familyTitle"),
      desc: t("familyDesc"),
      icon: Users,
      gradient: "from-sage/15 to-sage/5",
      iconBg: "bg-sage/20",
      iconColor: "text-sage-dark",
      filterValue: "family",
    },
    {
      key: "studio",
      title: t("studioTitle"),
      desc: t("studioDesc"),
      icon: Minimize2,
      gradient: "from-terracotta/15 to-terracotta/5",
      iconBg: "bg-terracotta/20",
      iconColor: "text-terracotta-dark",
      filterValue: "studio",
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-stone max-w-xl mx-auto text-base sm:text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/cari?cat=${cat.filterValue}`}
                className="group block h-full"
              >
                <div
                  className={`h-full relative bg-gradient-to-br ${cat.gradient} bg-white rounded-2xl p-8 border border-sand hover:border-terracotta/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-navy/5 flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`w-14 h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      <cat.icon className={`w-7 h-7 ${cat.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2.5 group-hover:text-terracotta-dark transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-stone text-sm leading-relaxed font-normal">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-sand/60 inline-flex items-center gap-2 text-terracotta-dark text-sm font-bold group-hover:gap-3 transition-all">
                    {t("viewCollection")}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
