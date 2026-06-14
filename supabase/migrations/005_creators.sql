create table if not exists creators (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  pathway     text not null,
  region      text not null,
  sex         text not null,
  age_range   text not null default '',
  access_code text not null unique,
  created_at  timestamptz not null default now()
);

-- No anon or authenticated access — only service_role via Next.js API routes
alter table creators enable row level security;
