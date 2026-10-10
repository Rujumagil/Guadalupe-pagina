import type { Metadata } from "next";
import { BusinessInquiry } from "@/components/BusinessInquiry";

export const metadata: Metadata = {
  title: "Capacitación y coaching para empresas",
  description: "Programas de liderazgo, comunicación, inteligencia emocional y coordinación de equipos con Guadalupe Gómez Pezuela.",
};

const programs = [
  {
    title: "Liderazgo y comunicación para mandos medios",
    description: "Para supervisores y responsables con experiencia técnica que necesitan fortalecer su capacidad para dirigir personas.",
    bullets: ["Delegación e instrucciones claras", "Retroalimentación útil", "Seguimiento y conversaciones de desempeño"],
  },
  {
    title: "Equipos que cumplen acuerdos",
    description: "Para organizaciones que necesitan mejorar la coordinación entre personas, áreas y responsabilidades.",
    bullets: ["Acuerdos observables", "Responsabilidad compartida", "Comunicación y seguimiento entre áreas"],
  },
  {
    title: "Inteligencia emocional para trabajar bajo presión",
    description: "Para equipos que enfrentan cambios, conflictos, alta exigencia o conversaciones difíciles.",
    bullets: ["Autorregulación", "Manejo de conflictos", "Conversaciones difíciles con claridad"],
  },
] as const;

export default function EmpresasPage() {
  return (
    <main className="business-page">
      <section className="business-hero">
        <div className="shell business-hero-grid">
          <div>
            <span className="eyebrow">Personas que lideran · equipos que avanzan</span>
            <h1>Capacitación, coaching ejecutivo y conferencias para empresas.</h1>
            <p className="lead">Ayudo a tu empresa a desarrollar líderes que comuniquen con claridad y equipos que coordinen su trabajo y cumplan acuerdos.</p>
            <a className="btn btn-primary" href="#solicitud">Solicitar propuesta</a>
          </div>
          <aside className="business-hero-note">
            <strong>Una propuesta construida desde la necesidad real</strong>
            <p>Iniciamos con un diagnóstico breve para comprender el contexto, los participantes y el resultado esperado. Después definimos alcance, formato y seguimiento.</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <header className="section-head">
            <h2>Programas iniciales para líderes y equipos</h2>
            <p>Los contenidos se adaptan al nivel de responsabilidad, el contexto operativo y los retos de la organización.</p>
          </header>
          <div className="company-program-grid">
            {programs.map((program) => (
              <article className="company-program-card" key={program.title}>
                <h3>{program.title}</h3><p>{program.description}</p>
                <ul>{program.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell business-format-grid">
          <div><span className="eyebrow">Formatos</span><h2>Una intervención adecuada al objetivo.</h2></div>
          <div className="format-list">
            <article><strong>Capacitación</strong><p>Sesiones prácticas para desarrollar habilidades aplicables al trabajo.</p></article>
            <article><strong>Coaching ejecutivo</strong><p>Acompañamiento individual para líderes que requieren objetivos y seguimiento.</p></article>
            <article><strong>Conferencias</strong><p>Experiencias para sensibilizar, abrir conversación y movilizar a grupos amplios.</p></article>
          </div>
        </div>
      </section>

      <section className="section business-form-section"><div className="shell"><BusinessInquiry /></div></section>
    </main>
  );
}
