import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/config/seo";

export const metadata: Metadata = pageMetadata({
  title: "Academia Nicté Ha y ETERNI | Accesos independientes",
  description: "Guadalupe tiene su propia academia de desarrollo. ETERNI mantiene un espacio formativo independiente con accesos y contenidos diferentes.",
  path: "/academia-eterni",
});

export default function AcademiasPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell g-section-title">
          <span className="g-eyebrow">Espacios de aprendizaje diferentes</span>
          <h1>Dos academias. Dos experiencias independientes.</h1>
          <p className="g-lead">La nueva Academia Nicté Ha cuenta con su propio acceso, cursos,
          biblioteca, comunidad y seguimiento. ETERNI es una iniciativa distinta:
          las inscripciones y credenciales no se comparten automáticamente.</p>
        </div>
      </section>
      <section className="g-section">
        <div className="shell g-columns-2 g-contact-grid">
          <article className="g-contact-panel">
            <span className="g-eyebrow">Marca personal Guadalupe</span>
            <h2>Academia Nicté Ha</h2>
            <p>El espacio privado de desarrollo, cursos y recursos creados para el proyecto de Guadalupe.
            Los contenidos se habilitan conforme exista matrícula o autorización.</p>
            <Link href="/academia-guadalupe/" className="btn btn-primary">Ingresar o registrarme →</Link>
          </article>
          <article className="g-contact-panel">
            <span className="g-eyebrow">Proyecto independiente</span>
            <h2>Academia ETERNI</h2>
            <p>Si participas en una experiencia ETERNI, utiliza su acceso original.
            Tus cursos de esa plataforma no se trasladan automáticamente a Guadalupe.</p>
            <a href={siteConfig.academyUrl} className="btn g-btn-line" target="_blank" rel="noopener noreferrer">
              Visitar ETERNI ↗
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
