import { homeContent } from "@/content/home";

export function About() {
  const { about } = homeContent;

  return (
      <section className="section section-soft" id="guadalupe">
        <div className="shell about-grid">
          <div className="about-image about-image-trayectoria">
            <picture>
              <source media="(max-width:680px)" srcSet="/images/guadalupe-trayectoria-mobile.webp" />
              <img
                alt="Guadalupe Gómez Pezuela, coach, formadora y conferencista"
                height="1400"
                loading="lazy"
                src="/images/guadalupe-trayectoria.webp"
                width="933"
              />
            </picture>
          </div>
          <div className="about-copy">
            <h2>{about.title}</h2>
            {about.paragraphs.map((paragraph, index) => (
              <p key={paragraph}>
                {index === 2 ? <strong>{paragraph}</strong> : paragraph}
              </p>
            ))}
            <ul className="credentials">
              {about.credentials.map((credential) => <li key={credential}>{credential}</li>)}
            </ul>
          </div>
        </div>
      </section>
  );
}
