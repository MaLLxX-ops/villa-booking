"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Users, Minimize2, ArrowRight } from "lucide-react";

interface CategoriesSectionProps {
  kategoriList: string[];
}

const categoryMeta: Record<
  string,
  {
    icon: React.ElementType;
    desc: string;
    gradient: string;
    iconColor: string;
  }
> = {
  "Villa Mewah": {
    icon: Crown,
    desc: "Pengalaman menginap premium dengan fasilitas kelas dunia",
    gradient: "from-gold/20 to-gold/5",
    iconColor: "text-gold",
  },
  "Villa Keluarga": {
    icon: Users,
    desc: "Ruang luas dan fasilitas lengkap untuk liburan keluarga",
    gradient: "from-sage/20 to-sage/5",
    iconColor: "text-sage",
  },
  "Studio Minimalis": {
    icon: Minimize2,
    desc: "Desain compact dan modern untuk pelancong solo atau pasangan",
    gradient: "from-terracotta/20 to-terracotta/5",
    iconColor: "text-terracotta",
  },
};

export default function CategoriesSection({
  kategoriList,
}: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Pilih Kategori Villa
          </h2>
          <p className="mt-3 text-stone max-w-xl mx-auto">
            Setiap kategori dirancang untuk memenuhi kebutuhan liburan Anda yang
            berbeda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kategoriList.map((kategori, i) => {
            const meta = categoryMeta[kategori] || {
              icon: Crown,
              desc: "",
              gradient: "from-stone/20 to-stone/5",
              iconColor: "text-stone",
            };
            return (
              <motion.div
                key={kategori}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Link href="/cari" className="group block">
                  <div
                    className={`relative bg-gradient-to-br ${meta.gradient} rounded-2xl p-8 border border-sand/50 hover:border-terracotta/30 transition-all hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-5 shadow-sm`}
                    >
                      <meta.icon className={`w-7 h-7 ${meta.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {kategori}
                    </h3>
                    <p className="text-stone text-sm leading-relaxed">
                      {meta.desc}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-terracotta text-sm font-medium group-hover:gap-3 transition-all">
                      Lihat Semua
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
