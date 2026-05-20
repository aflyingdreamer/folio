-- 0009_get_today_entry.sql
-- One-roundtrip helper for /today: returns the user's timezone and the
-- entry for the current date in that timezone (or empty if not yet written).
-- Cuts /today server time from two sequential queries to one.
create or replace function public.get_today_entry()
returns table (
  timezone   text,
  entry_date date,
  content    text,
  word_count int
)
language sql
stable
security invoker
set search_path = public
as $$
  with um as (
    select coalesce(user_meta.timezone, 'UTC') as tz
    from public.user_meta
    where user_id = auth.uid()
  )
  select
    um.tz                                              as timezone,
    (now() at time zone um.tz)::date                   as entry_date,
    e.content,
    e.word_count
  from um
  left join public.entries e
    on  e.user_id = auth.uid()
    and e.entry_date = (now() at time zone um.tz)::date;
$$;

grant execute on function public.get_today_entry() to authenticated;
