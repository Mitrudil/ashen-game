-- ASHEN v0.4.9.22 / AUDYT PvP (tylko odczyt)
-- Raporty w całej bazie, z podziałem na wersję silnika.
-- Bez nazw graczy, UUID, treści walk i modyfikacji danych.
SELECT
 COALESCE(report->>'setCombatMode','brak znacznika') AS silnik,
 count(*) AS raporty,
 count(*) FILTER (WHERE jsonb_typeof(report->'rounds')='array') AS z_tablica_rund,
 count(*) FILTER (WHERE jsonb_typeof(report->'totals')='array') AS z_licznikami,
 count(*) FILTER (WHERE jsonb_typeof(report->'hp')='array') AS z_koncowym_hp,
 count(*) FILTER (WHERE jsonb_typeof(report->'maxHp')='array') AS z_max_hp,
 min(created_at) AS pierwszy_raport,
 max(created_at) AS ostatni_raport
FROM public.ashen_online_attacks
GROUP BY 1
ORDER BY ostatni_raport DESC NULLS LAST;
