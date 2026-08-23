import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const requiredFields = [
  "namaVilla",
  "namaPemilik",
  "nomorWA",
  "lokasi",
  "rentangHarga",
  "deskripsi",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const missingField = requiredFields.find(
      (field) => typeof body[field] !== "string" || !body[field].trim()
    );
    if (missingField) {
      return NextResponse.json(
        { error: `Field ${missingField} wajib diisi.` },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database belum dikonfigurasi." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("owners").insert({
      name: body.namaPemilik.trim(),
      whatsapp_number: body.nomorWA.trim(),
      villa_name: body.namaVilla.trim(),
      location: body.lokasi.trim(),
      bedrooms: Number.parseInt(body.jumlahKamar, 10) || null,
      price_range: body.rentangHarga.trim(),
      description: body.deskripsi.trim(),
      social_link: typeof body.socialLink === "string" ? body.socialLink.trim() || null : null,
      status_verifikasi: "pending",
    });

    if (error) {
      console.error("Owner registration insert failed:", error);
      return NextResponse.json(
        { error: "Pendaftaran tidak dapat disimpan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Owner registration error:", error);
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}