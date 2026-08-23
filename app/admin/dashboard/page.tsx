import { requireAdmin } from "@/lib/supabase/admin";
import AdminNav from "@/components/AdminNav";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <AdminNav />
      <main className="flex-1 p-5 sm:p-8">
        <AdminDashboardClient />
      </main>
    </div>
  );
}