SELECT CASE WHEN position('XY-Z9-v0.4.9.19' in pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure))>0 THEN 'OK — SQL 032 aktywny' ELSE 'STOP — nieoczekiwana wersja' END AS wynik;
