-- ASHEN v0.2.5: online PvP and private messages. RUN ONLY IN SEPARATE ASHEN PROJECT.
-- Requires 002_cloud_saves.sql. No changes to any other Supabase project.
-- Server enforces auth, per-pair daily limits (Europe/Warsaw), transactions and report delivery.
-- NOTE: Character stats/equipment originate from client-uploaded saves: testing-grade, NOT anti-cheat.

create table if not exists public.ashen_online_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 2 and 40),
 level integer not null check(level between 1 and 100000),
 origin text not null check(origin in ('scout','fighter','tech')),
 gender text not null check(gender in ('male','female')),
 snapshot jsonb not null check(octet_length(snapshot::text)<=16000),
 updated_at timestamptz not null default now()
);
create table if not exists public.ashen_online_attacks (
 id bigint generated always as identity primary key,
 attacker_id uuid not null references auth.users(id) on delete cascade,
 defender_id uuid not null references auth.users(id) on delete cascade,
 day_pl date not null,
 created_at timestamptz not null default now(),
 report jsonb not null,
 constraint no_self_attack check(attacker_id <> defender_id)
);
create index if not exists ashen_attack_daily_idx on public.ashen_online_attacks(attacker_id,defender_id,day_pl);
create table if not exists public.ashen_online_mail (
 id bigint generated always as identity primary key,
 sender_id uuid not null references auth.users(id) on delete cascade,
 recipient_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('battle','personal')),
 subject text not null check(char_length(subject) between 1 and 120),
 body text not null check(char_length(body) between 1 and 1500),
 battle_id bigint references public.ashen_online_attacks(id) on delete set null,
 is_read boolean not null default false,
 created_at timestamptz not null default now(),
 constraint no_self_message check(sender_id <> recipient_id)
);
create index if not exists ashen_mail_recipient_idx on public.ashen_online_mail(recipient_id,created_at desc);
create index if not exists ashen_mail_sender_idx on public.ashen_online_mail(sender_id,created_at desc);

-- No direct access to online tables. All reads/writes are audited through bounded RPCs.
alter table public.ashen_online_profiles enable row level security;
alter table public.ashen_online_attacks enable row level security;
alter table public.ashen_online_mail enable row level security;
revoke all on public.ashen_online_profiles,public.ashen_online_attacks,public.ashen_online_mail from public,anon,authenticated;

