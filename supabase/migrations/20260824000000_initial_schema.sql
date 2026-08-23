create extension if not exists "pgcrypto";

create table if not exists public.villas (
  id text primary key,
  name text not null,
  slug text not null unique,
  description jsonb not null default '{}'::jsonb,
  price numeric(14, 2) not null check (price >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  max_guests integer not null default 1 check (max_guests > 0),
  location_area jsonb not null default '{}'::jsonb,
  latitude double precision not null,
  longitude double precision not null,
  amenities jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  category jsonb not null default '{}'::jsonb,
  category_key text not null check (category_key in ('luxury', 'family', 'studio')),
  is_active boolean not null default true,
  is_trending boolean not null default false,
  owner_whatsapp text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp_number text not null,
  email text,
  villa_id text references public.villas(id) on delete set null,
  status_verifikasi text not null default 'pending'
    check (status_verifikasi in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.villa_availability (
  id uuid primary key default gen_random_uuid(),
  villa_id text not null references public.villas(id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  note text,
  unique (villa_id, date)
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin'))
);

create index if not exists villas_active_idx on public.villas (is_active);
create index if not exists villa_availability_lookup_idx
  on public.villa_availability (villa_id, date);
create index if not exists owners_status_idx on public.owners (status_verifikasi);

alter table public.villas enable row level security;
alter table public.owners enable row level security;
alter table public.villa_availability enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read active villas"
  on public.villas for select using (is_active = true);

create policy "Public can read villa availability"
  on public.villa_availability for select using (true);

create policy "Anyone can submit owner registration"
  on public.owners for insert with check (status_verifikasi = 'pending');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_villas_updated_at on public.villas;
create trigger set_villas_updated_at
  before update on public.villas
  for each row execute function public.set_updated_at();