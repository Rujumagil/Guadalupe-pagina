import { pageMetadata } from "@/config/seo";
export const metadata = pageMetadata({ title: "Guadalupe Gómez Pezuela | Coaching personal y empresarial", description: "Coaching personal y empresarial con Guadalupe Gómez Pezuela: acompañamiento para decidir con claridad, comunicar mejor y fortalecer el liderazgo.", path: "/" });
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  return <HomeExperience />;
}
