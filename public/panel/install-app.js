// Independent install experience for the portal currently loaded.
(() => {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", {scope:"./"}).catch(() => {}));
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "⬇ Instalar app";
  button.setAttribute("aria-label", "Instalar este portal como aplicación");
  button.className = "install-app-btn";
  button.textContent = "↓ Instalar";
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
    guide.className = "install-app-guide";
    guide.innerHTML = '<strong>Instala esta aplicación</strong><p>En iPhone: toca Compartir → Añadir a pantalla de inicio. En Android (Chrome): menú ⋮ → Instalar aplicación o Añadir a pantalla principal. En computadora: usa el icono de instalación de la barra del navegador.</p><button type="button" style="border:0;border-radius:8px;padding:9px 16px;background:#214d40;color:white">Entendido</button>';
    guide.querySelector("button").addEventListener("click",()=>guide.remove());document.body.append(guide);
  });
  const topActions = document.querySelector(".top-actions");
  if (topActions) topActions.insertBefore(button, topActions.firstChild);
  else document.body.append(button);
})();
