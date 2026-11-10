// Academia Nicté Ha · Programa curricular oficial de El Legado que Trasciende.
// Cada registro corresponde al orden de una lección del temario. Los textos son
// guías académicas, no sustituyen los videos ni el cuaderno de actividades.
const legado=[
 ["Reconocer el valor del camino recorrido.","Lo que superé, aprendí, construí y deseo que permanezca.","Responder qué etapas y aprendizajes quiero conservar.","Lista inicial de recuerdos importantes."],
 ["Reconocer el valor de las experiencias reales, incluso las difíciles.","Alegrías, cambios, errores, pérdidas, decisiones y aprendizajes.","Elegir una experiencia imperfecta e identificar su enseñanza.","Experiencia y aprendizaje que dejó."],
 ["Identificar cómo un recuerdo puede transmitir identidad y afecto.","Voz, identidad, valores, enseñanzas y destinatarios del recuerdo.","Escribir un mensaje breve a alguien significativo.","Primer mensaje personal de legado."],
 ["Recordar con respeto y establecer límites propios.","Contexto, comprensión, aprendizajes, privacidad y derecho a reservar.","Escribir una primera memoria de 10 a 15 líneas.","Primera memoria personal escrita."],
 ["Reconstruir un recuerdo a partir de un hogar significativo.","Voces, aromas, rutinas, personas y costumbres que una casa guarda.","Describir una casa significativa usando recuerdos concretos.","Descripción breve de una casa."],
 ["Conectar lugares y etapas personales.","Infancia, juventud, trabajo, familia y otros espacios decisivos.","Crear una lista de lugares con etapa y recuerdo.","Inventario de lugares por etapa."],
 ["Relacionar lugares con detalles sensoriales y afectivos.","Patios, cocinas, calles, mesas; memoria sensorial y emociones.","Elegir un espacio, anotar tres detalles y una emoción; señalar lo pendiente por recordar.","Ficha sensorial y emocional."],
 ["Organizar lugares como fuentes de posibles historias.","Lugar, etapa, personas, emoción y posible historia.","Identificar al menos cinco lugares; escribir de 10 a 15 líneas sobre uno.","Mapa de lugares y memoria breve."],
 ["Reconocer gestos concretos de cuidado recibidos.","Presencia, trabajo, alimento, protección, consejo y acompañamiento.","Describir a una persona que me cuidó y un gesto que recuerdo.","Retrato breve de una persona significativa."],
 ["Identificar enseñanzas personales aún presentes.","Valores, habilidades, costumbres y ejemplos de vida.","Registrar una enseñanza que todavía practico y escribir agradecimiento.","Enseñanza y mensaje breve de gratitud."],
 ["Reconocer relaciones que cambiaron mi camino.","Encuentros, amistades, relaciones, despedidas y reconciliaciones.","Elegir una persona que marcó un antes y después; decidir qué parte contar.","Registro de relación transformadora."],
 ["Preservar frases significativas con fidelidad a la memoria.","Frases, contexto y diferencia entre cita recordada y recuerdo aproximado.","Registrar una frase y elegir una persona para escribir una memoria de 10 a 15 líneas.","Lista de personas y memoria escrita."],
 ["Conservar experiencias de alegría relevantes.","Celebraciones, nacimientos, comienzos, logros, viajes y alegría cotidiana.","Elegir un momento feliz e identificar personas, detalles y emoción.","Ficha de un momento feliz."],
 ["Recordar retos sin obligación de revelarlo todo.","Situación, apoyos, cambios, aprendizaje y límites de privacidad.","Describir un reto a través de situación, apoyo, cambio y lo que deseo conservar.","Registro de un reto significativo."],
 ["Comprender la importancia de las elecciones personales.","Antes, decisión y después; opciones y valores implicados.","Describir una decisión y sus consecuencias.","Historia breve de una decisión."],
 ["Convertir vivencias en enseñanzas de legado.","Experiencia, comprensión, valor y mensaje al destinatario.","Crear una primera línea de vida; elegir momento feliz, reto y decisión; desarrollar uno.","Línea de vida y enseñanza de legado."],
 ["Identificar semillas de historias en los recuerdos reunidos.","Diferencia entre recuerdo e historia; momentos, personas, lugares y experiencias significativas.","Elegir de tres a cinco historias candidatas y describir protagonistas, época y relevancia.","Catálogo de historias posibles."],
 ["Seleccionar una historia y explicar su razón de ser.","Propósito, destinatario, tema y enseñanza central.","Completar la ficha Mi historia elegida.","Historia seleccionada y declaración de propósito."],
 ["Delimitar contenido, privacidad y datos por verificar.","Contar, reservar, verificar u omitir; respeto a terceros y recuerdos aproximados.","Clasificar los contenidos de la historia en cuatro categorías.","Mapa de límites personales y narrativos."],
 ["Preparar un itinerario de escritura claro.","Inicio, contexto, personajes, acontecimientos, cambio y cierre.","Elaborar un esquema de principio, desarrollo y final.","Ficha narrativa lista para escribir."],
 ["Reconocer una forma natural de narrar.","Primera persona, tono, palabras propias y autenticidad.","Contar oralmente una experiencia y escribirla con expresiones personales.","Texto autobiográfico breve."],
 ["Crear una apertura con contexto y dirección.","Comienzos desde escena, persona, lugar o suceso; situación temporal.","Redactar dos posibles inicios y elegir el más fiel.","Apertura del primer relato."],
 ["Desarrollar escenas con elementos recordados.","Acciones, descripciones sensoriales, emociones y diálogos aproximados cuando corresponda.","Escribir una escena a partir de lugar, personas, suceso, emoción y cambio.","Escena autobiográfica desarrollada."],
 ["Integrar una historia de principio a fin.","Secuencia, continuidad, transiciones y sentido de cierre.","Unir el material y señalar dudas sin completar con invenciones.","Borrador del primer relato completo."],
 ["Seleccionar historias complementarias.","Agrupación por temas, etapas, personas y acontecimientos; eliminación de repeticiones.","Seleccionar de tres a cinco relatos principales a partir de los recuerdos acumulados.","Inventario de historias del libro."],
 ["Diseñar un orden de lectura comprensible.","Capítulos, títulos, orden cronológico o temático e índice.","Nombrar, ordenar y describir cada capítulo.","Índice provisional."],
 ["Relacionar relatos con mensajes significativos.","Experiencia, valor, reflexión y aprendizaje sin imponer moralejas.","Crear una ficha de experiencia, aprendizaje, valor y mensaje por capítulo.","Mapa de enseñanzas del libro."],
 ["Integrar materiales escritos en un documento maestro.","Transiciones, versiones, vacíos de información, documentos y fotografías.","Reunir textos, ordenar capítulos y completar un relato adicional.","Manuscrito inicial organizado."],
 ["Reconocer destinatarios y significado de la dedicatoria.","Personas, generaciones, intención de compartir y sentido del libro.","Redactar una dedicatoria personal.","Dedicatoria inicial."],
 ["Escribir mensajes afectivos auténticos.","Gratitud, reconocimiento, afecto y cartas a futuras generaciones.","Escribir al menos dos cartas.","Colección de cartas de legado."],
 ["Mejorar claridad sin despersonalizar el relato.","Secuencia, coherencia, repeticiones, nombres, privacidad y datos pendientes.","Aplicar una lista de revisión a un capítulo.","Capítulo revisado y lista de correcciones."],
 ["Cerrar el libro de manera congruente.","Reflexión final, agradecimiento y cierre respetuoso de la experiencia.","Escribir el cierre y contrastarlo con el propósito inicial.","Cierre y manuscrito completo para revisión."],
 ["Definir los elementos editoriales esenciales del libro.","Título, subtítulo, concepto de portada, autor, introducción, prólogo opcional e índice.","Completar la ficha editorial.","Título, presentación y ficha editorial."],
 ["Elegir imágenes de manera pertinente y responsable.","Calidad, selección, pies de foto, orden y permisos de uso.","Seleccionar entre cinco y diez imágenes, si existen, y describirlas.","Carpeta de imágenes y referencias."],
 ["Entender y revisar la maquetación editorial.","Corrección final, tipografías, márgenes, estructura visual, cubierta y PDF.","Revisar una muestra maquetada y reportar cambios.","Maqueta revisada y aprobaciones parciales."],
 ["Cerrar el proceso y decidir cómo compartir el libro.","Comprobación del archivo, conservación, distribución digital e impresión opcional.","Completar revisión final y escribir una breve presentación.","PDF final aprobado y mensaje de presentación."]
];

