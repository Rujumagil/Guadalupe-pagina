-- Orden editorial de escritos por módulo; nunca altera las respuestas originales.
alter table public.ggp_academy_manuscripts
 add column if not exists chapter_layout jsonb not null default '{}'::jsonb
 check (jsonb_typeof(chapter_layout)='object' and pg_column_size(chapter_layout)<=32768);
