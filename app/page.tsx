import { pageMetadata } from "@/config/seo";
export const metadata = pageMetadata({ title: "Guadalupe Gómez Pezuela | Coach ejecutiva y de vida", description: "Coach ejecutiva y de vida: acompañamiento personal y empresarial para decidir con claridad, fortalecer tu liderazgo y avanzar.", path: "/" });
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  return <HomeExperience />;
}
