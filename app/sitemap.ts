import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const routes = [
  "",
  "/servicios",
  "/consultoria",
  "/coaching-personal",
  "/empresas",
  "/liderazgo-desarrollo-profesional",
  "/cursos-talleres-conferencias",
  "/programacion-neurolinguistica-pnl",
  "/recursos",
  "/recursos/coaching-personal",
  "/recursos/tomar-decisiones",
  "/recursos/pnl-comunicacion-creencias",
  "/podcast",
  "/legado",
  "/webinar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const modified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: modified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
