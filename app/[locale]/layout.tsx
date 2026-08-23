import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const metadataMap: Record<string, () => Promise<any>> = {
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
    const loader = metadataMap[locale] || metadataMap.id;
    const messages = (await loader()).default;
    return {
      metadataBase: new URL("https://stayvilla.id"),
      title: messages.Metadata.title,
      description: messages.Metadata.description,
      manifest: "/site.webmanifest",
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/icon.svg", type: "image/svg+xml" },
          { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
          { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        ],
        apple: [
          { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
      },
      openGraph: {
        title: messages.Metadata.title,
        description: messages.Metadata.description,
        url: `https://stayvilla.id/${locale}`,
        siteName: "StayVilla",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "StayVilla Bali — Luxury Private Villa Booking",
          },
        ],
        locale: locale === "id" ? "id_ID" : "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: messages.Metadata.title,
        description: messages.Metadata.description,
        images: ["/og-image.png"],
      },
    };
  } catch {
    return {
      metadataBase: new URL("https://stayvilla.id"),
      title: "StayVilla Bali",
      manifest: "/site.webmanifest",
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/icon.svg", type: "image/svg+xml" },
          { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
          { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        ],
        apple: [
          { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
      },
    };
  }
}

import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import AiConcierge from "@/components/AiConcierge";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <WishlistProvider>
              <CompareProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CompareFloatingBar />
                <AiConcierge />
              </CompareProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
