import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";

const root="public/images/";
const read=p=>readFileSync(p,"utf8");
const officialAssets=[
  ["guadalupe-logo-oficial-principal.webp","d60997d06048cc203347ae6459246a6d8c830f4e"],
  ["guadalupe-logo-oficial-invertido.webp","508f5887a554b30c272a658c3b037308feb724ad"],
  ["guadalupe-isotipo-oficial.webp","39fb95ba41b4157b3ec06fa9ab378c7d4810cf77"],
];
const sha=buffer=>createHash("sha1").update(Buffer.concat([Buffer.from("blob "+buffer.length+"\0"),buffer])).digest("hex");

test("all approved logo files exist as valid WebP with exact reviewed assets",()=>{
 for(const [file,expected] of officialAssets){
   const path=root+file;assert.equal(existsSync(path),true,"Missing "+path);
   const contents=readFileSync(path);
   assert.equal(contents.toString("ascii",0,4),"RIFF");
   assert.equal(contents.toString("ascii",8,12),"WEBP");
   assert.equal(sha(contents),expected,file+" must match reviewed manual derivative");
 }
});
test("brand configuration and header/footer reference official logos",()=>{
 const brand=read("config/branding.ts");
 const header=read("components/Header.tsx"),footer=read("components/Footer.tsx");
 assert.match(brand,/#315F59/);assert.match(brand,/#B79A63/);
 assert.match(brand,/guadalupe-logo-oficial-principal\.webp/);
 assert.match(brand,/guadalupe-logo-oficial-invertido\.webp/);
 assert.match(header,/branding\.logo/);assert.match(footer,/branding\.logoInverted/);
});
test("all academy routes, CRM and legacy editor show official artwork",()=>{
 const paths=["public/panel/index.html","public/academia-guadalupe/index.html","public/academia-guadalupe/aula.html",
  ...["inicio","cursos","mi-curso","libros","comunidad","progreso","perfil","administracion","leccion"]
  .map(name=>"public/academia-guadalupe/"+name+".html")];
 for(const path of paths){
   const content=read(path);
   assert.match(content,/guadalupe-logo-oficial-(principal|invertido)\.webp/,path+" lacks official brand");
   assert.doesNotMatch(content,/guadalupe-logo-(principal|invertido)\.png/,path+" references superseded design");
 }
});
test("favicon uses original lotus-G and the old app icon is gone",()=>{
 const icon=readFileSync("app/favicon.ico");
 assert.equal(sha(icon),"22384ab9b35d4c814d8efaa409e9a7394d920f12");
 assert.equal(existsSync("app/icon.png"),false);
});
