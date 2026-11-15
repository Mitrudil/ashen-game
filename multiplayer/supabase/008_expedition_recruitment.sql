-- ASHEN v0.3.1 — rekrutacja, zapasy ekspedycyjne, dwa sloty na klan, suma poziomów.
-- TYLKO projekt Supabase ASHEN. Wymaga wcześniejszych migracji 001–007.
-- Nie usuwa istniejących klanów, postaci ani raportów. Koszt tylko przy tworzeniu nowej ekspedycji.

-- Zastępujemy dawny limit jednego slotu kontrolą transakcyjną pod blokadą klanu.
drop index if exists public.ashen_clan_one_active_expedition;
create index if not exists ashen_expeditions_open_idx on public.ashen_clan_expeditions(clan_id,id) where status='forming';

create table if not exists public.ashen_clan_expedition_supplies (
  clan_id bigint primary key references public.ashen_clans(id) on delete cascade,
  balance integer not null default 12 check(balance between 0 and 12),
  last_regen timestamptz not null default now()
);
insert into public.ashen_clan_expedition_supplies(clan_id) select id from public.ashen_clans
on conflict(clan_id) do nothing;

create table if not exists public.ashen_clan_expedition_applications (
  id bigint generated always as identity primary key,
  expedition_id bigint not null references public.ashen_clan_expeditions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check(kind in ('application','invitation')),
  status text not null default 'pending' check(status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique(expedition_id,user_id)
);
create index if not exists ashen_exp_apps_expedition on public.ashen_clan_expedition_applications(expedition_id,status);

alter table public.ashen_clan_expedition_supplies enable row level security;
alter table public.ashen_clan_expedition_applications enable row level security;
revoke all on public.ashen_clan_expedition_supplies,public.ashen_clan_expedition_applications from public,anon,authenticated;

create or replace function public.ashen_expedition_limits(p_boss integer)
returns jsonb language sql immutable set search_path='' as $$
 select case p_boss
  when 1 then jsonb_build_object('cost',2,'max_levels',20)
  when 2 then jsonb_build_object('cost',3,'max_levels',35)
  when 3 then jsonb_build_object('cost',4,'max_levels',50)
  else jsonb_build_object('cost',99,'max_levels',0)
 end
$$;

-- Regeneracja +1 zapas / 6 godzin, do maksimum 12. Wszystkie zmiany w transakcji.
create or replace function public.ashen_expedition_regenerate(p_clan bigint)
returns integer language plpgsql security definer set search_path='' as $$
declare old_balance integer; old_at timestamptz; ticks integer;
begin
 insert into public.ashen_clan_expedition_supplies(clan_id) values(p_clan) on conflict do nothing;
 select balance,last_regen into old_balance,old_at from public.ashen_clan_expedition_supplies where clan_id=p_clan for update;
 ticks:=greatest(0,floor(extract(epoch from now()-old_at)/21600)::integer);
 if ticks>0 then
  update public.ashen_clan_expedition_supplies
     set balance=least(12,old_balance+ticks), last_regen=old_at+(ticks*interval '6 hours')
   where clan_id=p_clan;
 end if;
 return (select balance from public.ashen_clan_expedition_supplies where clan_id=p_clan);
end $$;

-- Wspólny warunek rekrutacji: aktualne postacie online, maksymalnie 5 graczy,
-- limit sumy poziomów oraz brak udziału w innej otwartej ekspedycji.
create or replace function public.ashen_expedition_admit(p_expedition bigint,p_user uuid)
returns void language plpgsql security definer set search_path='' as $$
declare e public.ashen_clan_expeditions%rowtype; target_level integer; current_sum integer; current_count integer; max_levels integer; max_players integer;
begin
 select * into e from public.ashen_clan_expeditions where id=p_expedition for update;
 if not found or e.status<>'forming' then raise exception 'Ekspedycja nie przyjmuje już uczestników.'; end if;
 if not exists(select 1 from public.ashen_clan_members where clan_id=e.clan_id and user_id=p_user) then raise exception 'Gracz nie jest już członkiem tego klanu.'; end if;
 -- Zablokowanie wspólnego rekordu użytkownika zapobiega jednoczesnemu przyjęciu go do dwóch wypraw.
 perform 1 from public.ashen_clan_members where clan_id=e.clan_id and user_id=p_user for update;
 select greatest(1,least(999,level)) into target_level from public.ashen_online_profiles where user_id=p_user;
 if target_level is null then raise exception 'Ten gracz musi najpierw opublikować postać online.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members where expedition_id=e.id and user_id=p_user) then return; end if;
 if exists(select 1 from public.ashen_clan_expedition_members m join public.ashen_clan_expeditions x on x.id=m.expedition_id
            where m.user_id=p_user and x.status='forming' and x.id<>e.id) then
    raise exception 'Postać jest już w składzie innej aktywnej ekspedycji.';
 end if;
 select count(*),coalesce(sum(greatest(1,least(999,p.level))),0) into current_count,current_sum
 from public.ashen_clan_expedition_members m join public.ashen_online_profiles p on p.user_id=m.user_id
 where m.expedition_id=e.id;
 max_players:=coalesce((public.ashen_expedition_boss(e.boss_id)->>'max_players')::integer,5);
 max_levels:=(public.ashen_expedition_limits(e.boss_id)->>'max_levels')::integer;
 if current_count>=max_players then raise exception 'Limit miejsc tej wyprawy został wyczerpany.'; end if;
 if current_sum+target_level>max_levels then raise exception 'Suma poziomów przekroczyłaby limit % (aktualnie % + kandydat %).',max_levels,current_sum,target_level; end if;
 insert into public.ashen_clan_expedition_members(expedition_id,user_id) values(e.id,p_user);
end $$;


-- Tworzenie wyprawy: organizator = lider/oficer; maks. 2 wyprawy na klan;
-- maks. 1 na danego organizatora, koszt obciąża wspólny zasób klanu.
create or replace function public.ashen_expedition_create(p_boss integer)
returns bigint language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; eid bigint; hi integer; cost integer; funds integer; max_levels integer; own_level integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może utworzyć wyprawę.'; end if;
 if p_boss not between 1 and 3 then raise exception 'Obecnie dostępni są bossowie 1–3.'; end if;
 select greatest(1,least(999,level)) into own_level from public.ashen_online_profiles where user_id=u;
 if own_level is null then raise exception 'Najpierw opublikuj swoją postać online.'; end if;
 cost:=(public.ashen_expedition_limits(p_boss)->>'cost')::integer;
 max_levels:=(public.ashen_expedition_limits(p_boss)->>'max_levels')::integer;
 if own_level>max_levels then raise exception 'Twój poziom (%) przekracza limit drużyny (%) dla tego bossa.',own_level,max_levels; end if;
 perform 1 from public.ashen_clans where id=cid for update;
 insert into public.ashen_clan_progress(clan_id) values(cid) on conflict do nothing;
 select greatest(3,highest_unlocked) into hi from public.ashen_clan_progress where clan_id=cid;
 if p_boss>coalesce(hi,3) then raise exception 'Ten boss nie został odblokowany.'; end if;
 if (select count(*) from public.ashen_clan_expeditions where clan_id=cid and status='forming')>=2 then raise exception 'Klan wykorzystał oba sloty ekspedycji.'; end if;
 if exists(select 1 from public.ashen_clan_expeditions where clan_id=cid and created_by=u and status='forming') then raise exception 'Masz już jedną organizowaną ekspedycję.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members m join public.ashen_clan_expeditions e on e.id=m.expedition_id where m.user_id=u and e.status='forming') then raise exception 'Jesteś już uczestnikiem innej aktywnej ekspedycji.'; end if;
 funds:=public.ashen_expedition_regenerate(cid);
 if funds<cost then raise exception 'Klan nie ma wystarczającej liczby zapasów ekspedycyjnych (% / %).',funds,cost; end if;
 update public.ashen_clan_expedition_supplies set balance=balance-cost where clan_id=cid;
 insert into public.ashen_clan_expeditions(clan_id,boss_id,created_by,tactic) values(cid,p_boss,u,'focus_weakest') returning id into eid;
 perform public.ashen_expedition_admit(eid,u);
 return eid;
end $$;

-- Nowe zgłoszenie własnej kandydatury: bez automatycznego przyjęcia do składu.
create or replace function public.ashen_expedition_apply(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); e public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select * into e from public.ashen_clan_expeditions where id=p_expedition for update;
 if not found or e.status<>'forming' then raise exception 'Ekspedycja jest niedostępna.'; end if;
 if e.created_by=u then raise exception 'Organizator jest już w składzie.'; end if;
 if not exists(select 1 from public.ashen_clan_members where user_id=u and clan_id=e.clan_id) then raise exception 'Nie należysz do tego klanu.'; end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=u) then raise exception 'Opublikuj postać online.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members where expedition_id=e.id and user_id=u) then raise exception 'Już jesteś w składzie.'; end if;
 insert into public.ashen_clan_expedition_applications(expedition_id,user_id,kind,status)
 values(e.id,u,'application','pending')
 on conflict(expedition_id,user_id) do update set kind='application',status='pending',created_at=now(),decided_at=null;
