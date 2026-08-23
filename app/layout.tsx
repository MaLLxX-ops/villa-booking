import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayVilla — Temukan Villa Impian Anda",
  description:
    "Booking villa premium di Bali dengan mudah. Pilih dari koleksi villa mewah, villa keluarga, dan studio minimalis di lokasi terbaik.",
  keywords: [
    "villa bali",
    "booking villa",
    "sewa villa",
    "villa mewah",
    "liburan bali",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
