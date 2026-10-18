-- Biblioteca digital y comunidad propias de Academia Guadalupe.
create table if not exists public.ggp_academy_books (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 title text not null check(length(btrim(title)) between 2 and 160),
 author text not null default 'Guadalupe Gómez Pezuela',
 description text not null default '',
 cover_url text,
 media_path text,
 status text not null default 'draft' check(status in ('draft','published','archived')),
 created_at timestamptz not null default now(),
 unique(id,workspace_id)
);
create table if not exists public.ggp_academy_book_grants (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 book_id uuid not null,
 student_id uuid not null references auth.users(id) on delete cascade,
 granted_at timestamptz not null default now(),
 expires_at timestamptz,
 foreign key(book_id,workspace_id) references public.ggp_academy_books(id,workspace_id) on delete cascade,
 unique(book_id,student_id)
);
create table if not exists public.ggp_academy_community_members (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'active' check(status in ('active','revoked')),
 joined_at timestamptz not null default now(),
 unique(workspace_id,user_id)
);
create table if not exists public.ggp_academy_community_posts (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 author_id uuid not null references auth.users(id),
 title text not null check(length(btrim(title)) between 3 and 160),
 body text not null check(length(btrim(body)) between 3 and 5000),
 is_published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.ggp_academy_community_replies (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id),
 post_id uuid not null references public.ggp_academy_community_posts(id) on delete cascade,
 author_id uuid not null references auth.users(id),
 body text not null check(length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists ggp_academy_grants_user_idx on public.ggp_academy_book_grants(student_id);
create index if not exists ggp_academy_community_posts_idx on public.ggp_academy_community_posts(workspace_id,is_published,created_at desc);
create index if not exists ggp_academy_community_replies_idx on public.ggp_academy_community_replies(post_id,created_at);
create or replace function public.ggp_academy_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path=''
as $$
 select (select auth.uid()) is not null and exists(
  select 1 from public.ggp_academy_community_members m
  join public.workspaces w on w.id=m.workspace_id
  where m.workspace_id=target_workspace and w.slug='guadalupe-gomez-pezuela'
    and m.user_id=(select auth.uid()) and m.status='active'
 );
$$;
revoke all on function public.ggp_academy_member(uuid) from public;
grant execute on function public.ggp_academy_member(uuid) to authenticated;

alter table public.ggp_academy_books enable row level security;
alter table public.ggp_academy_book_grants enable row level security;
alter table public.ggp_academy_community_members enable row level security;
alter table public.ggp_academy_community_posts enable row level security;
alter table public.ggp_academy_community_replies enable row level security;

revoke all on public.ggp_academy_books,public.ggp_academy_book_grants,public.ggp_academy_community_members,public.ggp_academy_community_posts,public.ggp_academy_community_replies from anon,authenticated;
grant select,insert,update,delete on public.ggp_academy_books,public.ggp_academy_book_grants,public.ggp_academy_community_members,public.ggp_academy_community_posts,public.ggp_academy_community_replies to authenticated;

create policy ggp_books_read on public.ggp_academy_books for select to authenticated
 using(status='published' or public.ggp_academy_is_admin(workspace_id));
create policy ggp_books_insert on public.ggp_academy_books for insert to authenticated
 with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_books_update on public.ggp_academy_books for update to authenticated
 using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_books_delete on public.ggp_academy_books for delete to authenticated
 using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_grants_read on public.ggp_academy_book_grants for select to authenticated
 using(student_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id));
create policy ggp_grants_insert on public.ggp_academy_book_grants for insert to authenticated
 with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_grants_update on public.ggp_academy_book_grants for update to authenticated
 using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_grants_delete on public.ggp_academy_book_grants for delete to authenticated
 using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_members_read on public.ggp_academy_community_members for select to authenticated
 using(user_id=(select auth.uid()) or public.ggp_academy_is_admin(workspace_id));
create policy ggp_members_insert on public.ggp_academy_community_members for insert to authenticated
 with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_members_update on public.ggp_academy_community_members for update to authenticated
 using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_members_delete on public.ggp_academy_community_members for delete to authenticated
 using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_posts_read on public.ggp_academy_community_posts for select to authenticated
 using(public.ggp_academy_is_admin(workspace_id) or
       (is_published and public.ggp_academy_member(workspace_id)));
create policy ggp_posts_insert on public.ggp_academy_community_posts for insert to authenticated
 with check(public.ggp_academy_is_admin(workspace_id) and author_id=(select auth.uid()));
create policy ggp_posts_update on public.ggp_academy_community_posts for update to authenticated
 using(public.ggp_academy_is_admin(workspace_id)) with check(public.ggp_academy_is_admin(workspace_id));
create policy ggp_posts_delete on public.ggp_academy_community_posts for delete to authenticated
 using(public.ggp_academy_is_admin(workspace_id));

create policy ggp_replies_read on public.ggp_academy_community_replies for select to authenticated
 using(public.ggp_academy_is_admin(workspace_id) or
       (public.ggp_academy_member(workspace_id) and
        exists(select 1 from public.ggp_academy_community_posts p
         where p.id=post_id and p.workspace_id=ggp_academy_community_replies.workspace_id and p.is_published)));
create policy ggp_replies_insert on public.ggp_academy_community_replies for insert to authenticated
 with check(author_id=(select auth.uid()) and
       (public.ggp_academy_member(workspace_id) or public.ggp_academy_is_admin(workspace_id)) and
       exists(select 1 from public.ggp_academy_community_posts p
        where p.id=post_id and p.workspace_id=ggp_academy_community_replies.workspace_id and p.is_published));
create policy ggp_replies_delete on public.ggp_academy_community_replies for delete to authenticated
 using((author_id=(select auth.uid()) and public.ggp_academy_member(workspace_id))
   or public.ggp_academy_is_admin(workspace_id));

-- Archivos de libros privados: lectura solo al alumno autorizado o personal academico.
create policy "ggp_book_private_download" on storage.objects
for select to authenticated
using(bucket_id='ggp-academy-private' and
 (public.ggp_academy_is_admin() or exists(
   select 1 from public.ggp_academy_books b
   join public.ggp_academy_book_grants g on g.book_id=b.id and g.workspace_id=b.workspace_id
   where b.media_path=storage.objects.name and b.status='published'
     and g.student_id=(select auth.uid()) and
     (g.expires_at is null or g.expires_at>now())
  )));
