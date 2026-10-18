export const siteConfig = {
  name: "Guadalupe Gómez Pezuela",
  shortName: "Guadalupe",
  url: "https://guadalupegomezpezuela.com",
  description:
    "Guadalupe Gómez Pezuela, coach ejecutiva y de vida. Coaching personal, liderazgo ejecutivo y acompañamiento para transformar decisiones en acciones.",
  email: "guadalupe@somoseterni.com",
  whatsappDisplay: "+52 55 5507 2350",
  whatsappNumber: "525555072350",
  academyUrl: "https://academia.somos-eterni.com/",
  metaPixelId: "1824252865598003",
} as const;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
