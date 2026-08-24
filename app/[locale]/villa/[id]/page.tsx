import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { villaDataRaw, type Locale, type Villa } from "@/lib/data";
import { getSupabaseVillaById } from "@/lib/supabase/villas";
import VillaDetailClient from "@/components/VillaDetailClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface VillaDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const locales: Locale[] = ["id", "en", "fr", "zh", "ja", "ko"];
  return locales.flatMap((locale) =>
    villaDataRaw.map((villa) => ({
      locale,
      id: villa.id,
    }))
  );
}

export async function generateMetadata({ params }: VillaDetailPageProps) {
  try {
    const { locale, id } = await params;
    const villa = await getSupabaseVillaById(id, locale as Locale);
    if (!villa) return { title: "Villa Not Found — StayVilla" };
    return {
      title: `${villa.nama || "Villa"} — StayVilla`,
      description: (villa.deskripsi || "Villa privat di Bali.").slice(0, 160),
      alternates: {
        canonical: localizedPath(locale, `villa/${id}`),
        languages: alternateLanguages(`villa/${id}`),
      },
    };
  } catch {
    return {
      title: "Villa — StayVilla",
      description: "Temukan villa privat di Bali.",
    };
  }
}

export default async function VillaDetailPage({
  params,
}: VillaDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let villa: Villa | undefined;
  try {
    villa = await getSupabaseVillaById(id, locale as Locale);
  } catch (err) {
    console.error("VillaDetailPage fetch error:", err);
    villa = undefined;
  }

  if (!villa) {
    notFound();
  }

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: villa.nama || "Villa",
    description: villa.deskripsi || undefined,
    url: localizedPath(locale, `villa/${villa.id}`),
    image:
      Array.isArray(villa.galeri_foto) && villa.galeri_foto.length > 0
        ? villa.galeri_foto
        : undefined,
    priceRange:
      typeof villa.harga_per_malam === "number" && villa.harga_per_malam > 0
        ? `IDR ${villa.harga_per_malam}`
        : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: villa.lokasi || "Bali",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude:
        typeof villa.koordinat?.lat === "number" &&
        Number.isFinite(villa.koordinat.lat)
          ? villa.koordinat.lat
          : undefined,
      longitude:
        typeof villa.koordinat?.lng === "number" &&
        Number.isFinite(villa.koordinat.lng)
          ? villa.koordinat.lng
          : undefined,
    },
    offers: {
      "@type": "Offer",
      price:
        typeof villa.harga_per_malam === "number" && villa.harga_per_malam > 0
          ? villa.harga_per_malam
          : undefined,
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
