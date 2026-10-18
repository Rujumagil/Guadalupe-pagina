import {
 make as el, note, shortDate, accessToken, hasSession, captureLink, identity, logOut,
 get,add,patch,data as loadData,enrolled,hasBook,hasCommunity,courseDetail,secureMedia
} from "./portal-core.js";
import { WHATSAPP } from "./config.js";

const page=document.body.dataset.page;
let ctx,store;
const root=document.getElementById("main");
function a(text,href,cls="btn"){
 const link=el("a",cls,text);link.href=href;return link;
}
function pill(text,cls=""){return el("span","state-pill "+cls,text);}
function title(name,copy,action){
 const box=el("div","heading"),content=el("div");
 content.append(el("span","kicker","ACADEMIA GUADALUPE"),el("h1","",name),el("p","",copy));
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
function card(c,own=false){
 const box=el("article","media-card glass"),art=el("div","media-art");
 art.append(pill(c.category||"Aprendizaje"));
 const body=el("div","media-copy");
 body.append(el("strong","",c.title),el("p","",c.summary||"Un programa de aprendizaje y desarrollo."));
 const actions=el("div","media-actions");
 if(own){
  const p=learnerProgress(c);
  actions.append(pill(p.all?p.pct+"% completado":"Por comenzar","active"),a("Continuar →","./leccion.html?course="+encodeURIComponent(c.id),""));
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
async function home(){
 const mine=ownedCourses(),published=visibleCourses();
 const completed=store.progress.filter(p=>p.student_id===ctx.user.id).length;
 const total=mine.reduce((n,c)=>n+(store.lessonCounts?.[c.id]?.length||0),0);
 const pct=total?Math.round(100*completed/total):0;
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
 block("Continuar aprendiendo",mine.length?mediaGrid(mine.slice(0,3)):
  empty("Tu camino comienza aquí","Todavía no tienes cursos asignados. Puedes revisar el catálogo y consultar cómo inscribirte.",a("Explorar catálogo →","./cursos.html","btn primary")),
  "./mi-curso.html","Ver mis cursos →");
 const recommended=published.filter(c=>!enrolled(ctx,store,c)).slice(0,3);
 block("Descubre otros programas",recommended.length?mediaGrid(recommended):
  empty("Nuevas experiencias en preparación","Por ahora no hay otros programas publicados para explorar."),
  "./cursos.html","Explorar catálogo →");
 const panels=el("div","split"),b=el("div","panel glass"),community=el("div","panel glass");
 b.append(el("span","kicker","MI BIBLIOTECA"),el("h2","","Historias para acompañar tu proceso"),
  el("p","","Accede a los libros digitales que Guadalupe te haya asignado."),
  a("Ir a mis libros →","./libros.html","btn"));
 community.append(el("span","kicker","MI COMUNIDAD"),el("h2","","Crecer también es compartir"),
  el("p","","Un espacio para reflexionar, conversar y conectar con otros participantes."),
  a("Entrar a la comunidad →","./comunidad.html","btn"));
 panels.append(b,community);root.append(panels);
}
function courses(){
 title("Explora tus próximos cursos","Programas publicados, contenido disponible y acceso según tu matrícula.");
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
   box.append(el("div","community-meta","ACADEMIA GUADALUPE · "+shortDate(post.created_at)),
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
 title(c.title,c.summary,a("← Mis cursos","./mi-curso.html","btn"));
 const d=await courseDetail(c.id);
 if(!d.lessons.length){root.append(empty("Curso en preparación","Todavía no hay lecciones para consultar."));return}
 const qs=new URLSearchParams(location.search),lessonId=qs.get("lesson");
 const current=d.lessons.find(l=>l.id===lessonId)||d.lessons[0];
 const columns=el("div","lesson-layout"),sidebar=el("aside","lesson-outline glass"),content=el("section","lesson-content glass");
 sidebar.append(el("h3","","Contenido del programa"));
 for(const m of d.modules){
  sidebar.append(el("div","kicker",m.title));
  for(const l of d.lessons.filter(l=>l.module_id===m.id)){
   const b=el("button",(l.id===current.id?"active":""),l.title);
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
 columns.append(sidebar,content);root.append(columns);
}
function profile(){
 title("Mi perfil","Gestiona tu información y la seguridad de tu cuenta.");
 const box=el("section","panel glass");
 box.append(el("span","kicker","CUENTA DE ALUMNO"),el("h2","",ctx.name),
   el("p","",ctx.user.email),pill(ctx.isAdmin?"Administrador académico":"Alumno","active"));
 const more=el("div","list-rows");more.style.marginTop="23px";
 more.append(a("Cambiar contraseña →","./","btn"),a("Cerrar sesión","./","btn"));
 more.lastChild.addEventListener("click",async e=>{e.preventDefault();await logOut();location.replace("./")});
 box.append(more);
 root.append(box);
 const info=el("section","notice","Tus datos académicos son independientes de ETERNI. Un registro nuevo no da acceso automático a cursos, libros ni comunidad.");
 root.append(info);
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
 root.append(books);
 const communityBox=el("section","panel glass");
 communityBox.append(el("h3","","Comunidad"));
 communityBox.append(a("Crear publicaciones y responder →","./comunidad.html","btn"));
 root.append(communityBox);
}
async function start(){
 try{
  await captureLink();
  if(!hasSession()){location.replace("./");return}
  await accessToken();ctx=await identity();store=await loadData(ctx);
  if(page==="administracion"&&!ctx.isAdmin){location.replace("./inicio.html");return}
  if(["inicio","progreso","mi-curso"].includes(page))await loadLessonCounts();
  document.getElementById("topGreeting").textContent="Hola, "+ctx.name;
  document.getElementById("initialAvatar").textContent=ctx.name[0]?.toUpperCase()||"G";
  if(ctx.isAdmin){
   document.getElementById("staffSection").hidden=false;document.getElementById("staffNav").hidden=false;
   document.querySelectorAll("[data-admin-only]").forEach(link=>{link.hidden=false});
  }
  root.replaceChildren();
  const warning=el("p","message");warning.id="notice";warning.setAttribute("role","status");root.append(warning);
  const handlers={"inicio":home,"cursos":courses,"mi-curso":myCourses,"libros":books,
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