import type { Metadata } from "next";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Coaching personal con Guadalupe Gómez Pezuela",
  description: "Un proceso cercano y práctico para recuperar confianza, establecer límites y tomar decisiones con claridad.",
};

const reserveUrl = buildWhatsAppUrl("Hola Guadalupe, quiero reservar mi orientación personal. Me gustaría contarte brevemente lo que estoy viviendo.");

const needs = [
  "Recuperar confianza en ti", "Establecer límites sin culpa", "Mejorar tus relaciones",
  "Atravesar un cambio personal o profesional", "Tomar una decisión importante", "Fortalecer tu liderazgo personal",
];

export default function CoachingPersonalPage() {
  return (
    <main className="personal-page">
      <section className="personal-hero">
        <div className="shell personal-hero-grid">
          <div>
            <span className="eyebrow">Quiero acompañarte</span>
            <h1>Recupera confianza y construye la siguiente etapa de tu vida.</h1>
            <p className="lead">Si sabes que algo necesita cambiar, pero todavía no encuentras cómo comenzar, quiero ayudarte a comprender tu situación, definir lo que deseas y avanzar con acciones concretas.</p>
            <a className="btn btn-primary" href="#reservar">Reservar mi orientación personal</a>
          </div>
          <aside className="personal-promise">
            <strong>Este proceso comienza contigo</strong>
            <p>No voy a imponerte respuestas. Voy a escucharte, ayudarte a reconocer tus recursos y acompañarte a tomar decisiones que tengan sentido para ti.</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell personal-needs-grid">
          <div><span className="eyebrow">Puedo ayudarte</span><h2>Cuando necesitas volver a elegirte.</h2><p>Trabajo contigo si has dedicado mucho tiempo a responder por otras personas, atraviesas un cambio o deseas recuperar claridad y dirección.</p></div>
          <ul className="personal-needs-list">{needs.map((need) => <li key={need}>{need}</li>)}</ul>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <header className="section-head"><span className="eyebrow">Así trabajaremos</span><h2>Un camino claro, humano y práctico.</h2></header>
          <div className="personal-process-grid">
            <article><span>01</span><h3>Te escucho</h3><p>Me cuentas qué estás viviendo y qué te gustaría cambiar.</p></article>
            <article><span>02</span><h3>Definimos tu objetivo</h3><p>Aclaramos qué resultado deseas alcanzar y qué hoy te está deteniendo.</p></article>
            <article><span>03</span><h3>Trabajamos contigo</h3><p>Construimos acciones concretas y revisamos tus avances durante el proceso.</p></article>
          </div>
        </div>
      </section>

      <section className="section" id="reservar">
        <div className="shell"><div className="personal-reserve">
          <div><span className="eyebrow">Da el primer paso</span><h2>Cuéntame qué estás viviendo.</h2><p>La orientación inicial es una conversación breve para comprender tu necesidad, aclarar qué deseas trabajar y decidir cuál puede ser el siguiente paso. No te obliga a contratar un proceso.</p></div>
          <a className="btn btn-primary" href={reserveUrl} rel="noopener" target="_blank">Agendar mi orientación con Guadalupe</a>
        </div></div>
      </section>
    </main>
  );
}
