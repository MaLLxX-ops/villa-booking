import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function adminClient() {
  const admin = await requireAdminApi();
  if (!admin) return null;
  return createSupabaseServerClient();
}

function clearPublicVillaCache() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/cari", "page");
    revalidatePath("/[locale]/peta", "page");
    revalidatePath("/[locale]/bandingkan", "page");
    revalidatePath("/[locale]/villa/[id]", "page");
  } catch (err) {
    console.error("revalidatePath error:", err);
  }
}

export async function GET() {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("villas").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { data, error } = await supabase.from("villas").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  clearPublicVillaCache();
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...changes } = await request.json();
  if (!id) return NextResponse.json({ error: "Villa ID wajib diisi." }, { status: 400 });
  const { data, error } = await supabase.from("villas").update(changes).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  clearPublicVillaCache();
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Villa ID wajib diisi." }, { status: 400 });
  const { error } = await supabase.from("villas").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  clearPublicVillaCache();
  return NextResponse.json({ success: true });
}