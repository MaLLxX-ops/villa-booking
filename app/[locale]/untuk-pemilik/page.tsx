import { setRequestLocale } from "next-intl/server";
import OwnersPageClient from "@/components/OwnersPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

const metadataMap: Record<string, () => Promise<any>> = {
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
    const loader = metadataMap[locale] || metadataMap.id;
    const messages = (await loader()).default;
    return {
      title: messages.Owners.metaTitle,
      description: messages.Owners.metaDesc,
      alternates: { canonical: localizedPath(locale, "untuk-pemilik"), languages: alternateLanguages("untuk-pemilik") },
    };
  } catch {
    return {
      title: "Untuk Pemilik Villa — StayVilla",
    };
  }
}

export default async function UntukPemilikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OwnersPageClient />;
}
