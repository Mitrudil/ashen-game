-- SQL034 isolated compilation & invariant check (NO PRODUCTION DEPLOYMENT).
-- Paste all parts in ONE SQL Editor query; no separately executed pieces.
BEGIN;
SET LOCAL statement_timeout='60s';
SET LOCAL lock_timeout='3s';
DO $guard$
DECLARE v text;
BEGIN
 IF to_regprocedure('public.ashen_online_attack(uuid)') IS NULL THEN RAISE EXCEPTION 'STOP: brak funkcji PvP'; END IF;
 v:=pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('XY-Z12-v0.4.9.20' in v)=0 OR position('XY-Z15-v0.4.9.21' in v)>0 THEN
  RAISE EXCEPTION 'STOP: oczekiwano SQL033 / XY-Z12';
 END IF;
END $guard$;
CREATE OR REPLACE FUNCTION public.ashen_online_attack(p_defender uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 u uuid:=auth.uid(); day_now date:=(now() at time zone 'Europe/Warsaw')::date;
 a jsonb;d jsonb; f jsonb[]; hp integer[]; mx integer[]; totals jsonb:='[{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0},{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0}]'::jsonb;
 rounds jsonb:='[]'::jsonb; entries jsonb; weapons jsonb; w jsonb; round_start integer[];
 i integer;j integer;r integer;first_i integer;other integer; chance numeric;crit boolean;val integer; rawd integer; damage integer; armor numeric; hit_label text;
 win integer; v_report jsonb; bid bigint; now_txt text; cnt integer;
 -- X/Y states (per fight; never persisted into player data).
 shields integer[]; missed boolean[]; dodged boolean[]; crit_protect integer[];
 set_pen numeric; set_reduction numeric; before_shield integer;
 -- Z: fight-scoped mastery state (no persistent player mutation).
 z_light_hits integer[]; z_light_procs integer[]; z_warden_used boolean[];
 z_ability boolean; z_shield integer;
 z_reinforced_used boolean[]; z_plated_used boolean[]; z_technical_hits integer[];
 z_heal integer; z_technical_pen numeric;
 -- Z etapa 3: per-combat & per-round tracking.
 z_agile_used boolean[]; z_iron_last_round integer[]; z_observant_used_round integer[];
 -- SQL033: dodge-to-hit charges; first enemy crit suppression.
 z_dodge_charge boolean[]; z_flexible_last_round integer[]; z_reflexive_last_round integer[];
 z_resistant_used boolean[]; z_precrit_damage integer; z_no_crit integer; z_reflexive_pen numeric;
 -- SQL034: three remaining Z abilities (per combat, never stored in player profiles).
 z_tracker_marked boolean[]; z_tracker_last_round integer[];
 z_nomad_charge boolean[]; z_nomad_last_round integer[]; z_round_loss integer[];
 z_versatile_used boolean[]; z_versatile_shield integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if p_defender is null or p_defender=u then raise exception 'Nie możesz atakować własnego konta.'; end if;
 -- Serializes concurrent attacks by the same attacker; protects 2/day limit from races.
 perform 1 from auth.users where id=u for update;
 select count(*) into cnt from public.ashen_online_attacks where attacker_id=u and defender_id=p_defender and day_pl=day_now;
 if cnt>=2 then raise exception 'Limit 2 ataków dziennie na tego gracza. Reset o północy czasu polskiego.';end if;
 select snapshot into a from public.ashen_online_profiles where user_id=u;
 select snapshot into d from public.ashen_online_profiles where user_id=p_defender;
 if a is null then raise exception 'Najpierw opublikuj swoją postać online.';end if;
 if d is null then raise exception 'Przeciwnik nie ma opublikowanej postaci.';end if;
 f:=array[a,d];mx:=array[least(50000,greatest(1,coalesce((a->>'hp')::integer,1))),least(50000,greatest(1,coalesce((d->>'hp')::integer,1)))];hp:=mx;
 shields:=array[least(1000,greatest(0,public.ashen_pvp_set_number(a,'startShield',0,1000)::integer)),least(1000,greatest(0,public.ashen_pvp_set_number(d,'startShield',0,1000)::integer))];
 missed:=array[false,false];dodged:=array[false,false];crit_protect:=array[0,0];
 z_light_hits:=array[0,0];z_light_procs:=array[0,0];z_warden_used:=array[false,false];
 z_reinforced_used:=array[false,false];z_plated_used:=array[false,false];z_technical_hits:=array[0,0];
 z_agile_used:=array[false,false];z_iron_last_round:=array[-100,-100];z_observant_used_round:=array[0,0];
 z_dodge_charge:=array[false,false];z_flexible_last_round:=array[-100,-100];
 z_reflexive_last_round:=array[0,0];z_resistant_used:=array[false,false];
 z_tracker_marked:=array[false,false];z_tracker_last_round:=array[-100,-100];
 z_nomad_charge:=array[false,false];z_nomad_last_round:=array[-100,-100];z_round_loss:=array[0,0];
 z_versatile_used:=array[false,false];
 for r in 1..10 loop
  exit when hp[1]<=0 or hp[2]<=0;
  entries:='[]'::jsonb;round_start:=hp;z_light_hits:=array[0,0];z_light_procs:=array[0,0];
  z_round_loss:=array[0,0];
  if random() < 0.5 then first_i:=1; else first_i:=2;end if;
  for j in 1..2 loop
   i:=case when j=1 then first_i else 3-first_i end;other:=3-i;
   exit when hp[1]<=0 or hp[2]<=0;
   weapons:=f[i]->'attacks';
   for w in select value from jsonb_array_elements(weapons) loop
    exit when hp[1]<=0 or hp[2]<=0;
    totals:=jsonb_set(totals,array[(i-1)::text,'attempts'],to_jsonb((totals->(i-1)->>'attempts')::integer+1));
    hit_label:=left(coalesce(f[i]->>'name','Gracz'),40)||': '||left(coalesce(w->'weapon'->>'name','Broń'),60)||' ('||(case when w->>'hand'='left' then 'lewa' else 'prawa' end)||' ręka)';
    chance:=greatest(15,least(95,70+2*(coalesce((f[i]->>'acc')::numeric,6)-coalesce((f[other]->>'dodge')::numeric,3)
     +case when public.ashen_pvp_set_number(f[i],'master_accessory_persuasive',0,1)=1 then 3 else 0 end
     +case when r<=2 then public.ashen_pvp_set_number(f[i],'earlyAccuracy',0,12) else 0 end
     +case when missed[i] then public.ashen_pvp_set_number(f[i],'afterMissAccuracy',0,12) else 0 end
     +case when dodged[i] then public.ashen_pvp_set_number(f[i],'afterDodgeAccuracy',0,12) else 0 end)
     +coalesce((w->'weapon'->>'accuracy')::numeric,0)));
    if random()*100>=chance then
     totals:=jsonb_set(totals,array[(i-1)::text,'misses'],to_jsonb((totals->(i-1)->>'misses')::integer+1));
     missed[i]:=true;dodged[other]:=true;z_dodge_charge[other]:=true;entries:=entries||to_jsonb(hit_label||' — pudło.');continue;
    end if;
    val:=greatest(1,least(2000,coalesce((w->'weapon'->>'min')::integer,1)));
    rawd:=greatest(val,least(2000,coalesce((w->'weapon'->>'max')::integer,val)));
    damage:=floor((val+floor(random()*(rawd-val+1)))*greatest(0.1,least(2,coalesce((w->>'power')::numeric,1))))::integer;
    crit:=random()<greatest(0,least(0.35,0.05+coalesce((f[i]->'attrs'->>'per')::numeric,5)*0.005+coalesce((w->'weapon'->>'critPp')::numeric,0)/100+public.ashen_pvp_set_number(f[i],'critChance',0,10)/100));
    damage:=greatest(1,floor(damage*(1+(public.ashen_pvp_set_number(f[i],'damagePct',0,24)
      +case when missed[i] then public.ashen_pvp_set_number(f[i],'afterMissDamage',0,12) else 0 end)/100))::integer);
    missed[i]:=false;dodged[i]:=false;
    -- Etap 3: premie liczone po bazowym damagePct, PRZED krytykiem i redukcją pancerza.
    -- Zwinny: pierwsze CELOWE trafienie w całej walce, tylko jeden raz.
    if not z_agile_used[i] and public.ashen_pvp_set_number(f[i],'master_armor_agile',0,1)=1 then
      z_agile_used[i]:=true;
      damage:=greatest(1,floor(damage*1.12)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Zwinny: błyskawiczny start (+12% obrażeń).');
    end if;
    -- Żelazny: jeden celny cios w rundach 1/4/7/10... gdy przeciwnik ma pancerz.
    if coalesce((f[other]->>'armor')::numeric,0)>0
       and r-z_iron_last_round[i]>=3
       and public.ashen_pvp_set_number(f[i],'master_armor_iron',0,1)=1 then
      z_iron_last_round[i]:=r;
      damage:=greatest(1,floor(damage*1.08)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Żelazny: miażdżący cios (+8% obrażeń).');
    end if;
    -- Spostrzegawczy: drugi (lub kolejny, gdy pierwszy chybi) celny cios w rundzie;
    -- z_light_hits[i] zlicza tylko CELNE trafienia i jest zerowany na początku rundy.
    if z_light_hits[i]>=1 and z_observant_used_round[i]<>r
       and public.ashen_pvp_set_number(f[i],'master_accessory_observant',0,1)=1 then
      z_observant_used_round[i]:=r;
      damage:=greatest(1,floor(damage*1.08)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Spostrzegawczy: oznaczenie celu (+8% obrażeń).');
    end if;
    -- Elastyczny: +8% na najblizsze celne trafienie po uniku; 2 rundy przerwy.
    if z_dodge_charge[i] and r-z_flexible_last_round[i]>=2
       and public.ashen_pvp_set_number(f[i],'master_armor_flexible',0,1)=1 then
      z_flexible_last_round[i]:=r;
      damage:=greatest(1,floor(damage*1.08)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Elastyczny: kontratak (+8% obrażeń).');
    end if;
    -- Nomadyczny: charge after >=20% max HP lost within one round.
    -- Charge is consumed only on a successful hit and with >=3 rounds cooldown.
    if z_nomad_charge[i] and r-z_nomad_last_round[i]>=3
       and public.ashen_pvp_set_number(f[i],'master_armor_nomad',0,1)=1 then
      z_nomad_last_round[i]:=r;z_nomad_charge[i]:=false;
      damage:=greatest(1,floor(damage*1.10)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Nomadyczny: instynkt (+10% obrażeń).');
    end if;
    -- Lekki / seria trafien: +4% do kolejnego skutecznego trafienia w tej rundzie, max dwa wyzwolenia.
    if z_light_hits[i]>=1 and z_light_procs[i]<2
       and public.ashen_pvp_set_number(f[i],'master_armor_light',0,1)=1 then
      damage:=greatest(1,floor(damage*1.04)::integer);
      z_light_procs[i]:=z_light_procs[i]+1;
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Lekki: seria trafień (+4% obrażeń).');
    end if;
    z_precrit_damage:=damage;
    if crit then damage:=greatest(1,floor(damage*1.6*(1+public.ashen_pvp_set_number(f[i],'critDamagePct',0,16)/100))::integer);end if;
    set_pen:=public.ashen_pvp_set_number(f[i],'armorPen',0,18);
    -- Techniczny: dodaje 8% całkowitego pancerza przeciwnika do penetracji.
    -- Zużywa 1 z 2 aktywacji dopiero po trafieniu; nie odnawia się w nowej rundzie.
    z_technical_pen:=0;
    if z_technical_hits[i]<2
       and public.ashen_pvp_set_number(f[i],'master_accessory_technical',0,1)=1 then
      z_technical_pen:=greatest(0,coalesce((f[other]->>'armor')::numeric,0))*0.08;
      z_technical_hits[i]:=z_technical_hits[i]+1;
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Techniczny: skan pancerza (trafienie '||z_technical_hits[i]||'/2).');
    end if;
    -- Refleksyjny: pierwsze celne trafienie po uniku: +4 pkt przebicia pancerza,
    -- najwczesniej raz w kazdej rundzie (nie dziala po wlasnym chybieniu).
    z_reflexive_pen:=0;
    if z_dodge_charge[i] and z_reflexive_last_round[i]<>r
       and public.ashen_pvp_set_number(f[i],'master_accessory_reflexive',0,1)=1 then
      z_reflexive_pen:=4;
      z_reflexive_last_round[i]:=r;
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Refleksyjny: przebicie po uniku (+4 pkt).');
    end if;
    -- Unik daje ladunek tylko na najblizsze celne trafienie; chybienia go nie zuzywaja.
    z_dodge_charge[i]:=false;
    armor:=greatest(0,least(0.6,(coalesce((f[other]->>'armor')::numeric,0)-set_pen-z_technical_pen-z_reflexive_pen)/100));
    damage:=greatest(1,floor(damage*(1-armor))::integer);
    if crit then damage:=greatest(1,floor(damage*(1-public.ashen_pvp_set_number(f[other],'critResist',0,35)/100))::integer);end if;
    set_reduction:=public.ashen_pvp_set_number(f[other],'physicalResist',0,15)
      +case when r>=5 then public.ashen_pvp_set_number(f[other],'lateResist',0,12) else 0 end
      +case when crit_protect[other]=r then public.ashen_pvp_set_number(f[other],'afterCritResist',0,12) else 0 end;
    damage:=greatest(1,floor(damage*(1-least(40,set_reduction)/100))::integer);
    -- Tropicielski: a previous NON-critical hit marks the target.
    -- Only a later critical hit can consume the mark; cooldown 3 rounds.
    if crit and z_tracker_marked[i] and r-z_tracker_last_round[i]>=3
       and public.ashen_pvp_set_number(f[i],'master_armor_tracker',0,1)=1 then
      z_tracker_last_round[i]:=r;z_tracker_marked[i]:=false;
      damage:=greatest(1,floor(damage*1.10)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Tropicielski: słaby punkt (+10% obrażeń krytycznych).');
    end if;
    if not crit and public.ashen_pvp_set_number(f[i],'master_armor_tracker',0,1)=1 then
      z_tracker_marked[i]:=true;
    end if;
    -- Odporny: pierwszy krytyk w przeciwnika traci 40% BONUSU krytycznego,
    -- a nie 40% calych obrazen. Obliczamy identyczna sciezke bez krytyka.
    if crit and not z_resistant_used[other]
       and public.ashen_pvp_set_number(f[other],'master_armor_resistant',0,1)=1 then
      z_resistant_used[other]:=true;
      z_no_crit:=greatest(1,floor(z_precrit_damage*(1-armor))::integer);
      z_no_crit:=greatest(1,floor(z_no_crit*(1-least(40,set_reduction)/100))::integer);
      damage:=greatest(1,damage-floor(greatest(0,damage-z_no_crit)*0.40)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': Mistrzostwo Z — Odporny: stłumienie krytyka (40% premii krytycznej).');
    end if;
    if crit and public.ashen_pvp_set_number(f[other],'afterCritResist',0,12)>0 then crit_protect[other]:=r+1;end if;
    -- Pancerny: po redukcjach X/Y, ale przed tarczą i PŻ. Jednorazowo na walkę.
    if not z_plated_used[other] and damage>=mx[other]*0.12
       and public.ashen_pvp_set_number(f[other],'master_armor_plated',0,1)=1 then
      z_plated_used[other]:=true;
      damage:=greatest(1,floor(damage*0.65)::integer);
      entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': Mistrzostwo Z — Pancerny: niezłomna płyta (-35% obrażeń).');
    end if;
    -- Wartownik / ostatni bastion: jednorazowa tarcza 15% max PZ przy ciosie schodzacym do <=25% PZ.
    if not z_warden_used[other] and hp[other]-damage<=mx[other]*0.25
       and public.ashen_pvp_set_number(f[other],'master_armor_warden',0,1)=1 then
      z_warden_used[other]:=true;
      z_shield:=greatest(1,round(mx[other]*0.15)::integer);
      shields[other]:=shields[other]+z_shield;
      entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': Mistrzostwo Z — Wartownika: ostatni bastion (+'||z_shield||' osłony).');
    end if;
    before_shield:=least(damage,shields[other]);
    shields[other]:=shields[other]-before_shield;
    damage:=least(hp[other],greatest(0,damage-before_shield));
    if before_shield>0 then entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': osłona pochłania '||before_shield||' obrażeń.');end if;
    hp[other]:=hp[other]-damage;
    -- Count real HP damage after shields. This is reset every round.
    z_round_loss[other]:=z_round_loss[other]+damage;
    -- Wszechstronny: once after >=25% maxHP lost in a single round;
    -- shield is created AFTER the triggering hit and absorbs later hits.
    if not z_versatile_used[other] and z_round_loss[other]>=mx[other]*0.25
       and public.ashen_pvp_set_number(f[other],'master_accessory_versatile',0,1)=1 then
      z_versatile_used[other]:=true;
      z_versatile_shield:=greatest(1,round(mx[other]*0.10)::integer);
      shields[other]:=shields[other]+z_versatile_shield;
      entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': Mistrzostwo Z — Wszechstronny: osłona po ciężkim trafieniu (+'||z_versatile_shield||' osłony).');
    end if;
    -- Nomad charge is gained from accumulated real HP loss in the round.
    if z_round_loss[other]>=mx[other]*0.20
       and public.ashen_pvp_set_number(f[other],'master_armor_nomad',0,1)=1 then
      z_nomad_charge[other]:=true;
    end if;
    -- Wzmocniony: leczenie po przeżytym trafieniu, gdy PŻ <=30% maksymalnego.
    -- Osłona nie zmienia zasad progu; leczenie tylko raz na walkę.
    if hp[other]>0 and hp[other]<=mx[other]*0.30 and not z_reinforced_used[other]
       and public.ashen_pvp_set_number(f[other],'master_armor_reinforced',0,1)=1 then
      z_reinforced_used[other]:=true;
      z_heal:=greatest(1,round(mx[other]*0.10)::integer);
      hp[other]:=least(mx[other],hp[other]+z_heal);
      entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': Mistrzostwo Z — Wzmocniony: drugi oddech (+'||z_heal||' PŻ).');
    end if;
    z_light_hits[i]:=z_light_hits[i]+1;
    totals:=jsonb_set(totals,array[(i-1)::text,'hits'],to_jsonb((totals->(i-1)->>'hits')::integer+1));
    totals:=jsonb_set(totals,array[(i-1)::text,'damage'],to_jsonb((totals->(i-1)->>'damage')::integer+damage));
    if crit then totals:=jsonb_set(totals,array[(i-1)::text,'critical'],to_jsonb((totals->(i-1)->>'critical')::integer+1));end if;
    entries:=entries||to_jsonb(hit_label||' — '||damage||' obrażeń'||(case when crit then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;
  rounds:=rounds||jsonb_build_object('number',r,'events',entries,'hp',to_jsonb(hp),'damage',to_jsonb(array[round_start[1]-hp[1],round_start[2]-hp[2]]));
 end loop;
 win:=case when hp[1]<=0 then 1 when hp[2]<=0 then 0 else null end;
 now_txt:=to_char(now() at time zone 'Europe/Warsaw','DD.MM.YYYY, HH24:MI:SS');
 v_report:=jsonb_build_object('id','online-'||extract(epoch from clock_timestamp())::bigint,'at',now_txt,'attackerId',u,'defenderId',p_defender,'attacker',a,'defender',d,'winner',win,'rounds',rounds,'totals',totals,'hp',to_jsonb(hp),'maxHp',to_jsonb(mx),'setCombatMode','XY-Z15-v0.4.9.21');
 insert into public.ashen_online_attacks(attacker_id,defender_id,day_pl,report) values(u,p_defender,day_now,v_report) returning id into bid;
 v_report:=jsonb_set(v_report,'{id}',to_jsonb('online-'||bid::text));
 update public.ashen_online_attacks set report=v_report where id=bid;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body,battle_id)
 values(u,p_defender,'battle','Atak PvP — '||left(a->>'name',40),left(a->>'name',40)||' zaatakował(a) Twoją postać. Wynik: '||(case when win=0 then 'porażka obrońcy' when win=1 then 'zwycięstwo obrońcy' else 'remis' end)||'.',bid);
 return v_report;
end $function$;
SELECT jsonb_pretty(jsonb_build_object(
  'wersja_sql034', CASE WHEN position('XY-Z15-v0.4.9.21' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_persuasive', CASE WHEN position('master_accessory_persuasive' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_light', CASE WHEN position('master_armor_light' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_warden', CASE WHEN position('master_armor_warden' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_reinforced', CASE WHEN position('master_armor_reinforced' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_plated', CASE WHEN position('master_armor_plated' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_technical', CASE WHEN position('master_accessory_technical' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_agile', CASE WHEN position('master_armor_agile' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_iron', CASE WHEN position('master_armor_iron' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_observant', CASE WHEN position('master_accessory_observant' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_flexible', CASE WHEN position('master_armor_flexible' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_resistant', CASE WHEN position('master_armor_resistant' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_reflexive', CASE WHEN position('master_accessory_reflexive' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_tracker', CASE WHEN position('master_armor_tracker' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_nomad', CASE WHEN position('master_armor_nomad' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_versatile', CASE WHEN position('master_accessory_versatile' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'poprawka_totals', CASE WHEN position('"critical":0,"damage":0}]' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'zapisy_raportow', CASE WHEN position('insert into public.ashen_online_attacks' in lower(v))>0 THEN 'OK' ELSE 'BRAK' END,
  'wiadomosci', CASE WHEN position('insert into public.ashen_online_mail' in lower(v))>0 THEN 'OK' ELSE 'BRAK' END,
  'limit_pvp', CASE WHEN position('cnt>=2' in v)>0 THEN 'OK' ELSE 'BRAK' END
)) AS kontrole_sql034
FROM (SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) AS v) q;
ROLLBACK;
