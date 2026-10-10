import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-page">
      <section className="section">
        <div className="shell">
          <div className="coming-soon-card">
            <span className="eyebrow">ETERNI</span>
            <h1>Página no encontrada</h1>
            <p>La dirección que abriste ya no está disponible o fue reorganizada.</p>
            <Link className="btn btn-primary" href="/">Volver al inicio</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
