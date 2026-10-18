-- Materiales educativos protegidos: acceso limitado a administradores o estudiantes matriculados.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('ggp-academy-private','ggp-academy-private',false,262144000,
       array['application/pdf','video/mp4','video/webm','audio/mpeg','audio/mp4','audio/x-m4a','audio/wav','audio/webm','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create unique index if not exists ggp_academy_lessons_media_path_unique
on public.ggp_academy_lessons(media_path) where media_path is not null;

create policy "ggp_admin_upload" on storage.objects
for insert to authenticated
with check (bucket_id='ggp-academy-private' and public.ggp_academy_is_admin()
  and name ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}/[A-Za-z0-9_.-]{1,160}$');

create policy "ggp_admin_replace" on storage.objects
for update to authenticated
using(bucket_id='ggp-academy-private' and public.ggp_academy_is_admin())
with check(bucket_id='ggp-academy-private' and public.ggp_academy_is_admin());

create policy "ggp_admin_delete" on storage.objects
for delete to authenticated
using(bucket_id='ggp-academy-private' and public.ggp_academy_is_admin());

create policy "ggp_enrolled_download" on storage.objects
for select to authenticated
using(bucket_id='ggp-academy-private' and
  (public.ggp_academy_is_admin() or exists(
    select 1 from public.ggp_academy_lessons l
    join public.ggp_academy_courses c on c.id=l.course_id
    where l.media_path=storage.objects.name
      and c.status='published'
      and public.ggp_academy_enrolled(l.course_id)
  )));
