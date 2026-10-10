import { upcomingEvent } from "@/content/events";
import { TrackedLink } from "./TrackedLink";

export function Events() {
  return (
    <section className="section next-event-section" id="proximo-evento">
      <div className="shell">
        <div className="next-event-card next-event-card-coming-soon">
          <div className="next-event-copy">
            <span className="eyebrow">{upcomingEvent.eyebrow}</span>
            <h2>{upcomingEvent.title}</h2>
            <p>{upcomingEvent.description}</p>
            <div className="next-event-actions">
              <TrackedLink className="btn btn-primary" href={upcomingEvent.cta.href} rel="noopener" target="_blank">
                {upcomingEvent.cta.label}
              </TrackedLink>
            </div>
            <p className="next-event-note">{upcomingEvent.note}</p>
          </div>
          <div className="event-placeholder" aria-hidden="true">
            <span>ETERNI</span>
            <strong>Nueva fecha</strong>
            <small>Información e inscripciones por anunciar</small>
          </div>
        </div>
      </div>
    </section>
  );
}
