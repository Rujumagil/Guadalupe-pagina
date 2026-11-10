-- Ubicación opcional de fotografías y orden dentro de cada capítulo.
alter table public.ggp_academy_manuscript_photos
 add column if not exists chapter_module_id uuid;
alter table public.ggp_academy_manuscript_photos
 add column if not exists position integer not null default 0 check(position between 0 and 1000);
alter table public.ggp_academy_manuscript_photos
 add constraint ggp_photo_chapter_course_fk
 foreign key(chapter_module_id,course_id,workspace_id)
 references public.ggp_academy_modules(id,course_id,workspace_id);
create index if not exists idx_ggp_photo_chapter_position
 on public.ggp_academy_manuscript_photos(student_id,course_id,chapter_module_id,position);
