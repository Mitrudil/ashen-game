-- ASHEN v0.2.9 — wyprawy klanowe i pierwsi bossowie.
-- Uruchom WYŁĄCZNIE w oddzielnym projekcie ASHEN.
-- Wymaga 002_cloud_saves.sql, 003_online_pvp.sql oraz 005_clans.sql.

create table if not exists public.ashen_clan_progress (
 clan_id bigint primary key references public.ashen_clans(id) on delete cascade,
 highest_unlocked integer not null default 3 check(highest_unlocked between 1 and 20),
 boss_wins jsonb not null default '[]'::jsonb check(jsonb_typeof(boss_wins)='array'),
 updated_at timestamptz not null default now()
);

create table if not exists public.ashen_clan_expeditions (
 id bigint generated always as identity primary key,
 clan_id bigint not null references public.ashen_clans(id) on delete cascade,
 boss_id integer not null check(boss_id between 1 and 20),
 status text not null default 'forming' check(status in ('forming','resolved','cancelled')),
 created_by uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 launched_at timestamptz,
 result jsonb
);
create unique index if not exists ashen_clan_one_active_expedition on public.ashen_clan_expeditions(clan_id) where status='forming';
create index if not exists ashen_clan_expeditions_history_idx on public.ashen_clan_expeditions(clan_id,created_at desc);

