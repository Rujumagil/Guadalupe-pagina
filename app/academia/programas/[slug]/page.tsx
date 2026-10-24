import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { academyDrafts } from "@/content/nicte-ha-courses";
import { buildWhatsAppUrl } from "@/config/site";
import "../../academia.css";

export function generateStaticParams() {
  return academyDrafts.map((course) => ({ slug: course.slug }));
}

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = academyDrafts.find((item) => item.slug === slug);
  if (!course) return { title: "Programa no encontrado", robots: { index: false } };
  return {
    title: course.title + " | Academia Nicté Ha",
    description: course.summary + " Solicita información de próximos programas.",
    alternates: { canonical: "/academia/programas/" + course.slug + "/" },
    robots: { index: false, follow: true },
  };
}

export default async function AcademyProgram({ params }: Props) {
  const { slug } = await params;
  const course = academyDrafts.find((item) => item.slug === slug);
  if (!course) notFound();
  const inquiry = buildWhatsAppUrl("Hola, me interesa el programa " + course.title + " de Academia Nicté Ha. ¿Me pueden avisar cuando confirmen temario, modalidad, fechas y costos?");
  return <main className="nh-page nh-detail-page">
    <header className="nh-header">
      <div className="shell nh-header-inner">
        <Link href="/academia/" className="nh-header-brand" aria-label="Volver a Academia Nicté Ha">
          <img src="/images/academia-nicte-ha-logo.webp" alt="Academia Nicté Ha" />
          <span><strong>Academia Nicté Ha</strong><small>Por Guadalupe Gómez Pezuela</small></span>
        </Link>
        <nav className="nh-nav" aria-label="Navegación de Academia Nicté Ha">
          <Link href="/academia/">Inicio de academia</Link>
          <Link href="/academia/#programas">Todos los programas</Link>
          <Link href="/">Guadalupe ↗</Link>
        </nav>
        <a className="nh-header-campus" href="/academia-guadalupe/">Acceso de alumnos →</a>
      </div>
    </header>
    <section className="nh-detail-hero">
      <div className="shell nh-detail-grid">
        <div>
          <Link className="nh-detail-back" href="/academia/#programas">← Volver al catálogo</Link>
          <span className="nh-kicker">{course.category} · {course.level}</span>
          <h1>{course.title}</h1>
          <p className="nh-detail-lead">{course.summary}</p>
          <div className="nh-detail-actions">
            <a className="btn btn-primary" href={inquiry} target="_blank" rel="noopener noreferrer">Solicitar información →</a>
            <Link className="btn nh-btn-outline" href="/academia/#programas">Ver otras opciones</Link>
          </div>
        </div>
        <aside className="nh-detail-info" aria-label="Estado del programa">
          <span className="nh-program-status">Programa en preparación</span>
          <h2>Datos del programa</h2>
          <dl>
            <div><dt>Modalidad</dt><dd>Por confirmar</dd></div>
            <div><dt>Duración</dt><dd>Por confirmar</dd></div>
            <div><dt>Próxima fecha</dt><dd>Por anunciar</dd></div>
            <div><dt>Inversión</dt><dd>Por confirmar</dd></div>
            <div><dt>Inscripción</dt><dd>Aún no disponible</dd></div>
          </dl>
          <p>Esta ficha es informativa. No se ofrecen matrículas ni pagos mientras el programa continúe en preparación.</p>
        </aside>
      </div>
    </section>
    <section className="shell nh-detail-content">
      <div>
        <span className="nh-kicker">¿A quién puede interesarle?</span>
        <h2>Una propuesta de aprendizaje para ti.</h2>
        <p>{course.audience}</p>
      </div>
      <div>
        <span className="nh-kicker">Ejes orientativos</span>
        <h2>Lo que buscamos explorar.</h2>
        <p>Estos temas sirven como referencia inicial; no constituyen el temario definitivo. Guadalupe confirmará contenidos y actividades antes de abrir el curso.</p>
        <ul className="nh-detail-themes">{course.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
      </div>
    </section>
    <section className="nh-close">
      <div className="shell nh-close-inner">
        <div><span className="nh-kicker">Conoce los próximos pasos</span><h2>Conversemos sobre tu formación.</h2><p>Solicita información para recibir los detalles confirmados cuando el programa esté disponible.</p></div>
        <a className="btn nh-btn-light" href={inquiry} target="_blank" rel="noopener noreferrer">Consultar este programa →</a>
      </div>
    </section>
  </main>;
}
