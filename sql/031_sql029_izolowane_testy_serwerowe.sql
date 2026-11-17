-- ASHEN v0.4.9.18 | WERYFIKACJA SERWEROWA SQL 029 BEZ WDROZENIA
-- Uruchom CAŁOŚĆ w Supabase SQL Editor. Upewnij się, że ostatnią linią jest ROLLBACK;
-- NIE wywołuje ashen_online_attack, NIE zapisuje walk, nie zmienia kont, limitów ani rankingów.
-- Pobiera AKTUALNIE WDROŻONĄ definicję SQL 029; do funkcji sesyjnej kopiuje WYŁĄCZNIE obliczenia walki.
-- Funkcje sesyjne i wszelkie zmiany wycofuje ROLLBACK. Nie używa tabel ani RLS.
-- Uwaga: próba potwierdza obliczenia silnika wdrożonego na serwerze na sztucznych profilach,
-- nie jest pełnym testem autoryzacji ani endpointu RPC na rzeczywistych kontach.
BEGIN;
SET LOCAL statement_timeout = '30s';
SET LOCAL lock_timeout = '3s';
DO $setup$
DECLARE def text; body_sql text; declarations text; battle text; p1 integer; p2 integer; p3 integer;
BEGIN
  SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) INTO def;
  IF position('XY-Z6-v0.4.9.14' IN def)=0 OR position('master_armor_reinforced' IN def)=0 OR position('master_armor_plated' IN def)=0 OR position('master_accessory_technical' IN def)=0 THEN
    RAISE EXCEPTION 'Inna wersja silnika niż SQL 029. Test przerwany bez zmian.';
  END IF;
  IF position('AS $function$' IN def)=0 THEN
    RAISE EXCEPTION 'Nieoczekiwany format definicji funkcji SQL 029; test przerwany.';
  END IF;
  body_sql := split_part(split_part(def, 'AS $function$', 2), '$function$', 1);
  p1 := position(E'\nbegin\n' IN body_sql);
  p2 := position(E'\n f:=array[a,d];' IN body_sql);
  p3 := position(E'\n insert into public.ashen_online_attacks' IN body_sql);
  IF p1<1 OR p2<=p1 OR p3<=p2 THEN
    RAISE EXCEPTION 'Niezgodny układ funkcji; nie można bezpiecznie wydzielić obliczeń.';
  END IF;
  declarations := substr(body_sql,1,p1-1);
  battle := substr(body_sql,p2,p3-p2);
  -- Fail closed: nie przenosimy do próby żadnych operacji zapisu, zapytań dynamicznych ani odwołań do tabel.
  IF battle ~* E'\\m(insert|update|delete|truncate|alter|drop|create|execute|call|copy)\\M'
     OR battle ~* E'\\m(public\\.ashen_online_(attacks|profiles|mail))\\M' THEN
    RAISE EXCEPTION 'W kodzie walki odkryto niedozwoloną operację; test przerwany.';
  END IF;
  EXECUTE 'CREATE FUNCTION pg_temp.ashen_z6_silnik(p_attacker jsonb, p_defender uuid, p_target jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path TO '''' AS $probe$'
    || declarations || E'\nbegin\n a:=p_attacker; d:=p_target;\n' || battle || E'\n return v_report;\nend;\n' || '$probe$;';
END $setup$;
CREATE FUNCTION pg_temp.ashen_z6_powtorz(p_attacker jsonb,p_target jsonb)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path TO ''
AS $probe$ BEGIN PERFORM pg_catalog.setseed(0.42); RETURN pg_temp.ashen_z6_silnik(p_attacker,NULL::uuid,p_target); END $probe$;
WITH przypadki(nazwa,aktywny_po_stronie,flaga,atakujacy,obronca,oczekiwane) AS (VALUES
 ('Wzmocniony','obronca','master_armor_reinforced',
  '{"name":"Manekin","hp":2000,"acc":100,"dodge":0,"armor":0,"attrs":{"per":-100},"setEffects":{},"attacks":[{"hand":"right","power":1,"weapon":{"name":"Cios","min":140,"max":140}}]}'::jsonb,
  '{"name":"Wzmocniony","hp":200,"acc":100,"dodge":0,"armor":0,"attrs":{"per":-100},"setEffects":{},"attacks":[]}'::jsonb, 1),
 ('Pancerny','obronca','master_armor_plated',
  '{"name":"Manekin","hp":2000,"acc":100,"dodge":0,"armor":0,"attrs":{"per":-100},"setEffects":{},"attacks":[{"hand":"right","power":1,"weapon":{"name":"Cios","min":200,"max":200}}]}'::jsonb,
  '{"name":"Pancerny","hp":1000,"acc":100,"dodge":0,"armor":0,"attrs":{"per":-100},"setEffects":{},"attacks":[]}'::jsonb, 1),
 ('Techniczny','atakujacy','master_accessory_technical',
  '{"name":"Techniczny","hp":2000,"acc":100,"dodge":0,"armor":0,"attrs":{"per":-100},"setEffects":{},"attacks":[{"hand":"right","power":1,"weapon":{"name":"Strzal 1","min":100,"max":100}},{"hand":"right","power":1,"weapon":{"name":"Strzal 2","min":100,"max":100}},{"hand":"right","power":1,"weapon":{"name":"Strzal 3","min":100,"max":100}}]}'::jsonb,
  '{"name":"Cel opancerzony","hp":5000,"acc":100,"dodge":0,"armor":50,"attrs":{"per":-100},"setEffects":{},"attacks":[]}'::jsonb, 2)
), warianty AS MATERIALIZED (
 SELECT nazwa,oczekiwane,
  pg_temp.ashen_z6_powtorz(atakujacy,obronca) AS bez_z,
  pg_temp.ashen_z6_powtorz(
   CASE WHEN aktywny_po_stronie='atakujacy' THEN jsonb_set(atakujacy,'{setEffects}',jsonb_build_object(flaga,1)) ELSE atakujacy END,
   CASE WHEN aktywny_po_stronie='obronca' THEN jsonb_set(obronca,'{setEffects}',jsonb_build_object(flaga,1)) ELSE obronca END) AS z_z
 FROM przypadki
), zdarzenia AS (
 SELECT nazwa,oczekiwane,bez_z,z_z,
 (SELECT count(*) FROM jsonb_array_elements(z_z->'rounds') rd CROSS JOIN LATERAL jsonb_array_elements_text(rd->'events') AS ev(txt) WHERE ev.txt LIKE '%Mistrzostwo Z — '||nazwa||':%')::integer AS aktywacje,
 (SELECT count(*) FROM jsonb_array_elements(bez_z->'rounds') rd CROSS JOIN LATERAL jsonb_array_elements_text(rd->'events') AS ev(txt) WHERE ev.txt LIKE '%Mistrzostwo Z — '||nazwa||':%')::integer AS aktywacje_bez_z,
 (SELECT max(((zd->'hp'->>1)::int)-((bd->'hp'->>1)::int)) FROM jsonb_array_elements(z_z->'rounds') WITH ORDINALITY az(zd,n)
  JOIN jsonb_array_elements(bez_z->'rounds') WITH ORDINALITY bz(bd,n) USING(n)) AS roznica_pz_obroncy
 FROM warianty
)
SELECT nazwa, aktywacje, aktywacje_bez_z, oczekiwane,
 CASE WHEN nazwa='Techniczny' THEN (z_z->'totals'->0->>'damage')::integer-(bez_z->'totals'->0->>'damage')::integer ELSE roznica_pz_obroncy END AS zmierzona_korzysc,
 CASE WHEN aktywacje=oczekiwane AND aktywacje_bez_z=0 AND
   (CASE WHEN nazwa='Techniczny' THEN (z_z->'totals'->0->>'damage')::integer>(bez_z->'totals'->0->>'damage')::integer
     ELSE roznica_pz_obroncy>0 END)
 THEN 'OK' ELSE 'DO_ANALIZY' END AS wynik
FROM zdarzenia ORDER BY nazwa;
-- Nie zapisujemy funkcji ani danych z tego testu. Pozostaw tę linię na końcu:
ROLLBACK;
