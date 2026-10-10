# Documentación técnica — ETERNI Web

## 1. Objetivo de esta arquitectura

La versión anterior concentraba gran parte de la página en archivos HTML extensos. Esta refactorización separa **estructura, presentación, contenido y configuración** para que el mantenimiento no dependa de conocer todo el proyecto.

La arquitectura tiene cuatro capas:

1. **`app/`**: rutas y composición de páginas.
2. **`components/`**: bloques visuales reutilizables.
3. **`content/`**: contenido editorial/comercial editable.
4. **`config/`**: datos globales y configuración del sitio.

El objetivo es que un programador pueda encontrar el origen de un texto, enlace o sección en segundos.

---

## 2. Fuente de verdad

### Datos globales — `config/site.ts`
Aquí viven:

- dominio principal
- correo de Guadalupe
- número de WhatsApp
- URL de Academia
- Meta Pixel
- descripción SEO global

Nunca dupliques estos datos en distintos componentes.

### Identidad visual — `config/branding.ts`
Centraliza:

- colores
- tipografías de referencia
- ruta del logo

El CSS conserva la apariencia actual de la página y usa las variables principales de marca.

### Navegación — `config/navigation.ts`
Todo el menú principal vive aquí. Para agregar, quitar o reordenar un enlace se modifica un solo archivo.

### Home — `content/home.ts`
Contiene:

- hero
- cifras de autoridad
- rutas de necesidad
- presentación de Guadalupe
- credenciales
- trayectoria
- proceso de acompañamiento
- CTA final
- recursos destacados

### Servicios — `content/services.ts`
Contiene el catálogo visible y los datos usados por las páginas individuales de servicio.

### Eventos — `content/events.ts`
Mientras no haya una nueva campaña aprobada, el estado oficial es:

```ts
title: "Próximamente"
```

No deben agregarse fechas, nombres, imágenes, enlaces de registro ni copies de campañas anteriores.

### Testimonios — `content/testimonials.ts`
El arreglo se deja vacío deliberadamente. Solo deben publicarse testimonios reales y autorizados.

---

## 3. Componentes

### `Header.tsx`
- logo
- menú desktop/móvil
- CTA principal
- navegación obtenida desde `config/navigation.ts`

### `Hero.tsx`
- presentación principal de Guadalupe
- foto desktop/móvil
- CTA de sesión

### `Authority.tsx`
- cifras y credenciales resumidas

### `Events.tsx`
- único bloque de próximo evento en el home
- actualmente muestra “Próximamente”
- el contenido se controla desde `content/events.ts`

### `HelpPaths.tsx`
- tres necesidades principales para orientar al visitante

### `About.tsx`
- biografía profesional
- credenciales
- trayectoria

### `Process.tsx`
- explica el flujo de acompañamiento en tres pasos

### `Services.tsx`
- listado reutilizable de servicios

### `Testimonials.tsx`
- si no existen testimonios autorizados, el componente no renderiza nada

### `Resources.tsx`
- recursos destacados del home

### `CTA.tsx`
- llamada a la acción principal antes del cierre

### `Footer.tsx`
- navegación secundaria
- contacto
- acceso a Academia
- enlaces legales heredados

### `WhatsAppButton.tsx`
- botón flotante
- enlace generado desde el WhatsApp global
- medición `Contact`

### `TrackedLink.tsx`
- enlace reutilizable para llamadas a la acción
- dispara evento Meta Pixel si `fbq` está disponible

### `MetaPixel.tsx`
- carga el Pixel una sola vez desde el layout raíz

---

## 4. Rutas

| Ruta | Propósito |
|---|---|
| `/` | Página principal de Guadalupe |
| `/servicios/` | Catálogo de acompañamientos |
| `/coaching-personal/` | Servicio individual |
| `/liderazgo-desarrollo-profesional/` | Desarrollo profesional |
| `/cursos-talleres-conferencias/` | Formación y conferencias |
| `/programacion-neurolinguistica-pnl/` | PNL |
| `/recursos/` | Recursos editoriales |
| `/podcast/` | Podcast |
| `/legado/` | Proyecto de legado |
| `/webinar/` | Contenedor del próximo evento; por ahora “Próximamente” |

No debe reintroducirse una ruta histórica de campaña dentro del sitemap.

---

## 5. SEO

`app/layout.tsx` contiene la metadata global.

`app/sitemap.ts` declara únicamente las rutas vigentes.

`app/robots.ts` permite indexación del sitio y referencia el sitemap.

Las páginas pueden declarar su propio `metadata` sin tocar el layout global.

Cuando se active un nuevo evento:

1. actualizar `content/events.ts`
2. actualizar la página `/webinar/`
3. revisar metadata de `/webinar/`
4. confirmar que sitemap y canonical sean correctos
5. validar que no existan datos vencidos en otros archivos

---

## 6. Analítica y WhatsApp

El número, email y Meta Pixel están centralizados en `config/site.ts`.

`buildWhatsAppUrl()` genera mensajes prellenados sin repetir el número en cada archivo.

Todos los CTA de WhatsApp que requieren medición deben usar `TrackedLink`.

Eventos usados:

- `PageView`: carga general
- `Lead`: CTA de orientación/servicios
- `Contact`: botón flotante de WhatsApp

---

## 7. Estilos

`styles/globals.css` conserva la base visual actual y contiene la adaptación para los nuevos componentes.

Evitar:

- estilos inline extensos
- colores hexadecimales repetidos dentro de componentes
- CSS duplicado por página
- crear una hoja de estilos diferente para cada cambio pequeño

Si el proyecto crece, la siguiente evolución recomendada es dividir `globals.css` por dominios visuales (`layout.css`, `components.css`, `pages.css`) sin cambiar la API de los componentes.

---

## 8. Imágenes

Todas las imágenes nuevas deben almacenarse en:

```text
public/images/
```

Y consumirse con rutas como:

```text
/images/nombre-del-archivo.webp
```

Reglas:

- usar WebP/AVIF cuando sea posible
- incluir versión móvil cuando la composición lo requiera
- usar nombres descriptivos
- no incrustar imágenes como base64 en componentes

---

## 9. Archivos heredados que no deben perderse durante la migración

La migración desde el sitio estático debe conservar cualquier archivo de infraestructura o legal ya aprobado que siga en producción, por ejemplo:

- `_headers`
- configuración de Cloudflare
- archivos de privacidad y términos
- manifest/favicons vigentes
- configuraciones de servicios externos

Estos elementos no se recrean desde el contenido editorial y deben copiarse desde el repositorio productivo antes de sustituir el deployment.

---

## 10. Checklist antes de publicar

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. revisar `/` en escritorio y móvil
5. revisar `/webinar/` y confirmar que solo muestre el estado vigente
6. probar WhatsApp principal
7. probar Academia
8. probar páginas de servicios
9. confirmar que los archivos legales sigan accesibles
10. revisar `sitemap.xml`
11. revisar `robots.txt`
12. buscar textos o rutas de campañas vencidas en todo el repositorio

Comando recomendado:

```bash
grep -RniE "campaña-vencida|fecha-vencida|ruta-vencida" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out
```

---

## 11. Principio de trabajo para futuros programadores

Antes de editar un componente, determina qué tipo de cambio es:

- **texto** → `content/`
- **enlace/configuración** → `config/`
- **estructura visual** → `components/`
- **ruta** → `app/`
- **estilo** → `styles/`
- **imagen** → `public/images/`

Con esta regla, el proyecto puede crecer sin volver a convertirse en una sola página difícil de mantener.