create table if not exists public.ashen_clan_expedition_members (
 expedition_id bigint not null references public.ashen_clan_expeditions(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 joined_at timestamptz not null default now(),
 primary key(expedition_id,user_id)
);
create index if not exists ashen_clan_expedition_members_user_idx on public.ashen_clan_expedition_members(user_id);

alter table public.ashen_clan_progress enable row level security;
alter table public.ashen_clan_expeditions enable row level security;
alter table public.ashen_clan_expedition_members enable row level security;
revoke all on public.ashen_clan_progress,public.ashen_clan_expeditions,public.ashen_clan_expedition_members from public,anon,authenticated;

create or replace function public.ashen_clan_progress_bootstrap()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.ashen_clan_progress(clan_id) values(new.id)
 on conflict(clan_id) do nothing;
 return new;
end $$;

drop trigger if exists ashen_clan_progress_bootstrap_trg on public.ashen_clans;
create trigger ashen_clan_progress_bootstrap_trg
after insert on public.ashen_clans
for each row execute function public.ashen_clan_progress_bootstrap();

insert into public.ashen_clan_progress(clan_id)
select id from public.ashen_clans
on conflict(clan_id) do nothing;

create or replace function public.ashen_expedition_boss(p_boss integer)
returns jsonb language plpgsql immutable set search_path='' as $$
begin
 case p_boss
  when 1 then
   return jsonb_build_object(
    'id',1,
    'name','Rzeźnik ze Złomowiska',
    'location','Złomowisko Alfa',
    'difficulty','Łatwy',
    'kind','Humanoidalny boss',
    'summary','Samotny watażka szabrowników. Dobry na pierwszą wspólną walkę 2–3 osób.',
    'min_players',2,'max_players',5,
    'enemies',jsonb_build_array(
      jsonb_build_object('name','Rzeźnik ze Złomowiska','role','Dowódca szabrowników','hp',230,'armor',12,'dodge',8,'acc',10,
        'attacks',jsonb_build_array(
          jsonb_build_object('name','Tasak ze stali odpadowej','min',18,'max',28,'power',1,'accuracy',5,'critPp',4),
          jsonb_build_object('name','Hak do rozpruwania','min',11,'max',18,'power',0.8,'accuracy',3,'critPp',0)
        )
      )
    )
   );
  when 2 then
   return jsonb_build_object(
    'id',2,
    'name','Kanałowy Pożeracz',
    'location','Kanały pod Strefą 9',
    'difficulty','Średni',
    'kind','Pojedynczy mutant',
    'summary','Wielki zmutowany drapieżnik o wysokim PŻ i ciężkich obrażeniach.',
    'min_players',2,'max_players',5,
    'enemies',jsonb_build_array(
      jsonb_build_object('name','Kanałowy Pożeracz','role','Bestia skażonych tuneli','hp',380,'armor',18,'dodge',6,'acc',12,
        'attacks',jsonb_build_array(
          jsonb_build_object('name','Szarża szczęk','min',20,'max',32,'power',1,'accuracy',6,'critPp',6),
          jsonb_build_object('name','Rozszarpanie pazurami','min',14,'max',24,'power',0.9,'accuracy',4,'critPp',2)
        )
      )
    )
   );
  when 3 then
   return jsonb_build_object(
    'id',3,
    'name','Trzej Bracia Rdzy',
    'location','Opuszczona Fabryka',
    'difficulty','Średni+',
    'kind','Grupa elit',
    'summary','Trzech przeciwników o różnych rolach. To jeszcze nie endgame, ale już trzeba dobrze dobrać drużynę.',
    'min_players',2,'max_players',5,
    'enemies',jsonb_build_array(
      jsonb_build_object('name','Brat Tarczownik','role','Ciężki frontliner','hp',180,'armor',22,'dodge',6,'acc',8,
        'attacks',jsonb_build_array(
          jsonb_build_object('name','Młot warsztatowy','min',15,'max',24,'power',1,'accuracy',4,'critPp',2)
        )
      ),
      jsonb_build_object('name','Brat Mechanik','role','Wsparcie ogniowe','hp',140,'armor',10,'dodge',8,'acc',12,
        'attacks',jsonb_build_array(
          jsonb_build_object('name','Pistolet gwoździowy','min',13,'max',21,'power',1,'accuracy',6,'critPp',4)
        )
      ),
      jsonb_build_object('name','Brat Strzelec','role','Precyzyjny eliminator','hp',130,'armor',8,'dodge',10,'acc',14,
        'attacks',jsonb_build_array(
          jsonb_build_object('name','Karabin z odzysku','min',15,'max',25,'power',1,'accuracy',7,'critPp',6)
        )
      )
    )
   );
  else
   return jsonb_build_object(
    'id',p_boss,
    'name','Nieznany boss',
    'location','Pustkowia',
    'difficulty','?',
    'kind','Brak danych',
    'summary','Ten boss nie został jeszcze przygotowany.',
    'min_players',2,'max_players',5,
    'enemies','[]'::jsonb
   );
 end case;
end $$;

create or replace function public.ashen_expedition_state()
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; result jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 select jsonb_build_object(
  'clan', (select to_jsonb(c) from public.ashen_clans c where c.id=cid),
  'my_role', (select role from public.ashen_clan_members where user_id=u),
  'members', coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'role',m.role,'joined_at',m.joined_at,'name',coalesce(p.name,'Ocalały'),'level',coalesce(p.level,1),'origin',p.origin) order by case m.role when 'leader' then 0 when 'officer' then 1 else 2 end,p.level desc) from public.ashen_clan_members m left join public.ashen_online_profiles p on p.user_id=m.user_id where m.clan_id=cid),'[]'::jsonb),
  'progress', coalesce((select jsonb_build_object('highest_unlocked',greatest(3,g.highest_unlocked),'boss_wins',g.boss_wins) from public.ashen_clan_progress g where g.clan_id=cid), jsonb_build_object('highest_unlocked',3,'boss_wins','[]'::jsonb)),
  'bosses', (select coalesce(jsonb_agg(public.ashen_expedition_boss(gs) order by gs),'[]'::jsonb) from generate_series(1,3) gs),
  'active_expedition', (
    select jsonb_build_object(
      'id',e.id,'boss_id',e.boss_id,'status',e.status,'created_at',e.created_at,'launched_at',e.launched_at,
      'created_by',e.created_by,'created_by_name',coalesce(p.name,'Ocalały'),'boss',public.ashen_expedition_boss(e.boss_id),'location',(public.ashen_expedition_boss(e.boss_id)->>'location'),
      'participants',coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'joined_at',m.joined_at,'role',cm.role,'name',coalesce(pp.name,'Ocalały'),'level',coalesce(pp.level,1),'origin',pp.origin) order by m.joined_at) from public.ashen_clan_expedition_members m join public.ashen_clan_members cm on cm.user_id=m.user_id left join public.ashen_online_profiles pp on pp.user_id=m.user_id where m.expedition_id=e.id),'[]'::jsonb)
    )
    from public.ashen_clan_expeditions e
    left join public.ashen_online_profiles p on p.user_id=e.created_by
    where e.clan_id=cid and e.status='forming'
    order by e.created_at desc limit 1
  ),
  'reports', coalesce((select jsonb_agg(jsonb_build_object('id',e.id,'boss_id',e.boss_id,'boss_name',coalesce(e.result->>'boss_name',public.ashen_expedition_boss(e.boss_id)->>'name'),'location',coalesce(e.result->>'location',public.ashen_expedition_boss(e.boss_id)->>'location'),'victory',coalesce((e.result->>'victory')::boolean,false),'created_at',coalesce(e.launched_at,e.created_at)) order by coalesce(e.launched_at,e.created_at) desc) from (select * from public.ashen_clan_expeditions where clan_id=cid and status='resolved' order by coalesce(launched_at,created_at) desc limit 12) e),'[]'::jsonb)
 ) into result;
 return result;
