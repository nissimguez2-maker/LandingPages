-- Deep-application store: powers cross-device magic-link resume + recovery.
-- Access is server-side only (Supabase service role / PostgREST). RLS is on with
-- NO policies, so browser/anon keys cannot read or write this table.

create table if not exists public.applications (
  token                          uuid primary key,
  vertical                       text,
  status                         text default 'in_progress',
  email                          text,
  lead                           jsonb not null default '{}'::jsonb, -- redacted: no raw SSN/signature
  ssn_ciphertext                 text,                               -- AES-256-GCM (lib/server/secure.ts)
  plaid_item_id                  text,
  plaid_access_token_ciphertext  text,                               -- AES-256-GCM
  resume_emailed_at              timestamptz,
  created_at                     timestamptz not null default now(),
  updated_at                     timestamptz not null default now()
);

alter table public.applications enable row level security;
-- (no policies on purpose — only the service role may touch it)

create index if not exists applications_email_idx  on public.applications (email);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_updated_idx on public.applications (updated_at);
