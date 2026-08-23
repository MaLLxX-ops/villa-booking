import { setRequestLocale } from "next-intl/server";
import { getLocalizedVillas, Locale } from "@/lib/data";
import ComparePageClient from "@/components/ComparePageClient";

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

  const villas = getLocalizedVillas(locale as Locale);

  return <ComparePageClient villas={villas} />;
}
