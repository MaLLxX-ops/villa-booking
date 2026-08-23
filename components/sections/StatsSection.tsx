"use client";

import { motion } from "framer-motion";
import { Home, Star, MapPin, Shield } from "lucide-react";

const stats = [
  {
    icon: Home,
    value: "150+",
    label: "Villa Premium",
    color: "text-terracotta",
    bg: "bg-terracotta/15",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Rating Rata-rata",
    color: "text-gold",
    bg: "bg-gold/15",
  },
  {
    icon: MapPin,
    value: "8",
    label: "Lokasi di Bali",
    color: "text-sage",
    bg: "bg-sage/15",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Booking Aman",
    color: "text-navy",
    bg: "bg-navy/15",
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-16 bg-white border-y border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} mb-3 shadow-xs`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-stone mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
