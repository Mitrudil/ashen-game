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
