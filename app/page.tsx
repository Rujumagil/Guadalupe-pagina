import { About } from "@/components/About";
import { AudienceGate } from "@/components/AudienceGate";
import { Authority } from "@/components/Authority";
import { BusinessPreview } from "@/components/BusinessPreview";
import { CTA } from "@/components/CTA";
import { Events } from "@/components/Events";
import { HelpPaths } from "@/components/HelpPaths";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Resources } from "@/components/Resources";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AudienceGate />
      <Authority />
      <HelpPaths />
      <BusinessPreview />
      <About />
      <Process />
      <CTA />
      <Events />
      <Services compact />
      <Resources />
      <Testimonials />
    </main>
  );
}
