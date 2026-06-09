-- Run this in the Supabase dashboard → SQL Editor

create table public.peer_clips (
  id             uuid        primary key default gen_random_uuid(),
  session_id     text        not null,
  question_index int         not null check (question_index between 0 and 3),
  sharer_name    text        not null,
  day_number     int         not null check (day_number >= 1),
  pathway        text        not null,
  age_range      text        not null,
  sex            text        not null,
  region         text        not null,
  cloudinary_url text        not null,
  status         text        not null default 'pending'
                             check (status in ('pending', 'approved', 'rejected')),
  consent        boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- RLS enabled: anon key cannot touch this table directly.
-- All reads and writes go through server-side API routes using the service role,
-- which bypasses RLS automatically — no extra policies needed.
alter table public.peer_clips enable row level security;

-- Index for the core matching query:
-- "give me approved day-7 alcohol clips"
create index peer_clips_match_idx
  on public.peer_clips (day_number, pathway, status);
