import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const file=path=>readFileSync(path,"utf8");
test("the web app manifest references the approved accessible icon, not a deleted file",()=>{
 const manifest=JSON.parse(file("public/manifest.webmanifest"));
 assert.equal(manifest.theme_color,"#315F59");
 assert.equal(manifest.background_color,"#FAF9F6");
 assert.equal(manifest.icons[0].src,"./images/guadalupe-isotipo-oficial.webp");
 assert.equal(manifest.icons[0].type,"image/webp");
 assert.equal(manifest.start_url,"./");
});
test("every main commercial page has its own canonical metadata",()=>{
 for(const path of ["app/page.tsx","app/coaching-personal/page.tsx","app/empresas/page.tsx",
 "app/sobre-mi/page.tsx","app/contacto/page.tsx","app/recursos/page.tsx"]){
  assert.match(file(path),/pageMetadata\(/,path);
 }
 const helper=file("config/seo.ts");
 for(const token of ["alternates: { canonical: path }","openGraph:","twitter:"]){
  assert.ok(helper.includes(token));
 }
});
test("no false offer of a free coaching orientation",()=>{
 const article=file("app/recursos/[slug]/page.tsx");
 assert.doesNotMatch(article,/orientaci[oó]n inicial gratuita|orientaci[oó]n gratuita/gi);
 assert.match(article,/Consultar orientaci[oó]n inicial/);
});
test("business WhatsApp form gives a fallback and does not falsely claim a sent message",()=>{
 const form=file("components/BusinessInquiry.tsx");
 assert.match(form,/setPreparedUrl\(url\)/);
 assert.match(form,/no se ha enviado/);
 assert.match(form,/href={preparedUrl}/);
 assert.match(form,/target="_blank"/);
});
test("responsive nav has an accessible button and fits tablet breakpoints",()=>{
 const header=file("components/Header.tsx");
 const css=file("styles/globals.css");
 assert.match(header,/aria-controls="guadalupe-navigation"/);
 assert.match(header,/id="guadalupe-navigation"/);
 assert.match(header,/event.key === "Escape"/);
 assert.match(css,/min-width:901px/);
 assert.match(css,/max-width:1250px/);
});
test("Guadalupe educational site and ETERNI remain separate",()=>{
 const footer=file("components/Footer.tsx");
 const bridge=file("app/academia-eterni/page.tsx");
 assert.match(footer,/Ingresar a Academia Nicté Ha/);
 assert.doesNotMatch(footer,/href="\/academia-eterni"/);
 assert.match(bridge,/dos academias|Dos academias/i);
 assert.match(bridge,/credenciales no se comparten/i);
});
test("all academy private pages excluded from crawler access",()=>{
 const robots=file("app/robots.ts");
 assert.match(robots,/\/academia-guadalupe\//);
 assert.match(robots,/\/panel\//);
 const sitemap=file("app/sitemap.ts");
 assert.doesNotMatch(sitemap,/\"\/academia-eterni\"/);
});
test("privacy and legal pages acknowledge new academy and correct branding",()=>{
 for(const path of ["public/privacy.html","public/terms.html"]){
  const html=file(path);
  assert.match(html,/Academia Nicté Ha/);
  assert.match(html,/#315F59/);
  assert.match(html,/revisi[oó]n/);
 }
});
