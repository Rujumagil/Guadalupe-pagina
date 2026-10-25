/** Public browser-chat configuration and response handling for Andy.
 * PUBLIC_KEY is a public widget identifier, not a server credential.
 * Do not place private service credentials in this module. */
const API = "https://app.proyectocompas.app";
const PUBLIC_KEY = "wc_1defe173698ae845c7f66d5d28674564022e";
const SESSION_KEY = "guadalupe:andy:session:v1";

export { PUBLIC_KEY, SESSION_KEY };

export function endpoint(section: "config" | "messages"): string {
  return API + "/api/public/web-chat/" + section + "?key=" + encodeURIComponent(PUBLIC_KEY);
}

export function publicError(response: Response, result: { error?: string }) {
  if (response.status === 429) return "Hay muchos mensajes por el momento. Inténtalo de nuevo en un minuto.";
  if (response.status === 403) return "No se pudo autorizar la conexión con Andy. Puedes utilizar WhatsApp.";
  if (response.status >= 500) return "Andy no pudo iniciar la conversación. Tu mensaje no se envió; puedes reintentarlo o usar WhatsApp.";
  return typeof result.error === "string" && result.error.length < 180
    ? result.error
    : "No fue posible contactar a Andy. Intenta nuevamente o utiliza WhatsApp.";
}
