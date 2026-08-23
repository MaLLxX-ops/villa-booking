"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) { await supabase.auth.signOut(); throw new Error("Akun ini belum terdaftar sebagai admin."); }
      window.location.href = "/admin/dashboard";
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Login gagal."); setLoading(false); }
  };

  return <main className="min-h-screen bg-cream flex items-center justify-center p-5"><form onSubmit={submit} className="w-full max-w-md bg-white border border-sand rounded-2xl p-7 shadow-xl"><div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center"><LockKeyhole className="w-6 h-6" /></div><h1 className="text-2xl font-black text-navy mt-5">Admin Login</h1><p className="text-stone mt-2 text-sm">Masuk untuk mengelola katalog StayVilla.</p><label className="block mt-6 text-sm font-bold text-charcoal">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-lg border border-sand px-3 py-3 outline-none focus:border-terracotta" /></label><label className="block mt-4 text-sm font-bold text-charcoal">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="mt-2 w-full rounded-lg border border-sand px-3 py-3 outline-none focus:border-terracotta" /></label>{error && <p className="mt-4 text-sm text-red-600 font-bold">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-lg bg-terracotta text-white py-3 font-black disabled:opacity-60">{loading ? "Memeriksa..." : "Masuk"}</button></form></main>;
}