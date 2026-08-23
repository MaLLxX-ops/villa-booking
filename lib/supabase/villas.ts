import {
  getLocalizedVilla,
  getLocalizedVillas,
  getVillaById,
  villaDataRaw,
  type Locale,
  type Villa,
  type VillaRaw,
} from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const VILLA_REVALIDATE_SECONDS = 60;

type LocalizedValue = Record<Locale, string>;
type LocalizedAmenities = Record<Locale, string[]>;

export interface VillaRow {
  id: string;
  name: string;
  slug: string;
  description: LocalizedValue;
  price: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  location_area: LocalizedValue;
  latitude: number;
  longitude: number;
  amenities: LocalizedAmenities;
  images: string[];
  category: LocalizedValue;
  category_key: Villa["kategori_key"];
  is_active: boolean;
  is_trending: boolean;
  owner_whatsapp: string;
}

export type SupabaseVillaRaw = VillaRaw & {
  kategori_key: Villa["kategori_key"];
};

function toRaw(row: VillaRow): SupabaseVillaRaw {
  return {
    id: row.id,
    nama: row.name,
    nomor_whatsapp_pemilik: row.owner_whatsapp,
    lokasi: row.location_area,
    harga_per_malam: row.price,
    jumlah_kamar: row.bedrooms,
    jumlah_kamar_mandi: row.bathrooms,
    kapasitas_tamu: row.max_guests,
    deskripsi: row.description,
    fasilitas: row.amenities,
    galeri_foto: row.images,
    koordinat: { lat: row.latitude, lng: row.longitude },
    kategori: row.category,
    kategori_key: row.category_key,
  };
}

function localize(row: VillaRow, locale: Locale): Villa {
  const safeLocale = ["id", "en", "fr", "zh", "ja", "ko"].includes(locale)
    ? locale
    : "id";

  return getLocalizedVilla(toRaw(row), safeLocale);
}

const villaSelect =
  "id,name,slug,description,price,bedrooms,bathrooms,max_guests,location_area,latitude,longitude,amenities,images,category,category_key,is_active,is_trending,owner_whatsapp";

export async function getSupabaseRawVillas(): Promise<SupabaseVillaRaw[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return villaDataRaw;

  const { data, error } = await supabase
    .from("villas")
    .select(villaSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Unable to load villas: ${error.message}`);
  return (data as VillaRow[]).map(toRaw);
}

export async function getSupabaseVillas(locale: Locale): Promise<Villa[]> {
  const rows = await getSupabaseRawVillas();
  return rows.map((row) => getLocalizedVilla(row, locale));
}

export async function getSupabaseVillaById(
  id: string,
  locale: Locale
): Promise<Villa | undefined> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return getVillaById(id, locale);

  const { data, error } = await supabase
    .from("villas")
    .select(villaSelect)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Unable to load villa: ${error.message}`);
  return data ? localize(data as VillaRow, locale) : undefined;
}