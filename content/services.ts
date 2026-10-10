import { buildWhatsAppUrl } from "@/config/site";

export const services = [
  {
    slug: "coaching-personal",
    tag: "Acompañamiento individual",
    title: "Coaching personal",
    description:
      "Sesiones uno a uno para trabajar claridad, autoestima, creencias limitantes, toma de decisiones, relaciones, límites y cambios que hoy necesitas realizar.",
    href: "/coaching-personal",
  },
  {
    slug: "orientacion-inicial",
    tag: "Orientación inicial",
    title: "Sesión de orientación inicial",
    description:
      "Una primera conversación sin costo para conocer tu situación, identificar el objetivo que deseas alcanzar y orientarte sobre el siguiente paso más adecuado.",
    href: buildWhatsAppUrl(
      "Hola Guadalupe, quiero agendar mi sesión de orientación inicial."
    ),
    external: true,
  },
  {
    slug: "liderazgo-desarrollo-profesional",
    tag: "Desarrollo profesional",
    title: "Liderazgo y crecimiento profesional",
    description:
      "Acompañamiento para fortalecer comunicación, liderazgo, relaciones laborales, toma de decisiones, crecimiento profesional e integración de equipos.",
    href: "/liderazgo-desarrollo-profesional",
  },
  {
    slug: "cursos-talleres-conferencias",
    tag: "Aprendizaje y transformación",
    title: "Cursos, talleres y conferencias",
    description:
      "Experiencias formativas sobre coaching, PNL, comunicación, inteligencia emocional, liderazgo, liderazgo femenino, constelaciones, biodecodificación e hipnosis.",
    href: "/cursos-talleres-conferencias",
  },
] as const;

export const serviceDetails = {
  "coaching-personal": {
    title: "Coaching personal",
    eyebrow: "Acompañamiento individual",
    description:
      "Un espacio de escucha y acompañamiento para comprender lo que hoy necesitas transformar, reconocer tus recursos y avanzar con mayor claridad.",
    bullets: [
      "Claridad y toma de decisiones",
      "Autoestima y seguridad personal",
      "Relaciones y límites",
      "Creencias que frenan tu avance",
    ],
  },
  "liderazgo-desarrollo-profesional": {
    title: "Liderazgo y desarrollo profesional",
    eyebrow: "Crecimiento profesional",
    description:
      "Procesos para fortalecer comunicación, liderazgo, relaciones laborales, toma de decisiones y desarrollo de equipos.",
    bullets: [
      "Comunicación y liderazgo",
      "Toma de decisiones",
      "Crecimiento profesional",
      "Integración y desarrollo de equipos",
    ],
  },
  "cursos-talleres-conferencias": {
    title: "Cursos, talleres y conferencias",
    eyebrow: "Formación y experiencias",
    description:
      "Experiencias formativas que integran desarrollo personal, comunicación, liderazgo y herramientas de transformación.",
    bullets: [
      "Coaching y desarrollo humano",
      "Programación Neurolingüística",
      "Inteligencia emocional",
      "Liderazgo y liderazgo femenino",
    ],
  },
  "programacion-neurolinguistica-pnl": {
    title: "Programación Neurolingüística (PNL)",
    eyebrow: "Formación avanzada",
    description:
      "Herramientas para comprender comunicación, creencias, aprendizaje y procesos de cambio desde la experiencia profesional de Guadalupe.",
    bullets: [
      "Comunicación consciente",
      "Creencias y patrones",
      "Aprendizaje y cambio",
      "Recursos personales y profesionales",
    ],
  },
} as const;
