-- ASHEN 0.3.6.1 — testy ekspedycji BEZ LIMITU ZAPASÓW
-- Uruchom TYLKO w projekcie Supabase ASHEN po migracjach 001–014.
-- Funkcja tworzenia nie pobiera zapasów ani ich nie sprawdza.
-- Nie zmieniamy limitu dwóch aktywnych ekspedycji, składu i sumy poziomów.
-- Nie modyfikujemy istniejących postaci, nagród i raportów.
-- Przed wdrożeniem produkcyjnym przywróć płatne tworzenie ekspedycji.

create or replace function public.ashen_expedition_create(p_boss integer)
returns bigint language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; eid bigint; hi integer; max_levels integer; own_level integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może utworzyć wyprawę.'; end if;
 if p_boss not between 1 and 3 then raise exception 'Obecnie dostępni są bossowie 1–3.'; end if;
 select greatest(1,least(999,level)) into own_level from public.ashen_online_profiles where user_id=u;
 if own_level is null then raise exception 'Najpierw opublikuj swoją postać online.'; end if;
 max_levels:=(public.ashen_expedition_limits(p_boss)->>'max_levels')::integer;
 if own_level>max_levels then raise exception 'Twój poziom (%) przekracza limit drużyny (%) dla tego bossa.',own_level,max_levels; end if;
 perform 1 from public.ashen_clans where id=cid for update;
 insert into public.ashen_clan_progress(clan_id) values(cid) on conflict do nothing;
 select greatest(3,highest_unlocked) into hi from public.ashen_clan_progress where clan_id=cid;
 if p_boss>coalesce(hi,3) then raise exception 'Ten boss nie został odblokowany.'; end if;
 if (select count(*) from public.ashen_clan_expeditions where clan_id=cid and status='forming')>=2 then raise exception 'Klan wykorzystał oba sloty ekspedycji.'; end if;
 if exists(select 1 from public.ashen_clan_expeditions where clan_id=cid and created_by=u and status='forming') then raise exception 'Masz już jedną organizowaną ekspedycję.'; end if;
 if exists(select 1 from public.ashen_clan_expedition_members m join public.ashen_clan_expeditions e on e.id=m.expedition_id where m.user_id=u and e.status='forming') then raise exception 'Jesteś już uczestnikiem innej aktywnej ekspedycji.'; end if;
 insert into public.ashen_clan_expeditions(clan_id,boss_id,created_by,tactic,starts_at) values(cid,p_boss,u,'focus_weakest', now() + public.ashen_expedition_wait_time(p_boss)) returning id into eid;
 perform public.ashen_expedition_admit(eid,u);
 return eid;
end $$;


revoke all on function public.ashen_expedition_create(integer) from public, anon;
grant execute on function public.ashen_expedition_create(integer) to authenticated;
