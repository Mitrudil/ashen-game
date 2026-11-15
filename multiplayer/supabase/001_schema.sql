-- ASHEN v0.2.0: schemat startowy do uruchomienia w prywatnym projekcie Supabase.
-- NIE uruchamia serwera PvP i nie przenosi automatycznie zapisów localStorage.
-- Zakładanie kont powinno pozostać wyłączone do czasu zaproszenia testerów.
begin;
create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists player_profiles_nickname_idx on public.player_profiles(lower(nickname));
create table if not exists public.characters (
  user_id uuid primary key references public.player_profiles(user_id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  state_version integer not null default 1,
  updated_at timestamptz not null default now()
);
create table if not exists public.pvp_reports (
  id bigint generated always as identity primary key,
  attacker_id uuid not null references public.player_profiles(user_id),
  defender_id uuid not null references public.player_profiles(user_id),
  result jsonb not null,
  created_at timestamptz not null default now(),
  check (attacker_id <> defender_id)
);
create index if not exists pvp_reports_attacker_idx on public.pvp_reports(attacker_id,created_at desc);
create index if not exists pvp_reports_defender_idx on public.pvp_reports(defender_id,created_at desc);
alter table public.player_profiles enable row level security;
alter table public.characters enable row level security;
alter table public.pvp_reports enable row level security;
-- Publiczna lista pseudonimów w obrębie ZALOGOWANYCH testerów; bez zapisu cudzych danych.
create policy "profiles_read_authenticated" on public.player_profiles for select to authenticated using (true);
create policy "profiles_insert_self" on public.player_profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "profiles_update_self" on public.player_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Celowo brak polityk bezpośredniego INSERT/UPDATE/DELETE stanu postaci i raportów.
-- Te operacje musi wykonywać wyłącznie zaufana logika serwerowa po weryfikacji reguł gry.
create policy "characters_read_self" on public.characters for select to authenticated using (auth.uid() = user_id);
create policy "reports_read_participant" on public.pvp_reports for select to authenticated using (auth.uid() in (attacker_id,defender_id));
commit;
