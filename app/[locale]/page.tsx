import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/lib/data";
import { getSupabaseVillas } from "@/lib/supabase/villas";
import HeroSection from "@/components/sections/HeroSection";
import ListingSection from "@/components/sections/ListingSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import StatsSection from "@/components/sections/StatsSection";
import TrendingSection from "@/components/sections/TrendingSection";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const villas = await getSupabaseVillas(locale as Locale);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <ListingSection villas={villas} />
      <TrendingSection villas={villas} />
    </>
  );
}
