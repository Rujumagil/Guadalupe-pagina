# Subidas grandes Bunny Stream — Nicté Ha

Implementación preparada para videos MP4/WebM hasta 2 GiB usando TUS directo desde el navegador a Bunny (`video.bunnycdn.com/tusupload`). No sube los archivos a Cloudflare ni Supabase.

## Seguridad
1. El administrador inicia sesión mediante Supabase original de Guadalupe. Worker valida JWT contra `auth/v1/user` y compara UUID autorizado.
2. `POST /videos/tus` recibe `{title,size}`, crea un objeto de video en Bunny y devuelve firma temporal SHA256 de `libraryId+APIKey+expires+videoId`; la API Key nunca llega al navegador.
3. `POST /videos/{id}/tus-ticket` permite renovar autorización temporal para cargas existentes a un administrador autenticado.
4. TUS usa POST, HEAD y PATCH directo a Bunny con fragmentos de 8 MiB. Se conserva solo el videoId, título y URL temporal de sesión TUS en localStorage para reanudar seleccionando el mismo archivo. Si falla el inicio tras crear el video, puede quedar un video vacío en Bunny.
5. No publica contenido ni asigna video a lección. No habilitar reproducción pública sin token de acceso y autorización de matrícula.

## Despliegue
- Fusionar PR y publicar el sitio `guadalupe-pagina` desde la rama main; revisar que incluya `video-tus.js` y CSP `connect-src https://video.bunnycdn.com`.
- **Separadamente**, copiar el nuevo `cloudflare/guadalupe-video-api/worker.js` al editor de Cloudflare Worker `guadalupe-video-api` y desplegar. GitHub no despliega automáticamente este Worker.
- No modificar variables existentes ni exponer `BUNNY_STREAM_API_KEY`.
- Probar /health (200), /admin/check sin credenciales (401) y luego inicio de sesión autorizado en pantalla Nicté Ha.
- Probar con MP4 de 5–20 MB, después con el MP4 exportado de Canva de 100–500 MB.
- Revisar consola del navegador para posibles errores CORS de Bunny; si se producen, no usar un proxy abierto. Revalidar integración TUS y usar cliente oficial `tus-js-client` autoalojado como alternativa.
- Verificar el Video ID en biblioteca Bunny y estado terminado. Sin asociar video a curso en esta etapa.

## Límites
- 2 GiB máximo de prueba, fragmentos de 8 MiB; se recomienda conexión estable.
- La tasa y coste dependen de Bunny y del tráfico. Una firma tiene validez de 6 horas.
- Protocolo TUS 1.0. No probado de extremo a extremo contra cuenta Bunny real.
