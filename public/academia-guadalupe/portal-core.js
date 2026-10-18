import { API_URL,PUBLISHABLE_KEY,WORKSPACE_ID } from "./config.js";

const KEY="ggp_academy_v2";
let credentials=null;
export const workspace=WORKSPACE_ID;
export const make=(tag,cls,text)=>{
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(text!==undefined)e.textContent=String(text);
 return e;
};
export function note(message,type="info"){
 const target=document.getElementById("notice");
 if(target){target.textContent=message;target.className="message "+(type==="error"?"error":type==="success"?"success":"");}
}
export function shortDate(value){
 if(!value)return "Sin fecha";
 try{return new Intl.DateTimeFormat("es-MX",{timeZone:"America/Mexico_City",dateStyle:"medium"}).format(new Date(value))}
 catch{return "Sin fecha"}
}
export function restore(){
 try{credentials=JSON.parse(sessionStorage.getItem(KEY)||"null");}catch{credentials=null}
 return credentials;
}
export function hasSession(){return !!(credentials?.access_token||restore()?.access_token)}
function save(){if(credentials)sessionStorage.setItem(KEY,JSON.stringify(credentials));else sessionStorage.removeItem(KEY);}
export async function auth(endpoint,{method="GET",body,authorization=false}={}){
 const headers={apikey:PUBLISHABLE_KEY};
 if(body!==undefined)headers["Content-Type"]="application/json";
 if(authorization)headers.Authorization="Bearer "+await accessToken();
 const response=await fetch(API_URL+"/auth/v1/"+endpoint,{
  method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:"no-store",
 });
 const content=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(content.error_description||content.message||content.msg||content.error||"Error de autenticación.");
 return content;
}
export async function accessToken(){
 if(!credentials)restore();
 if(!credentials?.access_token)throw Error("Inicia sesión para continuar.");
 if(Number(credentials.expires_at||0)*1000>Date.now()+60000)return credentials.access_token;
 if(!credentials.refresh_token)throw Error("Sesión vencida.");
 const fresh=await auth("token?grant_type=refresh_token",{method:"POST",body:{refresh_token:credentials.refresh_token}});
 credentials=fresh;save();return fresh.access_token;
}
export async function signIn(email,password){
 credentials=await auth("token?grant_type=password",{method:"POST",body:{email,password}});save();
 return credentials;
}
export async function signUp(name,email,password){
 const callback=location.origin+location.pathname;
 const data=await auth("signup?redirect_to="+encodeURIComponent(callback),{
  method:"POST",body:{email,password,data:{full_name:name}}
 });
 if(data.access_token){credentials=data;save()}
 return data;
}
export async function requestRecovery(email){
 await auth("recover?redirect_to="+encodeURIComponent(location.origin+location.pathname),{method:"POST",body:{email}});
}
export async function updatePassword(password){return auth("user",{method:"PUT",body:{password},authorization:true})}
export async function logOut(){
 try{await auth("logout",{method:"POST",authorization:true})}catch{}
 credentials=null;save();
}
export async function captureLink(){
 restore();
 const hash=new URLSearchParams(location.hash.slice(1));
 const a=hash.get("access_token"),r=hash.get("refresh_token");
 if(a&&r){
  credentials={access_token:a,refresh_token:r,expires_at:Math.floor(Date.now()/1000)+Number(hash.get("expires_in")||3600)};
  save();history.replaceState(null,"",location.pathname+location.search);
 }
 return {recovery:hash.get("type")==="recovery",confirmed:hash.get("type")==="signup"};
}
export async function db(table,{select="*",filters={},method="GET",body,prefer}={}){
 const search=new URLSearchParams({select,workspace_id:"eq."+WORKSPACE_ID,...filters});
 const headers={apikey:PUBLISHABLE_KEY,Authorization:"Bearer "+await accessToken()};
 if(body!==undefined)headers["Content-Type"]="application/json";
 if(prefer)headers.Prefer=prefer;
 const response=await fetch(API_URL+"/rest/v1/"+table+"?"+search,{
  method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:"no-store",
 });
 const text=await response.text();let data;try{data=text?JSON.parse(text):null}catch{data={message:text}}
 if(!response.ok)throw Error(data?.message||data?.details||"Error al consultar los datos.");
 return data;
}
export const get=(table,select="*",filters={})=>db(table,{select,filters});
export const add=(table,record)=>db(table,{method:"POST",body:{...record,workspace_id:WORKSPACE_ID},prefer:"return=representation"});
export const patch=(table,id,record)=>db(table,{method:"PATCH",filters:{id:"eq."+id},body:record,prefer:"return=representation"});

