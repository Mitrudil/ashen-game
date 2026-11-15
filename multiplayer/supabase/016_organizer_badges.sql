-- ASHEN v0.3.6.2 — odznaka wyłącznie dla organizatora zwycięskiej ekspedycji.
-- Uruchom WYŁĄCZNIE na Supabase projektu ASHEN, po 014 i 015.
-- Nagrody indywidualne i premia za pierwsze zwycięstwo pozostają bez zmian.
-- Naprawia odznaki historyczne (usuwa niewłaściwe i przyznaje właściwym organizatorom).

-- Blokada po stronie bazy: nawet starsza funkcja przyznająca łupy nie może
-- utworzyć odznaki dla uczestnika niebędącego organizatorem zwycięskiej wyprawy.
create or replace function public.ashen_badge_organizer_only()
returns trigger language plpgsql security definer set search_path='' as $$
declare e public.ashen_clan_expeditions%rowtype;
begin
 select * into e from public.ashen_clan_expeditions where id=new.first_expedition_id;
 if not found or e.created_by is distinct from new.user_id or e.boss_id is distinct from new.boss_id
    or e.status <> 'resolved' or not coalesce((e.result->>'victory')::boolean,false) then
    -- IGNORE: uczestnicy nadal dostają nagrody, ale nie odznakę.
    return null;
 end if;
 return new;
end $$;

drop trigger if exists ashen_boss_badge_organizer_only_trg on public.ashen_boss_badges;
create trigger ashen_boss_badge_organizer_only_trg
before insert or update on public.ashen_boss_badges
for each row execute function public.ashen_badge_organizer_only();

-- Usuń odznaki osób, które nie założyły wygranej ekspedycji zapisanej przy odznace.
delete from public.ashen_boss_badges b
where not exists (
 select 1 from public.ashen_clan_expeditions e
 where e.id=b.first_expedition_id and e.created_by=b.user_id and e.boss_id=b.boss_id
   and e.status='resolved' and coalesce((e.result->>'victory')::boolean,false)
);

-- Jeśli organizator wygrał wcześniej, ale nie dostał odznaki (lub otrzymał ją
-- z niewłaściwej ekspedycji), przypisz pierwszą wygraną, którą sam stworzył.
insert into public.ashen_boss_badges(user_id,boss_id,boss_name,first_expedition_id,earned_at)
select distinct on (e.created_by,e.boss_id)
 e.created_by,e.boss_id,left(coalesce(e.result->>'boss_name','Boss'),80),e.id,
 coalesce(e.launched_at,e.created_at)
from public.ashen_clan_expeditions e
where e.status='resolved' and coalesce((e.result->>'victory')::boolean,false)
order by e.created_by,e.boss_id,coalesce(e.launched_at,e.created_at),e.id
on conflict(user_id,boss_id) do nothing;

revoke all on function public.ashen_badge_organizer_only() from public,anon,authenticated;
