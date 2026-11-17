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
