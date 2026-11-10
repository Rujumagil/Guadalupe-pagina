-- Cuaderno privado de Nicté Ha: cada estudiante solo accede a sus respuestas.
create table if not exists public.ggp_academy_workbook_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  course_id uuid not null,
  lesson_id uuid not null,
  student_id uuid not null references auth.users(id) on delete cascade,
  response text not null default '' check (char_length(response) <= 20000),
  status text not null default 'draft' check (status in ('draft', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (lesson_id,course_id,workspace_id)
    references public.ggp_academy_lessons(id,course_id,workspace_id) on delete cascade,
  foreign key (course_id,workspace_id,student_id)
    references public.ggp_academy_enrollments(course_id,workspace_id,student_id) on delete cascade,
  unique(student_id,lesson_id)
);

create index if not exists idx_ggp_workbook_student_course
  on public.ggp_academy_workbook_entries(student_id,course_id,status);

alter table public.ggp_academy_workbook_entries enable row level security;
revoke all on public.ggp_academy_workbook_entries from anon,authenticated;
grant select,insert,update on public.ggp_academy_workbook_entries to authenticated;

create policy ggp_workbook_self_read on public.ggp_academy_workbook_entries
  for select to authenticated
  using (student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id));
create policy ggp_workbook_self_insert on public.ggp_academy_workbook_entries
  for insert to authenticated
  with check (student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id));
create policy ggp_workbook_self_update on public.ggp_academy_workbook_entries
  for update to authenticated
  using (student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id))
  with check (student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id));
