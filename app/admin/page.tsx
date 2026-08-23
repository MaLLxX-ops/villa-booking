import { requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  redirect("/admin/dashboard");
}