import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/config/site";
import "../../academia.css";

export const metadata: Metadata = {
  title: "La Mujer del Faro | Academia Nicté Ha",
  description: "Conoce el propósito, los objetivos y los temas del taller La Mujer del Faro de Guadalupe Gómez Pezuela.",
  alternates: { canonical: "/academia/programas/la-mujer-del-faro/" },
};

const sessions = [
  { name: "Reconocer mi esencia", topics: ["Mi identidad y mi historia personal", "Lo que me hace única", "Reflexiones para conectar conmigo"] },
  { name: "Mirar mi historia con nuevos ojos", topics: ["Experiencias y aprendizajes importantes", "Creencias y emociones que influyen en mi presente", "Reconocer los recursos que he construido"] },
  { name: "Encontrar mi luz y dirección", topics: ["Mis valores y fortalezas", "Lo que deseo para esta etapa", "Claridad para tomar decisiones propias"] },
  { name: "Avanzar hacia mi siguiente etapa", topics: ["Elegir acciones congruentes conmigo", "Crear compromisos personales", "Integrar lo aprendido en mi vida cotidiana"] },
];

export default function MujerDelFaroPage() {
  const inquiry = buildWhatsAppUrl("Hola, me interesa el taller La Mujer del Faro de Academia Nicté Ha. ¿Me pueden compartir información sobre inscripción y disponibilidad?");
  return <main className="nh-page nh-legado-page">
    <header className="nh-header"><div className="shell nh-header-inner">
      <Link href="/academia/" className="nh-header-brand"><img src="/images/academia-nicte-ha-logo.webp" alt="Logo Academia Nicté Ha" /><span><strong>Academia Nicté Ha</strong><small>Por Guadalupe Gómez Pezuela</small></span></Link>
      <nav className="nh-nav" aria-label="Navegación"><Link href="/academia/">Academia</Link><Link href="/academia/#programas">Cursos</Link></nav>
      <a className="nh-header-campus" href="/academia-guadalupe/">Acceso de alumnos →</a>
    </div></header>
    <section className="nh-detail-hero"><div className="shell nh-legado-hero">
      <div><Link className="nh-detail-back" href="/academia/#programas">← Volver a programas</Link><span className="nh-kicker">Taller de desarrollo personal</span><h1>La Mujer del Faro</h1>
        <p className="nh-detail-lead">Un espacio para reconocer tu esencia, mirar tu historia y encontrar claridad para avanzar.</p>
        <p>De la mano de Guadalupe Gómez Pezuela, explora tus experiencias, fortalezas y decisiones a través de reflexiones y actividades personales.</p>
        <p><strong>4 sesiones de trabajo · Reflexión y ejercicios guiados</strong></p>
        <span className="nh-program-status">Información pública · Acceso al aula con autorización</span>
        <div className="nh-detail-actions"><a className="btn btn-primary" href={inquiry} target="_blank" rel="noopener noreferrer">Solicitar información →</a><a className="btn nh-btn-outline" href="#temario">Qué aprenderás ↓</a></div>
      </div>
      <img className="nh-legado-cover" src="/images/nicteha-mujer-del-faro.png" alt="Portada oficial del taller La Mujer del Faro" />
    </div></section>
    <section className="shell nh-legado-intro"><div><span className="nh-kicker">Objetivo general</span><h2>Volver a conectar contigo.</h2><p>Promover un proceso de autoconocimiento y reflexión que permita reconocer la propia historia, valorar los recursos personales y definir pasos congruentes con los deseos y valores de cada participante.</p></div>
      <div><span className="nh-kicker">Objetivos de aprendizaje</span><h2>Lo que podrás trabajar.</h2><ul className="nh-detail-themes"><li>Reconocer fortalezas, valores y experiencias significativas.</li><li>Reflexionar sobre creencias y decisiones personales.</li><li>Identificar lo que deseas transformar o fortalecer.</li><li>Definir acciones realistas para tu siguiente etapa.</li></ul></div>
    </section>
    <section id="temario" className="nh-legado-curriculum"><div className="shell"><span className="nh-kicker">Recorrido temático</span><h2>¿Qué veremos en el taller?</h2><p>Estos son los ejes de presentación del taller. Las actividades específicas se entregan a las personas con acceso autorizado al aula.</p>
      <div className="nh-legado-modules">{sessions.map((session,index)=><details className="nh-legado-module" key={session.name} open={index===0}><summary><span className="nh-legado-module-number">{String(index+1).padStart(2,"0")}</span><span><strong>{session.name}</strong><small>Sesión {index+1}</small></span><span aria-hidden="true">＋</span></summary><div className="nh-legado-module-body"><ul>{session.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></div></details>)}</div>
    </div></section>
    <section className="nh-close"><div className="shell nh-close-inner"><div><span className="nh-kicker">Academia Nicté Ha</span><h2>Tu luz también marca el camino.</h2><p>Pregunta por las condiciones y disponibilidad del taller.</p></div><a className="btn nh-btn-light" href={inquiry} target="_blank" rel="noopener noreferrer">Consultar inscripción →</a></div></section>
  </main>;
}
