import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";

export function WhatsAppButton() {
  return (
    <TrackedLink
      aria-label="WhatsApp Guadalupe"
      className="whatsapp-float"
      eventName="Contact"
      href={buildWhatsAppUrl("Hola Guadalupe, vengo de tu página y quiero información.")}
      rel="noopener"
      target="_blank"
    >
      <span aria-hidden="true">✆</span>
    </TrackedLink>
  );
}
