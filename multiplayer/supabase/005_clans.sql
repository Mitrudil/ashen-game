-- ASHEN v0.2.8 — klany. Uruchom WYŁĄCZNIE w oddzielnym projekcie ASHEN.
-- Wymaga 002_cloud_saves.sql i 003_online_pvp.sql. Nie uruchamiaj w ALLADYN.
-- Wszystkie operacje przez uwierzytelnione SECURITY DEFINER RPC, brak dostępu do tabel.
create table if not exists public.ashen_clans (
 id bigint generated always as identity primary key,
 name text not null unique check (char_length(name) between 3 and 40),
 tag text not null unique check (tag ~ '^[A-Z0-9]{2,5}$'),
 description text not null default '' check (char_length(description)<=400),
 leader_id uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.ashen_clan_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 clan_id bigint not null references public.ashen_clans(id) on delete cascade,
 role text not null check(role in ('leader','officer','member')),
 joined_at timestamptz not null default now()
);
create index if not exists ashen_clan_members_clan_idx on public.ashen_clan_members(clan_id);
create table if not exists public.ashen_clan_invites (
 id bigint generated always as identity primary key,
 clan_id bigint not null references public.ashen_clans(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete cascade,
 recipient_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','rejected','cancelled')),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now() + interval '7 days'),
 constraint ashen_clan_no_self_invite check(sender_id<>recipient_id)
);
create unique index if not exists ashen_clan_one_pending_invite on public.ashen_clan_invites(clan_id,recipient_id) where status='pending';
create index if not exists ashen_clan_invites_recipient_idx on public.ashen_clan_invites(recipient_id,created_at desc);
alter table public.ashen_clans enable row level security;
alter table public.ashen_clan_members enable row level security;
alter table public.ashen_clan_invites enable row level security;
revoke all on public.ashen_clans,public.ashen_clan_members,public.ashen_clan_invites from public,anon,authenticated;

create or replace function public.ashen_clan_state()
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; result jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 select jsonb_build_object(
  'clan', (select to_jsonb(c) from public.ashen_clans c where c.id=cid),
  'my_role', (select role from public.ashen_clan_members where user_id=u),
  'members', coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'role',m.role,'joined_at',m.joined_at,'name',coalesce(p.name,'Ocalały'),'level',coalesce(p.level,1),'origin',p.origin) order by case m.role when 'leader' then 0 when 'officer' then 1 else 2 end,p.level desc) from public.ashen_clan_members m left join public.ashen_online_profiles p on p.user_id=m.user_id where m.clan_id=cid),'[]'::jsonb),
  'invitations', coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'clan_id',i.clan_id,'name',c.name,'tag',c.tag,'sender',coalesce(p.name,'Ocalały'),'expires_at',i.expires_at) order by i.created_at desc) from public.ashen_clan_invites i join public.ashen_clans c on c.id=i.clan_id left join public.ashen_online_profiles p on p.user_id=i.sender_id where i.recipient_id=u and i.status='pending' and i.expires_at>now()),'[]'::jsonb),
  'candidates', coalesce((select jsonb_agg(jsonb_build_object('user_id',p.user_id,'name',p.name,'level',p.level) order by p.level desc,p.name) from (select * from public.ashen_online_profiles where user_id<>u and not exists(select 1 from public.ashen_clan_members m where m.user_id=ashen_online_profiles.user_id) order by level desc,name limit 100) p),'[]'::jsonb),
  'pending_sent', coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'name',coalesce(p.name,'Ocalały'),'expires_at',i.expires_at) order by i.created_at desc) from public.ashen_clan_invites i left join public.ashen_online_profiles p on p.user_id=i.recipient_id where i.clan_id=cid and i.status='pending' and i.expires_at>now()),'[]'::jsonb)
 ) into result;
 return result;
end $$;

create or replace function public.ashen_clan_create(p_name text,p_tag text,p_description text default '')
returns bigint language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; nm text:=trim(coalesce(p_name,'')); tg text:=upper(trim(coalesce(p_tag,''))); descr text:=trim(coalesce(p_description,''));
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=u) then raise exception 'Najpierw wyślij swoją postać do chmury.';end if;
 if exists(select 1 from public.ashen_clan_members where user_id=u) then raise exception 'Należysz już do klanu.';end if;
 if char_length(nm) not between 3 and 40 or tg !~ '^[A-Z0-9]{2,5}$' or char_length(descr)>400 then raise exception 'Nazwa 3–40 znaków, skrót 2–5 liter/cyfr, opis do 400 znaków.';end if;
 insert into public.ashen_clans(name,tag,description,leader_id) values(nm,tg,descr,u) returning id into cid;
 insert into public.ashen_clan_members(user_id,clan_id,role) values(u,cid,'leader');
 return cid;
