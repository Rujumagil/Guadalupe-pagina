import { homeContent } from "@/content/home";

export function Resources() {
  const { resources } = homeContent;
  return (
    <section className="section section-soft home-resources">
      <div className="shell">
        <header className="section-head">
          <h2>{resources.title}</h2>
          <p>{resources.description}</p>
        </header>
        <div className="resources-grid resources-grid-home">
          {resources.items.map((item) => (
            <a className="resource-card" href={item.href} key={item.title}>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <strong>Leer más →</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
