/**
 * Academia Nicté Ha — API de carga de videos a Bunny Stream.
 * Desplegar en Cloudflare Worker guadalupe-video-api.
 * Requiere variables: BUNNY_STREAM_API_KEY (secret), BUNNY_STREAM_LIBRARY_ID,
 * BUNNY_STREAM_CDN_HOSTNAME, SUPABASE_PUBLISHABLE_KEY (secret),
 * SUPABASE_ADMIN_USER_ID (secret), ALLOWED_ORIGIN.
 *
 * Usa autenticación real de Supabase Eterni y allowlist de un administrador.
 * No usa profiles.role (la tabla heredada permite autoeditar perfil).
 * No vincula lecciones ni concede permisos de reproducción.
 */
const SUPABASE_URL = "https://ylvwfmcbbfaaeyadndhn.supabase.co";
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_UPLOAD = 60 * 1024 * 1024;
function response(body, status = 200, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify(body), { status, headers });
}
function configReady(env) {
  return Boolean(
    env.BUNNY_STREAM_API_KEY &&
    /^\d+$/.test(String(env.BUNNY_STREAM_LIBRARY_ID || "")) &&
    env.BUNNY_STREAM_CDN_HOSTNAME &&
    env.SUPABASE_PUBLISHABLE_KEY &&
    GUID.test(String(env.SUPABASE_ADMIN_USER_ID || "")) &&
    /^https:\/\//.test(String(env.ALLOWED_ORIGIN || ""))
  );
}
async function isAuthorized(request, env) {
  const auth = request.headers.get("Authorization") || "";
  if (!/^Bearer [A-Za-z0-9._-]{20,4096}$/.test(auth)) return false;
  const validation = await fetch(SUPABASE_URL + "/auth/v1/user", {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: auth,
    },
    cache: "no-store",
  });
  if (!validation.ok) return false;
  const user = await validation.json().catch(() => null);
  return user?.id === env.SUPABASE_ADMIN_USER_ID;
}
async function bunny(env, path, init = {}) {
  return fetch(
    "https://video.bunnycdn.com/library/" +
      encodeURIComponent(env.BUNNY_STREAM_LIBRARY_ID) + "/videos" + path,
    {
      ...init,
      headers: {
        AccessKey: env.BUNNY_STREAM_API_KEY,
        Accept: "application/json",
        ...(init.headers || {}),
      },
    }
  );
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = origin && origin === env.ALLOWED_ORIGIN ? origin : "";
    if (origin && !allowed) return response({ error: "origin_not_allowed" }, 403);
    if (request.method === "OPTIONS") {
      if (!allowed) return response({ error: "origin_not_allowed" }, 403);
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowed,
          "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Authorization,Content-Type",
          "Access-Control-Max-Age": "3600",
          Vary: "Origin",
        },
      });
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return response({
        service: "Academia Nicte Ha Video API",
        status: configReady(env) ? "configured" : "configuration_pending",
      }, configReady(env) ? 200 : 503, allowed);
    }
    if (!configReady(env)) return response({ error: "configuration_pending" }, 503, allowed);
    if (!(await isAuthorized(request, env))) return response({ error: "unauthorized" }, 401, allowed);
    if (request.method === "POST" && url.pathname === "/videos") {
      const body = await request.json().catch(() => null);
      const title = String(body?.title || "").trim();
      if (title.length < 3 || title.length > 160) return response({ error: "invalid_title" }, 400, allowed);
      const result = await bunny(env, "", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!result.ok) return response({ error: "video_creation_failed" }, 502, allowed);
      const data = await result.json().catch(() => null);
      if (!GUID.test(data?.guid || "")) return response({ error: "invalid_bunny_response" }, 502, allowed);
      return response({ videoId: data.guid, status: "created" }, 201, allowed);
    }
    const match = url.pathname.match(/^\/videos\/([a-f0-9-]{36})(?:\/(upload|status))?$/i);
    if (!match || !GUID.test(match[1])) return response({ error: "not_found" }, 404, allowed);
    const videoId = match[1];
    if (request.method === "PUT" && match[2] === "upload") {
      const announcedSize = request.headers.get("Content-Length");
      const type = (request.headers.get("Content-Type") || "").split(";")[0].trim();
      if (!request.body) return response({ error: "empty_upload" }, 400, allowed);
      if (announcedSize && Number(announcedSize) > MAX_UPLOAD) {
        return response({ error: "upload_too_large", maxBytes: MAX_UPLOAD }, 413, allowed);
      }
      if (!["video/mp4", "video/webm"].includes(type)) return response({ error: "unsupported_format" }, 415, allowed);
      // Browser fetch cannot set Content-Length; enforce on actual bytes too.
      const bytes = await request.arrayBuffer();
      if (!bytes.byteLength || bytes.byteLength > MAX_UPLOAD) {
        return response({ error: "invalid_upload_size", maxBytes: MAX_UPLOAD }, 413, allowed);
      }
      const result = await bunny(env, "/" + videoId, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: bytes,
      });
      if (!result.ok) return response({ error: "video_upload_failed" }, 502, allowed);
      return response({ videoId, status: "processing" }, 200, allowed);
    }
    if (request.method === "GET" && match[2] === "status") {
      const result = await bunny(env, "/" + videoId);
      if (!result.ok) return response({ error: "video_status_failed" }, 502, allowed);
      const data = await result.json().catch(() => null);
      return response({
        videoId,
        status: data?.status ?? null,
        length: data?.length ?? null,
        title: data?.title ?? null,
      }, 200, allowed);
    }
    return response({ error: "method_not_allowed" }, 405, allowed);
  },
};
