import { villaData, getKategoriList } from "@/lib/data";
import HeroSection from "@/components/sections/HeroSection";
import ListingSection from "@/components/sections/ListingSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import StatsSection from "@/components/sections/StatsSection";

export default function HomePage() {
  const kategoriList = getKategoriList();

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection kategoriList={kategoriList} />
      <ListingSection villas={villaData} />
    </>
  );
}
