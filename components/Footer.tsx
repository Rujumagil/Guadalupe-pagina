import { branding } from "@/config/branding";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image alt="Guadalupe Gómez Pezuela" height={900} src={branding.logoInverted} width={2400} />
            <p>Desarrollo humano, coaching y capacitación para personas y empresas. ETERNI reúne cursos, talleres y experiencias que complementan su trabajo.</p>
          </div>
          <div>
            <h4>Explora</h4>
            <Link href="/coaching-personal">Coaching personal</Link>
            <Link href="/empresas">Capacitación para empresas</Link>
            <Link href="/liderazgo-desarrollo-profesional">Liderazgo y desarrollo profesional</Link>
            <Link href="/programacion-neurolinguistica-pnl">Programación Neurolingüística (PNL)</Link>
            <Link href="/cursos-talleres-conferencias">Cursos, talleres y conferencias</Link>
            <Link href="/webinar">Próximo evento</Link>
            <Link href="/podcast">Podcast</Link>
            <a href={siteConfig.academyUrl} rel="noopener" target="_blank">Academia</a>
            <Link href="/recursos">Recursos</Link>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} rel="noopener" target="_blank">{siteConfig.whatsappDisplay}</a>
            <a href="/privacy.html">Privacidad</a>
            <a href="/terms.html">Términos</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Guadalupe Gómez Pezuela / ETERNI.</span>
          <span>Transformación Integral</span>
        </div>
      </div>
    </footer>
  );
}
