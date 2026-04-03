-- Milestone 2 schema: venues + events
-- Apply this script in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  latitude double precision not null,
  longitude double precision not null,
  website_url text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  title text not null,
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  host_name text,
  notes text,
  source_url text,
  status text not null default 'scheduled' check (status in ('scheduled', 'canceled', 'tentative')),
  last_verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (
    end_datetime is null or end_datetime >= start_datetime
  )
);

create index if not exists events_venue_id_idx on public.events (venue_id);
create index if not exists events_start_datetime_idx on public.events (start_datetime);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_venues_updated_at
before update on public.venues
for each row
execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();
