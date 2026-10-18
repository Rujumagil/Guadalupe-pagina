-- Academia Guadalupe: dominio academico aislado dentro de Compas One (Supabase).
-- Aislamiento RLS en todas las tablas. No modifica tablas de ETERNI.
create extension if not exists pgcrypto;

create table if not exists public.ggp_academy_courses (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  slug text not null check (slug ~ '^[a-z0-9-]{3,100}$'),
  title text not null check(length(btrim(title)) between 3 and 160),
  summary text not null default '',
  category text not null default 'Desarrollo personal',
  level text not null default 'Todos los niveles',
  duration_minutes integer not null default 0 check(duration_minutes between 0 and 100000),
  cover_url text,
  status text not null default 'draft' check(status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, workspace_id),
  unique (workspace_id, slug)
);
create table if not exists public.ggp_academy_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  workspace_id uuid not null,
  title text not null check (length(btrim(title)) between 2 and 160),
  position integer not null default 1 check(position > 0),
  created_at timestamptz not null default now(),
  foreign key (course_id,workspace_id) references public.ggp_academy_courses(id,workspace_id) on delete cascade,
  unique(id,course_id,workspace_id),
  unique(course_id,position)
);
create table if not exists public.ggp_academy_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null,
  course_id uuid not null,
  workspace_id uuid not null,
  title text not null check(length(btrim(title)) between 2 and 160),
  lesson_type text not null default 'text' check(lesson_type in ('text','video','audio','exercise')),
  content text not null default '',
  media_path text,
  estimated_minutes integer not null default 0 check(estimated_minutes between 0 and 2000),
  position integer not null default 1 check(position > 0),
  created_at timestamptz not null default now(),
  foreign key(module_id,course_id,workspace_id) references public.ggp_academy_modules(id,course_id,workspace_id) on delete cascade,
  unique(id,course_id,workspace_id),
  unique(module_id,position)
);
create table if not exists public.ggp_academy_students (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id),
  display_name text not null check(length(btrim(display_name)) between 2 and 160),
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.ggp_academy_enrollments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  course_id uuid not null,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check(status in ('active','paused','completed','revoked')),
  enrolled_at timestamptz not null default now(),
  expires_at timestamptz,
  granted_by uuid references auth.users(id),
  foreign key(course_id,workspace_id) references public.ggp_academy_courses(id,workspace_id) on delete cascade,
  unique(course_id,student_id),
  unique(course_id,workspace_id,student_id)
);
create table if not exists public.ggp_academy_progress (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  course_id uuid not null,
  lesson_id uuid not null,
  student_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  foreign key(lesson_id,course_id,workspace_id) references public.ggp_academy_lessons(id,course_id,workspace_id) on delete cascade,
  foreign key(course_id,workspace_id,student_id) references public.ggp_academy_enrollments(course_id,workspace_id,student_id) on delete cascade,
  unique(student_id,lesson_id)
);

create index if not exists idx_ggp_courses_visible on public.ggp_academy_courses(workspace_id,status);
create index if not exists idx_ggp_modules_course on public.ggp_academy_modules(course_id,position);
create index if not exists idx_ggp_lessons_course on public.ggp_academy_lessons(course_id,module_id,position);
create index if not exists idx_ggp_enrollments_student on public.ggp_academy_enrollments(student_id,status);
create index if not exists idx_ggp_progress_student_course on public.ggp_academy_progress(student_id,course_id);

create or replace function public.ggp_academy_is_admin(target_workspace uuid)
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.workspaces w
    join public.workspace_members m on m.workspace_id=w.id
    where w.id=target_workspace and w.slug='guadalupe-gomez-pezuela'
      and m.user_id=(select auth.uid()) and m.status='active'
      and m.role in ('owner','admin')
  );
$$;
create or replace function public.ggp_academy_enrolled(target_course uuid)
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1
      from public.ggp_academy_enrollments e
      join public.ggp_academy_courses c on c.id=e.course_id and c.workspace_id=e.workspace_id
      join public.workspaces w on w.id=e.workspace_id
     where e.course_id=target_course and e.student_id=(select auth.uid())
       and w.slug='guadalupe-gomez-pezuela' and c.status='published'
       and e.status in ('active','completed')
       and (e.expires_at is null or e.expires_at>now())
  );
