import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayVilla — Temukan Villa Impian Anda di Bali",
  description: "Platform booking villa mewah di Bali.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
