import { setRequestLocale } from "next-intl/server";
import { getLocalizedVillas, Locale } from "@/lib/data";
import SearchPageClient from "@/components/SearchPageClient";

const searchMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = searchMetadataMap[locale] || searchMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Search.title} — StayVilla`,
      description: messages.Metadata.description,
    };
  } catch {
    return { title: "Cari Villa — StayVilla" };
  }
}

export default async function CariPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = getLocalizedVillas(locale as Locale);

  return <SearchPageClient villas={villas} />;
}