end $$;

-- Imienne zaproszenie przez organizatora (nie przez dowolnego oficera).
create or replace function public.ashen_expedition_invite(p_expedition bigint,p_user uuid)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); e public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select * into e from public.ashen_clan_expeditions where id=p_expedition for update;
 if not found or e.status<>'forming' then raise exception 'Ekspedycja jest niedostępna.'; end if;
 if e.created_by<>u then raise exception 'Tylko organizator może zapraszać graczy.'; end if;
 if p_user=u then raise exception 'Organizator jest już w składzie.'; end if;
 if not exists(select 1 from public.ashen_clan_members where user_id=p_user and clan_id=e.clan_id) then raise exception 'Gracz nie należy do tego klanu.'; end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=p_user) then raise exception 'Gracz nie ma postaci online.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members where expedition_id=e.id and user_id=p_user) then raise exception 'Gracz jest już w składzie.'; end if;
 insert into public.ashen_clan_expedition_applications(expedition_id,user_id,kind,status)
 values(e.id,p_user,'invitation','pending')
 on conflict(expedition_id,user_id) do update set kind='invitation',status='pending',created_at=now(),decided_at=null;
end $$;

-- Decyzja: organizator akceptuje/odrzuca kandydaturę;
-- zaproszony gracz przyjmuje/odrzuca zaproszenie;
-- gracz może wycofać swoje oczekujące zgłoszenie.
create or replace function public.ashen_expedition_decide(p_expedition bigint,p_user uuid,p_action text)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); e public.ashen_clan_expeditions%rowtype; a public.ashen_clan_expedition_applications%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if p_action not in ('accept','reject','withdraw') then raise exception 'Nieznana decyzja.'; end if;
 select * into e from public.ashen_clan_expeditions where id=p_expedition for update;
 if not found or e.status<>'forming' then raise exception 'Ekspedycja jest niedostępna.'; end if;
 select * into a from public.ashen_clan_expedition_applications where expedition_id=e.id and user_id=p_user for update;
 if not found or a.status<>'pending' then raise exception 'Nie ma oczekującego zgłoszenia lub zaproszenia.'; end if;
 if a.kind='application' then
  if p_action='withdraw' then
   if u<>p_user then raise exception 'Tylko kandydat może wycofać zgłoszenie.'; end if;
  elsif u<>e.created_by then raise exception 'Tylko organizator zatwierdza kandydatów.'; end if;
 else
  if u<>p_user then raise exception 'Tylko zaproszony gracz może odpowiedzieć.'; end if;
 end if;
 if p_action='accept' then
  perform public.ashen_expedition_admit(e.id,p_user);
  update public.ashen_clan_expedition_applications set status='accepted',decided_at=now() where id=a.id;
 else
  update public.ashen_clan_expedition_applications set status=case when p_action='withdraw' then 'withdrawn' else 'rejected' end,decided_at=now() where id=a.id;
 end if;
