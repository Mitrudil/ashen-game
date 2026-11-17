-- ASHEN v0.4.9.22 / PODSTAWOWA SPÓJNOŚĆ RAPORTÓW (tylko SELECT)
-- Wynik zagregowany; nie odtwarza dokładnych obrażeń cios po ciosie.
WITH checked AS (
 SELECT report, COALESCE(report->>'setCombatMode','brak znacznika') AS silnik,
 CASE WHEN jsonb_typeof(report->'rounds')='array'
      THEN jsonb_array_length(report->'rounds') ELSE NULL END AS rundy,
 CASE WHEN jsonb_typeof(report->'hp')='array' THEN report->'hp' ELSE NULL END AS hp,
 CASE WHEN jsonb_typeof(report->'maxHp')='array' THEN report->'maxHp' ELSE NULL END AS max_hp,
 CASE WHEN jsonb_typeof(report->'totals')='array' THEN report->'totals' ELSE NULL END AS totals
 FROM public.ashen_online_attacks
), flags AS (
 SELECT silnik,
  (rundy IS NULL OR rundy>10) AS problem_rundy,
  (hp IS NULL OR jsonb_array_length(hp)<>2 OR
   max_hp IS NULL OR jsonb_array_length(max_hp)<>2) AS problem_hp_format,
  (totals IS NULL OR jsonb_array_length(totals)<>2) AS problem_statystyki_format,
  CASE WHEN hp IS NOT NULL AND max_hp IS NOT NULL
    AND jsonb_array_length(hp)=2 AND jsonb_array_length(max_hp)=2
   AND jsonb_typeof(hp->0)='number' AND jsonb_typeof(hp->1)='number'
    AND jsonb_typeof(max_hp->0)='number' AND jsonb_typeof(max_hp->1)='number'
   THEN ((hp->>0)::numeric<0 OR (hp->>1)::numeric<0 OR
     (hp->>0)::numeric>(max_hp->>0)::numeric OR
     (hp->>1)::numeric>(max_hp->>1)::numeric)
   ELSE false END AS problem_hp_zakres
 FROM checked
)
SELECT silnik,count(*) AS raporty,
 count(*) FILTER (WHERE problem_rundy) AS sygnaly_rundy,
 count(*) FILTER (WHERE problem_hp_format) AS sygnaly_format_hp,
 count(*) FILTER (WHERE problem_hp_zakres) AS sygnaly_zakres_hp,
 count(*) FILTER (WHERE problem_statystyki_format) AS sygnaly_statystyki
FROM flags GROUP BY silnik ORDER BY raporty DESC;
