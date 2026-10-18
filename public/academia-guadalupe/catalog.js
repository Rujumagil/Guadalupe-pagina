import { API_URL, PUBLISHABLE_KEY, WORKSPACE_ID, WHATSAPP } from "./config.js";
const status = document.getElementById("catalogStatus"), grid = document.getElementById("catalogGrid");
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n;}
async function load(){
 try{
  const q=new URLSearchParams({select:"id,title,slug,summary,category,level,duration_minutes",workspace_id:"eq."+WORKSPACE_ID,status:"eq.published",order:"published_at.desc",limit:"50"});
  const r=await fetch(API_URL+"/rest/v1/ggp_academy_courses?"+q,{headers:{apikey:PUBLISHABLE_KEY},cache:"no-store"});
  if(!r.ok)throw new Error("Catálogo no disponible");
  const courses=await r.json();
  status.textContent=courses.length?"":"Los programas están en preparación. Por ahora no hay inscripciones abiertas.";
  for(const c of courses){
   const card=el("article","course-card"),banner=el("div","course-mark","GP · ACADEMIA"),content=el("div","course-content");
   content.append(el("span","eyebrow",c.category),el("h3","",c.title),el("p","",c.summary));
   const meta=el("div","course-meta");
   meta.append(el("span","",c.level),el("span","",c.duration_minutes?c.duration_minutes+" min":"Duración por confirmar"));
   const a=el("a","text-link","Ver programa →");a.href="./aula.html?course="+encodeURIComponent(c.id);
   content.append(meta,a);card.append(banner,content);grid.append(card);
  }
 }catch{
  status.textContent="El catálogo no está disponible. ";
  const a=el("a","text-link","Consultar con Guadalupe →");a.href=WHATSAPP;a.target="_blank";a.rel="noopener noreferrer";status.append(a);
 }
}
load();