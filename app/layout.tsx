import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/comercial.css";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MetaPixel } from "@/components/MetaPixel";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Guadalupe Gómez Pezuela | Coaching personal y empresarial",
    template: "%s | Guadalupe Gómez Pezuela",
  },
  description: siteConfig.description,
  authors: [{ name: "Guadalupe Gómez Pezuela" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: siteConfig.name,
    title: "Guadalupe Gómez Pezuela | Coaching personal y empresarial",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/images/guadalupe-hero.webp", alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guadalupe Gómez Pezuela | Coaching personal y empresarial",
    description: siteConfig.description,
    images: ["/images/guadalupe-hero.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#315F59",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MetaPixel />
        <CloudflareWebAnalytics />
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
