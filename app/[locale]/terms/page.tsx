import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, Scale, ShieldAlert, CreditCard, Users, HelpCircle, CheckCircle2 } from "lucide-react";

const termsMetadataMap: Record<string, () => Promise<any>> = {
  id: () => import("@/messages/id.json"),
  en: () => import("@/messages/en.json"),
  fr: () => import("@/messages/fr.json"),
  zh: () => import("@/messages/zh.json"),
  ja: () => import("@/messages/ja.json"),
  ko: () => import("@/messages/ko.json"),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const loader = termsMetadataMap[locale] || termsMetadataMap.id;
    const messages = (await loader()).default;
    return {
      title: `${messages.Terms.metaTitle} — StayVilla`,
      description: messages.Terms.metaDesc,
    };
  } catch {
    return { title: "Syarat dan Ketentuan — StayVilla" };
  }
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("Terms");
  const tDetail = useTranslations("Detail");

  const sections = [
    {
      icon: Scale,
      title: t("sec1Title"),
      desc: t("sec1Desc"),
      points: [t("sec1Point1"), t("sec1Point2"), t("sec1Point3")],
    },
    {
      icon: CreditCard,
      title: t("sec2Title"),
      desc: t("sec2Desc"),
      points: [t("sec2Point1"), t("sec2Point2"), t("sec2Point3")],
    },
    {
      icon: Users,
      title: t("sec3Title"),
      desc: t("sec3Desc"),
      points: [t("sec3Point1"), t("sec3Point2"), t("sec3Point3")],
    },
    {
      icon: ShieldAlert,
      title: t("sec4Title"),
      desc: t("sec4Desc"),
      points: [t("sec4Point1"), t("sec4Point2")],
    },
    {
      icon: FileText,
      title: t("sec5Title"),
      desc: t("sec5Desc"),
      points: [t("sec5Point1"), t("sec5Point2")],
    },
  ];

  return (
    <div className="min-h-screen bg-cream/40 pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone hover:text-terracotta-dark font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {tDetail("backHome")}
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-sand shadow-xl shadow-navy/5">
          {/* Header */}
          <div className="border-b border-sand pb-8 mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/10 text-navy border border-navy/20 text-xs font-black uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5 text-terracotta" />
              {t("badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-4 text-stone font-medium text-sm sm:text-base leading-relaxed">
              {t("intro")}
            </p>
            <div className="mt-4 text-xs font-bold text-stone-400">
              {t("effectiveDate")}
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <sec.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-navy">
                    {idx + 1}. {sec.title}
                  </h2>
                </div>
                <p className="text-stone font-medium text-sm sm:text-base leading-relaxed pl-12">
                  {sec.desc}
                </p>
                <ul className="space-y-2 pl-12">
                  {sec.points.map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2.5 text-sm text-charcoal font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Help & Support Box */}
          <div className="mt-12 p-6 rounded-2xl bg-cream border border-sand text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-navy text-base">
                {t("helpTitle")}
              </h3>
              <p className="text-stone text-xs sm:text-sm font-medium mt-0.5">
                {t("helpDesc")}
              </p>
            </div>
            <a
              href="mailto:legal@stayvilla.id"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-navy text-white hover:bg-terracotta font-bold text-xs sm:text-sm transition-colors shrink-0"
            >
              legal@stayvilla.id
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
