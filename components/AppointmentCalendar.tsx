"use client";

import { useMemo, useState, type FormEvent } from "react";
import "@/styles/appointment-calendar.css";

const API = "https://app.proyectocompas.app/api/public/guadalupe/appointments";
const HOURS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const two = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${two(d.getMonth()+1)}-${two(d.getDate())}`;
const todayInMexico = () => {
  const formatted = new Intl.DateTimeFormat("en-CA", {timeZone:"America/Mexico_City",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  return formatted;
};
export function AppointmentCalendar() {
  const [monthOffset,setMonthOffset] = useState(0);
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");
  const [service,setService] = useState("personal");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [notes,setNotes] = useState("");
  const [consent,setConsent] = useState(false);
  const [website,setWebsite] = useState("");
  const [busy,setBusy] = useState(false);
  const [result,setResult] = useState<{ok:boolean;message:string}|null>(null);

  const today = todayInMexico();
  const base = useMemo(()=>{const [y,m]=today.split("-").map(Number);return new Date(y,m-1+monthOffset,1);},[today,monthOffset]);
  const days = useMemo(()=>{
    const count = new Date(base.getFullYear(),base.getMonth()+1,0).getDate();
    const offset = (base.getDay()+6)%7;
    return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>dayKey(new Date(base.getFullYear(),base.getMonth(),i+1)))];
  },[base]);
  const max = (()=>{const [y,m,d]=today.split("-").map(Number);return dayKey(new Date(y,m-1,d+90));})();
  const monthLabel = new Intl.DateTimeFormat("es-MX",{month:"long",year:"numeric"}).format(base);
  const chooseDate = (value:string)=>{setDate(value);setTime("");setResult(null);};
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!date || !time || !consent || busy)return;
    setBusy(true);setResult(null);
    try{
      const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,phone,service,date,time,notes,consent,website})});
      const payload:{ok?:boolean;error?:string}=await response.json();
      if(!response.ok||!payload.ok)throw new Error(payload.error||"No se pudo enviar la solicitud.");
      setResult({ok:true,message:"¡Solicitud recibida! Guadalupe revisará el horario y se pondrá en contacto para confirmar tu cita."});
      setName("");setEmail("");setPhone("");setNotes("");setConsent(false);setDate("");setTime("");
    }catch(err){setResult({ok:false,message:err instanceof Error?err.message:"No se pudo registrar tu solicitud."});}
    finally{setBusy(false);}
  }
  return <section className="g-section g-booking-section" id="agendar-cita" aria-labelledby="booking-title">
    <div className="shell">
      <header className="g-section-title">
        <span className="g-eyebrow">Da el primer paso</span>
        <h2 id="booking-title">Agenda una conversación con Guadalupe</h2>
        <p>Elige el día y horario que prefieres para una sesión de coaching. Te contactaremos para confirmar la disponibilidad.</p>
      </header>
      <div className="g-booking-layout">
        <div className="g-booking-card">
          <div className="g-booking-month">
            <button type="button" aria-label="Mes anterior" onClick={()=>{setMonthOffset(v=>Math.max(0,v-1));setDate("");setTime("");}} disabled={monthOffset===0}>‹</button>
            <strong>{monthLabel}</strong>
            <button type="button" aria-label="Mes siguiente" onClick={()=>{setMonthOffset(v=>Math.min(3,v+1));setDate("");setTime("");}} disabled={monthOffset===3}>›</button>
          </div>
          <div className="g-booking-grid g-booking-weekdays">{["L","M","M","J","V","S","D"].map((v,i)=><span key={i}>{v}</span>)}</div>
          <div className="g-booking-grid">
            {days.map((value,i)=>value ? <button type="button" key={value} disabled={value<today||value>max}
              aria-pressed={date===value} aria-label={value} className={date===value?"selected":""} onClick={()=>chooseDate(value)}>{Number(value.slice(-2))}</button>
              : <span key={"empty-"+i}/>)}
          </div>
          <p className="g-booking-hint">Los horarios son preferencias; la disponibilidad se confirma personalmente.</p>
          {date && <div className="g-booking-hours">
            <strong>Horario preferido · Ciudad de México</strong>
            <div className="g-booking-hour-grid">{HOURS.map(v=><button key={v} type="button" disabled={new Date(date+"T"+v+":00-06:00").getTime() <= Date.now()+3600000} className={time===v?"selected":""} aria-pressed={time===v} onClick={()=>{setTime(v);setResult(null);}}>{v}</button>)}</div>
          </div>}
        </div>
        <form className="g-booking-card g-booking-form" onSubmit={submit}>
          <h3>Tu solicitud de cita</h3>
          <p>Completa tus datos para que podamos darte seguimiento desde el CRM de Guadalupe.</p>
          <label>Tipo de acompañamiento<select required value={service} onChange={e=>setService(e.target.value)}>
            <option value="personal">Coaching personal</option><option value="empresarial">Coaching empresarial</option>
          </select></label>
          <div className="g-booking-selection"><span>Fecha</span><strong>{date||"Selecciona un día"}</strong><span>Hora</span><strong>{time||"Selecciona un horario"}</strong></div>
          <label>Nombre completo<input required minLength={3} maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label>
          <label>Correo electrónico<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nombre@correo.com"/></label>
          <label>Teléfono<input required type="tel" minLength={8} maxLength={25} autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Tu número de contacto"/></label>
          <label>¿Qué te gustaría trabajar? (opcional)<textarea maxLength={500} rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Cuéntame brevemente tu objetivo"/></label>
          <label className="g-booking-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>Acepto el <a href="/privacy.html" target="_blank" rel="noopener noreferrer">aviso de privacidad</a> para registrar mi solicitud.</span></label>
          <label className="g-booking-trap" aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
          <button className="btn btn-primary" type="submit" disabled={!date||!time||!consent||busy}>{busy?"Enviando solicitud…":"Solicitar cita →"}</button>
          {result && <p role="status" className={result.ok?"g-booking-success":"g-booking-error"}>{result.message}</p>}
          <small>Enviar la solicitud no confirma la cita. Guadalupe validará el horario contigo.</small>
        </form>
      </div>
    </div>
  </section>;
}
