import type { Metadata } from "next";
import Link from "next/link";
import { BusinessInquiry } from "@/components/BusinessInquiry";
import { TrackedLink } from "@/components/TrackedLink";
import { businessChallenges, businessFaq, coachingProcess, commercialLinks, executiveTopics } from "@/content/comercial";

export const metadata: Metadata = {
  title: "Coaching empresarial y ejecutivo",
  description: "Coaching ejecutivo y de equipos con Guadalupe Gómez Pezuela: delegación, liderazgo, comunicación, decisiones y seguimiento para organizaciones.",
};

export default function EmpresasPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell g-subhero-grid">
          <div>
            <span className="g-eyebrow">Coaching empresarial · Liderazgo y equipos</span>
            <h1>Mejores conversaciones. Decisiones más claras. Equipos mejor coordinados.</h1>
            <p className="g-lead">Acompaño a líderes y organizaciones que necesitan
            revisar su manera de decidir, delegar, comunicar y coordinar el trabajo.
            Partimos de situaciones reales, no de recetas generales.</p>
            <div className="g-actions">
              <a className="btn btn-primary" href="#solicitud">Solicitar conversación empresarial</a>
              <a className="btn g-btn-line" href="#soluciones">Ver modalidades</a>
            </div>
          </div>
          <img className="g-subhero-image" src="/images/coaching-empresarial-hero.webp" alt="Desarrollo de liderazgo en organizaciones" fetchPriority="high" />
        </div>
      </section>

      <section className="g-section" id="soluciones">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Dos rutas de acompañamiento</span>
            <h2>El formato depende del reto, no al revés.</h2>
            <p>Podemos trabajar con una persona en posición de liderazgo o con un equipo
            que necesita fortalecer su coordinación.</p>
          </header>
          <div className="g-columns-2">
            {executiveTopics.map((item) => <article className="g-card" key={item.title}>
              <span className="g-card-num">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a className="g-contact-link" href="#solicitud">Solicitar propuesta →</a>
            </article>)}
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell g-feature-grid">
          <div>
            <span className="g-eyebrow">Situaciones reales</span>
            <h2>Trabajamos los desafíos que están afectando al liderazgo.</h2>
            <ul className="g-checklist">
              {businessChallenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
            </ul>
            <div className="g-actions"><a className="btn btn-primary" href="#solicitud">Conversemos sobre tu equipo</a></div>
          </div>
          <div className="g-feature-image"><img src="/images/servicio-coaching-ejecutivo.webp" alt="Coaching ejecutivo para líderes y responsables de equipos" loading="lazy" /></div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Cómo trabajaremos</span>
            <h2>Un proceso adaptado a las necesidades del negocio.</h2>
            <p>El alcance, los participantes, la modalidad, el calendario y la inversión
            se definen por propuesta y se acuerdan antes de comenzar.</p>
          </header>
          <div className="g-columns-4">
            {coachingProcess.map((step) => <article className="g-card" key={step.step}>
              <span className="g-card-num">{step.step}</span>
              <h3>{step.title}</h3><p>{step.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell g-columns-2">
          <div>
            <span className="g-eyebrow">Servicios complementarios</span>
            <h2>Capacitación y conferencias cuando el objetivo lo requiere.</h2>
          </div>
          <div>
            <p>Además del coaching, es posible diseñar talleres de liderazgo,
            comunicación, coordinación e inteligencia emocional, así como conferencias.
            La propuesta adecuada se define después de comprender el contexto.</p>
            <div className="g-actions"><Link className="btn g-btn-line" href="/capacitacion">Ver capacitación para equipos</Link></div>
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Preguntas frecuentes</span>
            <h2>Antes de solicitar una propuesta</h2>
          </header>
          <div className="g-faq">{businessFaq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell" id="solicitud"><BusinessInquiry /></div>
      </section>

      <section className="g-section g-section-purple">
        <div className="shell g-final">
          <div>
            <span className="g-eyebrow">¿Prefieres conversar primero?</span>
            <h2>Hablemos del reto de tu organización.</h2>
            <p>Un primer intercambio permite determinar si el coaching ejecutivo o de
            equipos puede responder a la necesidad.</p>
          </div>
          <TrackedLink className="btn btn-gold" href={commercialLinks.businessWhatsApp} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</TrackedLink>
        </div>
      </section>
    </main>
  );
}
