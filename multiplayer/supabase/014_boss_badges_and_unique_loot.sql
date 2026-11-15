-- ASHEN v0.3.6 — odznaki za pierwszego bossa i powtarzalne unikatowe łupy.
-- Uruchom WYŁĄCZNIE w projekcie Supabase ASHEN, po SQL 013.
-- Historyczne premie first_clear z SQL 013 otrzymają odznaki wstecznie.
-- Nowe łupy unikatowe losują się tylko dla NOWYCH zwycięstw po instalacji.
-- Bez zmiany PvE, PvP, czasów ekspedycji, ekonomii i wcześniej odebranych nagród.

create table if not exists public.ashen_boss_badges (
 user_id uuid not null references auth.users(id) on delete cascade,
 boss_id integer not null check(boss_id between 1 and 20),
 boss_name text not null,
 first_expedition_id bigint not null references public.ashen_clan_expeditions(id) on delete cascade,
 earned_at timestamptz not null default now(),
 primary key(user_id,boss_id)
);
create index if not exists ashen_boss_badges_user_idx on public.ashen_boss_badges(user_id,boss_id);
alter table public.ashen_boss_badges enable row level security;
revoke all on public.ashen_boss_badges from public,anon,authenticated;

-- Odznaki za pierwsze zwycięstwa już zapisane w v0.3.5.
insert into public.ashen_boss_badges(user_id,boss_id,boss_name,first_expedition_id,earned_at)
select distinct on (r.user_id,r.boss_id)
 r.user_id,r.boss_id,r.boss_name,r.expedition_id,r.created_at
from public.ashen_expedition_rewards r
where r.first_clear=true
order by r.user_id,r.boss_id,r.created_at,r.id
on conflict(user_id,boss_id) do nothing;

create or replace function public.ashen_expedition_award_victory()
returns trigger language plpgsql security definer set search_path='' as $$
declare p record; base_xp integer; base_credits integer; base_scrap integer;
  first_time boolean; probability double precision; item_roll double precision;
  selected_id text; selected_name text; selected_rarity integer; item_option integer; special_chance double precision;
