import Link from "next/link";
import { TrackedLink } from "@/components/TrackedLink";
import { commercialLinks, coachingProcess, personalTopics, businessChallenges } from "@/content/comercial";
import { siteConfig } from "@/config/site";

export function HomeExperience() {
  return (
    <main className="g-page">
      <section className="g-hero">
        <div className="shell g-hero-grid">
          <div>
            <span className="g-eyebrow">Guadalupe Gómez Pezuela · Coaching personal y empresarial</span>
            <h1>Encuentra claridad para tomar decisiones y transformar tu camino.</h1>
            <p className="g-lead">
              Te acompaño a comprender tus desafíos, reconocer nuevas posibilidades y llevar
              tus decisiones a acciones concretas. Para tu vida y para tu liderazgo.
            </p>
            <div className="g-actions">
              <Link className="btn btn-primary" href={commercialLinks.personal}>Quiero coaching personal</Link>
              <Link className="btn g-btn-line" href={commercialLinks.business}>Busco coaching empresarial</Link>
            </div>
            <span className="g-kicker">Un espacio para escuchar, reflexionar y avanzar</span>
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
                <span className="g-eyebrow">Personas</span>
                <h3>Coaching personal</h3>
                <p>Para ganar claridad, fortalecer tu confianza, establecer límites y elegir
                cómo avanzar en momentos importantes de tu vida.</p>
                <strong>Conocer coaching personal →</strong>
              </div>
            </Link>
            <Link className="g-choice" href={commercialLinks.business}>
              <img src="/images/servicio-coaching-ejecutivo.webp" alt="Acompañamiento de coaching ejecutivo" loading="lazy" />
              <div className="g-choice-body">
                <span className="g-eyebrow">Líderes y organizaciones</span>
                <h3>Coaching empresarial</h3>
                <p>Para directivos, dueños de negocio y equipos que necesitan mejores
                decisiones, conversaciones y coordinación.</p>
                <strong>Conocer coaching empresarial →</strong>
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
              <div className="g-actions"><Link className="btn g-btn-line" href={commercialLinks.personal}>Explorar coaching personal</Link></div>
            </div>
            <div>
              <h3>En tu liderazgo o empresa</h3>
              <ul className="g-checklist">
                {businessChallenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
              </ul>
              <div className="g-actions"><Link className="btn g-btn-line" href={commercialLinks.business}>Explorar coaching empresarial</Link></div>
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
            <p>Mi trayectoria reúne el desarrollo humano, el coaching y el trabajo con
            líderes y equipos. Escucho sin imponer respuestas y busco que cada conversación
            se traduzca en decisiones aplicables a la vida cotidiana.</p>
            <p className="g-muted">Mi formación incluye coaching empresarial y Programación
            Neurolingüística. El enfoque se elige según el objetivo y las necesidades
            de cada persona u organización.</p>
            <div className="g-actions"><Link className="btn btn-primary" href={commercialLinks.about}>Conocer mi trayectoria</Link></div>
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="shell g-academy">
          <div>
            <span className="g-eyebrow">Un aprendizaje que puede continuar</span>
            <h2>Recursos y experiencias complementarias.</h2>
            <p>Además de las sesiones de coaching, puedes encontrar artículos, cursos y
            experiencias de aprendizaje. Academia ETERNI es un espacio independiente
            que complementa el trabajo de Guadalupe.</p>
            <div className="g-academy-links">
              <Link className="btn g-btn-line" href={commercialLinks.resources}>Explorar recursos</Link>
              <a className="btn g-btn-line" href={siteConfig.academyUrl} rel="noopener noreferrer" target="_blank">Academia ETERNI ↗</a>
            </div>
          </div>
          <div className="g-contact-panel">
            <span className="g-eyebrow">Coaching primero</span>
            <h3>El proceso individual y la formación no son lo mismo.</h3>
            <p className="g-muted">Si buscas acompañamiento directo y personalizado, elige
            coaching. Si prefieres explorar recursos a tu ritmo, conoce la academia.</p>
          </div>
        </div>
      </section>

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
