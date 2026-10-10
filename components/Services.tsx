import { services } from "@/content/services";
import { TrackedLink } from "./TrackedLink";

export function Services({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "section section-soft" : "section"} id="servicios">
      <div className="shell">
        <header className="section-head">
          <h2>Coaching, orientación y desarrollo personal y profesional</h2>
          <p>El punto de partida es entender qué quieres mejorar, qué te está deteniendo y cuál es la forma de acompañamiento más adecuada para ti.</p>
        </header>
        <div className="offer-grid">
          {services.map((service) => (
            <article className="offer-card" key={service.slug}>
              <div className="offer-card-body">
                <span className="tag">{service.tag}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="offer-card-actions">
                  {"external" in service && service.external ? (
                    <TrackedLink className="btn btn-aqua" href={service.href} rel="noopener" target="_blank">
                      Agendar orientación gratuita
                    </TrackedLink>
                  ) : (
                    <a className="btn btn-primary" href={service.href}>Conocer más</a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {compact && <div className="services-all-link"><a className="btn btn-outline" href="/servicios">Ver todos los servicios</a></div>}
      </div>
    </section>
  );
}
