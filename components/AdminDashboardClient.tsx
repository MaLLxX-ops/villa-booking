"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Clock3, Users } from "lucide-react";

type Stats = {
  villaCount: number;
  activeVillaCount: number;
  pendingOwnerCount: number;
  ownerCount: number;
};

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async (response) => {
        if (response.status === 401) {
          window.location.replace("/admin/login");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Akses ditolak.");
        setStats(data);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const cards = stats
    ? ([
        ["Total Villa", stats.villaCount, Building2],
        ["Villa Aktif", stats.activeVillaCount, CheckCircle2],
        ["Owner Pending", stats.pendingOwnerCount, Clock3],
        ["Total Pendaftar", stats.ownerCount, Users],
      ] as const)
    : [];

  return (
    <section>
      <h1 className="text-3xl font-black text-navy">Dashboard</h1>
      <p className="mt-2 text-stone">Ringkasan operasional StayVilla.</p>
      {error && <p className="mt-6 text-red-600 font-bold">{error}</p>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="bg-white border border-sand rounded-2xl p-5">
            <Icon className="w-6 h-6 text-terracotta" />
            <p className="mt-5 text-sm text-stone font-bold">{label}</p>
            <p className="text-3xl font-black text-navy mt-1">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}