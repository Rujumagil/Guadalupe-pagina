# Identidad oficial confirmada — Guadalupe Gómez Pezuela

Confirmación expresa: **18 de octubre de 2026**. La versión aprobada es la firma vertical del documento *Manual de marca Guadalupe Gómez Pezuela · versión 1.0, 2026*, con **flor de loto de cinco pétalos, G integrada, figura humana y descriptor “DESARROLLO HUMANO Y LEGADO”**.

## Fuente de verdad
Los recursos originales del manual son imágenes grandes de 1536 × 1024. Los siguientes archivos de este repositorio **son versiones optimizadas para web** (derivadas proporcionalmente, sin reilustrar el símbolo, editar tipografía ni alterar su geometría):
- /images/guadalupe-logo-oficial-principal.webp — fondo marfil, flor/G verde y figura/detalles dorados
- /images/guadalupe-logo-oficial-invertido.webp — fondo verde petróleo, firma en marfil y dorado
- /images/guadalupe-isotipo-oficial.webp — símbolo original sobre fondo marfil, para espacios pequeños
- /favicon.ico — recorte proporcional del isotipo oficial

La compresión web es para navegación; para impresos, diplomas y piezas de gran formato se debe utilizar el archivo original de alta resolución del manual, no ampliar la miniatura WebP.

## Paleta
- Principal: Verde petróleo \`#315F59\`
- Secundario/acento: Dorado tenue \`#B79A63\`
- Texto: Carbón \`#202827\`
- Fondo: Marfil \`#FAF9F6\`
- Alternancia suave: Gris verde \`#F4F7F5\`

Proporción sugerida: 70% fondos claros/neutros, 20% verde petróleo, 10% dorado.

## Uso
- Fondos claros: logo oficial principal.
- Fondos oscuros: logo invertido, sin aplicar efectos a la imagen.
- Los cristales/esmerilados y demás efectos se aplican a las **tarjetas**, nunca al logotipo.
- No recortar, estirar, superponer, sombrear, alterar el color, reproducir mediante letras sueltas ni recrear el loto.
- Usar \`object-fit: contain\`, proporción vertical 340×227 en los archivos web, y área de seguridad.
- Manual: logo firma completa con ancho recomendado mínimo 180 px digital; isotipo desde 48 px.
- Evitar el logo horizontal anterior (no coincide con la versión aprobada).

## Aplicación técnica
- \`config/branding.ts\` es la fuente canónica para sitio Next.js.
- Todas las rutas de \`public/academia-guadalupe\` usan rutas relativas al WebP oficial; incluye login, dashboard, cursos, libros, comunidad, perfil y editor.
- \`public/panel\` usa logo invertido con base verde petróleo.
- Se reemplaza el favicon legado por el isotipo autorizado.
- Paleta de los componentes y tokens de la web y ambas aplicaciones corregida. La academia mantiene el concepto cinematográfico + vidrio, con un entorno verde petróleo y acentos dorados.
- El usuario no debe tener que borrar credenciales ni cambiar workspaces; solo los archivos de diseño.

## QA
\`\`\`sh
node --test tests/guadalupe-brand.test.mjs
npm run typecheck
npm run lint
npm run build
\`\`\`

**No eliminar recursos usados por páginas antiguas sin auditoría**: los archivos PNG anteriores se mantienen solo como legado, y el test comprueba que no se referencian desde las interfaces principales.