// Material orientativo de La Mujer del Faro: sujeto a validación contra su manual.
const faro=[
 ["Reconocer mi identidad y aspectos significativos de mi historia.","Momentos, valores y experiencias que me definen.","Escribir tres momentos que considero importantes para comprender quién soy.","Primer retrato personal."],
 ["Identificar lo que me distingue sin comparaciones.","Fortalezas, cualidades y recursos propios.","Escribir cinco cualidades y una situación donde se expresaron.","Lista de fortalezas personales."],
 ["Escuchar mis necesidades y emociones actuales.","Atención personal, reflexión y autoconocimiento.","Registrar cómo me siento y qué necesito en esta etapa.","Bitácora de reflexión."],
 ["Reconocer experiencias y aprendizajes importantes.","Cambios, decisiones y experiencias significativas.","Elegir una experiencia y describir qué aprendí de ella.","Relato y aprendizaje."],
 ["Observar ideas y emociones que influyen en el presente.","Creencias personales y su efecto en decisiones cotidianas.","Identificar una creencia y escribir cómo influye en mis acciones.","Ficha de reflexión personal."],
 ["Valorar capacidades desarrolladas a lo largo de mi historia.","Resiliencia, apoyos y recursos disponibles.","Recordar un reto e identificar los recursos que utilicé.","Inventario de recursos personales."],
 ["Identificar valores y fortalezas que orientan mis decisiones.","Valores, prioridades y coherencia personal.","Seleccionar tres valores y describir cómo los vivo.","Mapa de valores."],
 ["Clarificar lo que deseo construir en mi siguiente etapa.","Deseos, prioridades y posibilidades reales.","Escribir tres cambios o experiencias que deseo cultivar.","Visión personal inicial."],
 ["Explorar decisiones alineadas con mis valores.","Alternativas, consecuencias y dirección personal.","Elegir una decisión pendiente y comparar opciones.","Ficha de decisión consciente."],
 ["Convertir una intención en una acción posible.","Acciones pequeñas, concretas y sostenibles.","Definir un primer paso y cuándo realizarlo.","Plan de acción inicial."],
 ["Formular compromisos amables y realistas.","Hábitos, apoyos y seguimiento personal.","Anotar un compromiso y cómo sabré que avancé.","Compromiso personal escrito."],
 ["Integrar el proceso de reflexión en la vida cotidiana.","Aprendizajes, gratitud y continuidad.","Escribir una carta a mi yo futuro con tres aprendizajes.","Carta de cierre y continuidad."]
];

const format=([objective,topics,activity,evidence])=>[
 "OBJETIVO DE APRENDIZAJE",objective,"",
 "QUÉ VEREMOS",topics,"",
 "ACTIVIDAD PRÁCTICA",activity,"",
 "RESULTADO QUE CONSERVARÁS",evidence,"",
 "PARA REFLEXIONAR","¿Qué significa esto para mi propia historia o camino? ¿Qué deseo conservar y qué prefiero reservar?","",
 "CIERRE","Guarda tu actividad en un lugar privado y avanza cuando te sientas listo. No estás obligado a compartir experiencias personales."
].join("\n");

export const lessonInformation={
 "el-legado-que-trasciende":legado.map(format),
 "la-mujer-del-faro":faro.map(format)
};
