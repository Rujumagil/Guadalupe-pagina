import {
 make as el, note, shortDate, accessToken, hasSession, captureLink, identity, logOut,
 get,add,patch,updatePassword,data as loadData,enrolled,hasBook,hasCommunity,courseDetail,secureMedia
} from "./portal-core.js";
import { WHATSAPP,API_URL,PUBLISHABLE_KEY } from "./config.js";

const page=document.body.dataset.page;
let ctx,store;
const root=document.getElementById("main");
function a(text,href,cls="btn"){
 const link=el("a",cls,text);link.href=href;return link;
}
function pill(text,cls=""){return el("span","state-pill "+cls,text);}
function title(name,copy,action){
 const box=el("div","heading"),content=el("div");
 content.append(el("span","kicker","ACADEMIA NICTÉ HA"),el("h1","",name),el("p","",copy));
 box.append(content);if(action)box.append(action);root.append(box);
}
function block(heading,content,href,label){
 const panel=el("section"),row=el("div","section-title"),h=el("h2","",heading);
 row.append(h);
 if(href)row.append(a(label||"Ver todos →",href,"text-link"));
 panel.append(row,content);root.append(panel);
}
function empty(head,copy,action){
 const box=el("div","empty-state glass");
 box.append(el("div","empty-icon","✧"),el("strong","",head),el("p","",copy));
 if(action)box.append(action);
 return box;
}
function number(value){
 if(typeof value==="string"&&!/^\d+(\.\d+)?$/.test(value))return value;
 return new Intl.NumberFormat("es-MX").format(Number(value)||0);
}
function stat(name,value,detail,icon){
 const box=el("div","stat glass"),label=el("div","stat-head");
 label.append(el("span","",name),el("span","stat-icon",icon));
 box.append(label,el("strong","",number(value)),el("small","",detail));
 return box;
}
function metrics(items){const box=el("div","stats");for(const item of items)box.append(stat(...item));return box}
function isPublished(c){return c.status==="published"}
function visibleCourses(){return store.courses.filter(isPublished)}
function ownedCourses(){return store.courses.filter(c=>enrolled(ctx,store,c))}
function learnerProgress(course){
 const lessons=store.lessonCounts?.[course.id]||[];
 const done=lessons.filter(id=>store.progress.some(p=>p.lesson_id===id&&p.student_id===ctx.user.id)).length;
 return {all:lessons.length,done,pct:lessons.length?Math.round(done*100/lessons.length):0};
}
function lessonLink(courseId,lessonId){return "./leccion.html?course="+encodeURIComponent(courseId)+(lessonId?"&lesson="+encodeURIComponent(lessonId):"")}
function lessonSection(content,heading){
 const lines=String(content||"").split(/\r?\n/).map(x=>x.trim());
 const start=lines.indexOf(heading);
 if(start<0)return "";
 const next=lines.slice(start+1).findIndex(line=>line.length>0);
 return next<0?"":lines[start+1+next];
}
function card(c,own=false){
 const box=el("article","media-card glass"),art=el("div","media-art");
 if(c.slug==="la-mujer-del-faro"){
  art.classList.add("nh-course-cover-art");
  const cover=el("img","nh-course-cover-image");
  cover.src="../images/nicteha-mujer-del-faro.png";
  cover.alt="Mujer profesional frente a un faro al atardecer";
  cover.loading="lazy";
  cover.decoding="async";
  art.append(cover);
 }
 if(c.slug==="el-legado-que-trasciende"){
  art.classList.add("nh-course-cover-art");
  const cover=el("img","nh-course-cover-image");
  cover.src="../images/nicteha-legado-trasciende.webp";
  cover.alt="Portada oficial de El Legado que Trasciende";
  cover.loading="lazy";
  art.append(cover);
 }
 art.append(pill(c.category||"Aprendizaje"));
 const body=el("div","media-copy");
 body.append(el("strong","",c.title),el("p","",c.summary||"Un programa de aprendizaje y desarrollo."));
 const actions=el("div","media-actions");
 if(own){
  const p=learnerProgress(c);
  const resume=store.studyResume?.[c.id];
  actions.append(pill(p.all?p.pct+"% completado":"Por comenzar","active"),a(resume?.next?"Retomar actividad →":"Abrir curso →",lessonLink(c.id,resume?.next?.id),""));
 }else if(!isPublished(c)&&ctx.isAdmin){
  actions.append(pill("Borrador","locked"),a("Editar →","./aula.html?course="+encodeURIComponent(c.id),""));
 }else {
  const ask=a("Solicitar acceso ↗",WHATSAPP,"");ask.target="_blank";ask.rel="noopener noreferrer";
  actions.append(pill("Acceso bloqueado","locked"),ask);
 }
 body.append(actions);
 if(own){
  const bar=el("div","progress-track"),inner=el("div","progress-fill");inner.style.width=learnerProgress(c).pct+"%";bar.append(inner);body.append(bar);
 }
 box.append(art,body);return box;
}
function mediaGrid(items){const grid=el("div","media-row");for(const c of items)grid.append(card(c,enrolled(ctx,store,c)));return grid}
async function loadLessonCounts(){
 const mine=ownedCourses().slice(0,50);store.lessonCounts={};
 await Promise.all(mine.map(async c=>{
  try{const detail=await courseDetail(c.id);store.lessonCounts[c.id]=detail.lessons.map(x=>x.id)}
  catch{store.lessonCounts[c.id]=[]}
 }));
}
async function loadStudyResume(){
 store.studyResume={};
 await Promise.all(ownedCourses().slice(0,50).map(async course=>{
  try{
   const [detail,entries]=await Promise.all([
    courseDetail(course.id),
    get("ggp_academy_workbook_entries","lesson_id,status,updated_at",{course_id:"eq."+course.id,student_id:"eq."+ctx.user.id,limit:"1000"})
   ]);
   const byLesson=new Map(entries.map(entry=>[entry.lesson_id,entry]));
   const latestDraft=entries.filter(e=>e.status==="draft").sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at))[0];
   const next=detail.lessons.find(l=>l.id===latestDraft?.lesson_id)||detail.lessons.find(l=>byLesson.get(l.id)?.status!=="completed");
   store.studyResume[course.id]={next,completed:detail.lessons.filter(l=>byLesson.get(l.id)?.status==="completed").length,drafts:detail.lessons.filter(l=>byLesson.get(l.id)?.status==="draft").length,total:detail.lessons.length};
  }catch{store.studyResume[course.id]=null}
 }));
}
function resumePanel(c){
 const data=store.studyResume?.[c.id],panel=el("article","resume-card glass");
 panel.append(el("span","kicker","CONTINUAR APRENDIENDO"),el("h3","",c.title));
 if(!data){panel.append(el("p","","Consulta tus actividades desde el curso."),a("Abrir curso →",lessonLink(c.id),"btn primary"));return panel}
 if(data.total===data.completed){panel.append(el("p","","¡Terminaste todas las actividades de tu cuaderno!"),a("Repasar lecciones →",lessonLink(c.id),"btn"));return panel}
 panel.append(el("p","",data.next?.title||"Primera lección disponible"));
 const details=el("p","resume-detail",data.completed+" de "+data.total+" actividades terminadas · "+data.drafts+" borradores");
 const progress=el("div","progress-track"),fill=el("div","progress-fill");fill.style.width=(data.total?Math.round(data.completed/data.total*100):0)+"%";progress.append(fill);
 panel.append(details,progress,a(data.drafts?"Continuar mi borrador →":"Comenzar actividad →",lessonLink(c.id,data.next?.id),"btn primary"));
 return panel;
}
async function home(){
 const mine=ownedCourses(),published=visibleCourses();
 const myLessons=new Set(mine.flatMap(c=>store.lessonCounts?.[c.id]||[]));
 const completed=store.progress.filter(p=>p.student_id===ctx.user.id&&myLessons.has(p.lesson_id)).length;
 const total=mine.reduce((n,c)=>n+(store.lessonCounts?.[c.id]?.length||0),0);
 const pct=total?Math.min(100,Math.round(100*completed/total)):0;
 title("Hola, "+ctx.name.split(" ")[0]+" ✦","Todo lo que necesitas para seguir creciendo, en un solo espacio.");
 const feature=el("section","hero-feature glass"),copy=el("div","hero-copy");
 copy.append(el("span","kicker","TU ACADEMIA PERSONAL"),el("h2","","Cada aprendizaje transforma tu camino."),
  el("p","",mine.length?"Retoma tu formación donde la dejaste.":"Explora la academia y descubre tus próximos programas de aprendizaje."));
 const actions=el("div","hero-actions");
 actions.append(a(mine.length?"Continuar aprendiendo →":"Explorar cursos →",mine.length?"./mi-curso.html":"./cursos.html","btn primary"));
 actions.append(a("Mi progreso","./progreso.html","btn"));
 copy.append(actions);feature.append(copy);root.append(feature);
 root.append(metrics([
  ["Mis cursos",mine.length,"Matrículas vigentes","▦"],
  ["Lecciones completadas",completed,"Tu avance registrado","✓"],
  ["Progreso general",pct+"%","Promedio de lecciones","◉"],
  ["Cursos disponibles",published.length,"Catálogo publicado","✧"],
 ]));
 if(mine.length){const panels=el("div","resume-grid");for(const c of mine.slice(0,3))panels.append(resumePanel(c));block("Retoma tu última actividad",panels)}
 block("Continuar aprendiendo",mine.length?mediaGrid(mine.slice(0,3)):
  empty("Tu camino comienza aquí","Todavía no tienes cursos asignados. Puedes revisar el catálogo y consultar cómo inscribirte.",a("Explorar catálogo →","./cursos.html","btn primary")),
  "./mi-curso.html","Ver mis cursos →");
 const recommended=published.filter(c=>!enrolled(ctx,store,c)).slice(0,3);
 block("Descubre otros programas",recommended.length?mediaGrid(recommended):
  empty("Nuevas experiencias en preparación","Por ahora no hay otros programas publicados para explorar."),
  "./cursos.html","Explorar catálogo →");
 block("Explora el universo de Guadalupe",originalCollections());
 const panels=el("div","split"),b=el("div","panel glass"),community=el("div","panel glass");
 b.append(el("span","kicker","MI BIBLIOTECA"),el("h2","","Historias para acompañar tu proceso"),
  el("p","","Accede a los libros digitales que Guadalupe te haya asignado."),
  a("Ir a mis libros →","./libros.html","btn"));
 community.append(el("span","kicker","MI COMUNIDAD"),el("h2","","Crecer también es compartir"),
  el("p","","Un espacio para reflexionar, conversar y conectar con otros participantes."),
  a("Entrar a la comunidad →","./comunidad.html","btn"));
 panels.append(b,community);root.append(panels);
}
// Catálogo visual Nicté Ha. No expone materiales privados ni modifica permisos.
function originalCollections(){
 const wrapper=el("div","media-row nh-collection-grid");
 const sections=[
  {name:"El Legado que Trasciende",description:"Escribe tu historia y prepara tu libro de legado. Plan oficial de 6 módulos y 36 clases.",url:"/academia/programas/el-legado-que-trasciende/",image:"../images/nicteha-legado-trasciende.webp",fallback:"../images/guadalupe-trayectoria.webp",alt:"Portada oficial de El Legado que Trasciende",cta:"Conocer el temario →",state:"Inscripciones por confirmar"},
  {name:"La Mujer del Faro",description:"Cuatro sesiones para explorar tu esencia, tu historia y tu propio camino.",url:"/academia/programas/la-mujer-del-faro/",image:"../images/nicteha-mujer-del-faro.png",fallback:"../images/servicio-coaching-ejecutivo.webp",alt:"Acompañamiento y transformación personal",cta:"Ver objetivos y temario →",state:"Temario público"},
  {name:"Libros de Guadalupe",description:"Cuentos para Sanar y La Mujer del Faro: lecturas para acompañarte.",url:"./libros.html",image:"../images/nicteha-libros-guadalupe.webp",fallback:"../images/guadalupe-hero.webp",alt:"Guadalupe Gómez Pezuela, autora",cta:"Descubrir libros →",state:"Acceso según asignación"},
  {name:"Comunidad IXCHEL",description:"Encuentros y conversaciones para compartir aprendizajes y crecer juntas.",url:"./comunidad.html",image:"../images/nicteha-comunidad-ixchel.webp",fallback:"../images/servicio-capacitacion-equipos.webp",alt:"Personas compartiendo una sesión de formación",cta:"Explorar comunidad →",state:"Acceso según membresía"}
 ];
 for(const section of sections){
  const panel=el("article","media-card glass nh-collection-card"),body=el("div","media-copy nh-collection-copy");
  const image=el("img","nh-collection-image");
  image.src=section.image;image.alt=section.alt;image.loading="lazy";image.decoding="async";
  image.addEventListener("error",()=>{if(image.dataset.backupLoaded)return;image.dataset.backupLoaded="1";image.src=section.fallback;},{once:true});
  const media=el("div","nh-collection-media");
  media.append(image);body.append(el("span","kicker","COLECCIÓN NICTÉ HA"),
   el("strong","",section.name),el("p","",section.description));
  const actions=el("div","media-actions");
  const link=a(section.cta,section.url,"btn small");
  link.setAttribute("aria-label",section.cta.replace(" →","")+": "+section.name);
  actions.append(link);
  body.append(el("span","nh-collection-status",section.state),actions);
  panel.append(media,body);wrapper.append(panel);
 }
 return wrapper;
}
function courses(){
 title("Explora tus próximos cursos","Programas publicados, contenido disponible y acceso según tu matrícula.");
 const featured=[
  {slug:"la-mujer-del-faro",title:"La Mujer del Faro",summary:"Conoce los objetivos y los temas de sus cuatro sesiones.",url:"/academia/programas/la-mujer-del-faro/"},
  {slug:"el-legado-que-trasciende",title:"El Legado que Trasciende",summary:"Explora los seis módulos y las 36 clases del programa curricular.",url:"/academia/programas/el-legado-que-trasciende/"}
 ];
 const links=el("div","split");
 for(const item of featured){
  const info=el("article","panel glass");
  info.append(el("span","kicker","TEMARIO Y OBJETIVOS PÚBLICOS"),el("h2","",item.title),el("p","",item.summary),a("Conocer el programa →",item.url,"btn primary"));
  links.append(info);
 }
 block("Conoce nuestros dos programas",links);
 const list=visibleCourses();
 const active=list.filter(c=>enrolled(ctx,store,c)),locked=list.filter(c=>!enrolled(ctx,store,c));
 block("Disponibles para ti",active.length?mediaGrid(active):
  empty("Sin cursos habilitados","Aquí verás los programas donde tienes matrícula activa.",a("Ir a mis cursos →","./mi-curso.html","btn")));
 block("Otros programas · Requieren inscripción",locked.length?mediaGrid(locked):
  empty("No hay programas adicionales por ahora","Nuevos cursos aparecerán cuando Guadalupe los publique.",externalConsult()));
 if(ctx.isAdmin){
  const draft=store.courses.filter(c=>c.status!=="published");
  block("Borradores de administración",draft.length?mediaGrid(draft):
   empty("No hay borradores","Puedes crear tu primer curso desde Administración."));
 }
}
function myCourses(){
 title("Mis cursos","Toda tu formación disponible, organizada según tu acceso.");
 const mine=ownedCourses();
 block("Programas en los que estás inscrito",mine.length?mediaGrid(mine):
  empty("Sin matrículas todavía","Tu cuenta está lista. Cuando se confirme la inscripción aparecerán aquí tus programas.",a("Ver catálogo →","./cursos.html","btn primary")));
 if(mine.length){const panels=el("div","resume-grid");for(const c of mine)panels.append(resumePanel(c));block("Continuar mis actividades",panels)}
 if(mine.length)root.append(a("Revisar mi libro de legado →","./cuaderno.html","btn"));
}
async function workbookReview(){
 const courses=ownedCourses();
 title("Mi libro de legado","Reúne tus escritos por módulo, revísalos y prepara una copia privada. Esta vista no publica tus memorias.",a("← Mis cursos","./mi-curso.html","btn"));
 if(!courses.length){root.append(empty("Sin cursos asignados","Necesitas una matrícula activa para consultar tus escritos."));return}
 const controls=el("section","review-controls glass"),courseLabel=el("label","","Programa"),courseSelect=el("select"),includeDraft=el("label","review-toggle"),check=el("input"),preview=el("div","review-preview"),print=el("button","btn primary","Imprimir o guardar como PDF"),printDoc=el("section","manuscript-print");
 for(const course of courses){const opt=el("option","",course.title);opt.value=course.id;courseSelect.append(opt)}
 courseLabel.append(courseSelect);check.type="checkbox";includeDraft.append(check,el("span","","Incluir también mis borradores (sin terminar)"));
 print.type="button";print.disabled=true;print.addEventListener("click",()=>window.print());
 controls.append(courseLabel,includeDraft,el("p","review-caution","Este documento contiene datos personales. Si lo guardas en un dispositivo compartido, protégelo y evita enviarlo sin revisarlo."),print);
 const editorial=el("section","editorial-panel glass"),form=el("form","editorial-form"),fields={};
 editorial.append(el("span","kicker","ETAPA EDITORIAL"),el("h2","","Ficha de mi libro"),el("p","","Personaliza la portada, dedicatoria e introducción. Los capítulos provienen de tus actividades guardadas."));
 for(const [key,labelText,multiline,max] of [["title","Título de mi libro",false,160],["subtitle","Subtítulo",false,240],["author_name","Nombre del autor",false,160],["dedication","Dedicatoria",true,5000],["introduction","Introducción",true,10000]]){
  const label=el("label","",labelText),field=el(multiline?"textarea":"input");
  field.name=key;field.maxLength=max;if(multiline)field.rows=key==="introduction"?6:4;
  fields[key]=field;label.append(field);form.append(label);
 }
 const saveEditorial=el("button","btn primary","Guardar ficha y capítulos"),editorialStatus=el("p","editorial-status","Los cambios se guardan únicamente al pulsar el botón.");
 saveEditorial.type="submit";saveEditorial.disabled=true;form.append(saveEditorial,editorialStatus);editorial.append(form);
 const outline=el("section","chapter-planner glass");
 root.append(controls,editorial,outline,preview,printDoc);
 let detail,entries,course,metadata=null,layout={};
 function editorialValues(){return Object.fromEntries(Object.entries(fields).map(([key,field])=>[key,field.value.trim()]))}
 form.addEventListener("submit",async event=>{
  event.preventDefault();if(!course)return;saveEditorial.disabled=true;editorialStatus.textContent="Guardando tu ficha privada…";
  try{
   const values={...editorialValues(),chapter_layout:layout,updated_at:new Date().toISOString()};
   const result=metadata?await patch("ggp_academy_manuscripts",metadata.id,values):await add("ggp_academy_manuscripts",{...values,course_id:course.id,student_id:ctx.user.id});
   metadata=result?.[0]||metadata;editorialStatus.textContent="✓ Ficha editorial guardada.";note("Ficha editorial guardada.","success");paint();
  }catch(error){editorialStatus.textContent="No se guardaron los cambios: "+error.message;note(error.message,"error")}
  finally{saveEditorial.disabled=false}
 });
 function paint(){
  preview.replaceChildren();printDoc.replaceChildren();outline.replaceChildren();
  const byLesson=new Map(entries.map(entry=>[entry.lesson_id,entry]));
  const available=detail.lessons.filter(lesson=>{const entry=byLesson.get(lesson.id);return entry?.response?.trim()&&(entry.status==="completed"||check.checked)});
  const availableIds=new Set(available.map(lesson=>lesson.id));
  const selected=detail.modules.flatMap(group=>(layout[group.id]||[]).filter(id=>availableIds.has(id)).map(id=>available.find(lesson=>lesson.id===id)).filter(Boolean));
  outline.append(el("span","kicker","ORGANIZACIÓN EDITORIAL"),el("h2","","Selecciona y ordena tus escritos"),el("p","","Elige qué actividades formarán parte del libro. Puedes moverlas dentro de su módulo. Guarda la ficha editorial para conservar los cambios."));
  for(const group of detail.modules){
   const options=available.filter(lesson=>lesson.module_id===group.id);
   if(!options.length)continue;
   const section=el("div","chapter-planner-group"),selectedIds=layout[group.id]||[];
   section.append(el("h3","",group.title));
   const ordered=[...selectedIds.filter(id=>options.some(lesson=>lesson.id===id)),...options.map(lesson=>lesson.id).filter(id=>!selectedIds.includes(id))];
   for(const id of ordered){
    const lesson=options.find(item=>item.id===id),included=selectedIds.includes(id),row=el("div","chapter-planner-row"),label=el("label"),toggle=el("input"),buttons=el("div","chapter-planner-buttons");
    toggle.type="checkbox";toggle.checked=included;label.append(toggle,el("span","",lesson.title));
    toggle.addEventListener("change",()=>{
     layout[group.id]=toggle.checked?[...selectedIds,id]:selectedIds.filter(item=>item!==id);
     editorialStatus.textContent="Cambios de capítulos sin guardar.";paint();
    });
    for(const [symbol,delta] of [["↑",-1],["↓",1]]){
     const move=el("button","btn small",symbol);move.type="button";move.title=delta<0?"Subir escrito":"Bajar escrito";
     const pos=selectedIds.indexOf(id);move.disabled=!included||pos+delta<0||pos+delta>=selectedIds.length;
     move.addEventListener("click",()=>{
      const order=[...selectedIds],index=order.indexOf(id);if(index<0||index+delta<0||index+delta>=order.length)return;
      [order[index],order[index+delta]]=[order[index+delta],order[index]];layout[group.id]=order;
      editorialStatus.textContent="Cambios de capítulos sin guardar.";paint();
     });buttons.append(move);
    }
    row.append(label,buttons);section.append(row);
   }
   outline.append(section);
  }
  print.disabled=!selected.length;
  preview.append(el("h2","",selected.length+" escritos seleccionados"));
  if(!selected.length){preview.append(empty("Aún no hay escritos para reunir",check.checked?"Guarda respuestas en tus lecciones para verlas aquí.":"Termina una actividad de tu cuaderno o activa la opción para incluir borradores."));return}
  const info=editorialValues(),bookTitle=info.title||course.title;
  const cover=el("section","manuscript-cover");
  cover.append(el("p","kicker","ACADEMIA NICTÉ HA · MI LIBRO DE LEGADO"),el("h1","",bookTitle));
  if(info.subtitle)cover.append(el("h2","",info.subtitle));
  cover.append(el("p","manuscript-author",info.author_name||ctx.name),el("p","","Documento personal de trabajo · No es una edición final."));
  printDoc.append(cover);
  if(info.dedication){const dedication=el("section","manuscript-frontmatter");dedication.append(el("h2","","Dedicatoria"),el("p","manuscript-response",info.dedication));printDoc.append(dedication)}
  if(info.introduction){const introduction=el("section","manuscript-frontmatter");introduction.append(el("h2","","Introducción"),el("p","manuscript-response",info.introduction));printDoc.append(introduction)}
  const index=el("section","manuscript-index");index.append(el("h2","","Índice provisional"));
  for(const chapterGroup of detail.modules){const lessons=selected.filter(l=>l.module_id===chapterGroup.id);if(lessons.length){index.append(el("h3","",chapterGroup.title));for(const lesson of lessons)index.append(el("p","",lesson.title))}}
  printDoc.append(index);
  for(const chapterGroup of detail.modules){
   const lessons=selected.filter(l=>l.module_id===chapterGroup.id);if(!lessons.length)continue;
   const group=el("section","review-module"),printedGroup=el("section","manuscript-module");
   group.append(el("h3","",chapterGroup.title));printedGroup.append(el("h2","",chapterGroup.title));
   for(const lesson of lessons){
    const entry=byLesson.get(lesson.id),item=el("article","review-writing"),printed=el("article","manuscript-writing");
    item.append(el("h4","",lesson.title),pill(entry.status==="completed"?"Actividad terminada":"Borrador",entry.status==="completed"?"active":""),el("p","review-response",entry.response),a("Editar en lección →",lessonLink(course.id,lesson.id),"text-link"));
    printed.append(el("h3","",lesson.title),el("p","manuscript-response",entry.response));
    group.append(item);printedGroup.append(printed);
   }
   preview.append(group);printDoc.append(printedGroup);
  }
 }
 async function load(){
  course=courses.find(c=>c.id===courseSelect.value);
  preview.replaceChildren(el("p","","Cargando tus actividades privadas…"));print.disabled=true;
  try{
   const [courseDetailResult,entryRows,manuscriptRows]=await Promise.all([
    courseDetail(course.id),
    get("ggp_academy_workbook_entries","lesson_id,response,status,updated_at",{course_id:"eq."+course.id,student_id:"eq."+ctx.user.id,limit:"1000"}),
    get("ggp_academy_manuscripts","*",{course_id:"eq."+course.id,student_id:"eq."+ctx.user.id,limit:"1"})
   ]);
   detail=courseDetailResult;entries=entryRows;metadata=manuscriptRows[0]||null;
   const saved=metadata?.chapter_layout;
   if(saved&&Object.keys(saved).length){layout=Object.fromEntries(Object.entries(saved).filter(([,ids])=>Array.isArray(ids)).map(([id,ids])=>[id,ids.filter(value=>typeof value==="string")]))}
   else{const savedIds=new Set(entries.filter(entry=>entry.response?.trim()).map(entry=>entry.lesson_id));layout=Object.fromEntries(detail.modules.map(group=>[group.id,detail.lessons.filter(lesson=>lesson.module_id===group.id&&savedIds.has(lesson.id)).map(lesson=>lesson.id)]))}
   for(const [key,field] of Object.entries(fields))field.value=metadata?.[key]||"";
   saveEditorial.disabled=false;editorialStatus.textContent=metadata?"Ficha recuperada. Guarda tus cambios antes de imprimir.":"Completa la ficha y pulsa Guardar ficha editorial.";
   paint();
  }catch(error){preview.replaceChildren(empty("No se pudo consultar el cuaderno",error.message));note(error.message,"error")}
 }
 courseSelect.addEventListener("change",load);check.addEventListener("change",()=>{if(detail&&entries)paint()});await load();
}
function externalConsult(){
 const link=a("Consultar información ↗",WHATSAPP,"btn primary");link.target="_blank";link.rel="noopener noreferrer";return link;
}
async function books(){
 title("Mis libros","Tu biblioteca digital: títulos que puedes explorar y lecturas autorizadas.");
 const list=store.books.filter(x=>x.status==="published"),mine=list.filter(b=>hasBook(ctx,store,b));
 root.append(metrics([
  ["Libros disponibles",list.length,"Títulos en el catálogo","▤"],
  ["Mi biblioteca",mine.length,"Con acceso autorizado","✓"],
  ["Por descubrir",list.length-mine.length,"Libros no asignados","✧"],
  ["Lecturas terminadas","—","Seguimiento pendiente","◉"],
 ]));
 if(!list.length){
  block("Mi biblioteca",empty("Tu biblioteca está en preparación","Los libros de Guadalupe aparecerán aquí cuando se publiquen y se asignen los accesos correspondientes."));
  return;
 }
 const grid=el("div","media-row");
 for(const b of list){
  const mineBook=hasBook(ctx,store,b),article=el("article","media-card glass"),cover=el("div","book-cover");
  cover.append(el("span","book-title",b.title));
  const copy=el("div","media-copy");
  copy.append(el("span","kicker",b.author||"Guadalupe Gómez Pezuela"),
    el("strong","",b.title),el("p","",b.description));
  const line=el("div","media-actions");
  if(mineBook&&b.media_path){
   const open=el("button","","Abrir libro ↗");open.addEventListener("click",async()=>{
    open.disabled=true;try{const url=await secureMedia(b.media_path);const anchor=a("","");anchor.href=url;anchor.target="_blank";anchor.rel="noopener noreferrer";document.body.append(anchor);anchor.click();anchor.remove()}
    catch(err){note(err.message,"error")}finally{open.disabled=false}
   });
   line.append(pill("En mi biblioteca","active"),open);
  }else if(mineBook)line.append(pill("Asignado, archivo pendiente","active"));
  else line.append(pill("Sin acceso","locked"),externalConsult());
  copy.append(line);article.append(cover,copy);grid.append(article);
 }
 block("Colección de libros",grid);
}
async function community(){
 title("Mi comunidad","Un lugar para compartir reflexiones y participar en nuevas conversaciones.");
 if(!ctx.isAdmin&&!hasCommunity(ctx,store)){
  block("Espacio para miembros",empty("Aún no tienes acceso a la comunidad","La membresía se gestiona por separado de tus cursos. Consulta la invitación con Guadalupe.",externalConsult()));
  return;
 }
 if(ctx.isAdmin){
  const panel=el("div","panel glass"),form=el("form","form-panel");
  form.append(el("h3","","Nueva publicación"));
  const titleField=label("Título","title"),bodyField=label("Comparte un mensaje","body",true);
  form.append(titleField,bodyField);
  const submit=el("button","btn primary","Publicar en comunidad");
  form.append(submit);
  form.addEventListener("submit",async e=>{
   e.preventDefault();submit.disabled=true;
   try{
    const d=new FormData(form);
    await add("ggp_academy_community_posts",{author_id:ctx.user.id,title:String(d.get("title")).trim(),body:String(d.get("body")).trim(),is_published:true});
    form.reset();note("Publicación creada.","success");await communityList();
   }catch(err){note(err.message,"error")}finally{submit.disabled=false}
  });
  panel.append(form);root.append(panel);
 }
 const wall=el("div");wall.id="communityWall";root.append(wall);
 await communityList();
}
function label(text,name,multiline=false){
 const holder=el("label","",text);
 const input=el(multiline?"textarea":"input");input.name=name;input.required=true;
 if(multiline)input.maxLength=5000;else input.maxLength=160;
 holder.append(input);return holder;
}
async function communityList(){
 const wall=document.getElementById("communityWall");if(!wall)return;
 wall.replaceChildren();
 try{
  const posts=await get("ggp_academy_community_posts","id,title,body,author_id,created_at,is_published",
   {is_published:"eq.true",order:"created_at.desc",limit:"30"});
  if(!posts.length){wall.append(empty("Comunidad recién creada","Los mensajes aparecerán aquí cuando Guadalupe publique el primero."));return}
  for(const post of posts){
   const box=el("article","community-post glass");
   box.append(el("div","community-meta","ACADEMIA NICTÉ HA · "+shortDate(post.created_at)),
    el("h3","",post.title),el("p","community-body",post.body));
   const replies=await get("ggp_academy_community_replies","id,body,created_at,author_id",
    {post_id:"eq."+post.id,order:"created_at.asc",limit:"50"});
   for(const reply of replies)box.append(el("div","reply",reply.body));
   const form=el("form","form-grid"),fld=label("Responder a esta publicación","body",true);fld.querySelector("textarea").maxLength=2000;
   const submit=el("button","btn","Enviar respuesta");form.append(fld,submit);
   form.addEventListener("submit",async e=>{
    e.preventDefault();submit.disabled=true;
    try{await add("ggp_academy_community_replies",{post_id:post.id,author_id:ctx.user.id,body:String(new FormData(form).get("body")).trim()});
     note("Respuesta enviada.","success");await communityList();
    }catch(err){note(err.message,"error")}finally{submit.disabled=false}
   });
   box.append(form);wall.append(box);
  }
 }catch(err){wall.append(empty("No fue posible cargar la comunidad",err.message))}
}
function progress(){
 title("Mi progreso","Conoce tus lecciones completadas y sigue tu avance por programa.");
 const mine=ownedCourses();
 if(!mine.length){root.append(empty("Tu avance aparecerá aquí","Cuando tengas una matrícula activa podrás consultar tu progreso en cada curso.",a("Explorar programas →","./cursos.html","btn primary")));return}
 const grid=el("div","report-grid");
 for(const c of mine){
  const p=learnerProgress(c),box=el("div","report-course glass"),head=el("div","section-title");
  head.append(el("h3","",c.title),pill(p.pct+"%","active"));box.append(head);
  box.append(el("p","",p.done+" de "+p.all+" lecciones completadas"));
  const track=el("div","progress-track"),fill=el("div","progress-fill");fill.style.width=p.pct+"%";track.append(fill);box.append(track);
  box.append(a("Seguir aprendiendo →","./leccion.html?course="+encodeURIComponent(c.id),"btn small"));
  grid.append(box);
 }
 root.append(grid);
}
async function lesson(){
 const id=new URLSearchParams(location.search).get("course");
 const c=store.courses.find(x=>x.id===id);
 if(!c||!ctx.isAdmin&&!enrolled(ctx,store,c)){
  title("No tienes acceso a este curso","Solicita una matrícula válida para consultar sus lecciones.");
  root.append(empty("Curso protegido","Puedes revisar tus programas asignados desde Mis cursos.",a("Mis cursos →","./mi-curso.html","btn")));return;
 }
 title(c.title,c.summary,a("Revisar mi libro →","./cuaderno.html","btn"));
 const d=await courseDetail(c.id);
 if(!d.lessons.length){root.append(empty("Curso en preparación","Todavía no hay lecciones para consultar."));return}
 const qs=new URLSearchParams(location.search),lessonId=qs.get("lesson");
 const current=d.lessons.find(l=>l.id===lessonId)||d.lessons[0];
 const canUseWorkbook=!ctx.isAdmin||enrolled(ctx,store,c);
 let workbookEntries=[];
 if(canUseWorkbook){
  try{workbookEntries=await get("ggp_academy_workbook_entries","id,lesson_id,response,status,updated_at",{course_id:"eq."+c.id,student_id:"eq."+ctx.user.id,limit:"1000"})}
  catch(e){note("No fue posible consultar el seguimiento: "+e.message,"error")}
 }
 const entryFor=lessonId=>workbookEntries.find(x=>x.lesson_id===lessonId);
 const tracking=el("section","academic-tracking glass");
 function paintTracking(){
  if(!canUseWorkbook)return;
  tracking.replaceChildren();
  const completeCount=d.lessons.filter(l=>entryFor(l.id)?.status==="completed").length;
  const draftCount=d.lessons.filter(l=>entryFor(l.id)?.status==="draft").length;
  const pendingCount=d.lessons.length-completeCount-draftCount;
  const heading=el("div","academic-tracking-head");
  heading.append(el("div","", ""),el("p","","Tus actividades se guardan de forma privada. Este avance corresponde al cuaderno, no a la reproducción de videos."));
  heading.firstChild.append(el("span","kicker","SEGUIMIENTO ACADÉMICO"),el("h2","","Mi avance en el programa"));
  const metrics=el("div","academic-tracking-metrics");
  for(const [value,label] of [[completeCount,"Terminadas"],[draftCount,"En borrador"],[pendingCount,"Pendientes"]]){
   const metric=el("div","academic-tracking-metric");metric.append(el("strong","",value),el("span","",label));metrics.append(metric);
  }
  const modules=el("div","academic-tracking-modules");
  for(const m of d.modules){
   const lessons=d.lessons.filter(l=>l.module_id===m.id);
   if(!lessons.length)continue;
   const doneCount=lessons.filter(l=>entryFor(l.id)?.status==="completed").length;
   const wrap=el("div","academic-tracking-module"),top=el("div","academic-tracking-module-title");
   top.append(el("strong","",m.title),el("span","",doneCount+" de "+lessons.length+" terminadas"));
   const bar=el("div","progress-track"),fill=el("div","progress-fill");fill.style.width=Math.round(doneCount/lessons.length*100)+"%";bar.append(fill);
   const next=lessons.find(l=>entryFor(l.id)?.status!=="completed");
   wrap.append(top,bar);
   if(next)wrap.append(a("Continuar actividad →","./leccion.html?course="+encodeURIComponent(c.id)+"&lesson="+encodeURIComponent(next.id),"academic-tracking-link"));
   modules.append(wrap);
  }
  tracking.append(heading,metrics,modules);
 }
 if(canUseWorkbook){paintTracking();root.append(tracking)}
 const columns=el("div","lesson-layout"),sidebar=el("aside","lesson-outline glass"),content=el("section","lesson-content glass");
 sidebar.append(el("h3","","Contenido del programa"));
 for(const m of d.modules){
  sidebar.append(el("div","kicker",m.title));
  for(const l of d.lessons.filter(l=>l.module_id===m.id)){
   const entry=entryFor(l.id);
   const mark=entry?.status==="completed"?" ✓":entry?.status==="draft"?" · Borrador":"";
   const b=el("button",(l.id===current.id?"active":""),l.title+mark);
   b.addEventListener("click",()=>{location.href="./leccion.html?course="+encodeURIComponent(c.id)+"&lesson="+encodeURIComponent(l.id)});
   sidebar.append(b);
  }
 }
 content.append(el("span","kicker","TU LECCIÓN"),el("h2","",current.title),el("p","lesson-body",current.content||"Contenido en preparación."));
 if(current.media_path){
  const open=el("button","btn","Abrir material privado ↗");
  open.addEventListener("click",async()=>{
   open.disabled=true;try{
    const url=await secureMedia(current.media_path);
    const link=a("","");link.href=url;link.rel="noopener noreferrer";link.target="_blank";
    document.body.append(link);link.click();link.remove();
   }catch(e){note(e.message,"error")}finally{open.disabled=false}
  });
  content.append(open);
 }
 const done=store.progress.some(p=>p.lesson_id===current.id&&p.student_id===ctx.user.id);
 if(canUseWorkbook){
  const workbook=el("section","workbook-panel"),header=el("div","workbook-heading"),field=el("textarea","workbook-answer"),status=el("p","workbook-status","Cargando tu cuaderno privado…"),controls=el("div","workbook-actions");
  header.append(el("span","kicker","CUADERNO DIGITAL DE LEGADO"),el("h3","","Mi reflexión y actividad"),el("p","","Escribe aquí tus respuestas o ideas. Solo tú puedes consultar este cuaderno; guárdalo para retomarlo cuando quieras."));
  const practical=lessonSection(current.content,"ACTIVIDAD PRÁCTICA"),reflection=lessonSection(current.content,"PARA REFLEXIONAR"),result=lessonSection(current.content,"RESULTADO QUE CONSERVARÁS");
  if(practical||reflection||result){
   const guide=el("div","workbook-guide");guide.append(el("h4","","Guía para desarrollar esta actividad"));
   for(const [heading,copy] of [["1. Actividad",practical],["2. Reflexiona",reflection],["3. Resultado esperado",result]]){
    if(copy){const item=el("div","workbook-guide-item");item.append(el("strong","",heading),el("p","",copy));guide.append(item)}
   }
   if(c.slug==="la-mujer-del-faro")guide.append(el("p","workbook-guide-note","Guía orientativa pendiente de validación con el manual definitivo del programa."));
   const template=el("button","btn","Preparar respuestas en mi cuaderno");template.type="button";template.disabled=true;
   template.addEventListener("click",()=>{
    if(field.value.trim()){note("Tu cuaderno ya contiene texto. Para proteger tus respuestas, la plantilla solo se inserta cuando está vacío.","info");return}
    const sections=[["ACTIVIDAD",practical],["REFLEXIÓN",reflection],["RESULTADO",result]].filter(x=>x[1]);
    field.value=sections.map(([heading,prompt])=>heading+"\n"+prompt+"\n\nMi respuesta:\n").join("\n\n");
    field.dispatchEvent(new Event("input",{bubbles:true}));field.focus();
   });
   guide.append(template);
   header.append(guide);
  }
  field.placeholder="¿Qué descubriste en esta lección? ¿Qué deseas escribir o conservar?";
  field.rows=9;field.maxLength=20000;field.disabled=true;
  const save=el("button","btn primary","Guardar borrador"),complete=el("button","btn","Guardar actividad terminada");
  save.type="button";complete.type="button";save.disabled=true;complete.disabled=true;
  let entry=null,loaded=false,dirty=false;
  field.addEventListener("input",()=>{dirty=true;status.textContent="Cambios sin guardar · "+field.value.length+"/20000 caracteres"});
  const buttonsDisabled=value=>{save.disabled=value;complete.disabled=value;field.disabled=value};
  async function saveWorkbook(nextStatus){
   if(!loaded)return;
   buttonsDisabled(true);status.textContent="Guardando en tu cuaderno privado…";
   try{
    const record={response:field.value,status:nextStatus,updated_at:new Date().toISOString()};
    const rows=entry?await patch("ggp_academy_workbook_entries",entry.id,record):await add("ggp_academy_workbook_entries",{...record,course_id:c.id,lesson_id:current.id,student_id:ctx.user.id});
    entry=rows?.[0]||entry;dirty=false;
    if(entry){workbookEntries=workbookEntries.filter(x=>x.lesson_id!==current.id).concat([{...entry,lesson_id:current.id,status:nextStatus}]);paintTracking()}
    status.textContent=nextStatus==="completed"?"✓ Actividad guardada como terminada":"✓ Borrador guardado. Puedes volver después y continuar.";
    note("Tu cuaderno se guardó correctamente.","success");
   }catch(e){status.textContent="No se guardaron los cambios. Inténtalo nuevamente.";note(e.message,"error")}
   finally{buttonsDisabled(false)}
  }
  save.addEventListener("click",()=>saveWorkbook("draft"));
  complete.addEventListener("click",()=>saveWorkbook("completed"));
  controls.append(save,complete);workbook.append(header,field,status,controls);content.append(workbook);
  try{
   entry=entryFor(current.id)||null;field.value=entry?.response||"";loaded=true;
   const template=workbook.querySelector(".workbook-guide button");if(template)template.disabled=false;
   status.textContent=entry?"Último guardado: "+shortDate(entry.updated_at)+(entry.status==="completed"?" · Actividad terminada":" · Borrador"):"Tu cuaderno está listo. Aún no has guardado una respuesta.";
   buttonsDisabled(false);
  }catch(e){status.textContent="El cuaderno aún no está disponible. Tus respuestas no se guardarán hasta que se habilite.";note(e.message,"error")}
  window.addEventListener("beforeunload",event=>{if(dirty){event.preventDefault();event.returnValue=""}});
  if(!ctx.isAdmin){
  const finish=el("button",done?"btn":"btn primary",done?"✓ Lección completada":"Marcar como completada");
  finish.disabled=done;finish.style.marginTop="22px";
  finish.addEventListener("click",async()=>{
   finish.disabled=true;
   try{
    await add("ggp_academy_progress",{course_id:c.id,lesson_id:current.id,student_id:ctx.user.id});
    note("Lección completada.","success");finish.textContent="✓ Lección completada";finish.className="btn";
   }catch(e){note(e.message,"error");finish.disabled=false}
  });
  content.append(finish);
  }
 }
 columns.append(sidebar,content);root.append(columns);
}
function profile(){
 title("Mi perfil","Gestiona tu información y la seguridad de tu cuenta.");
 const box=el("section","panel glass");
 box.append(el("span","kicker","CUENTA DE ALUMNO"),el("h2","",ctx.name),
   el("p","",ctx.user.email),pill(ctx.isAdmin?"Administrador académico":"Alumno","active"));
 const more=el("div","list-rows");more.style.marginTop="23px";
 const form=el("form","form-grid"),password=el("input");
 password.type="password";password.name="password";password.minLength=10;password.required=true;password.autocomplete="new-password";
 const wrapper=el("label","","Nueva contraseña (mínimo 10 caracteres)");wrapper.append(password);
 const submit=el("button","btn primary","Actualizar contraseña");
 form.append(wrapper,submit);
 form.addEventListener("submit",async e=>{
  e.preventDefault();submit.disabled=true;
  try{
   await updatePassword(password.value);
   password.value="";note("Tu contraseña se actualizó correctamente.","success");
  }catch(error){note(error.message,"error")}finally{submit.disabled=false}
 });
 const logout=el("button","btn","Cerrar sesión");
 logout.addEventListener("click",async()=>{await logOut();location.replace("./")});
 more.append(form,logout);box.append(more);
 root.append(box);
 const info=el("section","notice","Tus datos académicos son independientes de ETERNI. Un registro nuevo no da acceso automático a cursos, libros ni comunidad.");
 root.append(info);
}

