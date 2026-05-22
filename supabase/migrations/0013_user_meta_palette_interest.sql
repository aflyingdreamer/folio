-- 0013_user_meta_palette_interest.sql
-- Fake-door for the future "palettes" supporter perk.
-- Boolean flag: did the user click "count me in" on a locked palette?
-- The aggregate count is the demand signal that gates building real palettes.

alter table public.user_meta
  add column if not exists palette_interest boolean not null default false;
