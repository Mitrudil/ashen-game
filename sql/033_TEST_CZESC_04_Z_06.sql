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
