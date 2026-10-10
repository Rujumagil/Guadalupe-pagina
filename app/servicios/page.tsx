import type { Metadata } from "next";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Coaching, orientación, liderazgo, cursos, talleres y conferencias con Guadalupe Gómez Pezuela.",
};

export default function ServiciosPage() {
  return <main className="simple-page"><Services /></main>;
}
