import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodayString, isDateBeforeToday, isValidDateString } from "@/lib/date-utils";

async function getClient() {
  const admin = await requireAdminApi();
  return admin ? createSupabaseServerClient() : null;
}

function clearAvailabilityCache() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/villa/[id]", "page");
    revalidatePath("/[locale]/cari", "page");
  } catch {}
}

export async function GET(request: Request) {
  const supabase = await getClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const villaId = new URL(request.url).searchParams.get("villa_id");
  let query = supabase.from("villa_availability").select("*").order("date");
  if (villaId) query = query.eq("villa_id", villaId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await getClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (
    typeof body.villa_id !== "string" ||
    typeof body.date !== "string" ||
    !isValidDateString(body.date) ||
    isDateBeforeToday(body.date)
  ) {
    return NextResponse.json(
      { error: `Tanggal harus valid dan tidak boleh sebelum ${getTodayString()}.` },
      { status: 400 }
    );
  }
  const { data, error } = await supabase.from("villa_availability").upsert(body, { onConflict: "villa_id,date" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  clearAvailabilityCache();
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await getClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { villa_id, date } = await request.json();
  if (typeof villa_id !== "string" || typeof date !== "string" || !isValidDateString(date) || isDateBeforeToday(date)) {
    return NextResponse.json({ error: "Tanggal tidak valid atau sudah lewat." }, { status: 400 });
  }
  const { error } = await supabase.from("villa_availability").delete().eq("villa_id", villa_id).eq("date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  clearAvailabilityCache();
  return NextResponse.json({ success: true });
}