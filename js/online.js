/* ASHEN v0.2.6.1 online PvP + inbox (separate from existing local test battles).
 * No secret keys. Online match is settled in PostgreSQL via authenticated RPC.
 * This is a private testing build; uploaded equipment/stats are not anti-cheat validated.
 */
(()=>{'use strict';
let opponents=[],reports=[],mail=[],busy=false,error='',notice='',openedReport=null,openedReportSide='attack',reportContext='pvp',openedMail=null,mailFolder='inbox',loaded=false;
let timer=null,lastSynced='',syncing=false,dirty=false,observed='',syncMessage='';
const cloud=()=>window.ASHEN_CLOUD;
const auth=()=>!!(cloud()?.getClient()&&cloud()?.getSession());
const bound=()=>auth()&&cloud()?.getBoundSlot()===cloud()?.currentSlot();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>new Date(v).toLocaleString('pl-PL',{timeZone:'Europe/Warsaw'});
const msg=e=>String(e?.message||e||'Błąd połączenia').slice(0,250);
function draw(){window.ASHEN_FORCE_RENDER?.()}
async function rpc(name,args={}){const c=cloud()?.getClient();if(!c||!auth())throw Error('Najpierw zaloguj się do Konta online.');const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
async function refresh(){if(!auth()){opponents=[];reports=[];mail=[];loaded=false;draw();return}
 if(busy)return;busy=true;error='';draw();try{
  const [a,b,c]=await Promise.all([rpc('ashen_online_list'),rpc('ashen_online_reports'),rpc('ashen_online_messages')]);
  opponents=a||[];reports=b||[];mail=c||[];loaded=true;
 }catch(e){error='Nie można wczytać PvP online: '+msg(e)+'. Sprawdź, czy uruchomiono 003_online_pvp.sql w projekcie ASHEN.';}finally{busy=false;draw()}}
function activeRaw(){const slot=cloud()?.currentSlot();if(!slot)return '';return localStorage.getItem(slot==='main'?'ashen-save-v010':'ashen-dev-slot-v021:'+slot)||''}
async function publish(){
 if(!bound()||syncing)return;
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
function scheduleSync(delay=1800){if(timer)clearTimeout(timer);timer=setTimeout(()=>{timer=null;void publish()},delay)}
function localChanged(){if(!bound())return;const raw=activeRaw();if(raw===observed)return;observed=raw;if(raw===lastSynced)return;dirty=true;scheduleSync()}
function published(){lastSynced='';observed='';syncMessage='Oczekuje na synchronizację';if(bound())localChanged();void refresh()}
function authChanged(){lastSynced='';observed='';if(timer){clearTimeout(timer);timer=null}dirty=false;syncMessage='';opponents=[];reports=[];mail=[];openedReport=null;openedMail=null;loaded=false;void refresh()}
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
function health(value,max,enemy=false){
 const hp=Math.max(0,num(value)),limit=Math.max(1,num(max));
 return `<div class="arena-health-track" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.round(limit)}" aria-valuenow="${Math.round(Math.min(hp,limit))}"><span class="${enemy?'is-enemy':'is-hero'}" style="width:${Math.max(0,Math.min(100,hp/limit*100))}%"></span></div>`;
}
function hpLabel(value,max){return `${Math.max(0,Math.round(num(value)))} / ${Math.round(num(max))}`}
function outcome(r){return r?.winner===0?'Zwycięstwo atakującego':r?.winner===1?'Zwycięstwo obrońcy':'Remis'}
function renderReport(r,side='attack'){
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
  return `<tr class="${i>=4?'arena-attribute-row':''} ${i===4?'arena-attribute-start':''}"><th scope="row">${esc(label)}</th><td class="${cs[0]}">${esc(v1??'—')}</td><td class="${cs[1]}">${esc(v2??'—')}</td></tr>`;
 }).join('');
 const arms=profile=>(profile.attacks||[]).map(x=>`${esc(x.weapon?.name||'Broń')} (${x.hand==='left'?'lewa':'prawa'} ręka${x.weapon?.min!==undefined?`, ${esc(x.weapon.min)}–${esc(x.weapon.max)} obr.`:''})`).join(' · ')||'Brak danych o broni';
 const rounds=rnd.map(x=>{
  const roundRaw=Array.isArray(x.hp)?x.hp:[],damageRaw=Array.isArray(x.damage)?x.damage:[];
  const roundHp=order.map(i=>roundRaw[i]);
  // Server stores damage inflicted ON [attacker, defender], not dealt BY them.
  const dealt=[damageRaw[order[1]],damageRaw[order[0]]];
  return `<details class="arena-round-card"><summary><span class="arena-round-number">RUNDA ${esc(x.number)}</span><span class="arena-round-damage">Zadane: ${esc(names[0])} ${num(dealt[0])} · ${esc(names[1])} ${num(dealt[1])} obr.</span><span class="arena-round-expand">Szczegóły</span></summary><div class="arena-round-card-body"><div class="arena-round-hp-grid"><div><span>${esc(names[0])} · PŻ</span><strong>${hpLabel(roundHp[0],max[0])}</strong>${health(roundHp[0],max[0])}</div><div><span>${esc(names[1])} · PŻ</span><strong>${hpLabel(roundHp[1],max[1])}</strong>${health(roundHp[1],max[1],true)}</div></div><div class="arena-round-events">${(x.events||[]).map(e=>`<p>${esc(e)}</p>`).join('')||'<p>Brak zapisanych zdarzeń.</p>'}</div></div></details>`;
 }).join('');
 const percent=t=>num(t?.attempts)?`${Math.round(num(t.hits)/num(t.attempts)*100)}%`:'—';
 const statrows=[['Zadane obrażenia',num(tot[0]?.damage),num(tot[1]?.damage)],['Trafienia / próby',`${num(tot[0]?.hits)} / ${num(tot[0]?.attempts)}`,`${num(tot[1]?.hits)} / ${num(tot[1]?.attempts)}`],['Skuteczność',percent(tot[0]),percent(tot[1])],['Trafienia krytyczne',num(tot[0]?.critical),num(tot[1]?.critical)]].map(([k,l,v])=>`<tr><th scope="row">${esc(k)}</th><td>${esc(l)}</td><td>${esc(v)}</td></tr>`).join('');
 return `<div class="arena-report ashen-online-arena-report"><div class="arena-report-header"><div><span class="tag">RAPORT · PvP ONLINE</span><h3>${esc(result)} — ${esc(names[0])} vs ${esc(names[1])}</h3><p class="small muted">${esc(r.at||'')} · ${rnd.length} ${rnd.length===1?'runda':'rund'} · walka rozliczona na serwerze</p></div></div>
 <section class="arena-combat-profile"><div class="arena-battle-section-title"><span>01 / PORÓWNANIE</span><h4>Statystyki przed walką</h4></div><div class="arena-fighter-portraits"><div class="arena-fighter-portrait is-hero">${portrait(fighters[0])}<strong>${esc(names[0])}</strong><small>Twoja postać · ${roles[0]} · Poziom ${esc(fighters[0].level??'—')}</small></div><span class="arena-fighter-versus">VS</span><div class="arena-fighter-portrait is-enemy">${portrait(fighters[1])}<strong>${esc(names[1])}</strong><small>Przeciwnik · ${roles[1]} · Poziom ${esc(fighters[1].level??'—')}</small></div></div><div class="arena-combat-table-wrap"><table class="arena-combat-table arena-comparison-expanded"><thead><tr><th>Parametr</th><th>${esc(names[0])} (Ty)</th><th>${esc(names[1])}</th></tr></thead><tbody>${table}</tbody></table></div><p class="arena-profile-explainer">Kolory pokazują porównanie zapisanych parametrów z chwili walki. Obrażenia PvP nie powodują trwałej utraty PŻ ani wyposażenia.</p><div class="arena-profile-weapons"><strong>Twoje uzbrojenie:</strong> ${arms(fighters[0])}<div><strong>Uzbrojenie przeciwnika:</strong> ${arms(fighters[1])}</div></div></section>
 <section class="arena-round-review"><div class="arena-battle-section-title"><span>02 / RUNDY</span><h4>Przebieg starcia</h4></div><div class="arena-rounds-list">${rounds||'<p class="muted">W tym raporcie nie zapisano przebiegu rund.</p>'}</div></section>
 <section class="arena-battle-finale"><div class="arena-battle-section-title"><span>03 / WYNIK</span><h4>Podsumowanie starcia</h4></div><div class="arena-outcome-reason ${r.winner===null?'is-draw':''}"><strong>${esc(result)}</strong><p>${r.winner===null?'Po 10 rundach nie wyłoniono zwycięzcy.':`Wynik rozstrzygnął serwer. ${rnd.length} ${rnd.length===1?'runda':'rund'}.`}</p><div class="arena-final-hp"><div><span>${esc(names[0])} · PŻ po walce</span><strong>${hpLabel(hp[0],max[0])}</strong>${health(hp[0],max[0])}</div><div><span>${esc(names[1])} · PŻ po walce</span><strong>${hpLabel(hp[1],max[1])}</strong>${health(hp[1],max[1],true)}</div></div></div></section>
 <div class="ashen-damage-summary"><div class="ashen-damage-header"><strong>⚔ PODSUMOWANIE WALKI</strong><span>${rnd.length} ${rnd.length===1?'runda':'rund'}</span></div><div class="ashen-damage-table-wrap"><table class="ashen-damage-table"><thead><tr><th>Parametr</th><th>Twoja postać</th><th>Przeciwnik</th></tr></thead><tbody>${statrows}</tbody></table></div></div><div class="arena-report-reward"><strong>PvP online:</strong> bez nagród i bez utraty przedmiotów lub trwałego PŻ.</div></div>`;
}
function reportDialog(){if(!openedReport)return '';
 return `<div class="arena-report-overlay" data-online-report-overlay="1"><div class="arena-report-dialog" role="dialog" aria-modal="true" aria-label="Raport PvP online"><div class="arena-report-dialog-toolbar"><span>⚔ RAPORT STARCIA · PvP ONLINE</span><button type="button" data-online-close-report="1">✕ Wróć</button></div><div class="arena-report-dialog-scroll">${renderReport(openedReport,openedReportSide)}</div></div></div>`;
}
function pvpHtml(){
 const entries=opponents.map(p=>`<article class="pvp-choice"><img src="${p.origin==='tech'?'./assets/characters/technician-'+p.gender+'.webp':p.origin==='fighter'?'./assets/characters/warrior-'+p.gender+'.webp':'./assets/characters/scout-'+p.gender+'.webp'}" onerror="this.style.display='none'" alt=""><div><h4>${esc(p.name)}</h4><p class="small muted">Poziom ${p.level} · ${esc(p.origin)} · ostatni zapis ${fmt(p.updated_at)}</p><p>Ataki dziś: ${p.attacks_today}/2</p><button class="primary" data-online-attack="${esc(p.user_id)}" ${!bound()||busy||p.attacks_today>=2?'disabled':''}>⚔ Zaatakuj online</button></div></article>`).join('');
 return `<section class="section"><h2>🌐 PvP online — prawdziwe konta</h2><p class="small muted">Wyniki rozstrzyga Supabase, limit dwóch ataków na każdą postać resetuje się o północy czasu polskiego. Nie trzeba być zalogowanym, aby zostać zaatakowanym. Lokalny tryb testowy znajduje się niżej.</p>${intro()}${error?`<div class="notice">${esc(error)}</div>`:''}${notice?`<div class="notice">${esc(notice)}</div>`:''}<div class="actions"><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież graczy i raporty</button></div><h3>Przeciwnicy (${opponents.length})</h3><div class="pvp-choices">${!auth()?'<p>Połącz konto ASHEN.</p>':!loaded?'<p class="muted">Odśwież listę, aby zobaczyć graczy.</p>':entries||'<p class="muted">Brak innych opublikowanych kont. Do testu potrzebne jest drugie konto e-mail z własną postacią.</p>'}</div><h3>Raporty walk online</h3>${reports.length?reports.slice(0,15).map(x=>{const own=x.side==='attack'?'Atak':'Obrona',r=x.report||{};return `<button class="mail-row" data-online-report="${x.id}"><strong>${own}: ${esc(r.attacker?.name)} vs ${esc(r.defender?.name)}</strong><small>${fmt(x.created_at)}</small></button>`}).join(''):'<p class="muted">Nie stoczono jeszcze walk online.</p>'}</section>${reportDialog()}`;
}
function mailHtml(){const uid=cloud()?.getSession()?.user?.id;
 const visible=mail.filter(x=>mailFolder==='inbox'?x.recipient_id===uid:x.sender_id===uid),unread=mail.filter(x=>x.recipient_id===uid&&!x.is_read).length;
 const opened=mail.find(x=>String(x.id)===String(openedMail));
 return `<section class="section" data-online-mail-view="1"><h2>✉ Wiadomości online</h2>${intro()}${error?`<div class="notice">${esc(error)}</div>`:''}${notice?`<div class="notice">${esc(notice)}</div>`:''}<div class="actions"><button data-online-mail-folder="inbox" class="${mailFolder==='inbox'?'primary':''}">Odebrane (${unread} nowych)</button><button data-online-mail-folder="sent" class="${mailFolder==='sent'?'primary':''}">Wysłane</button><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież</button></div>${opened?`<div class="panel"><h3>${esc(opened.subject)}</h3><p class="muted small">${esc(opened.from_name)} → ${esc(opened.to_name)} · ${fmt(opened.created_at)}</p><p style="white-space:pre-wrap">${esc(opened.body)}</p>${opened.battle_id?`<button data-online-report="${opened.battle_id}">Pokaż raport walki</button>`:''}<button data-online-mail-back="1">Wróć do listy</button></div>`:`<div class="mail-list">${visible.map(x=>`<button class="mail-row ${x.is_read?'':'unread'}" data-online-mail-open="${x.id}"><strong>${esc(x.subject)}</strong><span>${esc(x.from_name)} → ${esc(x.to_name)}</span><small>${fmt(x.created_at)}</small></button>`).join('')||'<p class="muted">Brak wiadomości online.</p>'}</div>`}<div class="panel"><h3>Wyślij wiadomość online</h3><label for="online-mail-to">Odbiorca</label><select class="input" id="online-mail-to">${opponents.map(p=>`<option value="${esc(p.user_id)}">${esc(p.name)} (poziom ${p.level})</option>`).join('')}</select><label for="online-mail-text">Treść</label><textarea class="input" id="online-mail-text" rows="3" maxlength="1500" placeholder="Napisz wiadomość..."></textarea><div class="actions"><button class="primary" data-online-send="1" ${!bound()||busy||!opponents.length?'disabled':''}>Wyślij wiadomość</button></div></div><p class="small muted">Poniżej pozostawiono dotychczasową skrzynkę lokalnych testerów.</p></section>${reportDialog()}`;
}
document.addEventListener('click',async e=>{
 if(e.target?.matches?.('[data-online-report-overlay]')){openedReport=null;reportContext='pvp';draw();return}

 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-online-refresh')){e.preventDefault();await refresh();return}
 if(b.hasAttribute('data-online-close-report')){openedReport=null;reportContext='pvp';draw();return}
 if(b.dataset.onlineReport){const item=reports.find(x=>String(x.id)===b.dataset.onlineReport);if(item){openedReport=item.report;openedReportSide=item.side==='defense'?'defense':'attack';reportContext=b.closest('[data-online-mail-view]')?'mail':'pvp';error='';draw();return}error='Nie znaleziono raportu walki na liście pobranych raportów. Kliknij Odśwież i spróbuj ponownie.';draw();return}
 if(b.dataset.onlineAttack){const id=b.dataset.onlineAttack,p=opponents.find(x=>x.user_id===id);if(!p||!bound())return;
  if(!confirm(`Zaatakować gracza ${p.name} (poziom ${p.level})?\nWalka jest rozliczana na serwerze. Limit: 2 dziennie.`))return;
  await action(async()=>{const r=await rpc('ashen_online_attack',{p_defender:id});openedReport=r;openedReportSide='attack';reportContext='pvp';notice='Walka zakończona. Raport trafił do obu kont.'});await refresh();return;
 }
 if(b.dataset.onlineMailFolder){mailFolder=b.dataset.onlineMailFolder;openedMail=null;openedReport=null;reportContext='pvp';draw();return}
 if(b.hasAttribute('data-online-mail-back')){openedMail=null;openedReport=null;reportContext='pvp';draw();return}
 if(b.dataset.onlineMailOpen){openedReport=null;reportContext='pvp';openedMail=b.dataset.onlineMailOpen;const m=mail.find(x=>String(x.id)===openedMail);if(m&&m.recipient_id===cloud()?.getSession()?.user?.id&&!m.is_read){try{await rpc('ashen_online_mark_read',{p_id:m.id});m.is_read=true}catch(e){error=msg(e)}}draw();return}
 if(b.hasAttribute('data-online-send')){const to=document.getElementById('online-mail-to')?.value,body=document.getElementById('online-mail-text')?.value||'';await action(async()=>{await rpc('ashen_online_send',{p_recipient:to,p_body:body});notice='Wiadomość online została wysłana.'});await refresh();return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openedReport){openedReport=null;reportContext='pvp';draw()}});
window.ASHEN_ONLINE={pvpHtml,mailHtml,localChanged,published,authChanged};
window.addEventListener('online',()=>{if(bound())scheduleSync(500);void refresh()});
if(auth())void refresh();
})();
