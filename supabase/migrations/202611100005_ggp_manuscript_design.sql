-- Preferencias de diseño editorial privadas, sin modificar el texto del alumno.
alter table public.ggp_academy_manuscripts
 add column if not exists cover_style text not null default 'classic'
 check (cover_style in ('classic','botanical','modern'));
alter table public.ggp_academy_manuscripts
 add column if not exists body_font text not null default 'serif'
 check (body_font in ('serif','sans'));
