-- SQL 039 — sprawdzenie instalacji bez zmian w bazie.
SELECT CASE WHEN position('ashen_pvp_test_z_apply(a,u)' IN
 pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure))>0
 THEN 'OK — tryb Z podłączony do silnika' ELSE 'STOP — brak trybu testowego' END AS silnik,
 (SELECT count(*) FROM public.ashen_pvp_test_z_config) AS konta_uprawnione,
 (SELECT count(*) FROM public.ashen_pvp_test_z_config WHERE enabled) AS konta_z_wlaczonym_z;
