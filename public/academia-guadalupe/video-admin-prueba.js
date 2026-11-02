import {uploadLargeVideo} from "./video-tus.js";

const SUPABASE_URL="https://ylvwfmcbbfaaeyadndhn.supabase.co";
const SUPABASE_KEY="sb_publishable_HIHNWZnB_oe2Fgp6qfwzJw_X_uio7sL";
const WORKER="https://guadalupe-video-api.proyectocompas-info.workers.dev";
const $=x=>document.querySelector(x);
let session=null;

let lastBlockedHost="";
window.addEventListener("securitypolicyviolation", event => {
  if (String(event.violatedDirective).includes("connect-src")) {
    lastBlockedHost=event.blockedURI || "servicio externo";
    message("Bloqueo de seguridad CSP: " + lastBlockedHost);
  }
});
async function probe(label, url) {
  try {
    const res=await fetch(url,{method:"GET",cache:"no-store"});
    return label+": accesible (HTTP "+res.status+")";
  } catch {
    return label+": SIN CONEXIÓN (red, CORS o CSP)";
  }
}
document.querySelector("#diagnoseButton")?.addEventListener("click",async e=>{
  const button=e.currentTarget;
  button.disabled=true;
  try{
    const results=await Promise.all([
      probe("Supabase Eterni",SUPABASE_URL+"/auth/v1/settings"),
      probe("Cloudflare Worker",WORKER+"/health")
    ]);
    message(results.join("\n")+"\nNo se enviaron credenciales."+
      (lastBlockedHost?"\nOrigen bloqueado: "+lastBlockedHost:""));
  }finally{button.disabled=false}
});

function message(value){$("#status").textContent=value;}
async function api(url,opts={}) {
 const res=await fetch(url,{...opts,cache:"no-store"});
 const payload=await res.json().catch(()=>null);
 if(!res.ok){
  // Supabase Auth puede devolver "msg", "error_description" o "error_code".
  // Mostrar solo el mensaje de error, nunca tokens ni respuesta completa.
  const reason=String(payload?.error_description||payload?.msg||payload?.message||
    payload?.error||payload?.error_code||("Error HTTP "+res.status)).slice(0,260);
  const service=url.startsWith(SUPABASE_URL)?"Supabase Eterni":"Cloudflare Video API";
  throw Error(service+" (HTTP "+res.status+"): "+reason);
 }
 return payload;
}
async function worker(path,options={}) {
 if(!session?.access_token)throw Error("Debes iniciar sesión nuevamente.");
 return api(WORKER+path,{...options,headers:{Authorization:"Bearer "+session.access_token,...(options.headers||{})}});
}
$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();const button=$("#loginButton");button.disabled=true;
 try{
  const data=new FormData(e.target);
  message("Conectando con Supabase Eterni...");
  session=await api(SUPABASE_URL+"/auth/v1/token?grant_type=password",{
   method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},
   body:JSON.stringify({email:String(data.get("email")).trim(),password:String(data.get("password"))})
  });
  // Validación explícita del administrador en Worker.
  message("Sesión recibida. Validando administrador en Cloudflare...");
  await worker("/admin/check");
  $("#loginPanel").hidden=true;
  $("#videoPanel").hidden=false;
  e.target.reset();
  message("Cuenta administradora validada. Selecciona un video de prueba.");
 }catch(error){
  session=null;message("Acceso no verificado: "+error.message+"\nUsa la cuenta de Authentication > Users del proyecto Eterni. No compartas contraseñas.");
 }finally{button.disabled=false;}
});
$("#videoForm").addEventListener("submit",async e=>{
 e.preventDefault();const button=$("#uploadButton");button.disabled=true;
 try{
  const data=new FormData(e.target),file=data.get("video"),title=String(data.get("title")).trim();
  if(!(file instanceof File)||!file.size)throw Error("Selecciona un video.");
  message("Preparando la carga reanudable...");
  const result=await uploadLargeVideo({
   file,title,worker,
   onProgress:(percent,id,detail)=>{
    const progress=$("#uploadProgress");
    if(progress){progress.hidden=false;progress.value=percent}
    message(detail+" "+percent+"%\nVideo ID: "+id);
   }
  });
  const resultStatus=await worker("/videos/"+encodeURIComponent(result.videoId)+"/status");
  message("Video recibido por Bunny. ID: "+result.videoId+"\nEstado de procesamiento: "+
   String(resultStatus.status)+"\nNo está publicado en ninguna lección.");
  e.target.reset();
 }catch(error){message("La carga no se completó: "+error.message+"\nSi hubo una interrupción, selecciona el MISMO archivo y título para reanudar.");}
 finally{button.disabled=false;}
});
$("#logoutButton").addEventListener("click",()=>{
 session=null;$("#loginPanel").hidden=false;$("#videoPanel").hidden=true;message("Sesión cerrada.");
});
