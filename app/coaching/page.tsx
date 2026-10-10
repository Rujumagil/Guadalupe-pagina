import type { Metadata } from "next";
import { BusinessInquiry } from "@/components/BusinessInquiry";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Coaching ejecutivo y personal con Guadalupe Gómez Pezuela",
  description: "Procesos de coaching para líderes que necesitan dirigir con claridad y para personas que quieren recuperar confianza, poner límites y tomar decisiones.",
};

const personalUrl = buildWhatsAppUrl("Hola Guadalupe, quiero agendar una orientación personal para conversar sobre mi situación y conocer el proceso de coaching.");

const executiveNeeds = [
  "Comunicar instrucciones, prioridades y expectativas con claridad.",
  "Delegar sin perder seguimiento ni asumir todo personalmente.",
  "Dar retroalimentación y sostener conversaciones difíciles.",
  "Tomar decisiones con mayor seguridad en momentos de presión.",
  "Pasar de la experiencia técnica a un liderazgo consciente.",
] as const;

const personalNeeds = [
  "Recuperar confianza y volver a reconocer lo que necesitas.",
  "Poner límites sin culpa y expresarte con mayor claridad.",
  "Atravesar una separación, un cambio laboral o una nueva etapa.",
  "Comprender patrones que se repiten en tus relaciones.",
  "Tomar una decisión y convertirla en acciones que puedas sostener.",
] as const;

export default function CoachingPage() {
  return (
    <main className="coaching-service-page">
      <section className="coaching-service-hero">
        <div className="coaching-service-hero-media" aria-hidden="true">
          <img src="/images/servicio-coaching-ejecutivo.webp" alt="" fetchPriority="high" />
        </div>
        <div className="shell coaching-service-hero-grid">
          <div className="coaching-service-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Coaching con Guadalupe</span>
            <h1>Una conversación puede darte claridad. Un proceso puede cambiar tu manera de avanzar.</h1>
            <p>Te acompaño a comprender el reto que estás viviendo, definir un objetivo y convertir lo que descubras en decisiones, conversaciones y acciones concretas.</p>
            <div className="coaching-service-actions">
              <a className="btn btn-gold" href="#ejecutivo">Solicitar coaching ejecutivo</a>
              <a className="btn btn-outline-light" href="#personal">Agendar coaching personal</a>
            </div>
          </div>
        </div>
      </section>

      <section className="coaching-choice">
        <div className="shell">
          <header className="coaching-choice-head">
            <span className="services-eyebrow">Elige el proceso que necesitas</span>
            <h2>Dos contextos diferentes. La misma intención: avanzar con claridad.</h2>
          </header>
          <div className="coaching-choice-grid">
            <a href="#ejecutivo"><span>Para líderes</span><h3>Coaching ejecutivo</h3><p>Fortalece tu forma de comunicar, decidir, delegar y coordinar personas.</p><strong>Quiero trabajar mi liderazgo →</strong></a>
            <a href="#personal"><span>Para ti</span><h3>Coaching personal</h3><p>Recupera confianza, establece límites y construye la siguiente etapa de tu vida.</p><strong>Quiero trabajar en mí →</strong></a>
          </div>
        </div>
      </section>

      <section className="coaching-path coaching-path-executive" id="ejecutivo">
        <div className="shell coaching-path-grid">
          <div className="coaching-path-media"><img src="/images/servicio-coaching-ejecutivo.webp" alt="Líder en una sesión de coaching ejecutivo" loading="lazy" /></div>
          <div className="coaching-path-copy">
            <span className="services-eyebrow">Coaching ejecutivo</span>
            <h2>Dirigir personas requiere más que experiencia técnica.</h2>
            <p>Trabajo contigo sobre situaciones reales de tu responsabilidad actual. No partimos de un liderazgo ideal, sino de las conversaciones, decisiones y relaciones que hoy necesitan atención.</p>
            <h3>Este proceso puede ayudarte a:</h3>
            <ul>{executiveNeeds.map((need) => <li key={need}>{need}</li>)}</ul>
            <a className="btn btn-primary" href="#solicitud">Solicitar coaching ejecutivo</a>
          </div>
        </div>
      </section>

      <section className="coaching-path coaching-path-personal" id="personal">
        <div className="shell coaching-path-grid">
          <div className="coaching-path-media"><img src="/images/servicio-coaching-personal.webp" alt="Proceso de coaching personal y acompañamiento" loading="lazy" /></div>
          <div className="coaching-path-copy">
            <span className="services-eyebrow">Coaching personal</span>
            <h2>Volver a ti también es una forma de avanzar.</h2>
            <p>Te ofrezco un espacio cercano y práctico para ordenar lo que estás viviendo, reconocer tus recursos y definir pasos coherentes contigo.</p>
            <h3>Podemos trabajar en:</h3>
            <ul>{personalNeeds.map((need) => <li key={need}>{need}</li>)}</ul>
            <a className="btn btn-primary" href={personalUrl} target="_blank" rel="noopener">Agendar orientación personal</a>
          </div>
        </div>
      </section>

      <section className="coaching-method">
        <div className="shell">
          <header className="coaching-method-head">
            <span className="services-eyebrow services-eyebrow-light">Cómo trabajo contigo</span>
            <h2>El proceso tiene dirección, práctica y seguimiento.</h2>
          </header>
          <div className="coaching-method-grid">
            <article><span>01</span><h3>Escucho el contexto</h3><p>Comprendo qué está ocurriendo y por qué este momento necesita atención.</p></article>
            <article><span>02</span><h3>Definimos el objetivo</h3><p>Acordamos un cambio útil que pueda reconocerse en decisiones o conductas.</p></article>
            <article><span>03</span><h3>Trabajamos lo real</h3><p>Revisamos situaciones concretas, perspectivas, emociones y alternativas de acción.</p></article>
            <article><span>04</span><h3>Llevamos a la práctica</h3><p>Cierras cada etapa con decisiones, compromisos y una forma de revisar el avance.</p></article>
          </div>
        </div>
      </section>

      <section className="coaching-difference">
        <div className="shell coaching-difference-grid">
          <div><span className="services-eyebrow">Mi manera de acompañarte</span><h2>No te doy respuestas prefabricadas. Te ayudo a encontrar una respuesta que puedas sostener.</h2></div>
          <div className="coaching-difference-copy">
            <p>Integro mi experiencia en desarrollo humano, coaching y Programación Neurolingüística para ayudarte a mirar con profundidad sin perder el sentido práctico.</p>
            <blockquote>“Primero comprendemos. Después elegimos. Finalmente actuamos.”</blockquote>
          </div>
        </div>
      </section>

      <section className="section business-form-section" id="solicitud">
        <div className="shell"><BusinessInquiry /></div>
      </section>
    </main>
  );
}
