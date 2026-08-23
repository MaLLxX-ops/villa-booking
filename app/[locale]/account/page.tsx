import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillas } from "@/lib/supabase/villas";
import AccountPageClient from "@/components/AccountPageClient";
import { alternateLanguages, localizedPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AccountPageProps) {
  const { locale } = await params;
  return {
    title: "Akun Saya — StayVilla",
    description: "Kelola profil akun tamu, villa favorit di wishlist, dan preferensi liburan Anda di StayVilla Bali.",
    alternates: {
      canonical: localizedPath(locale, "account"),
      languages: alternateLanguages("account"),
    },
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = await getSupabaseVillas(locale as Locale);

  return <AccountPageClient villas={villas} />;
}
