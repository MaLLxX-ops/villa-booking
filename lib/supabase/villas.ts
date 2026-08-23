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

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80";

function localizedValue(value: unknown, fallback = ""): LocalizedValue {
  if (typeof value === "string" && value.trim().length > 0) {
    return Object.fromEntries(
      locales.map((locale) => [locale, value.trim()])
    ) as LocalizedValue;
  }

  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const defaultVal =
    typeof source.id === "string" && source.id.trim().length > 0
      ? source.id.trim()
      : typeof source.en === "string" && source.en.trim().length > 0
        ? source.en.trim()
        : fallback;

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      typeof source[locale] === "string" &&
      (source[locale] as string).trim().length > 0
        ? (source[locale] as string).trim()
        : defaultVal,
    ])
  ) as LocalizedValue;
}

function localizedAmenities(
  value: unknown,
  fallbackAmenities?: LocalizedAmenities
): LocalizedAmenities {
  if (Array.isArray(value)) {
    const list = value.filter(
      (item): item is string => typeof item === "string" && item.length > 0
    );
    if (list.length > 0) {
      return Object.fromEntries(
        locales.map((locale) => [locale, list])
      ) as LocalizedAmenities;
    }
  }

  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const defaultList = Array.isArray(source.id)
    ? source.id.filter(
        (item): item is string => typeof item === "string" && item.length > 0
      )
    : Array.isArray(source.en)
      ? source.en.filter(
          (item): item is string => typeof item === "string" && item.length > 0
        )
      : fallbackAmenities?.id || [];

  return Object.fromEntries(
    locales.map((locale) => {
      const arr = Array.isArray(source[locale])
        ? (source[locale] as unknown[]).filter(
            (item): item is string =>
              typeof item === "string" && item.length > 0
          )
        : defaultList;
      return [locale, arr.length > 0 ? arr : defaultList];
    })
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
  const localMatch = villaDataRaw.find((v) => v.id === row.id);

  const location = localizedValue(
    row.location_area,
    localMatch?.lokasi.id || "Bali"
  );
  const description = localizedValue(
    row.description,
    localMatch?.deskripsi.id || "Villa privat di Bali."
  );
  const category = localizedValue(
    row.category,
    localMatch?.kategori.id || "Villa Mewah"
  );

  const images = Array.isArray(row.images)
    ? row.images.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    : [];

  const safeImages =
    images.length > 0
      ? images
      : localMatch?.galeri_foto && localMatch.galeri_foto.length > 0
        ? localMatch.galeri_foto
        : [DEFAULT_FALLBACK_IMAGE];

  const amenities = localizedAmenities(row.amenities, localMatch?.fasilitas);

  const validCategoryKey: Villa["kategori_key"] =
    row.category_key === "luxury" ||
    row.category_key === "family" ||
    row.category_key === "studio"
      ? row.category_key
      : localMatch?.kategori_key || "luxury";

  return {
    id: row.id || localMatch?.id || "villa",
    nama:
      typeof row.name === "string" && row.name.trim().length > 0
        ? row.name.trim()
        : localMatch?.nama || row.id,
    nomor_whatsapp_pemilik:
      typeof row.owner_whatsapp === "string" && row.owner_whatsapp.trim().length > 0
        ? row.owner_whatsapp.trim()
        : localMatch?.nomor_whatsapp_pemilik || "6281234567890",
    lokasi: location,
    harga_per_malam: numberValue(
      row.price,
      localMatch?.harga_per_malam || 2_000_000
    ),
    jumlah_kamar: numberValue(row.bedrooms, localMatch?.jumlah_kamar || 2),
    jumlah_kamar_mandi: numberValue(
      row.bathrooms,
      localMatch?.jumlah_kamar_mandi || 2
    ),
    kapasitas_tamu: numberValue(
      row.max_guests,
      localMatch?.kapasitas_tamu || 4
    ),
    deskripsi: description,
    fasilitas: amenities,
    galeri_foto: safeImages,
    koordinat: {
      lat: numberValue(row.latitude, localMatch?.koordinat.lat || -8.5069),
      lng: numberValue(row.longitude, localMatch?.koordinat.lng || 115.2625),
    },
    kategori: category,
    kategori_key: validCategoryKey,
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
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return villaDataRaw;

    const { data, error } = await supabase
      .from("villas")
      .select(villaSelect)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return villaDataRaw;
    }
    return (data as VillaRow[]).map(toRaw);
  } catch {
    return villaDataRaw;
  }
}

export async function getSupabaseVillas(locale: Locale): Promise<Villa[]> {
  try {
    const rows = await getSupabaseRawVillas();
    return rows.map((row) => getLocalizedVilla(row, locale));
  } catch {
    return getLocalizedVillas(locale);
  }
}

export async function getSupabaseVillaById(
  id: string,
  locale: Locale
): Promise<Villa | undefined> {
  const fallbackVilla = getVillaById(id, locale);
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return fallbackVilla;

    const { data, error } = await supabase
      .from("villas")
      .select(villaSelect)
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return fallbackVilla;
    }
    return localize(data as VillaRow, locale);
  } catch {
    return fallbackVilla;
  }
}