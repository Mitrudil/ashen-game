-- ASHEN SQL 033 — TEST KOMPILACJI, nie wdrozenie. Uruchom CALOSC.
-- Wymaga aktywnego SQL032. Po wykonaniu nastapi ROLLBACK.
BEGIN;
DO $preflight$
DECLARE body text;
BEGIN
 IF to_regprocedure('public.ashen_online_attack(uuid)') IS NULL THEN
   RAISE EXCEPTION 'Brak funkcji public.ashen_online_attack(uuid)';
 END IF;
 body:=pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('XY-Z9-v0.4.9.19' in body)=0 THEN
   RAISE EXCEPTION 'Brak oczekiwanego SQL 032 — przerwij test SQL 033';
 END IF;
END;
$preflight$;
-- ASHEN v0.4.9.20 — KANDYDAT SQL 033 / etap 4 PvP (12/15 Z po wdrożeniu).
-- NIE URUCHAMIAJ NA GŁÓWNEJ BAZIE PRZED TESTAMI I KOPIĄ ashen_online_attack(uuid).
-- Wymaga wdrożonych poprawionego SQL 028 oraz SQL 032.
-- Dodaje: Elastyczny / Odporny / Refleksyjny. Zachowuje 9 wcześniejszych Z, X/Y,
-- publikowanie postaci, wiadomości, limity ataków i strukturę raportów.
-- Uwaga: istniejące serwerowe ograniczenia wiarygodności snapshotu i anty-cheat pozostają.
-- Brak automatycznego COMMIT w pliku: CREATE OR REPLACE FUNCTION w jednej transakcji SQL Editor.

CREATE OR REPLACE FUNCTION public.ashen_online_attack(p_defender uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 u uuid:=auth.uid(); day_now date:=(now() at time zone 'Europe/Warsaw')::date;
 a jsonb;d jsonb; f jsonb[]; hp integer[]; mx integer[]; totals jsonb:='[{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0},{"attempts":0,"hits":0,"misses":0,"critical":0}]'::jsonb;
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
 z_dodge_charge boolean[]; z_flexible_last_round integer[]; z_reflexive_last_round integer[];
 z_resistant_used boolean[]; z_precrit_damage integer; z_no_crit integer; z_reflexive_pen numeric;
