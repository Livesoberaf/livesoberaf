-- ── Day 1 creator prompts — alcohol pathway ──────────────────────────────────
-- Run AFTER migration 006. Safe to re-run (ON CONFLICT DO NOTHING requires unique).
-- Uses a stable unique constraint on (role, trigger_type, day_number, moment, pathway)
-- so re-running is idempotent. Add that constraint first if it doesn't exist.

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'prompts_address_unique'
  ) then
    alter table prompts
      add constraint prompts_address_unique
      unique nulls not distinct (role, trigger_type, day_number, moment, mood, event, pathway);
  end if;
end $$;

insert into prompts (role, trigger_type, day_number, moment, pathway, title, brief, sequence) values
(
  'creator', 'day', 1, 'morning', 'alcohol',
  'The first morning',
  'Tell them they only have to stay sober until lunchtime. Not forever, not next week — just reach lunch.',
  1
),
(
  'creator', 'day', 1, 'mid_morning', 'alcohol',
  'What you''re feeling is normal',
  'Name the physical stuff — shakes, sweating, anxiety, restlessness — and tell them it''s the body adjusting, not them failing.',
  2
),
(
  'creator', 'day', 1, 'lunch', 'alcohol',
  'Eat something, drink water',
  'Keep it practical: a sandwich, a banana, some water. Say how much a small thing shifts how you feel.',
  3
),
(
  'creator', 'day', 1, 'afternoon', 'alcohol',
  'Don''t trust every thought',
  'Warn them about "one won''t hurt" — that''s the addiction talking, not the truth, and the thought passes.',
  4
),
(
  'creator', 'day', 1, 'late_afternoon', 'alcohol',
  'Reach out before you need to',
  'Push them to message someone or get to a meeting before the urge peaks. Isolation is where it wins.',
  5
),
(
  'creator', 'day', 1, 'evening', 'alcohol',
  'When the craving hits tonight',
  'Tell them it''ll pass whether they drink or not — it rises, peaks, fades. They only have to ride out this one.',
  6
),
(
  'creator', 'day', 1, 'before_bed', 'alcohol',
  'You made it through Day One',
  'Close gently: there''s nothing wrong with them, they''re not weak or broken, and they did the hardest day. Be proud.',
  7
)
on conflict on constraint prompts_address_unique do nothing;

-- ── Matt prompts — universal (pathway null) ──────────────────────────────────

insert into prompts (role, trigger_type, mood, pathway, title, brief, sequence) values
(
  'matt', 'mood', 'struggling', null,
  'When you''re really struggling',
  'Placeholder — refine later. Acknowledge how hard this moment is. Don''t rush to fix it. Just be present with them and remind them this feeling is temporary.',
  1
),
(
  'matt', 'mood', 'okay', null,
  'When you''re doing okay',
  'Placeholder — refine later. Recognise the middle ground — not great, not terrible. Help them see that steady is good, and that the work is still happening even when it feels quiet.',
  2
),
(
  'matt', 'mood', 'good', null,
  'When you''re doing well',
  'Placeholder — refine later. Celebrate without asking them to perform. Good days are real evidence. Help them notice what''s working and bank it for harder days ahead.',
  3
)
on conflict on constraint prompts_address_unique do nothing;

insert into prompts (role, trigger_type, day_number, moment, pathway, title, brief, sequence) values
(
  'matt', 'day', 2, 'morning', null,
  'Day 2 — you made it through the night',
  'Placeholder — refine later. Day 2 is often harder than Day 1 because the adrenaline is gone. Acknowledge that and help them find the quiet determination underneath it.',
  1
),
(
  'matt', 'day', 4, 'morning', null,
  'Day 4 — the fog is starting to lift',
  'Placeholder — refine later. By Day 4 the acute withdrawal is usually easing. Name what might be changing physically and emotionally, and help them see they''re through the worst of it.',
  1
)
on conflict on constraint prompts_address_unique do nothing;
