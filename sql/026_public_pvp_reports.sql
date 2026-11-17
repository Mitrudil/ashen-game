-- ASHEN v0.4.8.7: udostępniane na żądanie raporty PvP, bez publicznej listy.
-- Wymaga istniejącej tabeli public.ashen_online_attacks (SQL 003 / SQL 025).
-- Uruchom w Supabase SQL Editor po zapisaniu kopii obecnego schematu.
BEGIN;
ALTER TABLE public.ashen_online_attacks ADD COLUMN IF NOT EXISTS share_token uuid;
CREATE UNIQUE INDEX IF NOT EXISTS ashen_online_attacks_share_token_unique
 ON public.ashen_online_attacks(share_token) WHERE share_token IS NOT NULL;

CREATE OR REPLACE FUNCTION public.ashen_online_share_report(p_battle_id bigint)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $function$
DECLARE v_user uuid:=auth.uid(); v_token uuid;
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Wymagane logowanie.'; END IF;
 UPDATE public.ashen_online_attacks
 SET share_token=coalesce(share_token,gen_random_uuid())
 WHERE id=p_battle_id AND (attacker_id=v_user OR defender_id=v_user)
 RETURNING share_token INTO v_token;
 IF v_token IS NULL THEN RAISE EXCEPTION 'Nie znaleziono raportu lub brak uprawnien.'; END IF;
 RETURN v_token;
END;
$function$;

-- Publiczna funkcja zwraca tylko jawnie dozwolone pola; nie ujawnia UUID graczy
-- ani pelnych snapshotow, prywatnego ekwipunku, zapisow czy profili kont.
CREATE OR REPLACE FUNCTION public.ashen_public_pvp_report(p_token uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO ''
AS $function$
DECLARE r jsonb;
BEGIN
 SELECT report INTO r FROM public.ashen_online_attacks WHERE share_token=p_token LIMIT 1;
 IF r IS NULL THEN RETURN NULL; END IF;
 RETURN jsonb_build_object(
   'id',r->'id','at',r->'at','winner',r->'winner',
   'maxHp',r->'maxHp','hp',r->'hp','rounds',r->'rounds','totals',r->'totals',
   'setCombatMode',r->'setCombatMode',
   'attacker',jsonb_build_object(
     'name',left(coalesce(r->'attacker'->>'name','Gracz'),40),
     'origin',r->'attacker'->'origin','gender',r->'attacker'->'gender',
     'level',r->'attacker'->'level','armor',r->'attacker'->'armor',
     'dodge',r->'attacker'->'dodge','acc',r->'attacker'->'acc',
     'attrs',r->'attacker'->'attrs',
     'attacks',(SELECT coalesce(jsonb_agg(jsonb_build_object(
       'hand',w->'hand',
       'weapon',jsonb_build_object('name',w->'weapon'->'name','min',w->'weapon'->'min','max',w->'weapon'->'max')
     )),'[]'::jsonb) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(r->'attacker'->'attacks')='array' THEN r->'attacker'->'attacks' ELSE '[]'::jsonb END) AS w)
   ),
   'defender',jsonb_build_object(
     'name',left(coalesce(r->'defender'->>'name','Gracz'),40),
     'origin',r->'defender'->'origin','gender',r->'defender'->'gender',
     'level',r->'defender'->'level','armor',r->'defender'->'armor',
     'dodge',r->'defender'->'dodge','acc',r->'defender'->'acc',
     'attrs',r->'defender'->'attrs',
     'attacks',(SELECT coalesce(jsonb_agg(jsonb_build_object(
       'hand',w->'hand',
       'weapon',jsonb_build_object('name',w->'weapon'->'name','min',w->'weapon'->'min','max',w->'weapon'->'max')
     )),'[]'::jsonb) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(r->'defender'->'attacks')='array' THEN r->'defender'->'attacks' ELSE '[]'::jsonb END) AS w)
   )
 );
END;
$function$;
REVOKE ALL ON FUNCTION public.ashen_online_share_report(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ashen_public_pvp_report(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ashen_online_share_report(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ashen_public_pvp_report(uuid) TO anon,authenticated;
COMMIT;
