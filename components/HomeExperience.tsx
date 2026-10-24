import Link from "next/link";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import { TrackedLink } from "@/components/TrackedLink";
import { commercialLinks, coachingProcess, personalTopics, businessChallenges } from "@/content/comercial";
import { siteConfig } from "@/config/site";

export function HomeExperience() {
  return (
    <main className="g-page">
      <section className="g-hero">
        <div className="shell g-hero-grid">
          <div>
            <span className="g-eyebrow">Guadalupe Gómez Pezuela · Coach ejecutiva y de vida</span>
            <h1>Encuentra claridad para tomar decisiones y transformar tu camino.</h1>
            <p className="g-lead">
              Te acompaño a comprender tus desafíos, reconocer nuevas posibilidades y llevar
              tus decisiones a acciones concretas. Para tu vida y para tu liderazgo.
            </p>
            <div className="g-actions">
              <Link className="btn btn-primary" href={commercialLinks.personal}>Quiero coaching personal</Link>
              <Link className="btn g-btn-line" href={commercialLinks.business}>Busco coaching empresarial</Link>
              <a className="btn g-btn-line" href="#agendar-cita">Agendar una cita</a>
            </div>
          </div>
          <div className="g-hero-photo">
            <picture>
              <source media="(max-width: 700px)" srcSet="/images/guadalupe-hero-mobile.webp" />
              <img src="/images/guadalupe-hero.webp" alt="Guadalupe Gómez Pezuela, coach personal y empresarial" fetchPriority="high" />
            </picture>
            <span className="g-photo-note">Acompañamiento con una mirada humana y práctica</span>
          </div>
        </div>
      </section>

      <section className="g-section" id="coaching">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Elige tu camino</span>
            <h2>Dos espacios de coaching. Un acompañamiento centrado en ti.</h2>
            <p>Ya sea que estés atravesando un cambio personal o liderando una organización,
            comenzamos por comprender lo que hoy necesitas.</p>
          </header>
          <div className="g-columns-2">
            <Link className="g-choice" href={commercialLinks.personal}>
              <img src="/images/servicio-coaching-personal.webp" alt="Acompañamiento de coaching personal" loading="lazy" />
              <div className="g-choice-body">
                <h3>Coaching personal</h3>
                <p>Para ganar claridad, fortalecer tu confianza, establecer límites y elegir
                cómo avanzar en momentos importantes de tu vida.</p>
                <strong>Agenda tu cita →</strong>
              </div>
            </Link>
            <Link className="g-choice" href={commercialLinks.business}>
              <img src="/images/servicio-coaching-ejecutivo.webp" alt="Acompañamiento de coaching ejecutivo" loading="lazy" />
              <div className="g-choice-body">
                <h3>Coaching empresarial</h3>
                <p>Para directivos, dueños de negocio y equipos que necesitan mejores
                decisiones, conversaciones y coordinación.</p>
                <strong>Agenda tu cita →</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="g-section g-section-alt">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Lo que podemos trabajar</span>
            <h2>El cambio comienza con situaciones reales.</h2>
          </header>
          <div className="g-columns-2">
            <div>
              <h3>En tu vida personal</h3>
              <ul className="g-checklist">
                {personalTopics.map((topic) => <li key={topic.title}><strong>{topic.title}.</strong> {topic.text}</li>)}
              </ul>
              <div className="g-actions"><Link className="btn g-btn-line" href={commercialLinks.personal}>Agendar una cita</Link></div>
            </div>
            <div>
              <h3>En tu liderazgo o empresa</h3>
              <ul className="g-checklist">
                {businessChallenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
              </ul>
              <div className="g-actions"><Link className="btn g-btn-line" href={commercialLinks.business}>Agendar una cita</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell">
          <header className="g-section-title">
            <span className="g-eyebrow">Mi forma de trabajar</span>
            <h2>Un proceso con dirección y seguimiento.</h2>
            <p>La primera conversación nos ayuda a valorar el acompañamiento; cada proceso
            se acuerda de acuerdo con la necesidad y el objetivo.</p>
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

      <section className="g-section g-section-alt" id="guadalupe">
        <div className="shell g-feature-grid">
          <div className="g-feature-image"><img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela" loading="lazy" /></div>
          <div>
            <span className="g-eyebrow">Conoce a Guadalupe</span>
            <h2>Experiencia profesional con cercanía humana.</h2>
            <p>Soy Guadalupe Gómez Pezuela, coach personal y empresarial con más de 20 años
            de experiencia acompañando a personas, líderes y equipos en México,
            Latinoamérica y España.</p>
            <p>Trabajo desde la escucha, la reflexión y preguntas que ayudan a encontrar
            claridad, fortalecer la confianza y convertir decisiones en acciones concretas.</p>
            <p className="g-muted">Soy coach senior empresarial por Newfield Consulting,
            coach con Programación Neurolingüística y coach de vida.</p>
            <ul className="g-checklist">
              <li><strong>Coaching personal.</strong> Toma de decisiones, confianza, relaciones y proyectos.</li>
              <li><strong>Coaching empresarial.</strong> Liderazgo, comunicación y retos profesionales.</li>
              <li><strong>Coaching de equipos.</strong> Acuerdos, colaboración y objetivos compartidos.</li>
            </ul>
            <p>Podemos reunirnos en sesiones presenciales o en línea.</p>
            <p><strong>Cuéntame qué quieres transformar y encontremos juntos el camino para avanzar.</strong></p>
            <div className="g-actions"><TrackedLink className="btn btn-primary" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer" eventName="Lead">Agendar una cita</TrackedLink></div>
          </div>
        </div>
      </section>

      <section className="g-section" id="academia-nicte-ha">
        <div className="shell g-academy">
          <div>
            <span className="g-eyebrow">Un espacio para aprender, crecer y transformarte</span>
            <h2>Academia Nicté Ha</h2>
            <h3>Formación en coaching y desarrollo humano</h3>
            <p className="g-eyebrow">Por Guadalupe Gómez Pezuela</p>
            <p>Un espacio de aprendizaje creado para acompañarte en tu crecimiento personal y profesional.</p>
            <p>Descubre cursos, talleres y programas de formación que te ayudarán a conocerte mejor, fortalecer tus habilidades y transformar lo aprendido en acciones que generen cambios significativos en tu vida.</p>
            <div className="g-academy-links">
              <Link className="btn btn-primary" href="/academia-guadalupe/">Conoce la Academia →</Link>
              <Link className="btn g-btn-line" href="/academia-guadalupe/">Explorar programas</Link>
            </div>
          </div>
          <div className="g-contact-panel">
            <span className="g-eyebrow">Dos caminos para acompañar tu crecimiento</span>
            <h3>Coaching con Guadalupe</h3>
            <p className="g-muted">Acompañamiento individual y personalizado para trabajar tus objetivos y desafíos.</p>
            <h3>Academia Nicté Ha</h3>
            <p className="g-muted">Formación, herramientas y experiencias de aprendizaje para avanzar a tu propio ritmo.</p>
            <p><strong>Tu proceso es único. Elige cómo quieres comenzar.</strong></p>
          </div>
        </div>
      </section>

      <AppointmentCalendar />

      <section className="g-section g-section-purple">
        <div className="shell g-final">
          <div>
            <span className="g-eyebrow">Tu siguiente paso</span>
            <h2>Hablemos de lo que quieres transformar.</h2>
            <p>Cuéntame brevemente qué necesitas y conversemos sobre el servicio adecuado,
            su modalidad y sus condiciones antes de comenzar.</p>
          </div>
          <div className="g-actions">
            <TrackedLink className="btn btn-gold" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer" eventName="Lead">Consultar coaching personal</TrackedLink>
            <Link className="btn btn-outline-light" href={commercialLinks.contact}>Contactar a Guadalupe</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
