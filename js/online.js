/* ASHEN v0.2.6.1 online PvP + inbox (separate from existing local test battles).
 * No secret keys. Online match is settled in PostgreSQL via authenticated RPC.
 * This is a private testing build; uploaded equipment/stats are not anti-cheat validated.
 */
(()=>{'use strict';
let opponents=[],reports=[],mail=[],expeditionNotices=[],busy=false,error='',notice='',openedReport=null,openedReportSide='attack',reportContext='pvp',openedMail=null,mailFolder='inbox',loaded=false;
let timer=null,lastSynced='',syncing=false,dirty=false,observed='',syncMessage='',syncPaused=0;
let mailSelected=new Set(),replyDraft='',replyBusy=false;
let expeditionMailReport=null,expeditionMailLoading=false,expeditionMailError='';
let openedBattleId=null,shareBusy=false,shareFeedback='',shareTokenCache=new Map();
let pvpZLabFamily='reinforced',pvpZLabReport=null,pvpZLabOpen=false;
const cloud=()=>window.ASHEN_CLOUD;
const auth=()=>!!(cloud()?.getClient()&&cloud()?.getSession());
const bound=()=>auth()&&cloud()?.getBoundSlot()===cloud()?.currentSlot();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>new Date(v).toLocaleString('pl-PL',{timeZone:'Europe/Warsaw'});
const msg=e=>String(e?.message||e||'Błąd połączenia').slice(0,250);
function draw(){window.ASHEN_FORCE_RENDER?.()}
async function rpc(name,args={}){const c=cloud()?.getClient();if(!c||!auth())throw Error('Najpierw zaloguj się do Konta online.');const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
async function refresh(){if(!auth()){opponents=[];reports=[];mail=[];expeditionNotices=[];loaded=false;draw();return}
 if(busy)return;busy=true;error='';draw();try{
  const [a,b,c,d]=await Promise.all([rpc('ashen_online_list'),rpc('ashen_online_reports'),rpc('ashen_online_messages'),rpc('ashen_expedition_inbox')]);
  opponents=a||[];reports=b||[];mail=c||[];expeditionNotices=d||[];loaded=true;
  void window.ASHEN_EXPEDITIONS?.autoGrantRewards?.();
 }catch(e){error='Nie można wczytać PvP online: '+msg(e)+'. Sprawdź, czy uruchomiono 003_online_pvp.sql w projekcie ASHEN.';}finally{busy=false;draw()}}
function activeRaw(){const slot=cloud()?.currentSlot();if(!slot)return '';return localStorage.getItem(slot==='main'?'ashen-save-v010':'ashen-dev-slot-v021:'+slot)||''}
async function publish(){
 if(!bound()||syncing||syncPaused)return;
 const account=cloud().getSession().user.id,slot=cloud().currentSlot(),project=cloud().getProjectUrl(),current=activeRaw();
 if(!current||current===lastSynced)return;
 syncing=true;syncMessage='Zapisywanie w chmurze…';
 try{
  const save=JSON.parse(current);if(!save?.created)return;
  const snapshot=window.ASHEN_GET_ONLINE_SNAPSHOT?.();if(!snapshot)throw Error('Nie udało się przygotować statystyk postaci.');
  // Check identity before sending. Never mix a snapshot from one slot with another account.
  if(!bound()||cloud().currentSlot()!==slot||cloud().getSession()?.user?.id!==account||cloud().getProjectUrl()!==project)return;
  const c=cloud().getClient();
  const {error:e1}=await c.from('ashen_cloud_saves').upsert({user_id:account,save_data:save,character_name:String(save.name).slice(0,40),character_level:save.level},{onConflict:'user_id'});
  if(e1)throw e1;
  // A profile publication may finish after a new local change; we requeue the latest version.
  await rpc('ashen_publish_profile',{p_snapshot:snapshot});
  if(bound()&&cloud().currentSlot()===slot&&cloud().getSession()?.user?.id===account&&cloud().getProjectUrl()===project){
   lastSynced=current;syncMessage='Zapis zsynchronizowany';
   if(error.startsWith('Automatyczny zapis'))error='';
  }
 }catch(e){syncMessage='Błąd synchronizacji';error='Automatyczny zapis online: '+msg(e)}
 finally{
  syncing=false;
  const queued=dirty;dirty=false;
  if(bound()&&activeRaw()!==lastSynced&&(queued||syncMessage==='Błąd synchronizacji'))scheduleSync(syncMessage==='Błąd synchronizacji'?10000:1800);
  draw();
 }
}
async function flushSync(){
 if(!bound()||syncPaused)return false;
 const who=cloud().getSession()?.user?.id,slot=cloud().currentSlot();
 for(let i=0;i<4;i++){
  for(let j=0;syncing&&j<200;j++)await new Promise(r=>setTimeout(r,50));
  if(syncing||!bound()||cloud().getSession()?.user?.id!==who||cloud().currentSlot()!==slot)return false;
  if(activeRaw()===lastSynced)return true;
  await publish();
  if(activeRaw()===lastSynced&&bound())return true;
 }
 return false;
}
function scheduleSync(delay=1800){if(timer)clearTimeout(timer);if(syncPaused)return;timer=setTimeout(()=>{timer=null;void publish()},delay)}
async function pauseSync(){
 syncPaused++;
 if(timer){clearTimeout(timer);timer=null}
 // Wait for any in-flight upload before the server reads and debits the save.
 while(syncing)await new Promise(resolve=>setTimeout(resolve,50));
}
function resumeSync(){syncPaused=Math.max(0,syncPaused-1);if(!syncPaused&&bound())scheduleSync(200)}
function localChanged(){if(!bound())return;const raw=activeRaw();if(raw===observed)return;observed=raw;if(raw===lastSynced)return;dirty=true;scheduleSync()}
function published(){lastSynced='';observed='';syncMessage='Oczekuje na synchronizację';if(bound())localChanged();void refresh()}
function authChanged(){lastSynced='';observed='';if(timer){clearTimeout(timer);timer=null}dirty=false;syncMessage='';opponents=[];reports=[];mail=[];expeditionNotices=[];openedReport=null;openedBattleId=null;shareFeedback='';openedMail=null;mailSelected.clear();replyDraft='';loaded=false;void refresh()}
async function action(fn){if(busy)return;busy=true;error='';notice='';draw();try{await fn()}catch(e){error=msg(e)}finally{busy=false;draw()}}
function intro(){if(!auth())return '<p class="muted">Zaloguj się przez ☁ Konto online, aby korzystać z PvP między kontami.</p>';
 if(!bound())return '<p class="muted">W panelu ☁ Konto online wybierz postać, którą chcesz udostępnić innym graczom, i kliknij „Wyślij aktualną postać”. To przypisze ten lokalny profil do konta online. Innych testerów nie synchronizujemy automatycznie.</p>';
 return `<p class="small muted">Aktywna postać jest powiązana z tym kontem. Postępy publikują się automatycznie. Status: ${esc(syncMessage||'oczekuje na zmiany')}. Inni gracze mogą zaatakować Cię również podczas nieobecności.</p>`;
}
function portrait(profile){
 const origin=['scout','fighter','tech'].includes(profile?.origin)?profile.origin:'scout';
 const gender=profile?.gender==='female'?'f':'m';
 const file=`./assets/characters/${origin}-${gender}-full.png`;
 return `<img src="${file}" alt="Portret: ${esc(profile?.name||'Postać')}" loading="eager">`;
}
const num=v=>Number.isFinite(Number(v))?Number(v):0;
// Formatowanie danych raportu dotyczy wylacznie warstwy prezentacji.
// Unik i celnosc sa wartosciami statystyk, a nie bezposrednio prawdopodobienstwem %.
const reportNumber=(v,decimals=0)=>{
 if(v===null||v===undefined||v==='')return '—';
 const n=Number(v);
 if(!Number.isFinite(n))return '—';
 const rounded=Number(n.toFixed(decimals));
 return rounded.toLocaleString('pl-PL',{useGrouping:false,maximumFractionDigits:decimals});
};
function health(value,max,enemy=false){
 const hp=Math.max(0,num(value)),limit=Math.max(1,num(max));
 return `<div class="arena-health-track" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.round(limit)}" aria-valuenow="${Math.round(Math.min(hp,limit))}"><span class="${enemy?'is-enemy':'is-hero'}" style="width:${Math.max(0,Math.min(100,hp/limit*100))}%"></span></div>`;
}
function hpLabel(value,max){return `${Math.max(0,Math.round(num(value)))} / ${Math.round(num(max))}`}
function outcome(r){return r?.winner===0?'Zwycięstwo atakującego':r?.winner===1?'Zwycięstwo obrońcy':'Remis'}
function renderReport(r,side='attack',isPublic=false){
 if(!r)return '<p>Nie znaleziono raportu.</p>';
 // A report always stores [attacker, defender]; display order depends on the viewer.
 // In defense reports, defender is the player's own character and must be on the left.
 const reverse=side==='defense',order=reverse?[1,0]:[0,1];
 const raw=[r.attacker||{},r.defender||{}],fighters=order.map(i=>raw[i]);
 const names=fighters.map((x,i)=>x.name||(i===0?'Twoja postać':'Przeciwnik'));
 const maxRaw=Array.isArray(r.maxHp)?r.maxHp:[],hpRaw=Array.isArray(r.hp)?r.hp:[],totRaw=Array.isArray(r.totals)?r.totals:[];
 const max=order.map(i=>maxRaw[i]),hp=order.map(i=>hpRaw[i]),tot=order.map(i=>totRaw[i]);
 const rnd=Array.isArray(r.rounds)?r.rounds:[];
 const roles=reverse?['Obrońca','Atakujący']:['Atakujący','Obrońca'];
 const result=r.winner===null?'Remis':r.winner===order[0]?'Zwycięstwo':'Porażka';
 const rows=[['PŻ na początku',max[0],max[1]],['Pancerz',fighters[0].armor,fighters[1].armor],['Unik',fighters[0].dodge,fighters[1].dodge],['Celność',fighters[0].acc,fighters[1].acc],['Siła',fighters[0].attrs?.str,fighters[1].attrs?.str],['Zręczność',fighters[0].attrs?.dex,fighters[1].attrs?.dex],['Wytrzymałość',fighters[0].attrs?.end,fighters[1].attrs?.end],['Percepcja',fighters[0].attrs?.per,fighters[1].attrs?.per],['Inteligencja',fighters[0].attrs?.int,fighters[1].attrs?.int],['Charyzma',fighters[0].attrs?.cha,fighters[1].attrs?.cha]];
 const table=rows.map(([label,v1,v2],i)=>{
  const n1=Number(v1),n2=Number(v2),both=v1!==undefined&&v1!==null&&v2!==undefined&&v2!==null&&Number.isFinite(n1)&&Number.isFinite(n2);
  const cs=both?(n1===n2?['arena-stat-even','arena-stat-even']:n1>n2?['arena-stat-better','arena-stat-worse']:['arena-stat-worse','arena-stat-better']):['arena-stat-neutral','arena-stat-neutral'];
  const decimals=(label==='Unik'||label==='Celność')?1:0;
  return `<tr class="${i>=4?'arena-attribute-row':''} ${i===4?'arena-attribute-start':''}"><th scope="row">${esc(label)}</th><td class="${cs[0]}">${esc(reportNumber(v1,decimals))}</td><td class="${cs[1]}">${esc(reportNumber(v2,decimals))}</td></tr>`;
 }).join('');
 // Audyt rzeczywistych aktywacji: wyłącznie zdarzenia zapisane przez serwer.
 // Brak komunikatu nie jest dowodem braku aktywacji, szczególnie w starszych raportach.
 const zEvents=rnd.flatMap(x=>(Array.isArray(x.events)?x.events:[]).filter(e=>typeof e==='string'&&e.includes('Mistrzostwo Z')).map(e=>({round:x.number,text:e})));
 const zFamilyCounts=new Map();
 for(const ev of zEvents){
  const match=ev.text.match(/Mistrzostwo Z\s*[—–-]\s*([^:]+):/);
  const family=match?match[1].trim():'Inne';
  zFamilyCounts.set(family,(zFamilyCounts.get(family)||0)+1);
 }
 const zAudit=`<section class="panel section" style="margin-top:16px"><h4>🧪 Diagnostyka aktywacji Z — zapis serwera</h4><p class="small muted">Wynik pochodzi z komunikatów w tym konkretnym raporcie PvP, nie z lokalnej symulacji. Brak wpisu może oznaczać brak aktywacji lub starszy format raportu. Nie dowodzi poprawności wszystkich formuł serwera.</p><p><strong>Zarejestrowane aktywacje Z: ${zEvents.length}</strong>${zFamilyCounts.size?' · '+[...zFamilyCounts].map(([name,count])=>`${esc(name)}: ${count}`).join(' · '):''}</p>${zEvents.length?`<details><summary>Zobacz zdarzenia serwerowe</summary>${zEvents.map(e=>`<p class="small">Runda ${esc(e.round)}: ${esc(e.text)}</p>`).join('')}</details>`:'<p class="small muted">W tym raporcie nie ma komunikatów aktywacji Z.</p>'}</section>`;
 const arms=profile=>{
  const groups=new Map();
  for(const x of Array.isArray(profile?.attacks)?profile.attacks:[]){
   const name=String(x.weapon?.name||'Broń').replace(/\bNiszczycielska Karabin\b/g,'Niszczycielski Karabin'),hand=x.hand==='left'?'lewa':'prawa';
   const range=x.weapon?.min!==undefined?`, ${x.weapon.min}–${x.weapon.max} obr.`:'';
   const key=JSON.stringify([name,hand,range]);
   if(groups.has(key))groups.get(key).count++;else groups.set(key,{name,hand,range,count:1});
  }
  return [...groups.values()].map(x=>`${esc(x.name)} (${x.hand} ręka${esc(x.range)})${x.count>1?` · ${x.count} ataki/ rundę`:''}`).join(' · ')||'Brak danych o broni';
 };
 const rounds=rnd.map(x=>{
  const roundRaw=Array.isArray(x.hp)?x.hp:[],damageRaw=Array.isArray(x.damage)?x.damage:[];
  const roundHp=order.map(i=>roundRaw[i]);
  // Server stores damage inflicted ON [attacker, defender], not dealt BY them.
  const dealt=[damageRaw[order[1]],damageRaw[order[0]]];
  return `<details class="arena-round-card"><summary><span class="arena-round-number">RUNDA ${esc(x.number)}</span><span class="arena-round-damage">Zadane: ${esc(names[0])} ${num(dealt[0])} · ${esc(names[1])} ${num(dealt[1])} obr.</span><span class="arena-round-expand">Szczegóły</span></summary><div class="arena-round-card-body"><div class="arena-round-hp-grid"><div><span>${esc(names[0])} · PŻ</span><strong>${hpLabel(roundHp[0],max[0])}</strong>${health(roundHp[0],max[0])}</div><div><span>${esc(names[1])} · PŻ</span><strong>${hpLabel(roundHp[1],max[1])}</strong>${health(roundHp[1],max[1],true)}</div></div><div class="arena-round-events">${(x.events||[]).map(e=>`<p>${esc(e)}</p>`).join('')||'<p>Brak zapisanych zdarzeń.</p>'}</div></div></details>`;
 }).join('');
 // Older server reports may omit counters. Damage per round is stored as damage TAKEN,
 // so reverse the side when deriving damage DEALT. Unknown hit counters remain '—'.
 const roundDamage=order.map(i=>rnd.reduce((sum,row)=>sum+Math.max(0,num(Array.isArray(row.damage)?row.damage[1-i]:0)),0));
 const recordedDamage=order.map((i,j)=>{
  const d=tot[j]?.damage;
  return d===undefined||d===null||(num(d)===0&&roundDamage[j]>0)?roundDamage[j]:Math.max(0,num(d));
 });
 const counter=(t,k)=>t&&t[k]!==undefined&&t[k]!==null&&num(t[k])>=0?num(t[k]):null;
 const countsReliable=(t,i)=>counter(t,'attempts')!==null&&!(counter(t,'attempts')===0&&roundDamage[i]>0);
 const hitSummary=(t,i)=>countsReliable(t,i)&&counter(t,'hits')!==null?`${counter(t,'hits')} / ${counter(t,'attempts')}`:'—';
 const criticalSummary=(t,i)=>countsReliable(t,i)&&counter(t,'critical')!==null?counter(t,'critical'):'—';
 const accuracy=(t,i)=>countsReliable(t,i)&&num(t.attempts)>0&&counter(t,'hits')!==null?`${Math.round(num(t.hits)/num(t.attempts)*100)}%`:'—';
 const percent=t=>num(t?.attempts)?`${Math.round(num(t.hits)/num(t.attempts)*100)}%`:'—';
 const statrows=[['Zadane obrażenia',recordedDamage[0],recordedDamage[1]],['Trafienia / próby',hitSummary(tot[0],0),hitSummary(tot[1],1)],['Skuteczność',accuracy(tot[0],0),accuracy(tot[1],1)],['Trafienia krytyczne',criticalSummary(tot[0],0),criticalSummary(tot[1],1)]].map(([k,l,v])=>`<tr><th scope="row">${esc(k)}</th><td>${esc(l)}</td><td>${esc(v)}</td></tr>`).join('');
 return `<div class="arena-report ashen-online-arena-report"><div class="arena-report-header"><div><span class="tag">RAPORT · PvP ONLINE</span><h3>${esc(result)} — ${esc(names[0])} vs ${esc(names[1])}</h3><p class="small muted">${esc(r.at||'')} · ${rnd.length} ${rnd.length===1?'runda':'rund'} · walka rozliczona na serwerze</p></div></div>
 <section class="arena-combat-profile"><div class="arena-battle-section-title"><span>01 / PORÓWNANIE</span><h4>Statystyki przed walką</h4></div><div class="arena-fighter-portraits"><div class="arena-fighter-portrait is-hero">${portrait(fighters[0])}<strong>${esc(names[0])}</strong><small>${roles[0]} · Poziom ${esc(fighters[0].level??'—')}</small></div><span class="arena-fighter-versus">VS</span><div class="arena-fighter-portrait is-enemy">${portrait(fighters[1])}<strong>${esc(names[1])}</strong><small>${roles[1]} · Poziom ${esc(fighters[1].level??'—')}</small></div></div><div class="arena-combat-table-wrap"><table class="arena-combat-table arena-comparison-expanded"><thead><tr><th>Parametr</th><th>${esc(names[0])}${isPublic?' (Atakujący)':' (Ty)'}</th><th>${esc(names[1])}</th></tr></thead><tbody>${table}</tbody></table></div><p class="arena-profile-explainer">Kolory pokazują porównanie zapisanych parametrów z chwili walki. Obrażenia PvP nie powodują trwałej utraty PŻ ani wyposażenia.</p><div class="arena-profile-weapons"><strong>${isPublic?'Uzbrojenie atakującego:':'Twoje uzbrojenie:'}</strong> ${arms(fighters[0])}<div><strong>${isPublic?'Uzbrojenie obrońcy:':'Uzbrojenie przeciwnika:'}</strong> ${arms(fighters[1])}</div></div></section>
 <section class="arena-round-review"><div class="arena-battle-section-title"><span>02 / RUNDY</span><h4>Przebieg starcia</h4></div><div class="arena-rounds-list">${rounds||'<p class="muted">W tym raporcie nie zapisano przebiegu rund.</p>'}</div></section>
 ${zAudit}<section class="arena-battle-finale"><div class="arena-battle-section-title"><span>03 / WYNIK</span><h4>Podsumowanie starcia</h4></div><div class="arena-outcome-reason ${r.winner===null?'is-draw':''}"><strong>${esc(result)}</strong><p>${r.winner===null?'Po 10 rundach nie wyłoniono zwycięzcy.':`Wynik rozstrzygnął serwer. ${rnd.length} ${rnd.length===1?'runda':'rund'}.`}</p><div class="arena-final-hp"><div><span>${esc(names[0])} · PŻ po walce</span><strong>${hpLabel(hp[0],max[0])}</strong>${health(hp[0],max[0])}</div><div><span>${esc(names[1])} · PŻ po walce</span><strong>${hpLabel(hp[1],max[1])}</strong>${health(hp[1],max[1],true)}</div></div></div></section>
 <div class="ashen-damage-summary"><div class="ashen-damage-header"><strong>⚔ PODSUMOWANIE WALKI</strong><span>${rnd.length} ${rnd.length===1?'runda':'rund'}</span></div><div class="ashen-damage-table-wrap"><table class="ashen-damage-table"><thead><tr><th>Parametr</th><th>${isPublic?'Atakujący':'Twoja postać'}</th><th>${isPublic?'Obrońca':'Przeciwnik'}</th></tr></thead><tbody>${statrows}</tbody></table></div></div><div class="arena-report-reward"><strong>PvP online:</strong> bez nagród i bez utraty przedmiotów lub trwałego PŻ. <span class="small muted">Po wdrożeniu SQL 029 PvP obsługuje X/Y i sześć efektów Z (Przekonujący, Lekki, Wartowniczy, Wzmocniony, Pancerny, Techniczny); przed jego uruchomieniem obowiązuje dotychczasowy SQL 027. W starszych raportach obowiązują zasady z chwili walki.</span></div></div>`;
}
function reportDialog(){if(!openedReport)return '';
 const shareControls=openedBattleId?`<button type="button" data-online-share-report="1" ${shareBusy?'disabled':''}>${shareBusy?'Przygotowywanie…':'🔗 Kopiuj link'}</button><button type="button" data-online-native-share="1" ${shareBusy?'disabled':''}>↗ Udostępnij</button>`:'';
 return `<div class="arena-report-overlay data-online-report-overlay="1"><div class="arena-report-dialog" role="dialog" aria-modal="true" aria-label="Raport PvP online"><div class="arena-report-dialog-toolbar"><span>⚔ RAPORT STARCIA · PvP ONLINE</span>${shareControls}<button type="button" data-online-close-report="1">✕ Wróć</button></div>${shareFeedback?`<p class="small muted" style="padding:6px 16px" role="status">${esc(shareFeedback)}</p>`:''}<div class="arena-report-dialog-scroll">${renderReport(openedReport,openedReportSide)}</div></div></div>`;
}
async function shareCurrentReport(native=false){
 if(shareBusy||!openedBattleId)return;
 const bid=Number(openedBattleId);
 if(!Number.isSafeInteger(bid)||bid<1){shareFeedback='Nie udało się odczytać identyfikatora walki.';draw();return}
 shareBusy=true;shareFeedback='Tworzenie publicznego linku…';draw();
 try{
  let token=shareTokenCache.get(bid);
  if(!token){token=await rpc('ashen_online_share_report',{p_battle_id:bid});shareTokenCache.set(bid,token)}
  const url=new URL('report.html',window.location.href);url.search='';url.hash='';url.searchParams.set('report',String(token));
  if(native&&navigator.share){await navigator.share({title:'ASHEN — raport PvP',url:url.href});shareFeedback='Raport udostępniony.'}
  else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url.href);shareFeedback='Skopiowano link do raportu.'}
  else {shareFeedback='Skopiuj link z okna:';window.prompt('Link do raportu PvP:',url.href)}
 }catch(e){shareFeedback='Nie udało się udostępnić raportu: '+msg(e)+' (sprawdź SQL 026)'}
 finally{shareBusy=false;draw()}
}
function onlineSetDiagnostic(){
 if(!bound())return '';
 let snapshot;
 try{snapshot=window.ASHEN_GET_ONLINE_SNAPSHOT?.()}
 catch(e){return `<div class="notice">Nie można sprawdzić setów: ${esc(msg(e))}</div>`}
 if(!snapshot)return '<div class="notice">Brak migawki wyposażenia do synchronizacji.</div>';
 const active=Array.isArray(snapshot.activeSets)?snapshot.activeSets:[];
 const groups=active.reduce((t,s)=>{
  const level=num(s.level);if(level>=1)t.X++;if(level>=2)t.Y++;if(level>=3)t.Z++;
  return t;
 },{X:0,Y:0,Z:0});
 const rows=active.map(s=>`<li>${esc(s.id)} · ${esc(s.category)} · ${Math.max(0,Math.trunc(num(s.count)))} / 3 · jakość ${Math.max(0,Math.trunc(num(s.qualityPoints)))} · poziom ${esc(s.level)}</li>`).join('');
 const syncState=syncing?'Trwa synchronizacja':activeRaw()===lastSynced&&!!lastSynced?'Lokalny zapis przesłany':'Oczekuje na synchronizację';
 return `<details class="panel" style="margin:12px 0"><summary><strong>Diagnostyka setów online</strong> · ${active.length} aktywnych rodzin · ${esc(syncState)}</summary>
 <p class="small muted">Migawka lokalnej postaci: silnik ${esc(snapshot.setEngineVersion||'nieznany')}. Aktywne rodziny z założonych elementów (nie z planera).</p>
 ${rows?`<ul class="small">${rows}</ul>`:'<p class="small muted">Brak aktywnych pełnych setów.</p>'}
 <p class="small">Aktywne poziomy setów w migawce: X ${groups.X}, Y ${groups.Y}, Z ${groups.Z}.</p>
 <p class="small muted">To diagnostyka danych wysyłanych przez przeglądarkę, a nie potwierdzenie działania efektów na serwerze. PvP po wdrożeniu SQL 025 rozlicza część pasywnych premii X/Y. Po wdrożeniu SQL 029 PvP rozlicza sześć Mistrzostw Z. SQL 028 sprawdza spójność setów z zapisem chmurowym, lecz sam zapis może zostać zmodyfikowany przez klienta. Pozostałe Z i Ekspedycje jeszcze nie.</p></details>`;
}
// PvP Z lab v0.4.9.15: controlled, client-only mirror of isolated SQL 029 formulas.
// No network, no player snapshots, no storage, no effect on online attack counters.
function pvpZLabRun(family){
 const floor=Math.floor,round=Math.round;
 if(family==='reinforced'){
  const max=200,initial=84,incoming=[30,30,30],threshold=max*0.3,healing=round(max*0.1);
  const run=enabled=>{let hp=initial,used=false,log=[];for(let i=0;i<incoming.length;i++){
    const hit=Math.min(hp,incoming[i]);hp=Math.max(0,hp-hit);
    log.push(`Runda ${i+1}: otrzymano ${hit} obrażeń`);
    if(enabled&&!used&&hp>0&&hp<=threshold){used=true;hp=Math.min(max,hp+healing);log.push(`Mistrzostwo Z — Wzmocniony: drugi oddech (+${healing} PŻ)`)}
    if(!hp)break;
   }return {hp,used,log}};
  const a=run(false),b=run(true);
  return {title:'Wzmocniony — Drugi oddech',baseline:`PŻ bez Z po 1. trafieniu: ${initial-incoming[0]}`,boosted:`PŻ z Z po 1. trafieniu: ${initial-incoming[0]+healing}`,difference:`Leczenie: +${healing} PŻ; aktywacje: ${b.used?1:0}/1`,passed:b.used&&b.hp>a.hp,notes:'200 maks. PŻ, 84 PŻ na starcie, cios 30 PŻ. Test stosuje serwerowy próg ≤30% i zaokrąglenie ROUND.',logs:b.log};
 }
 if(family==='plated'){
  const max=200,initial=180,damage=[40,40,40];
  const run=enabled=>{let hp=initial,used=false,log=[],first=0;for(let i=0;i<damage.length;i++){
    let d=damage[i];if(enabled&&!used&&d>=max*.12){used=true;d=Math.max(1,floor(d*.65));log.push('Mistrzostwo Z — Pancerny: niezłomna płyta (-35% obrażeń)')}
    if(!i)first=d;hp=Math.max(0,hp-d);log.push(`Runda ${i+1}: otrzymano ${d} obrażeń`);
   }return {hp,used,first,log}};
  const a=run(false),b=run(true);
  return {title:'Pancerny — Niezłomna płyta',baseline:`Pierwszy cios bez Z: ${a.first} obrażeń`,boosted:`Pierwszy cios z Z: ${b.first} obrażeń`,difference:`Redukcja: ${a.first-b.first} obrażeń; aktywacje: ${b.used?1:0}/1`,passed:b.used&&b.first===26&&b.hp>a.hp,notes:'200 maks. PŻ, cios 40 PŻ ≥12% maksymalnego PŻ; redukcja FLOOR(40×0,65).',logs:b.log};
 }
 if(family==='technical'){
  const targetArmor=50,baseDamage=100,armorPen=10,attempts=[true,false,true,true],run=enabled=>{
    let procs=0,damage=0,log=[];
    for(let i=0;i<attempts.length;i++){
      if(!attempts[i]){log.push(`Atak ${i+1}: pudło — bez zużycia skanu`);continue}
      const scan=enabled&&procs<2?targetArmor*.08:0;
      if(scan){procs++;log.push(`Mistrzostwo Z — Techniczny: skan pancerza (${procs}/2)`)}
      const armor=Math.max(0,Math.min(.6,(targetArmor-armorPen-scan)/100));
      const hit=Math.max(1,Math.floor(baseDamage*(1-armor)));
      damage+=hit;log.push(`Atak ${i+1}: ${hit} obrażeń`);
    }return {procs,damage,log}};
  const a=run(false),b=run(true);
  return {title:'Techniczny — Skan pancerza',baseline:`Obrażenia bez Z: ${a.damage}`,boosted:`Obrażenia z Z: ${b.damage}`,difference:`Zysk: +${b.damage-a.damage}; aktywacje: ${b.procs}/2`,passed:b.procs===2&&b.damage>a.damage,notes:'Pancerz 50, penetracja bazowa 10. Drugi atak chybia; skan jest zużywany tylko przy trafieniu.',logs:b.log};
 }
 return null;
}
function pvpZLabHtml(){
 const cases=[['reinforced','Wzmocniony'],['plated','Pancerny'],['technical','Techniczny']];
 const r=pvpZLabReport;
 return `<details class="panel section" id="ashen-pvp-z-lab" ${pvpZLabOpen?'open':''}><summary style="cursor:pointer;font-weight:700">🧪 Laboratorium reguł PvP · SQL 029 (bez walk online)</summary>
 <p class="small muted">Izolowany test matematyki trzech zdolności Z według zasad SQL 029. <strong>To lokalne odwzorowanie wybranych reguł serwera, nie prawdziwa walka PvP ani test produkcyjnej funkcji.</strong> Nie wymaga przedmiotów, nie wysyła danych do Supabase, nie zużywa ataków i nie zapisuje wyniku.</p>
 <div class="actions" style="flex-wrap:wrap">${cases.map(([k,name])=>`<button type="button" data-pvp-zlab-select="${k}" class="${pvpZLabFamily===k?'primary':''}">${name}</button>`).join('')}</div>
 <div class="actions"><button class="primary" type="button" data-pvp-zlab-run="1">▶ Uruchom kontrolowaną próbę</button><button type="button" data-pvp-zlab-clear="1">Wyczyść wynik</button></div>
 ${r?`<div class="notice" role="status"><strong>${r.passed?'✓ Próba lokalna zaliczona':'⚠ Próba lokalna niezaliczona'} — ${esc(r.title)}</strong><p>${esc(r.baseline)}<br>${esc(r.boosted)}<br>${esc(r.difference)}</p><p class="small muted">${esc(r.notes)}</p><details><summary>Przebieg próby</summary>${r.logs.map(line=>`<p class="small">${esc(line)}</p>`).join('')}</details></div>`:''}
 </details>`;
}
// Audyt wyłącznie zapisanych wyników RPC ashen_online_reports.
// Brak zdarzeń Z nie oznacza niepowodzenia testu zdolności.
const SERVER_Z_FAMILIES=[
 ['Przekonujący','master_accessory_persuasive'],
 ['Lekki','master_armor_light'],
 ['Wartowniczy','master_armor_warden'],
 ['Wzmocniony','master_armor_reinforced'],
 ['Pancerny','master_armor_plated'],
 ['Techniczny','master_accessory_technical']
];
function serverZAuditRows(items){
 const current=items.filter(x=>x&&x.report&&x.report.setCombatMode==='XY-Z6-v0.4.9.14');
 const counts=new Map(SERVER_Z_FAMILIES.map(([name])=>[name,{events:0,battles:new Set(),limitIssues:0}]));
 let reportCount=0,observed=0,issues=[];
 for(const item of current){
  const r=item.report;
  const rounds=Array.isArray(r.rounds)?r.rounds:[];
  const perHero=new Map();
  reportCount++;
  for(const rd of rounds){
   for(const ev of (Array.isArray(rd.events)?rd.events:[])){
    if(typeof ev!=='string'||!ev.includes('Mistrzostwo Z'))continue;
    const match=ev.match(/^(.{1,40}?): Mistrzostwo Z\s*[—–-]\s*([^:]+):/);
    if(!match)continue;
    const combatant=match[1],family=match[2].trim();
    const key=family==='Wartownika'?'Wartowniczy':family==='Negocjatora'?'Przekonujący':family==='Technika'?'Techniczny':family;
    if(!counts.has(key))continue;
    const obj=counts.get(key);obj.events++;obj.battles.add(item.id);observed++;
    const grouping=key+'|'+combatant;perHero.set(grouping,(perHero.get(grouping)||0)+1);
   }
  }
  for(const [group,n] of perHero){
   const [family]=group.split('|');
   const cap=family==='Techniczny'?2:['Wzmocniony','Pancerny','Wartowniczy'].includes(family)?1:null;
   if(cap!==null&&n>cap){counts.get(family).limitIssues++;issues.push('Możliwe przekroczenie limitu '+family+' w jednym raporcie');}
  }
 }
 return {reportCount,observed,counts,issues};
}
function serverZAuditHtml(){
 const data=serverZAuditRows(reports);
 const rows=SERVER_Z_FAMILIES.map(([family])=>{const s=data.counts.get(family);return `<tr><th scope="row">${esc(family)}</th><td>${s.events}</td><td>${s.battles.size}</td><td>${s.limitIssues?'⚠ Sprawdź':'—'}</td></tr>`}).join('');
 return `<details class="panel section" id="ashen-pvp-server-z-audit" style="margin-top:14px"><summary style="cursor:pointer;font-weight:700">📋 Audyt rzeczywistych aktywacji Z · raporty Supabase</summary>
 <p class="small muted">Dane tylko z pobranych raportów oznaczonych silnikiem SQL 029 (XY-Z6-v0.4.9.14). Pokazują zaobserwowane zdarzenia, nie stanowią testu pełnej poprawności formuł. Raporty starszego silnika są pomijane. Lista raportów konta może być niepełna lub ograniczona.</p>
 <p><strong>Raporty SQL 029: ${data.reportCount}</strong> · zdarzenia Z: <strong>${data.observed}</strong></p>
 <div class="ashen-damage-table-wrap"><table class="ashen-damage-table"><thead><tr><th>Zdolność</th><th>Aktywacje</th><th>Raporty z aktywacją</th><th>Limit</th></tr></thead><tbody>${rows}</tbody></table></div>
 ${data.issues.length?`<p class="notice">⚠ ${esc(data.issues.join('; '))}. Sprawdź indywidualny raport i przebieg rund.</p>`:'<p class="small muted">Nie wykryto przekroczenia kontrolowanych limitów w znalezionych wpisach. Dla niektórych zdolności nie ma tu limitu liczbowego.</p>'}
 <p class="small muted">0 aktywacji nie oznacza, że zdolność jest niesprawna — może nie być założonego setu, warunek mógł nie wystąpić albo raportu nie ma na liście.</p></details>`;
}
function pvpHtml(){
 const entries=opponents.map(p=>`<article class="pvp-choice"><img src="${p.origin==='tech'?'./assets/characters/tech-'+(p.gender==='female'?'f':'m')+'.webp':p.origin==='fighter'?'./assets/characters/fighter-'+(p.gender==='female'?'f':'m')+'.webp':'./assets/characters/scout-'+(p.gender==='female'?'f':'m')+'.webp'}" onerror="this.style.display='none'" alt=""><div><h4>${esc(p.name)}</h4><p class="small muted">Poziom ${p.level} · ${esc(p.origin)} · ostatni zapis ${fmt(p.updated_at)}</p><p>Ataki dziś: ${p.attacks_today}/2</p><button data-online-profile="${esc(p.user_id)}">Profil</button><button class="primary" data-online-attack="${esc(p.user_id)}" ${!bound()||busy||p.attacks_today>=2?'disabled':''}>⚔ Zaatakuj online</button></div></article>`).join('');
 return `<section class="section"><h2>🌐 PvP online — prawdziwe konta</h2><div class="notice" role="note"><strong>Stan silnika serwerowego:</strong> po wdrożeniu SQL 029 działa 6/15 zdolności Z — Przekonujący, Lekki, Wartowniczy, Wzmocniony, Pancerny, Techniczny; przed wdrożeniem obowiązuje SQL 027 (3/15). Pozostałe 9 działa jedynie lokalnie. SQL 028 kontroluje spójność deklaracji z zapisem chmurowym, lecz nie zapewnia pełnego anty-cheat.</div><p class="small muted">Wyniki rozstrzyga Supabase (X/Y: SQL 025; pierwsze trzy Z: SQL 027; kolejne trzy Z: SQL 029 (po osobnym wdrożeniu)), limit dwóch ataków na każdą postać resetuje się o północy czasu polskiego. Nie trzeba być zalogowanym, aby zostać zaatakowanym. Laboratorium reguł znajduje się w tym panelu i nie wykonuje rzeczywistych ataków.</p>${intro()}${pvpZLabHtml()}${serverZAuditHtml()}${onlineSetDiagnostic()}${error?`<div class="notice">${esc(error)}</div>`:''}${notice?`<div class="notice">${esc(notice)}</div>`:''}<div class="actions"><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież graczy i raporty</button></div><h3>Przeciwnicy (${opponents.length})</h3><div class="pvp-choices">${!auth()?'<p>Połącz konto ASHEN.</p>':!loaded?'<p class="muted">Odśwież listę, aby zobaczyć graczy.</p>':entries||'<p class="muted">Brak innych opublikowanych kont. Do testu potrzebne jest drugie konto e-mail z własną postacią.</p>'}</div><h3>Raporty walk online</h3>${reports.length?reports.slice(0,40).map(x=>{const own=x.side==='attack'?'Atak':'Obrona',r=x.report||{};return `<button class="mail-row" data-online-report="${x.id}"><strong>${own}: ${esc(r.attacker?.name)} vs ${esc(r.defender?.name)}</strong><small>${fmt(x.created_at)}</small></button>`}).join(''):'<p class="muted">Nie stoczono jeszcze walk online.</p>'}</section>${reportDialog()}`;
}
function mailItemsForFolder(){
 const uid=cloud()?.getSession()?.user?.id;
 const mailItems=mail.filter(x=>mailFolder==='inbox'?(x.kind==='battle'&&(x.sender_id===uid||x.recipient_id===uid))||(x.kind!=='battle'&&x.recipient_id===uid):(x.kind!=='battle'&&x.sender_id===uid)).map(x=>({...x,refType:'mail',key:'mail:'+x.id}));
 const notices=mailFolder==='inbox'?expeditionNotices.map(x=>({...x,refType:'expedition',key:'expedition:'+x.id,from_name:'Ekspedycja klanowa',to_name:'Ty'})):[];
 return [...mailItems,...notices].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
}
function unreadCount(){const uid=cloud()?.getSession()?.user?.id;return mail.filter(x=>!x.is_read&&(x.recipient_id===uid||(x.kind==='battle'&&x.sender_id===uid))).length+expeditionNotices.filter(x=>!x.is_read).length}
function mailHtml(){const uid=cloud()?.getSession()?.user?.id;
 const visible=mailItemsForFolder();
 const unread=unreadCount();
 const opened=visible.find(x=>x.key===openedMail);
 const allSelected=visible.length>0&&visible.every(x=>mailSelected.has(x.key));
 const selected=visible.filter(x=>mailSelected.has(x.key));
 const selectable=selected.length;
 const who=opened?.refType==='mail'&&opened?.kind==='personal'?(opened.sender_id===uid?opened.recipient_id:opened.sender_id):null;
 return `<section class="section ashen-mail-page" data-online-mail-view="1"><h2>✉ Wiadomości</h2><div class="actions"><button data-online-mail-folder="inbox" class="${mailFolder==='inbox'?'primary':''}">Odebrane (${unread} nowych)</button><button data-online-mail-folder="sent" class="${mailFolder==='sent'?'primary':''}">Wysłane</button><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież</button></div>${error?`<div class="notice">⚠ ${esc(error)}</div>`:''}${notice?`<div class="notice">✓ ${esc(notice)}</div>`:''}${opened?`<div class="panel ashen-mail-detail"><span class="tag">${opened.refType==='expedition'?'RAPORT EKSPEDYCJI':opened.kind==='battle'?'POWIADOMIENIE O ATAKU':'WIADOMOŚĆ ONLINE'}</span><h3>${esc(opened.subject)}</h3><p class="muted small">${esc(opened.from_name)}${opened.to_name?' → '+esc(opened.to_name):''} · ${fmt(opened.created_at)}</p><p style="white-space:pre-wrap">${esc(opened.body)}</p>${opened.refType==='expedition'?`<div class="ashen-expedition-mail-report">${expeditionMailLoading?'<p class="muted">Wczytywanie pełnego raportu…</p>':expeditionMailError?`<p class="notice">${esc(expeditionMailError)}</p>`:expeditionMailReport?(window.ASHEN_EXPEDITIONS?.reportMarkup?.(expeditionMailReport)||'<p class="muted">Nie udało się przygotować raportu.</p>'):'<p class="muted">Otwórz wiadomość ponownie, aby wczytać raport.</p>'}</div>`:''}<div class="actions">${opened.refType==='expedition'?'':opened.battle_id?`<button data-online-report="${opened.battle_id}">⚔ Pokaż raport walki</button>`:''}${who?`<button data-online-profile="${esc(who)}">Profil gracza</button>`:''}<button data-online-mail-back="1">Wróć do listy</button></div>${opened.refType==='mail'&&opened.kind==='personal'&&opened.sender_id!==uid?`<form id="ashen-mail-reply-form" class="ashen-mail-reply"><h4>↩ Odpowiedz: ${esc(opened.from_name)}</h4><textarea id="ashen-mail-reply-input" class="input" rows="4" maxlength="1500" placeholder="Treść odpowiedzi…" required>${esc(replyDraft)}</textarea><button type="submit" class="primary" ${replyBusy?'disabled':''}>${replyBusy?'Wysyłanie…':'Wyślij odpowiedź'}</button></form>`:''}</div>`:`<div class="ashen-mail-tools"><label><input type="checkbox" data-online-mail-select-all="1" ${allSelected?'checked':''} ${!visible.length?'disabled':''}> Zaznacz wszystkie</label><span id="ashen-mail-selected-count">Zaznaczono: ${selectable}</span><div class="actions"><button data-online-mail-read-selected="1" ${!selectable||mailFolder!=='inbox'||busy?'disabled':''}>✓ Oznacz jako przeczytane</button><button data-online-mail-delete-selected="1" ${!selectable||busy?'disabled':''}>🗑 Usuń zaznaczone</button></div></div><div class="ashen-mail-list">${visible.map(x=>`<div class="ashen-mail-entry ${x.is_read?'':'unread'}"><label class="ashen-mail-check"><input type="checkbox" data-online-mail-select="${esc(x.key)}" aria-label="Zaznacz wiadomość ${esc(x.subject)}" ${mailSelected.has(x.key)?'checked':''}></label><button type="button" class="mail-row ${x.is_read?'':'unread'}" data-online-mail-open="${esc(x.key)}"><strong>${x.refType==='expedition'?'☠ ':x.kind==='battle'?'⚔ ':''}${esc(x.subject)}</strong><span>${esc(x.from_name)}${x.refType==='mail'&&x.kind==='personal'?' → '+esc(x.to_name):''}</span><small>${fmt(x.created_at)}</small></button></div>`).join('')||'<p class="muted">Brak wiadomości.</p>'}</div>`}</section>${reportDialog()}`;
}
function updateMailSelectionUi(){
 const visible=mailItemsForFolder(),selected=visible.filter(x=>mailSelected.has(x.key));
 const count=document.getElementById('ashen-mail-selected-count');if(count)count.textContent='Zaznaczono: '+selected.length;
 for(const b of document.querySelectorAll('[data-online-mail-read-selected]'))b.disabled=!selected.length||mailFolder!=='inbox'||busy;
 for(const b of document.querySelectorAll('[data-online-mail-delete-selected]'))b.disabled=!selected.length||busy;
 const all=document.querySelector('[data-online-mail-select-all]');if(all)all.checked=visible.length>0&&selected.length===visible.length;
}
async function batchMail(action){
 if(busy)return;
 const selected=mailItemsForFolder().filter(x=>mailSelected.has(x.key));if(!selected.length)return;
 if(action==='delete'&&!confirm(`Usunąć ${selected.length} zaznaczonych wiadomości tylko ze swojej skrzynki?`))return;
 busy=true;error='';notice='';draw();
 try{
  await rpc('ashen_mail_batch',{p_mail_ids:selected.filter(x=>x.refType==='mail').map(x=>Number(x.id)),p_notice_ids:selected.filter(x=>x.refType==='expedition').map(x=>Number(x.id)),p_action:action});
  mailSelected.clear();openedMail=null;notice=action==='delete'?'Usunięto wybrane wiadomości z Twojej skrzynki.':'Oznaczono wybrane wiadomości jako przeczytane.';
  const [a,b]=await Promise.all([rpc('ashen_online_messages'),rpc('ashen_expedition_inbox')]);mail=a||[];expeditionNotices=b||[];
 }catch(e){error=msg(e)}finally{busy=false;draw()}
}
document.addEventListener('change',e=>{
 if(e.target.hasAttribute?.('data-online-mail-select')){const key=e.target.dataset.onlineMailSelect;if(e.target.checked)mailSelected.add(key);else mailSelected.delete(key);updateMailSelectionUi();return}
 if(e.target.hasAttribute?.('data-online-mail-select-all')){for(const item of mailItemsForFolder()){if(e.target.checked)mailSelected.add(item.key);else mailSelected.delete(item.key)}for(const el of document.querySelectorAll('[data-online-mail-select]'))el.checked=e.target.checked;updateMailSelectionUi()}
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='ashen-mail-reply-form')return;e.preventDefault();if(replyBusy)return;
 const uid=cloud()?.getSession()?.user?.id;
 const m=mailItemsForFolder().find(x=>x.key===openedMail);
 if(!m||m.refType!=='mail'||m.kind!=='personal'||m.recipient_id!==uid){error='Możesz odpowiadać tylko na odebrane wiadomości prywatne.';draw();return}
 const body=e.target.querySelector('textarea')?.value.trim();if(!body){error='Wpisz treść odpowiedzi.';draw();return}
 replyBusy=true;error='';notice='';try{await rpc('ashen_online_send',{p_recipient:m.sender_id,p_body:body});replyDraft='';notice='Odpowiedź wysłana.';await refresh()}catch(err){error=msg(err);replyDraft=body}finally{replyBusy=false;draw()}
});