export async function identity(){
 const user=await auth("user",{authorization:true});
 if(!user?.id||!user.email)throw Error("La sesión no corresponde a un usuario válido.");
 const [members,staff]=await Promise.all([
  get("workspace_members","role",{user_id:"eq."+user.id,status:"eq.active",limit:"5"}),
  get("ggp_academy_staff","role,is_active",{user_id:"eq."+user.id,limit:"1"}),
 ]);
 const isOwner=members.some(m=>m.role==="owner");
 const isAdmin=members.some(m=>["owner","admin"].includes(m.role))||staff.some(m=>m.role==="admin"&&m.is_active);
 const profiles=await get("ggp_academy_students","user_id,display_name",{user_id:"eq."+user.id,limit:"1"});
 if(!profiles.length){
  const name=String(user.user_metadata?.full_name||user.email.split("@")[0]).trim().slice(0,160);
  await add("ggp_academy_students",{user_id:user.id,display_name:name,email:user.email});
 }
 return {user,isAdmin,isOwner,name:profiles?.[0]?.display_name||user.user_metadata?.full_name||user.email.split("@")[0]};
}
export async function data(ctx){
 const [courses,enrollments,progress,books,bookGrants,memberships]=await Promise.all([
  get("ggp_academy_courses","id,title,summary,slug,category,level,status,created_at,duration_minutes",{order:"created_at.desc",limit:"100"}),
  get("ggp_academy_enrollments","id,course_id,student_id,status,expires_at,enrolled_at",ctx.isAdmin?{limit:"600"}:{student_id:"eq."+ctx.user.id,limit:"100"}),
  get("ggp_academy_progress","lesson_id,course_id,student_id,completed_at",ctx.isAdmin?{limit:"1000"}:{student_id:"eq."+ctx.user.id,limit:"1000"}),
  get("ggp_academy_books","id,title,author,description,status,media_path,cover_url",{limit:"100"}),
  get("ggp_academy_book_grants","book_id,student_id,expires_at",ctx.isAdmin?{limit:"500"}:{student_id:"eq."+ctx.user.id,limit:"100"}),
  get("ggp_academy_community_members","user_id,status",ctx.isAdmin?{limit:"500"}:{user_id:"eq."+ctx.user.id,limit:"1"}),
 ]);
 return {courses,enrollments,progress,books,bookGrants,memberships};
}
export function enrolled(ctx,store,course){
 return store.enrollments.some(e=>e.student_id===ctx.user.id&&e.course_id===course.id&&
   ["active","completed"].includes(e.status)&&(!e.expires_at||new Date(e.expires_at)>new Date()));
}
export function hasBook(ctx,store,book){
 return store.bookGrants.some(g=>g.book_id===book.id&&g.student_id===ctx.user.id&&
   (!g.expires_at||new Date(g.expires_at)>new Date()));
}
export function hasCommunity(ctx,store){return store.memberships.some(m=>m.user_id===ctx.user.id&&m.status==="active")}
export async function courseDetail(courseId){
 const [modules,lessons]=await Promise.all([
  get("ggp_academy_modules","id,title,position,course_id",{course_id:"eq."+courseId,order:"position.asc"}),
  get("ggp_academy_lessons","id,module_id,title,lesson_type,content,media_path,course_id,position",{course_id:"eq."+courseId,order:"position.asc"}),
 ]);
 return {modules,lessons};
}
export async function secureMedia(path){
 const url=API_URL+"/storage/v1/object/sign/ggp-academy-private/"+path.split("/").map(encodeURIComponent).join("/");
 const res=await fetch(url,{
  method:"POST",headers:{apikey:PUBLISHABLE_KEY,Authorization:"Bearer "+await accessToken(),
   "Content-Type":"application/json"},body:JSON.stringify({expiresIn:120}),cache:"no-store"
 });
 const content=await res.json().catch(()=>({}));
 if(!res.ok||!(content.signedURL||content.signedUrl))throw Error(content.message||"No se puede abrir el material.");
 const u=content.signedURL||content.signedUrl;
 return new URL(u.startsWith("http")?u:u.startsWith("/storage/v1")?u:"/storage/v1"+(u.startsWith("/")?"":"/")+u,API_URL).href;
}
