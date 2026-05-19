alter table public.user_meta
  add column if not exists display_name text;
