-- ASHEN v0.4.3.5 — pełny raport ekspedycji z nagrodami wszystkich uczestników.
-- URUCHOM po 022_solo_expeditions_shared_rewards.sql.
-- Nie losuje ponownie przedmiotów ani nie przyznaje historycznych nagród drugi raz.
-- Serwer nadal przyznaje rekordy nagród w transakcji kończącej walkę.
-- Klient automatycznie synchronizuje przyznane nagrody z zapisem postaci po zalogowaniu.

create or replace function public.ashen_expedition_report(p_id bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=auth.uid(); payload jsonb; prize_rows jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 -- Historyczny uczestnik może przeczytać własny raport również po opuszczeniu frakcji.
 -- Osoby, które nie brały udziału, nie mogą pobierać wyniku ani cudzych nagród.
 select e.result into payload
 from public.ashen_clan_expeditions e
 where e.id=p_id and e.status='resolved' and e.result is not null
   and exists(select 1 from public.ashen_clan_expedition_members m
              where m.expedition_id=e.id and m.user_id=u);
 if payload is null then raise exception 'Nie znaleziono raportu tej ekspedycji.'; end if;

 select coalesce(jsonb_agg(jsonb_build_object(
    'name',coalesce(p.name,'Ocalały'),
    'organizer',(m.user_id=e.created_by),
    'xp',r.xp,
    'credits',r.credits,
    'scrap',r.scrap,
    'first_clear',r.first_clear,
    'item_id',r.item_id,
    'item_name',r.item_name,
    'item_rarity',r.item_rarity
 ) order by m.joined_at,m.user_id),'[]'::jsonb)
 into prize_rows
 from public.ashen_clan_expeditions e
 join public.ashen_clan_expedition_members m on m.expedition_id=e.id
 join public.ashen_expedition_rewards r on r.expedition_id=e.id and r.user_id=m.user_id
 left join public.ashen_online_profiles p on p.user_id=m.user_id
 where e.id=p_id;
 return jsonb_set(jsonb_set(payload,'{id}',to_jsonb(p_id),true),'{rewards}',prize_rows,true);
end $$;

revoke all on function public.ashen_expedition_report(bigint) from public,anon;
grant execute on function public.ashen_expedition_report(bigint) to authenticated;

-- Nowe powiadomienia kierują do pełnego raportu czytanego w Wiadomościach.
create or replace function public.ashen_expedition_notify_resolved()
returns trigger language plpgsql security definer set search_path='' as $$
declare nm text; verdict text;
begin
 if new.status='resolved' and old.status is distinct from new.status and new.result is not null then
  nm:=coalesce(new.result->>'boss_name','Boss Pustkowi');
  verdict:=case when coalesce((new.result->>'victory')::boolean,false) then 'Zwycięstwo' else 'Porażka / remis' end;
  insert into public.ashen_expedition_notices(expedition_id,recipient_id,subject,body)
  select new.id,m.user_id,'Ekspedycja: '||left(nm,70),
   verdict||' — '||nm||'. Otwórz tę wiadomość, aby zobaczyć pełny raport, nagrody całej drużyny i przedmiot organizatora. Nagrody trafiają do postaci automatycznie po synchronizacji.'
  from public.ashen_clan_expedition_members m where m.expedition_id=new.id
  on conflict(expedition_id,recipient_id) do nothing;
 end if;
 return new;
end $$;
revoke all on function public.ashen_expedition_notify_resolved() from public,anon,authenticated;
