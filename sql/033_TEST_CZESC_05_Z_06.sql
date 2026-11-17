    if before_shield>0 then entries:=entries||to_jsonb(left(coalesce(f[other]->>'name','Gracz'),40)||': osłona pochłania '||before_shield||' obrażeń.');end if;
    hp[other]:=hp[other]-damage;
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
 v_report:=jsonb_build_object('id','online-'||extract(epoch from clock_timestamp())::bigint,'at',now_txt,'attackerId',u,'defenderId',p_defender,'attacker',a,'defender',d,'winner',win,'rounds',rounds,'totals',totals,'hp',to_jsonb(hp),'maxHp',to_jsonb(mx),'setCombatMode','XY-Z12-v0.4.9.20');
 insert into public.ashen_online_attacks(attacker_id,defender_id,day_pl,report) values(u,p_defender,day_now,v_report) returning id into bid;
 v_report:=jsonb_set(v_report,'{id}',to_jsonb('online-'||bid::text));
 update public.ashen_online_attacks set report=v_report where id=bid;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body,battle_id)
 values(u,p_defender,'battle','Atak PvP — '||left(a->>'name',40),left(a->>'name',40)||' zaatakował(a) Twoją postać. Wynik: '||(case when win=0 then 'porażka obrońcy' when win=1 then 'zwycięstwo obrońcy' else 'remis' end)||'.',bid);
 return v_report;
end $function$;

-- Kontrola obecnosci zdolnosci i kluczowych elementow, bez pelnych walk.
WITH f AS (SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) AS body),
checks AS (
SELECT 'wersja SQL033' AS nazwa,position('XY-Z12-v0.4.9.20' in body)>0 AS ok FROM f
UNION ALL SELECT 'Elastyczny',position('master_armor_flexible' in body)>0 FROM f
UNION ALL SELECT 'Odporny',position('master_armor_resistant' in body)>0 FROM f
UNION ALL SELECT 'Refleksyjny',position('master_accessory_reflexive' in body)>0 FROM f
UNION ALL SELECT '9 dotychczasowych Z', (SELECT count(*)=9 FROM (VALUES
('master_armor_reinforced'),('master_armor_plated'),('master_accessory_technical'),
('master_accessory_persuasive'),('master_armor_light'),('master_armor_warden'),
('master_armor_agile'),('master_armor_iron'),('master_accessory_observant')) x(t)
WHERE position(x.t in (SELECT body FROM f))>0)
UNION ALL SELECT 'zapis raportow',position('insert into public.ashen_online_attacks' in body)>0 FROM f
UNION ALL SELECT 'wiadomosci',position('insert into public.ashen_online_mail' in body)>0 FROM f
UNION ALL SELECT 'limit atakow',position('cnt>=2' in body)>0 FROM f
)
SELECT nazwa,ok,CASE WHEN ok THEN 'OK' ELSE 'DO ANALIZY' END AS wynik FROM checks;
