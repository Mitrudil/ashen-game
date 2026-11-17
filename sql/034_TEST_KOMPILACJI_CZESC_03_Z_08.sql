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
