import { setRequestLocale } from "next-intl/server";
import { getLocalizedVillas, Locale } from "@/lib/data";
import MapPageClient from "@/components/MapPageClient";

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

  const villas = getLocalizedVillas(locale as Locale);

  return <MapPageClient villas={villas} />;
}
