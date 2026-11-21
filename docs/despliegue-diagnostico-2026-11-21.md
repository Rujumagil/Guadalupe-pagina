# Publicación de diagnóstico — 21 de noviembre de 2026

Se ha reconectado Cloudflare Workers Builds con `Rujumagil/Guadalupe-pagina` (rama `main`). Este commit inicia la compilación del sitio estático con `npm run build` y su despliegue con `npx wrangler deploy` de acuerdo con `wrangler.jsonc` (`assets.directory = ./out`).

Ruta nueva: `/diagnostico/`.

La landing envía respuestas a la Edge Function `guadalupe-survey` del proyecto Supabase Compás One. El CRM `/panel/` consulta `guadalupe_survey_responses` con permisos por workspace. Verificar build, despliegue, formulario y visibilidad en CRM antes de anunciar la URL.
