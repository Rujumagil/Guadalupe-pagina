# Academia Guadalupe Gómez Pezuela — nueva plataforma V1

**Repositorio:** `Rujumagil/Guadalupe-pagina`  
**Rutas tras publicar:**
- `/academia-guadalupe/`: presentación y catálogo real; solamente cursos publicados.
- `/academia-guadalupe/aula.html`: acceso alumno, creación de cuenta, recuperación y panel administrativo.
- `/panel/`: CRM comercial de Guadalupe (separado del LMS).

## Qué se implementó
- Nueva experiencia visual de Guadalupe, independiente de la marca ETERNI.
- Registro de alumnos, correo de confirmación según configuración de Auth, recuperación de contraseña y cierre de sesión.
- Identidad compartida con **Supabase Auth de Compás One**, pero **cuentas y roles académicos independientes mediante tablas dedicadas**, sin acceso automático a CRM/ETERNI.
- Cuatro programas iniciales como **borradores**, no vendibles; catálogo público únicamente para `published`.
- Administración de programas, módulos, lecciones de lectura, matrículas y estudiantes.
- Roles de administrador de academia `ggp_academy_staff`, concedibles o revocables únicamente por el dueño del espacio de Guadalupe. Su rol no concede administración de CRM.
- Progreso por alumno y lección, vinculado a matrícula vigente.
- Bucket privado `ggp-academy-private`; carga por administradores y acceso de lectura solo mediante matrícula o permisos; URLs firmadas con vigencia de 120 segundos.
- Pruebas CI de sintaxis, Node y build Next.js export.

## Base de datos
Proyecto: Compás One (`qwxydjotwhniahaovrff`), **esquema académico lógico separado**. No se usa la base de ETERNI.

Migraciones aplicadas:
1. `ggp_academy_foundation_v1` — 6 tablas académicas y RLS.
2. `ggp_academy_private_media_v1` — bucket privado y políticas de Storage.
3. `ggp_academy_staff_v1` — permisos de colaboradores académicos.

Todas las tablas empiezan vacías excepto 4 cursos iniciales en borrador. No se ha importado información de ETERNI.

## Configuración obligatoria de acceso
En Supabase → Authentication → URL Configuration → Redirect URLs incluir:
- `https://rujumagil.github.io/Guadalupe-pagina/academia-guadalupe/aula.html`
- URL equivalente del dominio definitivo, una vez conectado en Cloudflare.

No reemplazar la Site URL de Compás One sin revisar callbacks de otros servicios. Confirmar email verification y plantillas de correo antes de abrir nuevos alumnos. Probar el registro de una cuenta nueva, correo, contraseña, login, recuperación, revocación y matrícula.

**No se han creado contraseñas ni usuarios ficticios.** Las personas crean sus credenciales. El propietario del workspace Guadalupe tiene el rol autorizado inicial; futuros administradores se registran primero como alumnos y luego reciben el rol académico en Administración.

## Archivo y video
El administrador puede añadir material a una lección con el editor. Formatos: PDF, MP4/WebM, MP3/M4A/WAV/WebM y JPG/PNG/WebP, máximo 250 MB. El contenido se guarda privado y la URL temporal expira en 120 segundos; la reproducción prolongada o la distribución de videos grandes puede requerir streaming segmentado externo.

## Operación comercial
Por seguridad, el registro en el aula **no** concede matrícula. El administrador asigna acceso. El enlace de consulta comercial usa WhatsApp mientras se completa el endpoint de altas, pagos y eventos conectado con Compás One / Compás Fly. Ninguna compra/Stripe ficticia se ha configurado.

## Pendientes de producción
- Probar sesiones reales con la propietaria y un alumno nuevo; no tenemos credenciales de prueba en esta conversación.
- Confirmar dominio `academia.guadalupegomezpezuela.com` y desplegar en Cloudflare tras verificar DNS.
- Terminar temarios, lecciones, videos y condiciones de inscripción; revisar textos legales de la academia.
- Implementar CRM comercial y checkout con confirmación de servidor, idempotencia y manejo de reembolsos, si se desean pagos.
- Añadir auditoría de cambios de contenido, exportación y copia de seguridad de datos académicos.
- Endurecer auth con BFF/cookies HttpOnly antes de gestionar grandes volúmenes de datos personales; actualmente utiliza sesión temporal en `sessionStorage`.

## Comandos de validación
```bash
npm ci
npm run typecheck
npm run lint
node --check public/academia-guadalupe/catalog.js
node --check public/academia-guadalupe/aula.js
node --test tests/academy.test.mjs
npm run build
```
