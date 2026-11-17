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
