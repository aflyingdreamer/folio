-- 0017_user_meta_first_touch.sql
-- First-touch attribution: where did the user come from on their first landing?
-- All nullable; written once at signup (or first OAuth callback) and never updated.

alter table public.user_meta
  add column if not exists first_source        text,
  add column if not exists first_medium        text,
  add column if not exists first_campaign      text,
  add column if not exists first_referrer      text,
  add column if not exists first_landing_path  text,
  add column if not exists first_landing_at    timestamptz;
