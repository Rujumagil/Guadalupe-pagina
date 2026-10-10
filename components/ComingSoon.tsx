import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";

export function ComingSoon({
  title = "Próximamente",
  description = "Estamos preparando esta sección. Muy pronto compartiremos aquí nueva información.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <main className="simple-page">
      <section className="section">
        <div className="shell">
          <div className="coming-soon-card">
            <span className="eyebrow">ETERNI · Guadalupe Gómez Pezuela</span>
            <h1>{title}</h1>
            <p>{description}</p>
            <TrackedLink
              className="btn btn-primary"
              href={buildWhatsAppUrl("Hola Guadalupe, quiero recibir información cuando haya novedades.")}
              rel="noopener"
              target="_blank"
            >
              Quiero recibir información
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
