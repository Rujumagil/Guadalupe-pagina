import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root="public/academia-guadalupe/";
const file=name=>readFileSync(root+name,"utf8");
const landing=file("index.html"),app=file("aula.html"),js=file("aula.js"),catalog=file("catalog.js"),config=file("config.js"),css=file("academy.css");
const migration=readFileSync("supabase/migrations/202610180001_ggp_academy_foundation.sql","utf8");

test("Academia Guadalupe has its own branding and access",()=>{
 assert.match(landing,/Academia Guadalupe Gómez Pezuela/);
 assert.match(app,/Mi aprendizaje/);
 assert.match(app,/signUpTab/);
 assert.match(app,/forgotPassword/);
 assert.match(app,/id="adminTab"/);
 assert.match(css,/\.academy-hero/);
});
test("Course catalog only shows published programs",()=>{
 assert.match(catalog,/status:"eq.published"/);
 assert.match(catalog,/createElement/);
 assert.doesNotMatch(catalog,/innerHTML\s*=/);
});
test("Authorizations use Supabase RLS and no elevated credentials",()=>{
 assert.match(js,/workspace_members/);
 assert.match(js,/ggp_academy_enrollments/);
 assert.match(js,/hasCourse/);
 assert.match(js,/\/auth\/v1\/user/);
 assert.match(js,/Bearer/);
 assert.match(config,/panel\/config\.js/);
 assert.doesNotMatch(config,/sb_secret_|service_role/);
 assert.doesNotMatch(js,/sb_secret_|service_role/);
});
test("Courses, lessons, matriculation and progress all implemented",()=>{
 for(const table of ["ggp_academy_courses","ggp_academy_modules","ggp_academy_lessons","ggp_academy_students","ggp_academy_enrollments","ggp_academy_progress"]){
  assert.match(js,new RegExp(table));assert.match(migration,new RegExp(table));
 }
 assert.match(js,/Marcar lección como completada/);
 assert.match(js,/Crear programa en borrador/);
 assert.match(js,/Asignar matrícula/);
 assert.match(migration,/enable row level security/g);
});
test("Sensitive learner content uses safe DOM primitives",()=>{
 assert.doesNotMatch(js,/\.innerHTML\s*=/);
 assert.doesNotMatch(catalog,/\.innerHTML\s*=/);
 assert.match(js,/textContent/);
 assert.doesNotMatch(app,/MetaPixel|facebook|cloudflareinsights/i);
});

test("Academy staff roles do not grant broad CRM access",()=>{
 const staff=readFileSync("supabase/migrations/202610180003_ggp_academy_staff.sql","utf8");
 assert.match(staff,/ggp_academy_staff/);
 assert.match(staff,/ggp_academy_can_grant_staff/);
 assert.match(staff,/workspace_members/);
 assert.match(js,/Revocar acceso/);
});
test("Private course media uses constrained bucket and temporary signed links",()=>{
 const storage=readFileSync("supabase/migrations/202610180002_ggp_private_media.sql","utf8");
 assert.match(storage,/public\.ggp_academy_enrolled/);
 assert.match(storage,/ggp-academy-private/);
 assert.match(storage,/false,262144000/);
 assert.match(js,/signedMedia/);
 assert.match(js,/expiresIn:120/);
 assert.match(js,/uploadMedia/);
});
