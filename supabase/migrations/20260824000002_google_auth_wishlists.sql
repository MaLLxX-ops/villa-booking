create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  villa_id text not null references public.villas(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, villa_id)
);

create index if not exists wishlists_user_idx on public.wishlists (user_id);

alter table public.wishlists enable row level security;

drop policy if exists "Users can read their wishlists" on public.wishlists;
create policy "Users can read their wishlists"
  on public.wishlists for select using (user_id = auth.uid());

drop policy if exists "Users can add their wishlists" on public.wishlists;
create policy "Users can add their wishlists"
  on public.wishlists for insert with check (user_id = auth.uid());

drop policy if exists "Users can delete their wishlists" on public.wishlists;
create policy "Users can delete their wishlists"
  on public.wishlists for delete using (user_id = auth.uid());