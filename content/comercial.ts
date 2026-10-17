import { buildWhatsAppUrl } from "@/config/site";

export const commercialLinks = {
  personal: "/coaching-personal",
  business: "/empresas",
  about: "/sobre-mi",
  contact: "/contacto",
  resources: "/recursos",
  personalWhatsApp: buildWhatsAppUrl("Hola Guadalupe, vi tu página de coaching personal y quiero conocer cómo podemos comenzar un proceso individual."),
  businessWhatsApp: buildWhatsAppUrl("Hola Guadalupe, vi tu página de coaching empresarial y quiero conversar sobre las necesidades de liderazgo de mi organización."),
} as const;

export const personalTopics = [
  { title: "Tomar decisiones", text: "Ordenar opciones y elegir un siguiente paso alineado con lo que es importante para ti." },
  { title: "Confianza y límites", text: "Reconocer tus recursos, expresar necesidades y sostener conversaciones importantes." },
  { title: "Cambios de etapa", text: "Afrontar transiciones personales o profesionales con mayor claridad." },
  { title: "Relaciones y comunicación", text: "Identificar patrones, revisar perspectivas y ensayar maneras distintas de comunicarte." },
] as const;

export const executiveTopics = [
  { title: "Coaching ejecutivo individual", text: "Acompañamiento a directivos, emprendedores y mandos medios para liderar, delegar y decidir con claridad.", tag: "1 a 1" },
  { title: "Coaching de equipos", text: "Un proceso para revisar acuerdos, conversaciones, coordinación y responsabilidad compartida.", tag: "Equipos" },
] as const;

export const businessChallenges = [
  "Delegar responsabilidades con seguimiento.",
  "Dar retroalimentación y sostener conversaciones difíciles.",
  "Tomar decisiones bajo presión.",
  "Alinear prioridades y mejorar la colaboración entre áreas.",
] as const;

export const coachingProcess = [
  { step: "01", title: "Conversamos", text: "Escuchamos el contexto y valoramos si el coaching es el acompañamiento adecuado." },
  { step: "02", title: "Acordamos", text: "Definimos un objetivo, el formato y las condiciones del proceso antes de contratar." },
  { step: "03", title: "Trabajamos", text: "Exploramos situaciones reales y construimos acciones que puedas aplicar." },
  { step: "04", title: "Revisamos", text: "Damos seguimiento a los aprendizajes y avances de acuerdo con lo pactado." },
] as const;

export const personalFaq = [
  { q: "¿Necesito tener claro mi objetivo antes de contactarte?", a: "No. La primera conversación permite comprender qué buscas y valorar juntos un objetivo posible." },
  { q: "¿Cuánto dura el proceso?", a: "La duración, frecuencia, modalidad e inversión se acuerdan según el objetivo y se informan antes de contratar." },
  { q: "¿El coaching sustituye la terapia psicológica?", a: "No. El coaching se centra en objetivos y acciones. No sustituye la atención psicológica o médica cuando es necesaria." },
] as const;

export const businessFaq = [
  { q: "¿Atiendes a una persona o a todo un equipo?", a: "Ambas posibilidades existen: coaching ejecutivo individual y procesos de equipo según el reto de la organización." },
  { q: "¿Cómo se define una propuesta?", a: "Iniciamos con una conversación sobre contexto, participantes y objetivos. Después se define alcance, modalidad, calendario e inversión." },
  { q: "¿También ofreces talleres o conferencias?", a: "Sí. Pueden complementar el coaching cuando la necesidad requiere formación grupal o sensibilización." },
] as const;
