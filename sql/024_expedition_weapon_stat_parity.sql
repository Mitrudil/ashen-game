-- ASHEN v0.4.5 — zgodność obliczeń broni: Starcia / PvP / Ekspedycje.
-- WYMAGANIA: wszystkie wcześniejsze migracje do 023 włącznie.
-- Uruchom jeden raz w Supabase SQL Editor po wdrożeniu 0.4.4.
-- Zmienia WYŁĄCZNIE funkcję silnika ekspedycji; bez modyfikacji nagród,
-- członkostwa, magazynów, struktur tabel i dotychczasowych raportów.
-- Nowy wzór dotyczy przyszłych walk. Raportów historycznych nie przelicza.
-- Rozgrywka ma nadal inne limity rund i bonusy typowe dla ekspedycji.

create or replace function public.ashen_expedition_resolve_internal(p_expedition bigint,p_automatic boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
 boss jsonb; enemies jsonb; heroes jsonb:='[]'::jsonb;
 hero_count integer:=0; enemy_count integer:=0; member_count integer:=0; idx integer; jdx integer; pick integer;
 hero_hp integer[]; max_hero_hp integer[]; enemy_hp integer[]; max_enemy_hp integer[]; hero_before integer[]; enemy_before integer[];
 hero_totals jsonb:='[]'::jsonb; enemy_totals jsonb:='[]'::jsonb;
 round_events jsonb; rounds jsonb:='[]'::jsonb;
 h jsonb; e jsonb; attacks jsonb; attack jsonb; other integer; alive integer; chance numeric; critical boolean; lowv integer; highv integer; dmg integer; armor numeric; r integer;
 weapon_id text; attr_str numeric; attr_dex numeric; attr_per numeric; weapon_acc numeric; weapon_bonus integer;
 support_rations integer:=0;support_medical integer:=0;support_technical integer:=0;
 passive_kitchen integer:=0;passive_clinic integer:=0;passive_workshop integer:=0;
 report jsonb; name_txt text; best integer; tactic_code text; best_hp integer; best_score numeric; threat numeric;
begin
 if p_automatic then
    -- ONLY the scheduler may use this path; not exposed to authenticated/anon.
    if session_user not in ('postgres','supabase_admin') then raise exception 'Automatyczne rozliczenie wyłącznie z harmonogramu.'; end if;
    select * into exp from public.ashen_clan_expeditions where id=p_expedition for update;
    if not found or exp.status<>'forming' or exp.starts_at>now() then return null; end if;
    cid:=exp.clan_id;
 else
    if u is null then raise exception 'Zaloguj się.'; end if;
    select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
    if cid is null then raise exception 'Nie należysz do frakcji.'; end if;
    select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
    if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
    if exp.created_by<>u then raise exception 'Tylko organizator może rozpocząć walkę.'; end if;
    if exp.starts_at>now() and not exp.early_ready then raise exception 'Aby skrócić zbiórkę, najpierw potwierdź gotowość drużyny.'; end if;
 end if;
 if exists(select 1 from public.ashen_clan_expedition_members m left join public.ashen_clan_members cm on cm.user_id=m.user_id and cm.clan_id=exp.clan_id where m.expedition_id=exp.id and cm.user_id is null) then raise exception 'W składzie jest postać, która opuściła klan. Skoryguj skład.'; end if;
 if (select coalesce(sum(greatest(1,p.level)),0) from public.ashen_clan_expedition_members m join public.ashen_online_profiles p on p.user_id=m.user_id where m.expedition_id=exp.id)
    >(public.ashen_expedition_limits(exp.boss_id)->>'max_levels')::integer then
    raise exception 'Przekroczono limit sumy poziomów. Skoryguj skład.';
 end if;
 boss:=public.ashen_expedition_boss(exp.boss_id);
 if boss is null then raise exception 'Brak danych bossa.'; end if;
 SELECT COALESCE(max(level) FILTER(WHERE support='rations'),0),COALESCE(max(level) FILTER(WHERE support='medical'),0),COALESCE(max(level) FILTER(WHERE support='technical'),0)
 INTO support_rations,support_medical,support_technical
 FROM public.ashen_faction_expedition_supplies WHERE expedition_id=exp.id AND clan_id=cid;
 SELECT COALESCE(b.kitchen_level,0),COALESCE(b.clinic_level,0),COALESCE(b.workshop_level,0)
 INTO passive_kitchen,passive_clinic,passive_workshop
 FROM public.ashen_faction_bases b WHERE b.clan_id=cid;
 IF NOT FOUND THEN passive_kitchen:=0;passive_clinic:=0;passive_workshop:=0; END IF;
 tactic_code:=coalesce(exp.tactic,'focus_weakest');
 select count(*) into member_count from public.ashen_clan_expedition_members where expedition_id=exp.id;
 select coalesce(jsonb_agg(p.snapshot order by m.joined_at),'[]'::jsonb)
 into heroes
 from public.ashen_clan_expedition_members m
 join public.ashen_online_profiles p on p.user_id=m.user_id
 where m.expedition_id=exp.id;
 hero_count:=coalesce(jsonb_array_length(heroes),0);
 if hero_count<>member_count then raise exception 'Wszyscy uczestnicy muszą mieć aktualną postać online.'; end if;
 if hero_count<1 then raise exception 'Ekspedycja nie ma uczestników.'; end if;
 if hero_count>coalesce((boss->>'max_players')::integer,5) then raise exception 'Ta wyprawa przekracza limit składu.'; end if;
 enemies:=boss->'enemies'; enemy_count:=coalesce(jsonb_array_length(enemies),0);
 if enemy_count<1 then raise exception 'Boss nie ma skonfigurowanych przeciwników.'; end if;

 hero_hp:=array[]::integer[]; max_hero_hp:=array[]::integer[]; hero_totals:='[]'::jsonb;
 for h in select value from jsonb_array_elements(heroes) loop
  max_hero_hp:=array_append(max_hero_hp,least(50000,greatest(1,ceil(coalesce((h->>'hp')::numeric,1)*(1+0.02*passive_kitchen+0.04*support_rations))::integer)));
  hero_hp:=array_append(hero_hp,least(50000,greatest(1,ceil(coalesce((h->>'hp')::numeric,1)*(1+0.02*passive_kitchen+0.04*support_rations))::integer)));
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
    -- v0.4.5: same weapon-type accuracy as game.js/weaponAccuracy().
    -- Weapon ID is stable: prefixes and suffixes do not change its combat class.
    weapon_id:=coalesce(attack->'weapon'->>'id','');
    attr_str:=coalesce((h->'attrs'->>'str')::numeric,0);
    attr_dex:=coalesce((h->'attrs'->>'dex')::numeric,0);
    attr_per:=coalesce((h->'attrs'->>'per')::numeric,0);
    if weapon_id=any(array['knife','pipe','machete','cleaver','wrench','hatchet','baton','saber']) then
       weapon_acc:=6+attr_dex*1.25+attr_per*0.25;
       weapon_bonus:=floor(attr_str/5+attr_dex/10)::integer;
    elsif weapon_id=any(array['hammer','crowbar','sledge']) then
       weapon_acc:=6+attr_str*0.5+attr_dex*0.75+attr_per*0.15;
       weapon_bonus:=floor(attr_str/3.5+attr_dex/18)::integer;
    elsif weapon_id=any(array['crossbow','harpoon']) then
       weapon_acc:=6+attr_per*0.9+attr_dex*0.7;
       weapon_bonus:=floor(attr_per/9+attr_dex/9)::integer;
    else
       weapon_acc:=6+attr_per*1.4+attr_dex*0.25;
       weapon_bonus:=floor(attr_per/6)::integer;
    end if;
    chance:=greatest(15,least(95,70+2*(weapon_acc-coalesce((enemies->(other-1)->>'dodge')::numeric,3))+coalesce((attack->'weapon'->>'accuracy')::numeric,coalesce((attack->>'accuracy')::numeric,0))));
    name_txt:=left(coalesce(h->>'name','Ocalały'),40)||': '||left(coalesce(attack->'weapon'->>'name',coalesce(attack->>'name','Atak')),60);
    if random()*100>=chance then
      hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'misses'],to_jsonb(coalesce((hero_totals->(idx-1)->>'misses')::integer,0)+1));
      round_events:=round_events||to_jsonb(name_txt||' — pudło w '||coalesce(enemies->(other-1)->>'name','przeciwnika')||'.');
      continue;
    end if;
    lowv:=greatest(1,least(2000,coalesce((attack->'weapon'->>'min')::integer,coalesce((attack->>'min')::integer,1))));
    highv:=greatest(lowv,least(2000,coalesce((attack->'weapon'->>'max')::integer,coalesce((attack->>'max')::integer,lowv))));
    dmg:=greatest(1,floor((lowv+floor(random()*(highv-lowv+1))+weapon_bonus)*greatest(0.1,least(2,coalesce((attack->>'power')::numeric,1))))::integer);
    dmg:=greatest(1,floor(dmg*(1+0.01*passive_workshop+0.02*support_technical))::integer);
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
    armor:=greatest(0,least(0.6,(coalesce((heroes->(other-1)->>'armor')::numeric,0)+passive_clinic+2*support_medical)/100));
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
  'faction_support',jsonb_build_object('rations',support_rations,'medical',support_medical,'technical',support_technical),
  'faction_passive',jsonb_build_object('kitchen',passive_kitchen,'clinic',passive_clinic,'workshop',passive_workshop),
  'faction_bonuses',jsonb_build_object('hp_percent_passive',2*passive_kitchen,'hp_percent_prepared',4*support_rations,'armor_passive',passive_clinic,'armor_prepared',2*support_medical,'damage_percent_passive',passive_workshop,'damage_percent_prepared',2*support_technical),
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


-- Funkcja jest wewnętrzna: zachowujemy brak dostępu dla klientów.
REVOKE ALL ON FUNCTION public.ashen_expedition_resolve_internal(bigint,boolean)
 FROM PUBLIC,anon,authenticated;
