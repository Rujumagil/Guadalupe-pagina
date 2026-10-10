import { homeContent } from "@/content/home";

export function Process() {
  const { process } = homeContent;
  return (
    <section className="section" id="metodo">
      <div className="shell">
        <header className="section-head">
          <h2>{process.title}</h2>
          <p>{process.description}</p>
        </header>
        <div className="method-grid">
          {process.items.map((item) => (
            <article className="method-step" key={item.number}>
              <span className="num">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="method-note">{process.note}</div>
      </div>
    </section>
  );
}
