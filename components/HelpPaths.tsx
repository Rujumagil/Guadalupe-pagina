import { homeContent } from "@/content/home";
import { TrackedLink } from "./TrackedLink";

export function HelpPaths() {
  const { needs } = homeContent;

  return (
    <section className="section" id="personas">
      <div className="shell">
        <header className="section-head">
          <h2>{needs.title}</h2>
          <p>{needs.description}</p>
        </header>
        <div className="cards-3">
          {needs.items.map((item) => (
            <article className="path-card" key={item.title}>
              <div className="path-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <TrackedLink className="text-link" href={item.href} rel="noopener" target="_blank">
                {item.label}
              </TrackedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
