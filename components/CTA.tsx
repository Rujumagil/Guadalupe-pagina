import { homeContent } from "@/content/home";
import { TrackedLink } from "./TrackedLink";

export function CTA() {
  const { finalCta } = homeContent;
  return (
    <section className="section">
      <div className="shell">
        <div className="conversion-choice" id="agenda">
          <article className="conversion-card conversion-personal">
            <span className="eyebrow">Para ti</span>
            <h2>{finalCta.title}</h2>
            <p>{finalCta.description}</p>
            <TrackedLink className="btn btn-aqua" href={finalCta.href} rel="noopener" target="_blank">
              {finalCta.label}
            </TrackedLink>
          </article>
          <article className="conversion-card conversion-business">
            <span className="eyebrow">Para tu empresa</span>
            <h2>Conversemos sobre el reto que enfrenta tu equipo.</h2>
            <p>Cuéntame qué está ocurriendo en tu organización. Prepararé una ruta de trabajo acorde con sus necesidades, participantes y objetivos.</p>
            <a className="btn btn-primary" href="/empresas#solicitud">Solicitar mi propuesta empresarial</a>
          </article>
        </div>
      </div>
    </section>
  );
}
