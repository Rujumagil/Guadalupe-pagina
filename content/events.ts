import { buildWhatsAppUrl } from "@/config/site";

export const upcomingEvent = {
  eyebrow: "Talleres y experiencias",
  title: "Nueva fecha en preparación",
  description:
    "El taller del 7 de octubre ya concluyó. Estamos preparando la siguiente experiencia con Guadalupe; déjanos tus datos por WhatsApp para recibir fecha, modalidad, horario e inversión cuando se confirme.",
  note: "La información completa se publicará antes de abrir inscripciones.",
  cta: {
    label: "Quiero recibir información",
    href: buildWhatsAppUrl(
      "Hola Guadalupe, quiero recibir información de la próxima fecha de tus talleres y experiencias."
    ),
  },
} as const;