document.addEventListener('toggle',e=>{if(e.target?.id==='ashen-pvp-z-lab')pvpZLabOpen=e.target.open},true);
document.addEventListener('click',async e=>{
 if(e.target?.matches?.('[data-online-report-overlay]')){openedReport=null;reportContext='pvp';draw();return}

 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.pvpZlabSelect){pvpZLabOpen=true;pvpZLabFamily=b.dataset.pvpZlabSelect;pvpZLabReport=null;draw();return}
 if(b.hasAttribute('data-pvp-zlab-run')){pvpZLabOpen=true;pvpZLabReport=pvpZLabRun(pvpZLabFamily);draw();return}
 if(b.hasAttribute('data-pvp-zlab-clear')){pvpZLabOpen=true;pvpZLabReport=null;draw();return}
 if(b.hasAttribute('data-online-refresh')){e.preventDefault();await refresh();return}
 if(b.hasAttribute('data-online-share-report')){e.preventDefault();await shareCurrentReport(false);return}
 if(b.hasAttribute('data-online-native-share')){e.preventDefault();await shareCurrentReport(true);return}
 if(b.hasAttribute('data-online-close-report')){openedReport=null;reportContext='pvp';draw();return}
 if(b.dataset.onlineReport){const item=reports.find(x=>String(x.id)===b.dataset.onlineReport);if(item){openedReport=item.report;openedBattleId=Number(item.id)||null;shareFeedback='';openedReportSide=item.side==='defense'?'defense':'attack';reportContext=b.closest('[data-online-mail-view]')?'mail':'pvp';error='';draw();return}error='Nie znaleziono raportu walki na liście pobranych raportów. Kliknij Odśwież i spróbuj ponownie.';draw();return}
 if(b.dataset.onlineAttack){const id=b.dataset.onlineAttack,p=opponents.find(x=>x.user_id===id);if(!p||!bound())return;
  if(!confirm(`Zaatakować gracza ${p.name} (poziom ${p.level})?\nWalka jest rozliczana na serwerze. Limit: 2 dziennie.`))return;
  await action(async()=>{const r=await rpc('ashen_online_attack',{p_defender:id});openedReport=r;openedBattleId=Number(String(r?.id||'').replace(/^online-/,''))||null;shareFeedback='';openedReportSide='attack';reportContext='pvp';notice='Walka zakończona. Raport trafił do obu kont.'});await refresh();return;
 }
 if(b.dataset.onlineMailFolder){mailFolder=b.dataset.onlineMailFolder;mailSelected.clear();openedMail=null;replyDraft='';openedReport=null;expeditionMailReport=null;reportContext='pvp';draw();return}
 if(b.hasAttribute('data-online-mail-back')){openedMail=null;replyDraft='';openedReport=null;expeditionMailReport=null;reportContext='pvp';draw();return}
 if(b.hasAttribute('data-online-mail-read-selected')){void batchMail('read');return}
 if(b.hasAttribute('data-online-mail-delete-selected')){void batchMail('delete');return}
 if(b.dataset.onlineMailOpen){openedReport=null;reportContext='pvp';replyDraft='';openedMail=b.dataset.onlineMailOpen;expeditionMailReport=null;expeditionMailLoading=false;expeditionMailError='';
  const [kind,id]=openedMail.split(':');const m=kind==='expedition'?expeditionNotices.find(x=>String(x.id)===id):mail.find(x=>String(x.id)===id);
  if(kind==='expedition'&&m){const mailKey=openedMail;expeditionMailLoading=true;void rpc('ashen_expedition_report',{p_id:m.expedition_id}).then(result=>{if(openedMail===mailKey)expeditionMailReport=result}).catch(err=>{if(openedMail===mailKey)expeditionMailError=msg(err)}).finally(()=>{if(openedMail===mailKey){expeditionMailLoading=false;draw()}})}
  if(m&&!m.is_read&&(kind==='expedition'||m.recipient_id===cloud()?.getSession()?.user?.id||m.kind==='battle')){
   try{await rpc(kind==='expedition'?'ashen_expedition_notice_read':'ashen_online_mark_read',{p_id:m.id});m.is_read=true}catch(e){error=msg(e)}
  }draw();return}
 if(b.hasAttribute('data-online-profile')){window.ASHEN_OPEN_PLAYER?.(b.dataset.onlineProfile);return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openedReport){openedReport=null;reportContext='pvp';draw()}});
window.ASHEN_ONLINE={renderPublicReport:(r)=>renderReport(r,'attack',true),pvpHtml,mailHtml,localChanged,published,authChanged,refresh,unreadCount,pauseSync,resumeSync,flushSync};
window.addEventListener('online',()=>{if(bound())scheduleSync(500);void refresh()});
if(auth())void refresh();
})();
