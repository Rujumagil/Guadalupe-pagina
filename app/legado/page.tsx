import type { Metadata } from "next";
import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Legado que trasciende",
  description: "Acompañamiento de Guadalupe Gómez Pezuela para transformar recuerdos, aprendizajes y experiencias en un proyecto de legado personal.",
};

const modules = [
  "Intención y propósito del legado",
  "Memorias y momentos significativos",
  "Historias que vale la pena conservar",
  "Voz personal y mensaje",
  "Organización de contenidos",
  "Construcción del manuscrito",
  "Integración y revisión",
  "Cierre y proyección del legado",
];

export default function LegadoPage() {
  return (
    <main className="simple-page">
      <section className="section service-detail-hero">
        <div className="shell service-detail-grid">
          <div>
            <span className="eyebrow">ETERNI · Proyecto de legado</span>
            <h1>Legado que trasciende</h1>
            <p className="lead">Un acompañamiento para ordenar recuerdos, aprendizajes y experiencias, y convertirlos en un proyecto que pueda permanecer y compartirse.</p>
            <TrackedLink
              className="btn btn-primary"
              href={buildWhatsAppUrl("Hola Guadalupe, quiero información sobre Legado que trasciende.")}
              rel="noopener"
              target="_blank"
            >
              Pedir información
            </TrackedLink>
          </div>
          <aside className="service-detail-card">
            <span className="tag">Mi Libro de Legado</span>
            <h2>Recorrido en 8 módulos</h2>
            <ol>{modules.map((module) => <li key={module}>{module}</li>)}</ol>
          </aside>
        </div>
      </section>
    </main>
  );
}
