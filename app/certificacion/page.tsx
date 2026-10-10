import type { Metadata } from "next";
import { buildWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Certificación y formación especializada",
  description: "Programas de formación profunda con Guadalupe Gómez Pezuela: fundamentos, práctica, retroalimentación, evaluación e integración profesional.",
};

const certificationUrl = buildWhatsAppUrl("Hola Guadalupe, quiero solicitar información sobre los programas de certificación. Deseo conocer la próxima convocatoria, requisitos, modalidad y documento que se entrega.");

const pillars = [
  { number: "01", title: "Fundamentos", copy: "Comprendes los principios, el lenguaje y los criterios que sostienen la metodología estudiada." },
  { number: "02", title: "Práctica", copy: "Llevas lo aprendido a ejercicios, casos y situaciones que permiten observar tu aplicación." },
  { number: "03", title: "Retroalimentación", copy: "Recibes orientación para reconocer avances, ajustar tu práctica y fortalecer tu criterio." },
  { number: "04", title: "Integración", copy: "Organizas conocimientos, experiencia y herramientas para aplicarlos con coherencia." },
  { number: "05", title: "Evaluación", copy: "Demuestras los aprendizajes conforme a los criterios definidos para cada programa." },
] as const;

export default function CertificacionPage() {
  return (
    <main className="certification-page">
      <section className="certification-hero">
        <div className="certification-hero-media" aria-hidden="true">
          <img src="/images/servicio-capacitacion-equipos.webp" alt="" fetchPriority="high" />
        </div>
        <div className="shell certification-hero-grid">
          <div className="certification-hero-copy">
            <span className="services-eyebrow services-eyebrow-light">Certificación y formación especializada</span>
            <h1>Aprender una metodología exige comprenderla, practicarla y demostrarla.</h1>
            <p>Los programas de certificación están pensados para personas que buscan una formación profunda, acompañada y orientada a una aplicación responsable.</p>
            <a className="btn btn-gold" href={certificationUrl} target="_blank" rel="noopener">Solicitar información de certificaciones</a>
          </div>
        </div>
      </section>

      <section className="certification-intro">
        <div className="shell certification-intro-grid">
          <div>
            <span className="services-eyebrow">Más que completar un curso</span>
            <h2>Una certificación debe mostrar lo que sabes hacer.</h2>
          </div>
          <div className="certification-intro-copy">
            <p>Mi propuesta formativa busca que puedas explicar lo aprendido, llevarlo a la práctica y reconocer los límites de su aplicación.</p>
            <p>Cada programa define su propio contenido, duración, requisitos y forma de evaluación. Esa información se entrega antes de formalizar una inscripción.</p>
          </div>
        </div>
      </section>

      <section className="certification-audience">
        <div className="shell">
          <header className="certification-section-head">
            <span className="services-eyebrow">Para quién es</span>
            <h2>Para quienes quieren profesionalizar su práctica y asumir un compromiso mayor con su formación.</h2>
          </header>
          <div className="certification-audience-grid">
            <article><span>Profesionales</span><h3>Fortalece tu intervención.</h3><p>Integra herramientas y criterios que complementen tu experiencia en desarrollo humano, liderazgo o acompañamiento.</p></article>
            <article><span>Facilitadores</span><h3>Da estructura a tu manera de formar.</h3><p>Profundiza en la preparación, conducción y revisión de experiencias de aprendizaje con personas o grupos.</p></article>
            <article><span>Líderes</span><h3>Aplica el aprendizaje en tu entorno.</h3><p>Desarrolla capacidades que puedas trasladar con responsabilidad a conversaciones, equipos y procesos reales.</p></article>
          </div>
        </div>
      </section>

      <section className="certification-pillars">
        <div className="shell">
          <header className="certification-section-head">
            <span className="services-eyebrow services-eyebrow-light">Modelo de formación</span>
            <h2>De la comprensión a la demostración.</h2>
          </header>
          <div className="certification-pillar-list">
            {pillars.map((pillar) => (
              <article key={pillar.number}><span>{pillar.number}</span><div><h3>{pillar.title}</h3><p>{pillar.copy}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="certification-path">
        <div className="shell certification-path-grid">
          <div>
            <span className="services-eyebrow">Tu recorrido</span>
            <h2>Cada etapa prepara la siguiente.</h2>
            <p>El recorrido específico dependerá de la certificación elegida, pero siempre debe existir una relación clara entre aprendizaje, práctica y evaluación.</p>
          </div>
          <ol>
            <li><span>01</span><div><strong>Revisión de convocatoria</strong><p>Conoces objetivos, perfil, requisitos, modalidad, inversión y alcance.</p></div></li>
            <li><span>02</span><div><strong>Formación guiada</strong><p>Participas en las sesiones, contenidos y actividades establecidas.</p></div></li>
            <li><span>03</span><div><strong>Práctica y evidencias</strong><p>Realizas los ejercicios o entregables definidos para demostrar aprendizaje.</p></div></li>
            <li><span>04</span><div><strong>Evaluación y cierre</strong><p>Se revisa el cumplimiento de los criterios y se informa el resultado.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="certification-transparency">
        <div className="shell certification-transparency-grid">
          <div className="certification-transparency-title">
            <span className="services-eyebrow">Información transparente</span>
            <h2>Antes de inscribirte, sabrás exactamente qué documento recibirás.</h2>
          </div>
          <div className="certification-checklist">
            <p>Cada convocatoria deberá informar por escrito:</p>
            <ul>
              <li>Nombre completo y alcance del programa.</li>
              <li>Perfil de ingreso y requisitos de participación.</li>
              <li>Duración, modalidad, actividades y criterios de evaluación.</li>
              <li>Nombre de la institución o marca que emite el documento.</li>
              <li>Si se entrega constancia, diploma o certificado.</li>
              <li>Si existe o no reconocimiento, registro o validez externa.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="certification-final">
        <div className="shell certification-final-grid">
          <div><span className="services-eyebrow services-eyebrow-light">Próximas convocatorias</span><h2>Solicita el programa vigente y revisa si corresponde a tu objetivo.</h2><p>Te compartiré la información disponible para que puedas valorar contenidos, requisitos, alcance y forma de acreditación antes de tomar una decisión.</p></div>
          <a className="btn btn-gold" href={certificationUrl} target="_blank" rel="noopener">Recibir información por WhatsApp</a>
        </div>
      </section>
    </main>
  );
}
