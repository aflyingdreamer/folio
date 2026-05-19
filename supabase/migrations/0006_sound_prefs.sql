-- 0006_sound_prefs.sql
alter table user_meta
  add column sound_enabled    boolean,
  add column sound_track      text     not null default 'soft_rain',
  add column sound_volume     smallint not null default 60,
  add column sound_loop_mode  text     not null default 'loop_one';

alter table user_meta
  add constraint sound_track_valid
    check (sound_track in ('soft_rain','room_tone','distant_cafe','fireplace','forest_dawn'));

alter table user_meta
  add constraint sound_volume_range
    check (sound_volume between 0 and 100);

alter table user_meta
  add constraint sound_loop_mode_valid
    check (sound_loop_mode in ('loop_one','shuffle'));
