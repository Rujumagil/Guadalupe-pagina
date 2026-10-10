import { homeContent } from "@/content/home";

export function BusinessPreview() {
  const { business } = homeContent;

  return (
    <section className="section business-preview" id="empresas">
      <div className="shell business-preview-grid">
        <div className="business-preview-copy">
          <span className="eyebrow">{business.eyebrow}</span>
          <h2>{business.title}</h2>
          <p>{business.description}</p>
          <a className="btn btn-primary" href={business.cta.href}>{business.cta.label}</a>
        </div>
        <div className="business-programs">
          {business.programs.map((program, index) => (
            <article key={program.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{program.title}</h3><p>{program.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