end $$;

create or replace function public.ashen_expedition_create(p_boss integer)
returns bigint language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; eid bigint; hi integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może utworzyć wyprawę.'; end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=u) then raise exception 'Najpierw opublikuj swoją postać online.'; end if;
 if p_boss not between 1 and 3 then raise exception 'Na razie dostępni są bossowie 1–3.'; end if;
 insert into public.ashen_clan_progress(clan_id) values(cid) on conflict(clan_id) do nothing;
 select greatest(3,highest_unlocked) into hi from public.ashen_clan_progress where clan_id=cid;
 if p_boss>coalesce(hi,3) then raise exception 'Ten boss nie jest jeszcze odblokowany dla klanu.'; end if;
 perform 1 from public.ashen_clans where id=cid for update;
 if exists(select 1 from public.ashen_clan_expeditions where clan_id=cid and status='forming') then raise exception 'Klan ma już aktywną wyprawę.'; end if;
 insert into public.ashen_clan_expeditions(clan_id,boss_id,created_by) values(cid,p_boss,u) returning id into eid;
 insert into public.ashen_clan_expedition_members(expedition_id,user_id) values(eid,u);
 return eid;
end $$;

create or replace function public.ashen_expedition_join(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; exp public.ashen_clan_expeditions%rowtype; cnt integer; maxp integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 if cid is null then raise exception 'Najpierw dołącz do klanu.'; end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=u) then raise exception 'Najpierw opublikuj swoją postać online.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 maxp:=coalesce((public.ashen_expedition_boss(exp.boss_id)->>'max_players')::integer,5);
 select count(*) into cnt from public.ashen_clan_expedition_members where expedition_id=exp.id;
 if cnt>=maxp then raise exception 'Skład wyprawy jest już pełny.'; end if;
 insert into public.ashen_clan_expedition_members(expedition_id,user_id) values(exp.id,u)
 on conflict(expedition_id,user_id) do nothing;
end $$;

