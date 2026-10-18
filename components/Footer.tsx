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
            <Image alt="Guadalupe Gómez Pezuela" height={227} src={branding.logoInverted} width={340} />
            <p>Coaching personal y empresarial con cercanía humana. La Academia Guadalupe es un espacio propio de aprendizaje y desarrollo.</p>
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
            <a href="/academia-guadalupe/">Ingresar a Academia Guadalupe</a>
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
          <span>Desarrollo humano y legado</span>
        </div>
      </div>
    </footer>
  );
}
