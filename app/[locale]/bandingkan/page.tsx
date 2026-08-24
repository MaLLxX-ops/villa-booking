import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillas } from "@/lib/supabase/villas";
import ComparePageClient from "@/components/ComparePageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const compareMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = compareMetadataMap[locale] || compareMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Compare.title} — StayVilla`,
      description: messages.Compare.subtitle,
      alternates: { canonical: localizedPath(locale, "bandingkan"), languages: alternateLanguages("bandingkan") },
    };
  } catch {
    return { title: "Bandingkan Villa — StayVilla" };
  }
}

export default async function BandingkanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = await getSupabaseVillas(locale as Locale);

  return <ComparePageClient villas={villas} />;
}
