import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getUserClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, user: data.user } : null;
}

export async function GET() {
  const context = await getUserClient();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await context.supabase
    .from("wishlists")
    .select("villa_id")
    .eq("user_id", context.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ villaIds: (data || []).map((item) => item.villa_id) });
}

export async function POST(request: Request) {
  const context = await getUserClient();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const villaIds = Array.isArray(body.villaIds)
    ? body.villaIds.filter((id: unknown): id is string => typeof id === "string")
    : [];
  if (villaIds.length === 0) return NextResponse.json({ success: true });
  const { error } = await context.supabase.from("wishlists").upsert(
    villaIds.map((villaId: string) => ({ user_id: context.user.id, villa_id: villaId })),
    { onConflict: "user_id,villa_id", ignoreDuplicates: true }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const context = await getUserClient();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { villaId } = await request.json();
  if (typeof villaId !== "string") return NextResponse.json({ error: "Villa ID tidak valid." }, { status: 400 });
  const { error } = await context.supabase
    .from("wishlists")
    .delete()
    .eq("user_id", context.user.id)
    .eq("villa_id", villaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}