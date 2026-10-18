import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const root="public/images/";
const read=p=>readFileSync(p,"utf8");
const sha=b=>createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\0"),b])).digest("hex");

test("the new approved Coach ejecutiva y de vida signature exists in vector form",()=>{
 for(const variant of ["principal","invertido"]){
   const path=root+"guadalupe-coach-ejecutiva-"+variant+".svg";
   assert.ok(existsSync(path),path);
   const svg=read(path);
   assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
   assert.match(svg,/aria-label="Guadalupe Gómez Pezuela — Coach ejecutiva y de vida"/);
   assert.match(svg,/fill-rule="evenodd"/);
   assert.ok(svg.length>6500,"Vector must contain the official emblem and lettering outlines");
 }
 assert.match(read(root+"guadalupe-coach-ejecutiva-principal.svg"),/#075448/);
 assert.match(read(root+"guadalupe-coach-ejecutiva-invertido.svg"),/#f7f8f4/);
});
test("branding and Next header/footer use the NEW logo",()=>{
 const brand=read("config/branding.ts");
 assert.match(brand,/#315F59/);assert.match(brand,/#B79A63/);
 assert.match(brand,/guadalupe-coach-ejecutiva-principal\.svg/);
 assert.match(brand,/guadalupe-coach-ejecutiva-invertido\.svg/);
 assert.match(read("components/Header.tsx"),/branding\.logo/);
 assert.match(read("components/Footer.tsx"),/branding\.logoInverted/);
 assert.match(read("components/Footer.tsx"),/Coach ejecutiva y de vida/);
});
test("academy routes and CRM all show the new approved signature",()=>{
 const paths=["public/panel/index.html","public/academia-guadalupe/index.html","public/academia-guadalupe/aula.html",
 ...["inicio","cursos","mi-curso","libros","comunidad","progreso","perfil","administracion","leccion"]
   .map(name=>"public/academia-guadalupe/"+name+".html")];
 for(const path of paths){
   assert.match(read(path),/guadalupe-coach-ejecutiva-(principal|invertido)\.svg/,path+" missing new logo");
   assert.doesNotMatch(read(path),/guadalupe-logo-oficial-(principal|invertido)\.webp/,path+" still uses old identity");
 }
});
test("the lotus-G favicon remains unchanged and valid",()=>{
 const icon=readFileSync("app/favicon.ico");
 assert.equal(sha(icon),"22384ab9b35d4c814d8efaa409e9a7394d920f12");
 assert.equal(existsSync("app/icon.png"),false);
});
