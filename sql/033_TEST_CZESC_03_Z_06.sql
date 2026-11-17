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
