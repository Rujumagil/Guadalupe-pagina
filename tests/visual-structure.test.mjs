import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const file = path => readFileSync(path, "utf8");

test("CSS modules retain original cascade order", () => {
  const layout = file("app/layout.tsx");
  const paths = [
    "@/styles/globals.css",
    "@/styles/home-experiences.css",
    "@/styles/service-landings.css",
    "@/styles/academy-legacy.css",
    "@/styles/comercial.css",
    "@/styles/contact-bubbles.css",
  ];
  let last = -1;
  for (const path of paths) {
    const index = layout.indexOf('import "' + path + '"');
    assert.ok(index > last, "Missing or misordered CSS import: " + path);
    last = index;
  }
});

test("main navigation has tablet and phone breakpoints", () => {
  const css = file("styles/academy-legacy.css") + file("styles/globals.css");
  assert.match(css, /max-width:1250px/);
  assert.match(css, /max-width:700px/);
  assert.match(file("components/Header.tsx"), /aria-expanded={open}/);
});

test("Nicté Ha maintains accessible header and mobile grid", () => {
  const css = file("app/academia/academia.css");
  const page = file("app/academia/page.tsx");
  assert.match(css, /@media\(max-width:1160px\)/);
  assert.match(css, /@media\(max-width:680px\)/);
  assert.match(css, /@media\(max-width:800px\)/);
  assert.match(css, /\.nh-program-grid/);
  assert.match(page, /aria-label="Navegación de Academia Nicté Ha"/);
  assert.match(page, /alt="Guadalupe Gómez Pezuela"/);
});

test("service imagery uses responsive cover behavior", () => {
  const css = file("styles/comercial.css");
  assert.match(css, /\.g-hero-photo img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(css, /@media\(max-width:\s*900px\)/);
  assert.match(css, /@media\(max-width:\s*600px\)/);
});
