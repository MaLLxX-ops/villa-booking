import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://stayvilla.id"),
  title: "StayVilla — Temukan Villa Impian Anda di Bali",
  description: "Platform booking villa mewah di Bali langsung via WhatsApp pemilik.",
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
  manifest: "/site.webmanifest",
  openGraph: {
    title: "StayVilla — Luxury Bali Villa Booking",
    description: "Koleksi villa privat mewah di Bali dengan booking langsung via WhatsApp pemilik.",
    url: "https://stayvilla.id",
    siteName: "StayVilla",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StayVilla Bali — Luxury Private Villa Booking",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayVilla — Luxury Bali Villa Booking",
    description: "Koleksi villa privat mewah di Bali dengan booking langsung via WhatsApp pemilik.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal overflow-x-hidden w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
