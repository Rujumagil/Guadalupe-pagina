-- Fotografías privadas para libros personales de Academia Nicté Ha.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('ggp-legado-photos','ggp-legado-photos',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;

create table if not exists public.ggp_academy_manuscript_photos (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 course_id uuid not null,
 student_id uuid not null references auth.users(id) on delete cascade,
 storage_path text not null unique check(char_length(storage_path)<=250),
 caption text not null default '' check(char_length(caption)<=400),
 include_in_book boolean not null default true,
 created_at timestamptz not null default now(),
 foreign key(course_id,workspace_id,student_id)
   references public.ggp_academy_enrollments(course_id,workspace_id,student_id) on delete cascade,
 unique(id,student_id)
);
create index if not exists idx_ggp_photos_owner_course on public.ggp_academy_manuscript_photos(student_id,course_id);
alter table public.ggp_academy_manuscript_photos enable row level security;
revoke all on public.ggp_academy_manuscript_photos from anon,authenticated;
grant select,insert,update on public.ggp_academy_manuscript_photos to authenticated;

create policy ggp_photo_meta_read on public.ggp_academy_manuscript_photos for select to authenticated
using(student_id=(select auth.uid()) and (public.ggp_academy_enrolled(course_id) or public.ggp_academy_is_admin(workspace_id)));
create policy ggp_photo_meta_insert on public.ggp_academy_manuscript_photos for insert to authenticated
with check(student_id=(select auth.uid()) and (public.ggp_academy_enrolled(course_id) or public.ggp_academy_is_admin(workspace_id))
 and storage_path like student_id::text||'/'||course_id::text||'/%');
create policy ggp_photo_meta_update on public.ggp_academy_manuscript_photos for update to authenticated
using(student_id=(select auth.uid()) and (public.ggp_academy_enrolled(course_id) or public.ggp_academy_is_admin(workspace_id)))
with check(student_id=(select auth.uid()) and (public.ggp_academy_enrolled(course_id) or public.ggp_academy_is_admin(workspace_id))
 and storage_path like student_id::text||'/'||course_id::text||'/%');

create policy ggp_photo_object_read on storage.objects for select to authenticated
using(bucket_id='ggp-legado-photos' and split_part(name,'/',1)=(select auth.uid())::text
 and exists(select 1 from public.ggp_academy_enrollments e
   where e.student_id=(select auth.uid()) and e.course_id::text=split_part(name,'/',2)
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
   and (public.ggp_academy_enrolled(e.course_id) or public.ggp_academy_is_admin(e.workspace_id))));
create policy ggp_photo_object_insert on storage.objects for insert to authenticated
with check(bucket_id='ggp-legado-photos'
 and name ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}/[a-f0-9-]{36}[.](jpg|png|webp)$'
 and split_part(name,'/',1)=(select auth.uid())::text
 and exists(select 1 from public.ggp_academy_enrollments e
   where e.student_id=(select auth.uid()) and e.course_id::text=split_part(name,'/',2)
   and e.status in ('active','completed') and (e.expires_at is null or e.expires_at>now())
   and (public.ggp_academy_enrolled(e.course_id) or public.ggp_academy_is_admin(e.workspace_id))));
