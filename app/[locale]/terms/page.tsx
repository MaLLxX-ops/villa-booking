import { setRequestLocale } from "next-intl/server";
import TermsPageClient from "@/components/TermsPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

const termsMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = termsMetadataMap[locale] || termsMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Terms.metaTitle} — StayVilla`,
      description: messages.Terms.metaDesc,
      alternates: { canonical: localizedPath(locale, "terms"), languages: alternateLanguages("terms") },
    };
  } catch {
    return { title: "Syarat dan Ketentuan — StayVilla" };
  }
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsPageClient />;
}