create or replace function public.ashen_expedition_leave(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; exp public.ashen_clan_expeditions%rowtype; cnt integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 if cid is null then raise exception 'Najpierw dołącz do klanu.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 delete from public.ashen_clan_expedition_members where expedition_id=exp.id and user_id=u;
 select count(*) into cnt from public.ashen_clan_expedition_members where expedition_id=exp.id;
 if cnt=0 then delete from public.ashen_clan_expeditions where id=exp.id; end if;
end $$;

create or replace function public.ashen_expedition_cancel(p_expedition bigint)
returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może anulować wyprawę.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 update public.ashen_clan_expeditions set status='cancelled' where id=exp.id;
end $$;

create or replace function public.ashen_expedition_report(p_id bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); cid bigint; report jsonb;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id into cid from public.ashen_clan_members where user_id=u;
 if cid is null then raise exception 'Nie należysz do klanu.'; end if;
 select result into report from public.ashen_clan_expeditions where id=p_id and clan_id=cid and status='resolved';
 if report is null then raise exception 'Nie znaleziono raportu tej ekspedycji.'; end if;
 return jsonb_set(report,'{id}',to_jsonb(p_id),true);
end $$;

create or replace function public.ashen_expedition_launch(p_expedition bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=auth.uid(); cid bigint; rl text; exp public.ashen_clan_expeditions%rowtype;
 boss jsonb; enemies jsonb; heroes jsonb:='[]'::jsonb;
 hero_count integer:=0; enemy_count integer:=0; member_count integer:=0; idx integer; jdx integer; pick integer;
 hero_hp integer[]; max_hero_hp integer[]; enemy_hp integer[]; max_enemy_hp integer[]; hero_before integer[]; enemy_before integer[];
 hero_totals jsonb:='[]'::jsonb; enemy_totals jsonb:='[]'::jsonb;
 round_events jsonb; rounds jsonb:='[]'::jsonb;
 h jsonb; e jsonb; attacks jsonb; attack jsonb; other integer; alive integer; chance numeric; critical boolean; lowv integer; highv integer; dmg integer; armor numeric; r integer;
 report jsonb; p jsonb; name_txt text; best integer; hi integer;
begin
 if u is null then raise exception 'Zaloguj się.'; end if;
 select clan_id,role into cid,rl from public.ashen_clan_members where user_id=u;
 if cid is null or rl not in ('leader','officer') then raise exception 'Tylko lider lub oficer może rozpocząć wyprawę.'; end if;
 select * into exp from public.ashen_clan_expeditions where id=p_expedition and clan_id=cid for update;
 if not found or exp.status<>'forming' then raise exception 'Ta wyprawa nie jest już aktywna.'; end if;
 boss:=public.ashen_expedition_boss(exp.boss_id);
 if boss is null then raise exception 'Brak danych bossa.'; end if;
 select count(*) into member_count from public.ashen_clan_expedition_members where expedition_id=exp.id;
 select coalesce(jsonb_agg(p.snapshot order by m.joined_at),'[]'::jsonb)
 into heroes
 from public.ashen_clan_expedition_members m
 join public.ashen_online_profiles p on p.user_id=m.user_id
 where m.expedition_id=exp.id;
 hero_count:=coalesce(jsonb_array_length(heroes),0);
 if hero_count<>member_count then raise exception 'Wszyscy uczestnicy muszą mieć aktualną postać online.'; end if;
 if hero_count<coalesce((boss->>'min_players')::integer,2) then raise exception 'Do tej wyprawy potrzeba co najmniej % uczestników.',coalesce((boss->>'min_players')::integer,2); end if;
 if hero_count>coalesce((boss->>'max_players')::integer,5) then raise exception 'Ta wyprawa przekracza limit składu.'; end if;
 enemies:=boss->'enemies'; enemy_count:=coalesce(jsonb_array_length(enemies),0);
 if enemy_count<1 then raise exception 'Boss nie ma skonfigurowanych przeciwników.'; end if;

 hero_hp:=array[]::integer[]; max_hero_hp:=array[]::integer[]; hero_totals:='[]'::jsonb;
 for h in select value from jsonb_array_elements(heroes) loop
  max_hero_hp:=array_append(max_hero_hp,least(50000,greatest(1,coalesce((h->>'hp')::integer,1))));
  hero_hp:=array_append(hero_hp,least(50000,greatest(1,coalesce((h->>'hp')::integer,1))));
  hero_totals:=hero_totals||jsonb_build_array(jsonb_build_object('attempts',0,'hits',0,'misses',0,'critical',0,'damage',0,'best',0));
 end loop;

 enemy_hp:=array[]::integer[]; max_enemy_hp:=array[]::integer[]; enemy_totals:='[]'::jsonb;
 for e in select value from jsonb_array_elements(enemies) loop
  max_enemy_hp:=array_append(max_enemy_hp,least(50000,greatest(1,coalesce((e->>'hp')::integer,1))));
  enemy_hp:=array_append(enemy_hp,least(50000,greatest(1,coalesce((e->>'hp')::integer,1))));
  enemy_totals:=enemy_totals||jsonb_build_array(jsonb_build_object('attempts',0,'hits',0,'misses',0,'critical',0,'damage',0,'best',0));
 end loop;

 for r in 1..12 loop
  exit when not exists(select 1 from unnest(hero_hp) x where x>0) or not exists(select 1 from unnest(enemy_hp) x where x>0);
  round_events:='[]'::jsonb;
  hero_before:=hero_hp;
  enemy_before:=enemy_hp;

  for idx in 1..hero_count loop
   exit when not exists(select 1 from unnest(enemy_hp) x where x>0);
   if hero_hp[idx]<=0 then continue; end if;
   h:=heroes->(idx-1);
   attacks:=coalesce(h->'attacks','[]'::jsonb);
   for attack in select value from jsonb_array_elements(attacks) loop
    exit when not exists(select 1 from unnest(enemy_hp) x where x>0);
    alive:=0;
    for jdx in 1..enemy_count loop if enemy_hp[jdx]>0 then alive:=alive+1; end if; end loop;
    if alive=0 then exit; end if;
    pick:=1+floor(random()*alive)::integer; other:=null;
    for jdx in 1..enemy_count loop if enemy_hp[jdx]>0 then pick:=pick-1; if pick=0 then other:=jdx; exit; end if; end if; end loop;
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'attempts'],to_jsonb(coalesce((hero_totals->(idx-1)->>'attempts')::integer,0)+1));
    chance:=greatest(15,least(95,70+2*(coalesce((h->>'acc')::numeric,6)-coalesce((enemies->(other-1)->>'dodge')::numeric,3))+coalesce((attack->'weapon'->>'accuracy')::numeric,coalesce((attack->>'accuracy')::numeric,0))));
    name_txt:=left(coalesce(h->>'name','Ocalały'),40)||': '||left(coalesce(attack->'weapon'->>'name',coalesce(attack->>'name','Atak')),60);
    if random()*100>=chance then
      hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'misses'],to_jsonb(coalesce((hero_totals->(idx-1)->>'misses')::integer,0)+1));
      round_events:=round_events||to_jsonb(name_txt||' — pudło w '||coalesce(enemies->(other-1)->>'name','przeciwnika')||'.');
      continue;
    end if;
    lowv:=greatest(1,least(2000,coalesce((attack->'weapon'->>'min')::integer,coalesce((attack->>'min')::integer,1))));
    highv:=greatest(lowv,least(2000,coalesce((attack->'weapon'->>'max')::integer,coalesce((attack->>'max')::integer,lowv))));
    dmg:=floor((lowv+floor(random()*(highv-lowv+1)))*greatest(0.1,least(2,coalesce((attack->>'power')::numeric,1))))::integer;
    critical:=random()<greatest(0,least(0.35,0.05+coalesce((h->'attrs'->>'per')::numeric,5)*0.005+coalesce((attack->'weapon'->>'critPp')::numeric,coalesce((attack->>'critPp')::numeric,0))/100));
    if critical then dmg:=floor(dmg*1.6); end if;
    armor:=greatest(0,least(0.6,coalesce((enemies->(other-1)->>'armor')::numeric,0)/100));
    dmg:=least(enemy_hp[other],greatest(1,floor(dmg*(1-armor))::integer));
    enemy_hp[other]:=enemy_hp[other]-dmg;
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'hits'],to_jsonb(coalesce((hero_totals->(idx-1)->>'hits')::integer,0)+1));
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'damage'],to_jsonb(coalesce((hero_totals->(idx-1)->>'damage')::integer,0)+dmg));
    best:=greatest(coalesce((hero_totals->(idx-1)->>'best')::integer,0),dmg);
    hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'best'],to_jsonb(best));
    if critical then hero_totals:=jsonb_set(hero_totals,array[(idx-1)::text,'critical'],to_jsonb(coalesce((hero_totals->(idx-1)->>'critical')::integer,0)+1)); end if;
    round_events:=round_events||to_jsonb(name_txt||' — '||dmg||' obrażeń w '||coalesce(enemies->(other-1)->>'name','przeciwnika')||(case when critical then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;

  for idx in 1..enemy_count loop
   exit when not exists(select 1 from unnest(hero_hp) x where x>0);
   if enemy_hp[idx]<=0 then continue; end if;
   e:=enemies->(idx-1);
   attacks:=coalesce(e->'attacks','[]'::jsonb);
   for attack in select value from jsonb_array_elements(attacks) loop
    exit when not exists(select 1 from unnest(hero_hp) x where x>0);
    alive:=0;
    for jdx in 1..hero_count loop if hero_hp[jdx]>0 then alive:=alive+1; end if; end loop;
    if alive=0 then exit; end if;
    pick:=1+floor(random()*alive)::integer; other:=null;
    for jdx in 1..hero_count loop if hero_hp[jdx]>0 then pick:=pick-1; if pick=0 then other:=jdx; exit; end if; end if; end loop;
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'attempts'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'attempts')::integer,0)+1));
    chance:=greatest(15,least(95,70+2*(coalesce((e->>'acc')::numeric,8)-coalesce((heroes->(other-1)->>'dodge')::numeric,3))+coalesce((attack->>'accuracy')::numeric,0)));
    name_txt:=left(coalesce(e->>'name','Wróg'),40)||': '||left(coalesce(attack->>'name','Atak'),60);
    if random()*100>=chance then
      enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'misses'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'misses')::integer,0)+1));
      round_events:=round_events||to_jsonb(name_txt||' — pudło w '||coalesce(heroes->(other-1)->>'name','ocalałego')||'.');
      continue;
    end if;
    lowv:=greatest(1,least(2000,coalesce((attack->>'min')::integer,1)));
    highv:=greatest(lowv,least(2000,coalesce((attack->>'max')::integer,lowv)));
    dmg:=floor((lowv+floor(random()*(highv-lowv+1)))*greatest(0.1,least(2,coalesce((attack->>'power')::numeric,1))))::integer;
    critical:=random()<greatest(0,least(0.35,0.05+coalesce((e->>'acc')::numeric,8)*0.002+coalesce((attack->>'critPp')::numeric,0)/100));
    if critical then dmg:=floor(dmg*1.6); end if;
    armor:=greatest(0,least(0.6,coalesce((heroes->(other-1)->>'armor')::numeric,0)/100));
    dmg:=least(hero_hp[other],greatest(1,floor(dmg*(1-armor))::integer));
    hero_hp[other]:=hero_hp[other]-dmg;
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'hits'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'hits')::integer,0)+1));
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'damage'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'damage')::integer,0)+dmg));
    best:=greatest(coalesce((enemy_totals->(idx-1)->>'best')::integer,0),dmg);
    enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'best'],to_jsonb(best));
    if critical then enemy_totals:=jsonb_set(enemy_totals,array[(idx-1)::text,'critical'],to_jsonb(coalesce((enemy_totals->(idx-1)->>'critical')::integer,0)+1)); end if;
    round_events:=round_events||to_jsonb(name_txt||' — '||dmg||' obrażeń w '||coalesce(heroes->(other-1)->>'name','ocalałego')||(case when critical then ' (KRYTYCZNE)' else '' end)||'.');
   end loop;
  end loop;

  rounds:=rounds||jsonb_build_array(jsonb_build_object('number',r,'events',round_events,'hero_hp_before',to_jsonb(hero_before),'hero_hp',to_jsonb(hero_hp),'enemy_hp_before',to_jsonb(enemy_before),'enemy_hp',to_jsonb(enemy_hp)));
 end loop;

 report:=jsonb_build_object(
  'boss_id',exp.boss_id,
  'boss_name',boss->>'name',
  'location',boss->>'location',
  'at',to_char(now() at time zone 'Europe/Warsaw','DD.MM.YYYY, HH24:MI:SS'),
  'heroes',heroes,
  'enemies',enemies,
  'hero_hp',to_jsonb(hero_hp),
  'enemy_hp',to_jsonb(enemy_hp),
  'max_hero_hp',to_jsonb(max_hero_hp),
  'max_enemy_hp',to_jsonb(max_enemy_hp),
  'hero_totals',hero_totals,
  'enemy_totals',enemy_totals,
  'rounds',rounds,
  'victory',not exists(select 1 from unnest(enemy_hp) x where x>0),
  'outcome',case when not exists(select 1 from unnest(enemy_hp) x where x>0) then 'victory' when not exists(select 1 from unnest(hero_hp) x where x>0) then 'defeat' else 'draw' end,
  'reason',case when not exists(select 1 from unnest(enemy_hp) x where x>0) then 'Wszyscy przeciwnicy zostali pokonani.' when not exists(select 1 from unnest(hero_hp) x where x>0) then 'Wszyscy członkowie drużyny padli.' else 'Limit 12 rund minął, a bossowie nadal żyli.' end
 );

 update public.ashen_clan_expeditions set status='resolved',launched_at=now(),result=report where id=exp.id;
 insert into public.ashen_clan_progress(clan_id) values(cid) on conflict(clan_id) do nothing;
 if (report->>'victory')::boolean then
  update public.ashen_clan_progress
  set boss_wins = case when boss_wins @> jsonb_build_array(exp.boss_id) then boss_wins else boss_wins || jsonb_build_array(exp.boss_id) end,
      highest_unlocked = greatest(highest_unlocked, least(20, greatest(3, exp.boss_id+1))),
      updated_at = now()
  where clan_id=cid;
 end if;
 return jsonb_set(report,'{id}',to_jsonb(exp.id),true);
end $$;

revoke all on function public.ashen_clan_progress_bootstrap(),public.ashen_expedition_boss(integer),public.ashen_expedition_state(),public.ashen_expedition_create(integer),public.ashen_expedition_join(bigint),public.ashen_expedition_leave(bigint),public.ashen_expedition_cancel(bigint),public.ashen_expedition_report(bigint),public.ashen_expedition_launch(bigint) from public,anon;
grant execute on function public.ashen_expedition_state(),public.ashen_expedition_create(integer),public.ashen_expedition_join(bigint),public.ashen_expedition_leave(bigint),public.ashen_expedition_cancel(bigint),public.ashen_expedition_report(bigint),public.ashen_expedition_launch(bigint) to authenticated;
