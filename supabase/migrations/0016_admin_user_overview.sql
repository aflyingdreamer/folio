-- 0016_admin_user_overview.sql
-- Merge admin_users_view + user_meta surface area into one rich overview:
-- identity (email, display_name, joined, last sign-in, confirmed), preferences
-- (timezone, theme, palette_interest), and writing activity (entry count,
-- total words, first/last entry, days since last entry).
--
-- Dashboard-only: revoked from anon/authenticated. The matching RPC for the
-- in-app /admin page is updated to return the same shape.

drop view if exists public.admin_users_view;

create or replace view public.admin_users_view as
with stats as (
  select
    user_id,
    count(*)::int                          as entry_count,
    coalesce(sum(word_count), 0)::int      as total_words,
    min(entry_date)                        as first_entry_date,
    max(entry_date)                        as last_entry_date
  from public.entries
  group by user_id
)
select
  u.id                                       as user_id,
  u.email                                    as email,
  m.display_name                             as display_name,
  coalesce(m.timezone, 'UTC')                as timezone,
  coalesce(m.theme, 'system')                as theme,
  coalesce(m.palette_interest, false)        as palette_interest,
  u.created_at                               as joined_at,
  u.last_sign_in_at                          as last_sign_in_at,
  u.email_confirmed_at                       as email_confirmed_at,
  coalesce(s.entry_count, 0)                 as entry_count,
  coalesce(s.total_words, 0)                 as total_words,
  s.first_entry_date                         as first_entry_date,
  s.last_entry_date                          as last_entry_date,
  case
    when s.last_entry_date is null then null
    else (current_date - s.last_entry_date)
  end                                        as days_since_last_entry
from auth.users u
left join public.user_meta m on m.user_id = u.id
left join stats s             on s.user_id = u.id
order by u.created_at desc;

revoke all on public.admin_users_view from public, anon, authenticated;

-- RPC for the in-app /admin page. Same columns as the view, gated on the
-- caller being in public.admins.
create or replace function public.admin_list_users()
returns table (
  user_id              uuid,
  email                text,
  display_name         text,
  timezone             text,
  theme                text,
  palette_interest     boolean,
  joined_at            timestamptz,
  last_sign_in_at      timestamptz,
  email_confirmed_at   timestamptz,
  entry_count          int,
  total_words          int,
  first_entry_date     date,
  last_entry_date      date,
  days_since_last_entry int
)
language sql
stable
security definer
set search_path = public
as $$
  with stats as (
    select
      user_id,
      count(*)::int                     as entry_count,
      coalesce(sum(word_count), 0)::int as total_words,
      min(entry_date)                   as first_entry_date,
      max(entry_date)                   as last_entry_date
    from public.entries
    group by user_id
  )
  select
    u.id                                as user_id,
    u.email::text                       as email,
    m.display_name                      as display_name,
    coalesce(m.timezone, 'UTC')         as timezone,
    coalesce(m.theme, 'system')         as theme,
    coalesce(m.palette_interest, false) as palette_interest,
    u.created_at                        as joined_at,
    u.last_sign_in_at                   as last_sign_in_at,
    u.email_confirmed_at                as email_confirmed_at,
    coalesce(s.entry_count, 0)          as entry_count,
    coalesce(s.total_words, 0)          as total_words,
    s.first_entry_date                  as first_entry_date,
    s.last_entry_date                   as last_entry_date,
    case
      when s.last_entry_date is null then null
      else (current_date - s.last_entry_date)
    end                                 as days_since_last_entry
  from auth.users u
  left join public.user_meta m on m.user_id = u.id
  left join stats s             on s.user_id = u.id
  where exists (select 1 from public.admins a where a.user_id = auth.uid())
  order by u.created_at desc;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;
