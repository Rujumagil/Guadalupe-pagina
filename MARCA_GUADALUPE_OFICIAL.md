# Marca oficial Guadalupe Gómez Pezuela — Actualización 2026

## Logotipo vigente
La firma visual aprobada por el usuario es **Guadalupe Gómez Pezuela** con el descriptor:

**COACH EJECUTIVA Y DE VIDA**

Este descriptor reemplaza **DESARROLLO HUMANO Y LEGADO** **en el logotipo**, sin eliminar el legado y el desarrollo humano como posibles temas del contenido editorial.

La imagen aprobada conserva la composición de loto de cinco pétalos, G central, figura humana en oro, nombre serif, filete dorado y descriptor en letras espaciadas.

## Recursos para el sitio
- `public/images/guadalupe-coach-ejecutiva-principal.svg` — firma verde y oro, con fondo transparente para superficies claras.
- `public/images/guadalupe-coach-ejecutiva-invertido.svg` — versión marfil y oro, con fondo transparente para superficies verde petróleo u oscuras.
- `public/images/guadalupe-isotipo-oficial.webp` — símbolo oficial para tamaños reducidos; favicon anterior conservado.
- Se preservan los archivos WebP/PNG antiguos en el repositorio como respaldo histórico, **sin usarlos en las páginas principales**.

Los archivos SVG son una **vectorización optimizada** de la imagen aprobada en esta conversación (sin cambio intencional de composición). Para impresión a gran escala, antes de producir piezas finales, revisar trazos y espaciado sobre la imagen maestra, pues el trazado automático puede simplificar algunos detalles.

## Paleta
- Verde petróleo: `#315F59`
- Verde de la ilustración: `#075448`
- Dorado: `#B79A63`
- Marfil en logo invertido: `#F7F8F4`
- Carbón: `#202827`
- Fondo cálido: `#FAF9F6`

## Uso y accesibilidad
- Fondo claro: versión principal.
- Fondo oscuro: versión invertida; nunca invertir toda la imagen con un filtro, ya que altera el oro.
- Mantener proporción `1305 / 830`, `object-fit: contain`, fondo transparente y área de seguridad.
- No estirar ni añadir sombras o cristal sobre el símbolo.
- No colocar texto nuevo encima del logo. La descripción de servicios puede ir aparte.
- Texto alternativo recomendado: «Guadalupe Gómez Pezuela, coach ejecutiva y de vida».
- Configuración canónica de Next: `config/branding.ts`.

## Dónde se aplica
Página web pública, menú y footer; acceso principal y páginas de la Academia Guadalupe; CRM de Guadalupe; avisos legales; título de inicio, descripción y manifiesto de la aplicación.

## Control de calidad
```sh
node --test tests/guadalupe-brand.test.mjs
npm run lint
npm run build
```
GitHub Pages se compila con `GUADALUPE_GITHUB_PAGES=true`; en otras plataformas no se fuerza la subruta de GitHub Pages.
