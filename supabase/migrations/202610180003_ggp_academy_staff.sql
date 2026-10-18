-- Administradores propios de la Academia Guadalupe (separados del CRM).
create table if not exists public.ggp_academy_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 workspace_id uuid not null references public.workspaces(id),
 role text not null default 'admin' check(role='admin'),
 is_active boolean not null default true,
 granted_by uuid references auth.users(id),
 granted_at timestamptz not null default now()
);
create index if not exists ggp_academy_staff_workspace_idx on public.ggp_academy_staff(workspace_id);
alter table public.ggp_academy_staff enable row level security;
revoke all on public.ggp_academy_staff from anon,authenticated;
grant select,insert,update,delete on public.ggp_academy_staff to authenticated;

create or replace function public.ggp_academy_can_grant_staff(target_workspace uuid)
returns boolean language sql stable security definer set search_path=''
as $$
 select exists(
  select 1 from public.workspaces w
  join public.workspace_members m on m.workspace_id=w.id
  where w.id=target_workspace and w.slug='guadalupe-gomez-pezuela'
   and m.user_id=(select auth.uid()) and m.status='active' and m.role='owner'
 );
$$;
revoke all on function public.ggp_academy_can_grant_staff(uuid) from public;
grant execute on function public.ggp_academy_can_grant_staff(uuid) to authenticated;

create policy ggp_staff_read on public.ggp_academy_staff for select to authenticated
using (user_id=(select auth.uid()) or public.ggp_academy_can_grant_staff(workspace_id));
create policy ggp_staff_insert on public.ggp_academy_staff for insert to authenticated
with check(public.ggp_academy_can_grant_staff(workspace_id) and
 exists(select 1 from public.ggp_academy_students s where s.user_id=ggp_academy_staff.user_id and s.workspace_id=ggp_academy_staff.workspace_id));
create policy ggp_staff_update on public.ggp_academy_staff for update to authenticated
using(public.ggp_academy_can_grant_staff(workspace_id))
with check(public.ggp_academy_can_grant_staff(workspace_id));
create policy ggp_staff_delete on public.ggp_academy_staff for delete to authenticated
using(public.ggp_academy_can_grant_staff(workspace_id));

-- Conserva el rol owner/admin de Compas One, incorpora administradores solo de Academia.
create or replace function public.ggp_academy_is_admin(target_workspace uuid)
returns boolean language sql stable security definer set search_path=''
as $$
  select (select auth.uid()) is not null and (
   exists (
    select 1 from public.workspaces w
    join public.workspace_members m on m.workspace_id=w.id
    where w.id=target_workspace and w.slug='guadalupe-gomez-pezuela'
     and m.user_id=(select auth.uid()) and m.status='active'
     and m.role in ('owner','admin')
   )
   or exists (
    select 1 from public.ggp_academy_staff staff
    join public.workspaces w on w.id=staff.workspace_id
    where staff.workspace_id=target_workspace and w.slug='guadalupe-gomez-pezuela'
      and staff.user_id=(select auth.uid()) and staff.is_active=true and staff.role='admin'
   )
  );
$$;
create or replace function public.ggp_academy_is_admin()
returns boolean language sql stable security definer set search_path=''
as $$
 select exists(
  select 1 from public.workspaces w
  where w.slug='guadalupe-gomez-pezuela'
   and public.ggp_academy_is_admin(w.id)
 );
$$;
revoke all on function public.ggp_academy_is_admin(uuid),public.ggp_academy_is_admin() from public;
grant execute on function public.ggp_academy_is_admin(uuid),public.ggp_academy_is_admin() to authenticated,anon;
