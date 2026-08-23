import { setRequestLocale } from "next-intl/server";
import HelpPageClient from "@/components/HelpPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

const helpMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = helpMetadataMap[locale] || helpMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Help.title} — StayVilla`,
      description: messages.Help.subtitle,
      alternates: { canonical: localizedPath(locale, "help"), languages: alternateLanguages("help") },
    };
  } catch {
    return { title: "Pusat Bantuan & FAQ — StayVilla" };
  }
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HelpPageClient />;
}
