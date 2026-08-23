"use client";

import { useEffect, useState } from "react";

type Owner = {
  id: string;
  name: string;
  whatsapp_number: string;
  villa_name: string;
  location: string;
  bedrooms: number | null;
  price_range: string;
  description: string;
  social_link: string | null;
  status_verifikasi: string;
  created_at: string;
};

export default function AdminOwnersClient() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/api/admin/owners");
      if (response.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await response.json();
      setOwners(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat pendaftar.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status_verifikasi: string) => {
    const response = await fetch("/api/admin/owners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status_verifikasi }),
    });
    if (response.status === 401) {
      window.location.replace("/admin/login");
      return;
    }
    load();
  };

  return (
    <section>
      <h1 className="text-3xl font-black text-navy">Pendaftaran Owner</h1>
      <p className="mt-2 text-stone">
        Tinjau semua data yang dikirim dari form publik.
      </p>
      {error && <p className="mt-4 text-red-600 font-bold">{error}</p>}
      <div className="mt-7 space-y-4">
        {owners.map((owner) => (
          <article
            key={owner.id}
            className="bg-white border border-sand rounded-2xl p-5"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-navy">
                  {owner.villa_name}
                </h2>
                <p className="text-sm text-stone">
                  {owner.name} · {owner.whatsapp_number} · {owner.location}
                </p>
              </div>
              <span className="h-fit rounded-full bg-cream px-3 py-1 text-xs font-black uppercase">
                {owner.status_verifikasi}
              </span>
            </div>
            <p className="mt-4 text-sm text-charcoal">{owner.description}</p>
            <p className="mt-2 text-xs text-stone">
              Kamar: {owner.bedrooms || "-"} · Harga: {owner.price_range} · Link:{" "}
              {owner.social_link || "-"}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setStatus(owner.id, "approved")}
                className="rounded-lg bg-sage-dark text-white px-3 py-2 text-xs font-black cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => setStatus(owner.id, "rejected")}
                className="rounded-lg bg-red-600 text-white px-3 py-2 text-xs font-black cursor-pointer"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
        {owners.length === 0 && (
          <p className="text-stone">Belum ada pendaftaran.</p>
        )}
      </div>
    </section>
  );
}