import { homeContent } from "@/content/home";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="hero-personal">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">{hero.eyebrow}</span>
          <h1>
            <span className="hero-title-main">{hero.title}</span>
            <span className="hero-title-name">{hero.name}</span>
          </h1>
          <p className="hero-value">{hero.value}</p>
          <p className="lead">{hero.lead}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
            <a className="btn btn-outline" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-portrait">
            <picture>
              <source media="(max-width:680px)" srcSet="/images/guadalupe-hero-mobile.webp" />
              <img
                alt="Guadalupe Gómez Pezuela, coach transformacional y formadora en desarrollo personal"
                fetchPriority="high"
                height="1196"
                src="/images/guadalupe-hero.webp"
                width="1100"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
