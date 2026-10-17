import type { Metadata } from "next";
import Link from "next/link";
import { commercialLinks } from "@/content/comercial";

export const metadata: Metadata = {
  title: "Sobre mí | Guadalupe Gómez Pezuela",
  description: "Conoce la trayectoria, la formación y el enfoque de Guadalupe Gómez Pezuela en coaching personal, coaching ejecutivo y desarrollo humano.",
};

export default function SobreMiPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell g-subhero-grid">
          <div>
            <span className="g-eyebrow">Soy Guadalupe Gómez Pezuela</span>
            <h1>Escuchar, comprender y actuar: así entiendo el acompañamiento.</h1>
            <p className="g-lead">Mi trabajo reúne el coaching, la formación en desarrollo
            humano y la experiencia con personas, líderes y equipos. Me importa que
            cada conversación tenga profundidad, respeto y utilidad práctica.</p>
            <div className="g-actions"><Link className="btn btn-primary" href={commercialLinks.contact}>Conversemos</Link></div>
          </div>
          <img className="g-subhero-image" src="/images/guadalupe-trayectoria.webp" alt="Retrato profesional de Guadalupe Gómez Pezuela" fetchPriority="high" />
        </div>
      </section>

      <section className="g-section">
        <div className="shell g-feature-grid">
          <div>
            <span className="g-eyebrow">Mi trayectoria</span>
            <h2>Una mirada construida entre el aprendizaje y las personas.</h2>
            <p>Mi interés por comprender cómo pensamos, aprendemos y cambiamos me
            llevó a estudiar Pedagogía en la UNAM y a continuar formándome en
            coaching, Programación Neurolingüística y otras herramientas de
            desarrollo humano.</p>
            <p>He acompañado procesos individuales, de liderazgo y de equipos,
            con una convicción: cada persona y organización necesita encontrar
            un camino coherente con su propio contexto.</p>
          </div>
          <div className="g-contact-panel">
            <span className="g-eyebrow">Mi enfoque</span>
            <h3>Sin recetas ni respuestas impuestas.</h3>
            <p>Escucho la situación, planteo preguntas que permitan mirar desde
            nuevas perspectivas y ayudo a convertir lo aprendido en compromisos
            observables.</p>
            <p className="g-muted">La relación de coaching se establece con objetivos,
            alcance y condiciones acordadas. Las metodologías complementarias
            no sustituyen atención médica o psicológica.</p>
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Formación y experiencia</span>
            <h2>Herramientas al servicio del proceso.</h2>
            <p>La formación aporta una base; la escucha y la práctica determinan
            qué necesita cada acompañamiento.</p>
          </header>
          <div className="g-columns-3">
            <article className="g-card"><span className="g-card-num">01</span><h3>Coaching empresarial</h3><p>Formación como Coach Senior Empresarial y trabajo con líderes en sus desafíos de gestión y comunicación.</p></article>
            <article className="g-card"><span className="g-card-num">02</span><h3>Programación Neurolingüística</h3><p>Formación en PNL y aplicación de herramientas de comunicación y cambio de perspectiva.</p></article>
            <article className="g-card"><span className="g-card-num">03</span><h3>Desarrollo humano</h3><p>Trayectoria vinculada a aprendizaje, procesos individuales, capacitación y acompañamiento de equipos.</p></article>
          </div>
        </div>
      </section>

      <section className="g-section g-section-purple">
        <div className="shell g-final">
          <div><span className="g-eyebrow">Trabajemos juntos</span><h2>Elige el tipo de coaching que necesitas.</h2><p>Podemos explorar una necesidad personal o un reto de liderazgo y organización.</p></div>
          <div className="g-actions">
            <Link className="btn btn-gold" href={commercialLinks.personal}>Coaching personal</Link>
            <Link className="btn btn-outline-light" href={commercialLinks.business}>Coaching empresarial</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
