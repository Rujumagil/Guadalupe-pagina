import { buildWhatsAppUrl } from "@/config/site";

export const homeContent = {
  hero: {
    eyebrow: "Soy Guadalupe Gómez Pezuela",
    title: "Te ayudo a transformar lo que hoy te detiene.",
    name: "Coaching y desarrollo humano para personas y empresas.",
    value:
      "Acompaño a personas a recuperar confianza, mejorar sus relaciones y tomar decisiones; y ayudo a empresas a desarrollar líderes que comuniquen con claridad y equipos que cumplan acuerdos.",
    lead:
      "Quiero escuchar qué estás viviendo, comprender qué necesitas transformar y construir contigo un camino concreto para avanzar.",
    primaryCta: {
      label: "Agendar mi orientación personal",
      href: "/coaching-personal#reservar",
    },
    secondaryCta: {
      label: "Solicitar capacitación empresarial",
      href: "/empresas#solicitud",
    },
  },
  audiences: {
    title: "¿Cómo puedo ayudarte?",
    description:
      "Mi trabajo tiene dos caminos. Elige el que corresponde con lo que necesitas y comencemos con una conversación clara.",
    items: [
      {
        kicker: "Personas",
        title: "Recupera confianza y avanza con claridad",
        description:
          "Acompañamiento para poner límites, fortalecer relaciones, afrontar cambios y tomar decisiones con mayor seguridad.",
        label: "Reservar mi orientación personal",
        href: "/coaching-personal#reservar",
      },
      {
        kicker: "Empresas",
        title: "Fortalece líderes y equipos",
        description:
          "Capacitación, coaching ejecutivo y conferencias para mejorar comunicación, coordinación y cumplimiento de acuerdos.",
        label: "Solicitar una propuesta empresarial",
        href: "/empresas#solicitud",
      },
    ],
  },
  business: {
    eyebrow: "Trabajo con organizaciones",
    title: "Ayudo a tu empresa a desarrollar líderes y equipos que cumplan acuerdos.",
    description:
      "Primero escucho lo que está ocurriendo. Después diseño una propuesta de capacitación, coaching ejecutivo o conferencia alineada con el resultado que tu organización necesita.",
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
    title: "Cuéntame qué necesitas transformar.",
    description:
      "No tienes que adaptarte a un programa antes de saber qué quieres transformar. Primero identificamos el punto en el que estás y después elegimos el camino.",
    items: [
      {
        icon: "◎",
        title: "Quiero sentirme mejor conmigo",
        description:
          "Claridad personal, autoestima, decisiones pendientes, autoexigencia, creencias que te frenan y cambios que has postergado.",
        label: "Agendar mi orientación →",
        href: buildWhatsAppUrl(
          "Hola Guadalupe, quiero trabajar en mi claridad personal y bienestar."
        ),
      },
      {
        icon: "♡",
        title: "Quiero mejorar mis relaciones",
        description:
          "Comunicación, límites, vínculos personales o laborales y patrones que se repiten y hoy ya no te permiten vivir con tranquilidad.",
        label: "Trabajar en mis relaciones →",
        href: buildWhatsAppUrl(
          "Hola Guadalupe, quiero trabajar en mis relaciones y mi comunicación."
        ),
      },
      {
        icon: "↗",
        title: "Quiero crecer profesionalmente",
        description:
          "Liderazgo, comunicación, crecimiento laboral, toma de decisiones, desarrollo de equipos y creencias que limitan tu siguiente nivel.",
        label: "Fortalecer mi liderazgo →",
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
    title: "No tienes que tener todas las respuestas para comenzar.",
    description:
      "Cuéntame qué estás viviendo. En una orientación inicial podremos aclarar tu necesidad y decidir si soy la persona adecuada para acompañarte.",
    label: "Reservar mi orientación personal",
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
