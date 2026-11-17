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
     missed[i]:=true;dodged[other]:=true;z_dodge_charge[other]:=true;entries:=entries||to_jsonb(hit_label||' — pudło.');continue;
    end if;
    val:=greatest(1,least(2000,coalesce((w->'weapon'->>'min')::integer,1)));
    rawd:=greatest(val,least(2000,coalesce((w->'weapon'->>'max')::integer,val)));
    damage:=floor((val+floor(random()*(rawd-val+1)))*greatest(0.1,least(2,coalesce((w->>'power')::numeric,1))))::integer;
    crit:=random()<greatest(0,least(0.35,0.05+coalesce((f[i]->'attrs'->>'per')::numeric,5)*0.005+coalesce((w->'weapon'->>'critPp')::numeric,0)/100+public.ashen_pvp_set_number(f[i],'critChance',0,10)/100));
    damage:=greatest(1,floor(damage*(1+(public.ashen_pvp_set_number(f[i],'damagePct',0,24)
      +case when missed[i] then public.ashen_pvp_set_number(f[i],'afterMissDamage',0,12) else 0 end)/100))::integer);
    missed[i]:=false;dodged[i]:=false;
