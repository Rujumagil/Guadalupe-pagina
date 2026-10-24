import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/config/site";
import "./academia.css";

export const metadata: Metadata = {
  title: "Academia Nicté Ha | Formación en coaching y desarrollo humano",
  description: "Conoce Academia Nicté Ha, el espacio de formación de Guadalupe Gómez Pezuela. Explora nuestras líneas de aprendizaje y solicita información de próximos programas.",
  alternates: { canonical: "/academia/" },
};

const routes = [
  {number:"01",heading:"Autoconocimiento y desarrollo personal",tag:"Desarrollo humano",detail:"Herramientas de reflexión y aprendizaje para reconocer tus recursos, mejorar tu comunicación y avanzar con mayor claridad.",topics:["Autoconocimiento","Confianza y límites","Decisiones conscientes"]},
  {number:"02",heading:"Comunicación y nuevas perspectivas",tag:"Habilidades personales",detail:"Experiencias formativas para escuchar, conversar mejor y comprender cómo nuestras interpretaciones influyen en las decisiones.",topics:["Comunicación","Escucha","Cambio de perspectiva"]},
  {number:"03",heading:"Liderazgo y coaching ejecutivo",tag:"Desarrollo profesional",detail:"Formación orientada a fortalecer conversaciones, colaboración, delegación y liderazgo en organizaciones y equipos.",topics:["Liderazgo","Trabajo con equipos","Conversaciones efectivas"]},
];

const questions = [
  {q:"¿Puedo conocer los programas antes de registrarme?",a:"Sí. Puedes consultar las líneas de formación y solicitar información sin crear una cuenta. El acceso al campus corresponde a alumnos con programas autorizados."},
  {q:"¿La creación de una cuenta incluye un curso?",a:"No. Las matrículas y materiales se habilitan únicamente cuando Guadalupe confirma la inscripción o asigna el acceso correspondiente."},
  {q:"¿Hay cursos abiertos en este momento?",a:"Estamos preparando la publicación del catálogo. Te compartiremos temarios, fechas, modalidades y condiciones de cada programa cuando estén confirmados."},
  {q:"¿Puedo entrar si ya soy alumno?",a:"Sí. Utiliza el botón «Entrar a mi academia» para acceder a tus cursos y revisar tu progreso."},
];

const inquiry = buildWhatsAppUrl("Hola, me interesa conocer los próximos cursos y programas de Academia Nicté Ha. ¿Podrían compartir información cuando estén disponibles?");