end $$;

create or replace function public.ashen_clan_invite(p_recipient uuid)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; cnt integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może zapraszać.';end if;
 if p_recipient is null or p_recipient=u then raise exception 'Nieprawidłowy odbiorca.';end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=p_recipient) then raise exception 'Nie znaleziono postaci online.';end if;
 if exists(select 1 from public.ashen_clan_members where user_id=p_recipient) then raise exception 'Gracz już należy do klanu.';end if;
 -- Serialize invites per clan; avoid concurrent spam and duplicate pending invitations.
 perform 1 from public.ashen_clans where id=cid for update;
 update public.ashen_clan_invites set status='cancelled' where clan_id=cid and status='pending' and expires_at<=now();
 select count(*) into cnt from public.ashen_clan_invites where clan_id=cid and status='pending';
 if cnt>=10 then raise exception 'Klan ma już 10 oczekujących zaproszeń.';end if;
 if exists(select 1 from public.ashen_clan_invites where clan_id=cid and recipient_id=p_recipient and status='pending') then raise exception 'Ten gracz ma już zaproszenie.';end if;
 insert into public.ashen_clan_invites(clan_id,sender_id,recipient_id) values(cid,u,p_recipient);
end $$;

create or replace function public.ashen_clan_respond(p_invite bigint,p_accept boolean)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; invite public.ashen_clan_invites%rowtype; cnt integer;
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 select * into invite from public.ashen_clan_invites where id=p_invite and recipient_id=u for update;
 if not found or invite.status<>'pending' or invite.expires_at<=now() then raise exception 'Zaproszenie jest nieaktualne.';end if;
 if not coalesce(p_accept,false) then update public.ashen_clan_invites set status='rejected' where id=p_invite;return;end if;
 if exists(select 1 from public.ashen_clan_members where user_id=u) then raise exception 'Należysz już do klanu.';end if;
 cid:=invite.clan_id;
 perform 1 from public.ashen_clans where id=cid for update;
 if not found then raise exception 'Klan już nie istnieje.';end if;
 select count(*) into cnt from public.ashen_clan_members where clan_id=cid;
 if cnt>=30 then raise exception 'Klan ma maksymalnie 30 członków.';end if;
 insert into public.ashen_clan_members(user_id,clan_id,role) values(u,cid,'member');
 update public.ashen_clan_invites set status='accepted' where id=p_invite;
 update public.ashen_clan_invites set status='cancelled' where recipient_id=u and status='pending' and id<>p_invite;
end $$;

create or replace function public.ashen_clan_manage(p_target uuid,p_action text)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; target_role text;
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if rl<>'leader' then raise exception 'Tylko lider może zarządzać rolami i usuwać członków.';end if;
 if p_target=u then raise exception 'Nie możesz zmienić własnej roli w ten sposób.';end if;
 select role into target_role from public.ashen_clan_members where user_id=p_target and clan_id=cid;
 if target_role is null then raise exception 'Gracz nie należy do Twojego klanu.';end if;
 if p_action='promote' and target_role='member' then update public.ashen_clan_members set role='officer' where user_id=p_target;
 elsif p_action='demote' and target_role='officer' then update public.ashen_clan_members set role='member' where user_id=p_target;
 elsif p_action='kick' then delete from public.ashen_clan_members where user_id=p_target;
 else raise exception 'Niedozwolona operacja.';end if;
end $$;

create or replace function public.ashen_clan_leave()
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; cnt integer;
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null then raise exception 'Nie należysz do klanu.';end if;
 perform 1 from public.ashen_clans where id=cid for update;
 if rl='leader' then
  select count(*) into cnt from public.ashen_clan_members where clan_id=cid;
  if cnt>1 then raise exception 'Lider nie może opuścić klanu z członkami. Najpierw usuń członków.';end if;
  delete from public.ashen_clan_members where user_id=u;
  delete from public.ashen_clans where id=cid;
 else delete from public.ashen_clan_members where user_id=u;end if;
end $$;

revoke all on function public.ashen_clan_state(),public.ashen_clan_create(text,text,text),public.ashen_clan_invite(uuid),public.ashen_clan_respond(bigint,boolean),public.ashen_clan_manage(uuid,text),public.ashen_clan_leave() from public,anon;
grant execute on function public.ashen_clan_state(),public.ashen_clan_create(text,text,text),public.ashen_clan_invite(uuid),public.ashen_clan_respond(bigint,boolean),public.ashen_clan_manage(uuid,text),public.ashen_clan_leave() to authenticated;
