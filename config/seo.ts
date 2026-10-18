import type { Metadata } from "next";
import { siteConfig } from "./site";

/** Metadatos coherentes por página, compartidos por buscadores y tarjetas sociales. */
export function pageMetadata({
  title, description, path, image = "/images/guadalupe-hero.webp"
}: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      images: [{ url: image, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
