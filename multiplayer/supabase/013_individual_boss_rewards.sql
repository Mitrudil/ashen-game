-- ASHEN v0.3.5 — indywidualne nagrody za ekspedycje klanowe.
-- Uruchom WYŁĄCZNIE w projekcie ASHEN, po 012_mail_and_profiles.sql.
-- Nie modyfikuje historycznych raportów, nie zmienia walk ani starszych schematów.
-- Nowe nagrody dotyczą zwycięstw od chwili instalacji; bez automatycznego nagradzania dawnych walk.

create table if not exists public.ashen_expedition_rewards (
 id bigint generated always as identity primary key,
 expedition_id bigint not null references public.ashen_clan_expeditions(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 boss_id integer not null,
 boss_name text not null,
 xp integer not null check (xp between 0 and 10000),
 credits integer not null check (credits between 0 and 100000),
 scrap integer not null check (scrap between 0 and 100000),
 first_clear boolean not null default false,
 item_id text,
 item_name text,
 item_rarity integer check(item_rarity between 0 and 4),
 created_at timestamptz not null default now(),
 claimed_at timestamptz,
 unique(expedition_id,user_id),
 constraint ashen_reward_item_consistency check ((item_id is null and item_rarity is null and item_name is null) or (item_id is not null and item_rarity is not null and item_name is not null))
);
create index if not exists ashen_expedition_rewards_user_idx on public.ashen_expedition_rewards(user_id,created_at desc);
alter table public.ashen_expedition_rewards enable row level security;
revoke all on public.ashen_expedition_rewards from public,anon,authenticated;

-- Bezpośrednie pobieranie cudzych nagród i dopisywanie łupów z klienta jest zabronione.
-- Losowanie następuje raz na serwerze, w tej samej transakcji co rozstrzygnięcie walki.
create or replace function public.ashen_expedition_award_victory()
returns trigger language plpgsql security definer set search_path='' as $$
declare p record; base_xp integer; base_credits integer; base_scrap integer;
  first_time boolean; probability double precision; item_roll double precision;
  selected_id text; selected_name text; selected_rarity integer; item_option integer;
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
  if random()<probability then
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
 end loop;
 return new;
end $$;

drop trigger if exists ashen_expedition_award_victory_trigger on public.ashen_clan_expeditions;
create trigger ashen_expedition_award_victory_trigger
 after update of status on public.ashen_clan_expeditions
 for each row execute function public.ashen_expedition_award_victory();

create or replace function public.ashen_expedition_my_rewards()
returns table(id bigint,expedition_id bigint,boss_id integer,boss_name text,xp integer,credits integer,scrap integer,
 first_clear boolean,item_id text,item_name text,item_rarity integer,created_at timestamptz,claimed_at timestamptz)
language sql security definer set search_path='' as $$
 select r.id,r.expedition_id,r.boss_id,r.boss_name,r.xp,r.credits,r.scrap,
        r.first_clear,r.item_id,r.item_name,r.item_rarity,r.created_at,r.claimed_at
 from public.ashen_expedition_rewards r
 where r.user_id=auth.uid() and auth.uid() is not null
 order by (r.claimed_at is null) desc,r.created_at desc limit 100;
$$;

-- Acknowledgement następuje dopiero PO lokalnym zastosowaniu nagrody przez klienta.
-- Powtórne wywołanie jest bezpieczne. Nigdy nie modyfikuje cudzej nagrody.
create or replace function public.ashen_expedition_reward_ack(p_id bigint)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Zaloguj się.'; end if;
 update public.ashen_expedition_rewards
 set claimed_at=coalesce(claimed_at,now())
 where id=p_id and user_id=auth.uid();
 return found;
end $$;

revoke all on function public.ashen_expedition_award_victory(),
 public.ashen_expedition_my_rewards(),public.ashen_expedition_reward_ack(bigint) from public,anon,authenticated;
grant execute on function public.ashen_expedition_my_rewards(),public.ashen_expedition_reward_ack(bigint) to authenticated;
