import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/config/seo";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import { TrackedLink } from "@/components/TrackedLink";
import { commercialLinks } from "@/content/comercial";

export const metadata: Metadata = pageMetadata({
  title: "Coaching personal | Agenda una conversación con Guadalupe Gómez Pezuela",
  description: "Encuentra un espacio de escucha para tomar decisiones, fortalecer tu confianza y avanzar con claridad. Comparte tus datos y solicita una conversación de coaching personal con Guadalupe Gómez Pezuela.",
  path: "/coaching-personal/landing",
  image: "/images/servicio-coaching-personal.webp",
});

const benefits = [
  { title: "Claridad para decidir", text: "Explora nuevas perspectivas y elige los siguientes pasos con mayor conciencia." },
  { title: "Confianza y autoestima", text: "Reconoce tus recursos personales y trabaja en los límites que necesitas establecer." },
  { title: "Transiciones y cambios", text: "Encuentra un espacio para ordenar tus ideas ante nuevas etapas de tu vida." },
];

export default function CoachingPersonalLandingPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell g-subhero-grid">
          <div>
            <span className="g-eyebrow">Coaching personal · Guadalupe Gómez Pezuela</span>
            <h1>Un espacio para escucharte, reconectar contigo y avanzar con claridad.</h1>
            <p className="g-lead">No tienes que tener todas las respuestas hoy. Comencemos con una conversación para comprender lo que estás viviendo y descubrir qué necesitas para dar tu siguiente paso.</p>
            <div className="g-actions">
              <a className="btn btn-primary" href="#agendar-cita">Quiero agendar una conversación</a>
              <TrackedLink className="btn g-btn-line" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer">Prefiero escribir por WhatsApp</TrackedLink>
            </div>
            <p className="g-disclaimer">Solicitud sin compromiso. La disponibilidad de las sesiones se confirma personalmente.</p>
          </div>
          <img className="g-subhero-image" src="/images/servicio-coaching-personal.webp" alt="Acompañamiento de coaching personal con Guadalupe Gómez Pezuela" fetchPriority="high" />
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Este espacio es para ti</span>
            <h2>Cuando necesitas escucharte, una conversación puede abrir nuevas posibilidades.</h2>
            <p>El coaching personal es un acompañamiento para reflexionar, definir objetivos y avanzar con decisiones propias.</p>
          </header>
          <div className="g-columns-3">
            {benefits.map((item, index) => <article className="g-card" key={item.title}>
              <span className="g-card-num">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell g-feature-grid">
          <div className="g-feature-image">
            <img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela, coach personal y empresarial" loading="lazy" />
          </div>
          <div>
            <span className="g-eyebrow">Conoce a Guadalupe</span>
            <h2>Un acompañamiento humano, cercano y respetuoso.</h2>
            <p>Mi propósito es acompañarte a reconocer tus recursos, mirar tu situación desde nuevas perspectivas y construir pasos posibles. Tú decides el rumbo; yo te acompaño con preguntas, herramientas y escucha.</p>
            <div className="g-actions"><Link className="btn g-btn-line" href="/sobre-mi">Conoce mi trayectoria</Link></div>
            <p className="g-disclaimer">El coaching no sustituye la atención psicológica ni médica.</p>
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Así comenzamos</span>
            <h2>El primer paso es sencillo.</h2>
          </header>
          <div className="g-columns-3">
            <article className="g-card"><span className="g-card-num">01</span><h3>Comparte tus datos</h3><p>Déjanos tu nombre, correo electrónico, teléfono y una breve descripción de lo que deseas trabajar.</p></article>
            <article className="g-card"><span className="g-card-num">02</span><h3>Elige tu horario preferido</h3><p>Selecciona una fecha y una hora para que podamos revisar la disponibilidad.</p></article>
            <article className="g-card"><span className="g-card-num">03</span><h3>Nos ponemos en contacto</h3><p>Guadalupe revisará tu solicitud y confirmará contigo las condiciones de la conversación.</p></article>
          </div>
        </div>
      </section>

      <AppointmentCalendar />
      <section className="g-section g-section-alt">
        <div className="shell g-final">
          <div>
            <span className="g-eyebrow">¿Necesitas saber más?</span>
            <h2>Conversemos antes de decidir.</h2>
            <p>Si todavía tienes preguntas, puedes conocer el proceso de coaching o enviar un mensaje directo.</p>
          </div>
          <Link className="btn btn-primary" href="/coaching-personal">Conocer el acompañamiento</Link>
        </div>
      </section>
    </main>
  );
}
