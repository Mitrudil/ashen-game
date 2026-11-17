-- ASHEN SQL 038: KONTROLA TYLKO DO ODCZYTU.
WITH fn AS (
 SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) AS body
)
SELECT
 CASE WHEN position('ASHEN-SQL038-LIMIT-OFF' in body)>0
       AND position('XY-Z15-v0.4.9.21' in body)>0
      THEN 'OK — SQL034 aktywny, limit PVP wylaczony'
      ELSE 'STOP — sprawdz definicje funkcji' END AS wynik,
 position('ASHEN-SQL038-LIMIT-OFF' in body)>0 AS limit_wylaczony,
 position('XY-Z15-v0.4.9.21' in body)>0 AS silnik_sql034,
 position('insert into public.ashen_online_attacks' in lower(body))>0 AS raporty_zapisywane
FROM fn;
