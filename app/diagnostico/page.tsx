"use client";
import { useState, type FormEvent } from "react";
const areas=["Confianza, autoestima y seguridad personal.","Bienestar emocional y manejo del estrés.","Relaciones personales y comunicación.","Propósito de vida y toma de decisiones.","Liderazgo y desarrollo profesional.","Emprendimiento, negocios y ventas."];
const apoyos=["Sesiones individuales de coaching.","Talleres presenciales.","Programas grupales de acompañamiento.","Conferencias y webinars.","Cursos y talleres en línea","Materiales y herramientas de desarrollo personal"];
const tiempos=["Lo antes posible","Durante el próximo mes","En los próximos tres meses","Por ahora solo estoy explorando opciones","Quiero regalármelo en Thanksgiving, Navidad o Fin de Año.","Otro"];
const api="https://qwxydjotwhniahaovrff.supabase.co/functions/v1/guadalupe-survey";
export default function DiagnosticoPage(){
 const [selected,setSelected]=useState<string[]>([]);
 const [support,setSupport]=useState<string[]>([]);
 const [obstacle,setObstacle]=useState("");
 const [when,setWhen]=useState("");
 const [other,setOther]=useState("");
 const [interest,setInterest]=useState("");
 const [name,setName]=useState("");
 const [contact,setContact]=useState("");
 const [consent,setConsent]=useState(false);
 const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
 const [message,setMessage]=useState("");
 function toggle(v:string,list:string[],setter:(v:string[])=>void){setter(list.includes(v)?list.filter(x=>x!==v):[...list,v]);}
 async function submit(e:FormEvent<HTMLFormElement>){
 e.preventDefault();
 if(!selected.length){setMessage("Selecciona al menos un área.");return;}
 if(!api){setStatus("error");setMessage("La encuesta está preparada, pero la recepción segura de respuestas todavía no está habilitada.");return;}
 if(contact.trim() && interest==="Sí, me gustaría recibir información." && !consent){setMessage("Para recibir información, autoriza el contacto.");return;}
 setStatus("sending");setMessage("");
 try{
 const res=await fetch(api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({areas:selected,obstacle:obstacle.trim(),support,when:when==="Otro"?other.trim():when,interest,name:name.trim(),contact:contact.trim(),consent,source:"landing-diagnostico-guadalupe"})});
 if(!res.ok)throw new Error("No pudimos registrar tus respuestas. Intenta nuevamente.");
 setStatus("success");
 }catch(err){setStatus("error");setMessage(err instanceof Error?err.message:"No se pudo enviar la encuesta.");}
 }
 return <main className="g-page" style={{background:"#f8f6f3",paddingBottom:80}}>
 <section className="g-subhero"><div className="shell g-subhero-grid"><div><span className="g-eyebrow">Guadalupe Gómez Pezuela · Encuesta de intereses</span><h1>¿Qué necesitas hoy para avanzar hacia tus metas?</h1><p className="g-lead">Tu opinión es muy importante para mí. Quiero conocer tus intereses, inquietudes y desafíos para desarrollar experiencias y herramientas que realmente te ayuden a crecer.</p><p>Esta breve encuesta te tomará menos de dos minutos.</p><a className="btn btn-primary" href="#encuesta">Comenzar encuesta</a></div><img className="g-subhero-image" src="/images/guadalupe-trayectoria.webp" alt="Guadalupe Gómez Pezuela"/></div></section>
 <section className="g-section" id="encuesta"><div className="shell" style={{maxWidth:820}}>
 {status==="success"?<div className="g-card" role="status"><h2>¡Gracias por compartir tus respuestas!</h2><p>Tu participación nos ayuda a diseñar experiencias relevantes. Si autorizaste el contacto, podremos enviarte información relacionada con tus intereses.</p></div>:
 <form onSubmit={submit} className="g-card" style={{padding:"clamp(22px,5vw,48px)",display:"grid",gap:28}}>
 <div><h2 style={{marginBottom:8}}>Cuéntame sobre tus metas</h2><p>Los campos de contacto son opcionales. Solo la primera pregunta es obligatoria.</p></div>
 <fieldset style={{border:0,padding:0}}><legend style={{fontWeight:700,marginBottom:12}}>1. ¿En qué áreas de tu vida te gustaría avanzar o mejorar? *</legend>{areas.map(a=><label key={a} style={{display:"flex",gap:12,marginBottom:12,alignItems:"start"}}><input type="checkbox" checked={selected.includes(a)} onChange={()=>toggle(a,selected,setSelected)}/>{a}</label>)}</fieldset>
 <label style={{display:"grid",gap:10,fontWeight:700}}>2. ¿Qué es lo que más te está impidiendo avanzar hacia tus metas?<textarea value={obstacle} onChange={e=>setObstacle(e.target.value)} maxLength={1500} rows={4} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #c9c9c9"}} placeholder="Tu respuesta (opcional)"/></label>
 <fieldset style={{border:0,padding:0}}><legend style={{fontWeight:700,marginBottom:12}}>3. ¿Qué tipo de apoyo te gustaría recibir para alcanzar tus metas?</legend>{apoyos.map(a=><label key={a} style={{display:"flex",gap:12,marginBottom:12}}><input type="checkbox" checked={support.includes(a)} onChange={()=>toggle(a,support,setSupport)}/>{a}</label>)}</fieldset>
 <fieldset style={{border:0,padding:0}}><legend style={{fontWeight:700,marginBottom:12}}>4. ¿En qué momento te gustaría comenzar a trabajar en tus metas?</legend>{tiempos.map(t=><label key={t} style={{display:"flex",gap:12,marginBottom:12}}><input type="radio" name="when" checked={when===t} onChange={()=>setWhen(t)}/>{t}</label>)}{when==="Otro"&&<input aria-label="Otro momento" value={other} onChange={e=>setOther(e.target.value)} maxLength={120} style={{padding:12,width:"100%"}}/>}</fieldset>
 <fieldset style={{border:0,padding:0}}><legend style={{fontWeight:700,marginBottom:12}}>5. ¿Te gustaría recibir información sobre experiencias, talleres o programas relacionados con tus intereses?</legend>{["Sí, me gustaría recibir información.","Tal vez, dependiendo del tema.","No, por el momento."].map(v=><label key={v} style={{display:"flex",gap:12,marginBottom:12}}><input type="radio" name="interest" checked={interest===v} onChange={()=>setInterest(v)}/>{v}</label>)}</fieldset>
 <label style={{display:"grid",gap:9,fontWeight:700}}>6. ¿Cuál es tu nombre? (Opcional)<input value={name} onChange={e=>setName(e.target.value)} maxLength={120} autoComplete="name" style={{padding:12,borderRadius:10,border:"1px solid #c9c9c9"}}/></label>
 <label style={{display:"grid",gap:9,fontWeight:700}}>7. ¿En qué correo electrónico o número de WhatsApp te gustaría recibir información? (Opcional)<input value={contact} onChange={e=>setContact(e.target.value)} maxLength={180} autoComplete="email" style={{padding:12,borderRadius:10,border:"1px solid #c9c9c9"}}/></label>
 <div style={{fontSize:14,lineHeight:1.6}}><strong>Privacidad y uso de datos</strong><p>Tu participación es voluntaria. Si decides compartir tu nombre, correo electrónico o WhatsApp, esos datos se utilizarán para contactarte y enviarte información relacionada con los temas de tu interés, únicamente si lo autorizas. Puedes solicitar que deje de contactarte escribiendo a <a href="mailto:contacto@guadalupegomezpezuela.com">contacto@guadalupegomezpezuela.com</a>.</p><label style={{display:"flex",gap:12}}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>Autorizo que Guadalupe Gómez Pezuela me contacte sobre los temas de mi interés.</label></div>
 {message&&<p role="alert" style={{color:"#a12929"}}>{message}</p>}
 <button className="btn btn-primary" type="submit" disabled={status==="sending"}>{status==="sending"?"Enviando…":"Enviar mis respuestas"}</button>
 </form>}</div></section></main>;
}
