# ETERNI Web — Guadalupe Gómez Pezuela

Refactorización de la página pública de Guadalupe / ETERNI en **Next.js App Router + TypeScript**, organizada para que cualquier programador pueda localizar rápidamente:

- estructura y páginas en `app/`
- piezas visuales reutilizables en `components/`
- textos editables en `content/`
- datos globales, enlaces y marca en `config/`
- estilos en `styles/`
- imágenes y archivos públicos en `public/`

La página conserva el enfoque actual de **marca personal de Guadalupe**, con ETERNI como ecosistema de respaldo. El bloque de evento activo queda deliberadamente en estado **“Próximamente”** hasta que exista una nueva campaña aprobada.

## Inicio rápido

```bash
npm install
npm run dev
```

Producción:

```bash
npm run typecheck
npm run lint
npm run build
```

El proyecto usa `output: "export"`; al compilar genera una carpeta `out/` apta para hosting estático.

## Estructura

```text
eterni-web/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── webinar/
│   ├── legado/
│   ├── servicios/
│   ├── coaching-personal/
│   ├── liderazgo-desarrollo-profesional/
│   ├── cursos-talleres-conferencias/
│   ├── programacion-neurolinguistica-pnl/
│   ├── recursos/
│   ├── podcast/
│   ├── robots.ts
│   ├── sitemap.ts
│   └── not-found.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Authority.tsx
│   ├── Events.tsx
│   ├── HelpPaths.tsx
│   ├── About.tsx
│   ├── Process.tsx
│   ├── Services.tsx
│   ├── Testimonials.tsx
│   ├── Resources.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   ├── MetaPixel.tsx
│   ├── TrackedLink.tsx
│   ├── ServiceDetail.tsx
│   └── ComingSoon.tsx
├── content/
│   ├── home.ts
│   ├── services.ts
│   ├── testimonials.ts
│   └── events.ts
├── config/
│   ├── branding.ts
│   ├── navigation.ts
│   └── site.ts
├── styles/
│   └── globals.css
├── public/
│   └── images/
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── DOCUMENTACION.md
```

## Regla principal de mantenimiento

**No colocar textos comerciales largos directamente dentro de los componentes.**

- Para cambiar textos del home: `content/home.ts`
- Para cambiar servicios: `content/services.ts`
- Para activar un próximo evento: `content/events.ts`
- Para cargar testimonios reales: `content/testimonials.ts`
- Para cambiar WhatsApp, correo, dominio, academia o Pixel: `config/site.ts`
- Para cambiar menú: `config/navigation.ts`
- Para cambiar paleta/logo: `config/branding.ts`

Consulta `DOCUMENTACION.md` antes de modificar la arquitectura.
