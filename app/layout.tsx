import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "The Friendly Brands — Caribbean Distribution Partner",
    template: "%s | The Friendly Brands",
  },
  description:
    "Your trusted wholesale distribution partner for the Dutch Caribbean. Mix multiple brands on one pallet. We handle logistics from Europe to your freight forwarder.",
  keywords: [
    "Caribbean distribution",
    "wholesale",
    "FMCG",
    "Curacao",
    "Bonaire",
    "Aruba",
    "Dutch Caribbean",
    "pallet shipping",
    "brand distribution",
  ],
  openGraph: {
    title: "The Friendly Brands — Caribbean Distribution Partner",
    description:
      "Distribute trusted European brands across the Caribbean. Mix brands on one pallet, no full containers needed.",
    url: "https://thefriendlybrands.com",
    siteName: "The Friendly Brands",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