$$;
create or replace function public.ggp_academy_is_admin()
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.workspaces w join public.workspace_members m on m.workspace_id=w.id
     where w.slug='guadalupe-gomez-pezuela'
       and m.user_id=(select auth.uid()) and m.status='active'
       and m.role in ('owner','admin')
  );
$$;
revoke all on function public.ggp_academy_is_admin(uuid), public.ggp_academy_is_admin(), public.ggp_academy_enrolled(uuid) from public;
grant execute on function public.ggp_academy_is_admin(uuid), public.ggp_academy_is_admin(), public.ggp_academy_enrolled(uuid) to anon,authenticated;

alter table public.ggp_academy_courses enable row level security;
alter table public.ggp_academy_modules enable row level security;
alter table public.ggp_academy_lessons enable row level security;
alter table public.ggp_academy_students enable row level security;
alter table public.ggp_academy_enrollments enable row level security;
alter table public.ggp_academy_progress enable row level security;

revoke all on public.ggp_academy_courses,public.ggp_academy_modules,public.ggp_academy_lessons,public.ggp_academy_students,public.ggp_academy_enrollments,public.ggp_academy_progress from anon,authenticated;
grant select on public.ggp_academy_courses,public.ggp_academy_modules to anon;
grant select,insert,update,delete on public.ggp_academy_courses,public.ggp_academy_modules,public.ggp_academy_lessons,public.ggp_academy_enrollments to authenticated;
grant select,insert,update on public.ggp_academy_students,public.ggp_academy_progress to authenticated;

create policy ggp_course_read on public.ggp_academy_courses for select to anon,authenticated
  using (status='published' or (select public.ggp_academy_is_admin(workspace_id)));
create policy ggp_course_write on public.ggp_academy_courses for insert to authenticated
  with check ((select public.ggp_academy_is_admin(workspace_id)));
create policy ggp_course_modify on public.ggp_academy_courses for update to authenticated
  using (public.ggp_academy_is_admin(workspace_id)) with check (public.ggp_academy_is_admin(workspace_id));
create policy ggp_course_delete on public.ggp_academy_courses for delete to authenticated
  using (public.ggp_academy_is_admin(workspace_id));

create policy ggp_module_read on public.ggp_academy_modules for select to anon,authenticated
  using (public.ggp_academy_is_admin(workspace_id) or
    exists(select 1 from public.ggp_academy_courses c where c.id=course_id and c.status='published'));
create policy ggp_module_insert on public.ggp_academy_modules for insert to authenticated
  with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_module_update on public.ggp_academy_modules for update to authenticated
  using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_module_delete on public.ggp_academy_modules for delete to authenticated
  using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_lesson_read on public.ggp_academy_lessons for select to authenticated
  using(public.ggp_academy_is_admin(workspace_id) or public.ggp_academy_enrolled(course_id));
create policy ggp_lesson_insert on public.ggp_academy_lessons for insert to authenticated
  with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_lesson_update on public.ggp_academy_lessons for update to authenticated
  using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_lesson_delete on public.ggp_academy_lessons for delete to authenticated
  using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_student_read on public.ggp_academy_students for select to authenticated
  using(user_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id));
create policy ggp_student_insert on public.ggp_academy_students for insert to authenticated
  with check(user_id=(select auth.uid()) and
    workspace_id in (select w.id from public.workspaces w where w.slug='guadalupe-gomez-pezuela')
    and email=(select auth.jwt()->>'email'));
create policy ggp_student_update on public.ggp_academy_students for update to authenticated
  using(user_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id))
  with check((user_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id)) and
    workspace_id in (select w.id from public.workspaces w where w.slug='guadalupe-gomez-pezuela')
    and (public.ggp_academy_is_admin(workspace_id) or email=(select auth.jwt()->>'email')));

create policy ggp_enrollment_read on public.ggp_academy_enrollments for select to authenticated
  using(student_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id));
create policy ggp_enrollment_insert on public.ggp_academy_enrollments for insert to authenticated
  with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_enrollment_update on public.ggp_academy_enrollments for update to authenticated
  using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_enrollment_delete on public.ggp_academy_enrollments for delete to authenticated
  using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_progress_read on public.ggp_academy_progress for select to authenticated
  using(student_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id));
create policy ggp_progress_insert on public.ggp_academy_progress for insert to authenticated
  with check(student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id));
create policy ggp_progress_update on public.ggp_academy_progress for update to authenticated
  using(student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id))
  with check(student_id=(select auth.uid()) and public.ggp_academy_enrolled(course_id));
