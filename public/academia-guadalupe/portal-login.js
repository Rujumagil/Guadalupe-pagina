import {signIn,signUp,requestRecovery,updatePassword,captureLink,hasSession,note,accessToken} from "./portal-core.js";
const $=s=>document.querySelector(s);let mode="login";
function setMode(next){
 mode=next;$("#loginTab").setAttribute("aria-selected",String(next==="login"));
 $("#registerTab").setAttribute("aria-selected",String(next==="register"));
 $("#nameLabel").hidden=next!=="register";$("#fullName").required=next==="register";
 $("#authTitle").textContent=next==="register"?"Crea tu cuenta":"Inicia sesión";
 $("#authSubtitle").textContent=next==="register"?"Comienza tu experiencia con una cuenta nueva.":"Accede al contenido que tienes disponible en tu academia.";
 $("#authSubmit").textContent=next==="register"?"Crear mi cuenta →":"Entrar a mi academia →";
 $("#password").autocomplete=next==="register"?"new-password":"current-password";
 $("#authForm").hidden=false;$("#resetForm").hidden=true;note("");
}
$("#loginTab").addEventListener("click",()=>setMode("login"));
$("#registerTab").addEventListener("click",()=>setMode("register"));
$("#authForm").addEventListener("submit",async e=>{
 e.preventDefault();const b=$("#authSubmit");b.disabled=true;
 try{
  const d=new FormData(e.currentTarget),email=String(d.get("email")).trim(),pass=String(d.get("password"));
  if(mode==="register"){
   const name=String(d.get("fullName")||"").trim();
   if(name.length<2)throw Error("Escribe tu nombre completo.");
   const answer=await signUp(name,email,pass);
   if(!answer.access_token){note("Cuenta registrada. Confirma tu dirección desde el correo que recibas.","success");return}
  }else await signIn(email,pass);
  location.replace("./inicio.html");
 }catch(error){note(error.message,"error")}finally{b.disabled=false}
});
$("#forgotButton").addEventListener("click",async()=>{
 const email=$("#email").value.trim();
 if(!email){note("Primero escribe tu correo electrónico.","error");$("#email").focus();return}
 try{await requestRecovery(email);note("Si la cuenta existe, recibirás un enlace para restablecer tu contraseña.","success")}
 catch(error){note(error.message,"error")}
});
$("#resetForm").addEventListener("submit",async e=>{
 e.preventDefault();const b=e.currentTarget.querySelector("button");b.disabled=true;
 try{
  const pass=String(new FormData(e.currentTarget).get("newPassword"));
  if(pass.length<10)throw Error("La contraseña debe tener al menos 10 caracteres.");
  await updatePassword(pass);
  note("Contraseña actualizada. Entrando a tu academia…","success");
  location.replace("./inicio.html");
 }catch(error){note(error.message,"error")}finally{b.disabled=false}
});
(async()=>{
 try{
  const callback=await captureLink();
  if(callback.recovery&&hasSession()){
   await accessToken();
   $("#authForm").hidden=true;$("#resetForm").hidden=false;
   $("#authTitle").textContent="Restablece tu acceso";$("#authSubtitle").textContent="Crea una contraseña nueva para tu cuenta.";
   return;
  }
  if(hasSession()){
   await accessToken();location.replace("./inicio.html");
  }
  if(callback.confirmed)note("Correo confirmado. Ahora puedes entrar a tu academia.","success");
 }catch{note("Inicia sesión para continuar.");}
})();
