-- SQL034 isolated compilation & invariant check (NO PRODUCTION DEPLOYMENT).
-- Paste all parts in ONE SQL Editor query; no separately executed pieces.
BEGIN;
SET LOCAL statement_timeout='60s';
SET LOCAL lock_timeout='3s';
DO $guard$
DECLARE v text;
BEGIN
 IF to_regprocedure('public.ashen_online_attack(uuid)') IS NULL THEN RAISE EXCEPTION 'STOP: brak funkcji PvP'; END IF;
 v:=pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('XY-Z12-v0.4.9.20' in v)=0 OR position('XY-Z15-v0.4.9.21' in v)>0 THEN
  RAISE EXCEPTION 'STOP: oczekiwano SQL033 / XY-Z12';
 END IF;
END $guard$;
CREATE OR REPLACE FUNCTION public.ashen_online_attack(p_defender uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 u uuid:=auth.uid(); day_now date:=(now() at time zone 'Europe/Warsaw')::date;
 a jsonb;d jsonb; f jsonb[]; hp integer[]; mx integer[]; totals jsonb:='[{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0},{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0}]'::jsonb;
 rounds jsonb:='[]'::jsonb; entries jsonb; weapons jsonb; w jsonb; round_start integer[];
 i integer;j integer;r integer;first_i integer;other integer; chance numeric;crit boolean;val integer; rawd integer; damage integer; armor numeric; hit_label text;
 win integer; v_report jsonb; bid bigint; now_txt text; cnt integer;
 -- X/Y states (per fight; never persisted into player data).
 shields integer[]; missed boolean[]; dodged boolean[]; crit_protect integer[];
 set_pen numeric; set_reduction numeric; before_shield integer;
 -- Z: fight-scoped mastery state (no persistent player mutation).
 z_light_hits integer[]; z_light_procs integer[]; z_warden_used boolean[];
 z_ability boolean; z_shield integer;
 z_reinforced_used boolean[]; z_plated_used boolean[]; z_technical_hits integer[];
 z_heal integer; z_technical_pen numeric;
 -- Z etapa 3: per-combat & per-round tracking.
 z_agile_used boolean[]; z_iron_last_round integer[]; z_observant_used_round integer[];
 -- SQL033: dodge-to-hit charges; first enemy crit suppression.
