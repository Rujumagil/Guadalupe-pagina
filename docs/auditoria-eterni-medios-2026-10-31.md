# Nicté Ha — conciliación de contenidos originales de Eterni
Fecha: 2026-10-31. Estado: **solo lectura, sin modificaciones de datos de producción**.

## Fuentes
- Proyecto académico original: Supabase `ylvwfmcbbfaaeyadndhn`.
- Proyecto CRM/Nicté Ha actual: `qwxydjotwhniahaovrff`.
- Repositorio: `Rujumagil/Guadalupe-pagina`.
- Tarea de implementación: #21.

## Hallazgos verificables
- 10 productos, 20 unidades de contenido, 12 cursos, 15 módulos, 10 lecciones.
- Paquete Legado 1: 5 componentes; Paquete Legado 2: 9 componentes.
- Libros: `libro-cuentos-sanar` tiene 86 registros de contenido asociado y `libro-mujer-faro` tiene 120.
- Audiolibro: 33 registros `content_assets` tipo audio, 23 con objeto físico coincidente y 10 referencias `__pending__/track-XX.pending`.
- Storage: `audiolibro-cuentos-sanar` 24 objetos, de los cuales 1 es `.emptyFolderPlaceholder`; `eterni-private` 156 objetos.
- `eterni-private`: 85 objetos bajo `libro-cuentos-sanar`, 68 bajo `libro-mujer-faro`, 2 bajo `comunidad-ixchel`, 1 bajo `manual-mujer-faro`.
- Conciliación de todos los `content_assets` (unión exacta `bucket_id` y `object_path`): audio audiolibro 23/33, audio privado 0/1, file privado 153/205, pdf privado 1/2, video privado 0/1.
- 9 lecciones con estado `coming_soon` y 1 `published`, todas con `media_type=text`. No hay lecciones multimedia servibles en `academy_lessons` aún.
- 9 perfiles; 31 `entitlements`. No se han consultado ni exportado datos personales.

## Contenidos faltantes concretos
- Pistas pendientes del audiolibro: 02, 03, 04, 16, 17, 21, 22, 23, 24, 25.
- Audio `curso-mujer-faro/volver-al-centro.mp3` sin coincidencia en Storage.
- Video del taller con registro, sin coincidencia física (verificar origen antes de publicar).
- `libro-mujer-faro`: recursos de página 068 en adelante referencian archivos todavía ausentes. No fabricar páginas ni apuntar a otras.
- Algunas referencias pueden ser material deliberadamente pendiente; no eliminar registros.

## Protocolo seguro de corrección
1. Hacer backup recuperable de base y Storage antes de escrituras.
2. Inventariar todas las rutas existentes y los registros de contenido; distinguir `pending`, ausentes y errores de capitalización/ruta.
3. No cambiar `object_path` mediante heurísticas ni crear URLs públicas para medios privados.
4. Conseguir del propietario los archivos faltantes; subir al bucket privado y ruta prevista, con verificación MIME/size/checksum.
5. Resolver la autenticación entre Supabase Eterni y Compás One mediante backend. **Nunca** confiar en correos o IDs enviados por el navegador como prueba de matrícula ni copiar `service_role` al cliente.
6. Probar permisos RLS de lectura, enlaces firmados, expiración, revocación y acceso por no matriculados.
7. Preservar estado no publicado de los cursos; verificar cada recurso antes de publicar.
8. Conservar datos originales y disponer de rollback; no activar cambio de conexión en producción sin QA.

## Consultas de verificación (solo lectura)
```sql
select ca.kind,ca.bucket_id,count(*) total,
       count(*) filter(where o.id is not null) matched,
       count(*) filter(where o.id is null) missing
from public.content_assets ca
left join storage.objects o on o.bucket_id=ca.bucket_id and o.name=ca.object_path
group by ca.kind,ca.bucket_id
order by ca.bucket_id,ca.kind;

select ca.kind,ca.bucket_id,ca.object_path,ca.title
from public.content_assets ca
left join storage.objects o on o.bucket_id=ca.bucket_id and o.name=ca.object_path
where o.id is null order by ca.kind,ca.object_path;

select media_type,status,count(*) total
from public.academy_lessons
group by media_type,status;
```

## Criterios de aceptación
- No hay enlaces a archivos inexistentes en contenido publicado.
- Los 33 audios aparecen con estado veraz (disponible/pendiente), sin enlaces rotos.
- Los lectores de libros muestran únicamente páginas presentes y señalan las incompletas a administración.
- La cuenta de un alumno conserva exactamente sus permisos, sin filtración de archivos entre alumnos.
- El catálogo publicado refleja exclusivamente los contenidos autorizados por Guadalupe.