begin
 if new.status <> 'resolved' or old.status is not distinct from new.status or new.result is null
    or not coalesce((new.result->>'victory')::boolean,false) then
  return new;
 end if;
 case new.boss_id
  when 1 then base_xp:=45; base_credits:=45; base_scrap:=12; probability:=0.28;
  when 2 then base_xp:=80; base_credits:=90; base_scrap:=22; probability:=0.42;
  when 3 then base_xp:=125; base_credits:=140; base_scrap:=36; probability:=0.58;
  else base_xp:=150; base_credits:=160; base_scrap:=40; probability:=0.60;
 end case;
 for p in select m.user_id from public.ashen_clan_expedition_members m
          where m.expedition_id=new.id order by m.user_id loop
  -- Ten sam gracz nie może równocześnie dostać dwóch premii za pierwsze zwycięstwo nad danym bossem.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p.user_id::text), new.boss_id);
  select not exists(select 1 from public.ashen_expedition_rewards r
                    where r.user_id=p.user_id and r.boss_id=new.boss_id and r.first_clear)
  into first_time;
  selected_id:=null; selected_name:=null; selected_rarity:=null;
  -- Jeden niezależny rzut na unikat bossa; później zwykła pula.
  -- Szansa łupu unikatowego: boss 1 = 8%, boss 2 = 6%, boss 3 = 5%.
  special_chance:=case new.boss_id when 1 then 0.08 when 2 then 0.06 when 3 then 0.05 else 0 end;
  if random()<special_chance then
    item_option:=floor(random()*3)::integer;
    case new.boss_id
      when 1 then
       case item_option
        when 0 then selected_id:='boss1_cleaver'; selected_name:='Tasak Rzeźnika'; selected_rarity:=3;
        when 1 then selected_id:='boss1_hook'; selected_name:='Hak Rozpruwacza'; selected_rarity:=2;
        else selected_id:='boss1_plate'; selected_name:='Płyta ze Złomowiska'; selected_rarity:=2;
       end case;
      when 2 then
       case item_option
        when 0 then selected_id:='boss2_fang'; selected_name:='Zatruty Kieł Pożeracza'; selected_rarity:=3;
        when 1 then selected_id:='boss2_hide'; selected_name:='Skóra Skażonego Łowcy'; selected_rarity:=2;
        else selected_id:='boss2_eye'; selected_name:='Oko z Głębin'; selected_rarity:=3;
       end case;
      when 3 then
       case item_option
        when 0 then selected_id:='boss3_nailgun'; selected_name:='Gwoździarka Mechanika'; selected_rarity:=3;
        when 1 then selected_id:='boss3_plate'; selected_name:='Pancerz Braci Rdzy'; selected_rarity:=3;
        else selected_id:='boss3_rifle'; selected_name:='Karabin Ostatniego Brata'; selected_rarity:=4;
       end case;
    end case;
  elsif random()<probability then
    item_option:=floor(random()*3)::integer;
    case new.boss_id
      when 1 then
       case item_option
        when 0 then selected_id:='cleaver'; selected_name:='Tasak z pustkowi';
        when 1 then selected_id:='vest'; selected_name:='Kamizelka z płytami';
        else selected_id:='pistol'; selected_name:='Pistolet M-9'; end case;
      when 2 then
       case item_option
        when 0 then selected_id:='shotgun'; selected_name:='Strzelba pustkowi';
        when 1 then selected_id:='hazmat'; selected_name:='Kombinezon skażeniowy';
        else selected_id:='mask'; selected_name:='Maska filtracyjna'; end case;
      else
       case item_option
        when 0 then selected_id:='hammer'; selected_name:='Młot złomiarza';
        when 1 then selected_id:='rifle'; selected_name:='Karabin szabrownika';
        else selected_id:='riot'; selected_name:='Pancerz oddziałów porządkowych'; end case;
    end case;
    item_roll:=random();
    selected_rarity:=case when item_roll<0.01 then 4
                           when item_roll<0.09 then 3
                           when item_roll<0.35 then 2
                           else 1 end;
    if new.boss_id=1 then selected_rarity:=least(2,selected_rarity); end if;
  end if;
  insert into public.ashen_expedition_rewards
     (expedition_id,user_id,boss_id,boss_name,xp,credits,scrap,first_clear,item_id,item_name,item_rarity)
  values(new.id,p.user_id,new.boss_id,left(coalesce(new.result->>'boss_name','Boss'),80),
         base_xp + case when first_time then round(base_xp*0.5)::integer else 0 end,
         base_credits + case when first_time then round(base_credits*0.5)::integer else 0 end,
         base_scrap + case when first_time then round(base_scrap*0.5)::integer else 0 end,
         first_time,selected_id,selected_name,selected_rarity)
  on conflict(expedition_id,user_id) do nothing;
  if first_time then
   insert into public.ashen_boss_badges(user_id,boss_id,boss_name,first_expedition_id)
   values(p.user_id,new.boss_id,left(coalesce(new.result->>'boss_name','Boss'),80),new.id)
   on conflict(user_id,boss_id) do nothing;
  end if;
 end loop;
 return new;
end $$;


-- Dostęp do odznak własnych i publicznego profilu gracza, bez maili ani danych prywatnych.
create or replace function public.ashen_player_boss_badges(p_user_id uuid)
returns table(boss_id integer,boss_name text,earned_at timestamptz)
language sql security definer set search_path='' as $$
 select b.boss_id,b.boss_name,b.earned_at
 from public.ashen_boss_badges b
 where auth.uid() is not null and b.user_id=p_user_id
 order by b.boss_id;
$$;

revoke all on function public.ashen_player_boss_badges(uuid) from public,anon;
grant execute on function public.ashen_player_boss_badges(uuid) to authenticated;
revoke all on function public.ashen_expedition_award_victory() from public,anon,authenticated;
