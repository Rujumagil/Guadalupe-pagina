
const SUPABASE_URL="https://ylvwfmcbbfaaeyadndhn.supabase.co";
const SUPABASE_KEY="sb_publishable_HIHNWZnB_oe2Fgp6qfwzJw_X_uio7sL";
const WORKER="https://guadalupe-video-api.proyectocompas-info.workers.dev";
const $=x=>document.querySelector(x);
let session=null;
function message(value){$("#status").textContent=value;}
async function api(url,opts={}) {
 const res=await fetch(url,{...opts,cache:"no-store"});
 const payload=await res.json().catch(()=>null);
 if(!res.ok)throw Error(payload?.error_description||payload?.message||payload?.error||"Error HTTP "+res.status);
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
  session=await api(SUPABASE_URL+"/auth/v1/token?grant_type=password",{
   method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},
   body:JSON.stringify({email:String(data.get("email")).trim(),password:String(data.get("password"))})
  });
  // Validación explícita del administrador en Worker.
  await worker("/admin/check");
  $("#loginPanel").hidden=true;
  $("#videoPanel").hidden=false;
  e.target.reset();
  message("Cuenta administradora validada. Selecciona un video de prueba.");
 }catch(error){
  session=null;message("Acceso no verificado: "+error.message);
 }finally{button.disabled=false;}
});
$("#videoForm").addEventListener("submit",async e=>{
 e.preventDefault();const button=$("#uploadButton");button.disabled=true;
 try{
  const data=new FormData(e.target),file=data.get("video"),title=String(data.get("title")).trim();
  if(!(file instanceof File)||!file.size)throw Error("Selecciona un archivo.");
  if(file.size>60*1024*1024)throw Error("El archivo supera los 60 MB.");
  if(!["video/mp4","video/webm"].includes(file.type))throw Error("Usa MP4 o WebM.");
  message("Creando registro del video en Bunny…");
  const created=await worker("/videos",{method:"POST",
   headers:{"Content-Type":"application/json"},body:JSON.stringify({title})});
  message("Video creado. Subiendo archivo…");
  await worker("/videos/"+encodeURIComponent(created.videoId)+"/upload",{
   method:"PUT",headers:{"Content-Type":file.type},body:file
  });
  const result=await worker("/videos/"+encodeURIComponent(created.videoId)+"/status");
  message("Carga enviada. Video ID: "+created.videoId+"\nEstado Bunny: "+String(result.status)+
   "\nAún no está publicado ni asociado a una lección.");
  e.target.reset();
 }catch(error){message("No se completó la carga: "+error.message+"\nSi Bunny ya creó un video, puede haber quedado pendiente en la biblioteca.");}
 finally{button.disabled=false;}
});
$("#logoutButton").addEventListener("click",()=>{
 session=null;$("#loginPanel").hidden=false;$("#videoPanel").hidden=true;message("Sesión cerrada.");
});
