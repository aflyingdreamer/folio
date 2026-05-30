-- 0018_admin_list_users_attribution.sql
-- Extends the admin RPC with the first-touch attribution columns from 0017.

drop function if exists public.admin_list_users();

create function public.admin_list_users()
returns table (
  user_id              uuid,
  email                text,
  display_name         text,
  timezone             text,
  theme                text,
  palette_interest     boolean,
  first_source         text,
  first_medium         text,
  first_campaign       text,
  first_referrer       text,
  first_landing_path   text,
  first_landing_at     timestamptz,
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
    m.first_source                      as first_source,
    m.first_medium                      as first_medium,
    m.first_campaign                    as first_campaign,
    m.first_referrer                    as first_referrer,
    m.first_landing_path                as first_landing_path,
    m.first_landing_at                  as first_landing_at,
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
