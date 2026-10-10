import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";

type Detail = {
  title: string;
  eyebrow: string;
  description: string;
  bullets: readonly string[];
};

export function ServiceDetail({ detail }: { detail: Detail }) {
  return (
    <main className="simple-page">
      <section className="section service-detail-hero">
        <div className="shell service-detail-grid">
          <div>
            <span className="eyebrow">{detail.eyebrow}</span>
            <h1>{detail.title}</h1>
            <p className="lead">{detail.description}</p>
            <TrackedLink
              className="btn btn-primary"
              href={buildWhatsAppUrl(`Hola Guadalupe, quiero información sobre ${detail.title}.`)}
              rel="noopener"
              target="_blank"
            >
              Hablar con Guadalupe
            </TrackedLink>
          </div>
          <aside className="service-detail-card">
            <h2>Podemos trabajar en</h2>
            <ul>{detail.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
