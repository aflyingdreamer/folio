-- 0007_sound_tracks_trim.sql
-- Drop distant_cafe and room_tone from allowed sound_track values.
-- Any existing rows referencing the dropped slugs get reset to the default.

update user_meta
   set sound_track = 'soft_rain'
 where sound_track in ('distant_cafe', 'room_tone');

alter table user_meta drop constraint sound_track_valid;
alter table user_meta
  add constraint sound_track_valid
    check (sound_track in ('soft_rain','fireplace','forest_dawn'));
