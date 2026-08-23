"use client";

import { motion } from "framer-motion";
import { Palmtree, Sparkles } from "lucide-react";
import HeroSearch from "@/components/HeroSearch";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-sand" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C67B5C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-terracotta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      <div className="absolute top-40 left-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-terracotta px-4 py-2 rounded-full text-sm font-medium border border-terracotta/20 mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Premium Villa Collection
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
        >
          <span className="text-navy">Temukan Villa</span>
          <br />
          <span className="bg-gradient-to-r from-terracotta to-terracotta-dark bg-clip-text text-transparent">
            Impian Anda
          </span>
          <span className="text-navy"> di Bali</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-stone max-w-2xl mx-auto leading-relaxed"
        >
          Koleksi villa premium handpicked untuk pengalaman liburan tak terlupakan.
          Dari retreat mewah hingga studio minimalis di lokasi terbaik.
        </motion.p>

        {/* Tropical Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center my-8"
        >
          <div className="flex items-center gap-3 text-sage/40">
            <div className="h-px w-12 bg-sage/30" />
            <Palmtree className="w-6 h-6" />
            <div className="h-px w-12 bg-sage/30" />
          </div>
        </motion.div>

        {/* Search Bar */}
        <HeroSearch />
      </div>
    </section>
  );
}
