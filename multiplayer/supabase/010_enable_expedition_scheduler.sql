-- Supabase SQL Editor — ASHEN v0.3.2, instalacja serwerowego harmonogramu.
-- Uruchom PO pomyślnym wykonaniu 009_timed_expeditions.sql.
-- Bez tego automatyczne walki NIE rozpoczną się samoczynnie.
create extension if not exists pg_cron with schema pg_catalog;
do $$ begin
 if exists(select 1 from cron.job where jobname='ashen-expeditions-v032') then
   perform cron.unschedule('ashen-expeditions-v032');
 end if;
end $$;
select cron.schedule('ashen-expeditions-v032','* * * * *',
  'select public.ashen_expedition_process_due();');
-- Kontrola: select jobname, schedule, active from cron.job where jobname='ashen-expeditions-v032';
