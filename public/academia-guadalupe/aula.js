import { API_URL,PUBLISHABLE_KEY,WORKSPACE_ID } from "./config.js";

const $=s=>document.querySelector(s), STORE="ggp_academy_v2";
const state={session:null,user:null,isAdmin:false,screen:"myCourses",chosen:null,lesson:null,mode:"login",
 courses:[],enrollments:[],progress:[],students:[],modules:[],lessons:[]};
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e;}
function button(txt,handler,cls="outline-btn"){const e=node("button",cls,txt);e.type="button";e.addEventListener("click",handler);return e;}
function note(txt,error=false){const e=$("#appNotice");e.textContent=txt;e.className="feedback "+(error?"error":"success");}
function authNote(txt,error=false){const e=$("#authMessage");e.textContent=txt;e.className="feedback "+(error?"error":"success");}
const date=x=>x?new Intl.DateTimeFormat("es-MX",{dateStyle:"medium",timeZone:"America/Mexico_City"}).format(new Date(x)):"Sin fecha";
const qs=(cols,extra={})=>new URLSearchParams({select:cols,workspace_id:"eq."+WORKSPACE_ID,...extra}).toString();
function save(){state.session?sessionStorage.setItem(STORE,JSON.stringify(state.session)):sessionStorage.removeItem(STORE)}
async function request(route,{method="GET",body,auth=false,prefer}={}){
 const headers={apikey:PUBLISHABLE_KEY};
 if(auth)headers.Authorization="Bearer "+await token();
 if(body!==undefined)headers["Content-Type"]="application/json";
 if(prefer)headers.Prefer=prefer;
 const resp=await fetch(API_URL+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:"no-store"});
 const t=await resp.text();let data=null;try{data=t?JSON.parse(t):null}catch{data=t}
 if(!resp.ok)throw Error(data?.message||data?.error_description||data?.msg||data?.error||"No se pudo completar la solicitud.");
 return data;
}
async function token(){
 if(!state.session?.access_token)throw Error("Debes iniciar sesión.");
 if(Number(state.session.expires_at||0)>Date.now()/1000+60)return state.session.access_token;
 if(!state.session.refresh_token)throw Error("La sesión expiró.");
 const data=await request("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:{refresh_token:state.session.refresh_token}});
 state.session=data;save();return data.access_token;
}
const read=(table,cols,extra={})=>request("/rest/v1/"+table+"?"+qs(cols,extra),{auth:true});
const write=(table,method,body,extra={})=>request("/rest/v1/"+table+"?"+qs("*",extra),{method,body,auth:true,prefer:"return=representation"});
async function identity(){
 const user=await request("/auth/v1/user",{auth:true});state.user=user;
 const r=await read("workspace_members","role",{user_id:"eq."+user.id,status:"eq.active",limit:"1"});
 state.isAdmin=r.some(m=>["owner","admin"].includes(m.role));
 const s=await read("ggp_academy_students","user_id",{user_id:"eq."+user.id,limit:"1"});
 if(!s.length){
  const name=String(user.user_metadata?.full_name||user.email.split("@")[0]).slice(0,160);
  await write("ggp_academy_students","POST",{user_id:user.id,workspace_id:WORKSPACE_ID,display_name:name,email:user.email});
 }
}
async function load(){
 const [c,e,p]=await Promise.all([
  read("ggp_academy_courses","id,title,summary,slug,category,level,status,created_at",{order:"created_at.desc",limit:"100"}),
  read("ggp_academy_enrollments","id,course_id,student_id,status,expires_at,enrolled_at",state.isAdmin?{limit:"500"}:{student_id:"eq."+state.user.id,limit:"100"}),
  read("ggp_academy_progress","lesson_id,course_id,student_id,completed_at",state.isAdmin?{limit:"1000"}:{student_id:"eq."+state.user.id,limit:"1000"})
 ]);
 state.courses=c;state.enrollments=e;state.progress=p;
 if(state.isAdmin)state.students=await read("ggp_academy_students","user_id,display_name,email,created_at",{order:"created_at.desc",limit:"300"});
}
const hasCourse=c=>state.enrollments.some(e=>e.course_id===c.id&&e.student_id===state.user.id&&
 ["active","completed"].includes(e.status)&&(!e.expires_at||new Date(e.expires_at)>new Date()));
function mount(){const root=$("#appContent");root.replaceChildren();return root}
function heading(text,copy){const box=node("div","grid-tools"),left=node("div");left.append(node("h2","",text),node("p","small",copy));box.append(left);return box}
function card(course,info,handler,label="Continuar →"){
 const c=node("article","app-card");
 c.append(node("span","eyebrow",course.category),node("h3","",course.title),node("p","",course.summary),node("p","small",info));
 if(handler)c.append(button(label,handler,"primary-btn"));
 return c;
}
function switchTab(tab){if(tab==="admin"&&!state.isAdmin)return;state.chosen=null;state.lesson=null;state.screen=tab;document.querySelectorAll("[data-view]").forEach(el=>el.classList.toggle("selected",el.dataset.view===tab));render()}
function showMine(){
 const root=mount();root.append(heading("Mis cursos","Continúa tu aprendizaje y consulta tu avance."));
 const list=state.courses.filter(hasCourse);
 if(!list.length)root.append(node("div","empty","Aún no tienes cursos asignados. Puedes explorar el catálogo mientras se habilitan tus matrículas."));
 const grid=node("div","app-layout");
 for(const c of list)grid.append(card(c,"Matrícula activa",()=>openCourse(c.id)));
 root.append(grid);
}
function showCatalog(){
 const root=mount();root.append(heading("Catálogo de programas","Conoce las experiencias disponibles de Guadalupe."));
 const items=state.courses.filter(c=>c.status==="published");
 if(!items.length)root.append(node("div","empty","Aún no hay programas publicados. Guadalupe está preparando los primeros cursos."));
 const grid=node("div","app-layout");
 for(const c of items)grid.append(card(c,hasCourse(c)?"Acceso habilitado":"Matrícula requerida",
  hasCourse(c)?()=>openCourse(c.id):()=>note("Consulta con Guadalupe las condiciones de inscripción y solicita tu matrícula.",true),
  hasCourse(c)?"Entrar al curso":"Solicitar acceso"));
 root.append(grid);
}
function field(text,name,initial="",options){
 const label=node("label","",text);
 let e;
 if(options){e=node("select");for(const [key,value] of options){const opt=node("option","",value);opt.value=key;e.append(opt)}}
 else if(name==="content"||name==="summary"){e=node("textarea");e.rows=4}
 else {e=node("input");e.type="text";}
 e.name=name;if(!options)e.value=initial;e.required=true;label.append(e);return label;
}
function form(title,fields,saveFn,txt="Guardar"){
 const box=node("section","app-card"),f=node("form","edit-form"),save=button(txt,()=>{},"primary-btn");save.type="submit";save.replaceWith?.();
 for(const input of fields)f.append(input);
 f.append(save);
 f.addEventListener("submit",async event=>{
  event.preventDefault();save.disabled=true;try{
   await saveFn(new FormData(f));await load();render();note("Cambios guardados correctamente.");
  }catch(error){note(error.message,true)}finally{save.disabled=false}
 });
 box.append(node("h3","",title),f);return box;
}
function admin(){
 const root=mount();root.append(heading("Administración de academia","Programa cursos, alumnos, lecciones y accesos sin afectar ETERNI."));
 const boxes=node("div","app-layout");
 boxes.append(form("Crear programa en borrador",[
  field("Nombre del programa","title"),field("Categoría","category","",[
   ["Desarrollo personal","Desarrollo personal"],["Comunicación y PNL","Comunicación y PNL"],
   ["Liderazgo profesional","Liderazgo profesional"],["Desarrollo empresarial","Desarrollo empresarial"]]),
  field("Descripción","summary")],async d=>{
   const title=String(d.get("title")).trim();
   const slug=title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,85);
   if(slug.length<3)throw Error("Título demasiado corto.");
   await write("ggp_academy_courses","POST",{workspace_id:WORKSPACE_ID,title,slug,category:String(d.get("category")),summary:String(d.get("summary")),status:"draft"});
  },"Crear borrador"));
 const list=node("section","app-card");list.append(node("h3","","Programas"));
 for(const c of state.courses){
  const row=node("div","grid-tools"),description=node("div");
  description.append(node("strong","",c.title),node("p","small",c.status==="draft"?"Borrador":"Publicado"));
  row.append(description,button("Administrar →",()=>openCourse(c.id)));list.append(row);
 }
 boxes.append(list);root.append(boxes);
 const registers=node("div","app-layout"),students=node("section","app-card");
 students.append(node("h3","","Alumnos registrados"),node("p","small",state.students.length+" cuentas activadas en el aula"));
 for(const s of state.students.slice(0,60))students.append(node("p","small",s.display_name+" · "+s.email));
 registers.append(students);
 if(state.students.length&&state.courses.length){
 registers.append(form("Asignar acceso a curso",[
  field("Alumno","student","",state.students.map(s=>[s.user_id,s.display_name+" · "+s.email])),
  field("Programa","course","",state.courses.map(c=>[c.id,c.title]))],async d=>{
    const course_id=String(d.get("course")),student_id=String(d.get("student"));
    const existing=state.enrollments.find(e=>e.course_id===course_id&&e.student_id===student_id);
    if(existing&&existing.status==="active")throw Error("Esta cuenta ya tiene acceso al curso.");
    if(existing){await write("ggp_academy_enrollments","PATCH",{status:"active",expires_at:null},{id:"eq."+existing.id});return}
    await write("ggp_academy_enrollments","POST",{workspace_id:WORKSPACE_ID,course_id,student_id,granted_by:state.user.id,status:"active"});
  },"Asignar matrícula"));
 }else registers.append(node("div","empty","Cuando existan alumnos registrados, podrás asignarles cursos."));
 root.append(registers);
}
async function openCourse(id){
 const c=state.courses.find(x=>x.id===id);
 if(!c||(!state.isAdmin&&!hasCourse(c))){note("No tienes acceso a este curso.",true);return}
 state.chosen=id;state.lesson=null;
 try{
 [state.modules,state.lessons]=await Promise.all([
  read("ggp_academy_modules","id,title,position,course_id",{course_id:"eq."+id,order:"position.asc"}),
  read("ggp_academy_lessons","id,module_id,title,lesson_type,content,media_path,position,course_id",{course_id:"eq."+id,order:"position.asc"})
 ]);
 renderCourse();
 }catch(error){note(error.message,true);}
}

