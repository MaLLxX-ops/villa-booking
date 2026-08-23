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

const locales: Locale[] = ["id", "en", "fr", "zh", "ja", "ko"];

function localizedValue(value: unknown, fallback = ""): LocalizedValue {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(
    locales.map((locale) => [locale, typeof source[locale] === "string" ? source[locale] : fallback])
  ) as LocalizedValue;
}

function localizedAmenities(value: unknown): LocalizedAmenities {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(
    locales.map((locale) => [locale, Array.isArray(source[locale]) ? source[locale].filter((item): item is string => typeof item === "string") : []])
  ) as LocalizedAmenities;
}

function numberValue(value: unknown, fallback = 0): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

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
  const location = localizedValue(row.location_area);
  const description = localizedValue(row.description);
  const category = localizedValue(row.category);
  return {
    id: row.id,
    nama: typeof row.name === "string" && row.name ? row.name : row.id,
    nomor_whatsapp_pemilik: typeof row.owner_whatsapp === "string" ? row.owner_whatsapp : "",
    lokasi: location,
    harga_per_malam: numberValue(row.price),
    jumlah_kamar: numberValue(row.bedrooms),
    jumlah_kamar_mandi: numberValue(row.bathrooms),
    kapasitas_tamu: numberValue(row.max_guests, 1),
    deskripsi: description,
    fasilitas: localizedAmenities(row.amenities),
    galeri_foto: Array.isArray(row.images) ? row.images.filter((image): image is string => typeof image === "string" && image.length > 0) : [],
    koordinat: { lat: numberValue(row.latitude), lng: numberValue(row.longitude) },
    kategori: category,
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