import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillaById } from "@/lib/supabase/villas";
import VillaDetailClient from "@/components/VillaDetailClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

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
    alternates: {
      canonical: localizedPath(locale, `villa/${id}`),
      languages: alternateLanguages(`villa/${id}`),
    },
  };
}

export default async function VillaDetailPage({
  params,
}: VillaDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const villa = await getSupabaseVillaById(id, locale as Locale);
  if (!villa) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: villa.nama,
    description: villa.deskripsi,
    url: localizedPath(locale, `villa/${villa.id}`),
    image: villa.galeri_foto,
    priceRange: `IDR ${villa.harga_per_malam}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: villa.lokasi,
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: villa.koordinat.lat,
      longitude: villa.koordinat.lng,
    },
    offers: {
      "@type": "Offer",
      price: villa.harga_per_malam,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VillaDetailClient villa={villa} />
    </>
  );
}
