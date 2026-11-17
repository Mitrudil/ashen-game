-- SQL 039 KANDYDAT: testowe Z wyłącznie w walce, dla ręcznie autoryzowanych kont.
-- WYMAGA SQL 034. Bez zmian w ekwipunku, chmurze i publikacji profilu.
BEGIN;
SET LOCAL statement_timeout='60s';
SET LOCAL lock_timeout='3s';
CREATE TABLE IF NOT EXISTS public.ashen_pvp_test_z_config (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 family text,
 enabled boolean NOT NULL DEFAULT false,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT ashen_test_z_family_chk CHECK(family IS NULL OR family IN ('armor_reinforced', 'armor_plated', 'armor_flexible', 'armor_agile', 'armor_light', 'armor_resistant', 'armor_tracker', 'armor_iron', 'armor_warden', 'armor_nomad', 'accessory_technical', 'accessory_observant', 'accessory_persuasive', 'accessory_reflexive', 'accessory_versatile'))
);
ALTER TABLE public.ashen_pvp_test_z_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ashen_pvp_test_z_config FROM PUBLIC, anon, authenticated;
-- Funkcja dostępna wyłącznie w ramach SECURITY DEFINER silnika walki.
CREATE OR REPLACE FUNCTION public.ashen_pvp_test_z_apply(p_snapshot jsonb,p_user uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE fam text;
BEGIN
 SELECT family INTO fam FROM public.ashen_pvp_test_z_config
 WHERE user_id=p_user AND enabled AND family IS NOT NULL;
 IF fam IS NULL THEN RETURN p_snapshot; END IF;
 RETURN jsonb_set(
   jsonb_set(p_snapshot,ARRAY['setEffects','master_'||fam],'1'::jsonb,true),
   '{zTest}',jsonb_build_object('mode','ADMIN_TEST_ONLY','family',fam),true
 );
END $fn$;
REVOKE ALL ON FUNCTION public.ashen_pvp_test_z_apply(jsonb,uuid) FROM PUBLIC,anon,authenticated;
-- Użytkownik może zmienić tryb WYŁĄCZNIE swojego konta, jeśli administrator je dopuścił.
CREATE OR REPLACE FUNCTION public.ashen_pvp_test_z_select(p_family text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE who uuid:=auth.uid(); chosen text:=nullif(p_family,'');
BEGIN
 IF who IS NULL THEN RAISE EXCEPTION 'Zaloguj się.'; END IF;
 IF chosen IS NOT NULL AND chosen NOT IN ('armor_reinforced', 'armor_plated', 'armor_flexible', 'armor_agile', 'armor_light', 'armor_resistant', 'armor_tracker', 'armor_iron', 'armor_warden', 'armor_nomad', 'accessory_technical', 'accessory_observant', 'accessory_persuasive', 'accessory_reflexive', 'accessory_versatile') THEN
  RAISE EXCEPTION 'Nieznana rodzina Mistrzostwa Z.';
 END IF;
 UPDATE public.ashen_pvp_test_z_config
 SET family=chosen,enabled=(chosen IS NOT NULL),updated_at=now()
 WHERE user_id=who;
 IF NOT FOUND THEN RAISE EXCEPTION 'To konto nie ma uprawnień testera PvP Z.'; END IF;
 RETURN jsonb_build_object('allowed',true,'enabled',chosen IS NOT NULL,'family',chosen);
END $fn$;
REVOKE ALL ON FUNCTION public.ashen_pvp_test_z_select(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ashen_pvp_test_z_select(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.ashen_pvp_test_z_status()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $fn$
DECLARE result jsonb;
BEGIN
 SELECT jsonb_build_object('allowed',true,'enabled',enabled,'family',family) INTO result
 FROM public.ashen_pvp_test_z_config WHERE user_id=auth.uid();
 RETURN coalesce(result,'{"allowed":false,"enabled":false,"family":null}'::jsonb);
END $fn$;
REVOKE ALL ON FUNCTION public.ashen_pvp_test_z_status() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ashen_pvp_test_z_status() TO authenticated;
-- Wstawiamy override po pobraniu sprawdzonych snapshotów, NIE podczas publikacji profilu.
DO $patch$
DECLARE d text; old_fragment text:='f:=array[a,d];mx:=array[';
 new_fragment text:='a:=public.ashen_pvp_test_z_apply(a,u);'||chr(10)||' d:=public.ashen_pvp_test_z_apply(d,p_defender);'||chr(10)||' f:=array[a,d];mx:=array[';
 old_report text:=chr(39)||'setCombatMode'||chr(39)||','||chr(39)||'XY-Z15-v0.4.9.21'||chr(39);
 new_report text:=old_report||','||chr(39)||'testZMode'||chr(39)||',jsonb_build_object('||chr(39)||'attacker'||chr(39)||',a->'||chr(39)||'zTest'||chr(39)||','||chr(39)||'defender'||chr(39)||',d->'||chr(39)||'zTest'||chr(39)||')';
BEGIN
 IF to_regprocedure('public.ashen_online_attack(uuid)') IS NULL THEN RAISE EXCEPTION 'Brak funkcji PvP'; END IF;
 d:=pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('XY-Z15-v0.4.9.21' IN d)=0 THEN RAISE EXCEPTION 'Nie oczekiwany silnik PvP (wymagany SQL034)'; END IF;
 IF position('ashen_pvp_test_z_apply' IN d)>0 THEN RAISE EXCEPTION 'Tryb testowy już zainstalowany'; END IF;
 IF position(old_fragment IN d)=0 OR position(old_report IN d)=0 THEN
  RAISE EXCEPTION 'STOP: nierozpoznana struktura SQL034, brak zmian';
 END IF;
 d:=replace(replace(d,old_fragment,new_fragment),old_report,new_report);
 EXECUTE d;
 d:=pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('ashen_pvp_test_z_apply(a,u)' IN d)=0
 OR position('ashen_pvp_test_z_apply(d,p_defender)' IN d)=0
 OR position(chr(39)||'testZMode'||chr(39) IN d)=0
 OR position('XY-Z15-v0.4.9.21' IN d)=0
 OR position('insert into public.ashen_online_attacks' IN lower(d))=0 THEN
  RAISE EXCEPTION 'STOP: kontrola niepowodzenie, transakcja wycofana';
 END IF;
END $patch$;
COMMIT;
