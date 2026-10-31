# Recuperación de contraseñas — Nicté Ha (Supabase original)
## Alcance
La pantalla de administración de videos usa los usuarios del proyecto original `ylvwfmcbbfaaeyadndhn`, no la base de Compás One. Se agregó una recuperación privada al propio dominio de Guadalupe:
`https://guadalupegomezpezuela.com/academia-guadalupe/recuperar-videos`

Archivos:
- `public/academia-guadalupe/recuperar-videos.html`
- `public/academia-guadalupe/recuperar-videos.js`
- Enlace en `video-admin-prueba.html`.

El formulario solicita recuperación por correo a `/auth/v1/recover`, con `redirect_to` al dominio de Guadalupe. Al regresar al sitio, comprueba el token de recuperación de Supabase y permite cambiar contraseña a través de `/auth/v1/user`. No necesita compartir contraseñas con un operador. La UI no envía password a Compás One.

## Paso obligatorio pendiente en Supabase
Proyecto **Eterni academia (Guadalupe)** > Authentication > URL Configuration:
1. Añadir URL de redirección **exacta**:
   `https://guadalupegomezpezuela.com/academia-guadalupe/recuperar-videos`.
2. Verificar Site URL para que no sea Compás One / dominio anterior. Solo cambiar Site URL si los demás flujos del proyecto original se han revisado y probado. Como mínimo añadir Redirect URL exacto.
3. Authentication > Email Templates > Reset Password: confirmar que utiliza `{{ .ConfirmationURL }}` o `{{ .RedirectTo }}`, no un enlace fijo al dominio de Compás One/Eterni.
4. Authentication > SMTP: asegurar proveedor saliente y remitente identificable con marca Guadalupe si se desea email con dominio propio. El dominio de un email propio requiere configurar SMTP y DNS (SPF/DKIM), no basta con ajustar la página web.

## Limitación importante
El **portal de Academia Nicté Ha actual** todavía utiliza `qwxydjotwhniahaovrff` de Compás One en `public/academia-guadalupe/config.js`. Esta solución es para el administrador de videos que autentica en Supabase original. **No** unifica cuentas académicas automáticamente ni reemplaza toda la autenticación Compás One. No migrar ni fusionar identidades por correo sin verificación.

## Verificación y seguridad
- Verificar que nueva página esté desplegada y visible en URL sin extensión (Next export trailingSlash).
- Probar el envío desde la cuenta del propietario y comprobar el destino del correo ANTES de actualizar contraseña.
- No mostrar enlaces de recuperación (incluyendo hash/query) ni compartirlos en chats/capturas.
- Probar enlace inválido/expirado, contraseña de 12+ caracteres y posterior inicio de sesión.
- Si el correo no llega, revisar SMTP, rate limiting y carpeta Spam.
- No modificar política RLS ni cuentas de alumnos para esta funcionalidad.
