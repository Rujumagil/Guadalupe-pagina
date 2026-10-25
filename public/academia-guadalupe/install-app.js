// Independent install experience for the portal currently loaded.
(() => {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", {scope:"./"}).catch(() => {}));
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "⬇ Instalar app";
  button.setAttribute("aria-label", "Instalar este portal como aplicación");
  Object.assign(button.style, {position:"fixed",right:"16px",bottom:"82px",zIndex:"10000",border:"1px solid #d5e1dc",borderRadius:"999px",padding:"12px 18px",background:"#214d40",color:"white",font:"600 13px system-ui,sans-serif",boxShadow:"0 6px 25px #1d3e3433",cursor:"pointer"});
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) return;
  let pendingPrompt = null;
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); pendingPrompt = event; button.hidden = false; });
  window.addEventListener("appinstalled", () => {button.remove();pendingPrompt = null;});
  button.addEventListener("click", async () => {
    if (pendingPrompt) {
      const prompt = pendingPrompt; pendingPrompt = null;
      prompt.prompt(); await prompt.userChoice;
      return;
    }
    const existing = document.getElementById("appInstallGuide"); if (existing) {existing.remove();return;}
    const guide=document.createElement("div");guide.id="appInstallGuide";guide.setAttribute("role","dialog");guide.setAttribute("aria-label","Cómo instalar esta app");
    Object.assign(guide.style,{position:"fixed",right:"16px",bottom:"145px",maxWidth:"310px",zIndex:"10001",border:"1px solid #d5e1dc",borderRadius:"16px",padding:"20px",background:"#fff",color:"#263d35",font:"14px/1.55 system-ui,sans-serif",boxShadow:"0 12px 40px #152b2950"});
    guide.innerHTML = '<strong>Instala esta aplicación</strong><p>En iPhone: toca Compartir → Añadir a pantalla de inicio. En Android (Chrome): menú ⋮ → Instalar aplicación o Añadir a pantalla principal. En computadora: usa el icono de instalación de la barra del navegador.</p><button type="button" style="border:0;border-radius:8px;padding:9px 16px;background:#214d40;color:white">Entendido</button>';
    guide.querySelector("button").addEventListener("click",()=>guide.remove());document.body.append(guide);
  });
  document.body.append(button);
})();
