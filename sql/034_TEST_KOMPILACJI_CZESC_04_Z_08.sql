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
