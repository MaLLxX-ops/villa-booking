alter table public.owners
  add column if not exists villa_name text,
  add column if not exists location text,
  add column if not exists bedrooms integer,
  add column if not exists price_range text,
  add column if not exists description text,
  add column if not exists social_link text;

update public.owners
set villa_name = coalesce(villa_name, 'Legacy owner registration')
where villa_name is null;

alter table public.owners alter column villa_name set not null;

create index if not exists villas_trending_idx on public.villas (is_trending);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admins can manage villas" on public.villas;
create policy "Admins can manage villas"
  on public.villas for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage owners" on public.owners;
create policy "Admins can manage owners"
  on public.owners for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage availability" on public.villa_availability;
create policy "Admins can manage availability"
  on public.villa_availability for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
  on public.admin_users for select using (id = auth.uid() and role = 'admin');