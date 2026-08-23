import { setRequestLocale } from "next-intl/server";
import PrivacyPageClient from "@/components/PrivacyPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

const privacyMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = privacyMetadataMap[locale] || privacyMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Privacy.metaTitle} — StayVilla`,
      description: messages.Privacy.metaDesc,
      alternates: { canonical: localizedPath(locale, "privacy"), languages: alternateLanguages("privacy") },
    };
  } catch {
    return { title: "Kebijakan Privasi — StayVilla" };
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyPageClient />;
}
