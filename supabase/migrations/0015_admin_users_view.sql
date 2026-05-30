-- 0015_admin_users_view.sql
-- Convenience view for browsing users with email + timezone in the Supabase
-- Table Editor. Only the postgres / service_role can read auth.users, so this
-- view is effectively dashboard-only; no grants to anon or authenticated.

create or replace view public.admin_users_view as
select
  u.id          as user_id,
  u.email       as email,
  coalesce(m.timezone, 'UTC') as timezone,
  u.created_at  as joined_at,
  u.last_sign_in_at
from auth.users u
left join public.user_meta m on m.user_id = u.id
order by u.created_at desc;

revoke all on public.admin_users_view from public, anon, authenticated;
