import { homeContent } from "@/content/home";
import { TrackedLink } from "./TrackedLink";

export function CTA() {
  const { finalCta } = homeContent;
  return (
    <section className="section">
      <div className="shell">
        <div className="cta-band" id="agenda">
          <div>
            <h2>{finalCta.title}</h2>
            <p>{finalCta.description}</p>
          </div>
          <div className="cta-actions">
            <TrackedLink className="btn btn-aqua" href={finalCta.href} rel="noopener" target="_blank">
              {finalCta.label}
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
