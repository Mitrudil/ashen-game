-- ASHEN SQL 038: PRZYWROC LIMIT 2 ATAKOW DZIENNIE, kiedy zakonczysz testy.
-- Nie uruchamiaj podczas testow.
BEGIN;
DO $restore$
DECLARE
 definition text;
 disabled text := '-- ASHEN-SQL038-LIMIT-OFF: dzienny limit atakow tymczasowo wylaczony (testy).';
 old_check text := 'if cnt>=2 then raise exception ''Limit 2 ataków dziennie na tego gracza. Reset o północy czasu polskiego.'';end if;';
BEGIN
 definition := pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position('XY-Z15-v0.4.9.21' in definition)=0 OR position(disabled in definition)=0 THEN
  RAISE EXCEPTION 'STOP: niezgodna wersja lub limit nie jest wylaczony';
 END IF;
 EXECUTE replace(definition,disabled,old_check);
 definition := pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);
 IF position(old_check in definition)=0 OR position(disabled in definition)>0 THEN
  RAISE EXCEPTION 'STOP: nie udalo sie przywrocic limitu';
 END IF;
END $restore$;
COMMIT;
