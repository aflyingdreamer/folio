alter table public.entries   enable row level security;
alter table public.user_meta enable row level security;

create policy "entries: owner read"   on public.entries   for select using (auth.uid() = user_id);
create policy "entries: owner insert" on public.entries   for insert with check (auth.uid() = user_id);
create policy "entries: owner update" on public.entries   for update using (auth.uid() = user_id);
create policy "meta: owner all"       on public.user_meta for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
