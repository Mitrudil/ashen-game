-- READ ONLY: ASHEN preflight before SQL034
SELECT CASE WHEN position('XY-Z12-v0.4.9.20' IN pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure))>0
 THEN 'OK — SQL 033 aktywny' ELSE 'STOP — nieoczekiwana wersja funkcji' END AS wynik;
