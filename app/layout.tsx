import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayVilla — Temukan Villa Impian Anda di Bali",
  description: "Platform booking villa mewah di Bali.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
