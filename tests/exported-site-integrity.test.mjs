import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const output = "out";
const prefix = "/Guadalupe-pagina";
const pages = [
  "index.html",
  "academia/index.html",
  "academia-guadalupe/index.html",
  "contacto/index.html",
  "coaching-personal/index.html",
  "empresas/index.html",
];
const images = [
  "images/guadalupe-hero.webp",
  "images/guadalupe-hero-mobile.webp",
  "images/guadalupe-trayectoria.webp",
  "images/academia-nicte-ha-logo.webp",
];

test("GitHub Pages export includes priority pages and branded images", () => {
  for (const path of [...pages, ...images]) {
    assert.ok(existsSync(join(output, path)), `Missing exported page/asset: ${path}`);
  }
});

test("priority exported pages retain the correct base path for local navigation", () => {
  for (const path of pages) {
    const html = readFileSync(join(output, path), "utf8");
    assert.ok(html.length > 500, `Exported page is unexpectedly empty: ${path}`);
    assert.doesNotMatch(html, /(?:href|src)=(["'])\/Guadalupe-pagina\/Guadalupe-pagina\//,
      `Repeated deployment prefix in ${path}`);
    for (const match of html.matchAll(/\b(?:href|src)=(["'])(\/[^"']+)\1/g)) {
      const url = match[2];
      if (url.startsWith("//")) continue;
      assert.ok(url === prefix || url.startsWith(prefix + "/"),
        `Unprefixed local URL ${url} in ${path}`);
    }
  }
});

test("Nicté Ha links to an exported campus entrypoint", () => {
  const html = readFileSync(join(output, "academia/index.html"), "utf8");
  assert.match(html, /Guadalupe-pagina\/academia-guadalupe\//);
  assert.ok(existsSync(join(output, "academia-guadalupe/index.html")));
});
