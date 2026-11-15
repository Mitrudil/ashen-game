-- ASHEN v0.2.4 — private cloud backup by Supabase Auth account.
-- Execute once in SQL Editor after creating a Supabase project.
-- This is NOT a trusted multiplayer game state: the client can edit its own JSON.
-- Never expose service_role / secret keys in the browser.

create table if not exists public.ashen_cloud_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null,
  character_name text not null,
  character_level integer not null default 1,
  updated_at timestamptz not null default now(),
  constraint ashen_cloud_saves_name_length check (char_length(character_name) between 1 and 40),
  constraint ashen_cloud_saves_level_check check (character_level between 1 and 100000),
  constraint ashen_cloud_saves_size_check check (octet_length(save_data::text) <= 1048576)
);

alter table public.ashen_cloud_saves enable row level security;
revoke all on public.ashen_cloud_saves from anon, authenticated;
grant select, insert, update on public.ashen_cloud_saves to authenticated;

-- Policies are idempotent when re-running installation.
drop policy if exists "ashen_owner_read" on public.ashen_cloud_saves;
drop policy if exists "ashen_owner_insert" on public.ashen_cloud_saves;
drop policy if exists "ashen_owner_update" on public.ashen_cloud_saves;

create policy "ashen_owner_read" on public.ashen_cloud_saves
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "ashen_owner_insert" on public.ashen_cloud_saves
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "ashen_owner_update" on public.ashen_cloud_saves
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.ashen_cloud_save_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ashen_cloud_saves_timestamp on public.ashen_cloud_saves;
create trigger ashen_cloud_saves_timestamp
before insert or update on public.ashen_cloud_saves
for each row execute function public.ashen_cloud_save_updated_at();

-- NO: public read, public leaderboard, PvP or messaging policies here.
-- Real online PvP requires server-authoritative validation and audit trails.
