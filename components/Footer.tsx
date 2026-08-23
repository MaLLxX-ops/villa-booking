import Link from "next/link";
import { Home, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center shadow-md">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Stay<span className="text-gold-light">Villa</span>
              </span>
            </Link>
            <p className="text-cream/85 leading-relaxed text-sm">
              Platform booking villa premium di Bali. Temukan pengalaman menginap
              terbaik di destinasi tropis paling memukau di dunia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "/" },
                { label: "Cari Villa", href: "/cari" },
                { label: "Villa Mewah", href: "/cari" },
                { label: "Villa Keluarga", href: "/cari" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-cream/80 hover:text-gold-light transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream/90 text-sm font-medium">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center gap-3 text-cream/90 text-sm font-medium">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                hello@stayvilla.id
              </li>
              <li className="flex items-start gap-3 text-cream/90 text-sm font-medium">
                <MapPin className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                Jl. Sunset Road No. 88, Seminyak, Bali 80361
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Ikuti Kami
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
              ].map((social) => (
                <button
                  key={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gold-light/20 flex items-center justify-center transition-colors group cursor-pointer"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-cream/90 group-hover:text-gold-light transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/70 text-sm font-medium">
            &copy; {new Date().getFullYear()} StayVilla. All rights reserved.
          </p>
          <p className="text-cream/70 text-xs font-medium">
            Template Demo — Siap Dikustomisasi
          </p>
        </div>
      </div>
    </footer>
  );
}
