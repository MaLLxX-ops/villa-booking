"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, CalendarDays, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/villas", label: "Villas", icon: Building2 },
  { href: "/admin/owners", label: "Pendaftar", icon: Users },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
];

export default function AdminNav() {
  const pathname = usePathname();

  const logout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-full lg:w-64 bg-navy text-white lg:min-h-screen p-5 lg:p-6 shrink-0">
      <div className="flex items-center justify-between lg:block">
        <Link href="/admin/dashboard" className="text-xl font-black tracking-tight">StayVilla Admin</Link>
        <button onClick={logout} className="lg:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Logout" title="Logout"><LogOut className="w-5 h-5" /></button>
      </div>
      <nav className="flex lg:block gap-2 overflow-x-auto mt-6 lg:mt-10">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap ${pathname === href ? "bg-terracotta text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <Icon className="w-4 h-4" />{label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white mt-8 w-full"><LogOut className="w-4 h-4" />Logout</button>
    </aside>
  );
}