-- ASHEN 0.6.0 / ETAP 15 — AUDYT TYLKO DO ODCZYTU
-- Nie tworzy tabel ani funkcji, nie modyfikuje zapisów. Wykonać ewentualnie
-- w SQL Editor po upewnieniu się, że public.ashen_cloud_saves istnieje.
-- Zwraca TYLKO liczniki, bez danych kont, profili i ekwipunku.
WITH all_items AS (
 SELECT s.user_id, i.value AS item
 FROM public.ashen_cloud_saves AS s
 CROSS JOIN LATERAL jsonb_array_elements(
  CASE WHEN jsonb_typeof(s.save_data->'inventory')='array'
   THEN s.save_data->'inventory' ELSE '[]'::jsonb END
 ) AS i(value)
), checks AS (
 SELECT user_id, item,
  item->>'qualitySchema' = 'ashen-v06' AS modern,
  item ? 'socketCapacity' AS has_sockets,
  (item ? 'qualitySchema' AND item->>'qualitySchema' NOT IN ('legacy-v05','ashen-v06')) AS unknown_schema,
  (item->>'qualitySchema'='ashen-v06' AND (
   item->>'rarity' NOT IN ('0','1','2','3','4') OR
   CASE WHEN item->>'rarity' IN ('0','1','2','3','4') THEN item->>'quality' IS DISTINCT FROM (ARRAY['zwykly','rzadki','epicki','legendarny','mityczny'])[(item->>'rarity')::integer+1] ELSE true END
  )) AS invalid_modern
 FROM all_items
)
SELECT count(DISTINCT user_id) AS konta_z_przedmiotami,
 count(*) AS wszystkie_przedmioty,
 count(*) FILTER(WHERE modern) AS przedmioty_v06,
 count(DISTINCT user_id) FILTER(WHERE modern) AS konta_z_v06,
 count(*) FILTER(WHERE has_sockets) AS przedmioty_z_polem_gniazd,
 count(*) FILTER(WHERE unknown_schema) AS nieznany_schemat,
 count(*) FILTER(WHERE invalid_modern) AS niespojne_jakosci_v06
FROM checks;

-- Audyt opublikowanych migawek: czy publikacje zawierają poprawny format
-- i ile ataków deklarują. Silnik SQL konsumuje gotowe statystyki klienta.
SELECT count(*) AS profile_online,
 count(*) FILTER(WHERE jsonb_typeof(snapshot->'attacks')='array') AS z_tablica_atakow,
 count(*) FILTER(WHERE jsonb_typeof(snapshot->'activeSets')='array') AS z_zestawami,
 count(*) FILTER(WHERE jsonb_typeof(snapshot->'setEffects')='object') AS z_efektami,
 count(*) FILTER(WHERE snapshot ? 'qualitySchema') AS migawki_z_polem_schematu
FROM public.ashen_online_profiles;
