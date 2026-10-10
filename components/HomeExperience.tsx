import { buildWhatsAppUrl } from "@/config/site";

const personalUrl = buildWhatsAppUrl(
  "Hola Guadalupe, quiero reservar una orientación personal. Me gustaría contarte qué estoy viviendo."
);

export function HomeExperience() {
  return (
    <main className="experience-home">
      <section className="experience-hero">
        <div className="experience-hero-media" aria-hidden="true">
          <picture>
            <source media="(max-width: 700px)" srcSet="/images/guadalupe-hero-mobile.webp" />
            <img src="/images/guadalupe-hero.webp" alt="" fetchPriority="high" />
          </picture>
        </div>
        <div className="shell experience-hero-content">
          <div className="experience-intro">
            <span className="experience-signature">Soy Guadalupe Gómez Pezuela</span>
            <h1>Transformar comienza cuando te atreves a mirar lo que necesitas cambiar.</h1>
            <p>Te acompaño a recuperar claridad y confianza; y trabajo con empresas que quieren desarrollar líderes humanos y equipos capaces de cumplir acuerdos.</p>
          </div>
          <nav className="experience-selector" aria-label="Elige cómo puedo ayudarte">
            <a href="/coaching-personal#reservar">
              <span>01 · Para ti</span>
              <strong>Quiero avanzar en mi vida</strong>
              <em>Reservar orientación personal →</em>
            </a>
            <a href="/empresas#solicitud">
              <span>02 · Para tu organización</span>
              <strong>Quiero fortalecer a mi equipo</strong>
              <em>Solicitar diagnóstico empresarial →</em>
            </a>
          </nav>
        </div>
      </section>

      <section className="experience-trust" aria-label="Experiencia profesional">
        <div className="shell experience-trust-row">
          <span><strong>35+</strong> años de experiencia</span>
          <span><strong>15,000+</strong> personas capacitadas</span>
          <span><strong>PNL</strong> Master Trainer</span>
          <span><strong>Coach</strong> Senior Empresarial</span>
        </div>
      </section>

      <section className="experience-story">
        <div className="shell experience-story-grid">
          <div className="experience-story-photo">
            <picture>
              <source media="(max-width: 700px)" srcSet="/images/guadalupe-trayectoria-mobile.webp" />
              <img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela durante una sesión de trabajo" loading="lazy" />
            </picture>
          </div>
          <div className="experience-story-copy">
            <span className="experience-kicker">Antes de ofrecerte una solución, quiero escucharte.</span>
            <h2>No trabajo con respuestas prefabricadas.</h2>
            <p>Durante más de tres décadas he acompañado a personas, líderes y equipos en momentos donde algo necesita cambiar. Mi trabajo comienza comprendiendo tu realidad, no tratando de acomodarte a un programa.</p>
            <blockquote>“Escuchamos lo que ocurre, definimos qué quieres lograr y construimos un camino que puedas llevar a la vida real.”</blockquote>
            <a className="experience-text-link" href="#caminos">Elegir cómo trabajar conmigo ↓</a>
          </div>
        </div>
      </section>

      <section className="experience-paths" id="caminos">
        <article className="experience-path experience-path-personal">
          <div className="experience-path-inner">
            <span>Coaching personal</span>
            <h2>Vuelve a elegirte.</h2>
            <p>Si has dedicado mucho tiempo a responder por los demás, atraviesas un cambio o necesitas tomar una decisión, trabajaremos para recuperar claridad, establecer límites y avanzar con confianza.</p>
            <ul>
              <li>Confianza y autoestima</li><li>Límites y relaciones</li><li>Cambios y decisiones</li>
            </ul>
            <a className="btn btn-primary" href={personalUrl} target="_blank" rel="noopener">Agendar mi orientación personal</a>
          </div>
        </article>
        <article className="experience-path experience-path-business">
          <div className="experience-path-inner">
            <span>Coaching empresarial</span>
            <h2>Haz que tu equipo avance.</h2>
            <p>Diseño capacitación y procesos para organizaciones que necesitan líderes capaces de comunicar, delegar, resolver conflictos y convertir acuerdos en resultados.</p>
            <ul>
              <li>Liderazgo para mandos medios</li><li>Equipos que cumplen acuerdos</li><li>Inteligencia emocional bajo presión</li>
            </ul>
            <a className="btn btn-light" href="/empresas#solicitud">Solicitar diagnóstico empresarial</a>
          </div>
        </article>
      </section>

      <section className="experience-method">
        <div className="shell">
          <header className="experience-method-head">
            <span className="experience-kicker">Mi forma de trabajar</span>
            <h2>Una conversación que se convierte en dirección.</h2>
          </header>
          <div className="experience-method-line">
            <article><span>01</span><h3>Te escucho</h3><p>Comprendo lo que estás viviendo y qué necesita cambiar.</p></article>
            <article><span>02</span><h3>Definimos el objetivo</h3><p>Convertimos tu necesidad en un resultado claro y observable.</p></article>
            <article><span>03</span><h3>Diseño el camino</h3><p>Elegimos el proceso, formato y acciones adecuadas para avanzar.</p></article>
            <article><span>04</span><h3>Medimos el avance</h3><p>Revisamos aprendizajes, decisiones y resultados alcanzados.</p></article>
          </div>
        </div>
      </section>

      <section className="experience-closing">
        <div className="shell experience-closing-grid">
          <div>
            <span className="experience-signature">Conversemos</span>
            <h2>No necesitas tener todo resuelto para dar el primer paso.</h2>
          </div>
          <div className="experience-closing-actions">
            <a className="btn btn-primary" href={personalUrl} target="_blank" rel="noopener">Reservar mi orientación personal</a>
            <a className="btn btn-outline" href="/empresas#solicitud">Recibir una propuesta empresarial</a>
          </div>
        </div>
      </section>
    </main>
  );
}
