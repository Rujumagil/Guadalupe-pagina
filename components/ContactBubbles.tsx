"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";
import { PUBLIC_KEY, SESSION_KEY, endpoint, publicError } from "@/lib/andy-chat";

const WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Guadalupe, vi tu página y quiero hablar directamente contigo sobre tus servicios."
);

type Status = "idle" | "connecting" | "chat" | "unavailable";
type Message = { id: string; sender: "agent" | "visitor"; body: string };
type PublicConfig = {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  privacyUrl: string;
  onboardingMode?: "form" | "conversation";
};

const INITIAL_CONFIG: PublicConfig = {
  title: "Habla con Andy",
  subtitle: "Asistente virtual de Guadalupe",
  welcomeMessage: "¡Hola! Soy Andy 👋 Estoy aquí para orientarte. ¿Te interesa el coaching personal, el coaching empresarial o la Academia Nicté Ha?",
  privacyUrl: "https://rujumagil.github.io/Guadalupe-pagina/privacy.html",
};

const TOPICS = [
  { label: "Coaching personal", message: "Hola Andy, quiero conocer el coaching personal." },
  { label: "Coaching empresarial", message: "Hola Andy, quiero información sobre coaching empresarial." },
  { label: "Academia Nicté Ha", message: "Hola Andy, quiero saber cómo funciona la Academia Nicté Ha." },
] as const;

/** Chat conversacional real, sin formulario de registro.
 * El primer mensaje requiere consentimiento; el motor permite sesiones anónimas,
 * y todas las respuestas provienen del backend público de Compás One. */
