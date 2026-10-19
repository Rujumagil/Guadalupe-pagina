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
            <Image alt="Guadalupe Gómez Pezuela, coach ejecutiva y de vida" height={830} src={branding.logoInverted} width={1305} />
            <p>Coaching ejecutivo y de vida para acompañarte con claridad y cercanía. La Academia Nicté Ha es un espacio propio de aprendizaje y desarrollo.</p>
          </div>
          <div>
            <h4>Explora</h4>
            <Link href="/">Inicio</Link>
            <Link href="/coaching-personal">Coaching personal</Link>
            <Link href="/empresas">Coaching empresarial</Link>
            <Link href="/sobre-mi">Sobre Guadalupe</Link>
            <Link href="/contacto">Contacto</Link>
            <a href="/panel/" rel="nofollow">Acceso privado</a>
            <Link href="/recursos">Artículos y recursos</Link>
            <a href="/academia-guadalupe/">Ingresar a Academia Nicté Ha</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a>
            <a href={"https://wa.me/" + siteConfig.whatsappNumber} rel="noopener noreferrer" target="_blank">{siteConfig.whatsappDisplay}</a>
            <a href="/privacy.html">Aviso de privacidad</a>
            <a href="/terms.html">Términos</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Guadalupe Gómez Pezuela.</span>
          <span>Coach ejecutiva y de vida</span>
        </div>
      </div>
    </footer>
  );
}
