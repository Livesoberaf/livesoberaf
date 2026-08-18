-- Run in Supabase dashboard → SQL Editor

create table public.push_tokens (
  id              uuid        primary key default gen_random_uuid(),
  expo_push_token text        not null unique,
  pathway         text        not null default 'alcohol',
  device_id       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.push_tokens enable row level security;

-- Index for pathway-based fan-out queries
create index push_tokens_pathway_idx on public.push_tokens (pathway);
