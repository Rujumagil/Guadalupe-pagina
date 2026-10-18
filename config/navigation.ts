import { buildWhatsAppUrl } from "./site";

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Coaching personal", href: "/coaching-personal" },
  { label: "Coaching empresarial", href: "/empresas" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Mi academia", href: "/academia-guadalupe/" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const headerCta = {
  label: "Consultar sesiones",
  href: buildWhatsAppUrl("Hola Guadalupe, vi tu página y quiero conocer cómo puedo iniciar un proceso de coaching."),
} as const;
