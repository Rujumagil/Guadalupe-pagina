import type { Metadata } from "next";
import { BusinessInquiry } from "@/components/BusinessInquiry";

export const metadata: Metadata = {
  title: "Capacitación empresarial para líderes y equipos",
  description: "Capacitación con Guadalupe Gómez Pezuela en liderazgo, comunicación, transformación, procesos y cultura de seguridad, diseñada según las necesidades de cada organización.",
};

const lines = [
  {
    number: "01",
    title: "Capacitación ejecutiva",
    description: "Fortalezco las habilidades humanas que necesitan quienes toman decisiones, coordinan personas y representan la cultura de la organización.",
    topics: ["Liderazgo y delegación", "Comunicación y retroalimentación", "Decisiones y conversaciones difíciles"],
  },
  {
    number: "02",
    title: "Capacitación transformacional",
    description: "Acompaño procesos de cambio que requieren nuevas formas de pensar, relacionarse y asumir responsabilidad dentro del equipo.",
    topics: ["Inteligencia emocional", "Adaptación al cambio", "Confianza y responsabilidad compartida"],
  },
  {
    number: "03",
    title: "Capacitación en procesos",
    description: "Traducimos la operación en acuerdos claros para que las áreas comprendan cómo coordinarse, dar seguimiento y responder por los resultados.",
    topics: ["Roles y responsabilidades", "Acuerdos y seguimiento", "Comunicación entre áreas"],
  },
  {
    number: "04",
    title: "Capacitación técnica",
    description: "El contenido técnico se delimita después de conocer la operación y se diseña conforme al alcance, los puestos y los objetivos acordados con la empresa.",
    topics: ["Necesidades por puesto", "Aplicación en el trabajo", "Criterios de ejecución"],
  },
  {
    number: "05",
    title: "Cultura de seguridad",
    description: "Trabajo la dimensión humana de la prevención: liderazgo, comunicación, conciencia del riesgo y responsabilidad cotidiana frente al trabajo seguro.",
    topics: ["Comunicación preventiva", "Liderazgo responsable", "Compromisos de conducta segura"],
  },
] as const;

const formats = [
  { title: "Talleres", copy: "Sesiones participativas para practicar herramientas y convertir conceptos en acciones." },
  { title: "Programas", copy: "Procesos de varias etapas para desarrollar una capacidad y acompañar su aplicación." },
  { title: "Conferencias", copy: "Intervenciones para abrir una conversación, alinear criterios y movilizar al equipo." },
  { title: "Seguimiento", copy: "Espacios posteriores de coaching o revisión para sostener acuerdos y aprendizajes." },
] as const;

export default function CapacitacionPage() {
  return (
    <main className="training-page">
      <section className="training-hero">
        <div className="training-hero-media" aria-hidden="true">
          <img src="/images/servicio-capacitacion-equipos.webp" alt="" fetchPriority="high" />
        </div>
        <div className="shell training-hero-grid">
          <div className="training-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Capacitación empresarial</span>
            <h1>Capacitación que se convierte en conductas y acuerdos observables.</h1>
            <p>Diseño experiencias para que líderes y equipos comprendan qué necesitan hacer diferente, practiquen nuevas herramientas y las lleven a su trabajo cotidiano.</p>
            <a className="btn btn-gold" href="#solicitud">Solicitar una propuesta de capacitación</a>
          </div>
        </div>
      </section>

      <section className="training-intro">
        <div className="shell training-intro-grid">
          <div>
            <span className="services-eyebrow">Formación con propósito</span>
            <h2>No se trata de impartir un tema. Se trata de resolver una necesidad.</h2>
          </div>
          <div>
            <p>Antes de diseñar el programa, escucho el contexto de tu organización: qué está ocurriendo, a quiénes involucra y qué resultado necesitan observar.</p>
            <p>Así, cada experiencia tiene un objetivo claro, ejemplos cercanos a la realidad del equipo y compromisos que pueden ponerse en práctica.</p>
          </div>
        </div>
      </section>

      <section className="training-lines">
        <div className="shell">
          <header className="training-section-head">
            <span className="services-eyebrow">Líneas de capacitación</span>
            <h2>Cinco puertas para desarrollar personas y fortalecer la operación.</h2>
          </header>
          <div className="training-line-grid">
            {lines.map((line) => (
              <article key={line.number}>
                <span className="training-number">{line.number}</span>
                <h3>{line.title}</h3>
                <p>{line.description}</p>
                <ul>{line.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="training-formats">
        <div className="shell training-formats-grid">
          <div className="training-formats-intro">
            <span className="services-eyebrow services-eyebrow-light">Formatos flexibles</span>
            <h2>La forma se adapta al objetivo, no al revés.</h2>
            <p>La propuesta puede integrar una intervención puntual o un proceso progresivo. La duración, modalidad y número de participantes se definen después de la conversación inicial.</p>
          </div>
          <div className="training-format-list">
            {formats.map((format, index) => (
              <article key={format.title}>
                <span>0{index + 1}</span>
                <div><h3>{format.title}</h3><p>{format.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="training-process">
        <div className="shell">
          <header className="training-section-head">
            <span className="services-eyebrow">Cómo construimos el programa</span>
            <h2>Del reto de la empresa a una experiencia aplicable.</h2>
          </header>
          <div className="training-process-grid">
            <article><span>01</span><h3>Diagnóstico</h3><p>Conversamos sobre la necesidad, las personas involucradas y el cambio esperado.</p></article>
            <article><span>02</span><h3>Diseño</h3><p>Defino objetivos, contenidos, ejercicios, formato y alcance de la intervención.</p></article>
            <article><span>03</span><h3>Facilitación</h3><p>Trabajo con el grupo desde la experiencia, la reflexión y la práctica guiada.</p></article>
            <article><span>04</span><h3>Transferencia</h3><p>Cerramos con acuerdos de aplicación y, cuando se requiere, una ruta de seguimiento.</p></article>
          </div>
        </div>
      </section>

      <section className="training-delivery">
        <div className="shell training-delivery-grid">
          <div>
            <span className="services-eyebrow">Qué puedes esperar</span>
            <h2>Una propuesta clara, relevante y conectada con el trabajo real.</h2>
          </div>
          <ul>
            <li><strong>Objetivos definidos</strong><span>Sabremos qué debe comprender, practicar o cambiar el grupo.</span></li>
            <li><strong>Contenido adaptado</strong><span>Los ejemplos y ejercicios responderán al contexto de la organización.</span></li>
            <li><strong>Participación activa</strong><span>La experiencia abrirá conversación, práctica y reflexión, no sólo exposición.</span></li>
            <li><strong>Acuerdos de acción</strong><span>Los aprendizajes se traducirán en compromisos para el trabajo cotidiano.</span></li>
          </ul>
        </div>
      </section>

      <section className="section business-form-section" id="solicitud">
        <div className="shell"><BusinessInquiry /></div>
      </section>
    </main>
  );
}