async function uploadBook(book,file){
 if(!ctx.isAdmin)throw Error("Solo un administrador puede subir libros.");
 if(!file||file.type!=="application/pdf")throw Error("Selecciona un archivo PDF válido.");
 if(file.size>80*1024*1024)throw Error("El PDF supera el tamaño máximo permitido de 80 MB.");
 const filename=crypto.randomUUID()+".pdf",path=book.id+"/"+book.id+"/"+filename;
 const encoded=path.split("/").map(encodeURIComponent).join("/");
 const res=await fetch(API_URL+"/storage/v1/object/ggp-academy-private/"+encoded,{
  method:"POST",headers:{apikey:PUBLISHABLE_KEY,Authorization:"Bearer "+await accessToken(),
   "Content-Type":"application/pdf","x-upsert":"false"},body:file,cache:"no-store"
 });
 const response=await res.json().catch(()=>({}));
 if(!res.ok)throw Error(response.message||response.error||"No se pudo almacenar el libro.");
 await patch("ggp_academy_books",book.id,{media_path:path});
}

async function admin(){
 if(!ctx.isAdmin){location.replace("./inicio.html");return}
 title("Administración de academia","Gestiona la formación, los alumnos, los libros y tu comunidad.");
 const access=el("div","split"),c=el("section","panel glass"),d=el("section","panel glass");
 c.append(el("span","kicker","EDITOR ACADÉMICO"),el("h2","","Cursos y matrículas"),
  el("p","","Crea cursos, organiza módulos y lecciones, sube materiales privados y asigna alumnos."),
  a("Abrir editor de cursos →","./aula.html","btn primary"));
 d.append(el("span","kicker","CONTENIDO Y COMUNIDAD"),el("h2","","Libros y publicaciones"),
  el("p","","Agrega libros a tu catálogo y comparte mensajes con tu comunidad desde este panel."));
 access.append(c,d);root.append(access);
 const legacyNotice=el("section","panel glass");
 legacyNotice.append(el("span","kicker","INTEGRACIÓN DE CONTENIDO ORIGINAL"),el("h2","","Colecciones históricas de Guadalupe"),el("p","","Legado, La Mujer del Faro, libros, audiolibros e IXCHEL siguen registrados en el proyecto académico original. Esta administración todavía usa el catálogo nuevo; no vuelvas a crear estos materiales para evitar duplicados. La conexión segura y la verificación de permisos están pendientes."));
 root.append(legacyNotice);
 const books=el("section","panel glass"),form=el("form","form-grid");
 form.append(el("h3","","Añadir libro al catálogo"));
 form.append(label("Título","title"),label("Descripción","description",true));
 const author=label("Autor","author");author.querySelector("input").value="Guadalupe Gómez Pezuela";form.append(author);
 const save=el("button","btn primary","Crear libro como borrador");
 form.append(save);
 form.addEventListener("submit",async e=>{
  e.preventDefault();save.disabled=true;
  try{const d=new FormData(form);await add("ggp_academy_books",{
   title:String(d.get("title")).trim(),description:String(d.get("description")).trim(),author:String(d.get("author")).trim(),status:"draft"
  });form.reset();note("Libro creado como borrador. Podrás agregar el archivo antes de publicarlo.","success")}
  catch(err){note(err.message,"error")}finally{save.disabled=false}
 });
 books.append(form);
 const help=el("p","muted","La publicación de archivos y la entrega de libros requiere autorización. Los libros en borrador no aparecen a los alumnos.");
 books.append(help);
 for(const book of store.books){
  const line=el("div","list-row"),description=el("div");
  description.append(el("strong","",book.title),el("small","",book.status==="published"?" · Publicado":" · Borrador"));
  line.append(description);
  const actions=el("div","hero-actions");
  const input=el("input");input.type="file";input.accept=".pdf,application/pdf";input.style.maxWidth="170px";
  const upload=el("button","btn small","Subir PDF");
  upload.addEventListener("click",async()=>{
   upload.disabled=true;
   try{await uploadBook(book,input.files?.[0]);note("Libro guardado en espacio privado.","success");await refresh()}
   catch(e){note(e.message,"error")}finally{upload.disabled=false}
  });
  actions.append(input,upload);
  const publish=el("button","btn small",book.status==="published"?"Ocultar libro":"Publicar libro");
  publish.addEventListener("click",async()=>{
   if(book.status!=="published"&&!book.media_path){note("Antes de publicar agrega su archivo PDF.","error");return}
   publish.disabled=true;
   try{await patch("ggp_academy_books",book.id,{status:book.status==="published"?"draft":"published"});await refresh();note("Estado del libro actualizado.","success")}
   catch(e){note(e.message,"error")}finally{publish.disabled=false}
  });
  actions.append(publish);line.append(actions);books.append(line);
 }
 root.append(books);
 const students=await get("ggp_academy_students","user_id,display_name,email",{order:"created_at.desc",limit:"200"});
 if(students.length){
  const rights=el("section","panel glass"),options=el("form","form-grid");
  rights.append(el("h3","","Asignar accesos"));
  const person=el("select");person.name="student";
  for(const st of students){const opt=el("option","",st.display_name+" · "+st.email);opt.value=st.user_id;person.append(opt)}
  const who=el("label","","Alumno");who.append(person);options.append(who);
  if(store.books.length){
   const bookSelect=el("select");bookSelect.name="book";
   for(const b of store.books){const opt=el("option","",b.title);opt.value=b.id;bookSelect.append(opt)}
   const bookLabel=el("label","","Libro");bookLabel.append(bookSelect);options.append(bookLabel);
   const grant=el("button","btn","Asignar libro");
   grant.type="submit";grant.dataset.type="book";options.append(grant);
  }
  const community=el("button","btn primary","Activar comunidad para alumno");community.type="button";
  community.addEventListener("click",async()=>{
   community.disabled=true;
   try{
    const student=person.value;
    const old=store.memberships.find(m=>m.user_id===student);
    if(old)await patch("ggp_academy_community_members",old.id,{status:"active"});
    else await add("ggp_academy_community_members",{user_id:student,status:"active"});
    note("Membresía de comunidad activada.","success");await refresh();
   }catch(e){note(e.message,"error")}finally{community.disabled=false}
  });
  options.addEventListener("submit",async e=>{
   e.preventDefault();const btn=e.submitter;btn.disabled=true;
   try{
    const d=new FormData(options);
    const existing=store.bookGrants.find(g=>g.book_id===String(d.get("book"))&&g.student_id===String(d.get("student")));
    if(existing){note("Ese alumno ya tiene el libro asignado.","error");return}
    await add("ggp_academy_book_grants",{book_id:String(d.get("book")),student_id:String(d.get("student"))});
    note("Acceso al libro asignado.","success");await refresh();
   }catch(e){note(e.message,"error")}finally{btn.disabled=false}
  });
  options.append(community);rights.append(options);root.append(rights);
 }
 const communityBox=el("section","panel glass");
 communityBox.append(el("h3","","Comunidad"));
 communityBox.append(a("Crear publicaciones y responder →","./comunidad.html","btn"));
 root.append(communityBox);
}
async function refresh(){store=await loadData(ctx);root.replaceChildren();const warning=el("p","message");warning.id="notice";warning.setAttribute("role","status");root.append(warning);await admin();}
async function start(){
 try{
  await captureLink();
  if(!hasSession()){location.replace("./");return}
  await accessToken();ctx=await identity();store=await loadData(ctx);
  if(page==="administracion"&&!ctx.isAdmin){location.replace("./inicio.html");return}
  if(["inicio","cursos","progreso","mi-curso"].includes(page))await loadLessonCounts();
  if(["inicio","mi-curso"].includes(page))await loadStudyResume();
  document.getElementById("topGreeting").textContent="Hola, "+ctx.name;
  document.getElementById("initialAvatar").textContent=ctx.name[0]?.toUpperCase()||"G";
  if(ctx.isAdmin){
   document.getElementById("staffSection").hidden=false;document.getElementById("staffNav").hidden=false;
   document.querySelectorAll("[data-admin-only]").forEach(link=>{link.hidden=false});
  }
  root.replaceChildren();
  const warning=el("p","message");warning.id="notice";warning.setAttribute("role","status");root.append(warning);
  const handlers={"inicio":home,"cursos":courses,"mi-curso":myCourses,"cuaderno":workbookReview,"libros":books,
   "comunidad":community,"progreso":progress,"perfil":profile,"administracion":admin,"leccion":lesson};
  await (handlers[page]||home)();
  document.getElementById("loading").hidden=true;document.getElementById("privatePortal").hidden=false;
  const exit=document.getElementById("logoutSide");
  if(exit)exit.addEventListener("click",async()=>{await logOut();location.replace("./")});
 }catch(err){
  document.getElementById("loading").textContent="No se pudo abrir la academia: "+err.message+". Regresa al acceso para iniciar sesión.";
  const go=a("Volver al acceso","./","btn");go.style.marginLeft="15px";document.getElementById("loading").append(go);
 }
}
start();
