-- 0012_user_meta_theme.sql
-- Settings: appearance preference (light / dark / system).
-- Default 'system' so existing users follow OS without surprise.

alter table public.user_meta
  add column if not exists theme text not null default 'system'
    check (theme in ('light', 'dark', 'system'));