end $$;

create or replace function public.ashen_expedition_withdraw(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); e public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select * into e from public.ashen_clan_expeditions where id=p_expedition for update;
 if not found or e.status<>'forming' then raise exception 'Ekspedycja jest niedostępna.'; end if;
 if e.created_by=u then raise exception 'Organizator musi anulować całą wyprawę.'; end if;
 delete from public.ashen_clan_expedition_members where expedition_id=e.id and user_id=u;
 update public.ashen_clan_expedition_applications set status='withdrawn',decided_at=now() where expedition_id=e.id and user_id=u;
end $$;

create or replace function public.ashen_expedition_state()
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; result jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 select jsonb_build_object(
  'clan', (select to_jsonb(c) from public.ashen_clans c where c.id=cid),
  'my_role', (select role from public.ashen_clan_members where user_id=u),
  'members', coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'role',m.role,'joined_at',m.joined_at,'name',coalesce(p.name,'Ocalały'),'level',coalesce(p.level,1),'origin',p.origin) order by case m.role when 'leader' then 0 when 'officer' then 1 else 2 end,p.level desc) from public.ashen_clan_members m left join public.ashen_online_profiles p on p.user_id=m.user_id where m.clan_id=cid),'[]'::jsonb),
  'progress', coalesce((select jsonb_build_object('highest_unlocked',greatest(3,g.highest_unlocked),'boss_wins',g.boss_wins) from public.ashen_clan_progress g where g.clan_id=cid), jsonb_build_object('highest_unlocked',3,'boss_wins','[]'::jsonb)),
  'bosses', (select coalesce(jsonb_agg(public.ashen_expedition_boss(gs) order by gs),'[]'::jsonb) from generate_series(1,3) gs),
  'supplies', case when cid is null then null else jsonb_build_object('balance',public.ashen_expedition_regenerate(cid),'max',12,'regen_hours',6) end,
  'active_expeditions', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id',e.id,'boss_id',e.boss_id,'status',e.status,'created_at',e.created_at,
      'created_by',e.created_by,'created_by_name',coalesce(p.name,'Ocalały'),
      'boss',public.ashen_expedition_boss(e.boss_id),
      'tactic',coalesce(e.tactic,'focus_weakest'),'tactic_label',public.ashen_expedition_tactic_label(e.tactic),
      'max_levels',(public.ashen_expedition_limits(e.boss_id)->>'max_levels')::integer,
      'level_sum',coalesce((select sum(greatest(1,pp.level)) from public.ashen_clan_expedition_members m join public.ashen_online_profiles pp on pp.user_id=m.user_id where m.expedition_id=e.id),0),
      'participants',coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'joined_at',m.joined_at,'role',cm.role,'name',coalesce(pp.name,'Ocalały'),'level',coalesce(pp.level,1)) order by m.joined_at) from public.ashen_clan_expedition_members m join public.ashen_clan_members cm on cm.user_id=m.user_id left join public.ashen_online_profiles pp on pp.user_id=m.user_id where m.expedition_id=e.id),'[]'::jsonb),
      'applications',coalesce((select jsonb_agg(jsonb_build_object('user_id',a.user_id,'name',coalesce(pp.name,'Ocalały'),'level',coalesce(pp.level,1),'kind',a.kind,'status',a.status) order by a.created_at) from public.ashen_clan_expedition_applications a left join public.ashen_online_profiles pp on pp.user_id=a.user_id where a.expedition_id=e.id and a.status='pending' and (e.created_by=u or a.user_id=u)),'[]'::jsonb)
    ) order by e.created_at)
    from public.ashen_clan_expeditions e left join public.ashen_online_profiles p on p.user_id=e.created_by
    where e.clan_id=cid and e.status='forming'
  ),'[]'::jsonb),
  'reports', coalesce((select jsonb_agg(jsonb_build_object('id',e.id,'boss_id',e.boss_id,'boss_name',coalesce(e.result->>'boss_name',public.ashen_expedition_boss(e.boss_id)->>'name'),'location',coalesce(e.result->>'location',public.ashen_expedition_boss(e.boss_id)->>'location'),'victory',coalesce((e.result->>'victory')::boolean,false),'created_at',coalesce(e.launched_at,e.created_at)) order by coalesce(e.launched_at,e.created_at) desc) from (select * from public.ashen_clan_expeditions where clan_id=cid and status='resolved' order by coalesce(launched_at,created_at) desc limit 12) e),'[]'::jsonb)
 ) into result;
 return result;
