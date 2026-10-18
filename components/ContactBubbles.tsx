"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { buildWhatsAppUrl } from "@/config/site";
import { TrackedLink } from "./TrackedLink";

const CHAT_API = "https://app.proyectocompas.app";
const FLY_PUBLIC_KEY = "wc_1defe173698ae845c7f66d5d28674564022e";
const CHAT_SESSION_KEY = "guadalupe:andy:session:v1";
const WHATSAPP_CONTACT = buildWhatsAppUrl(
  "Hola Guadalupe, vi tu página y quiero hablar directamente contigo sobre tus servicios."
);

type ChatStatus = "idle" | "connecting" | "details" | "chat" | "unavailable";
type ChatMessage = { id: string; body: string; sender: "agent" | "visitor" };
type PublicChatConfig = {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  requireContactMethod: boolean;
  privacyUrl: string;
};
const FALLBACK: PublicChatConfig = {
  title: "Habla con Andy",
  subtitle: "Asistente virtual de Guadalupe",
  welcomeMessage: "¡Hola! Soy Andy. ¿En qué puedo ayudarte?",
  requireContactMethod: false,
  privacyUrl: "https://rujumagil.github.io/Guadalupe-pagina/privacy.html",
};
function endpoint(route: "config" | "messages") {
  return CHAT_API + "/api/public/web-chat/" + route + "?key=" + encodeURIComponent(FLY_PUBLIC_KEY);
}
function publicError(response: Response, data: {error?:string}) {
  if (response.status === 429) return "Se alcanzó el límite de mensajes. Intenta nuevamente en un minuto.";
  if (response.status === 403) return "El servicio de Andy no autorizó esta conexión. Puedes contactar por WhatsApp.";
  return typeof data.error === "string" && data.error.length < 200
    ? data.error : "No fue posible conectar con Andy. Intenta nuevamente o utiliza WhatsApp.";
}

/** La ventana se abre inmediatamente sin depender de un launcher oculto.
 * Los mensajes se envían exclusivamente al backend oficial de Compás One. */
