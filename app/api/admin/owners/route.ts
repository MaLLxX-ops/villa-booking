import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const admin = await requireAdminApi();
  const supabase = admin && (await createSupabaseServerClient());
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("owners").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const admin = await requireAdminApi();
  const supabase = admin && (await createSupabaseServerClient());
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status_verifikasi } = await request.json();
  if (!id || !["pending", "approved", "rejected"].includes(status_verifikasi)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }
  const { data, error } = await supabase.from("owners").update({ status_verifikasi }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}