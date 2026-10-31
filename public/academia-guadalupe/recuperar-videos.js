// Recuperación de Supabase ORIGINAL de Guadalupe (antes Eterni), no Compás One.
// La clave es publishable y NO es una clave de administrador.
const AUTH_URL="https://ylvwfmcbbfaaeyadndhn.supabase.co/auth/v1";
const KEY="sb_publishable_HIHNWZnB_oe2Fgp6qfwzJw_X_uio7sL";
const CALLBACK="https://guadalupegomezpezuela.com/academia-guadalupe/recuperar-videos";
const $=id=>document.getElementById(id);
const message=text=>{$("message").textContent=text};
let recoveryToken=null;
async function call(path,{method="GET",body,authorization}={}){
 const res=await fetch(AUTH_URL+path,{
  method,headers:{
   apikey:KEY,
   ...(body?{"Content-Type":"application/json"}:{}),
   ...(authorization?{Authorization:"Bearer "+authorization}:{})
  },
  ...(body?{body:JSON.stringify(body)}:{}),
  cache:"no-store",
 });
 const payload=await res.json().catch(()=>({}));
 if(!res.ok){
  const detail=String(payload.error_description||payload.msg||payload.message||payload.error||"No fue posible completar la solicitud.");
  throw new Error(detail.slice(0,250));
 }
 return payload;
}
const fragment=new URLSearchParams(location.hash.slice(1));
const query=new URLSearchParams(location.search);
function cleanUrl(){history.replaceState(null,"",location.pathname)}
async function beginRecovery(){
 const token=fragment.get("access_token"),type=fragment.get("type"),tokenHash=query.get("token_hash");
 if(fragment.get("error")||query.get("error")){
  cleanUrl();message("El enlace no es válido o expiró. Solicita uno nuevo.");return;
 }
 if(type==="recovery"&&token){
  const user=await call("/user",{authorization:token});
  if(!user?.id)throw new Error("El enlace no contiene una sesión válida.");
  recoveryToken=token;
 }else if(tokenHash&&query.get("type")==="recovery"){
  const verified=await call("/verify",{method:"POST",body:{token_hash:tokenHash,type:"recovery"}});
  if(!verified.access_token)throw new Error("No se recibió una sesión de recuperación.");
  recoveryToken=verified.access_token;
 }
 if(recoveryToken){
  cleanUrl();
  $("emailForm").hidden=true;$("passwordForm").hidden=false;
  $("description").textContent="Crea una nueva contraseña de al menos 12 caracteres.";
  message("Enlace verificado. Ya puedes actualizar tu contraseña.");
 }
}
$("emailForm").addEventListener("submit",async event=>{
 event.preventDefault();
 const button=$("send");button.disabled=true;
 try{
  await call("/recover?redirect_to="+encodeURIComponent(CALLBACK),{
   method:"POST",body:{email:$("email").value.trim()}
  });
  message("Si el correo está registrado, recibirás un enlace para recuperar tu contraseña. Revisa también Spam.");
 }catch(err){
  message("No se pudo enviar el correo. "+err.message);
 }finally{button.disabled=false}
});
$("passwordForm").addEventListener("submit",async event=>{
 event.preventDefault();const button=$("change");button.disabled=true;
 try{
  const password=$("password").value;
  if(password.length<12)throw new Error("Escribe al menos 12 caracteres.");
  if(password!==$("confirm").value)throw new Error("Las contraseñas no coinciden.");
  if(!recoveryToken)throw new Error("El enlace de recuperación no es válido.");
  await call("/user",{method:"PUT",authorization:recoveryToken,body:{password}});
  recoveryToken=null;
  $("passwordForm").hidden=true;
  $("password").value="";$("confirm").value="";
  message("Contraseña actualizada. Regresa a iniciar sesión con tu nueva contraseña.");
 }catch(err){message("No se pudo actualizar la contraseña: "+err.message)}
 finally{button.disabled=false}
});
beginRecovery().catch(()=>{recoveryToken=null;cleanUrl();message("No se pudo verificar el enlace. Solicita uno nuevo.");});
