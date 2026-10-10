import { homeContent } from "@/content/home";

export function AudienceGate() {
  const { audiences } = homeContent;

  return (
    <section className="section audience-section" aria-labelledby="audience-title">
      <div className="shell">
        <header className="section-head audience-head">
          <h2 id="audience-title">{audiences.title}</h2>
          <p>{audiences.description}</p>
        </header>
        <div className="audience-grid">
          {audiences.items.map((item) => (
            <article className="audience-card" key={item.kicker}>
              <span className="eyebrow">{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a className="btn btn-primary" href={item.href}>{item.label}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
