import { buildWhatsAppUrl } from "@/config/site";

export const homeContent = {
  hero: {
    eyebrow: "Transformadora de vidas",
    title: "Guadalupe Gómez Pezuela",
    name: "Desarrollo humano, coaching y capacitación para personas y empresas.",
    value:
      "Acompaño a personas a fortalecer su confianza, sus relaciones y sus decisiones, y a empresas a desarrollar líderes, mejorar la comunicación y coordinar sus equipos.",
    lead:
      "Más de tres décadas de experiencia integrando acompañamiento personal, formación, conferencias y consultoría para convertir las necesidades reales en avances aplicables.",
    primaryCta: {
      label: "Quiero acompañamiento personal",
      href: "#personas",
    },
    secondaryCta: {
      label: "Busco capacitación para mi empresa",
      href: "/empresas",
    },
  },
  audiences: {
    title: "Dos caminos, un mismo compromiso con el desarrollo humano.",
    description:
      "Elige la ruta que corresponde a lo que hoy necesitas. Cada proceso comienza escuchando tu situación y definiendo un objetivo concreto.",
    items: [
      {
        kicker: "Personas",
        title: "Recupera confianza y avanza con claridad",
        description:
          "Acompañamiento para poner límites, fortalecer relaciones, afrontar cambios y tomar decisiones con mayor seguridad.",
        label: "Conocer el acompañamiento personal",
        href: "#personas",
      },
      {
        kicker: "Empresas",
        title: "Fortalece líderes y equipos",
        description:
          "Capacitación, coaching ejecutivo y conferencias para mejorar comunicación, coordinación y cumplimiento de acuerdos.",
        label: "Explorar soluciones para empresas",
        href: "/empresas",
      },
    ],
  },
  business: {
    eyebrow: "Soluciones para organizaciones",
    title: "Desarrolla líderes y equipos que comuniquen mejor y cumplan acuerdos.",
    description:
      "Capacitación, coaching ejecutivo y conferencias con Guadalupe Gómez Pezuela, adaptados a las necesidades de tu organización.",
    programs: [
      {
        title: "Liderazgo y comunicación para mandos medios",
        text: "Delegación, instrucciones claras, retroalimentación y seguimiento.",
      },
      {
        title: "Equipos que cumplen acuerdos",
        text: "Coordinación, responsabilidad compartida y comunicación entre áreas.",
      },
      {
        title: "Inteligencia emocional bajo presión",
        text: "Autorregulación, conversaciones difíciles y manejo de conflictos.",
      },
    ],
    cta: { label: "Solicitar propuesta para mi empresa", href: "/empresas#solicitud" },
  },
  authority: [
    {
      value: "35+",
      label: "años en capacitación, coaching y desarrollo humano",
    },
    {
      value: "15,000+",
      label: "personas capacitadas de forma individual y grupal",
    },
    {
      value: "PNL",
      label: "Master Trainer y formación avanzada en procesos de cambio",
      href: "/programacion-neurolinguistica-pnl",
    },
    {
      value: "Integrativo",
      label: "Coaching · PNL · Hipnosis · herramientas sistémicas",
    },
  ],
  needs: {
    title: "Tu siguiente paso empieza por una necesidad concreta.",
    description:
      "No tienes que adaptarte a un programa antes de saber qué quieres transformar. Primero identificamos el punto en el que estás y después elegimos el camino.",
    items: [
      {
        icon: "◎",
        title: "Quiero sentirme mejor conmigo",
        description:
          "Claridad personal, autoestima, decisiones pendientes, autoexigencia, creencias que te frenan y cambios que has postergado.",
        label: "Hablar con Guadalupe →",
        href: buildWhatsAppUrl(
          "Hola Guadalupe, quiero trabajar en mi claridad personal y bienestar."
        ),
      },
      {
        icon: "♡",
        title: "Quiero mejorar mis relaciones",
        description:
          "Comunicación, límites, vínculos personales o laborales y patrones que se repiten y hoy ya no te permiten vivir con tranquilidad.",
        label: "Explorar mi situación →",
        href: buildWhatsAppUrl(
          "Hola Guadalupe, quiero trabajar en mis relaciones y mi comunicación."
        ),
      },
      {
        icon: "↗",
        title: "Quiero crecer profesionalmente",
        description:
          "Liderazgo, comunicación, crecimiento laboral, toma de decisiones, desarrollo de equipos y creencias que limitan tu siguiente nivel.",
        label: "Definir mi siguiente paso →",
        href: buildWhatsAppUrl(
          "Hola Guadalupe, quiero trabajar en mi crecimiento profesional y liderazgo."
        ),
      },
    ],
  },
  about: {
    title: "Mi trabajo nació de una pregunta: ¿qué hace posible un cambio verdadero?",
    paragraphs: [
      "Desde muy joven me interesaron los procesos de pensamiento y aprendizaje. Estudié Pedagogía en la UNAM buscando comprender cómo aprendemos y, con los años, encontré en la Programación Neurolingüística, el coaching y otras disciplinas herramientas para acompañar cambios profundos de una manera práctica.",
      "Mi experiencia se ha construido en salones de capacitación, procesos individuales, equipos, empresas, conferencias y espacios de desarrollo personal. Lo que más valoro de este camino no son solamente los conocimientos acumulados, sino los cambios que he visto lograr a quienes han confiado en mi acompañamiento.",
      "Mi manera de trabajar parte de escuchar sin imponer. Busco ayudarte a reconocer tus propios recursos, ampliar tu mirada y tomar decisiones que tengan sentido para ti.",
    ],
    credentials: [
      "Estudios de Pedagogía · UNAM",
      "Master Trainer en PNL",
      "Coach Senior Empresarial",
      "Psicología Positiva",
      "Hipnosis Ericksoniana",
      "Constelaciones familiares y empresariales",
      "Biodecodificación",
      "Cámara Internacional de Conferencistas",
    ],
  },
  trajectory: {
    title: "Experiencia construida acompañando procesos reales de cambio.",
    description:
      "La confianza se construye con preparación, práctica y resultados sostenidos a lo largo del tiempo.",
    items: [
      {
        kicker: "Experiencia",
        value: "35+ años",
        text: "de trabajo en capacitación, coaching y desarrollo humano.",
      },
      {
        kicker: "Alcance",
        value: "15,000+",
        text: "personas capacitadas en procesos individuales y grupales.",
      },
      {
        kicker: "Medios y conferencias",
        value: "Radio · TV · Congresos",
        text: "Participación en entrevistas, conferencias y espacios de divulgación.",
      },
      {
        kicker: "Respaldo profesional",
        value: "Conferencista",
        text: "Miembro de la Cámara Internacional de Conferencistas.",
      },
    ],
  },
  process: {
    title: "Así comienza el proceso.",
    description:
      "Tu proceso no empieza eligiendo un curso. Empieza entendiendo qué necesitas transformar y cuál es el acompañamiento adecuado para ti.",
    items: [
      {
        number: "1",
        title: "Te escucho",
        text: "Partimos de lo que hoy te preocupa, quieres cambiar o deseas alcanzar.",
      },
      {
        number: "2",
        title: "Definimos el objetivo",
        text: "Clarificamos qué resultado tendría sentido para ti y qué está interfiriendo actualmente.",
      },
      {
        number: "3",
        title: "Elegimos el camino",
        text: "Puede ser una sesión individual, un curso, un taller o uno de los programas de ETERNI.",
      },
    ],
    note: "Primero escuchamos lo que necesitas. Después definimos juntos el camino.",
  },
  finalCta: {
    title: "Agenda una orientación inicial gratuita con Guadalupe.",
    description:
      "Una conversación breve para conocer tu situación, aclarar qué deseas trabajar y orientarte sobre el siguiente paso. No sustituye una sesión completa ni te obliga a contratar un proceso.",
    label: "Agendar orientación gratuita",
    href: buildWhatsAppUrl(
      "Hola Guadalupe, quiero agendar mi sesión de orientación inicial. Me gustaría contarte brevemente lo que quiero trabajar."
    ),
  },
  resources: {
    title: "Recursos para comprender y avanzar",
    description:
      "Artículos de Guadalupe sobre coaching, decisiones, PNL y desarrollo personal.",
    items: [
      {
        category: "Coaching personal",
        title: "¿Qué es el coaching personal y cuándo puede ayudarte?",
        href: "/recursos/coaching-personal",
      },
      {
        category: "Claridad y decisiones",
        title: "Cómo tomar decisiones importantes con mayor claridad",
        href: "/recursos/tomar-decisiones",
      },
      {
        category: "Programación Neurolingüística",
        title: "PNL: comunicación, creencias y procesos de cambio",
        href: "/recursos/pnl-comunicacion-creencias",
      },
    ],
  },
} as const;
