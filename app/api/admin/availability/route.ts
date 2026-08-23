import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getClient() {
  const admin = await requireAdminApi();
  return admin ? createSupabaseServerClient() : null;
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
  const { data, error } = await supabase.from("villa_availability").upsert(body, { onConflict: "villa_id,date" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await getClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { villa_id, date } = await request.json();
  const { error } = await supabase.from("villa_availability").delete().eq("villa_id", villa_id).eq("date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}