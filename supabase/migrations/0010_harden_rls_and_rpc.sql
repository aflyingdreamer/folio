-- 0010_harden_rls_and_rpc.sql
-- 1. Make immutability explicit. Without an explicit delete policy RLS denies
--    all deletes, but the failure surfaces as a confusing permission error
--    rather than "this is sealed by design". The restrictive policy makes
--    intent legible to anyone reading the schema.
-- 2. Harden get_today_entry() to always return a row even for users that
--    don't yet have a user_meta row (new sign-ups, before TzCapture fires).
--    Previously the function returned zero rows in that case, which left
--    /today with stale defaults until the next router refresh.

create policy "entries: no delete"
  on public.entries
  as restrictive
  for delete
  using (false);

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
    select coalesce(
      (select user_meta.timezone from public.user_meta where user_id = auth.uid()),
      'UTC'
    ) as tz
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
