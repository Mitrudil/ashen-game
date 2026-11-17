-- Uruchom TYLKO po sprawdzeniu, że Mitrudil i Kowal to Twoje konta.
-- Nazwy postaci muszą być unikatowe. Dwa wpisy są warunkiem bezpieczeństwa.
BEGIN;
DO $auth$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.ashen_online_profiles WHERE name IN ('Mitrudil','Kowal');
 IF n<>2 OR (SELECT count(DISTINCT name) FROM public.ashen_online_profiles WHERE name IN ('Mitrudil','Kowal'))<>2 THEN
 RAISE EXCEPTION 'STOP: oczekiwano po jednym koncie Mitrudil i Kowal'; END IF;
 INSERT INTO public.ashen_pvp_test_z_config(user_id,family,enabled)
 SELECT user_id,NULL,false FROM public.ashen_online_profiles
 WHERE name IN ('Mitrudil','Kowal')
 ON CONFLICT(user_id) DO NOTHING;
END $auth$;
COMMIT;
-- Sprawdź ID kont i przypisanie nazw (bez ujawniania emaili).
SELECT p.name,c.user_id,c.enabled,c.family FROM public.ashen_pvp_test_z_config c
JOIN public.ashen_online_profiles p ON p.user_id=c.user_id
ORDER BY p.name;
