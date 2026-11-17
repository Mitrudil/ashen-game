-- ASHEN v0.4.9.13 — kontrola spójności setów X/Y/Z podczas publikacji profilu.
-- WYMAGA instalacji 002_cloud_saves.sql i 003_online_pvp.sql oraz ostatnich migracji PvP.
-- Testuj na bazie testowej. Przed uruchomieniem zrób kopię funkcji ashen_publish_profile(jsonb).
-- UWAGA: zapis w ashen_cloud_saves nadal jest edytowalny przez właściciela konta.
-- To NIE jest pełny anty-cheat. Migracja nie implementuje nowych zdolności Z w PvP.

create or replace function public.ashen_pvp_validate_sets(p_snapshot jsonb,p_save jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $fn$
declare
 s text; u text; inst jsonb; fam text; q integer; cnt integer; pts integer; lvl integer;
 ids text[]:=array['armor_reinforced','armor_plated','armor_flexible','armor_agile','armor_light',
 'armor_resistant','armor_tracker','armor_iron','armor_warden','armor_nomad',
 'accessory_technical','accessory_observant','accessory_persuasive','accessory_reflexive','accessory_versatile'];
 slots text[]:=array['head','shirt','outer','hands','pants','boots','extra','extra2','extra3'];
 seen text[]:=array[]::text[];
 counts jsonb:='{}'::jsonb; quality jsonb:='{}'::jsonb; expected jsonb:='[]'::jsonb;
 claimed jsonb; effects jsonb; ent jsonb; key text;
begin
 if jsonb_typeof(p_save) <> 'object' or jsonb_typeof(p_snapshot) <> 'object'
    or jsonb_typeof(p_save->'inventory') <> 'array' or jsonb_typeof(p_save->'equip') <> 'object'
    or jsonb_typeof(p_snapshot->'activeSets') <> 'array'
    or jsonb_typeof(p_snapshot->'setEffects') <> 'object' then return false; end if;
 if p_save->>'name' is distinct from p_snapshot->>'name'
    or p_save->>'level' is distinct from p_snapshot->>'level' then return false; end if;
 effects:=p_snapshot->'setEffects';
 foreach s in array slots loop
  u:=p_save->'equip'->>s;
  if u is null or u='' then continue; end if;
  if u=any(seen) then return false; end if;
  seen:=array_append(seen,u);
  select x.value into inst from jsonb_array_elements(p_save->'inventory') x where x.value->>'uid'=u limit 1;
  if inst is null then return false; end if;
  fam:=inst->>'prefix';
  if not (fam=any(ids)) then continue; end if;
  if (s=any(array['extra','extra2','extra3'])) <> (left(fam,10)='accessory_') then return false;end if;
  if coalesce(inst->>'rarity','') !~ '^[0-4]$' then return false;end if;
  q:=(inst->>'rarity')::integer;
  counts:=jsonb_set(counts,array[fam],to_jsonb(coalesce((counts->>fam)::integer,0)+1));
  quality:=jsonb_set(quality,array[fam],to_jsonb(coalesce((quality->>fam)::integer,0)+q));
 end loop;
 foreach fam in array ids loop
  cnt:=coalesce((counts->>fam)::integer,0);
  pts:=coalesce((quality->>fam)::integer,0);
  if cnt<3 then
   if coalesce(effects->>('master_'||fam),'0') not in ('0','false') then return false;end if;
   continue;
  end if;
  if left(fam,10)='accessory_' and cnt<>3 then return false;end if;
  lvl:=case when 3*pts>=10*cnt then 3 when 3*pts>=7*cnt then 2 else 1 end;
  expected:=expected||jsonb_build_array(jsonb_build_object('id',fam,
    'category',case when left(fam,10)='accessory_' then 'accessories' else 'clothing' end,
    'count',cnt,'qualityPoints',pts,'level',lvl));
  if lvl=3 then
   if effects->>('master_'||fam) <> '1' then return false;end if;
  elsif coalesce(effects->>('master_'||fam),'0') not in ('0','false') then return false;end if;
 end loop;
 -- Klient nie może zadeklarować nieznanego Mistrzostwa Z.
 for key in select jsonb_object_keys(effects) loop
  if left(key,7)='master_' and not (substring(key from 8)=any(ids)) then return false;end if;
 end loop;
 -- Porównanie bez znaczenia kolejności, z zachowaniem liczebności (duplikaty odrzucane).
 claimed:=p_snapshot->'activeSets';
 if jsonb_array_length(claimed)<>jsonb_array_length(expected) then return false;end if;
 for ent in select value from jsonb_array_elements(expected) loop
  if (select count(*) from jsonb_array_elements(claimed) c
      where c.value->>'id'=ent->>'id' and c.value->>'category'=ent->>'category'
      and c.value->'count'=ent->'count'
      and c.value->'qualityPoints'=ent->'qualityPoints'
      and c.value->'level'=ent->'level')<>1 then return false;end if;
 end loop;
 return true;
exception when others then
 return false;
end $fn$;

-- Zastępujemy WYŁĄCZNIE publikację profilu; funkcji rozliczania walk nie zmieniamy.
create or replace function public.ashen_publish_profile(p_snapshot jsonb)
returns void language plpgsql security definer set search_path = '' as $fn$
declare u uuid:=auth.uid(); nm text; lv integer; origin text; gender text; attacks jsonb; saved jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select save_data into saved from public.ashen_cloud_saves where user_id=u;
 if saved is null then raise exception 'Najpierw wyślij postać do chmury.';end if;
 nm:=left(trim(coalesce(p_snapshot->>'name','')),40);
 lv:=coalesce((p_snapshot->>'level')::integer,0);
 origin:=p_snapshot->>'origin'; gender:=p_snapshot->>'gender'; attacks:=p_snapshot->'attacks';
 if char_length(nm)<2 or lv<1 or lv>100000 or origin not in ('scout','fighter','tech')
 or gender not in ('male','female') or jsonb_typeof(attacks)<>'array'
 or jsonb_array_length(attacks)>2 or jsonb_array_length(attacks)<1
 or octet_length(p_snapshot::text)>16000 then raise exception 'Nieprawidłowy profil bojowy.';end if;
 if coalesce((p_snapshot->>'hp')::numeric,0) not between 1 and 50000
 or coalesce((p_snapshot->>'armor')::numeric,0) not between 0 and 10000 then
 raise exception 'Nieprawidłowe statystyki bojowe.';end if;
 if not public.ashen_pvp_validate_sets(p_snapshot,saved) then
 raise exception 'Niezgodność setów X/Y/Z z wyposażeniem w zapisie postaci. Zsynchronizuj zapis ponownie.';
 end if;
 insert into public.ashen_online_profiles(user_id,name,level,origin,gender,snapshot,updated_at)
 values(u,nm,lv,origin,gender,p_snapshot,now())
 on conflict(user_id) do update set name=excluded.name,level=excluded.level,
 origin=excluded.origin,gender=excluded.gender,snapshot=excluded.snapshot,updated_at=now();
end $fn$;

revoke all on function public.ashen_pvp_validate_sets(jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.ashen_publish_profile(jsonb) from public,anon;
grant execute on function public.ashen_publish_profile(jsonb) to authenticated;