const MEDIA_BUCKET="ggp-academy-private";
const VALID_MEDIA=new Set(["application/pdf","video/mp4","video/webm","audio/mpeg","audio/mp4","audio/x-m4a","audio/wav","audio/webm","image/jpeg","image/png","image/webp"]);
async function uploadMedia(course,lesson,file){
 if(!state.isAdmin)throw Error("Solo un administrador puede añadir materiales.");
 if(!file||!VALID_MEDIA.has(file.type))throw Error("Tipo de archivo no autorizado. Usa PDF, video MP4/WebM, audio o imagen.");
 if(file.size>250*1024*1024)throw Error("El archivo supera el límite de 250 MB.");
 const extension=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,12);
 const path=course.id+"/"+lesson.id+"/"+crypto.randomUUID()+"."+extension;
 const res=await fetch(API_URL+"/storage/v1/object/"+MEDIA_BUCKET+"/"+path,{
  method:"POST",headers:{apikey:PUBLISHABLE_KEY,Authorization:"Bearer "+await token(),
   "Content-Type":file.type,"x-upsert":"false"},body:file,cache:"no-store"
 });
 if(!res.ok){const error=await res.json().catch(()=>({}));throw Error(error.message||error.error||"No fue posible subir el archivo.");}
 await write("ggp_academy_lessons","PATCH",{media_path:path,lesson_type:file.type.startsWith("video/")?"video":file.type.startsWith("audio/")?"audio":"text"},{id:"eq."+lesson.id,course_id:"eq."+course.id});
}
async function signedMedia(path){
 const r=await fetch(API_URL+"/storage/v1/object/sign/"+MEDIA_BUCKET+"/"+path,{
  method:"POST",headers:{apikey:PUBLISHABLE_KEY,Authorization:"Bearer "+await token(),"Content-Type":"application/json"},
  body:JSON.stringify({expiresIn:120}),cache:"no-store"
 });
 const data=await r.json().catch(()=>({}));
 if(!r.ok||!data.signedURL&&!data.signedUrl)throw Error(data.message||"Material no disponible.");
 const uri=data.signedURL||data.signedUrl;
 return new URL(uri.startsWith("http")?uri:uri.startsWith("/storage/v1")?uri:"/storage/v1"+(uri.startsWith("/")?"":"/")+uri,API_URL).href;
}
function mediaPanel(course,lesson){
 const box=node("div","app-card");box.style.marginTop="17px";box.append(node("h3","","Material audiovisual o PDF"));
 const file=document.createElement("input");file.type="file";file.accept=".pdf,.mp4,.webm,.mp3,.m4a,.wav,.jpg,.jpeg,.png,.webp";
 const b=button("Subir material privado",async()=>{
  b.disabled=true;try{
   await uploadMedia(course,lesson,file.files?.[0]);
   await openCourse(course.id);note("Archivo guardado en el almacenamiento privado.");
  }catch(error){note(error.message,true)}finally{b.disabled=false}
 },"primary-btn");
 box.append(node("p","small","Solo estudiantes matriculados podrán abrir este material. PDF, audio, video o imágenes; máximo 250 MB."),file,b);
 return box;
}

