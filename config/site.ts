export const siteConfig = {
  name: "Guadalupe Gómez Pezuela",
  shortName: "Guadalupe",
  url: "https://guadalupegomezpezuela.com",
  description:
    "Coaching personal y empresarial con Guadalupe Gómez Pezuela. Acompañamiento para tomar decisiones, fortalecer el liderazgo y mejorar la comunicación.",
  email: "guadalupe@somoseterni.com",
  whatsappDisplay: "+52 55 5507 2350",
  whatsappNumber: "525555072350",
  academyUrl: "https://academia.somos-eterni.com/",
  metaPixelId: "1824252865598003",
} as const;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
