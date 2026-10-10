import type { Metadata } from "next";
import { BusinessInquiry } from "@/components/BusinessInquiry";

export const metadata: Metadata = {
  title: "Consultoría empresarial y desarrollo organizacional",
  description: "Consultoría con Guadalupe Gómez Pezuela para analizar la organización, sus procesos, recursos humanos, riesgos, oportunidades y prioridades estratégicas.",
};

const areas = [
  {
    number: "01",
    title: "Análisis organizacional",
    description: "Observo cómo se toman decisiones, cómo fluye la comunicación y qué dinámicas están facilitando o deteniendo los resultados.",
    points: ["Estructura y responsabilidades", "Comunicación entre niveles", "Coordinación y seguimiento"],
  },
  {
    number: "02",
    title: "Análisis de procesos",
    description: "Revisamos la forma real en que se realiza el trabajo para localizar duplicidades, vacíos, cuellos de botella y acuerdos poco claros.",
    points: ["Flujos de trabajo", "Puntos de decisión", "Roles, acuerdos y seguimiento"],
  },
  {
    number: "03",
    title: "Análisis de recursos humanos",
    description: "Identifico necesidades de liderazgo, colaboración y desarrollo que afectan la capacidad del equipo para responder a los objetivos del negocio.",
    points: ["Necesidades de capacitación", "Liderazgo y desempeño", "Clima y conversaciones internas"],
  },
  {
    number: "04",
    title: "Riesgos y oportunidades",
    description: "Hacemos visibles las situaciones humanas y operativas que pueden convertirse en conflicto, desgaste, pérdida de tiempo o posibilidades de mejora.",
    points: ["Riesgos de coordinación", "Tensiones entre áreas", "Oportunidades de mejora"],
  },
  {
    number: "05",
    title: "Desarrollo de estrategias",
    description: "Convertimos el diagnóstico en prioridades, responsables y acciones que la organización pueda ejecutar y revisar.",
    points: ["Objetivos de intervención", "Plan de acción", "Indicadores y revisión"],
  },
] as const;

export default function ConsultoriaPage() {
  return (
    <main className="consulting-page">
      <section className="consulting-hero">
        <div className="consulting-hero-media" aria-hidden="true">
          <img src="/images/coaching-empresarial-hero.webp" alt="" fetchPriority="high" />
        </div>
        <div className="shell consulting-hero-grid">
          <div className="consulting-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Consultoría empresarial</span>
            <h1>Antes de proponer una solución, comprendo cómo está funcionando tu organización.</h1>
            <p>Analizo contigo la estructura, los procesos y las dinámicas humanas que están influyendo en los resultados para convertir el diagnóstico en decisiones y acciones concretas.</p>
            <a className="btn btn-gold" href="#solicitud">Solicitar un diagnóstico inicial</a>
          </div>
        </div>
      </section>

      <section className="consulting-context">
        <div className="shell consulting-context-grid">
          <div>
            <span className="services-eyebrow">Cuándo puede ayudarte</span>
            <h2>Cuando el esfuerzo existe, pero la organización no avanza con la misma claridad.</h2>
          </div>
          <div className="consulting-signals">
            <p>La consultoría puede ser útil cuando:</p>
            <ul>
              <li>Los acuerdos no se cumplen o nadie sabe quién debe darles seguimiento.</li>
              <li>Existen conflictos o poca comunicación entre áreas.</li>
              <li>Los supervisores necesitan fortalecer su capacidad para dirigir.</li>
              <li>El crecimiento de la empresa superó la forma anterior de organizarse.</li>
              <li>Hay retrabajos, decisiones lentas o responsabilidades poco claras.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="consulting-areas">
        <div className="shell">
          <header className="consulting-section-head">
            <span className="services-eyebrow">Áreas de intervención</span>
            <h2>Una mirada integral para encontrar el punto que realmente necesita atención.</h2>
          </header>
          <div className="consulting-area-list">
            {areas.map((area) => (
              <article key={area.number}>
                <span className="consulting-area-number">{area.number}</span>
                <div><h3>{area.title}</h3><p>{area.description}</p></div>
                <ul>{area.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="consulting-method">
        <div className="shell consulting-method-grid">
          <div className="consulting-method-intro">
            <span className="services-eyebrow services-eyebrow-light">Cómo trabajo contigo</span>
            <h2>Diagnosticar, priorizar y acompañar la implementación.</h2>
            <p>No entrego una recomendación aislada. Busco que la propuesta tenga responsables, seguimiento y relación directa con el reto que la empresa necesita resolver.</p>
          </div>
          <ol className="consulting-steps">
            <li><span>01</span><div><strong>Conversación inicial</strong><p>Escucho el contexto, el reto y el resultado que esperan alcanzar.</p></div></li>
            <li><span>02</span><div><strong>Diagnóstico</strong><p>Recopilo información y observo procesos, responsabilidades y relaciones clave.</p></div></li>
            <li><span>03</span><div><strong>Propuesta</strong><p>Presento prioridades, alcance, formato de intervención y acciones recomendadas.</p></div></li>
            <li><span>04</span><div><strong>Acompañamiento</strong><p>Revisamos avances, aprendizajes y ajustes necesarios durante la implementación.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="consulting-outcomes">
        <div className="shell consulting-outcomes-grid">
          <div><span className="services-eyebrow">Lo que recibirás</span><h2>Claridad para tomar decisiones y coordinar la siguiente etapa.</h2></div>
          <div className="consulting-outcome-cards">
            <article><strong>Lectura del reto</strong><p>Una explicación ordenada de lo que está ocurriendo y cómo afecta a la organización.</p></article>
            <article><strong>Prioridades</strong><p>Los temas que conviene atender primero según su impacto y posibilidad de acción.</p></article>
            <article><strong>Ruta de intervención</strong><p>Recomendaciones de consultoría, capacitación o coaching alineadas al diagnóstico.</p></article>
            <article><strong>Seguimiento</strong><p>Criterios para revisar avances, sostener acuerdos y ajustar el proceso.</p></article>
          </div>
        </div>
      </section>

      <section className="section business-form-section" id="solicitud">
        <div className="shell"><BusinessInquiry /></div>
      </section>
    </main>
  );
}
