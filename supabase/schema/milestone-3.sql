-- Milestone 3 schema updates: RLS policies for admin CRUD
-- Apply this script after milestone-2.sql.

alter table public.venues enable row level security;
alter table public.events enable row level security;

drop policy if exists "Public can read venues" on public.venues;
create policy "Public can read venues"
on public.venues
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert venues" on public.venues;
create policy "Authenticated can insert venues"
on public.venues
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update venues" on public.venues;
create policy "Authenticated can update venues"
on public.venues
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete venues" on public.venues;
create policy "Authenticated can delete venues"
on public.venues
for delete
to authenticated
using (true);

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert events" on public.events;
create policy "Authenticated can insert events"
on public.events
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update events" on public.events;
create policy "Authenticated can update events"
on public.events
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete events" on public.events;
create policy "Authenticated can delete events"
on public.events
for delete
to authenticated
using (true);
