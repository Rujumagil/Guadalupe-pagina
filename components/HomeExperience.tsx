import { buildWhatsAppUrl } from "@/config/site";

const personalUrl = buildWhatsAppUrl("Hola Guadalupe, quiero agendar una orientación personal. Me gustaría contarte qué estoy viviendo.");
const businessUrl = buildWhatsAppUrl("Hola Guadalupe, quiero solicitar un diagnóstico para mi empresa. Necesitamos fortalecer a nuestros líderes y equipos.");

const services = [
  { number: "01", audience: "Para ti", title: "Coaching personal", description: "Te acompaño a recuperar confianza, poner límites y tomar decisiones con claridad para construir la siguiente etapa de tu vida.", items: ["Confianza y autoestima", "Relaciones y límites", "Cambios de vida y decisiones"], action: "Agendar mi orientación personal", href: personalUrl, external: true, tone: "personal" },
  { number: "02", audience: "Para líderes", title: "Coaching ejecutivo", description: "Trabajo uno a uno con líderes que necesitan comunicar mejor, delegar, sostener conversaciones difíciles y dirigir con mayor seguridad.", items: ["Liderazgo consciente", "Comunicación directiva", "Decisiones bajo presión"], action: "Solicitar coaching ejecutivo", href: businessUrl, external: true, tone: "executive" },
  { number: "03", audience: "Para empresas", title: "Capacitación de equipos", description: "Diseño experiencias prácticas para que los equipos coordinen su trabajo, cumplan acuerdos y transformen los conflictos en conversaciones productivas.", items: ["Equipos que cumplen acuerdos", "Inteligencia emocional", "Comunicación entre áreas"], action: "Solicitar una propuesta", href: "/empresas#solicitud", external: false, tone: "business" },
];

export function HomeExperience() {
  return (
    <main className="services-home">
      <section className="services-hero">
        <div className="services-hero-image" aria-hidden="true">
          <picture><source media="(max-width: 700px)" srcSet="/images/guadalupe-hero-mobile.webp" /><img src="/images/guadalupe-hero.webp" alt="" fetchPriority="high" /></picture>
        </div>
        <div className="shell services-hero-grid">
          <div className="services-hero-copy">
            <span className="services-eyebrow">Guadalupe Gómez Pezuela</span>
            <h1>Desarrollo humano que se convierte en decisiones y resultados.</h1>
            <p>Acompaño a personas a avanzar con confianza y ayudo a organizaciones a desarrollar líderes que comuniquen con claridad y equipos que cumplan acuerdos.</p>
            <div className="services-hero-actions">
              <a className="btn btn-primary" href="#servicios">Elegir el servicio que necesito</a>
              <a className="btn btn-quiet" href="#guadalupe">Conocer a Guadalupe</a>
            </div>
          </div>
        </div>
        <a className="services-scroll" href="#servicios" aria-label="Ver servicios">Explora mis servicios <span>↓</span></a>
      </section>

      <section className="services-intro" id="servicios">
        <div className="shell services-intro-grid">
          <div><span className="services-eyebrow">¿Cómo puedo ayudarte?</span><h2>Partimos de lo que hoy necesita cambiar.</h2></div>
          <p>No trabajo con respuestas prefabricadas. Primero escucho tu realidad, definimos el objetivo y elegimos el proceso adecuado para avanzar.</p>
        </div>
      </section>

      <section className="services-catalog" aria-label="Servicios de Guadalupe">
        <div className="shell services-list">
          {services.map((service) => (
            <article className={`service-row service-row-${service.tone}`} key={service.number}>
              <div className="service-row-index"><span>{service.number}</span><small>{service.audience}</small></div>
              <div className="service-row-main"><h2>{service.title}</h2><p>{service.description}</p></div>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="service-row-action" href={service.href} rel={service.external ? "noopener" : undefined} target={service.external ? "_blank" : undefined}>{service.action} <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="services-business-focus">
        <div className="shell business-focus-grid">
          <div className="business-focus-heading"><span className="services-eyebrow services-eyebrow-light">Soluciones para empresas</span><h2>Cuando las personas se coordinan mejor, el negocio también avanza.</h2></div>
          <div className="business-focus-copy">
            <p>Adapto cada intervención a la realidad de la organización, su operación, sus líderes y el resultado que necesita alcanzar.</p>
            <div className="business-focus-programs">
              <article><strong>Liderazgo para mandos medios</strong><span>Delegación, retroalimentación y seguimiento.</span></article>
              <article><strong>Equipos que cumplen acuerdos</strong><span>Coordinación y responsabilidad compartida.</span></article>
              <article><strong>Inteligencia emocional</strong><span>Presión, conflicto y conversaciones difíciles.</span></article>
            </div>
            <a className="btn btn-light" href="/empresas#solicitud">Solicitar diagnóstico empresarial</a>
          </div>
        </div>
      </section>

      <section className="services-process">
        <div className="shell">
          <header className="services-section-head"><span className="services-eyebrow">Mi forma de trabajar</span><h2>Del reto actual a un camino concreto.</h2></header>
          <div className="services-process-grid">
            <article><span>01</span><h3>Te escucho</h3><p>Comprendo qué estás viviendo y qué necesita cambiar.</p></article>
            <article><span>02</span><h3>Definimos el objetivo</h3><p>Acordamos un resultado claro, útil y observable.</p></article>
            <article><span>03</span><h3>Diseño el proceso</h3><p>Elijo contigo el formato y las acciones adecuadas.</p></article>
            <article><span>04</span><h3>Medimos el avance</h3><p>Revisamos aprendizajes, decisiones y resultados.</p></article>
          </div>
        </div>
      </section>

      <section className="services-about" id="guadalupe">
        <div className="shell services-about-grid">
          <div className="services-about-photo"><picture><source media="(max-width: 700px)" srcSet="/images/guadalupe-trayectoria-mobile.webp" /><img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela" loading="lazy" /></picture></div>
          <div className="services-about-copy">
            <span className="services-eyebrow">Soy Guadalupe</span>
            <h2>Más de tres décadas acompañando procesos de transformación.</h2>
            <p>Mi experiencia como especialista en desarrollo humano, coach, formadora y consultora me permite trabajar tanto con la historia de una persona como con la dinámica de una organización.</p>
            <p>Escucho con sensibilidad, hago preguntas directas y convierto lo que descubrimos en acciones que puedan sostenerse en la vida real.</p>
            <div className="services-credentials"><span><strong>35+</strong> años de experiencia</span><span><strong>PNL</strong> Master Trainer</span><span><strong>Coach</strong> Senior Empresarial</span></div>
          </div>
        </div>
      </section>

      <section className="services-final">
        <div className="shell services-final-grid">
          <div><span className="services-eyebrow services-eyebrow-light">El siguiente paso</span><h2>Hablemos de lo que quieres transformar.</h2><p>Elige la conversación que necesitas y cuéntame brevemente qué está ocurriendo.</p></div>
          <div className="services-final-actions"><a className="btn btn-gold" href={personalUrl} target="_blank" rel="noopener">Agendar orientación personal</a><a className="btn btn-outline-light" href={businessUrl} target="_blank" rel="noopener">Solicitar propuesta empresarial</a></div>
        </div>
      </section>
    </main>
  );
}
