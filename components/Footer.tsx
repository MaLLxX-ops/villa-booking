import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Instagram, Facebook, Building2 } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/data";
import Logo from "@/components/Logo";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-navy text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" lightText={true} />
            </Link>
            <p className="text-cream/85 leading-relaxed text-sm">
              {t("brandDesc")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("navTitle")}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t("homeLink"), href: "/" },
                { label: t("searchLink"), href: "/cari" },
                { label: t("forOwnersLink"), href: "/untuk-pemilik", highlight: true },
                { label: t("helpLink"), href: "/help" },
                { label: t("luxuryLink"), href: "/cari?cat=luxury" },
                { label: t("familyLink"), href: "/cari?cat=family" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`transition-colors text-sm font-medium flex items-center gap-1.5 ${
                      item.highlight
                        ? "text-gold-light hover:text-white font-bold"
                        : "text-cream/80 hover:text-gold-light"
                    }`}
                  >
                    {item.highlight && <Building2 className="w-3.5 h-3.5" />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream/90 hover:text-gold-light text-sm font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-light shrink-0" />
                  {t("phone")}
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream/90 text-sm font-medium">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                {t("email")}
              </li>
              <li className="flex items-start gap-3 text-cream/90 text-sm font-medium">
                <MapPin className="w-4 h-4 text-gold-light shrink-0 mt-0.5" />
                {t("address")}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t("followTitle")}
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

      {/* Bottom Bar with Help, Privacy Policy & Terms of Service */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-cream/70 text-sm font-medium">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-cream/80">
            <Link
              href="/help"
              className="hover:text-gold-light transition-colors"
            >
              {t("helpLink")}
            </Link>
            <span className="text-cream/30">•</span>
            <Link
              href="/privacy-policy"
              className="hover:text-gold-light transition-colors"
            >
              {t("privacyLink")}
            </Link>
            <span className="text-cream/30">•</span>
            <Link
              href="/terms"
              className="hover:text-gold-light transition-colors"
            >
              {t("termsLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
