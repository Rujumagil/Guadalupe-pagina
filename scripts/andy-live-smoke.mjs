import { randomUUID } from "node:crypto";

const origin="https://rujumagil.github.io";
const base="https://app.proyectocompas.app";
const key="wc_1defe173698ae845c7f66d5d28674564022e";
const headers={"Origin":origin,"Referer":origin+"/Guadalupe-pagina/","User-Agent":"Compas-Andy-Smoke-Test/1.0"};
const query="?key="+encodeURIComponent(key);
const conf=await fetch(base+"/api/public/web-chat/config"+query,{headers,signal:AbortSignal.timeout(20000)});
const data=await conf.json();
console.log("CONFIG_STATUS",conf.status,"AVAILABLE",data.ok,"ONBOARDING_MODE",data.config?.onboardingMode);
if (!conf.ok || !data.ok) process.exit(1);
const pre=await fetch(base+"/api/public/web-chat/messages"+query,{method:"OPTIONS",headers:{...headers,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"content-type"},signal:AbortSignal.timeout(20000)});
console.log("PREFLIGHT_STATUS",pre.status);
if(pre.status!==204)process.exit(1);
const body={
  publicKey:key,clientMessageId:randomUUID(),
  name:"Visitante", consent:true,
  message:"PRUEBA TÉCNICA AUTOMÁTICA de Andy. Solo responde que recibiste este mensaje de prueba, no solicites datos ni contactes a nadie.",
  serviceRoute:"sales",pageUrl:origin+"/Guadalupe-pagina/"
};
const start=Date.now();
try {
 const res=await fetch(base+"/api/public/web-chat/messages"+query,{
  method:"POST",headers:{...headers,"Content-Type":"application/json"},
  body:JSON.stringify(body),signal:AbortSignal.timeout(65000)
 });
 const payload=await res.json();
 console.log("POST_STATUS",res.status,"DURATION_MS",Date.now()-start,"OK",payload.ok,
 "ERROR",payload.error??null,"HAS_SESSION",Boolean(payload.sessionToken),
 "HAS_REPLY",Boolean(payload.reply),"CONVERSATION_ID",payload.conversationId??null);
 if(!res.ok || !payload.ok || !payload.sessionToken)process.exit(1);
} catch(error) {
 console.log("POST_THROW",error.name,error.message,"DURATION_MS",Date.now()-start);
 process.exit(1);
}
