-- ASHEN v0.3.3 — publiczne profile/ranking oraz raporty ekspedycji w skrzynce.
-- Uruchom tylko w projekcie ASHEN po 009 i 010. Nie uruchamiaj w ALLADYN.
-- Nie zmienia istniejących raportów, zapisów, przedmiotów ani starych wiadomości.

create table if not exists public.ashen_expedition_notices (
 id bigint generated always as identity primary key,
 expedition_id bigint not null references public.ashen_clan_expeditions(id) on delete cascade,
 recipient_id uuid not null references auth.users(id) on delete cascade,
 subject text not null,
 body text not null,
 is_read boolean not null default false,
 created_at timestamptz not null default now(),
 unique(expedition_id,recipient_id)
);
create index if not exists ashen_expedition_notices_user_idx on public.ashen_expedition_notices(recipient_id,created_at desc);
alter table public.ashen_expedition_notices enable row level security;
revoke all on public.ashen_expedition_notices from public,anon,authenticated;

-- Zadziała również dla walk rozgrywanych przez pg_cron, gdy nikt nie jest online.
create or replace function public.ashen_expedition_notify_resolved()
returns trigger language plpgsql security definer set search_path='' as $$
declare nm text; verdict text;
begin
 if new.status='resolved' and old.status is distinct from new.status and new.result is not null then
  nm:=coalesce(new.result->>'boss_name','Boss Pustkowi');
  verdict:=case when coalesce((new.result->>'victory')::boolean,false) then 'Zwycięstwo' else 'Porażka / remis' end;
  insert into public.ashen_expedition_notices(expedition_id,recipient_id,subject,body)
  select new.id,m.user_id, 'Ekspedycja: '||left(nm,70),
  verdict||' — '||nm||'. Raport jest dostępny w wiadomościach oraz w historii ekspedycji.'
  from public.ashen_clan_expedition_members m where m.expedition_id=new.id
  on conflict(expedition_id,recipient_id) do nothing;
 end if;
 return new;
end $$;
drop trigger if exists ashen_expedition_notice_trigger on public.ashen_clan_expeditions;
create trigger ashen_expedition_notice_trigger after update of status on public.ashen_clan_expeditions
for each row execute function public.ashen_expedition_notify_resolved();

-- Wsteczna migracja raportów ukończonych z poprzednich wersji (bez duplikatów).
insert into public.ashen_expedition_notices(expedition_id,recipient_id,subject,body,created_at)
select e.id,m.user_id,'Ekspedycja: '||left(coalesce(e.result->>'boss_name','Boss Pustkowi'),70),
(case when coalesce((e.result->>'victory')::boolean,false) then 'Zwycięstwo' else 'Porażka / remis' end)||' — '||coalesce(e.result->>'boss_name','Boss Pustkowi')||'. Raport jest dostępny w wiadomościach.',
coalesce(e.launched_at,e.created_at)
from public.ashen_clan_expeditions e join public.ashen_clan_expedition_members m on m.expedition_id=e.id
where e.status='resolved' and e.result is not null
on conflict(expedition_id,recipient_id) do nothing;

create or replace function public.ashen_expedition_inbox()
returns table(id bigint,expedition_id bigint,subject text,body text,is_read boolean,created_at timestamptz)
language sql security definer set search_path='' as $$
 select n.id,n.expedition_id,n.subject,n.body,n.is_read,n.created_at
 from public.ashen_expedition_notices n
 where auth.uid() is not null and n.recipient_id=auth.uid()
 order by n.created_at desc limit 100;
$$;

create or replace function public.ashen_expedition_notice_read(p_id bigint)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Zaloguj się.'; end if;
 update public.ashen_expedition_notices set is_read=true where id=p_id and recipient_id=auth.uid();
end $$;

-- Publiczny katalog graczy pokazuje tylko podstawowe dane postaci, bez zapisów i e-maili.
create or replace function public.ashen_player_directory(p_query text default '')
returns table(user_id uuid,name text,level integer,origin text,gender text,updated_at timestamptz,rank bigint)
language sql security definer set search_path='' as $$
 with ranked as (
  select p.user_id,p.name,p.level,p.origin,p.gender,p.updated_at,
  dense_rank() over(order by p.level desc) as rank
  from public.ashen_online_profiles p
 )
 select r.user_id,r.name,r.level,r.origin,r.gender,r.updated_at,r.rank
 from ranked r
 where auth.uid() is not null
   and (trim(coalesce(p_query,''))='' or position(lower(left(trim(p_query),40)) in lower(r.name))>0)
 order by r.level desc,r.name asc limit 100;
$$;

revoke all on function public.ashen_expedition_notify_resolved(),public.ashen_expedition_inbox(),public.ashen_expedition_notice_read(bigint),public.ashen_player_directory(text) from public,anon;
grant execute on function public.ashen_expedition_inbox(),public.ashen_expedition_notice_read(bigint),public.ashen_player_directory(text) to authenticated;
