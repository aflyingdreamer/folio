-- 0011_advisor_fixes.sql
-- Address Supabase advisor warnings before public launch:
--   1. RLS policies re-evaluate auth.uid() per row. Wrap as (select auth.uid())
--      so Postgres treats it as an InitPlan and evaluates once per query.
--   2. SECURITY DEFINER helpers (handle_new_user, rls_auto_enable) are exposed
--      via PostgREST. They are trigger / admin helpers, not RPCs — revoke
--      execute from anon and authenticated so they cannot be invoked over HTTP.
--   3. public.set_updated_at has a mutable search_path. Pin it.

-- 1. RLS InitPlan rewrites -----------------------------------------------------

drop policy if exists "entries: owner read"   on public.entries;
drop policy if exists "entries: owner insert" on public.entries;
drop policy if exists "entries: owner update" on public.entries;
drop policy if exists "meta: owner all"       on public.user_meta;

create policy "entries: owner read"
  on public.entries for select
  using ((select auth.uid()) = user_id);

create policy "entries: owner insert"
  on public.entries for insert
  with check ((select auth.uid()) = user_id);

create policy "entries: owner update"
  on public.entries for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "meta: owner all"
  on public.user_meta for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 2. Lock down SECURITY DEFINER helpers from PostgREST -------------------------

revoke execute on function public.handle_new_user()  from anon, authenticated, public;
revoke execute on function public.rls_auto_enable()  from anon, authenticated, public;

-- 3. Pin search_path on set_updated_at ----------------------------------------

alter function public.set_updated_at() set search_path = '';
