"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";

export function BusinessInquiry() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hola Guadalupe, quiero solicitar una propuesta para mi empresa.",
      `Empresa: ${form.get("empresa")}`,
      `Nombre y puesto: ${form.get("contacto")}`,
      `Necesidad principal: ${form.get("necesidad")}`,
      `Participantes aproximados: ${form.get("participantes")}`,
      `Fecha estimada: ${form.get("fecha") || "Por definir"}`,
      `Correo o teléfono: ${form.get("datos")}`,
    ].join("\n");
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form className="business-form" id="solicitud" onSubmit={submit}>
      <div className="business-form-head">
        <span className="eyebrow">Solicitud de propuesta</span>
        <h2>Cuéntame qué necesita tu organización.</h2>
        <p>Con estos datos prepararé una primera orientación para conversar sobre alcance, formato y objetivos.</p>
      </div>
      <div className="form-grid">
        <label>Empresa<input name="empresa" required type="text" /></label>
        <label>Nombre y puesto<input name="contacto" required type="text" /></label>
        <label className="form-full">Necesidad principal<textarea name="necesidad" required rows={4} /></label>
        <label>Participantes aproximados<input min="1" name="participantes" required type="number" /></label>
        <label>Fecha estimada<input name="fecha" type="date" /></label>
        <label className="form-full">Correo o teléfono<input name="datos" required type="text" /></label>
      </div>
      <button className="btn btn-primary" type="submit">Enviar solicitud por WhatsApp</button>
      {sent && <p className="form-confirmation" role="status">Tu solicitud se abrió en WhatsApp para que puedas revisarla y enviarla.</p>}
    </form>
  );
}
