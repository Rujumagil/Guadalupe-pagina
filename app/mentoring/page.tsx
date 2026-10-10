import type { Metadata } from "next";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentoring para líderes y desarrollo profesional",
  description: "Mentoring con Guadalupe Gómez Pezuela para líderes, profesionistas y formadores que necesitan criterio, orientación práctica y una ruta clara para su siguiente etapa.",
};

const mentoringUrl = buildWhatsAppUrl("Hola Guadalupe, quiero solicitar una conversación de valoración para un proceso de mentoring. Me gustaría contarte la etapa profesional que estoy viviendo.");

const routes = [
  {
    number: "01",
    title: "Liderazgo y dirección",
    description: "Para quienes están asumiendo mayor responsabilidad y necesitan construir una manera propia de dirigir, comunicar y tomar decisiones.",
    points: ["Transición a un nuevo rol", "Criterio para decidir", "Comunicación y presencia directiva"],
  },
  {
    number: "02",
    title: "Desarrollo profesional",
    description: "Para profesionistas que quieren ordenar su experiencia, definir prioridades y dar forma a una nueva etapa con mayor intención.",
    points: ["Dirección profesional", "Fortalezas y experiencia", "Plan de avance"],
  },
  {
    number: "03",
    title: "Formación y acompañamiento",
    description: "Para facilitadores y personas que acompañan procesos humanos y desean fortalecer su claridad, estructura y forma de intervenir.",
    points: ["Diseño de experiencias", "Criterio de intervención", "Comunicación con grupos"],
  },
] as const;

export default function MentoringPage() {
  return (
    <main className="mentoring-page">
      <section className="mentoring-hero">
        <div className="mentoring-hero-media" aria-hidden="true">
          <img src="/images/guadalupe-trayectoria.webp" alt="" fetchPriority="high" />
        </div>
        <div className="shell mentoring-hero-grid">
          <div className="mentoring-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Mentoring con Guadalupe</span>
            <h1>No tienes que construir tu siguiente etapa sin una mirada experimentada.</h1>
            <p>Comparto contigo experiencia, preguntas, criterio y herramientas para ayudarte a ordenar lo que sabes, mirar alternativas y tomar decisiones profesionales con mayor claridad.</p>
            <a className="btn btn-gold" href={mentoringUrl} target="_blank" rel="noopener">Solicitar una conversación de valoración</a>
          </div>
        </div>
      </section>

      <section className="mentoring-definition">
        <div className="shell mentoring-definition-grid">
          <div>
            <span className="services-eyebrow">Qué es el mentoring</span>
            <h2>Experiencia compartida para tomar mejores decisiones.</h2>
          </div>
          <div className="mentoring-definition-copy">
            <p>En un proceso de mentoring no sólo te acompaño a encontrar tus propias respuestas. También pongo a tu disposición mi experiencia como coach, formadora y consultora para ayudarte a reconocer posibilidades, anticipar retos y construir una ruta práctica.</p>
            <p>El propósito no es decirte qué hacer, sino ampliar tu criterio para que puedas elegir con mayor conciencia y avanzar con autonomía.</p>
          </div>
        </div>
      </section>

      <section className="mentoring-routes">
        <div className="shell">
          <header className="mentoring-section-head">
            <span className="services-eyebrow">Rutas de mentoring</span>
            <h2>Un proceso enfocado en la etapa que estás construyendo.</h2>
          </header>
          <div className="mentoring-route-grid">
            {routes.map((route) => (
              <article key={route.number}>
                <span className="mentoring-route-number">{route.number}</span>
                <h3>{route.title}</h3>
                <p>{route.description}</p>
                <ul>{route.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mentoring-compare">
        <div className="shell mentoring-compare-grid">
          <div className="mentoring-compare-intro">
            <span className="services-eyebrow services-eyebrow-light">Mentoring o coaching</span>
            <h2>Dos formas de acompañar. Una elección según lo que necesitas.</h2>
            <p>Podemos identificar el enfoque adecuado durante la conversación inicial. En algunos procesos ambas formas de trabajo pueden complementarse.</p>
          </div>
          <div className="mentoring-compare-cards">
            <article><span>Mentoring</span><h3>Necesitas orientación y criterio.</h3><p>Es adecuado cuando quieres aprender de la experiencia, revisar alternativas y recibir referencias prácticas para una etapa profesional.</p></article>
            <article><span>Coaching</span><h3>Necesitas descubrir y movilizar tus respuestas.</h3><p>Es adecuado cuando el objetivo es trabajar creencias, decisiones, conductas y recursos propios mediante preguntas y práctica.</p></article>
          </div>
        </div>
      </section>

      <section className="mentoring-process">
        <div className="shell">
          <header className="mentoring-section-head">
            <span className="services-eyebrow">Cómo se desarrolla</span>
            <h2>Una ruta personalizada, con foco y aplicación.</h2>
          </header>
          <div className="mentoring-process-grid">
            <article><span>01</span><h3>Valoramos el momento</h3><p>Conversamos sobre tu trayectoria, el reto actual y lo que quieres construir.</p></article>
            <article><span>02</span><h3>Definimos el foco</h3><p>Elegimos prioridades y criterios para reconocer un avance útil.</p></article>
            <article><span>03</span><h3>Revisamos alternativas</h3><p>Integramos experiencia, preguntas y herramientas aplicables a situaciones reales.</p></article>
            <article><span>04</span><h3>Construyes tu ruta</h3><p>Traducimos lo aprendido en decisiones, acciones y una forma de dar seguimiento.</p></article>
          </div>
        </div>
      </section>

      <section className="mentoring-outcomes">
        <div className="shell mentoring-outcomes-grid">
          <div><span className="services-eyebrow">Lo que buscamos</span><h2>Que avances con más criterio, no con mayor dependencia.</h2></div>
          <div className="mentoring-outcome-list">
            <article><strong>Perspectiva</strong><p>Mirar el reto desde nuevos ángulos y reconocer lo que todavía no estabas considerando.</p></article>
            <article><strong>Dirección</strong><p>Definir prioridades y evitar dispersarte entre demasiadas posibilidades.</p></article>
            <article><strong>Aplicación</strong><p>Convertir cada conversación en decisiones y acciones vinculadas con tu realidad.</p></article>
            <article><strong>Autonomía</strong><p>Fortalecer tu propio criterio para continuar avanzando después del proceso.</p></article>
          </div>
        </div>
      </section>

      <section className="mentoring-final">
        <div className="shell mentoring-final-grid">
          <div><span className="services-eyebrow services-eyebrow-light">Da el siguiente paso</span><h2>Cuéntame qué etapa estás construyendo.</h2><p>En la conversación inicial revisaremos tu objetivo y si el mentoring es la forma de acompañamiento más adecuada.</p></div>
          <a className="btn btn-gold" href={mentoringUrl} target="_blank" rel="noopener">Solicitar mentoring con Guadalupe</a>
        </div>
      </section>
    </main>
  );
}
