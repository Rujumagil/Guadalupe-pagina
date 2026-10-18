"use client";

import { useCallback, useRef, useState } from "react";
import Script from "next/script";
import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";

const FLY_PUBLIC_KEY = "wc_1defe173698ae845c7f66d5d28674564022e";
const FLY_SCRIPT = "https://app.proyectocompas.app/compas-chat.js?v=58.8";
const WHATSAPP_CONTACT = buildWhatsAppUrl(
  "Hola Guadalupe, vi tu página y quiero hablar directamente contigo sobre tus servicios."
);

type FlyHost = HTMLElement & { shadowRoot: ShadowRoot | null };

/** Las dos burbujas públicas son distintas: Fly Sales crea leads en Compás One;
 * WhatsApp abre una conversación directa externa. No simulamos respuestas IA. */
export function ContactBubbles() {
  const [flyReady, setFlyReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [flyUnavailable, setFlyUnavailable] = useState(false);
  const openWhenReady = useRef(false);

  const findLauncher = useCallback(() => {
    const host = document.querySelector<FlyHost>("compas-one-web-chat");
    return host?.shadowRoot?.querySelector<HTMLButtonElement>(".launcher") ?? null;
  }, []);

  const customizeFlyWidget = useCallback(() => {
    const host = document.querySelector<FlyHost>("compas-one-web-chat");
    if (!host?.shadowRoot) return false;
    const launcher = host.shadowRoot.querySelector<HTMLButtonElement>(".launcher");
    if (!launcher) return false;

    launcher.setAttribute("aria-label", "Compás Fly Sales");
    launcher.setAttribute("title", "Abrir chat de Compás Fly Sales");

    if (!host.shadowRoot.querySelector("#guadalupe-fly-widget-position")) {
      const style = document.createElement("style");
      style.id = "guadalupe-fly-widget-position";
      // Ocultamos únicamente el botón incorporado, para que haya EXACTAMENTE
      // dos burbujas visibles. El chat real de Compás One queda intacto.
      style.textContent = `
        .launcher { opacity: 0 !important; pointer-events: none !important;
          width: 0 !important; height: 0 !important; min-width: 0 !important;
          min-height: 0 !important; overflow: hidden !important; }
        .root,.root.left { right: 18px !important; left: auto !important;
          bottom: 158px !important; }
        .panel,.left .panel {
          bottom: 10px !important;
          right: 0 !important;
          left: auto !important;
          height: min(570px, calc(100dvh - 190px)) !important;
        }
        @media (max-width:520px) {
          .root,.root.left { right: 12px !important; bottom: 148px !important; }
          .panel,.left .panel {
            position: fixed !important; inset: 8px 8px 149px 8px !important;
            width: auto !important; height: auto !important; }
        }
      `;
      host.shadowRoot.appendChild(style);
    }
    return true;
  }, []);

  const openFly = useCallback(() => {
    window.dispatchEvent(new CustomEvent("compas:chat-route", {
      detail: { route: "sales" }
    }));
    if (customizeFlyWidget()) {
      findLauncher()?.click();
      setNotice("");
      openWhenReady.current = false;
    } else if (flyUnavailable) {
      setNotice("Fly Sales no está disponible en este momento. Puedes comunicarte directamente por WhatsApp.");
    } else {
      openWhenReady.current = true;
      setNotice("Conectando con Compás Fly Sales…");
    }
  }, [customizeFlyWidget, findLauncher, flyUnavailable]);

  const onFlyLoaded = useCallback(() => {
    const ready = customizeFlyWidget();
    setFlyReady(ready);
    setFlyUnavailable(!ready);
    if (ready && openWhenReady.current) openFly();
    else if (!ready) setNotice("No se pudo iniciar Fly Sales. Usa WhatsApp para contactar a Guadalupe.");
  }, [customizeFlyWidget, openFly]);

  return (
    <>
      <Script
        id="guadalupe-compas-fly-sales-widget"
        src={FLY_SCRIPT}
        data-key={FLY_PUBLIC_KEY}
        strategy="afterInteractive"
        onReady={onFlyLoaded}
        onError={() => {
          setFlyUnavailable(true);
          setNotice("No se pudo conectar con Fly Sales. Puedes usar WhatsApp.");
        }}
      />

      <div className="guadalupe-contact-dock" role="group" aria-label="Opciones de atención">
        {notice && (
          <div className="guadalupe-contact-alert" role="status" aria-live="polite">
            {notice}
          </div>
        )}

        <div className="guadalupe-contact-option">
          <span className="guadalupe-contact-caption">Compás Fly Sales</span>
          <button
            type="button"
            aria-label="Abrir conversación con Compás Fly Sales, asistente virtual de Guadalupe"
            aria-haspopup="dialog"
            title={flyReady ? "Hablar con Compás Fly Sales" : "Conectar con Fly Sales"}
            className="guadalupe-contact-bubble guadalupe-contact-bubble-fly"
            onClick={openFly}
          >
            <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4.5" y="6" width="15" height="13" rx="4" />
              <path d="M12 3v3M9 12h.01M15 12h.01M9 15.5h6M8 19v2M16 19v2" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="guadalupe-contact-option">
          <span className="guadalupe-contact-caption">WhatsApp</span>
          <TrackedLink
            aria-label="Contactar directamente a Guadalupe por WhatsApp"
            className="guadalupe-contact-bubble guadalupe-contact-bubble-whatsapp"
            eventName="Contact"
            href={WHATSAPP_CONTACT}
            rel="noopener noreferrer"
            target="_blank"
            title="Hablar por WhatsApp con Guadalupe"
          >
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" aria-hidden="true">
              <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.45L3.5 20l1.05-4.3A8.5 8.5 0 1 1 20.5 11.6Z"/>
              <path d="M8.3 8.3c-.5.6-.7 1.1-.5 1.8.7 2.4 3.6 5.4 6 5.9.8.2 1.4 0 2-.5l.6-.8-2.6-1.3-1 1c-1.2-.5-2.5-1.8-3-3l1-1-1.4-2.5-1.1.4Z"/>
            </svg>
          </TrackedLink>
        </div>
      </div>
    </>
  );
}
