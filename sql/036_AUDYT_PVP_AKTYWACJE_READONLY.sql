-- ASHEN v0.4.9.22 / AUDYT zdarzen Z (tylko odczyt)
-- Uwzglednia najnowszy i historyczne silniki PvP.
-- Brak wpisu Z nie oznacza bledu mechaniki.
WITH fights AS (
 SELECT id, report
 FROM public.ashen_online_attacks
), events AS (
 SELECT f.id, f.report->>'setCombatMode' AS silnik,
        e.value #>> '{}' AS tresc
 FROM fights f
 CROSS JOIN LATERAL jsonb_array_elements(
  CASE WHEN jsonb_typeof(f.report->'rounds')='array'
       THEN f.report->'rounds' ELSE '[]'::jsonb END
 ) AS rd(value)
 CROSS JOIN LATERAL jsonb_array_elements(
  CASE WHEN jsonb_typeof(rd.value->'events')='array'
       THEN rd.value->'events' ELSE '[]'::jsonb END
 ) AS e(value)
 WHERE jsonb_typeof(e.value)='string'
), named AS (
 SELECT id, silnik,
   (regexp_match(tresc,'Mistrzostwo Z[[:space:]]*[—–-][[:space:]]*([^:]+):'))[1] AS rodzina
 FROM events
 WHERE tresc LIKE '%Mistrzostwo Z%'
), normalized AS (
 SELECT id,silnik,
  CASE rodzina
   WHEN 'Wartownika' THEN 'Wartowniczy'
   WHEN 'Negocjatora' THEN 'Przekonujący'
   WHEN 'Technika' THEN 'Techniczny'
   ELSE COALESCE(rodzina,'Nierozpoznane zdarzenie Z') END AS rodzina
 FROM named
)
SELECT COALESCE(silnik,'brak znacznika') AS silnik,
       rodzina, count(*) AS aktywacje,
       count(DISTINCT id) AS raporty_z_aktywacja
FROM normalized
GROUP BY 1,2
ORDER BY 1,2;
