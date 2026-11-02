// Bunny Stream TUS 1.0 resumable direct upload.
// The Bunny API key never leaves Cloudflare. Re-select the same file to resume.
const TUS_ENDPOINT = "https://video.bunnycdn.com/tusupload";
const CHUNK = 8 * 1024 * 1024;
const MAX_BYTES = 2 * 1024 * 1024 * 1024;
const recordKey = file => "nicteha-tus:" + [file.name,file.size,file.lastModified].join(":");
const assertLocation = candidate => {
  const target = new URL(candidate, TUS_ENDPOINT);
  if (target.protocol !== "https:" || target.hostname !== "video.bunnycdn.com") {
    throw Error("Bunny devolvió una dirección de carga inesperada.");
  }
  return target.href;
};
const baseHeaders = ticket => ({
  "Tus-Resumable": "1.0.0",
  AuthorizationSignature: ticket.signature,
  AuthorizationExpire: String(ticket.expires),
  VideoId: ticket.videoId,
  LibraryId: String(ticket.libraryId)
});
const enc64 = value => {
  const arr = new TextEncoder().encode(value);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str);
};
async function initiate(file, ticket) {
  const r = await fetch(TUS_ENDPOINT, {
    method: "POST",
    headers: {
      ...baseHeaders(ticket),
      "Upload-Length": String(file.size),
      "Upload-Metadata": "filename " + enc64(file.name) +
        ",filetype " + enc64(file.type) +
        ",title " + enc64(file.name)
    }
  });
  if (r.status !== 201) throw Error("Bunny rechazó el inicio de carga: HTTP " + r.status);
  const location = r.headers.get("Location");
  if (!location) throw Error("Bunny no devolvió la dirección TUS.");
  return assertLocation(location);
}
async function offset(url, ticket) {
  const r = await fetch(url, {method:"HEAD", headers:baseHeaders(ticket)});
  if (!r.ok) throw Error("No fue posible reanudar la carga: HTTP " + r.status);
  const n = Number(r.headers.get("Upload-Offset"));
  if (!Number.isSafeInteger(n) || n < 0) throw Error("Desfase de carga inválido.");
  return n;
}
async function putChunk(url, ticket, blob, start) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...baseHeaders(ticket),
      "Content-Type": "application/offset+octet-stream",
      "Upload-Offset": String(start)
    },
    body: blob
  });
  if (!response.ok) throw Error("Fragmento rechazado por Bunny: HTTP " + response.status);
  const next = Number(response.headers.get("Upload-Offset"));
  if (!Number.isSafeInteger(next) || next <= start) throw Error("Bunny no confirmó el fragmento.");
  return next;
}
const sleep = ms => new Promise(done => setTimeout(done,ms));
export async function uploadLargeVideo({file,title,worker,onProgress}) {
  if (!file || !["video/mp4","video/webm"].includes(file.type)) {
    throw Error("Selecciona un video MP4 o WebM.");
  }
  if (file.size < 1 || file.size > MAX_BYTES) throw Error("El archivo supera el límite de prueba de 2 GB.");
  const key = recordKey(file);
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(key) || "null"); } catch {}
  let ticket, url;
  if (stored?.videoId && stored?.url && stored?.title === title) {
    try {
      url = assertLocation(stored.url);
      ticket = await worker("/videos/" + encodeURIComponent(stored.videoId) + "/tus-ticket", {method:"POST"});
    } catch {
      // Reset only if the prior upload cannot be resumed.
      localStorage.removeItem(key);
      throw Error("No se pudo recuperar la carga anterior. Revisa Bunny antes de crear otro video.");
    }
  } else {
    ticket = await worker("/videos/tus", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({title, size:file.size})
    });
    onProgress(0,ticket.videoId,"Creando carga reanudable en Bunny...");
    url = await initiate(file,ticket);
    localStorage.setItem(key, JSON.stringify({videoId:ticket.videoId,url,title}));
  }
  let sent = await offset(url,ticket);
  if (sent > file.size) throw Error("Bunny reportó más bytes que el archivo seleccionado.");
  onProgress(Math.floor(sent/file.size*100),ticket.videoId,"Enviando fragmentos directamente a Bunny...");
  while (sent < file.size) {
    let success = false;
    for (let attempt=0;attempt<4&&!success;attempt++) {
      try {
        const part = file.slice(sent,Math.min(file.size,sent+CHUNK));
        sent = await putChunk(url,ticket,part,sent);
        if(sent>file.size) throw Error("Bunny reportó un tamaño inválido.");
        success = true;
        onProgress(Math.floor(sent/file.size*100),ticket.videoId,"Carga en progreso...");
      } catch(err) {
        if(attempt===3) throw Error(err.message+" Puedes reintentar seleccionando el mismo archivo.");
        await sleep((attempt+1)*1500);
        sent=await offset(url,ticket);
      }
    }
  }
  localStorage.removeItem(key);
  onProgress(100,ticket.videoId,"Archivo enviado. Bunny está procesando el video.");
  return {videoId:ticket.videoId};
}
