import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = "out";
const PREFIX = "/Guadalupe-pagina";

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const target = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(target);
    if (entry.isFile() && entry.name.endsWith(".html")) yield target;
  }
}

// Next compila su propio basePath dentro de JS y Link; estos ajustes
// solo añaden prefijo a enlaces/imagenes HTML literales legacy.
// La transformación es idempotente: nunca crea /Guadalupe-pagina/Guadalupe-pagina.
function adjustHtml(markup) {
  return markup.replace(/\b(href|src|srcSet|srcset|poster)=(["'])([^"']+)\2/g, (whole, attribute, quote, value) => {
    if (!value.startsWith("/") || value.startsWith("//") || value.startsWith(PREFIX + "/") || value === PREFIX) return whole;
    if (attribute.toLowerCase() === "srcset") {
      const candidates = value.split(",").map(candidate => candidate.replace(/^(\s*)\/(?!\/|Guadalupe-pagina\/)/, "$1" + PREFIX + "/"));
      return attribute + "=" + quote + candidates.join(",") + quote;
    }
    return attribute + "=" + quote + PREFIX + value + quote;
  });
}

let changed = 0;
for await (const path of htmlFiles(ROOT)) {
  const markup = await readFile(path, "utf8");
  const updated = adjustHtml(markup);
  if (updated !== markup) {
    await writeFile(path, updated, "utf8");
    changed++;
  }
}
console.log("GitHub Pages HTML rewritten (idempotent), pages updated:", changed);
