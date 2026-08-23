import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const admin = await requireAdminApi();
  const supabase = admin && (await createSupabaseServerClient());
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [villas, activeVillas, pendingOwners, owners] = await Promise.all([
    supabase.from("villas").select("id", { count: "exact", head: true }),
    supabase.from("villas").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("owners").select("id", { count: "exact", head: true }).eq("status_verifikasi", "pending"),
    supabase.from("owners").select("id", { count: "exact", head: true }),
  ]);
  const error = villas.error || activeVillas.error || pendingOwners.error || owners.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    villaCount: villas.count || 0,
    activeVillaCount: activeVillas.count || 0,
    pendingOwnerCount: pendingOwners.count || 0,
    ownerCount: owners.count || 0,
  });
}