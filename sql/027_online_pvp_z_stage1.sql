-- ASHEN v0.4.8.9 — PvP online: Mistrzostwo Z, etap 1 (3 z 15 rodzin).
-- Wymaga SQL 025 i SQL 026. Zachowuje mechanikę X/Y, raporty publiczne, limit ataków.
-- Wykonaj kopię aktualnej definicji ashen_online_attack PRZED uruchomieniem.
-- Wdraża wyłącznie: accessory_persuasive (Autorytet +3 celności), armor_light
-- (Seria trafień +4% przy kolejnych trafieniach w rundzie, max 2), armor_warden
-- (Ostatni bastion: jednorazowo +15% maks. PŻ jako osłona przed ciosem zejścia <=25% PŻ).
-- Pozostałe 12 mistrzostw Z pozostaje nieaktywnych w PvP online.
-- OGRANICZENIE BEZPIECZEŃSTWA: serwer nadal ufa migawce postaci przesłanej przez klienta;
-- flagi master_* nie są potwierdzane na podstawie wyposażenia po stronie serwera.
-- Nie stosować tego jako produkcyjnego systemu anty-cheat.

CREATE OR REPLACE FUNCTION public.ashen_online_attack(p_defender uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 u uuid:=auth.uid(); day_now date:=(now() at time zone 'Europe/Warsaw')::date;
 a jsonb;d jsonb; f jsonb[]; hp integer[]; mx integer[]; totals jsonb:='[{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0},{"attempts":0,"hits":0,"misses":0,"critical":0}]'::jsonb;
 rounds jsonb:='[]'::jsonb; entries jsonb; weapons jsonb; w jsonb; round_start integer[];
 i integer;j integer;r integer;first_i integer;other integer; chance numeric;crit boolean;val integer; rawd integer; damage integer; armor numeric; hit_label text;
 win integer; v_report jsonb; bid bigint; now_txt text; cnt integer;
 -- X/Y states (per fight; never persisted into player data).
 shields integer[]; missed boolean[]; dodged boolean[]; crit_protect integer[];
 set_pen numeric; set_reduction numeric; before_shield integer;
 -- Z: three mastery abilities with fight-scoped state (no persistent player mutation).
 z_light_hits integer[]; z_light_procs integer[]; z_warden_used boolean[];
 z_ability boolean; z_shield integer;
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
 for r in 1..10 loop
  exit when hp[1]<=0 or hp[2]<=0;
  entries:='[]'::jsonb;round_start:=hp;z_light_hits:=array[0,0];z_light_procs:=array[0,0];
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
     missed[i]:=true;dodged[other]:=true;entries:=entries||to_jsonb(hit_label||' — pudło.');continue;
    end if;
    val:=greatest(1,least(2000,coalesce((w->'weapon'->>'min')::integer,1)));
    rawd:=greatest(val,least(2000,coalesce((w->'weapon'->>'max')::integer,val)));
    damage:=floor((val+floor(random()*(rawd-val+1)))*greatest(0.1,least(2,coalesce((w->>'power')::numeric,1))))::integer;
    crit:=random()<greatest(0,least(0.35,0.05+coalesce((f[i]->'attrs'->>'per')::numeric,5)*0.005+coalesce((w->'weapon'->>'critPp')::numeric,0)/100+public.ashen_pvp_set_number(f[i],'critChance',0,10)/100));
    damage:=greatest(1,floor(damage*(1+(public.ashen_pvp_set_number(f[i],'damagePct',0,24)
      +case when missed[i] then public.ashen_pvp_set_number(f[i],'afterMissDamage',0,12) else 0 end)/100))::integer);
    missed[i]:=false;dodged[i]:=false;
    -- Lekki / seria trafien: +4% do kolejnego skutecznego trafienia w tej rundzie, max dwa wyzwolenia.
    if z_light_hits[i]>=1 and z_light_procs[i]<2
       and public.ashen_pvp_set_number(f[i],'master_armor_light',0,1)=1 then
      damage:=greatest(1,floor(damage*1.04)::integer);
      z_light_procs[i]:=z_light_procs[i]+1;
      entries:=entries||to_jsonb(left(coalesce(f[i]->>'name','Gracz'),40)||': Mistrzostwo Z — Lekki: seria trafień (+4% obrażeń).');
    end if;
    if crit then damage:=greatest(1,floor(damage*1.6*(1+public.ashen_pvp_set_number(f[i],'critDamagePct',0,16)/100))::integer);end if;
    set_pen:=public.ashen_pvp_set_number(f[i],'armorPen',0,18);
    armor:=greatest(0,least(0.6,(coalesce((f[other]->>'armor')::numeric,0)-set_pen)/100));
    damage:=greatest(1,floor(damage*(1-armor))::integer);
    if crit then damage:=greatest(1,floor(damage*(1-public.ashen_pvp_set_number(f[other],'critResist',0,35)/100))::integer);end if;
    set_reduction:=public.ashen_pvp_set_number(f[other],'physicalResist',0,15)
      +case when r>=5 then public.ashen_pvp_set_number(f[other],'lateResist',0,12) else 0 end
      +case when crit_protect[other]=r then public.ashen_pvp_set_number(f[other],'afterCritResist',0,12) else 0 end;
    damage:=greatest(1,floor(damage*(1-least(40,set_reduction)/100))::integer);
    if crit and public.ashen_pvp_set_number(f[other],'afterCritResist',0,12)>0 then crit_protect[other]:=r+1;end if;
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
 v_report:=jsonb_build_object('id','online-'||extract(epoch from clock_timestamp())::bigint,'at',now_txt,'attackerId',u,'defenderId',p_defender,'attacker',a,'defender',d,'winner',win,'rounds',rounds,'totals',totals,'hp',to_jsonb(hp),'maxHp',to_jsonb(mx),'setCombatMode','XY-Z3-v0.4.8.9');
 insert into public.ashen_online_attacks(attacker_id,defender_id,day_pl,report) values(u,p_defender,day_now,v_report) returning id into bid;
 v_report:=jsonb_set(v_report,'{id}',to_jsonb('online-'||bid::text));
 update public.ashen_online_attacks set report=v_report where id=bid;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body,battle_id)
 values(u,p_defender,'battle','Atak PvP — '||left(a->>'name',40),left(a->>'name',40)||' zaatakował(a) Twoją postać. Wynik: '||(case when win=0 then 'porażka obrońcy' when win=1 then 'zwycięstwo obrońcy' else 'remis' end)||'.',bid);
 return v_report;
end $function$;
