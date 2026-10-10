export const siteConfig = {
  name: "Guadalupe Gómez Pezuela · ETERNI",
  shortName: "Guadalupe",
  url: "https://www.somos-eterni.com",
  description:
    "Guadalupe Gómez Pezuela ofrece coaching, desarrollo humano y capacitación para personas y empresas: liderazgo, comunicación, coordinación de equipos y crecimiento personal.",
  email: "guadalupe@somoseterni.com",
  whatsappDisplay: "+52 55 5507 2350",
  whatsappNumber: "525555072350",
  academyUrl: "https://academia.somos-eterni.com/",
  metaPixelId: "1824252865598003",
} as const;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
