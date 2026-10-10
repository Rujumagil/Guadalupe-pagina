export const articles = {
  "coaching-personal": {
    category: "Coaching personal",
    title: "¿Qué es el coaching personal y cuándo puede ayudarte?",
    intro: "El coaching personal es un proceso de acompañamiento orientado a clarificar una situación, definir un objetivo y convertirlo en decisiones y acciones observables.",
    sections: [
      { title: "Puede ser útil cuando…", paragraphs: ["Sabes que necesitas cambiar algo, pero todavía no logras ordenar tus opciones; atraviesas una transición; te cuesta poner límites; o quieres fortalecer tu confianza para decidir y actuar."] },
      { title: "Qué puedes esperar", paragraphs: ["Un espacio de escucha, preguntas y reflexión práctica. El proceso no consiste en recibir fórmulas; busca que reconozcas tus recursos, comprendas lo que hoy interfiere y construyas pasos que tengan sentido para ti."] },
      { title: "El primer paso", paragraphs: ["Una orientación inicial permite conversar sobre tu necesidad y valorar si el coaching es el acompañamiento adecuado o si conviene considerar otra alternativa."] },
    ],
  },
  "tomar-decisiones": {
    category: "Claridad y decisiones",
    title: "Cómo tomar decisiones importantes con mayor claridad",
    intro: "Tomar una decisión importante no siempre exige pensar más; con frecuencia requiere distinguir lo que necesitas, lo que temes y aquello que realmente depende de ti.",
    sections: [
      { title: "Separa hechos de interpretaciones", paragraphs: ["Escribe lo que sabes con certeza y, en otra columna, las suposiciones que estás haciendo. Esta separación reduce ruido y permite identificar qué información falta."] },
      { title: "Define qué quieres proteger", paragraphs: ["Toda decisión expresa prioridades. Pregúntate qué valor, relación, necesidad o proyecto deseas cuidar y qué costo estás dispuesta o dispuesto a asumir."] },
      { title: "Convierte la decisión en un siguiente paso", paragraphs: ["No necesitas resolver toda la ruta de inmediato. Define una acción concreta, reversible cuando sea posible, que te permita obtener información y avanzar."] },
    ],
  },
  "pnl-comunicacion-creencias": {
    category: "Programación Neurolingüística",
    title: "PNL: comunicación, creencias y procesos de cambio",
    intro: "La Programación Neurolingüística ofrece herramientas para observar cómo organizamos nuestra experiencia, cómo nos comunicamos y qué patrones influyen en nuestras decisiones.",
    sections: [
      { title: "Comunicación con mayor conciencia", paragraphs: ["Escuchar el lenguaje, las generalizaciones y los significados que atribuimos a una situación puede ayudarnos a formular preguntas más precisas y conversaciones más útiles."] },
      { title: "Creencias y posibilidades", paragraphs: ["Una creencia puede funcionar como apoyo o como límite. Explorarla no significa negar la realidad, sino revisar si sigue siendo útil y qué alternativas permite considerar."] },
      { title: "Cambio aplicado", paragraphs: ["Las herramientas cobran sentido cuando se vinculan con un objetivo real, un contexto específico y acciones que la persona pueda observar y sostener."] },
    ],
  },
} as const;

export type ArticleSlug = keyof typeof articles;
