-- ASHEN 0.6.0 / ETAP 16 — KANDYDAT, NIE URUCHAMIAĆ W PRODUKCJI.
-- Odczyt własnego zapisu dzięki auth.uid() oraz RLS (SECURITY INVOKER).
-- Funkcja sprawdza integralność wyposażenia, ale NIE przelicza jeszcze obrażeń,
-- afiksów, setów, artefaktów ani statystyk migawki. Nie jest anty-cheatem.
-- Nie nadpisuje ashen_publish_profile, SQL 034 ani istniejących tabel.
create or replace function public.ashen_060_validate_equipment_candidate()
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  v_save jsonb;
  v_inventory jsonb;
  v_equip jsonb;
  v_item jsonb;
  v_uid text;
  v_slot text;
  v_ref jsonb;
  v_capacity integer;
  v_seen text[] := array[]::text[];
  v_equipped text[] := array[]::text[];
  v_modern integer := 0;
  v_sockets integer := 0;
  v_count integer := 0;
begin
  if auth.uid() is null then raise exception 'Zaloguj się do ASHEN.'; end if;
  select save_data into v_save from public.ashen_cloud_saves
   where user_id = auth.uid();
  if not found then raise exception 'Brak zapisu postaci.'; end if;
  v_inventory := v_save->'inventory';
  v_equip := v_save->'equip';
  if jsonb_typeof(v_inventory) is distinct from 'array' or
     jsonb_typeof(v_equip) is distinct from 'object' then
     raise exception 'Nieprawidłowy ekwipunek.';
  end if;
  if jsonb_array_length(v_inventory) > 1000 then
     raise exception 'Zbyt duży ekwipunek.';
  end if;
  for v_item in select value from jsonb_array_elements(v_inventory) loop
    if jsonb_typeof(v_item) is distinct from 'object' then
      raise exception 'Nieprawidłowy przedmiot.';
    end if;
    v_uid := v_item->>'uid';
    if nullif(v_uid,'') is null or v_uid = any(v_seen) then
      raise exception 'Brak lub powielenie UID przedmiotu.';
    end if;
    v_seen := array_append(v_seen,v_uid);
    v_count := v_count + 1;
    if coalesce(v_item->>'qualitySchema','legacy-v05') not in ('legacy-v05','ashen-v06') then
      raise exception 'Nieznany schemat jakości.';
    end if;
    if v_item->>'qualitySchema' = 'ashen-v06' then
      v_modern := v_modern + 1;
      -- Dopóki SQL nie liczy nowej jakości samodzielnie, publikacja PvP jest zablokowana.
      if (v_item->>'rarity') not in ('0','1','2','3','4') then
        raise exception 'Nieprawidłowy indeks jakości 0.6.';
      end if;
      if v_item->>'quality' is distinct from
         (array['zwykly','rzadki','epicki','legendarny','mityczny'])[(v_item->>'rarity')::integer+1] then
        raise exception 'Niespójna jakość 0.6.';
      end if;
    elsif (v_item->>'rarity') not in ('0','1','2','3','4') then
      raise exception 'Nieprawidłowy indeks starej jakości.';
    end if;
    if v_item ? 'socketCapacity' then
      if jsonb_typeof(v_item->'socketCapacity') is distinct from 'number'
         or (v_item->>'socketCapacity') not in ('0','1','2','3') then
        raise exception 'Nieprawidłowa pojemność gniazd.';
      end if;
      v_capacity := (v_item->>'socketCapacity')::integer;
      v_sockets := v_sockets + v_capacity;
    else
      v_capacity := null;
    end if;
    if v_item ? 'socketedArtifacts' then
      if jsonb_typeof(v_item->'socketedArtifacts') is distinct from 'array'
         or v_capacity is null then
        raise exception 'Nieprawidłowa lista artefaktów.';
      end if;
      if jsonb_array_length(v_item->'socketedArtifacts') > v_capacity then
        raise exception 'Za dużo osadzonych artefaktów.';
      end if;
    end if;
  end loop;
  for v_slot,v_ref in select key,value from jsonb_each(v_equip) loop
    if v_ref = 'null'::jsonb or v_ref = '""'::jsonb then continue; end if;
    if jsonb_typeof(v_ref) is distinct from 'string' then
      raise exception 'Nieprawidłowy zapis wyposażenia.';
    end if;
    v_uid := v_ref #>> '{}';
    if not (v_uid = any(v_seen)) or v_uid = any(v_equipped) then
      raise exception 'Nieistniejący lub powielony założony przedmiot.';
    end if;
    v_equipped := array_append(v_equipped,v_uid);
  end loop;
  return jsonb_build_object('readyForModernPvp',false,
    'inventoryCount',v_count,'equippedCount',cardinality(v_equipped),
    'modernCount',v_modern,'totalSocketCapacity',v_sockets,
    'reason','serwer nie rekonstruuje jeszcze statystyk przedmiotow');
end;
$$;
-- PO TESTACH NA ODDZIELNEJ BAZIE: ewentualnie osobno ustalić GRANT EXECUTE.
-- NIE dodawać wywołania do produkcyjnego klienta przed wdrożeniem funkcji.
