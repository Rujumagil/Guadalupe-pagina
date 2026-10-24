/**
 * Catálogo de presentación de Nicté Ha.
 * Estos cuatro programas existen como BORRADORES en Supabase.
 * Los temas mostrados son ejes orientativos, no temarios aprobados.
 * No registrar precios, fechas, duración ni abrir matrículas desde estas fichas.
 */
export const academyDrafts = [
  {
    slug: "autoconocimiento-decisiones",
    title: "Autoconocimiento y decisiones conscientes",
    category: "Desarrollo personal",
    level: "Todos los niveles",
    summary: "Explora tus prioridades y practica decisiones con mayor claridad.",
    audience: "Personas que desean comprender mejor sus prioridades y revisar decisiones importantes de su vida.",
    themes: ["Reconocimiento de prioridades", "Reflexión sobre decisiones", "Recursos personales", "Aplicación a situaciones cotidianas"],
  },
  {
    slug: "comunicacion-y-pnl",
    title: "Comunicación y herramientas de PNL",
    category: "Comunicación y PNL",
    level: "Todos los niveles",
    summary: "Aprende herramientas de comunicación y reflexiona sobre perspectivas y creencias.",
    audience: "Personas interesadas en fortalecer sus conversaciones y explorar distintas maneras de interpretar experiencias.",
    themes: ["Escucha y comunicación", "Perspectivas y creencias", "Lenguaje y conversaciones", "Reflexión y práctica"],
  },
  {
    slug: "liderazgo-personal-ejecutivo",
    title: "Liderazgo personal y ejecutivo",
    category: "Liderazgo profesional",
    level: "Todos los niveles",
    summary: "Desarrolla conversaciones, delegación y toma de decisiones en tu liderazgo.",
    audience: "Profesionales, responsables de áreas y personas que desean desarrollar habilidades de liderazgo.",
    themes: ["Comunicación de liderazgo", "Delegación y acuerdos", "Toma de decisiones", "Colaboración y seguimiento"],
  },
  {
    slug: "coaching-equipos",
    title: "Coaching de equipos y conversaciones difíciles",
    category: "Desarrollo empresarial",
    level: "Todos los niveles",
    summary: "Herramientas para equipos y responsables de personas: acuerdos, retroalimentación y coordinación.",
    audience: "Líderes y equipos que buscan mejorar la coordinación y sostener conversaciones exigentes con claridad.",
    themes: ["Acuerdos de equipo", "Conversaciones difíciles", "Retroalimentación", "Coordinación de compromisos"],
  },
] as const;

export type AcademyDraft = (typeof academyDrafts)[number];
