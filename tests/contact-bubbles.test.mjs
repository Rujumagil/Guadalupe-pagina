import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");

test("public pages mount only one shared double-contact dock",()=>{
 const layout=read("app/layout.tsx");
 assert.match(layout,/ContactBubbles/);
 assert.match(layout,/<ContactBubbles \/>/);
 assert.doesNotMatch(layout,/<WhatsAppButton \/>/);
});
test("Fly Sales links to real Compas One web chat, never a fake AI answer",()=>{
 const widget=read("components/ContactBubbles.tsx");
 assert.match(widget,/app\.proyectocompas\.app\/compas-chat\.js/);
 assert.match(widget,/wc_[0-9a-f]{36}/);
 assert.match(widget,/compas:chat-route/);
 assert.match(widget,/route: "sales"/);
 assert.match(widget,/querySelector<HTMLButtonElement>\("\.launcher"\)/);
 assert.match(widget,/customizeFlyWidget/);
 assert.match(widget,/setFlyUnavailable/);
 assert.doesNotMatch(widget,/api\.openai\.com|NEXT_PUBLIC_.*SECRET|supabase\.co\/rest\/v1\/contacts/);
});
test("exactly two visible launchers: Habla con Andy and direct WhatsApp, with accessibility",()=>{
 const code=read("components/ContactBubbles.tsx");
 const dock=read("styles/contact-bubbles.css");
 assert.match(code,/Habla con Andy/);
 assert.match(code,/WhatsApp/);
 assert.match(code,/buildWhatsAppUrl/);
 assert.match(code,/aria-label="Habla con Andy, asistente virtual de Guadalupe/);
 assert.match(code,/aria-label="Contactar directamente a Guadalupe por WhatsApp/);
 assert.match(code,/eventName="Contact"/);
 assert.doesNotMatch(code,/<span className="guadalupe-contact-caption">Compás Fly Sales<\/span>/);
 assert.match(code,/\.launcher \{ opacity: 0 !important; pointer-events: none/);
 assert.match(dock,/guadalupe-contact-bubble-fly/);
 assert.match(dock,/guadalupe-contact-bubble-whatsapp/);
 assert.match(dock,/prefers-reduced-motion/);
 assert.match(dock,/safe-area-inset-bottom/);
});
