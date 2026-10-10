import { buildWhatsAppUrl, siteConfig } from "./site";

export const navigation = [
  { label: "Guadalupe", href: "/#guadalupe" },
  { label: "Personas", href: "/#personas" },
  { label: "Empresas", href: "/empresas" },
  { label: "Servicios", href: "/servicios" },
  { label: "Recursos", href: "/recursos" },
  { label: "Podcast", href: "/podcast" },
  { label: "Academia", href: siteConfig.academyUrl, external: true },
] as const;

export const headerCta = {
  label: "Orientación gratuita",
  href: buildWhatsAppUrl(
    "Hola Guadalupe, quiero agendar mi sesión de orientación inicial."
  ),
} as const;
