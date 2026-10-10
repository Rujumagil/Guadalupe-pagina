import type { Metadata } from "next";
import { homeContent } from "@/content/home";

export const metadata: Metadata = {
  title: "Recursos",
  description: "Recursos de Guadalupe Gómez Pezuela sobre coaching, decisiones, PNL y desarrollo personal.",
};

export default function RecursosPage() {
  const resources = homeContent.resources;
  return (
    <main className="simple-page">
      <section className="section section-soft home-resources">
        <div className="shell">
          <header className="section-head">
            <h1>{resources.title}</h1>
            <p>{resources.description}</p>
          </header>
          <div className="resources-grid resources-grid-home">
            {resources.items.map((item) => (
              <a className="resource-card" href={item.href} key={item.title}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <strong>Leer artículo →</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
