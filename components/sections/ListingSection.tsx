"use client";

import { motion } from "framer-motion";
import { Villa } from "@/lib/data";
import VillaCard from "@/components/VillaCard";

interface ListingSectionProps {
  villas: Villa[];
}

export default function ListingSection({ villas }: ListingSectionProps) {
  return (
    <section id="listing" className="py-20 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Koleksi Villa Pilihan
          </h2>
          <p className="mt-3 text-stone max-w-xl mx-auto">
            Handpicked villa terbaik dengan standar kualitas tertinggi untuk
            kenyamanan liburan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {villas.map((villa, i) => (
            <VillaCard key={villa.id} villa={villa} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