export default function AcademiaPage() {
  return <main className="nh-page">
    <header className="nh-header">
      <div className="shell nh-header-inner">
        <Link href="/academia/" className="nh-header-brand" aria-label="Academia Nicté Ha, inicio">
          <img src="/images/academia-nicte-ha-logo.webp" alt="Academia Nicté Ha" />
          <span><strong>Academia Nicté Ha</strong><small>Por Guadalupe Gómez Pezuela</small></span>
        </Link>
        <nav className="nh-nav" aria-label="Navegación de Academia Nicté Ha">
          <a href="#nosotros">Nuestra esencia</a>
          <a href="#programas">Formación</a>
          <a href="#guadalupe">Guadalupe</a>
          <Link href="/">Sitio de Guadalupe ↗</Link>
        </nav>
        <a className="nh-header-campus" href="/academia-guadalupe/">Entrar a mi academia →</a>
      </div>
    </header>
    <section className="nh-hero">
      <div className="shell nh-hero-grid">
        <div className="nh-hero-copy">
          <span className="nh-kicker">Un espacio para aprender, crecer y transformar</span>
          <h1>Un espacio para <em>seguir creciendo.</em></h1>
          <p className="nh-lead">En <strong>Academia Nicté Ha</strong> encontrarás experiencias de formación en coaching y desarrollo humano pensadas para acompañarte en cada nueva etapa.</p>
          <p>Aprende a tu ritmo, fortalece tus habilidades y convierte lo que descubres en acciones para tu vida y tu trabajo.</p>
          <div className="nh-actions">
            <a className="btn btn-primary" href="#programas">Explorar áreas de formación ↓</a>
            <a className="btn nh-btn-outline" href={inquiry} target="_blank" rel="noopener noreferrer">Solicitar información ↗</a>
          </div>
          <div className="nh-hero-note"><span className="nh-dot"/> Formación con una mirada humana, práctica y cercana</div>
        </div>
        <div className="nh-hero-aside">
          <div className="nh-logo-card">
            <span className="nh-card-eyebrow">ACADEMIA NICTÉ HA</span>
            <img src="/images/academia-nicte-ha-logo.webp" alt="Logo oficial de Academia Nicté Ha" />
            <p>Un espacio de formación creado para ti.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="nh-intro shell" id="nosotros">
      <span className="nh-kicker">¿Qué es Nicté Ha?</span>
      <h2>Aprender también es una forma de florecer.</h2>
      <p>Una academia creada por Guadalupe Gómez Pezuela para acercar conocimientos, herramientas y experiencias que favorezcan el desarrollo personal, la comunicación y el liderazgo. Cada propuesta busca ayudarte a llevar el aprendizaje a tu realidad.</p>
      <div className="nh-values">
        <div><span>01</span><strong>Reflexiona</strong><p>Descubre nuevas perspectivas.</p></div>
        <div><span>02</span><strong>Aprende</strong><p>Adquiere herramientas prácticas.</p></div>
        <div><span>03</span><strong>Aplica</strong><p>Transforma ideas en acciones.</p></div>
      </div>
    </section>

    <section id="programas" className="nh-programs">
      <div className="shell">
        <div className="nh-section-head">
          <div><span className="nh-kicker">Nuestros caminos de aprendizaje</span><h2>Formación para cada etapa de tu vida.</h2></div>
          <p>Descubre las tres áreas que guían nuestra propuesta. Los cursos y sus inscripciones se anunciarán conforme estén listos.</p>
        </div>
        <div className="nh-program-grid">{routes.map(item=><article className="nh-program" key={item.number}>
          <div className="nh-program-top"><span>{item.number}</span><small>{item.tag}</small></div>
          <div className="nh-program-status">Próximamente</div>
          <h3>{item.heading}</h3><p>{item.detail}</p>
          <div className="nh-topics">{item.topics.map(t=><span key={t}>{t}</span>)}</div>
          <a href={inquiry} target="_blank" rel="noopener noreferrer">Consultar próximos cursos <span aria-hidden="true">↗</span></a>
        </article>)}</div>
        <p className="nh-catalog-note">Catálogo en preparación. No se están ofreciendo matrículas automáticas ni fechas sin confirmar.</p>
      </div>
    </section>

    <section className="nh-founder shell" id="guadalupe">
      <div className="nh-founder-photo"><img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela" loading="lazy"/></div>
      <div><span className="nh-kicker">La experiencia detrás de la academia</span>
        <h2>Una formación con la cercanía de Guadalupe.</h2>
        <p>Soy Guadalupe Gómez Pezuela, coach ejecutiva y de vida. Creo que aprender es ampliar nuestras posibilidades, construir mejores conversaciones y descubrir nuevas formas de avanzar.</p>
        <p>Creé Academia Nicté Ha como un lugar para compartir experiencias de aprendizaje con profundidad, sensibilidad y aplicación práctica.</p>
        <Link href="/sobre-mi" className="btn nh-btn-outline">Conoce mi trayectoria →</Link>
      </div>
    </section>

    <section className="nh-campus">
      <div className="shell nh-campus-grid">
        <div><span className="nh-kicker">¿Ya eres alumno?</span><h2>Tu espacio de aprendizaje está aquí.</h2><p>Ingresa a tus cursos autorizados, consulta tus recursos y continúa tu progreso en el campus privado.</p></div>
        <div className="nh-campus-actions"><a href="/academia-guadalupe/" className="btn btn-primary">Entrar a mi academia →</a><small>El registro de cuenta por sí solo no habilita cursos.</small></div>
      </div>
    </section>

    <section className="nh-faq shell"><span className="nh-kicker">Preguntas frecuentes</span><h2>Antes de comenzar</h2>
      <div className="nh-faq-list">{questions.map(x=><details key={x.q}><summary>{x.q}<span aria-hidden="true">+</span></summary><p>{x.a}</p></details>)}</div>
    </section>
    <section className="nh-close">
      <div className="shell nh-close-inner"><div><span className="nh-kicker">Da el siguiente paso</span><h2>El aprendizaje comienza con una conversación.</h2><p>Conoce los próximos programas y encuentra la formación adecuada para ti.</p></div><a href={inquiry} target="_blank" rel="noopener noreferrer" className="btn nh-btn-light">Consultar próximos programas →</a></div>
    </section>
  </main>;
}
