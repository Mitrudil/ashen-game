-- ASHEN v0.3.4 — odpowiedzi, zarzadzanie skrzynka i profile w oknie.
-- Uruchom WYŁĄCZNIE w projekcie Supabase ASHEN, po 011_profiles_and_expedition_inbox.sql.
-- Nie usuwa fizycznie zapisanych walk ani wiadomosci drugiego uczestnika.

alter table public.ashen_online_mail
 add column if not exists sender_read boolean not null default true,
 add column if not exists sender_deleted boolean not null default false,
 add column if not exists recipient_deleted boolean not null default false;

-- Dla starych i nowych powiadomien: odczyt u atakujacego ma wlasna kolumne.
-- W starszych rekordach domyslnie przeczytane; nowe ataki ustawiane przez trigger ponizej.
create or replace function public.ashen_battle_sender_unread()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.kind='battle' then new.sender_read:=false; end if;
 return new;
end $$;
drop trigger if exists ashen_battle_sender_unread_trigger on public.ashen_online_mail;
create trigger ashen_battle_sender_unread_trigger before insert on public.ashen_online_mail
for each row execute function public.ashen_battle_sender_unread();

alter table public.ashen_expedition_notices
 add column if not exists is_deleted boolean not null default false;

-- Wiadomosci PvP trafiaja do Odebranych obu uczestnikow,
-- a Wyslane zawieraja jedynie listy prywatne wyslane przez gracza.
-- Kazdy uczestnik widzi swoj stan przeczytania.
create or replace function public.ashen_online_messages()
returns table(id bigint,sender_id uuid,recipient_id uuid,kind text,subject text,body text,battle_id bigint,is_read boolean,created_at timestamptz,from_name text,to_name text)
language sql security definer set search_path='' as $$
 select m.id,m.sender_id,m.recipient_id,m.kind,m.subject,m.body,m.battle_id,
   case when m.sender_id=auth.uid() then case when m.kind='battle' then m.sender_read else true end else m.is_read end,
   m.created_at,coalesce(s.name,'Ocalały'),coalesce(t.name,'Ocalały')
 from public.ashen_online_mail m
 left join public.ashen_online_profiles s on s.user_id=m.sender_id
 left join public.ashen_online_profiles t on t.user_id=m.recipient_id
 where auth.uid() is not null and (
   (m.recipient_id=auth.uid() and not m.recipient_deleted)
   or (m.sender_id=auth.uid() and not m.sender_deleted)
 )
 order by m.created_at desc limit 100;
$$;

create or replace function public.ashen_expedition_inbox()
returns table(id bigint,expedition_id bigint,subject text,body text,is_read boolean,created_at timestamptz)
language sql security definer set search_path='' as $$
 select n.id,n.expedition_id,n.subject,n.body,n.is_read,n.created_at
 from public.ashen_expedition_notices n
 where auth.uid() is not null and n.recipient_id=auth.uid() and not n.is_deleted
 order by n.created_at desc limit 100;
$$;

create or replace function public.ashen_online_mark_read(p_id bigint)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Zaloguj się.'; end if;
 update public.ashen_online_mail
 set is_read=true
 where id=p_id and recipient_id=auth.uid() and not recipient_deleted;
 update public.ashen_online_mail
 set sender_read=true
 where id=p_id and sender_id=auth.uid() and kind='battle' and not sender_deleted;
end $$;

-- Zbiorczy bezpieczny zapis po stronie serwera: kazde dzialanie ograniczone
-- do wiadomosci aktualnego uzytkownika, bez kasowania raportow.
create or replace function public.ashen_mail_batch(p_mail_ids bigint[],p_notice_ids bigint[],p_action text)
returns integer language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); c integer:=0; n integer:=0;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if p_action not in ('read','delete') then raise exception 'Nieznana operacja.'; end if;
 if cardinality(coalesce(p_mail_ids,array[]::bigint[])) + cardinality(coalesce(p_notice_ids,array[]::bigint[])) > 100 then
  raise exception 'Jednorazowo można zmienić maksymalnie 100 wiadomości.';
 end if;
 if p_action='read' then
  update public.ashen_online_mail
  set is_read=true
  where id=any(coalesce(p_mail_ids,array[]::bigint[])) and recipient_id=u and not recipient_deleted;
  get diagnostics c=row_count;
  update public.ashen_online_mail
  set sender_read=true
  where id=any(coalesce(p_mail_ids,array[]::bigint[])) and sender_id=u and kind='battle' and not sender_deleted;
  get diagnostics n=row_count; c:=c+n;
  update public.ashen_expedition_notices
  set is_read=true
  where id=any(coalesce(p_notice_ids,array[]::bigint[])) and recipient_id=u and not is_deleted;
  get diagnostics n=row_count; c:=c+n;
 else
  update public.ashen_online_mail
  set recipient_deleted=true
  where id=any(coalesce(p_mail_ids,array[]::bigint[])) and recipient_id=u and not recipient_deleted;
  get diagnostics c=row_count;
  update public.ashen_online_mail
  set sender_deleted=true
  where id=any(coalesce(p_mail_ids,array[]::bigint[])) and sender_id=u and not sender_deleted;
  get diagnostics n=row_count; c:=c+n;
  update public.ashen_expedition_notices
  set is_deleted=true
  where id=any(coalesce(p_notice_ids,array[]::bigint[])) and recipient_id=u and not is_deleted;
  get diagnostics n=row_count; c:=c+n;
 end if;
 return c;
end $$;

-- Otworzenie profilu takze spoza pierwszej setki rankingu.
-- Bez ujawniania e-maili, zapisu postaci lub identyfikatorow sesji.
create or replace function public.ashen_player_profile(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null then raise exception 'Zaloguj się.'; end if;
 select to_jsonb(q) into result from (
  select p.user_id,p.name,p.level,p.origin,p.gender,p.updated_at,
    (select count(distinct p2.level)+1 from public.ashen_online_profiles p2 where p2.level>p.level)::bigint as rank
  from public.ashen_online_profiles p
  where p.user_id=p_user_id
 ) q;
 if result is null then raise exception 'Nie znaleziono profilu gracza.'; end if;
 return result;
end $$;

revoke all on function public.ashen_mail_batch(bigint[],bigint[],text),public.ashen_player_profile(uuid) from public,anon;
grant execute on function public.ashen_mail_batch(bigint[],bigint[],text),public.ashen_player_profile(uuid) to authenticated;
