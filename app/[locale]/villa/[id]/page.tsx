import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillaById } from "@/lib/supabase/villas";
import VillaDetailClient from "@/components/VillaDetailClient";

export const revalidate = 60;
export const dynamicParams = true;

interface VillaDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: VillaDetailPageProps) {
  const { locale, id } = await params;
  const villa = await getSupabaseVillaById(id, locale as Locale);
  if (!villa) return { title: "Villa Not Found" };
  return {
    title: `${villa.nama} — StayVilla`,
    description: villa.deskripsi.slice(0, 160),
  };
}

export default async function VillaDetailPage({
  params,
}: VillaDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const villa = await getSupabaseVillaById(id, locale as Locale);
  if (!villa) notFound();

  return <VillaDetailClient villa={villa} />;
}
