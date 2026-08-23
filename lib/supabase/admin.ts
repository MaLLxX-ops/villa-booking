import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  createSupabaseAdminServiceClient,
} from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user?.id) return null;

  // Use service role client if available to verify admin_users table without RLS restrictions
  const adminServiceClient = createSupabaseAdminServiceClient();
  const clientToQuery = adminServiceClient || supabase;

  const { data: admin } = await clientToQuery
    .from("admin_users")
    .select("id,email,role")
    .eq("id", authData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return admin ? { user: authData.user, admin } : null;
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

export async function requireAdminApi() {
  const admin = await getAdminUser();
  if (!admin) return null;
  return admin;
}