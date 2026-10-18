import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import Link from "next/link";
import { TrackedLink } from "@/components/TrackedLink";
import { commercialLinks, coachingProcess, personalFaq, personalTopics } from "@/content/comercial";

export const metadata: Metadata = pageMetadata({
  title: "Coaching personal con Guadalupe Gómez Pezuela",
  description: "Sesiones de coaching personal para tomar decisiones, fortalecer límites y avanzar con claridad. Conoce cómo es el acompañamiento.",
  path: "/coaching-personal",
  image: "/images/servicio-coaching-personal.webp",
});

export default function CoachingPersonalPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell g-subhero-grid">
          <div>
            <span className="g-eyebrow">Coaching personal · Guadalupe Gómez Pezuela</span>
            <h1>Un espacio para escucharte y elegir cómo avanzar.</h1>
            <p className="g-lead">Cuando estás frente a una decisión, una transición o una
            conversación pendiente, no necesitas respuestas prefabricadas. Trabajamos
            para comprender tu situación, ampliar tu mirada y construir pasos concretos.</p>
            <div className="g-actions">
              <TrackedLink className="btn btn-primary" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer">Quiero conocer las sesiones</TrackedLink>
              <a className="btn g-btn-line" href="#como-trabajamos">Cómo es el proceso</a>
            </div>
          </div>
          <img className="g-subhero-image" src="/images/servicio-coaching-personal.webp" alt="Coaching personal y conversación de acompañamiento" fetchPriority="high" />
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">¿Es para ti?</span>
            <h2>Podemos trabajar lo que hoy necesita tu atención.</h2>
            <p>El coaching personal puede ser útil para quienes desean actuar con mayor
            conciencia y claridad ante desafíos de la vida cotidiana.</p>
          </header>
          <div className="g-columns-2">
            {personalTopics.map((topic, i) => <article className="g-card" key={topic.title}>
              <span className="g-card-num">0{i + 1}</span>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt" id="como-trabajamos">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">El acompañamiento</span>
            <h2>Así comienza tu proceso de coaching.</h2>
            <p>Partimos de tus necesidades. Antes de contratar acordamos objetivos,
            modalidad, duración, frecuencia e inversión.</p>
          </header>
          <div className="g-columns-4">
            {coachingProcess.map((step) => <article className="g-card" key={step.step}>
              <span className="g-card-num">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell g-feature-grid">
          <div className="g-feature-image"><img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela" loading="lazy" /></div>
          <div>
            <span className="g-eyebrow">Quién te acompaña</span>
            <h2>Sensibilidad para escuchar. Claridad para avanzar.</h2>
            <p>Mi experiencia en coaching y desarrollo humano me permite acompañar
            conversaciones difíciles con respeto por tu historia y por tus decisiones.
            Tú defines los objetivos; yo aporto preguntas, herramientas y seguimiento.</p>
            <p className="g-disclaimer">El coaching no sustituye la atención psicológica o
            médica. Si tu situación requiere atención clínica, es importante acudir con
            una persona profesional de la salud.</p>
            <div className="g-actions"><Link className="btn g-btn-line" href={commercialLinks.about}>Conoce mi trayectoria</Link></div>
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Antes de empezar</span>
            <h2>Preguntas frecuentes</h2>
          </header>
          <div className="g-faq">
            {personalFaq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="g-section g-section-purple" id="reservar">
        <div className="shell g-final">
          <div>
            <span className="g-eyebrow">Primer contacto</span>
            <h2>Cuéntame qué te gustaría trabajar.</h2>
            <p>Podemos conversar sobre si este proceso es adecuado para ti y definir las
            condiciones antes de agendar tu primera sesión.</p>
          </div>
          <TrackedLink className="btn btn-gold" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer">Consultar disponibilidad</TrackedLink>
        </div>
      </section>
    </main>
  );
}
