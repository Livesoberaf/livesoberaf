-- Run in Supabase dashboard → SQL Editor

-- Add app_placement to peer_clips.
-- "story" = website library only (never served into the app feed).
-- Other values match the app feed slot: early_days, day_1, week_1,
-- craving, low_moment, milestone.
alter table public.peer_clips
  add column if not exists app_placement text not null default 'story';

-- Index so the matching API can filter by placement efficiently
create index if not exists peer_clips_placement_idx
  on public.peer_clips (app_placement, pathway, status);
