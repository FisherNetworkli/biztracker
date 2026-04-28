create extension if not exists pgcrypto;

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  day integer not null check (day >= 1),
  entry_date date not null default current_date,
  phase text generated always as (
    case
      when day <= 30 then 'Phase 1 - Deal Flow'
      else 'Phase 2 - Closing'
    end
  ) stored,
  todays_focus text not null,
  what_i_did_today text not null,
  win text not null,
  blocker_question text,
  what_i_need text,
  deal_stage text not null check (
    deal_stage in (
      'No Activity',
      'Lead Sourcing',
      'NDA Signed',
      'Contacted Broker',
      'Contacted Seller',
      'Info Received',
      'In Conversation',
      'Analyzing Financials',
      'Offer Strategy',
      'LOI Submitted',
      'Under LOI',
      'Due Diligence',
      'Financing Secured',
      'Purchase Agreement',
      'Closed',
      'Walked Away'
    )
  ),
  link_url text,
  urgency text not null check (urgency in ('Low', 'Medium', 'High')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_entries_name_idx on public.daily_entries (name);
create index if not exists daily_entries_entry_date_idx on public.daily_entries (entry_date desc);
create index if not exists daily_entries_created_at_idx on public.daily_entries (created_at desc);
create index if not exists daily_entries_urgency_idx on public.daily_entries (urgency);
create index if not exists daily_entries_deal_stage_idx on public.daily_entries (deal_stage);
create index if not exists daily_entries_latest_idx on public.daily_entries (lower(name), entry_date desc, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_entries_set_updated_at on public.daily_entries;

create trigger daily_entries_set_updated_at
before update on public.daily_entries
for each row
execute function public.set_updated_at();
