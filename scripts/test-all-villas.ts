import { villaDataRaw, type Locale } from "../lib/data";
import { getSupabaseVillaById, getSupabaseVillas } from "../lib/supabase/villas";

const locales: Locale[] = ["id", "en", "fr", "zh", "ja", "ko"];

async function testAll() {
  console.log("🚀 Starting comprehensive test for ALL 48 villa x locale combinations...\n");

  let successCount = 0;
  let failCount = 0;

  for (const locale of locales) {
    console.log(`--- Testing Locale: [${locale.toUpperCase()}] ---`);
    const allVillas = await getSupabaseVillas(locale);
    if (allVillas.length !== villaDataRaw.length) {
      console.error(`❌ Locale [${locale}] count mismatch: expected ${villaDataRaw.length}, got ${allVillas.length}`);
      failCount++;
    }

    for (const raw of villaDataRaw) {
      try {
        const villa = await getSupabaseVillaById(raw.id, locale);
        if (!villa) {
          console.error(`❌ FAILED: ${locale}/villa/${raw.id} returned undefined`);
          failCount++;
          continue;
        }

        if (!villa.nama || !villa.lokasi || !villa.deskripsi || !villa.harga_per_malam) {
          console.error(`❌ FAILED: ${locale}/villa/${raw.id} missing basic fields`, villa);
          failCount++;
          continue;
        }

        if (!Array.isArray(villa.galeri_foto) || villa.galeri_foto.length === 0) {
          console.error(`❌ FAILED: ${locale}/villa/${raw.id} empty galeri_foto`);
          failCount++;
          continue;
        }

        if (!Array.isArray(villa.fasilitas) || villa.fasilitas.length === 0) {
          console.error(`❌ FAILED: ${locale}/villa/${raw.id} empty fasilitas`);
          failCount++;
          continue;
        }

        console.log(`✅ [${locale}] ${villa.id} -> "${villa.nama}" (${villa.lokasi}) - ${villa.galeri_foto.length} photos, ${villa.fasilitas.length} amenities`);
        successCount++;
      } catch (err) {
        console.error(`❌ EXCEPTION on ${locale}/villa/${raw.id}:`, err);
        failCount++;
      }
    }
    console.log("");
  }

  console.log(`========================================`);
  console.log(`Total Combinations Tested: ${successCount + failCount}`);
  console.log(`Successful: ${successCount} / 48`);
  console.log(`Failed: ${failCount}`);
  console.log(`========================================`);

  if (failCount > 0) {
    process.exit(1);
  }
}

testAll().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
