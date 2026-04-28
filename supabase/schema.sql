create extension if not exists pgcrypto;

create table if not exists public.tire_reports (
  id uuid primary key default gen_random_uuid(),
  vehicle_make text not null check (char_length(trim(vehicle_make)) between 2 and 80),
  vehicle_model text not null check (char_length(trim(vehicle_model)) between 1 and 80),
  vin text not null check (vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  submitter_email text null,
  tires jsonb not null check (
    jsonb_typeof(tires) = 'array'
    and jsonb_array_length(tires) = 4
  ),
  created_at timestamptz not null default now()
);

alter table public.tire_reports enable row level security;

drop policy if exists "Anon can insert tire reports" on public.tire_reports;
create policy "Anon can insert tire reports"
on public.tire_reports
for insert
to anon
with check (true);

grant usage on schema public to anon;
revoke all on table public.tire_reports from anon;
grant insert on table public.tire_reports to anon;

revoke all on table public.tire_reports from authenticated;
