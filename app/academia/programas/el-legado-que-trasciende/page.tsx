import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/config/site";
import { legadoTrasciende as program } from "@/content/legado-trasciende";
import "../../academia.css";

export const metadata: Metadata = {
  title: "El Legado que Trasciende | Academia Nicté Ha",
  description: program.summary,
  alternates: { canonical: "/academia/programas/el-legado-que-trasciende/" },
};

export default function LegadoProgramPage() {
  const inquiry = buildWhatsAppUrl("Hola, me interesa El Legado que Trasciende de Academia Nicté Ha. ¿Pueden informarme cuando se habiliten las inscripciones?");
  return <main className="nh-page nh-legado-page">
    <header className="nh-header"><div className="shell nh-header-inner">
      <Link href="/academia/" className="nh-header-brand"><img src="/images/academia-nicte-ha-logo.webp" alt="Logo Academia Nicté Ha" /><span><strong>Academia Nicté Ha</strong><small>Por Guadalupe Gómez Pezuela</small></span></Link>
      <nav className="nh-nav" aria-label="Navegación"><Link href="/academia/">Academia</Link><Link href="/academia/#programas">Cursos</Link></nav>
      <a className="nh-header-campus" href="/academia-guadalupe/">Acceso de alumnos →</a>
    </div></header>
    <section className="nh-detail-hero"><div className="shell nh-legado-hero">
      <div><Link className="nh-detail-back" href="/academia/#programas">← Volver a programas</Link><span className="nh-kicker">Programa de escritura autobiográfica</span>
        <h1>{program.title}</h1><p className="nh-detail-lead">{program.tagline}</p><p>{program.summary}</p>
        <p><strong>6 módulos · 36 clases planificadas · A tu propio ritmo</strong></p>
        <span className="nh-program-status">Programa curricular definido · Inscripciones por confirmar</span>
        <div className="nh-detail-actions"><a className="btn btn-primary" href={inquiry} target="_blank" rel="noopener noreferrer">Solicitar información →</a><a className="btn nh-btn-outline" href="#temario">Ver las 36 clases ↓</a></div>
      </div>
      <img className="nh-legado-cover" src="/images/nicteha-legado-trasciende.webp" alt="Portada oficial El Legado que Trasciende, con fotografías familiares y un libro verde" />
    </div></section>
    <section className="shell nh-legado-intro"><div><span className="nh-kicker">¿Para quién es?</span><h2>Tu historia merece quedarse.</h2><p>{program.audience}</p></div>
      <div><span className="nh-kicker">El resultado</span><h2>Tu libro de legado.</h2><p>Al recorrer el programa reunirás memorias, relatos, cartas y aprendizajes en un manuscrito que podrá revisarse, diseñarse y convertirse en un libro digital PDF para compartir.</p><p>Tu historia y tus límites son tuyos: decides qué escribir, reservar o dejar fuera.</p></div>
    </section>
    <section id="temario" className="nh-legado-curriculum"><div className="shell"><span className="nh-kicker">Plan curricular oficial · Noviembre 2026</span><h2>Tu recorrido, paso a paso.</h2>
      <p>Las primeras 16 clases cuentan con material base. Las 20 clases restantes corresponden al plan curricular y están pendientes de producción audiovisual. Los videos y ejercicios se habilitarán en el campus conforme estén disponibles y se asignen los accesos.</p>
      <div className="nh-legado-modules">{program.modules.map((module,index) => <details key={module.title} className="nh-legado-module" open={index===0}>
        <summary><span className="nh-legado-module-number">{String(index+1).padStart(2,"0")}</span><span><strong>{module.title}</strong><small>{index===0?"4 unidades · 16 clases":"4 clases"} · {module.status}</small></span><span aria-hidden="true">＋</span></summary>
        <div className="nh-legado-module-body">{"units" in module ? module.units.map((unit,unitIndex)=><div key={unit.title}><h3>Unidad {unitIndex+1}. {unit.title}</h3><ol>{unit.lessons.map(lesson=><li key={lesson}>{lesson}</li>)}</ol></div>) : <ol>{module.lessons.map(lesson=><li key={lesson}>{lesson}</li>)}</ol>}</div>
      </details>)}</div>
    </div></section>
    <section className="nh-close"><div className="shell nh-close-inner"><div><span className="nh-kicker">Recordar · Reflexionar · Escribir · Compartir</span><h2>El legado comienza con tu primera historia.</h2><p>Solicita información sobre disponibilidad y acceso al programa.</p></div><a className="btn nh-btn-light" href={inquiry} target="_blank" rel="noopener noreferrer">Consultar inscripción →</a></div></section>
  </main>;
}
