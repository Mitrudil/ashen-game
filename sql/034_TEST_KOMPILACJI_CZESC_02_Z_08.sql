 z_dodge_charge boolean[]; z_flexible_last_round integer[]; z_reflexive_last_round integer[];
 z_resistant_used boolean[]; z_precrit_damage integer; z_no_crit integer; z_reflexive_pen numeric;
 -- SQL034: three remaining Z abilities (per combat, never stored in player profiles).
 z_tracker_marked boolean[]; z_tracker_last_round integer[];
 z_nomad_charge boolean[]; z_nomad_last_round integer[]; z_round_loss integer[];
 z_versatile_used boolean[]; z_versatile_shield integer;
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
 z_tracker_marked:=array[false,false];z_tracker_last_round:=array[-100,-100];
 z_nomad_charge:=array[false,false];z_nomad_last_round:=array[-100,-100];z_round_loss:=array[0,0];
 z_versatile_used:=array[false,false];
 for r in 1..10 loop
  exit when hp[1]<=0 or hp[2]<=0;
  entries:='[]'::jsonb;round_start:=hp;z_light_hits:=array[0,0];z_light_procs:=array[0,0];
  z_round_loss:=array[0,0];
  if random() < 0.5 then first_i:=1; else first_i:=2;end if;
  for j in 1..2 loop
   i:=case when j=1 then first_i else 3-first_i end;other:=3-i;
   exit when hp[1]<=0 or hp[2]<=0;
   weapons:=f[i]->'attacks';
