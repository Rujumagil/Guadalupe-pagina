import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const portal = readFileSync("public/panel/index.html", "utf8");
const app = readFileSync("public/panel/panel.js", "utf8");
const cfg = readFileSync("public/panel/config.js", "utf8");
const css = readFileSync("public/panel/panel.css", "utf8");
const headers = readFileSync("public/_headers", "utf8");
const sw = readFileSync("public/sw.js", "utf8");

test("independent branded CRM has private login", () => {
  assert.match(portal, /name="robots" content="noindex,nofollow/);
  assert.match(portal, /id="loginForm"/);
  assert.match(portal, /id="portal"/);
  assert.match(portal, /guadalupe-logo-invertido/);
  assert.match(portal, /panel\.js/);
  assert.match(css, /\.mobile-nav/);
});
test("all requested modules appear in Guadalupe portal", () => {
  for(const area of ["clientes","mensajes","reservas","calendario","trafico","agentes"]) {
    assert.match(portal,new RegExp('data-page="'+area+'"'));
  }
});
test("data requests are workspace scoped using RLS bearer token", () => {
  assert.match(app,/workspaceQuery\(/);
  assert.match(app,/workspace_id=eq\./);
  assert.match(app,/workspace_members/);
  assert.match(app,/Authorization: "Bearer " \+ bearer/);
  assert.doesNotMatch(cfg,/service_role|sb_secret_/i);
  assert.doesNotMatch(app,/service_role|sb_secret_/i);
});
test("write actions use existing CRM and appointment tables", () => {
  assert.match(app,/db\("contacts"/);
  assert.match(app,/db\("appointments"/);
  assert.match(app,/response\.ok/);
  assert.match(app,/Responder desde Compás One/);
});
test("portal has no marketing scripts and excludes public cache", () => {
  assert.doesNotMatch(portal,/facebook|fbevents|gtag|cloudflareinsights/i);
  assert.match(headers,/\/panel\/\*/);
  assert.match(sw,/panel/);
});
