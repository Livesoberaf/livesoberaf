-- ── prompts ──────────────────────────────────────────────────────────────────
-- Catalog of content briefs. Each row is a "address" that a contributor records against.

create table if not exists prompts (
  id           uuid primary key default gen_random_uuid(),
  role         text not null check (role in ('creator', 'matt')),
  trigger_type text not null check (trigger_type in ('day', 'moment', 'mood', 'event')),
  day_number   integer,
  moment       text,    -- morning | mid_morning | lunch | afternoon | late_afternoon | evening | before_bed | midday
  mood         text,    -- struggling | okay | good
  event        text,    -- craving | sos | milestone | onboarding
  pathway      text,    -- null = universal (Matt speaks to all pathways)
  title        text not null,
  brief        text not null,
  sequence     integer  not null default 0,
  active       boolean  not null default true,
  created_at   timestamptz not null default now()
);

alter table prompts enable row level security;
-- service_role only — Next.js API routes use getSupabaseAdmin()

create index if not exists prompts_role_pathway_idx on prompts (role, pathway, trigger_type);
create index if not exists prompts_day_idx          on prompts (day_number) where day_number is not null;

-- ── extend peer_clips ────────────────────────────────────────────────────────
-- Add the address fields. DO NOT touch existing columns or rows.

alter table peer_clips
  add column if not exists prompt_id uuid references prompts(id),
  add column if not exists role      text not null default 'creator',
  add column if not exists moment    text,
  add column if not exists mood      text,
  add column if not exists event     text;

-- ── extend creators ──────────────────────────────────────────────────────────
-- role: 'creator' (default) or 'matt'.
-- pathway becomes nullable so Matt can be universal.

alter table creators
  add column if not exists role text not null default 'creator';

alter table creators
  alter column pathway drop not null;
