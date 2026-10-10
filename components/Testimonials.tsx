import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="section" id="testimonios">
      <div className="shell">
        <header className="section-head"><h2>Experiencias compartidas</h2></header>
        <div className="cards-3">
          {testimonials.map((testimonial) => (
            <article className="path-card" key={`${testimonial.name}-${testimonial.quote}`}>
              <p>“{testimonial.quote}”</p>
              <strong>{testimonial.name}</strong>
              {testimonial.role && <span>{testimonial.role}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