function renderCourse(){
 const c=state.courses.find(x=>x.id===state.chosen);if(!c)return;
 const root=mount(),head=heading(c.title,c.summary);
 head.append(button("← Regresar",()=>switchTab(state.isAdmin?"admin":"myCourses")));
 root.append(head);
 if(state.isAdmin){
 const tools=node("div","app-layout");
 tools.append(form("Añadir módulo",[field("Título del módulo","title")],async data=>{
  const position=1+Math.max(0,...state.modules.map(x=>x.position));
  await write("ggp_academy_modules","POST",{workspace_id:WORKSPACE_ID,course_id:c.id,title:String(data.get("title")),position});
  await openCourse(c.id);
 },"Crear módulo"));
 if(state.modules.length)tools.append(form("Añadir lección",[
  field("Módulo","module","",state.modules.map(x=>[x.id,x.title])),
  field("Nombre de la lección","title"),field("Contenido de lectura o ejercicio","content")],async data=>{
    const module_id=String(data.get("module"));
    const position=1+Math.max(0,...state.lessons.filter(l=>l.module_id===module_id).map(l=>l.position));
    await write("ggp_academy_lessons","POST",{workspace_id:WORKSPACE_ID,course_id:c.id,module_id,title:String(data.get("title")),content:String(data.get("content")),lesson_type:"text",position});
    await openCourse(c.id);
  },"Crear lección"));
 root.append(tools);
 const controls=node("div","grid-tools");controls.append(node("span","app-pill",c.status==="draft"?"Borrador":"Publicado"));
 controls.append(button(c.status==="published"?"Retirar del catálogo":"Publicar programa",async()=>{
  if(c.status!=="published"&&!state.lessons.some(l=>l.content.trim().length>10)){note("Primero agrega una lección completa.",true);return}
  if(!confirm("¿Actualizar la publicación del programa?"))return;
  try{await write("ggp_academy_courses","PATCH",{status:c.status==="published"?"draft":"published",published_at:new Date().toISOString()},{id:"eq."+c.id});
   await load();await openCourse(c.id);note("Publicación actualizada.");
  }catch(error){note(error.message,true)}
 },"primary-btn"));root.append(controls);
 }
 const shell=node("div","lesson-layout"),sidebar=node("aside","lesson-sidebar"),body=node("section","app-card");
 for(const m of state.modules){
  sidebar.append(node("h3","",m.title));
  for(const l of state.lessons.filter(x=>x.module_id===m.id)){
   const done=state.progress.some(p=>p.lesson_id===l.id&&p.student_id===state.user.id);
   const b=button((done?"✓ ":"")+l.title,()=>{state.lesson=l.id;renderCourse()});
   if(l.id===state.lesson)b.classList.add("selected");sidebar.append(b);
  }
 }
 if(!state.lessons.length)body.append(node("p","empty","Este curso todavía no tiene lecciones."));
 else{
  const l=state.lessons.find(x=>x.id===state.lesson)||state.lessons[0];
  state.lesson=l.id;
  body.append(node("span","eyebrow","LECCIÓN"),node("h3","",l.title),node("p","lesson-copy",l.content));
  if(l.media_path){
   const open=button("Abrir material privado ↗",async()=>{
    open.disabled=true;try{
     const url=await signedMedia(l.media_path);
     const link=document.createElement("a");link.href=url;link.target="_blank";link.rel="noopener noreferrer";
     document.body.append(link);link.click();link.remove();
    }catch(error){note(error.message,true)}finally{open.disabled=false}
   });
   body.append(open);
  }

  if(state.isAdmin){
   body.append(mediaPanel(c,l));
   body.append(form("Actualizar lección",[field("Título","title",l.title),field("Contenido","content",l.content)],async data=>{
    await write("ggp_academy_lessons","PATCH",{title:String(data.get("title")),content:String(data.get("content"))},{id:"eq."+l.id});
    await openCourse(c.id);
   }));
  }else{
   const completed=state.progress.some(p=>p.lesson_id===l.id&&p.student_id===state.user.id);
   body.append(button(completed?"✓ Completada":"Marcar lección como completada",async()=>{
    if(completed)return;
    try{await write("ggp_academy_progress","POST",{workspace_id:WORKSPACE_ID,course_id:c.id,lesson_id:l.id,student_id:state.user.id});
     await load();renderCourse();note("Lección completada.");
    }catch(error){note(error.message,true)}
   },completed?"outline-btn":"primary-btn"));
  }
 }
 shell.append(sidebar,body);root.append(shell);
 if(!state.isAdmin&&state.lessons.length){
  const completed=state.lessons.filter(l=>state.progress.some(p=>p.student_id===state.user.id&&p.lesson_id===l.id)).length;
  const progress=node("div","app-card");progress.style.marginTop="18px";
  progress.append(node("h3","","Tu avance"),node("p","small",completed+" de "+state.lessons.length+" lecciones completadas"));
  const track=node("div","bar-track"),fill=node("div");fill.style.width=completed/state.lessons.length*100+"%";track.append(fill);progress.append(track);root.append(progress);
 }
}
function render(){if(state.chosen)return renderCourse();if(state.screen==="catalog")showCatalog();else if(state.screen==="admin"&&state.isAdmin)admin();else showMine()}
async function enter(){
 await identity();await load();
 $("#authView").hidden=true;$("#learningView").hidden=false;$("#who").textContent=state.user.email;
 $("#adminTab").hidden=!state.isAdmin;switchTab("myCourses");
 const wanted=new URLSearchParams(location.search).get("course");
 if(wanted&&state.courses.some(c=>c.id===wanted))openCourse(wanted);
}
async function signOut(){try{await request("/auth/v1/logout",{method:"POST",auth:true})}catch{}
 state.session=null;state.user=null;state.isAdmin=false;save();$("#learningView").hidden=true;$("#authView").hidden=false;$("#authForm").reset()}
