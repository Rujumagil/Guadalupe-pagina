-- Ficha editorial privada de un libro por alumno y curso.
create table if not exists public.ggp_academy_manuscripts (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 course_id uuid not null,
 student_id uuid not null references auth.users(id) on delete cascade,
 title text not null default '' check (char_length(title)<=160),
 subtitle text not null default '' check (char_length(subtitle)<=240),
 author_name text not null default '' check (char_length(author_name)<=160),
 dedication text not null default '' check (char_length(dedication)<=5000),
 introduction text not null default '' check (char_length(introduction)<=10000),
 updated_at timestamptz not null default now(),
 foreign key(course_id,workspace_id,student_id)
   references public.ggp_academy_enrollments(course_id,workspace_id,student_id) on delete cascade,
 unique(course_id,student_id)
);
create index if not exists idx_ggp_manuscript_student on public.ggp_academy_manuscripts(student_id,course_id);
alter table public.ggp_academy_manuscripts enable row level security;
revoke all on public.ggp_academy_manuscripts from anon,authenticated;
grant select,insert,update on public.ggp_academy_manuscripts to authenticated;

-- Acceso a curso publicado o vista previa de su propio curso para admin matriculado.
create policy ggp_manuscript_read on public.ggp_academy_manuscripts for select to authenticated
using (student_id=(select auth.uid()) and (
 public.ggp_academy_enrolled(course_id) or
 (public.ggp_academy_is_admin(workspace_id) and exists(
  select 1 from public.ggp_academy_enrollments e where e.course_id=ggp_academy_manuscripts.course_id
   and e.workspace_id=ggp_academy_manuscripts.workspace_id and e.student_id=(select auth.uid())
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
 ))));
create policy ggp_manuscript_insert on public.ggp_academy_manuscripts for insert to authenticated
with check (student_id=(select auth.uid()) and (
 public.ggp_academy_enrolled(course_id) or
 (public.ggp_academy_is_admin(workspace_id) and exists(
  select 1 from public.ggp_academy_enrollments e where e.course_id=ggp_academy_manuscripts.course_id
   and e.workspace_id=ggp_academy_manuscripts.workspace_id and e.student_id=(select auth.uid())
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
 ))));
create policy ggp_manuscript_update on public.ggp_academy_manuscripts for update to authenticated
using (student_id=(select auth.uid()) and (
 public.ggp_academy_enrolled(course_id) or
 (public.ggp_academy_is_admin(workspace_id) and exists(
  select 1 from public.ggp_academy_enrollments e where e.course_id=ggp_academy_manuscripts.course_id
   and e.workspace_id=ggp_academy_manuscripts.workspace_id and e.student_id=(select auth.uid())
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
 ))))
with check (student_id=(select auth.uid()) and (
 public.ggp_academy_enrolled(course_id) or
 (public.ggp_academy_is_admin(workspace_id) and exists(
  select 1 from public.ggp_academy_enrollments e where e.course_id=ggp_academy_manuscripts.course_id
   and e.workspace_id=ggp_academy_manuscripts.workspace_id and e.student_id=(select auth.uid())
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
 ))));
