-- 0014_admin_user_board.sql
-- Admin-only user board: lists users with email + timezone (location proxy).
-- Access controlled via an `admins` allowlist table; the RPC is SECURITY DEFINER
-- so it can read auth.users, but it refuses to return rows unless the caller's
-- uid is in `admins`.

create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  added_at   timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies = no client access. Manage via SQL only.

create or replace function public.admin_list_users()
returns table (
  user_id    uuid,
  email      text,
  timezone   text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    u.id          as user_id,
    u.email::text as email,
    coalesce(m.timezone, 'UTC') as timezone,
    u.created_at
  from auth.users u
  left join public.user_meta m on m.user_id = u.id
  where exists (select 1 from public.admins a where a.user_id = auth.uid())
  order by u.created_at desc;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;
