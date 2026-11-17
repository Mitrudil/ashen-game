-- ASHEN SQL 032 — przedwdrożeniowa kontrola instalacji SQL 029 (tylko SELECT; nic nie zmienia)
WITH src AS (SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) AS body)
SELECT
 CASE WHEN position('XY-Z6-v0.4.9.14' IN body)>0 THEN 'OK — SQL 029 jest aktywny'
      WHEN position('XY-Z9-v0.4.9.19' IN body)>0 THEN 'SQL 032 już aktywny — nie wdrażaj ponownie'
      ELSE 'STOP — nieznana wersja funkcji online' END AS wersja_funkcji,
 (position('master_armor_reinforced' IN body)>0) AS wzmocniony,
 (position('master_armor_plated' IN body)>0) AS pancerny,
 (position('master_accessory_technical' IN body)>0) AS techniczny,
 (position('insert into public.ashen_online_attacks' IN body)>0) AS zapis_raportow,
 (position('from auth.users where id=u for update' IN body)>0) AS blokada_limitu
FROM src;