export function ContactBubbles() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [config, setConfig] = useState<PublicChatConfig>(FALLBACK);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [sending, setSending] = useState(false);
  const sendingLock = useRef(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);

  const refreshHistory = useCallback(async (token: string, quiet = true) => {
    if (!token || sendingLock.current) return false;
    try {
      const response = await fetch(endpoint("messages"), {
        headers: { "X-Compas-Chat-Session": token },
        cache: "no-store",
      });
      const result: {ok?:boolean;messages?:Array<{id:string;direction:string;body:string}>;error?:string} =
        await response.json();
      if (!response.ok || !result.ok) {
        if (response.status === 401 || response.status === 403) {
          window.sessionStorage.removeItem(CHAT_SESSION_KEY);
          setSessionToken("");
          setMessages([]);
          setStatus("details");
          setNotice("La sesión de chat venció. Confirma tus datos para continuar.");
        }
        return false;
      }
      setMessages((result.messages ?? [])
        .filter(x => (x.direction === "incoming" || x.direction === "outgoing") && !!x.body)
        .map(x => ({ id: x.id, body: x.body, sender: x.direction === "incoming" ? "visitor" : "agent" })));
      return true;
    } catch {
      if (!quiet) setNotice("No fue posible consultar el historial. Intenta nuevamente.");
      return false;
    }
  }, []);

  async function connect() {
    setStatus("connecting");
    setNotice("");
    try {
      const response = await fetch(endpoint("config"), {cache:"no-store"});
      const result: {ok?:boolean;config?:Partial<PublicChatConfig>;error?:string} = await response.json();
      if (!response.ok || !result.ok || !result.config) throw Error(publicError(response,result));
      setConfig({...FALLBACK,...result.config});
      const token = window.sessionStorage.getItem(CHAT_SESSION_KEY);
      if (token) {
        setSessionToken(token);
        setStatus("chat");
        if (await refreshHistory(token)) return;
        setSessionToken("");
      }
      setStatus("details");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Andy no está disponible en este momento.");
      setStatus("unavailable");
    }
  }
  function toggleAndy() {
    if (open) { setOpen(false); return; }
    setOpen(true); // Sin esperar al servidor: resuelve el botón que no abría.
    if (status === "idle" || status === "unavailable") void connect();
  }
  function beginChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) {setNotice("Escribe tu nombre para continuar.");return;}
    if (config.requireContactMethod && !email.trim() && !phone.trim()) {
      setNotice("Ingresa un correo o teléfono para continuar.");return;
    }
    if (!consent) {setNotice("Acepta el aviso de privacidad para continuar.");return;}
    setNotice("");
    setMessages([{id:"local:welcome",sender:"agent",body:config.welcomeMessage}]);
    setStatus("chat");
  }
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sendingLock.current) return;
    sendingLock.current = true;
    setSending(true);
    setNotice("");
    setDraft("");
    const clientId = window.crypto.randomUUID();
    const pendingId = "local:" + clientId;
    setMessages(prev=>[...prev,{id:pendingId,body:text,sender:"visitor"}]);
    try {
      const response=await fetch(endpoint("messages"),{
        method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          publicKey:FLY_PUBLIC_KEY,
          clientMessageId:clientId,
          message:text,
          sessionToken:sessionToken||undefined,
          name:name.trim()||undefined,
          email:email.trim()||undefined,
          phone:phone.trim()||undefined,
          consent,
          serviceRoute:"sales",
          pageUrl:window.location.href,
        }),
      });
      const result:{ok?:boolean;error?:string;sessionToken?:string;reply?:string}=await response.json();
      if(!response.ok||!result.ok) throw Error(publicError(response,result));
      if(result.sessionToken) {
        setSessionToken(result.sessionToken);
        window.sessionStorage.setItem(CHAT_SESSION_KEY,result.sessionToken);
      }
      if(result.reply?.trim()){
        setMessages(prev=>[...prev,{
          id:"local:reply:"+clientId,sender:"agent",body:result.reply!.trim()
        }]);
      }
    }catch(error){
      setMessages(prev=>prev.filter(x=>x.id!==pendingId));
      setDraft(text);
      setNotice(error instanceof Error?error.message:"No fue posible enviar tu mensaje.");
    }finally{
      sendingLock.current=false;
      setSending(false);
    }
  }

  useEffect(()=>{
    if(!open)return;
    const close=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){setOpen(false);launchRef.current?.focus();}
    };
    window.addEventListener("keydown",close);
    closeRef.current?.focus();
    return ()=>window.removeEventListener("keydown",close);
  },[open]);

  useEffect(()=>{
    if(!open||!sessionToken||status!=="chat")return;
    const id=window.setInterval(()=>{void refreshHistory(sessionToken)},7000);
    return ()=>window.clearInterval(id);
  },[open,sessionToken,status,refreshHistory]);

  useEffect(()=>{
    if(!open)return;
    const body=transcriptRef.current;
    if(body)body.scrollTop=body.scrollHeight;
  },[open,messages]);

  return (
    <div className="guadalupe-contact-dock" role="group" aria-label="Opciones de atención">
      {open && (
        <section id="guadalupe-andy-panel" className="guadalupe-andy-panel" role="dialog"
          aria-label="Chat con Andy, asistente virtual de Guadalupe" aria-modal="false">
          <header className="guadalupe-andy-header">
            <div><strong>{config.title}</strong><small>{config.subtitle}</small></div>
            <button ref={closeRef} className="guadalupe-andy-close" type="button"
              aria-label="Cerrar conversación con Andy"
              onClick={()=>{setOpen(false);launchRef.current?.focus()}}>×</button>
          </header>
          <div className="guadalupe-andy-content">
            {status==="connecting"&&<p className="guadalupe-andy-info" role="status">Conectando con Andy…</p>}
            {status==="unavailable"&&(
              <div className="guadalupe-andy-info">
                <strong>El chat de Andy no está disponible.</strong>
                <p>{notice}</p>
                <button type="button" className="guadalupe-andy-submit" onClick={()=>void connect()}>Reintentar conexión</button>
                <a className="guadalupe-andy-textlink" href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp ↗</a>
              </div>
            )}
            {status==="details"&&(
              <form className="guadalupe-andy-form" onSubmit={beginChat}>
                <h3>Antes de comenzar</h3>
                <p>Andy es el asistente virtual de Guadalupe. Indica cómo contactarte y acepta el aviso de privacidad.</p>
                <label>Nombre *<input value={name} onChange={e=>setName(e.target.value)}
                  minLength={2} maxLength={160} autoComplete="name" required /></label>
                <label>Correo electrónico<input type="email" value={email}
                  onChange={e=>setEmail(e.target.value)} maxLength={320} autoComplete="email" /></label>
                <label>Teléfono<input type="tel" value={phone}
                  onChange={e=>setPhone(e.target.value)} maxLength={80} autoComplete="tel" /></label>
                <label className="guadalupe-andy-consent">
                  <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required />
                  <span>Acepto el <a href={config.privacyUrl} target="_blank" rel="noopener noreferrer">aviso de privacidad</a> para recibir atención y seguimiento.</span>
                </label>
                <button type="submit" className="guadalupe-andy-submit">Iniciar conversación →</button>
              </form>
            )}
            {status==="chat"&&(
              <div className="guadalupe-andy-transcript" ref={transcriptRef}
                role="log" aria-label="Mensajes de Andy" aria-live="polite">
                {messages.map(m=>(
                  <div key={m.id} className={"guadalupe-andy-message "+m.sender}>{m.body}</div>
                ))}
                {sending&&<div className="guadalupe-andy-message agent" role="status">Andy está atendiendo tu consulta…</div>}
              </div>
            )}
          </div>
          {status==="chat"&&(
            <form className="guadalupe-andy-composer" onSubmit={sendMessage}>
              <label htmlFor="guadalupe-andy-message" className="guadalupe-andy-sr-only">Mensaje para Andy</label>
              <textarea id="guadalupe-andy-message" rows={2} maxLength={2000}
                placeholder="Escribe tu mensaje…" value={draft} onChange={e=>setDraft(e.target.value)}
                disabled={sending}/>
              <button type="submit" aria-label="Enviar mensaje a Andy" disabled={sending||!draft.trim()}>➤</button>
            </form>
          )}
          {notice&&status!=="unavailable"&&<p className="guadalupe-andy-notice" role="alert">{notice}</p>}
          <footer className="guadalupe-andy-footnote">Asistente conectado con Compás One</footer>
        </section>
      )}
      <div className="guadalupe-contact-option">
        <span className="guadalupe-contact-caption">Habla con Andy</span>
        <button ref={launchRef} type="button" aria-label={open?"Cerrar ventana de Andy":"Habla con Andy, asistente virtual de Guadalupe"}
          aria-controls="guadalupe-andy-panel" aria-expanded={open} title="Habla con Andy"
          className="guadalupe-contact-bubble guadalupe-contact-bubble-fly"
          onClick={toggleAndy}>
          <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4.5" y="6" width="15" height="13" rx="4"/>
            <path d="M12 3v3M9 12h.01M15 12h.01M9 15.5h6M8 19v2M16 19v2" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="guadalupe-contact-option">
        <span className="guadalupe-contact-caption">WhatsApp</span>
        <TrackedLink aria-label="Contactar directamente a Guadalupe por WhatsApp"
          className="guadalupe-contact-bubble guadalupe-contact-bubble-whatsapp"
          eventName="Contact" href={WHATSAPP_CONTACT} rel="noopener noreferrer"
          target="_blank" title="Hablar por WhatsApp con Guadalupe">
          <svg width="29" height="29" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
            strokeWidth="1.8" aria-hidden="true">
            <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.45L3.5 20l1.05-4.3A8.5 8.5 0 1 1 20.5 11.6Z"/>
            <path d="M8.3 8.3c-.5.6-.7 1.1-.5 1.8.7 2.4 3.6 5.4 6 5.9.8.2 1.4 0 2-.5l.6-.8-2.6-1.3-1 1c-1.2-.5-2.5-1.8-3-3l1-1-1.4-2.5-1.1.4Z"/>
          </svg>
        </TrackedLink>
      </div>
    </div>
  );
}