-- Restrict functions from PUBLIC by default, grant authenticated explicitly.
create or replace function public.ashen_publish_profile(p_snapshot jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare u uuid:=auth.uid(); nm text; lv integer; origin text; gender text; attacks jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if not exists(select 1 from public.ashen_cloud_saves where user_id=u) then raise exception 'Najpierw wyślij postać do chmury.';end if;
 nm:=left(trim(coalesce(p_snapshot->>'name','')),40);
 lv:=coalesce((p_snapshot->>'level')::integer,0);
 origin:=p_snapshot->>'origin';gender:=p_snapshot->>'gender';attacks:=p_snapshot->'attacks';
 if char_length(nm)<2 or lv<1 or lv>100000 or origin not in ('scout','fighter','tech') or gender not in ('male','female') or jsonb_typeof(attacks)<>'array' or jsonb_array_length(attacks)>2 or jsonb_array_length(attacks)<1 or octet_length(p_snapshot::text)>16000 then
  raise exception 'Nieprawidłowy profil bojowy.';
 end if;
 if coalesce((p_snapshot->>'hp')::numeric,0) not between 1 and 50000 or coalesce((p_snapshot->>'armor')::numeric,0) not between 0 and 10000 then raise exception 'Nieprawidłowe statystyki bojowe.';end if;
 insert into public.ashen_online_profiles(user_id,name,level,origin,gender,snapshot,updated_at)
 values(u,nm,lv,origin,gender,p_snapshot,now())
 on conflict(user_id) do update set name=excluded.name,level=excluded.level,origin=excluded.origin,gender=excluded.gender,snapshot=excluded.snapshot,updated_at=now();
end $$;

create or replace function public.ashen_online_list()
returns table(user_id uuid,name text,level integer,origin text,gender text,attacks_today integer,updated_at timestamptz)
language sql security definer set search_path = '' as $$
 select p.user_id,p.name,p.level,p.origin,p.gender,
 (select count(*)::integer from public.ashen_online_attacks a where a.attacker_id=auth.uid() and a.defender_id=p.user_id and a.day_pl=(now() at time zone 'Europe/Warsaw')::date), p.updated_at
 from public.ashen_online_profiles p where auth.uid() is not null and p.user_id<>auth.uid()
 order by p.level desc,p.updated_at desc limit 100;
$$;

create or replace function public.ashen_online_attack(p_defender uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 u uuid:=auth.uid(); day_now date:=(now() at time zone 'Europe/Warsaw')::date;
 a jsonb;d jsonb; f jsonb[]; hp integer[]; mx integer[]; totals jsonb:='[{"attempts":0,"hits":0,"misses":0,"critical":0,"damage":0},{"attempts":0,"hits":0,"misses":0,"critical":0}]'::jsonb;
 rounds jsonb:='[]'::jsonb; entries jsonb; weapons jsonb; w jsonb; round_start integer[];
 i integer;j integer;r integer;first_i integer;other integer; chance numeric;crit boolean;val integer; rawd integer; damage integer; armor numeric; hit_label text;
 win integer; v_report jsonb; bid bigint; now_txt text; cnt integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 if p_defender is null or p_defender=u then raise exception 'Nie możesz atakować własnego konta.'; end if;
 -- Serializes concurrent attacks by the same attacker; protects 2/day limit from races.
 perform 1 from auth.users where id=u for update;
 select count(*) into cnt from public.ashen_online_attacks where attacker_id=u and defender_id=p_defender and day_pl=day_now;
 if cnt>=2 then raise exception 'Limit 2 ataków dziennie na tego gracza. Reset o północy czasu polskiego.';end if;
 select snapshot into a from public.ashen_online_profiles where user_id=u;
 select snapshot into d from public.ashen_online_profiles where user_id=p_defender;
 if a is null then raise exception 'Najpierw opublikuj swoją postać online.';end if;
 if d is null then raise exception 'Przeciwnik nie ma opublikowanej postaci.';end if;
 f:=array[a,d];mx:=array[least(50000,greatest(1,coalesce((a->>'hp')::integer,1))),least(50000,greatest(1,coalesce((d->>'hp')::integer,1)))];hp:=mx;
 for r in 1..10 loop
  exit when hp[1]<=0 or hp[2]<=0;
  entries:='[]'::jsonb;round_start:=hp;
  if random() < 0.5 then first_i:=1; else first_i:=2;end if;
  for j in 1..2 loop
   i:=case when j=1 then first_i else 3-first_i end;other:=3-i;
   exit when hp[1]<=0 or hp[2]<=0;
   weapons:=f[i]->'attacks';
   for w in select value from jsonb_array_elements(weapons) loop
    exit when hp[1]<=0 or hp[2]<=0;
    totals:=jsonb_set(totals,array[(i-1)::text,'attempts'],to_jsonb((totals->(i-1)->>'attempts')::integer+1));
    hit_label:=left(coalesce(f[i]->>'name','Gracz'),40)||': '||left(coalesce(w->'weapon'->>'name','Broń'),60)||' ('||(case when w->>'hand'='left' then 'lewa' else 'prawa' end)||' ręka)';
    chance:=greatest(15,least(95,70+2*(coalesce((f[i]->>'acc')::numeric,6)-coalesce((f[other]->>'dodge')::numeric,3))+coalesce((w->'weapon'->>'accuracy')::numeric,0)));
    if random()*100>=chance then
     totals:=jsonb_set(totals,array[(i-1)::text,'misses'],to_jsonb((totals->(i-1)->>'misses')::integer+1));
     entries:=entries||to_jsonb(hit_label||' — pudło.');continue;
    end if;
    val:=greatest(1,least(2000,coalesce((w->'weapon'->>'min')::integer,1)));
    rawd:=greatest(val,least(2000,coalesce((w->'weapon'->>'max')::integer,val)));
    damage:=floor((val+floor(random()*(rawd-val+1)))*greatest(0.1,least(2,coalesce((w->>'power')::numeric,1))))::integer;
    crit:=random()<greatest(0,least(0.35,0.05+coalesce((f[i]->'attrs'->>'per')::numeric,5)*0.005+coalesce((w->'weapon'->>'critPp')::numeric,0)/100));
    if crit then damage:=floor(damage*1.6);end if;
    armor:=greatest(0,least(0.6,coalesce((f[other]->>'armor')::numeric,0)/100));
    damage:=least(hp[other],greatest(1,floor(damage*(1-armor))::integer));
    hp[other]:=hp[other]-damage;
    totals:=jsonb_set(totals,array[(i-1)::text,'hits'],to_jsonb((totals->(i-1)->>'hits')::integer+1));
    totals:=jsonb_set(totals,array[(i-1)::text,'damage'],to_jsonb((totals->(i-1)->>'damage')::integer+damage));
    if crit then totals:=jsonb_set(totals,array[(i-1)::text,'critical'],to_jsonb((totals->(i-1)->>'critical')::integer+1));end if;
    entries:=entries||to_jsonb(hit_label||' — '||damage||' obrażeń'||(case when crit then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;
  rounds:=rounds||jsonb_build_object('number',r,'events',entries,'hp',to_jsonb(hp),'damage',to_jsonb(array[round_start[1]-hp[1],round_start[2]-hp[2]]));
 end loop;
 win:=case when hp[1]<=0 then 1 when hp[2]<=0 then 0 else null end;
 now_txt:=to_char(now() at time zone 'Europe/Warsaw','DD.MM.YYYY, HH24:MI:SS');
 v_report:=jsonb_build_object('id','online-'||extract(epoch from clock_timestamp())::bigint,'at',now_txt,'attackerId',u,'defenderId',p_defender,'attacker',a,'defender',d,'winner',win,'rounds',rounds,'totals',totals,'hp',to_jsonb(hp),'maxHp',to_jsonb(mx));
 insert into public.ashen_online_attacks(attacker_id,defender_id,day_pl,report) values(u,p_defender,day_now,v_report) returning id into bid;
 v_report:=jsonb_set(v_report,'{id}',to_jsonb('online-'||bid::text));
 update public.ashen_online_attacks set report=v_report where id=bid;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body,battle_id)
 values(u,p_defender,'battle','Atak PvP — '||left(a->>'name',40),left(a->>'name',40)||' zaatakował(a) Twoją postać. Wynik: '||(case when win=0 then 'porażka obrońcy' when win=1 then 'zwycięstwo obrońcy' else 'remis' end)||'.',bid);
 return v_report;
end $$;

create or replace function public.ashen_online_reports()
returns table(id bigint,side text,report jsonb,created_at timestamptz)
language sql security definer set search_path = '' as $$
 select a.id,case when a.attacker_id=auth.uid() then 'attack' else 'defense' end,a.report,a.created_at
 from public.ashen_online_attacks a
 where auth.uid() is not null and (a.attacker_id=auth.uid() or a.defender_id=auth.uid())
 order by a.created_at desc limit 50;
$$;

create or replace function public.ashen_online_messages()
returns table(id bigint,sender_id uuid,recipient_id uuid,kind text,subject text,body text,battle_id bigint,is_read boolean,created_at timestamptz,from_name text,to_name text)
language sql security definer set search_path = '' as $$
 select m.id,m.sender_id,m.recipient_id,m.kind,m.subject,m.body,m.battle_id,m.is_read,m.created_at,
 coalesce(s.name,'Ocalały'),coalesce(t.name,'Ocalały')
 from public.ashen_online_mail m
 left join public.ashen_online_profiles s on s.user_id=m.sender_id
 left join public.ashen_online_profiles t on t.user_id=m.recipient_id
 where auth.uid() is not null and (m.sender_id=auth.uid() or m.recipient_id=auth.uid())
 order by m.created_at desc limit 100;
$$;

create or replace function public.ashen_online_send(p_recipient uuid,p_body text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare u uuid:=auth.uid();bid bigint;nm text;
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 if p_recipient is null or p_recipient=u then raise exception 'Nieprawidłowy odbiorca.';end if;
 if char_length(trim(coalesce(p_body,''))) not between 1 and 1500 then raise exception 'Wiadomość: 1–1500 znaków.';end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=p_recipient) then raise exception 'Nie znaleziono odbiorcy.';end if;
 select name into nm from public.ashen_online_profiles where user_id=u;
 if nm is null then raise exception 'Najpierw opublikuj swoją postać.';end if;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body)
 values(u,p_recipient,'personal','Wiadomość od '||nm,trim(p_body)) returning id into bid;
 return bid;
end $$;

create or replace function public.ashen_online_mark_read(p_id bigint)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'Zaloguj się.';end if;
 update public.ashen_online_mail set is_read=true where id=p_id and recipient_id=auth.uid();
end $$;

revoke all on function public.ashen_publish_profile(jsonb),public.ashen_online_list(),public.ashen_online_attack(uuid),public.ashen_online_reports(),public.ashen_online_messages(),public.ashen_online_send(uuid,text),public.ashen_online_mark_read(bigint) from public,anon;
grant execute on function public.ashen_publish_profile(jsonb),public.ashen_online_list(),public.ashen_online_attack(uuid),public.ashen_online_reports(),public.ashen_online_messages(),public.ashen_online_send(uuid,text),public.ashen_online_mark_read(bigint) to authenticated;
