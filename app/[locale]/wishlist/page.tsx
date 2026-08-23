import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillas } from "@/lib/supabase/villas";
import WishlistPageClient from "@/components/WishlistPageClient";

export const revalidate = 60;

const wishlistMetadataMap: Record<string, () => Promise<any>> = {
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
    const loader = wishlistMetadataMap[locale] || wishlistMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Wishlist.title} — StayVilla`,
      description: messages.Wishlist.subtitle,
    };
  } catch {
    return { title: "Wishlist Villa — StayVilla" };
  }
}

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = await getSupabaseVillas(locale as Locale);

  return <WishlistPageClient villas={villas} />;
}
