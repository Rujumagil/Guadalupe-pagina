import { pageMetadata } from "@/config/seo";
import { TrackedLink } from "@/components/TrackedLink";
import "./black-friday.css";

export const metadata = pageMetadata({
  title: "Black Friday | Certificación en Coaching 2027",
  description: "Del 26 al 28 de noviembre de 2026, inscríbete en la Certificación en Coaching por $489 USD. Inicio 4 de enero de 2027.",
  path: "/black-friday-coaching",
});

const paymentUrl = "https://buy.stripe.com/aFa7sLft1bnY8y104D5os00";

const inclusions = [
  { heading: "Clases en vivo", text: "Cinco semanas de formación por Zoom para aprender y practicar." },
  { heading: "Ebook", text: "Material de apoyo incluido en tu inscripción." },
  { heading: "Grabaciones", text: "Acceso a las grabaciones de las clases." },
  { heading: "Coaching grupal", text: "Tres sesiones de coaching grupal incluidas." },
  { heading: "Sesión personal", text: "Una sesión de coaching personal incluida." },
];

export default function BlackFridayCoachingPage() {
  return (
    <main className="bf-page">
      <section className="bf-hero" aria-labelledby="bf-title">
        <div className="bf-wrap">
          <div className="bf-ribbon">BLACK FRIDAY · 26 AL 28 DE NOVIEMBRE</div>
          <p className="bf-kicker">Gómez Pezuela y Asociados presenta</p>
          <h1 id="bf-title">Certificación <em>en Coaching</em></h1>
          <p className="bf-subtitle">Aprende a guiar conversaciones con estructura y confianza.</p>
          <div className="bf-offer" aria-label="Oferta Black Friday">
            <p className="bf-offer-label">Precio especial Black Friday</p>
            <div className="bf-price">$489 <span>USD</span></div>
            <p className="bf-before">Precio habitual <s>$750 USD</s> <span className="bf-savings">Ahorras $261 USD</span></p>
            <TrackedLink className="bf-button" href={paymentUrl} target="_blank" rel="noopener noreferrer" eventName="Lead">Pagar $489 USD en Stripe <span aria-hidden="true">↗</span></TrackedLink>
            <p className="bf-smallprint">Promoción válida del 26 al 28 de noviembre de 2026.</p>
          </div>
          <div className="bf-quick">
            <div><strong>4 enero 2027</strong><span>Inicio de clases</span></div>
            <div><strong>5 semanas</strong><span>En vivo por Zoom</span></div>
            <div><strong>Lunes a jueves</strong><span>5 a 7 p. m. · CDMX</span></div>
          </div>
        </div>
      </section>

      <section className="bf-section bf-story">
        <div className="bf-wrap bf-narrow">
          <span className="bf-section-eyebrow">UNA NUEVA FORMA DE ACOMPAÑAR</span>
          <h2>¿Las personas confían en ti para hablar de lo que les preocupa?</h2>
          <p>¿Te pasa que, después de escucharlas, te quedas pensando qué pregunta les habría ayudado a encontrar su propia respuesta?</p>
          <p>En esta certificación vas a practicar cómo <strong>escuchar, hacer preguntas que abran nuevas posibilidades y guiar conversaciones de coaching</strong> con estructura y confianza.</p>
        </div>
      </section>

      <section className="bf-section bf-includes">
        <div className="bf-wrap">
          <span className="bf-section-eyebrow">TU FORMACIÓN</span>
          <h2>Todo lo que incluye tu inscripción</h2>
          <div className="bf-grid">
            {inclusions.map((item, i) => (
              <article className="bf-feature" key={item.heading}>
                <span className="bf-feature-number">0{i + 1}</span>
                <h3>{item.heading}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bf-section bf-schedule">
        <div className="bf-wrap bf-schedule-grid">
          <div>
            <span className="bf-section-eyebrow">APRENDE Y PRACTICA EN VIVO</span>
            <h2>Empieza el 4 de enero de 2027</h2>
            <p>Durante cinco semanas trabajarás en clases en vivo por Zoom, de lunes a jueves, de 5 a 7 p. m., hora de Ciudad de México.</p>
            <p>Aprende a facilitar conversaciones de coaching a través de la escucha, las preguntas y la práctica.</p>
          </div>
          <div className="bf-date-card">
            <span>INICIO</span><strong>04</strong><b>ENERO 2027</b>
            <hr />
            <p>Lunes a jueves</p><p>5:00 – 7:00 p. m. (CDMX)</p><p>Modalidad en vivo · Zoom</p>
          </div>
        </div>
      </section>

      <section className="bf-section bf-end" id="aparta">
        <div className="bf-wrap bf-narrow">
          <span className="bf-section-eyebrow">DEL 26 AL 28 DE NOVIEMBRE</span>
          <h2>Da el primer paso hacia tu certificación.</h2>
          <p className="bf-end-lead">Aprovecha el precio especial de <strong>$489 USD</strong> y reserva tu lugar pagando en Stripe.</p>
          <TrackedLink className="bf-button" href={paymentUrl} target="_blank" rel="noopener noreferrer" eventName="Lead">Pagar $489 USD en Stripe <span aria-hidden="true">↗</span></TrackedLink>
          <p className="bf-signature">Un abrazo,<br /><strong>Guadalupe Gómez Pezuela</strong></p>
          <p className="bf-certifier">Certifica: Gómez Pezuela y Asociados</p>
        </div>
      </section>
    </main>
  );
}
