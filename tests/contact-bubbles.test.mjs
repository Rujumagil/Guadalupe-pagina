import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(path, "utf8");
const widget = read("components/ContactBubbles.tsx");
const css = read("styles/contact-bubbles.css");

test("site renders only one contact dock, keeping direct WhatsApp",()=>{
  const layout = read("app/layout.tsx");
  assert.match(layout,/<ContactBubbles \/>/);
  assert.doesNotMatch(layout,/<WhatsAppButton \/>/);
  assert.match(widget,/Habla con Andy/);
  assert.match(widget,/Contactar directamente a Guadalupe por WhatsApp/);
  assert.match(widget,/buildWhatsAppUrl/);
  assert.match(widget,/eventName="Contact"/);
});

test("Andy opens the dialog on the first click, independent of the API",()=>{
  assert.match(widget,/function toggleAndy\(\)/);
  assert.match(widget,/setOpen\(true\);/);
  assert.match(widget,/if \(status === "idle" \|\| status === "unavailable"\) void connect\(\);/);
  assert.match(widget,/open && \(/);
  assert.match(widget,/role="dialog"/);
  assert.match(widget,/aria-expanded={open}/);
  assert.match(widget,/Cerrar conversación con Andy/);
  assert.doesNotMatch(widget,/<Script|querySelector.*launcher|compas-chat\.js/);
});

test("Andy starts in a conversation; no name, email or phone form gates",()=>{
  assert.match(widget,/config\.welcomeMessage/);
  assert.match(widget,/showWelcome/);
  assert.match(widget,/showTopics/);
  for(const topic of ["Coaching personal","Coaching empresarial","Academia Guadalupe"]){
    assert.ok(widget.includes(topic));
  }
  assert.match(widget,/className="guadalupe-andy-transcript"/);
  assert.match(widget,/className="guadalupe-andy-composer-wrap"/);
  assert.match(widget,/placeholder="Escribe lo que quieras preguntarme/);
  assert.doesNotMatch(widget,/status\s*===\s*"details"|Antes de comenzar|Ingresa tu correo|<input type="email"/);
});

test("uses real Compas One API, sales route, public key and authenticated session token",()=>{
  assert.match(widget,/app\.proyectocompas\.app/);
  assert.match(widget,/wc_[0-9a-f]{36}/);
  assert.match(widget,/\/api\/public\/web-chat\//);
  assert.match(widget,/section: "config" \| "messages"/);
  assert.match(widget,/serviceRoute: "sales"/);
  assert.match(widget,/clientMessageId: messageId/);
  assert.match(widget,/name: "Visitante"/);
  assert.doesNotMatch(widget,/<input type="email"|<input type="tel"|Antes de comenzar/);
  assert.match(widget,/fetch\(endpoint\("messages"\)/);
  assert.match(widget,/X-Compas-Chat-Session/);
  assert.match(widget,/setMessages/);
  assert.doesNotMatch(widget,/api\.openai\.com|service_role|sb_secret_/);
});

test("requires explicit consent before the first chat message, not before opening",()=>{
  assert.match(widget,/checked={consent}/);
  assert.match(widget,/!sessionToken && !consent/);
  assert.match(widget,/Acepto el /);
  assert.match(widget,/config\.privacyUrl/);
  assert.match(widget,/consent: consent \|\| Boolean\(sessionToken\)/);
  assert.match(widget,/role="alert"/);
  assert.match(widget,/Reintentar conexión/);
});

test("natural chat UI is responsive and accessible",()=>{
  assert.match(css,/\.guadalupe-andy-msg-row/);
  assert.match(css,/\.guadalupe-andy-topics/);
  assert.match(css,/\.guadalupe-andy-consent-inline/);
  assert.match(css,/\.guadalupe-andy-typing/);
  assert.match(css,/@media \(max-width:600px\)/);
  assert.match(css,/guadalupe-contact-bubble-whatsapp/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(widget,/aria-live="polite"/);
  assert.match(widget,/event\.key === "Enter"/);
  assert.match(widget,/event\.key === "Escape"/);
});
