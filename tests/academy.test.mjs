import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root="public/academia-guadalupe/";
const file=name=>readFileSync(root+name,"utf8");
const landing=file("index.html"),app=file("aula.html"),js=file("aula.js"),catalog=file("catalog.js"),config=file("config.js"),css=file("academy.css");
const migration=readFileSync("supabase/migrations/202610180001_ggp_academy_foundation.sql","utf8");

test("Academia Nicté Ha has its own branding and access",()=>{
 assert.match(landing,/Academia Nicté Ha/);
 assert.match(app,/Mi aprendizaje/);
 assert.match(landing,/academia-nicte-ha-logo\.webp/);
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
  assert.match(migration,new RegExp(table));
 }
 assert.match(migration,/enable row level security/);
});
