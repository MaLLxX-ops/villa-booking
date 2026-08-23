import { notFound } from "next/navigation";
import { villaData, getVillaById } from "@/lib/data";
import VillaDetailClient from "@/components/VillaDetailClient";

interface VillaDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return villaData.map((villa) => ({ id: villa.id }));
}

export async function generateMetadata({ params }: VillaDetailPageProps) {
  const { id } = await params;
  const villa = getVillaById(id);
  if (!villa) return { title: "Villa Tidak Ditemukan" };
  return {
    title: `${villa.nama} — StayVilla`,
    description: villa.deskripsi.slice(0, 160),
  };
}

export default async function VillaDetailPage({ params }: VillaDetailPageProps) {
  const { id } = await params;
  const villa = getVillaById(id);
  if (!villa) notFound();

  return <VillaDetailClient villa={villa} />;
}
