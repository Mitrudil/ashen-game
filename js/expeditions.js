/* ASHEN v0.3.6.2 — odznaki bossów i unikatowe łupy.
 * Wymaga 005_clans.sql i 006_clan_expeditions.sql.
 * Dla aktualizacji z v0.2.9.x uruchom także 007_expedition_tactics_and_boss_art.sql.
 */
(()=>{'use strict';
let state=null,loading=false,busy=false,error='',info='',lastIdentity='',requests=0;
let openedReportId=null,openedReport=null,reportLoading=false,rewards=[],badges=[],baseState=null;
const cloud=()=>window.ASHEN_CLOUD;
const client=()=>cloud()?.getClient();
const user=()=>cloud()?.getSession()?.user?.id;
const active=()=>Boolean(client()&&user());
const identity=()=>[cloud()?.getProjectUrl(),user()].join('|');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const redraw=()=>window.ASHEN_FORCE_RENDER?.();
const setError=e=>{error=String(e?.message||e||'Nieznany błąd').slice(0,250);info=''};
const roleName=r=>({leader:'Lider',officer:'Oficer',member:'Członek'})[r]||r;
const fmt=v=>v?new Date(v).toLocaleString('pl-PL',{timeZone:'Europe/Warsaw'}):'—';
const SUPPORT_OPTIONS=[
 {id:'rations',name:'🥫 Prowiant',building:'kitchen',text:'+4% PŻ za poziom Kuchni',cost:{food:20,water:12}},
 {id:'medical',name:'✚ Zabezpieczenie medyczne',building:'clinic',text:'+2 pancerza za poziom Lecznicy',cost:{medical:15,water:6}},
 {id:'technical',name:'🔧 Wyposażenie techniczne',building:'workshop',text:'+2% obrażeń za poziom Warsztatu',cost:{scrap:40,czesci:14}}
];
const RESOURCE_NAME={scrap:'złomu',czesci:'części',food:'żywności',water:'wody',medical:'medykamentów'};
const costList=cost=>Object.entries(cost).map(([k,n])=>`${n} ${RESOURCE_NAME[k]||k}`).join(' + ');
const wallet=()=>window.ASHEN_FACTION_WALLET?.()||{};
const hasFunds=cost=>Object.entries(cost).every(([k,n])=>Number(wallet()[k]||0)>=n);
const supportCost=ids=>ids.reduce((acc,id)=>{const row=SUPPORT_OPTIONS.find(s=>s.id===id);if(row)for(const [k,n] of Object.entries(row.cost))acc[k]=(acc[k]||0)+n;return acc},{});
const TACTICS=[
 {id:'focus_weakest',label:'Dobić najsłabszych',desc:'Drużyna skupia ataki na przeciwniku z najniższym aktualnym PŻ.'},
 {id:'focus_strongest',label:'Na największe zagrożenie',desc:'Priorytetem jest wróg o najwyższym zagrożeniu bojowym.'},
 {id:'spread',label:'Rozproszyć ogień',desc:'Cele wybierane są bardziej losowo, bez pełnej koncentracji.'}
];
const TACTIC_MAP=Object.fromEntries(TACTICS.map(t=>[t.id,t]));
const FALLBACK_BOSS_ART={
 '1':'boss-01-rzeznik.webp',
 '2':'boss-02-pozeracz.webp',
 '3':'boss-03-tarczownik.webp',
 'Rzeźnik ze Złomowiska':'boss-01-rzeznik.webp',
 'Kanałowy Pożeracz':'boss-02-pozeracz.webp',
 'Brat Tarczownik':'boss-03-tarczownik.webp',
 'Brat Mechanik':'boss-03-mechanik.webp',
 'Brat Strzelec':'boss-03-strzelec.webp'
};
const GROUP_BOSS_ART={
 '3':'boss-03-brothers-group.webp',
 'Trzej Bracia Rdzy':'boss-03-brothers-group.webp'
};
const DEFAULT_BOSSES=[
 {id:1,name:'Rzeźnik ze Złomowiska',location:'Złomowisko Alfa',difficulty:'Łatwy',kind:'Humanoidalny boss',summary:'Samotny watażka szabrowników. Dobry na pierwszą wspólną walkę 2–3 osób.',min_players:2,max_players:5,portrait:'boss-01-rzeznik.webp'},
 {id:2,name:'Kanałowy Pożeracz',location:'Kanały pod Strefą 9',difficulty:'Średni',kind:'Pojedynczy mutant',summary:'Wielki zmutowany drapieżnik o wysokim PŻ i ciężkich obrażeniach.',min_players:2,max_players:5,portrait:'boss-02-pozeracz.webp'},
 {id:3,name:'Trzej Bracia Rdzy',location:'Opuszczona Fabryka',difficulty:'Średni+',kind:'Grupa elit',summary:'Trzech przeciwników o różnych rolach. To jeszcze nie endgame, ale już trzeba dobrze dobrać drużynę.',min_players:2,max_players:5,portrait:'boss-03-tarczownik.webp'}
];
async function rpc(name,args={}){if(!active())throw Error('Zaloguj się w panelu ☁ Konto online.');const {data,error}=await client().rpc(name,args);if(error)throw error;return data}
async function refresh(){const id=identity(),n=++requests;lastIdentity=id;state=null;error='';loading=true;redraw();try{if(!active())return;const [freshState,freshRewards,freshBadges,factionBase]=await Promise.all([rpc('ashen_expedition_state'),rpc('ashen_expedition_my_rewards'),rpc('ashen_player_boss_badges',{p_user_id:user()}),rpc('ashen_faction_base_state').catch(()=>null)]);if(n===requests&&id===identity()){state=freshState;baseState=factionBase;rewards=Array.isArray(freshRewards)?freshRewards:[];badges=Array.isArray(freshBadges)?freshBadges:[]}}catch(e){if(n===requests)setError(e)}finally{if(n===requests){loading=false;redraw()}}}
async function loadReport(id){if(!id)return;reportLoading=true;openedReportId=id;openedReport=null;error='';redraw();try{openedReport=await rpc('ashen_expedition_report',{p_id:id})}catch(e){setError(e);openedReportId=null;openedReport=null}finally{reportLoading=false;redraw()}}
function ensure(){const id=identity();if(id!==lastIdentity){lastIdentity=id;state=null;baseState=null;rewards=[];badges=[];info='';error='';openedReportId=null;openedReport=null;void refresh()}}
function hp(v,m){const value=Math.max(0,Number(v)||0),max=Math.max(1,Number(m)||1);return `<div class="arena-health-track" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.round(max)}" aria-valuenow="${Math.round(Math.min(value,max))}"><span style="width:${Math.max(0,Math.min(100,value/max*100))}%"></span></div>`}
function hpEnemy(v,m){const value=Math.max(0,Number(v)||0),max=Math.max(1,Number(m)||1);return `<div class="arena-health-track" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.round(max)}" aria-valuenow="${Math.round(Math.min(value,max))}"><span class="is-enemy" style="width:${Math.max(0,Math.min(100,value/max*100))}%"></span></div>`}
function hpLabel(v,m){return `${Math.max(0,Math.round(Number(v)||0))} / ${Math.max(1,Math.round(Number(m)||1))}`}
function portrait(profile){const origin=['scout','fighter','tech'].includes(profile?.origin)?profile.origin:'scout';const gender=profile?.gender==='female'?'f':'m';return `<img src="./assets/characters/${origin}-${gender}-full.png" alt="${esc(profile?.name||'Postać')}" loading="lazy">`}
function bossPortraitFile(entity,bossId){return entity?.portrait||FALLBACK_BOSS_ART[String(entity?.name||'')]||FALLBACK_BOSS_ART[String(entity?.id||bossId||'')]||''}
function bossCardPortraitFile(entity,bossId){return entity?.portraitGroup||GROUP_BOSS_ART[String(entity?.name||'')]||GROUP_BOSS_ART[String(entity?.id||bossId||'')]||bossPortraitFile(entity,bossId)}
function bossImage(file,alt,cls=''){return file?`<div class="${cls||'expedition-boss-art'}"><img src="./assets/bosses/${esc(file)}" alt="${esc(alt||'Boss')}" loading="lazy"></div>`:''}
function enemyPortrait(enemy,index,bossId){const file=bossPortraitFile(enemy,bossId);return file?`<div class="expedition-enemy-portrait"><img src="./assets/bosses/${esc(file)}" alt="${esc(enemy?.name||'Wróg')}" loading="lazy"></div>`:`<div class="expedition-enemy-avatar">☠<span>${index+1}</span></div>`}
function totalsRows(totals=[]){return totals.map((t,i)=>`<tr><td>${i+1}</td><td>${Number(t.attempts)||0}</td><td>${Number(t.hits)||0}</td><td>${Number(t.misses)||0}</td><td>${Number(t.critical)||0}</td><td>${Number(t.damage)||0}</td></tr>`).join('')}
function eventTeam(line,heroes,enemies){const actor=String(line??'').split(': ',1)[0];const hero=heroes.some(x=>x?.name===actor);const enemy=enemies.some(x=>x?.name===actor);return hero&&!enemy?'is-hero':enemy&&!hero?'is-enemy':''}
function hpLost(before,after){return Math.max(0,(Array.isArray(before)?before:[]).reduce((sum,x)=>sum+(Number(x)||0),0)-(Array.isArray(after)?after:[]).reduce((sum,x)=>sum+(Number(x)||0),0))}
function tacticMeta(id){return TACTIC_MAP[id]||TACTICS[0]}
function reportHtml(report){if(!report)return '<p class="muted">Nie znaleziono raportu.</p>';
 const heroes=Array.isArray(report.heroes)?report.heroes:[],enemies=Array.isArray(report.enemies)?report.enemies:[];
 const maxHero=Array.isArray(report.max_hero_hp)?report.max_hero_hp:heroes.map(h=>h.hp||1),maxEnemy=Array.isArray(report.max_enemy_hp)?report.max_enemy_hp:enemies.map(h=>h.hp||1);
 const hpHero=Array.isArray(report.hero_hp)?report.hero_hp:maxHero,hpEnemyArr=Array.isArray(report.enemy_hp)?report.enemy_hp:maxEnemy;
 const rounds=Array.isArray(report.rounds)?report.rounds:[];
 const outcome=report.victory?'ZWYCIĘSTWO':report.outcome==='draw'?'REMIS':'PORAŻKA';
 const outcomeReason=report.victory?'Drużyna pokonała bossa i jego obstawę.' : report.outcome==='draw' ? 'Po limicie rund żadna ze stron nie została wybita.' : (report.reason||'Ekspedycja została odparta.');
 const tactic=tacticMeta(report.tactic||'focus_weakest');
 const support=report.faction_support||{};
 const passive=report.faction_passive||{},bonus=report.faction_bonuses||{};
 const supportLabel=Object.entries({rations:'🥫 Prowiant',medical:'✚ Lecznica',technical:'🔧 Warsztat'}).filter(([key])=>Number(support[key])>0).map(([key,name])=>`${name} (poziom ${Number(support[key])})`).join(' · ');
 const passiveLabel=`+${Number(bonus.hp_percent_passive||0)}% PŻ · +${Number(bonus.armor_passive||0)} pancerza · +${Number(bonus.damage_percent_passive||0)}% obrażeń`;
 const paidLabel=`+${Number(bonus.hp_percent_prepared||0)}% PŻ · +${Number(bonus.armor_prepared||0)} pancerza · +${Number(bonus.damage_percent_prepared||0)}% obrażeń`;

 return `<div class="arena-report ashen-online-arena-report expedition-report">
 <div class="arena-report-header"><div><span class="tag">RAPORT · EKSPEDYCJA FRAKCYJNA</span><h3>${esc(outcome)} — ${esc(report.boss_name||'Boss')}</h3><p class="small muted">${esc(report.location||'Nieznana lokacja')} · ${esc(report.at||'')} · ${rounds.length} ${rounds.length===1?'runda':'rund'} · członków drużyny: ${heroes.length}</p><p class="small muted">Taktyka drużyny: <strong>${esc(report.tactic_label||tactic.label)}</strong></p>${report.faction_passive?`<p class="small good">Stałe bonusy frakcji: ${esc(passiveLabel)}</p>`:''}${supportLabel?`<p class="small good">Wsparcie organizatora: ${esc(supportLabel)} — ${esc(paidLabel)}</p>`:''}</div></div>
 <section class="arena-combat-profile"><div class="arena-battle-section-title"><span>01 / PORÓWNANIE</span><h4>Skład ekspedycji i przeciwnicy</h4></div>
 <div class="expedition-versus-grid"><div><h4>Drużyna frakcji</h4><div class="expedition-team-grid">${heroes.map((h,i)=>`<article class="arena-fighter-portrait is-hero">${portrait(h)}<strong>${esc(h.name)}</strong><small>${esc(h.role_label||'Członek wyprawy')} · Poziom ${Number(h.level)||1}</small><small>PŻ ${hpLabel(h.hp,maxHero[i])} · Pancerz ${Math.round(Number(h.armor)||0)}</small></article>`).join('')}</div></div><div><h4>Przeciwnicy</h4><div class="expedition-team-grid is-enemies">${enemies.map((e,i)=>`<article class="arena-fighter-portrait is-enemy">${enemyPortrait(e,i,report.boss_id)}<strong>${esc(e.name)}</strong><small>${esc(e.role||'Wróg')}</small><small>PŻ ${hpLabel(e.hp,maxEnemy[i])} · Pancerz ${Math.round(Number(e.armor)||0)}</small></article>`).join('')}</div></div></div>
 ${report.hero_totals?.length?`<div class="expedition-summary-tables"><div class="arena-combat-table-wrap"><table class="arena-combat-table"><thead><tr><th colspan="6">Drużyna — podsumowanie</th></tr><tr><th>#</th><th>Ataki</th><th>Traf.</th><th>Pudła</th><th>Kryt.</th><th>Obraż.</th></tr></thead><tbody>${totalsRows(report.hero_totals)}</tbody></table></div><div class="arena-combat-table-wrap"><table class="arena-combat-table"><thead><tr><th colspan="6">Przeciwnicy — podsumowanie</th></tr><tr><th>#</th><th>Ataki</th><th>Traf.</th><th>Pudła</th><th>Kryt.</th><th>Obraż.</th></tr></thead><tbody>${totalsRows(report.enemy_totals)}</tbody></table></div></div>`:''}
 </section>
 <section class="arena-round-review"><div class="arena-battle-section-title"><span>02 / RUNDY</span><h4>Przebieg walki</h4></div><div class="arena-rounds-list">${rounds.map(r=>`<details class="arena-round-card"><summary><span class="arena-round-number">RUNDA ${r.number}</span><span class="arena-round-damage">Drużyna zadała ${hpLost(r.enemy_hp_before,r.enemy_hp)} · Otrzymała ${hpLost(r.hero_hp_before,r.hero_hp)}</span><span class="arena-round-expand">Szczegóły</span></summary><div class="arena-round-card-body"><div class="expedition-round-health"><div><h5>Drużyna</h5>${heroes.map((h,i)=>`<div class="expedition-round-bar"><span>${esc(h.name)}</span><strong>${hpLabel((r.hero_hp||[])[i],maxHero[i])}</strong>${hp((r.hero_hp||[])[i],maxHero[i])}</div>`).join('')}</div><div><h5>Przeciwnicy</h5>${enemies.map((en,i)=>`<div class="expedition-round-bar"><span>${esc(en.name)}</span><strong>${hpLabel((r.enemy_hp||[])[i],maxEnemy[i])}</strong>${hpEnemy((r.enemy_hp||[])[i],maxEnemy[i])}</div>`).join('')}</div></div><div class="arena-round-events">${(r.events||[]).map(line=>`<p class="${eventTeam(line,heroes,enemies)}">${esc(line)}</p>`).join('')||'<p>Brak zapisanych zdarzeń.</p>'}</div></div></details>`).join('')||'<p class="muted">Brak zapisanych rund.</p>'}</div></section>
 <section class="arena-battle-finale"><div class="arena-battle-section-title"><span>03 / WYNIK</span><h4>Podsumowanie ekspedycji</h4></div><div class="arena-outcome-reason ${report.victory?'':'is-draw'}"><strong>${esc(outcome)}</strong><p>${esc(outcomeReason)}</p><div class="arena-final-hp"><div><span>Drużyna · PŻ po walce</span><strong>${(hpHero||[]).reduce((a,b)=>a+(Number(b)||0),0)} / ${(maxHero||[]).reduce((a,b)=>a+(Number(b)||0),0)}</strong>${hp((hpHero||[]).reduce((a,b)=>a+(Number(b)||0),0),(maxHero||[]).reduce((a,b)=>a+(Number(b)||0),1))}</div><div><span>Przeciwnicy · PŻ po walce</span><strong>${(hpEnemyArr||[]).reduce((a,b)=>a+(Number(b)||0),0)} / ${(maxEnemy||[]).reduce((a,b)=>a+(Number(b)||0),0)}</strong>${hpEnemy((hpEnemyArr||[]).reduce((a,b)=>a+(Number(b)||0),0),(maxEnemy||[]).reduce((a,b)=>a+(Number(b)||0),1))}</div></div></div></section>
 <div class="arena-report-reward"><strong>ASHEN v0.3.6.2:</strong> po zwycięstwie indywidualne nagrody czekają w panelu „Moje nagrody z ekspedycji”. Każdy uczestnik losuje własny łup.</div></div>`;
}
const RARITY_NAMES=['Zwykły','Ulepszony','Rzadki','Epicki','Legendarny'];
const BOSS_BADGE_NAMES={1:'Pogromca Złomowiska',2:'Łowca Kanałowego Pożeracza',3:'Zwycięzca Trzech Braci Rdzy'};
const BOSS_BADGE_IMAGES={1:'boss-01-scrapyard.webp',2:'boss-02-sewer.webp',3:'boss-03-rust-brothers.webp'};
const UNIQUE_LOOT=new Set(['boss1_cleaver','boss1_hook','boss1_plate','boss2_fang','boss2_hide','boss2_eye','boss3_nailgun','boss3_plate','boss3_rifle']);
function badgeHtml(b){const id=Number(b.boss_id);return `<div class="ashen-boss-badge"><span class="ashen-boss-badge-icon">${BOSS_BADGE_IMAGES[id]?`<img src="./assets/badges/${BOSS_BADGE_IMAGES[id]}" alt="Odznaka bossa" loading="lazy">`:'🏅'}</span><div><strong>${esc(BOSS_BADGE_NAMES[id]||b.boss_name||'Pogromca bossa')}</strong><small>${esc(b.boss_name||'Boss')} · ${fmt(b.earned_at)}</small></div></div>`}
function badgesHtml(){return `<div class="panel expedition-panel ashen-boss-badges-panel"><div class="expedition-history-head"><h3>🏅 Odznaki pogromcy</h3><span class="tag">${badges.length} zdobyte</span></div><p class="small muted">Odznakę otrzymuje wyłącznie organizator za pierwszą wygraną ekspedycję przeciw danemu bossowi. Uczestnicy otrzymują normalne nagrody i łupy. Odznaka jest widoczna w profilu.</p><div class="ashen-boss-badge-grid">${badges.map(badgeHtml).join('')||'<p class="small muted">Nie masz jeszcze odznak. Pokonaj pierwszego bossa!</p>'}</div></div>`}

function rewardSummary(r){return `+${Number(r.xp)||0} EXP · +${Number(r.credits)||0} kredytów · +${Number(r.scrap)||0} złomu${r.item_id?` · ${UNIQUE_LOOT.has(r.item_id)?'✦ UNIKAT: ':''}${esc(r.item_name||r.item_id)} (${esc(RARITY_NAMES[r.item_rarity]||'Przedmiot')})`:''}`}
function rewardsHtml(){
 const pending=rewards.filter(r=>!r.claimed_at),claimed=rewards.filter(r=>r.claimed_at).slice(0,5);
 return `<div class="panel expedition-panel expedition-rewards-panel"><div class="expedition-history-head"><h3>🎁 Moje nagrody z ekspedycji</h3><span class="tag">Do odbioru: ${pending.length}</span></div>
 <p class="small muted">Każdy członek zwycięskiej drużyny otrzymuje własne, wylosowane na serwerze nagrody. Odbiór dodaje zasoby do aktualnie przypisanej postaci i przedmiot do ekwipunku.</p>
 ${pending.length?pending.map(r=>`<div class="expedition-reward-row"><div><strong>${esc(r.boss_name)}</strong>${r.first_clear?'<span class="expedition-first-clear">Pierwsze zwycięstwo · premia +50%</span>':''}<p class="small">${rewardSummary(r)}</p></div><button class="primary" data-expedition-reward-claim="${r.id}" ${busy?'disabled':''}>Odbierz nagrodę</button></div>`).join(''):'<p class="small muted">Nie masz nagród oczekujących na odbiór. Pokonaj bossa ze swoim klanem!</p>'}
 ${claimed.length?`<details class="expedition-reward-history"><summary>Ostatnio odebrane nagrody</summary>${claimed.map(r=>`<p class="small muted">✓ ${esc(r.boss_name)} · ${rewardSummary(r)}</p>`).join('')}</details>`:''}
 </div>`;
}
function dialog(){if(!openedReportId)return '';return `<div class="arena-report-overlay" data-expedition-overlay="1"><div class="arena-report-dialog" role="dialog" aria-modal="true" aria-label="Raport ekspedycji"><div class="arena-report-dialog-toolbar"><span>☠ RAPORT EKSPEDYCJI KLANOWEJ</span><button type="button" data-expedition-close-report="1">✕ Wróć</button></div><div class="arena-report-dialog-scroll">${reportLoading?'<p class="muted">Pobieranie raportu…</p>':reportHtml(openedReport)}</div></div></div>`}
function tacticsHtml(expedition,isOrganizer){const current=tacticMeta(expedition?.tactic||'focus_weakest');return `<div class="expedition-tactics"><div class="expedition-tactics-head"><div><h4>Taktyka wyprawy</h4><p class="small muted">Obecnie: <strong>${esc(expedition?.tactic_label||current.label)}</strong></p></div></div><div class="expedition-tactics-grid">${TACTICS.map(t=>`<button type="button" class="expedition-tactic-btn ${current.id===t.id?'is-active':''}" data-expedition-tactic="${expedition.id}" data-value="${t.id}" ${!isOrganizer||busy?'disabled':''}><strong>${esc(t.label)}</strong><small>${esc(t.desc)}</small></button>`).join('')}</div><p class="small muted">Taktyka wpływa na wybór celów przez drużynę po rozpoczęciu walki. Możesz ją zmienić przed kliknięciem „Rozpocznij walkę z bossem”.</p></div>`}
function eventActions(ex,role,members){
 const organizer=ex.created_by===user(),accepted=(ex.participants||[]).some(p=>p.user_id===user());
 const applications=ex.applications||[],myApplication=applications.find(x=>x.user_id===user());
 const count=(ex.participants||[]).length,levelSum=Number(ex.level_sum)||0,cap=Number(ex.max_levels)||20;
 const pending=applications.filter(a=>a.kind==='application'),invited=applications.filter(a=>a.kind==='invitation');
 let html=`<div class="expedition-admission"><div class="expedition-admission-heading"><h4>Rekrutacja do składu</h4><span class="tag">Poziomy: ${levelSum} / ${cap}</span></div>`;
 if(organizer){
  html+=`<p class="small muted">Ty decydujesz o składzie tej ekspedycji. Możesz zatwierdzić zgłoszenia lub wysłać imienne zaproszenia.</p>`;
  const excluded=new Set([...(ex.participants||[]).map(p=>p.user_id),...applications.map(a=>a.user_id)]);
  const available=members.filter(m=>m.user_id!==user()&&!excluded.has(m.user_id));
  html+=`<div class="expedition-recruit-list"><h5>Oczekujące kandydatury</h5>${pending.length?pending.map(a=>`<div class="clan-member"><div><strong>${esc(a.name)}</strong><p class="small muted">Poziom ${Number(a.level)||1} · Chce dołączyć</p></div><div class="actions"><button class="primary" data-expedition-decide="${ex.id}" data-user="${esc(a.user_id)}" data-action="accept" ${busy?'disabled':''}>Przyjmij</button><button data-expedition-decide="${ex.id}" data-user="${esc(a.user_id)}" data-action="reject" ${busy?'disabled':''}>Odrzuć</button></div></div>`).join(''):'<p class="small muted">Brak zgłoszeń.</p>'}</div>`;
  html+=`<div class="expedition-invite"><strong>Zaproś członków klanu</strong><p class="small muted">Zaznacz kwadraciki przy wybranych graczach. Zaproszeni sami zdecydują, czy dołączyć.</p><div class="expedition-invite-checklist">${available.map(m=>`<label class="expedition-invite-choice"><input type="checkbox" data-expedition-invite-check="${ex.id}" value="${esc(m.user_id)}" ${busy?'disabled':''}><span><strong>${esc(m.name)}</strong><small> · poziom ${Number(m.level)||1}</small></span></label>`).join('')||'<p class="small muted">Nie ma graczy do zaproszenia.</p>'}</div><button data-expedition-invite-many="${ex.id}" ${!available.length||busy?'disabled':''}>Wyślij zaznaczone zaproszenia</button></div>`;
  if(invited.length)html+=`<p class="small muted">Oczekujące zaproszenia: ${invited.map(a=>`${esc(a.name)} (poziom ${Number(a.level)||1})`).join(', ')}</p>`;
 }else if(accepted){
   html+=`<p class="small muted">Jesteś zatwierdzonym uczestnikiem. Możesz opuścić ekspedycję przed rozpoczęciem.</p><button data-expedition-withdraw="${ex.id}" ${busy?'disabled':''}>Opuść skład</button>`;
 }else if(myApplication){
   if(myApplication.kind==='invitation'){
    html+=`<div class="notice">Organizator zaprasza Cię na tę wyprawę.</div><div class="actions"><button class="primary" data-expedition-decide="${ex.id}" data-user="${esc(user())}" data-action="accept" ${busy?'disabled':''}>Przyjmij zaproszenie</button><button data-expedition-decide="${ex.id}" data-user="${esc(user())}" data-action="reject" ${busy?'disabled':''}>Odrzuć</button></div>`;
   }else{
    html+=`<p class="small muted">Twoja kandydatura oczekuje na decyzję organizatora.</p><button data-expedition-decide="${ex.id}" data-user="${esc(user())}" data-action="withdraw" ${busy?'disabled':''}>Wycofaj zgłoszenie</button>`;
   }
 }else{
   html+=`<p class="small muted">Wyślij kandydaturę i poczekaj na akceptację organizatora.</p><button class="primary" data-expedition-apply="${ex.id}" ${busy||count>=Number(ex.boss?.max_players||5)?'disabled':''}>Zgłoś kandydaturę</button>`;
 }
 return html+'</div>';
}
function expeditionBlock(ex,role,members){
 const boss=ex.boss||DEFAULT_BOSSES.find(x=>Number(x.id)===Number(ex.boss_id));
 const pic=boss?bossImage(bossCardPortraitFile(boss,boss.id),boss.name,'expedition-active-art'):'';
 const isOrganizer=ex.created_by===user();
 const count=(ex.participants||[]).length,minimum=Number(boss?.min_players)||2;
 const prepared=(baseState?.preparations||[]).filter(x=>Number(x.expedition_id)===Number(ex.id));
 const preparedText=prepared.map(x=>`${SUPPORT_OPTIONS.find(o=>o.id===x.support)?.name||x.support} (poz. ${Number(x.level)})`).join(' · ');
 const passiveLevels=baseState?.levels||{};
 const passiveInfo=`Stałe premie bazy: +${2*Number(passiveLevels.kitchen||0)}% PŻ · +${Number(passiveLevels.clinic||0)} pancerza · +${Number(passiveLevels.workshop||0)}% obrażeń`;
 const deadline=ex.starts_at?Date.parse(ex.starts_at):0;const remain=Math.max(0,Math.ceil((deadline-Date.now())/60000));const countdown=deadline?`${Math.floor(remain/60)} godz. ${remain%60} min`:'—';
 return `<div class="panel expedition-panel active-expedition"><div class="expedition-active-layout">${pic}<div class="expedition-active-main"><div class="expedition-active-top"><div><span class="tag">AKTYWNA EKSPEDYCJA #${ex.id}</span><h3>${esc(boss?.name||'Boss')}</h3><p class="small muted">${esc(boss?.location||'')} · Organizator: ${esc(ex.created_by_name||'—')} · ${fmt(ex.created_at)}</p></div><div class="expedition-active-pill">${count} / ${Number(boss?.max_players)||5}</div></div>
 <div class="expedition-timer"><strong>Automatyczny start:</strong> ${fmt(ex.starts_at)} · Pozostało około ${countdown}. ${ex.early_ready?'Zbiórka skrócona — oczekiwanie na uruchomienie przez serwer.':'Nie musisz być zalogowany w chwili rozpoczęcia.'}</div>
 <p class="small good">${esc(passiveInfo)}</p>${preparedText?`<p class="small good">Wsparcie opłacone przez organizatora: ${esc(preparedText)}</p>`:''}
 <p class="small muted"><strong>Limit sumy poziomów:</strong> ${Number(ex.level_sum)||0} / ${Number(ex.max_levels)||20}. Minimum ${minimum} uczestników.</p>
 <div class="expedition-members">${(ex.participants||[]).map(p=>`<div class="clan-member"><div><strong>${esc(p.name)}</strong><p class="small muted">Poziom ${Number(p.level)||1} ${p.user_id===user()?'· Ty':''} ${p.user_id===ex.created_by?'· Organizator':''}</p></div><span class="tag">Przyjęty</span></div>`).join('')}</div>
 ${eventActions(ex,role,members)}${(boss?.enemies?.length||0)>1?tacticsHtml(ex,isOrganizer):'<p class="small muted">Pojedynczy przeciwnik — taktyka wyboru celu nie jest potrzebna.</p>'}<div class="actions">${isOrganizer?`<button class="primary" data-expedition-finish="${ex.id}" ${busy||count<minimum||ex.early_ready?'disabled':''}>⚔ Zakończ zbiórkę wcześniej</button><button data-expedition-cancel="${ex.id}" ${busy?'disabled':''}>Anuluj wyprawę</button>`:''}</div></div></div></div>`;
}
function html(){ensure();if(!active())return `<section class="section"><h2>☠ Ekspedycje</h2><div class="notice">Zaloguj się w ☁ Konto online, aby brać udział w ekspedycjach.</div></section>`;
 const c=state?.clan,role=state?.my_role,members=state?.members||[],bosses=state?.bosses||DEFAULT_BOSSES,activeExps=state?.active_expeditions||[],reports=state?.reports||[],progress=state?.progress||{highest_unlocked:3,boss_wins:[]},supplies=state?.supplies||{balance:0,max:12};
 const header=`<section class="section expedition-page"><div class="expedition-header"><div><span class="tag">ASHEN v0.4.3.2 · EKSPEDYCJE FRAKCYJNE</span><h2>☠ Bossowie Pustkowi</h2><p class="small muted">Organizuj czasowe wyprawy i wybieraj prywatne przygotowanie, zaznaczaj zapraszanych członków frakcji i zatwierdzaj zgłoszenia.</p></div><button data-expedition-refresh="1" ${loading||busy?'disabled':''}>↻ Odśwież</button></div>${error?`<div class="notice">⚠ ${esc(error)}</div>`:''}${info?`<div class="notice">✓ ${esc(info)}</div>`:''}${loading?'<p class="muted">Wczytywanie ekspedycji…</p>':''}`;
 if(!state)return header+(!loading?'<p class="muted">Brak danych. Spróbuj odświeżyć.</p>':'')+'</section>';
 if(!c)return header+'<div class="notice">Najpierw dołącz do frakcji w zakładce Frakcje.</div></section>'+dialog();
 const openCount=activeExps.length;
 const hasOrganized=activeExps.some(ex=>ex.created_by===user());
 const isParticipating=activeExps.some(ex=>(ex.participants||[]).some(p=>p.user_id===user()));
 const activeHtml=openCount?activeExps.map(ex=>expeditionBlock(ex,role,members)).join(''):'<div class="panel expedition-panel"><h3>Brak aktywnych wypraw</h3><p class="small muted">Każdy członek frakcji może zorganizować ekspedycję.</p></div>';
 const supportChoices=(bossId)=>`<div class="expedition-personal-support"><div class="small muted"><strong>Przygotowanie przez organizatora</strong> (opcjonalnie):</div>${SUPPORT_OPTIONS.map(o=>{const lvl=Number(baseState?.levels?.[o.building]||0);return `<label class="expedition-support-choice"><input type="checkbox" data-expedition-support="${bossId}" value="${o.id}" ${lvl<1?'disabled':''}><span><strong>${o.name}</strong><small>${o.text} · ${costList(o.cost)}${lvl<1?' · wymaga budynku poz. 1':''}</small></span></label>`}).join('')}</div>`;
 const bossCards=`<div class="expedition-boss-grid">${bosses.map(b=>{const unlocked=Number(b.id)<=Number(progress.highest_unlocked||3);const defeated=Array.isArray(progress.boss_wins)&&progress.boss_wins.map(Number).includes(Number(b.id));const cost={1:2,2:3,3:4}[b.id]||0,waitTime={1:"1 godz.",2:"1 godz. 30 min",3:"2 godz."}[b.id]||"do 8 godz.",levelCap={1:20,2:35,3:50}[b.id]||0;const canCreate=Boolean(c)&&unlocked&&!busy&&openCount<2&&!hasOrganized&&!isParticipating;
 return `<article class="expedition-boss-card ${unlocked?'':'is-locked'}"><div class="expedition-boss-top"><span class="tag">BOSS ${String(b.id).padStart(2,'0')}</span><span class="expedition-difficulty">${esc(b.difficulty||'—')}</span></div>${bossImage(bossCardPortraitFile(b,b.id),b.name)}<h3>${esc(b.name)}</h3><p class="small muted">${esc(b.kind||'Boss')} · ${esc(b.location||'')}</p><p>${esc(b.summary||'')}</p><div class="expedition-boss-meta"><span>2–5 graczy · maks. suma poziomów ${levelCap}</span><span>${defeated?'✓ Pokonany':'• Niepokonany'}</span></div><p class="small muted"><strong>Utworzenie bez kosztu · wsparcie opcjonalne, prywatne</strong> · Czas zbiórki: <strong>${waitTime}</strong></p>${supportChoices(b.id)}<div class="actions"><button class="primary" data-expedition-create="${b.id}" ${canCreate?'':'disabled'}>Utwórz wyprawę</button></div></article>`}).join('')}</div>`;
 const reportsBox=`<div class="panel expedition-panel"><div class="expedition-history-head"><h3>Raporty ekspedycji</h3><span class="tag">Pokonane bossy: ${Array.isArray(progress.boss_wins)?progress.boss_wins.length:0}</span></div>${reports.length?`<div class="mail-list">${reports.map(r=>`<button class="mail-row" data-expedition-open-report="${r.id}"><strong>${r.victory?'✓':'✕'} ${esc(r.boss_name||'Boss')}</strong><span>${r.victory?'Zwycięstwo':'Porażka'} · ${esc(r.location||'')}</span><small>${fmt(r.created_at)}</small></button>`).join('')}</div>`:'<p class="small muted">Brak rozegranych wypraw.</p>'}<p class="small muted">Walka rozegra się po terminie zbiórki także wtedy, gdy nikt nie ma otwartej gry — wymaga uruchomienia serwerowego harmonogramu SQL 010. Nagrody można odebrać w panelu „Moje nagrody z ekspedycji”.</p></div>`;
 return header+`<div class="panel expedition-panel"><div class="expedition-clan-strip"><div><strong>[${esc(c.tag)}] ${esc(c.name)}</strong><p class="small muted">Twoja rola: ${roleName(role)} · Członków: ${members.length}</p></div><div class="expedition-progress-pill">TEST · założenie bez kosztu; wsparcie z prywatnych zasobów</div><div class="expedition-progress-pill">Aktywne: ${openCount} / 2</div></div></div>${badgesHtml()}${rewardsHtml()}${activeHtml}<div class="panel expedition-panel"><h3>Wybierz bossa</h3><p class="small muted">W trybie testowym samo utworzenie wyprawy nie zużywa zapasów. Wybrane wsparcie jest opłacane prywatnie przez organizatora. Organizator wybiera skład, a przyjęci gracze nie mogą brać udziału w innej aktywnej ekspedycji.</p>${bossCards}</div>${reportsBox}</section>${dialog()}`;
}
async function mutate(fn){if(busy||loading)return;busy=true;error='';info='';redraw();try{info=await fn()||'Zapisano zmiany.';const id=identity(),n=++requests;const [nextState,nextRewards,nextBadges,nextBase]=await Promise.all([rpc('ashen_expedition_state'),rpc('ashen_expedition_my_rewards'),rpc('ashen_player_boss_badges',{p_user_id:user()}),rpc('ashen_faction_base_state').catch(()=>null)]);if(id===identity()&&n===requests){state=nextState;baseState=nextBase;rewards=Array.isArray(nextRewards)?nextRewards:[];badges=Array.isArray(nextBadges)?nextBadges:[]}}catch(e){setError(e)}finally{busy=false;redraw()}}
async function claimReward(id){
 if(busy||loading)return;
 const reward=rewards.find(r=>Number(r.id)===id&&!r.claimed_at);
 if(!reward)return;
 const expectedIdentity=identity();
 if(cloud()?.getBoundSlot()!==cloud()?.currentSlot()){
  setError('Przypisz bieżący lokalny profil do konta online przed odbiorem nagrody. Otwórz ☁ Konto online i wyślij postać.');redraw();return;
 }
 const apply=window.ASHEN_APPLY_EXPEDITION_REWARD;
 if(typeof apply!=='function'){setError('Moduł ekwipunku nie jest gotowy. Odśwież grę.');redraw();return;}
 busy=true;error='';info='';redraw();
 try{
  // Zawsze odczytaj nagrodę z serwera przed zastosowaniem, nie ufaj wartościom z HTML.
  const fresh=await rpc('ashen_expedition_my_rewards');
  const row=(fresh||[]).find(r=>Number(r.id)===id&&!r.claimed_at);
  if(!row)throw Error('Nagroda została już odebrana lub nie należy do tego konta.');
  if(identity()!==expectedIdentity || cloud()?.getBoundSlot()!==cloud()?.currentSlot())throw Error('Konto lub profil zmieniły się podczas odbioru. Spróbuj ponownie.');
  apply(row); // trwały, idempotentny zapis lokalny przed ACK
  const ok=await rpc('ashen_expedition_reward_ack',{p_id:id});
  if(!ok)throw Error('Nie udało się potwierdzić nagrody na serwerze. Ponów odbiór — nie zostanie naliczona drugi raz.');
  rewards=(await rpc('ashen_expedition_my_rewards'))||[];
  info='Nagroda trafiła do Twojej postaci. Sprawdź Ekwipunek!';
 }catch(e){setError(e)}finally{busy=false;redraw()}
}
document.addEventListener('click',e=>{if(e.target?.matches?.('[data-expedition-overlay]')){openedReportId=null;openedReport=null;redraw();return}const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-expedition-reward-claim')){void claimReward(Number(b.dataset.expeditionRewardClaim));return}
 if(b.hasAttribute('data-expedition-refresh')){void refresh();return}
 if(b.hasAttribute('data-expedition-open-report')){void loadReport(Number(b.dataset.expeditionOpenReport));return}
 if(b.hasAttribute('data-expedition-close-report')){openedReportId=null;openedReport=null;redraw();return}
 if(b.hasAttribute('data-expedition-create')){
  const bossId=Number(b.dataset.expeditionCreate),boss=(state?.bosses||DEFAULT_BOSSES).find(x=>Number(x.id)===bossId);
  const ids=[...document.querySelectorAll(`[data-expedition-support="${bossId}"]:checked`)].map(x=>x.value);
  const cost=supportCost(ids),account=identity();
  if(cloud()?.getBoundSlot()!==cloud()?.currentSlot()){setError('Powiąż bieżącą postać z kontem online przed założeniem ekspedycji.');redraw();return;}
  if(!hasFunds(cost)){setError('Za mało prywatnych surowców na wybrane wsparcie. Zmniejsz zakres przygotowania albo zsynchronizuj zapis.');redraw();return;}
  if(!confirm(`Utworzyć ekspedycję: ${boss?.name||'Boss'}? ${ids.length?`Prywatny koszt organizatora: ${costList(cost)}.`:'Bez dodatkowego wsparcia i bez kosztu.'} Jeśli anulujesz przed walką, otrzymasz zwrot.`))return;
  void mutate(async()=>{
   const result=await rpc('ashen_expedition_create_prepared',{p_boss:bossId,p_supports:ids});
   if(account!==identity()||cloud()?.getBoundSlot()!==cloud()?.currentSlot())throw Error('Ekspedycja powstała, ale zmieniło się aktywne konto. Pobierz zapis z chmury przed dalszą grą.');
   if(ids.length)window.ASHEN_FACTION_SETTLE_EXPEDITION?.(result.cost,-1);
   return `Utworzono ekspedycję #${result.expedition_id}. ${ids.length?'Wsparcie opłacone z prywatnych zasobów.':'Bez dodatkowego wsparcia.'}`;
  });return;
 }
 if(b.hasAttribute('data-expedition-apply')){void mutate(async()=>{await rpc('ashen_expedition_apply',{p_expedition:Number(b.dataset.expeditionApply)});return 'Kandydatura wysłana do organizatora.'});return}
 if(b.hasAttribute('data-expedition-invite-many')){const exp=Number(b.dataset.expeditionInviteMany);const ids=[...document.querySelectorAll(`[data-expedition-invite-check="${exp}"]:checked`)].map(x=>x.value);if(!ids.length){alert('Zaznacz co najmniej jednego gracza.');return}void mutate(async()=>{const count=await rpc('ashen_expedition_invite_many',{p_expedition:exp,p_users:ids});return `Wysłano ${count} zaproszeń.`});return}
 if(b.hasAttribute('data-expedition-decide')){const exp=Number(b.dataset.expeditionDecide),target=b.dataset.user,action=b.dataset.action;void mutate(async()=>{await rpc('ashen_expedition_decide',{p_expedition:exp,p_user:target,p_action:action});return ({accept:'Przyjęto do składu.',reject:'Odrzucono.',withdraw:'Wycofano zgłoszenie.'})[action]||'Zmieniono status.'});return}
 if(b.hasAttribute('data-expedition-withdraw')){if(!confirm('Opuścić skład tej ekspedycji?'))return;void mutate(async()=>{await rpc('ashen_expedition_withdraw',{p_expedition:Number(b.dataset.expeditionWithdraw)});return 'Opuszczono skład.'});return}
 if(b.hasAttribute('data-expedition-cancel')){const eid=Number(b.dataset.expeditionCancel);if(!confirm('Anulować ekspedycję? Prywatne wsparcie opłacone przez Ciebie zostanie zwrócone.'))return;
  void mutate(async()=>{
   const account=identity();const faction=await rpc('ashen_faction_base_state');
   const rows=(faction.preparations||[]).filter(x=>Number(x.expedition_id)===eid&&x.prepared_by===user()&&x.paid_privately===true);
   const refund=supportCost(rows.map(x=>x.support));
   await rpc('ashen_expedition_cancel',{p_expedition:eid});
   if(account!==identity()||cloud()?.getBoundSlot()!==cloud()?.currentSlot())throw Error('Anulowano na serwerze. Pobierz zapis z chmury, aby zobaczyć zwrot zasobów.');
   if(rows.length)window.ASHEN_FACTION_SETTLE_EXPEDITION?.(refund,1);
   return 'Anulowano ekspedycję. Prywatne zasoby zwrócone organizatorowi.';
  });return;
 }
 if(b.hasAttribute('data-expedition-tactic')){const tactic=b.dataset.value;if(!tactic)return;void mutate(async()=>{await rpc('ashen_expedition_set_tactic',{p_expedition:Number(b.dataset.expeditionTactic),p_tactic:tactic});return `Zmieniono taktykę wyprawy na: ${tacticMeta(tactic).label}.`});return}
 if(b.hasAttribute('data-expedition-finish')){if(!confirm('Zakończyć zbiórkę wcześniej? Serwer rozegra walkę automatycznie w najbliższym przebiegu harmonogramu.'))return;void mutate(async()=>{await rpc('ashen_expedition_finish_recruitment',{p_expedition:Number(b.dataset.expeditionFinish)});return 'Zbiórka skrócona. Walka wystartuje automatycznie na serwerze.'});return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openedReportId){openedReportId=null;openedReport=null;redraw()}});
// Aktualizacja liczników i raportów bez ręcznego odświeżania strony, kiedy użytkownik ogląda ekspedycje.
setInterval(()=>{if(active()&&!loading&&!busy&&!openedReportId&&document.querySelector('.expedition-page'))void refresh()},60000);
window.ASHEN_EXPEDITIONS={html,refresh,openReport:loadReport,isReportOpen:()=>Boolean(openedReportId)};
})();
