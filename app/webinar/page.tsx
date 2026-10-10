import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Próximo evento",
  description: "Muy pronto anunciaremos nuevas experiencias y encuentros con Guadalupe Gómez Pezuela.",
};

export default function WebinarPage() {
  return (
    <ComingSoon
      title="Próximamente"
      description="Estamos preparando la siguiente experiencia con Guadalupe. Muy pronto publicaremos aquí el tema, la fecha, los horarios y la forma de participar."
    />
  );
}
