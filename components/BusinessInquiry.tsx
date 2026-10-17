"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";

export function BusinessInquiry() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hola Guadalupe, quiero solicitar coaching empresarial o una propuesta para mi organización.",
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
        <h2>Conversemos sobre el reto de tu organización.</h2>
        <p>Comparte información básica sobre el equipo y el objetivo. Al enviar, se abrirá WhatsApp con los datos para que puedas confirmar el mensaje.</p>
      </div>
      <div className="form-grid">
        <label>Empresa<input name="empresa" required type="text" /></label>
        <label>Nombre y puesto<input name="contacto" required type="text" /></label>
        <label className="form-full">Necesidad principal<textarea name="necesidad" required rows={4} /></label>
        <label>Participantes aproximados<input min="1" name="participantes" required type="number" /></label>
        <label>Fecha estimada<input name="fecha" type="date" /></label>
        <label className="form-full">Correo o teléfono<input name="datos" required type="text" /></label>
      </div>
      <label className="form-full" style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}><input type="checkbox" required style={{ marginTop: 6 }} /> <span>Confirmo que deseo compartir estos datos por WhatsApp para recibir respuesta a mi consulta. He podido revisar el <a href="/privacy.html" target="_blank" rel="noopener noreferrer">aviso de privacidad</a>.</span></label>
      <button className="btn btn-primary" type="submit">Preparar consulta en WhatsApp</button>
      {sent && <p className="form-confirmation" role="status">Se abrió WhatsApp con un mensaje preparado. Revisa y envía el mensaje allí para completar tu solicitud.</p>}
    </form>
  );
}
