-- ASHEN SQL 038 — TYMCZASOWO BEZ LIMITU ATAKOW PVP (tryb samotnych testow).
-- Nie usuwa raportow, nie resetuje statystyk, nie zmienia silnika obrazen.
-- Tylko public.ashen_online_attack(uuid); funkcja listowania może nadal pokazywać historyczne liczniki.
BEGIN;
SET LOCAL statement_timeout = '60s';
SET LOCAL lock_timeout = '3s';
DO $patch$
DECLARE
  definition text;
  old_check text := 'if cnt>=2 then raise exception ''Limit 2 ataków dziennie na tego gracza. Reset o północy czasu polskiego.'';end if;';
  new_check text := '-- ASHEN-SQL038-LIMIT-OFF: dzienny limit atakow tymczasowo wylaczony (testy).';
BEGIN
  IF to_regprocedure('public.ashen_online_attack(uuid)') IS NULL THEN
    RAISE EXCEPTION 'STOP: funkcja ashen_online_attack(uuid) nie istnieje';
  END IF;
  definition := pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
  IF position('XY-Z15-v0.4.9.21' in definition) = 0 THEN
    RAISE EXCEPTION 'STOP: oczekiwano SQL034 / XY-Z15. Zmiany nie zostaly zapisane';
  END IF;
  IF position(new_check in definition) > 0 THEN
    RAISE EXCEPTION 'STOP: limit juz jest wylaczony. Nie trzeba ponawiac';
  END IF;
  IF position(old_check in definition) = 0 THEN
    RAISE EXCEPTION 'STOP: nie rozpoznano dotychczasowej blokady. Nie zmieniono funkcji';
  END IF;
  EXECUTE replace(definition, old_check, new_check);
  definition := pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
  IF position(new_check in definition) = 0
     OR position(old_check in definition) > 0
     OR position('XY-Z15-v0.4.9.21' in definition) = 0
     OR position('insert into public.ashen_online_attacks' in lower(definition)) = 0
     OR position('insert into public.ashen_online_mail' in lower(definition)) = 0 THEN
    RAISE EXCEPTION 'STOP: kontrola zmiany nie powiodla sie; transakcja wycofana';
  END IF;
END $patch$;
COMMIT;
