export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

// Solo publicar testimonios reales, autorizados y entregados por Guadalupe.
export const testimonials: Testimonial[] = [];
