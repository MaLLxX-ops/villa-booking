import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { villaDataRaw, getVillaById, Locale } from "@/lib/data";
import VillaDetailClient from "@/components/VillaDetailClient";

interface VillaDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    for (const villa of villaDataRaw) {
      params.push({ locale, id: villa.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: VillaDetailPageProps) {
  const { locale, id } = await params;
  const villa = getVillaById(id, locale as Locale);
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

  const villa = getVillaById(id, locale as Locale);
  if (!villa) notFound();

  return <VillaDetailClient villa={villa} />;
}
