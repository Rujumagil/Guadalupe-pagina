import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const widget=read("components/ContactBubbles.tsx");
const css=read("styles/contact-bubbles.css");

test("public site renders exactly one contact dock and preserves WhatsApp",()=>{
 const layout=read("app/layout.tsx");
 assert.match(layout,/<ContactBubbles \/>/);
 assert.doesNotMatch(layout,/<WhatsAppButton \/>/);
 assert.match(widget,/Habla con Andy/);
 assert.match(widget,/Contactar directamente a Guadalupe por WhatsApp/);
 assert.match(widget,/buildWhatsAppUrl/);
 assert.match(widget,/eventName="Contact"/);
});
test("Andy window opens immediately on click, without requiring Shadow DOM launcher",()=>{
 assert.match(widget,/function toggleAndy\(\)/);
 assert.match(widget,/setOpen\(true\);/);
 assert.match(widget,/if \(status === "idle" \|\| status === "unavailable"\) void connect\(\);/);
 assert.match(widget,/open && \(/);
 assert.match(widget,/role="dialog"/);
 assert.match(widget,/aria-expanded={open}/);
 assert.match(widget,/Cerrar conversación con Andy/);
 assert.doesNotMatch(widget,/<Script|querySelector.*launcher|onReady={onFlyLoaded}|compas-chat\.js/);
});
test("real Compas One public API backs the chat and sales routing",()=>{
 assert.match(widget,/app\.proyectocompas\.app/);
 assert.match(widget,/wc_[0-9a-f]{36}/);
 assert.match(widget,/\/api\/public\/web-chat\//);
 assert.match(widget,/route: "config" \| "messages"/);
 assert.match(widget,/serviceRoute:"sales"/);
 assert.match(widget,/clientMessageId:clientId/);
 assert.match(widget,/fetch\(endpoint\("messages"\)/);
 assert.match(widget,/X-Compas-Chat-Session/);
 assert.match(widget,/setMessages/);
 assert.doesNotMatch(widget,/api\.openai\.com|service_role|sb_secret_/);
});
test("private details require consent and never claim an unsent message",()=>{
 assert.match(widget,/type="checkbox" checked={consent}/);
 assert.match(widget,/if \(!consent\)/);
 assert.match(widget,/config\.privacyUrl/);
 assert.match(widget,/role="alert"/);
 assert.match(widget,/No fue posible enviar/);
 assert.match(widget,/Reintentar conexión/);
});
test("Andy chat styles are visible on desktop and phone",()=>{
 assert.match(css,/\.guadalupe-andy-panel\{/);
 assert.match(css,/position:fixed/);
 assert.match(css,/pointer-events:auto/);
 assert.match(css,/\.guadalupe-andy-transcript/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/guadalupe-contact-bubble-whatsapp/);
});