function mode(next){state.mode=next;$("#signInTab").setAttribute("aria-selected",String(next==="login"));$("#signUpTab").setAttribute("aria-selected",String(next==="register"));$("#fullNameLabel").hidden=next!=="register";$("#authSubmit").textContent=next==="register"?"Crear mi cuenta →":"Entrar a mi aprendizaje →";authNote("")}
$("#signInTab").addEventListener("click",()=>mode("login"));
$("#signUpTab").addEventListener("click",()=>mode("register"));
$("#authForm").addEventListener("submit",async event=>{
 event.preventDefault();const b=$("#authSubmit"),d=new FormData(event.target);b.disabled=true;
 try{
  const email=String(d.get("email")).trim(),password=String(d.get("password"));
  if(state.mode==="register"){
   const name=String(d.get("fullName")||"").trim();
   if(name.length<2)throw Error("Escribe tu nombre completo.");
   const url=location.origin+location.pathname;
   const r=await request("/auth/v1/signup?redirect_to="+encodeURIComponent(url),{method:"POST",body:{email,password,data:{full_name:name}}});
   if(!r?.access_token){authNote("Cuenta solicitada. Revisa tu correo y confirma el registro.");return}
   state.session=r;
  }else state.session=await request("/auth/v1/token?grant_type=password",{method:"POST",body:{email,password}});
  save();await enter();
 }catch(error){authNote(error.message,true)}finally{b.disabled=false}
});
$("#forgotPassword").addEventListener("click",async()=>{
 const email=String($("#authForm").elements.email.value).trim();
 if(!email){authNote("Escribe primero tu correo electrónico.",true);return}
 try{
  await request("/auth/v1/recover?redirect_to="+encodeURIComponent(location.origin+location.pathname),{method:"POST",body:{email}});
  authNote("Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.");
 }catch(error){authNote(error.message,true)}
});
$("#signOut").addEventListener("click",signOut);
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.view)));
async function restore(){
 try{state.session=JSON.parse(sessionStorage.getItem(STORE)||"null")}catch{state.session=null}
 const hash=new URLSearchParams(location.hash.slice(1));
 if(hash.get("access_token")&&hash.get("refresh_token")){
  state.session={access_token:hash.get("access_token"),refresh_token:hash.get("refresh_token"),
   expires_at:Math.floor(Date.now()/1000)+Number(hash.get("expires_in")||3600)};
  save();history.replaceState(null,"",location.pathname+location.search);
 }
 if(state.session)try{await enter();if(hash.get("type")==="recovery"){
  const password=prompt("Escribe tu nueva contraseña (mínimo 8 caracteres).");
  if(password&&password.length>=8){
   await request("/auth/v1/user",{method:"PUT",auth:true,body:{password}});
   note("Contraseña actualizada.");
  }
 }}catch(error){await signOut();authNote("No fue posible validar la sesión: "+error.message,true)}
}
restore();