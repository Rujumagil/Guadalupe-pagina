import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Academia ETERNI | Cursos y experiencias de desarrollo humano",
  description: "Academia ETERNI reúne cursos, audios, ejercicios y experiencias de aprendizaje con Guadalupe Gómez Pezuela para continuar tu proceso desde cualquier lugar.",
};

const experiences = [
  { number: "01", title: "Cursos", copy: "Recorridos organizados para comprender un tema, avanzar paso a paso y llevarlo a tu vida cotidiana." },
  { number: "02", title: "Audios", copy: "Contenidos que puedes escuchar para reflexionar, integrar aprendizajes y acompañar momentos específicos." },
  { number: "03", title: "Ejercicios", copy: "Preguntas y prácticas para pasar de la comprensión a una experiencia personal y concreta." },
  { number: "04", title: "Experiencias", copy: "Programas y espacios de acompañamiento cuya disponibilidad se presenta dentro del catálogo vigente." },
] as const;

export default function AcademiaEterniPage() {
  return (
    <main className="academy-page">
      <section className="academy-hero">
        <div className="academy-hero-glow" aria-hidden="true" />
        <div className="shell academy-hero-grid">
          <div className="academy-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Academia ETERNI</span>
            <h1>Un espacio para seguir aprendiendo, incluso después de una sesión.</h1>
            <p>Encuentra cursos, audios, ejercicios y experiencias creadas para ayudarte a comprenderte, practicar nuevas herramientas y avanzar a tu propio ritmo.</p>
            <div className="academy-hero-actions">
              <a className="btn btn-gold" href={siteConfig.academyUrl} target="_blank" rel="noopener">Entrar a Academia ETERNI</a>
              <a className="btn btn-outline-light" href="#experiencias">Explorar cómo puedo aprender</a>
            </div>
          </div>
          <div className="academy-interface" aria-label="Vista conceptual de Academia ETERNI">
            <div className="academy-interface-bar"><i /><i /><i /><span>Academia ETERNI</span></div>
            <div className="academy-interface-body">
              <aside><strong>ETERNΙ</strong><span>Inicio</span><span>Mis cursos</span><span>Audios</span><span>Recursos</span></aside>
              <div className="academy-interface-content">
                <small>Continúa aprendiendo</small>
                <h2>Tu camino, en un solo lugar.</h2>
                <div className="academy-progress"><span style={{ width: "68%" }} /></div>
                <div className="academy-mini-grid"><div><b>Curso</b><em>Avanza paso a paso</em></div><div><b>Audio</b><em>Escucha y reflexiona</em></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="academy-intro">
        <div className="shell academy-intro-grid">
          <div><span className="services-eyebrow">Aprendizaje que continúa</span><h2>La transformación necesita tiempo, práctica y nuevas conversaciones.</h2></div>
          <div><p>Academia ETERNI complementa el trabajo de Guadalupe con recursos que puedes consultar desde donde estés. No busca llenarte de información, sino ayudarte a integrar lo aprendido en decisiones y acciones cotidianas.</p><p>El catálogo puede actualizarse conforme se abren nuevos cursos, programas y experiencias.</p></div>
        </div>
      </section>

      <section className="academy-experiences" id="experiencias">
        <div className="shell">
          <header className="academy-section-head"><span className="services-eyebrow">Qué encontrarás</span><h2>Diferentes maneras de aprender según tu momento.</h2></header>
          <div className="academy-experience-grid">
            {experiences.map((experience) => <article key={experience.number}><span>{experience.number}</span><h3>{experience.title}</h3><p>{experience.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="academy-path">
        <div className="shell academy-path-grid">
          <div className="academy-path-heading"><span className="services-eyebrow services-eyebrow-light">Cómo funciona</span><h2>Entra, elige y avanza con intención.</h2><p>Cada experiencia puede tener condiciones diferentes de acceso, duración o acompañamiento. Consulta su ficha antes de inscribirte.</p></div>
          <ol>
            <li><span>01</span><div><strong>Explora el catálogo</strong><p>Revisa los contenidos y encuentra el tema relacionado con lo que hoy necesitas.</p></div></li>
            <li><span>02</span><div><strong>Conoce la experiencia</strong><p>Consulta objetivos, modalidad, contenidos, inversión y condiciones de acceso.</p></div></li>
            <li><span>03</span><div><strong>Inscríbete</strong><p>Completa el proceso indicado para ingresar al contenido elegido.</p></div></li>
            <li><span>04</span><div><strong>Llévalo a tu vida</strong><p>Avanza en las actividades y convierte cada aprendizaje en una práctica personal.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="academy-for-you">
        <div className="shell academy-for-you-grid">
          <div className="academy-for-you-card">
            <span className="services-eyebrow">Puede ser para ti si…</span>
            <h2>Quieres continuar tu proceso con estructura y libertad.</h2>
            <ul><li>Buscas aprender desde casa o desde tu teléfono.</li><li>Prefieres avanzar de acuerdo con tus tiempos.</li><li>Quieres complementar sesiones, talleres o programas.</li><li>Necesitas volver a escuchar o practicar una herramienta.</li><li>Te interesa formar parte de futuras experiencias ETERNI.</li></ul>
          </div>
          <div className="academy-for-you-visual"><img src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela, creadora de Academia ETERNI" loading="lazy" /></div>
        </div>
      </section>

      <section className="academy-clarity">
        <div className="shell">
          <header className="academy-section-head"><span className="services-eyebrow">Antes de inscribirte</span><h2>Elige con información clara.</h2></header>
          <div className="academy-clarity-grid">
            <article><strong>Disponibilidad</strong><p>Revisa si el contenido está abierto, tiene fecha de inicio o pertenece a una convocatoria.</p></article>
            <article><strong>Acceso</strong><p>Confirma durante cuánto tiempo podrás consultar los materiales y desde qué dispositivos.</p></article>
            <article><strong>Acompañamiento</strong><p>Verifica si la experiencia es autogestiva, incluye sesiones o cuenta con seguimiento.</p></article>
            <article><strong>Reconocimiento</strong><p>Consulta si entrega constancia, diploma o certificado y cuál es su alcance.</p></article>
          </div>
        </div>
      </section>

      <section className="academy-final">
        <div className="shell academy-final-grid">
          <div><span className="services-eyebrow services-eyebrow-light">Tu siguiente aprendizaje</span><h2>Entra a la Academia y descubre el contenido disponible para ti.</h2><p>Consulta el catálogo vigente, revisa cada experiencia y elige la ruta que corresponda a tu momento.</p></div>
          <a className="btn btn-gold" href={siteConfig.academyUrl} target="_blank" rel="noopener">Ver Academia ETERNI</a>
        </div>
      </section>
    </main>
  );
}
