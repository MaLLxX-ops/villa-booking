import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillas } from "@/lib/supabase/villas";
import MapPageClient from "@/components/MapPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const mapMetadataMap: Record<string, () => Promise<any>> = {
  id: () => import("@/messages/id.json"),
  en: () => import("@/messages/en.json"),
  fr: () => import("@/messages/fr.json"),
  zh: () => import("@/messages/zh.json"),
  ja: () => import("@/messages/ja.json"),
  ko: () => import("@/messages/ko.json"),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const loader = mapMetadataMap[locale] || mapMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Map.title} — StayVilla`,
      description: messages.Map.subtitle,
      alternates: { canonical: localizedPath(locale, "peta"), languages: alternateLanguages("peta") },
    };
  } catch {
    return { title: "Peta Interaktif Villa — StayVilla" };
  }
}

export default async function PetaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = await getSupabaseVillas(locale as Locale);

  return <MapPageClient villas={villas} />;
}
