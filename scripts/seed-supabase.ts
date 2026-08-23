import { createClient } from "@supabase/supabase-js";
import { villaDataRaw } from "../lib/data";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed script."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const rows = villaDataRaw.map((villa) => ({
  id: villa.id,
  name: villa.nama,
  slug: villa.id,
  description: villa.deskripsi,
  price: villa.harga_per_malam,
  bedrooms: villa.jumlah_kamar,
  bathrooms: villa.jumlah_kamar_mandi,
  max_guests: villa.kapasitas_tamu,
  location_area: villa.lokasi,
  latitude: villa.koordinat.lat,
  longitude: villa.koordinat.lng,
  amenities: villa.fasilitas,
  images: villa.galeri_foto,
  category: villa.kategori,
  category_key: villa.kategori_key,
  is_active: true,
  is_trending: false,
  owner_whatsapp: villa.nomor_whatsapp_pemilik,
}));

const { error } = await supabase.from("villas").upsert(rows, { onConflict: "id" });
if (error) throw new Error(`Seed failed: ${error.message}`);

console.log(`Seeded ${rows.length} villas into public.villas.`);