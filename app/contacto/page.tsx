import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import { TrackedLink } from "@/components/TrackedLink";
import { commercialLinks } from "@/content/comercial";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Contacto | Guadalupe Gómez Pezuela",
  description: "Solicita información para coaching personal o empresarial, sesiones y servicios de acompañamiento con Guadalupe.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <main className="g-page">
      <section className="g-subhero">
        <div className="shell">
          <div className="g-section-title">
            <span className="g-eyebrow">Contacto</span>
            <h1>Hablemos de lo que hoy necesitas.</h1>
            <p className="g-lead">Selecciona el motivo de tu consulta para que podamos
            comenzar una conversación adecuada a tu situación.</p>
          </div>
          <div className="g-columns-2 g-contact-grid">
            <div className="g-contact-panel">
              <span className="g-eyebrow">Para ti</span>
              <h2>Coaching personal</h2>
              <p>Cuéntame si quieres explorar un proceso individual sobre decisiones,
              confianza, comunicación o cambios en tu vida.</p>
              <TrackedLink className="btn btn-primary" href={commercialLinks.personalWhatsApp} target="_blank" rel="noopener noreferrer">Consultar sesiones personales</TrackedLink>
            </div>
            <div className="g-contact-panel">
              <span className="g-eyebrow">Para líderes y organizaciones</span>
              <h2>Coaching empresarial</h2>
              <p>Conversemos sobre las necesidades de tus líderes o equipos y sobre
              el alcance de un posible proceso de acompañamiento.</p>
              <TrackedLink className="btn btn-primary" href={commercialLinks.businessWhatsApp} target="_blank" rel="noopener noreferrer">Solicitar conversación empresarial</TrackedLink>
            </div>
          </div>
        </div>
      </section>
      <section className="g-section">
        <div className="shell g-contact-panel">
          <span className="g-eyebrow">Otros medios</span>
          <h2>También puedes escribir directamente.</h2>
          <p>Correo: <a className="g-contact-link" href={"mailto:" + siteConfig.email}>{siteConfig.email}</a></p>
          <p>WhatsApp: <a className="g-contact-link" href={"https://wa.me/" + siteConfig.whatsappNumber} target="_blank" rel="noopener noreferrer">{siteConfig.whatsappDisplay}</a></p>
          <div className="g-divider" />
          <p className="g-disclaimer">Comparte únicamente información necesaria para solicitar
          orientación sobre el servicio. Para temas de privacidad consulta
          <a className="g-contact-link" href="/privacy.html"> el aviso de privacidad</a>.</p>
        </div>
      </section>
    </main>
  );
}
