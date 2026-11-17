-- ASHEN 0.4.9.17 — diagnostyka OBSERWACJI Z w rzeczywistych raportach SQL 029.
-- TYLKO SELECT: bez tworzenia obiektow, wywolan ashen_online_attack,
-- zmian w profilach, poczcie i limitach atakow. To NIE jest migracja.
-- Uruchamiaj w SQL Editor na koncie administratora. Wynik jest zagregowany,
-- bez nazw postaci, identyfikatorow kont i tresci poszczegolnych walk.
WITH engine_reports AS (
 SELECT id, report
 FROM public.ashen_online_attacks
 WHERE report->>'setCombatMode'='XY-Z6-v0.4.9.14'
),
real_events AS (
 SELECT r.id AS battle_id, rd.value->>'number' AS round_number, ev.value #>> '{}' AS message
 FROM engine_reports r
 CROSS JOIN LATERAL jsonb_array_elements(COALESCE(r.report->'rounds','[]'::jsonb)) AS rd(value)
 CROSS JOIN LATERAL jsonb_array_elements(COALESCE(rd.value->'events','[]'::jsonb)) AS ev(value)
 WHERE jsonb_typeof(ev.value)='string'
   AND (ev.value #>> '{}') LIKE '%Mistrzostwo Z%'
),
classified AS (
 SELECT battle_id, round_number,
 CASE
  WHEN message LIKE '%Mistrzostwo Z — Wzmocniony:%' THEN 'Wzmocniony'
  WHEN message LIKE '%Mistrzostwo Z — Pancerny:%' THEN 'Pancerny'
  WHEN message LIKE '%Mistrzostwo Z — Techniczny:%' THEN 'Techniczny'
  WHEN message LIKE '%Mistrzostwo Z — Wartownika:%' THEN 'Wartowniczy'
  WHEN message LIKE '%Mistrzostwo Z — Lekki:%' THEN 'Lekki'
  WHEN message LIKE '%Mistrzostwo Z — Negocjatora:%' THEN 'Przekonujący'
  ELSE 'Inne Z'
 END AS rodzina
 FROM real_events
),
family_names AS (
 SELECT * FROM (VALUES
 ('Wzmocniony'),('Pancerny'),('Techniczny'),('Wartowniczy'),('Lekki'),('Przekonujący'),('Inne Z')
 ) v(rodzina)
)
SELECT f.rodzina,
       (SELECT count(*) FROM engine_reports) AS liczba_raportow_sql029,
       count(c.battle_id) AS zarejestrowane_aktywacje,
       count(DISTINCT c.battle_id) AS raporty_z_aktywacja,
       CASE WHEN count(c.battle_id)=0 THEN 'Brak zaobserwowanych aktywacji, nie oznacza błędu'
            ELSE 'Zarejestrowano zdarzenia serwera' END AS interpretacja
FROM family_names f LEFT JOIN classified c ON c.rodzina=f.rodzina
GROUP BY f.rodzina
ORDER BY CASE f.rodzina WHEN 'Wzmocniony' THEN 1 WHEN 'Pancerny' THEN 2
 WHEN 'Techniczny' THEN 3 WHEN 'Wartowniczy' THEN 4 WHEN 'Lekki' THEN 5
 WHEN 'Przekonujący' THEN 6 ELSE 7 END;
