import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync("out/index.html", "utf8");
const PREFIX = "/Guadalupe-pagina";
const attrUrls = (tag, attribute) =>
  [...html.matchAll(new RegExp("<" + tag + "\\b[^>]*?\\b" + attribute + "=[\"']([^\"']+)[\"'][^>]*>", "gi"))]
    .map(match => match[1]);
const scripts = attrUrls("script", "src").filter(s => s.includes("_next/static"));
const css = attrUrls("link", "href").filter(s => s.endsWith(".css") && s.includes("_next/static"));
const fromUrl = (url) => "out" + new URL(url,"https://rujumagil.github.io").pathname.slice(PREFIX.length);

test("Next JS assets have the proper repository URL prefix, not site-root URLs",()=>{
  assert.ok(scripts.length > 0, "Page must include Next JS bundles, otherwise interactive buttons cannot hydrate");
  for (const url of [...scripts, ...css]) {
    assert.ok(url.startsWith(PREFIX + "/_next/static/"), "Bad asset path: " + url);
    assert.ok(existsSync(fromUrl(url)), "Unpublished referenced asset: " + url);
  }
});

test("HTML does not contain doubled GitHub Pages prefix", () => {
  assert.doesNotMatch(html, /\/Guadalupe-pagina\/Guadalupe-pagina\//);
});

test("Interactive Andy and navigation code is actually present in compiled JavaScript",()=>{
  const chunks = join("out","_next","static","chunks");
  assert.ok(existsSync(chunks), "Compiled JS chunks missing");
  function* jsFiles(path) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const p = join(path, entry.name);
      if (entry.isDirectory()) yield* jsFiles(p);
      else if (entry.isFile() && entry.name.endsWith(".js")) yield p;
    }
  }
  let found = false;
  for (const path of jsFiles(chunks)) {
    const source = readFileSync(path,"utf8");
    if (source.includes("guadalupe-andy-panel") && source.includes("Conectando con Andy")) {
      found = true;
      break;
    }
  }
  assert.ok(found, "Expected Andy React client code was not compiled");
});

test("Site static links have correct GitHub Pages base path",()=>{
  assert.match(html,/href="\/Guadalupe-pagina\/coaching-personal\/?"/);
  assert.match(html,/href="\/Guadalupe-pagina\/academia-guadalupe\/?"/);
});