end $$;


create or replace function public.ashen_expedition_launch(p_expedition bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
 boss jsonb; enemies jsonb; heroes jsonb:='[]'::jsonb;
 hero_count integer:=0; enemy_count integer:=0; member_count integer:=0; idx integer; jdx integer; pick integer;
 hero_hp integer[]; max_hero_hp integer[]; enemy_hp integer[]; max_enemy_hp integer[]; hero_before integer[]; enemy_before integer[];
 hero_totals jsonb:='[]'::jsonb; enemy_totals jsonb:='[]'::jsonb;
 round_events jsonb; rounds jsonb:='[]'::jsonb;
 h jsonb; e jsonb; attacks jsonb; attack jsonb; other integer; alive integer; chance numeric; critical boolean; lowv integer; highv integer; dmg integer; armor numeric; r integer;
 report jsonb; name_txt text; best integer; tactic_code text; best_hp integer; best_score numeric; threat numeric;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może rozpocząć wyprawę.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 if exp.created_by<>u then raise exception 'Tylko organizator może rozpocząć walkę.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members m left join public.ashen_clan_members cm on cm.user_id=m.user_id and cm.clan_id=exp.clan_id where m.expedition_id=exp.id and cm.user_id is null) then raise exception 'W składzie jest postać, która opuściła klan. Skoryguj skład.'; end if;
 if (select coalesce(sum(greatest(1,p.level)),0) from public.ashen_clan_expedition_members m join public.ashen_online_profiles p on p.user_id=m.user_id where m.expedition_id=exp.id)
    >(public.ashen_expedition_limits(exp.boss_id)->>'max_levels')::integer then
    raise exception 'Przekroczono limit sumy poziomów. Skoryguj skład.';
 end if;
 boss:=public.ashen_expedition_boss(exp.boss_id);
 if boss is null then raise exception 'Brak danych bossa.'; end if;
 tactic_code:=coalesce(exp.tactic,'focus_weakest');
 select count(*) into member_count from public.ashen_clan_expedition_members where expedition_id=exp.id;
 select coalesce(jsonb_agg(p.snapshot order by m.joined_at),'[]'::jsonb)
 into heroes
 from public.ashen_clan_expedition_members m
 join public.ashen_online_profiles p on p.user_id=m.user_id
 where m.expedition_id=exp.id;
 hero_count:=coalesce(jsonb_array_length(heroes),0);
 if hero_count<>member_count then raise exception 'Wszyscy uczestnicy muszą mieć aktualną postać online.'; end if;
 if hero_count<coalesce((boss->>'min_players')::integer,2) then raise exception 'Do tej wyprawy potrzeba co najmniej % uczestników.',coalesce((boss->>'min_players')::integer,2); end if;
 if hero_count>coalesce((boss->>'max_players')::integer,5) then raise exception 'Ta wyprawa przekracza limit składu.'; end if;
 enemies:=boss->'enemies'; enemy_count:=coalesce(jsonb_array_length(enemies),0);
 if enemy_count<1 then raise exception 'Boss nie ma skonfigurowanych przeciwników.'; end if;

 hero_hp:=array[]::integer[]; max_hero_hp:=array[]::integer[]; hero_totals:='[]'::jsonb;
 for h in select value from jsonb_array_elements(heroes) loop
  max_hero_hp:=array_append(max_hero_hp,least(50000,greatest(1,coalesce((h->>'hp')::integer,1))));
  hero_hp:=array_append(hero_hp,least(50000,greatest(1,coalesce((h->>'hp')::integer,1))));
  hero_totals:=hero_totals||jsonb_build_array(jsonb_build_object('attempts',0,'hits',0,'misses',0,'critical',0,'damage',0,'best',0));
 end loop;

 enemy_hp:=array[]::integer[]; max_enemy_hp:=array[]::integer[]; enemy_totals:='[]'::jsonb;
 for e in select value from jsonb_array_elements(enemies) loop
  max_enemy_hp:=array_append(max_enemy_hp,least(50000,greatest(1,coalesce((e->>'hp')::integer,1))));
  enemy_hp:=array_append(enemy_hp,least(50000,greatest(1,coalesce((e->>'hp')::integer,1))));
  enemy_totals:=enemy_totals||jsonb_build_array(jsonb_build_object('attempts',0,'hits',0,'misses',0,'critical',0,'damage',0,'best',0));
 end loop;

 for r in 1..12 loop
  exit when not exists(select 1 from unnest(hero_hp) x where x>0) or not exists(select 1 from unnest(enemy_hp) x where x>0);
  round_events:='[]'::jsonb;
  hero_before:=hero_hp;
  enemy_before:=enemy_hp;

  for idx in 1..hero_count loop
   exit when not exists(select 1 from unnest(enemy_hp) x where x>0);
   if hero_hp[idx]<=0 then continue; end if;
   h:=heroes->(idx-1);
   attacks:=coalesce(h->'attacks','[]'::jsonb);
   for attack in select value from jsonb_array_elements(attacks) loop
    exit when not exists(select 1 from unnest(enemy_hp) x where x>0);
    other:=null;
    if tactic_code='focus_weakest' then
      best_hp:=null;
      for jdx in 1..enemy_count loop
        if enemy_hp[jdx]>0 and (other is null or enemy_hp[jdx]<best_hp or (enemy_hp[jdx]=best_hp and jdx<other)) then
          other:=jdx; best_hp:=enemy_hp[jdx];
        end if;
      end loop;
    elsif tactic_code='focus_strongest' then
      best_score:=null;
      for jdx in 1..enemy_count loop
        if enemy_hp[jdx]>0 then
          threat:=coalesce((enemies->(jdx-1)->>'acc')::numeric,0)
                  + coalesce((enemies->(jdx-1)->>'armor')::numeric,0)/10
                  + coalesce((enemies->(jdx-1)->>'hp')::numeric,0)/40
                  + coalesce((enemies->(jdx-1)->'attacks'->0->>'max')::numeric,0)/3;
          if other is null or threat>best_score or (threat=best_score and enemy_hp[jdx]>enemy_hp[other]) then
            other:=jdx; best_score:=threat;
          end if;
        end if;
      end loop;
    else
      alive:=0;
      for jdx in 1..enemy_count loop if enemy_hp[jdx]>0 then alive:=alive+1; end if; end loop;
      if alive=0 then exit; end if;
      pick:=1+floor(random()*alive)::integer; other:=null;
      for jdx in 1..enemy_count loop if enemy_hp[jdx]>0 then pick:=pick-1; if pick=0 then other:=jdx; exit; end if; end if; end loop;
    end if;
    if other is null then exit; end if;
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'attempts'],to_jsonb(coalesce((hero_totals->(idx-1)->>'attempts')::integer,0)+1));
    chance:=greatest(15,least(95,70+2*(coalesce((h->>'acc')::numeric,6)-coalesce((enemies->(other-1)->>'dodge')::numeric,3))+coalesce((attack->'weapon'->>'accuracy')::numeric,coalesce((attack->>'accuracy')::numeric,0))));
    name_txt:=left(coalesce(h->>'name','Ocalały'),40)||': '||left(coalesce(attack->'weapon'->>'name',coalesce(attack->>'name','Atak')),60);
    if random()*100>=chance then
      hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'misses'],to_jsonb(coalesce((hero_totals->(idx-1)->>'misses')::integer,0)+1));
      round_events:=round_events||to_jsonb(name_txt||' — pudło w '||coalesce(enemies->(other-1)->>'name','przeciwnika')||'.');
      continue;
    end if;
    lowv:=greatest(1,least(2000,coalesce((attack->'weapon'->>'min')::integer,coalesce((attack->>'min')::integer,1))));
    highv:=greatest(lowv,least(2000,coalesce((attack->'weapon'->>'max')::integer,coalesce((attack->>'max')::integer,lowv))));
    dmg:=floor((lowv+floor(random()*(highv-lowv+1)))*greatest(0.1,least(2,coalesce((attack->>'power')::numeric,1))))::integer;
    critical:=random()<greatest(0,least(0.35,0.05+coalesce((h->'attrs'->>'per')::numeric,5)*0.005+coalesce((attack->'weapon'->>'critPp')::numeric,coalesce((attack->>'critPp')::numeric,0))/100));
    if critical then dmg:=floor(dmg*1.6); end if;
    armor:=greatest(0,least(0.6,coalesce((enemies->(other-1)->>'armor')::numeric,0)/100));
    dmg:=least(enemy_hp[other],greatest(1,floor(dmg*(1-armor))::integer));
    enemy_hp[other]:=enemy_hp[other]-dmg;
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'hits'],to_jsonb(coalesce((hero_totals->(idx-1)->>'hits')::integer,0)+1));
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'damage'],to_jsonb(coalesce((hero_totals->(idx-1)->>'damage')::integer,0)+dmg));
    best:=greatest(coalesce((hero_totals->(idx-1)->>'best')::integer,0),dmg);
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'best'],to_jsonb(best));
    if critical then hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'critical'],to_jsonb(coalesce((hero_totals->(idx-1)->>'critical')::integer,0)+1)); end if;
    round_events:=round_events||to_jsonb(name_txt||' — '||dmg||' obrażeń w '||coalesce(enemies->(other-1)->>'name','przeciwnika')||(case when critical then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;

  for idx in 1..enemy_count loop
   exit when not exists(select 1 from unnest(hero_hp) x where x>0);
   if enemy_hp[idx]<=0 then continue; end if;
   e:=enemies->(idx-1);
   attacks:=coalesce(e->'attacks','[]'::jsonb);
   for attack in select value from jsonb_array_elements(attacks) loop
    exit when not exists(select 1 from unnest(hero_hp) x where x>0);
    alive:=0;
    for jdx in 1..hero_count loop if hero_hp[jdx]>0 then alive:=alive+1; end if; end loop;
    if alive=0 then exit; end if;
    pick:=1+floor(random()*alive)::integer; other:=null;
    for jdx in 1..hero_count loop if hero_hp[jdx]>0 then pick:=pick-1; if pick=0 then other:=jdx; exit; end if; end if; end loop;
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'attempts'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'attempts')::integer,0)+1));
    chance:=greatest(15,least(95,70+2*(coalesce((e->>'acc')::numeric,8)-coalesce((heroes->(other-1)->>'dodge')::numeric,3))+coalesce((attack->>'accuracy')::numeric,0)));
    name_txt:=left(coalesce(e->>'name','Wróg'),40)||': '||left(coalesce(attack->>'name','Atak'),60);
    if random()*100>=chance then
      enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'misses'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'misses')::integer,0)+1));
      round_events:=round_events||to_jsonb(name_txt||' — pudło w '||coalesce(heroes->(other-1)->>'name','ocalałego')||'.');
      continue;
    end if;
    lowv:=greatest(1,least(2000,coalesce((attack->>'min')::integer,1)));
    highv:=greatest(lowv,least(2000,coalesce((attack->>'max')::integer,lowv)));
    dmg:=floor((lowv+floor(random()*(highv-lowv+1)))*greatest(0.1,least(2,coalesce((attack->>'power')::numeric,1))))::integer;
    critical:=random()<greatest(0,least(0.35,0.05+coalesce((e->>'acc')::numeric,8)*0.002+coalesce((attack->>'critPp')::numeric,0)/100));
    if critical then dmg:=floor(dmg*1.6); end if;
    armor:=greatest(0,least(0.6,coalesce((heroes->(other-1)->>'armor')::numeric,0)/100));
    dmg:=least(hero_hp[other],greatest(1,floor(dmg*(1-armor))::integer));
    hero_hp[other]:=hero_hp[other]-dmg;
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'hits'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'hits')::integer,0)+1));
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'damage'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'damage')::integer,0)+dmg));
    best:=greatest(coalesce((enemy_totals->(idx-1)->>'best')::integer,0),dmg);
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'best'],to_jsonb(best));
    if critical then enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'critical'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'critical')::integer,0)+1)); end if;
    round_events:=round_events||to_jsonb(name_txt||' — '||dmg||' obrażeń w '||coalesce(heroes->(other-1)->>'name','ocalałego')||(case when critical then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;

  rounds:=rounds||jsonb_build_array(jsonb_build_object('number',r,'events',round_events,'hero_hp_before',to_jsonb(hero_before),'hero_hp',to_jsonb(hero_hp),'enemy_hp_before',to_jsonb(enemy_before),'enemy_hp',to_jsonb(enemy_hp)));
 end loop;

 report:=jsonb_build_object(
  'boss_id',exp.boss_id,
  'boss_name',boss->>'name',
  'location',boss->>'location',
  'tactic',tactic_code,
  'tactic_label',public.ashen_expedition_tactic_label(tactic_code),
  'at',to_char(now() at time zone 'Europe/Warsaw','DD.MM.YYYY, HH24:MI:SS'),
  'heroes',heroes,
  'enemies',enemies,
  'hero_hp',to_jsonb(hero_hp),
  'enemy_hp',to_jsonb(enemy_hp),
  'max_hero_hp',to_jsonb(max_hero_hp),
  'max_enemy_hp',to_jsonb(max_enemy_hp),
  'hero_totals',hero_totals,
  'enemy_totals',enemy_totals,
  'rounds',rounds,
  'victory',not exists(select 1 from unnest(enemy_hp) x where x>0),
  'outcome',case when not exists(select 1 from unnest(enemy_hp) x where x>0) then 'victory' when not exists(select 1 from unnest(hero_hp) x where x>0) then 'defeat' else 'draw' end,
  'reason',case when not exists(select 1 from unnest(enemy_hp) x where x>0) then 'Wszyscy przeciwnicy zostali pokonani.' when not exists(select 1 from unnest(hero_hp) x where x>0) then 'Wszyscy członkowie drużyny padli.' else 'Limit 12 rund minął, a bossowie nadal żyli.' end
 );

 update public.ashen_clan_expeditions set status='resolved',launched_at=now(),result=report where id=exp.id;
 insert into public.ashen_clan_progress(clan_id) values(cid) on conflict(clan_id) do nothing;
 if (report->>'victory')::boolean then
  update public.ashen_clan_progress
  set boss_wins = case when boss_wins @> jsonb_build_array(exp.boss_id) then boss_wins else boss_wins || jsonb_build_array(exp.boss_id) end,
      highest_unlocked = greatest(highest_unlocked, least(20, greatest(3, exp.boss_id+1))),
      updated_at = now()
  where clan_id=cid;
 end if;
 return jsonb_set(report,'{id}',to_jsonb(exp.id),true);
end $$;


create or replace function public.ashen_expedition_set_tactic(p_expedition bigint,p_tactic text)
returns text language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if p_tactic not in ('focus_weakest','focus_strongest','spread') then
   raise exception 'Nieznana taktyka ekspedycji.';
 end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może zmieniać taktykę wyprawy.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 if exp.created_by<>u then raise exception 'Tylko organizator zmienia taktykę.'; end if;
 update public.ashen_clan_expeditions set tactic=p_tactic where id=exp.id;
 return public.ashen_expedition_tactic_label(p_tactic);
end $$;


create or replace function public.ashen_expedition_cancel(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może anulować wyprawę.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 if exp.created_by<>u then raise exception 'Tylko organizator anuluje wyprawę.'; end if;
 update public.ashen_clan_expeditions set status='cancelled' where id=exp.id;
end $$;



revoke all on function public.ashen_expedition_limits(integer),public.ashen_expedition_regenerate(bigint),public.ashen_expedition_admit(bigint,uuid),public.ashen_expedition_apply(bigint),public.ashen_expedition_invite(bigint,uuid),public.ashen_expedition_decide(bigint,uuid,text),public.ashen_expedition_withdraw(bigint) from public,anon,authenticated;
-- Stare automatyczne dołączanie jest blokowane; nowa rekrutacja wyłącznie przez zgłoszenia/zaproszenia.
revoke execute on function public.ashen_expedition_join(bigint),public.ashen_expedition_leave(bigint) from public,anon,authenticated;
grant execute on function public.ashen_expedition_state(),public.ashen_expedition_create(integer),public.ashen_expedition_launch(bigint),public.ashen_expedition_set_tactic(bigint,text),public.ashen_expedition_cancel(bigint),public.ashen_expedition_apply(bigint),public.ashen_expedition_invite(bigint,uuid),public.ashen_expedition_decide(bigint,uuid,text),public.ashen_expedition_withdraw(bigint) to authenticated;