export function ContactBubbles() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [config, setConfig] = useState<PublicConfig>(INITIAL_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [consent, setConsent] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [sending, setSending] = useState(false);
  const sendingLock = useRef(false);
  const launchRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const refreshHistory = useCallback(async (token: string) => {
    if (!token || sendingLock.current) return false;
    try {
      const response = await fetch(endpoint("messages"), {
        headers: { "X-Compas-Chat-Session": token },
        cache: "no-store",
      });
      const payload: {
        ok?: boolean;
        messages?: Array<{ id: string; direction: string; body: string }>;
      } = await response.json();
      if (!response.ok || !payload.ok) {
        if (response.status === 401 || response.status === 403) {
          window.sessionStorage.removeItem(SESSION_KEY);
          setSessionToken("");
          setConsent(false);
          setMessages([]);
          setNotice("Tu sesión anterior terminó. Puedes iniciar una conversación nueva.");
        }
        return false;
      }
      setMessages((payload.messages ?? [])
        .filter(row => (row.direction === "incoming" || row.direction === "outgoing") && !!row.body)
        .map(row => ({
          id: row.id,
          sender: row.direction === "incoming" ? "visitor" : "agent",
          body: row.body,
        })));
      return true;
    } catch {
      // Un fallo temporal de red no debe cerrar la ventana ni borrar los mensajes.
      return false;
    }
  }, []);

  async function connect() {
    setStatus("connecting");
    setNotice("");
    try {
      const response = await fetch(endpoint("config"), { cache: "no-store" });
      const payload: {
        ok?: boolean;
        config?: Partial<PublicConfig>;
        error?: string;
      } = await response.json();
      if (!response.ok || !payload.ok || !payload.config) {
        throw Error(publicError(response, payload));
      }
      setConfig({ ...INITIAL_CONFIG, ...payload.config });
      const token = window.sessionStorage.getItem(SESSION_KEY);
      if (token) {
        setSessionToken(token);
        await refreshHistory(token);
      }
      setStatus("chat");
    } catch (error) {
      setStatus("unavailable");
      setNotice(error instanceof Error ? error.message : "El servicio de Andy no está disponible.");
    }
  }

  function toggleAndy() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (status === "idle" || status === "unavailable") void connect();
  }

  async function sendText(text: string) {
    const content = text.trim();
    if (!content || sendingLock.current || status !== "chat") return;
    if (!sessionToken && !consent) {
      setNotice("Para enviar tu primer mensaje, acepta el aviso de privacidad.");
      return;
    }
    sendingLock.current = true;
    setSending(true);
    setNotice("");
    setDraft("");
    const messageId = window.crypto.randomUUID();
    const pendingId = "local:" + messageId;
    setMessages(previous => [...previous, { id: pendingId, sender: "visitor", body: content }]);

    try {
      const response = await fetch(endpoint("messages"), {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: PUBLIC_KEY,
          clientMessageId: messageId,
          message: content,
          // Compatibilidad con versiones del backend que todavía exigen un nombre.
          // Es un seudónimo genérico, no datos personales ni un formulario.
          name: "Visitante",
          sessionToken: sessionToken || undefined,
          consent: consent || Boolean(sessionToken),
          serviceRoute: "sales",
          pageUrl: window.location.href,
        }),
      });
      const payload: {
        ok?: boolean;
        sessionToken?: string;
        reply?: string;
        error?: string;
      } = await response.json();
      if (!response.ok || !payload.ok) throw Error(publicError(response, payload));

      if (payload.sessionToken) {
        setSessionToken(payload.sessionToken);
        window.sessionStorage.setItem(SESSION_KEY, payload.sessionToken);
      }
      if (payload.reply?.trim()) {
        setMessages(previous => [...previous, {
          id: "local:reply:" + messageId,
          sender: "agent",
          body: payload.reply!.trim(),
        }]);
      }
    } catch (error) {
      setMessages(previous => previous.filter(message => message.id !== pendingId));
      setDraft(content);
      setNotice(error instanceof Error ? error.message : "Tu mensaje no pudo enviarse. Intenta de nuevo.");
    } finally {
      sendingLock.current = false;
      setSending(false);
    }
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendText(draft);
  }

  function handleComposerKey(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendText(draft);
    }
  }

  useEffect(() => {
    if (!open) return;
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", closeWithEscape);
    composerRef.current?.focus();
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [open, status]);

  useEffect(() => {
    if (!open || !sessionToken || status !== "chat") return;
    const timer = window.setInterval(() => { void refreshHistory(sessionToken); }, 7000);
    return () => window.clearInterval(timer);
  }, [open, sessionToken, status, refreshHistory]);

  useEffect(() => {
    if (!open) return;
    const log = transcriptRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [open, messages, sending, notice, status]);

  const showWelcome = messages.length === 0;
  const showTopics = showWelcome && status === "chat";

  return (
    <div className="guadalupe-contact-dock" role="group" aria-label="Canales de atención">
      {open && (
        <section
          id="guadalupe-andy-panel"
          className="guadalupe-andy-panel"
          role="dialog"
          aria-label="Conversación con Andy, asistente virtual de Guadalupe"
          aria-modal="false"
        >
          <header className="guadalupe-andy-header">
            <div className="guadalupe-andy-identity">
              <span className="guadalupe-andy-avatar" aria-hidden="true">A</span>
              <div>
                <strong>{config.title}</strong>
                <small><span className="guadalupe-andy-online" /> {config.subtitle}</small>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="guadalupe-andy-close"
              aria-label="Cerrar conversación con Andy"
              onClick={() => { setOpen(false); launchRef.current?.focus(); }}
            >×</button>
          </header>

          <div className="guadalupe-andy-content">
            <div className="guadalupe-andy-transcript" ref={transcriptRef} role="log"
              aria-label="Mensajes de Andy" aria-live="polite">
              {showWelcome && (
                <div className="guadalupe-andy-msg-row agent">
                  <div className="guadalupe-andy-msg-avatar" aria-hidden="true">A</div>
                  <div className="guadalupe-andy-message agent">{config.welcomeMessage}</div>
                </div>
              )}
              {messages.map(message => (
                <div className={"guadalupe-andy-msg-row " + message.sender} key={message.id}>
                  {message.sender === "agent" && <div className="guadalupe-andy-msg-avatar" aria-hidden="true">A</div>}
                  <div className={"guadalupe-andy-message " + message.sender}>{message.body}</div>
                </div>
              ))}
              {showTopics && (
                <div className="guadalupe-andy-topics" aria-label="Temas que puedes consultar">
                  {TOPICS.map(topic => (
                    <button key={topic.label} type="button"
                      disabled={sending}
                      onClick={() => { void sendText(topic.message); }}>
                      {topic.label} <span aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
              )}
              {status === "connecting" && (
                <p className="guadalupe-andy-system" role="status">Conectando con Andy…</p>
              )}
              {sending && (
                <div className="guadalupe-andy-msg-row agent" role="status">
                  <div className="guadalupe-andy-msg-avatar" aria-hidden="true">A</div>
                  <div className="guadalupe-andy-message agent guadalupe-andy-typing">
                    <span /><span /><span />
                    <span className="guadalupe-andy-sr-only">Andy está escribiendo</span>
                  </div>
                </div>
              )}
              {status === "unavailable" && (
                <div className="guadalupe-andy-retry">
                  <strong>No se pudo conectar con Andy.</strong>
                  <p>{notice}</p>
                  <button type="button" onClick={() => void connect()}>Reintentar conexión</button>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a>
                </div>
              )}
            </div>
          </div>

          {status !== "unavailable" && (
            <form className="guadalupe-andy-composer-wrap" onSubmit={submitMessage}>
              {!sessionToken && (
                <label className="guadalupe-andy-consent-inline">
                  <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />
                  <span>Acepto el <a href={config.privacyUrl} target="_blank" rel="noopener noreferrer">aviso de privacidad</a> para conversar.</span>
                </label>
              )}
              <div className="guadalupe-andy-composer">
                <label htmlFor="guadalupe-andy-message" className="guadalupe-andy-sr-only">Mensaje para Andy</label>
                <textarea
                  ref={composerRef}
                  id="guadalupe-andy-message"
                  rows={1}
                  maxLength={2000}
                  placeholder="Escribe lo que quieras preguntarme…"
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  onKeyDown={handleComposerKey}
                  disabled={sending || status !== "chat"}
                />
                <button type="submit" aria-label="Enviar mensaje a Andy"
                  disabled={sending || status !== "chat" || !draft.trim()}>➤</button>
              </div>
            </form>
          )}
          {notice && status !== "unavailable" && (
            <p className="guadalupe-andy-notice" role="alert">{notice}</p>
          )}
          <footer className="guadalupe-andy-footnote">Respuestas automáticas de Compás Fly · Si prefieres, puedes hablar por WhatsApp</footer>
        </section>
      )}

      <div className="guadalupe-contact-option">
        <span className="guadalupe-contact-caption">Habla con Andy</span>
        <button ref={launchRef} type="button"
          aria-label={open ? "Cerrar ventana de Andy" : "Habla con Andy, asistente virtual de Guadalupe"}
          aria-expanded={open} aria-controls="guadalupe-andy-panel"
          title="Habla con Andy"
          className="guadalupe-contact-bubble guadalupe-contact-bubble-fly"
          onClick={toggleAndy}>
          <svg viewBox="0 0 24 24" width="27" height="27" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4.5" y="6" width="15" height="13" rx="4"/>
            <path d="M12 3v3M9 12h.01M15 12h.01M9 15.5h6M8 19v2M16 19v2" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="guadalupe-contact-option">
        <span className="guadalupe-contact-caption">WhatsApp</span>
        <TrackedLink aria-label="Contactar directamente a Guadalupe por WhatsApp"
          className="guadalupe-contact-bubble guadalupe-contact-bubble-whatsapp"
          eventName="Contact" href={WHATSAPP_URL} rel="noopener noreferrer"
          target="_blank" title="Hablar por WhatsApp con Guadalupe">
          <svg width="29" height="29" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" aria-hidden="true">
            <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.45L3.5 20l1.05-4.3A8.5 8.5 0 1 1 20.5 11.6Z"/>
            <path d="M8.3 8.3c-.5.6-.7 1.1-.5 1.8.7 2.4 3.6 5.4 6 5.9.8.2 1.4 0 2-.5l.6-.8-2.6-1.3-1 1c-1.2-.5-2.5-1.8-3-3l1-1-1.4-2.5-1.1.4Z"/>
          </svg>
        </TrackedLink>
      </div>
    </div>
  );
}
