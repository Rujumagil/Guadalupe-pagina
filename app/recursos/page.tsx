import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import { homeContent } from "@/content/home";

export const metadata: Metadata = pageMetadata({
  title: "Recursos | Guadalupe Gómez Pezuela",
  description: "Lecturas y recursos sobre coaching personal, decisiones, PNL y comunicación.",
  path: "/recursos",
});

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
