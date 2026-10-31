# Activación de guadalupe-video-api (Cloudflare Workers)

## Estado
Código de backend preparado en `cloudflare/guadalupe-video-api/worker.js`. **No está desplegado**. No incluye por ahora el panel integrado, metadatos por lección ni reproducción para alumnos. No realiza cambios en Supabase.

## Variables Cloudflare Worker
| Variable | Tipo | Origen |
| --- | --- | --- |
| `BUNNY_STREAM_API_KEY` | Secret | Bunny Stream > Academia Guadalupe > API (clave de la biblioteca, NO de cuenta) |
| `BUNNY_STREAM_LIBRARY_ID` | Text | `795782` |
| `BUNNY_STREAM_CDN_HOSTNAME` | Text | `vz-c70bced8-e27.b-cdn.net` |
| `SUPABASE_PUBLISHABLE_KEY` | Secret | Supabase Eterni > Project Settings > API Keys > publishable/anon |
| `SUPABASE_ADMIN_USER_ID` | Secret | UUID del usuario administrador autorizado **en Auth de Supabase Eterni** |
| `ALLOWED_ORIGIN` | Text | Origen EXACTO del dominio de administración, p. ej. `https://www.guadalupegomezpezuela.com` si esa es la URL elegida |

No pegar claves secretas en GitHub, el chat ni en el frontend. El `ADMIN_USER_ID` se valida directamente contra `/auth/v1/user` del proyecto `ylvwfmcbbfaaeyadndhn`; no se utiliza `profiles.role` como control de acceso dado que se detectó una política que permite actualizar perfiles propios. **Debe auditarse y restringirse la actualización del campo `role` en esa tabla antes de continuar con un esquema de roles.**

## Operaciones
- `GET /health`: salud de configuración, no confirma por sí solo que Bunny acepte la clave.
- `POST /videos`: requiere Bearer JWT válido de **Supabase Eterni** cuyo user ID coincida con `SUPABASE_ADMIN_USER_ID`. JSON `{ "title": "..." }`. Devuelve videoId.
- `PUT /videos/{videoId}/upload`: mismo Bearer, cuerpo binario video/mp4 o video/webm con Content-Length, máximo 90 MB en esta primera versión; subidas grandes requerirán TUS y firma de upload en otra versión.
- `GET /videos/{videoId}/status`: comprueba procesamiento en Bunny para el administrador.

## Antes de utilizar en la academia
1. Configurar secrets y `ALLOWED_ORIGIN` en Cloudflare.
2. Copiar y desplegar el archivo `worker.js` en el Worker `guadalupe-video-api`.
3. Verificar `/health`.
4. Probar endpoint de carga **sin token**: debe devolver 401.
5. Probar token de alumno de Eterni: 401, y token admin autenticado: creación 201.
6. Subir un MP4 pequeño y comprobar status; no publicar videos que no hayan finalizado procesamiento.
7. Crear asociación `video_id → academy_lesson_id` en base, mediante permisos de administrador y auditoría. No utilizar simplemente URLs públicas.
8. Diseñar reproducción protegida con token/iframe firmado y autorización por entitlements reales. El Worker actual NO emite tokens de reproducción.
9. Integrar panel de Nicté Ha; su login actual usa Supabase Compás One y **ese JWT NO sirve para esta API**, que verifica usuarios de Supabase Eterni. Debe diseñarse vinculación segura o login académico con Eterni; no asumir equivalencia por email.

## Limitaciones
- El tráfico de subida pasa por Cloudflare Worker y puede verse limitado por tamaño, tiempo y límites de la cuenta.
- Bunny cobra procesamiento, almacenamiento y entrega de video según configuración; se deben vigilar consumo y saldo.
- No se ha realizado una prueba extremo a extremo con credenciales reales.
- Para producción, añadir rate limiting, registro de auditoría y confirmación del video al terminar procesamiento.
