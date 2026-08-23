import { Metadata } from "next";
import { villaData } from "@/lib/data";
import SearchPageClient from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Cari Villa — StayVilla",
  description:
    "Temukan villa impian Anda di Bali. Filter berdasarkan lokasi, kategori, dan harga untuk menemukan akomodasi sempurna.",
};

export default function CariPage() {
  return <SearchPageClient villas={villaData} />;
}
