-- 0008_drop_sound_prefs.sql
-- Removes the ambient sound feature. Sound was distracting in practice;
-- if users want music they can play it in another app.
alter table user_meta drop constraint if exists sound_loop_mode_valid;
alter table user_meta drop constraint if exists sound_volume_range;
alter table user_meta drop constraint if exists sound_track_valid;

alter table user_meta
  drop column if exists sound_enabled,
  drop column if exists sound_track,
  drop column if exists sound_volume,
  drop column if exists sound_loop_mode;
