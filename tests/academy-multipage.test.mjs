import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const root="public/academia-guadalupe/";
const read=path=>readFileSync(root+path,"utf8");
const pages=["inicio","cursos","mi-curso","libros","comunidad","progreso","perfil","administracion","leccion"];

test("academy root is exclusively a login/registration entry",()=>{
 const home=read("index.html");
 assert.match(home,/id="authForm"/);
 assert.match(home,/id="registerTab"/);
 assert.match(home,/id="resetForm"/);
 assert.match(home,/portal-login\.js/);
 assert.doesNotMatch(home,/id="catalogGrid"/);
});
test("every academy section has an actual independent URL and sidebar",()=>{
 for(const page of pages){
  assert.equal(existsSync(root+page+".html"),true);
  const html=read(page+".html");
  assert.match(html,new RegExp('data-page="'+page+'"'));
  assert.match(html,/class="sidebar"/);
  assert.match(html,/portal-app\.js/);
  assert.match(html,/noindex,nofollow/);
 }
 const dashboard=read("inicio.html");
 for(const section of ["cursos","mi-curso","libros","comunidad","progreso","perfil"]){
  assert.match(dashboard,new RegExp('href="./'+section+'\\.html"'));
 }
});
test("glass styling includes responsive sidebar and reduced motion",()=>{
 const css=read("portal.css");
 for(const cls of [".glass",".sidebar",".hero-feature",".media-card",".mobile-nav",".auth-card"]){
  assert.ok(css.includes(cls));
 }
 assert.match(css,/backdrop-filter:blur/);
 assert.match(css,/prefers-reduced-motion/);
});
test("student rights are backed by Supabase RLS, not frontend unlock switches",()=>{
 const core=read("portal-core.js"),app=read("portal-app.js");
 for(const table of ["ggp_academy_courses","ggp_academy_enrollments","ggp_academy_progress","ggp_academy_book_grants","ggp_academy_community_members"])
  assert.ok(core.includes(table));
 assert.match(core,/Authorization:"Bearer "/);
 assert.match(app,/enrolled\(ctx,store,c\)/);
 assert.match(app,/secureMedia/);
 assert.match(app,/Mis cursos/);
 assert.doesNotMatch(app,/innerHTML\s*=/);
 assert.doesNotMatch(core,/service_role|sb_secret_/);
});
test("community and books have separate access control schema",()=>{
 const migration=readFileSync("supabase/migrations/202610180004_ggp_library_community.sql","utf8");
 for(const table of ["ggp_academy_books","ggp_academy_book_grants","ggp_academy_community_members","ggp_academy_community_posts","ggp_academy_community_replies"])
  assert.ok(migration.includes(table));
 assert.match(migration,/enable row level security/g);
 assert.match(migration,/ggp_book_private_download/);
});
test("login and app keep separate protected contexts",()=>{
 const login=read("portal-login.js"),app=read("portal-app.js");
 assert.match(login,/location\.replace\("\.\/inicio\.html"\)/);
 assert.match(app,/if\(!hasSession\(\)\)/);
 assert.match(app,/ctx\.isAdmin/);
 assert.match(login,/requestRecovery/);
});
