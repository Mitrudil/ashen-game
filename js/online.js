/* ASHEN v0.2.5 online PvP + inbox (separate from existing local test battles).
 * No secret keys. Online match is settled in PostgreSQL via authenticated RPC.
 * This is a private testing build; uploaded equipment/stats are not anti-cheat validated.
 */
(()=>{'use strict';
const BOUND_KEY='ashen-online-bound-v025';
let opponents=[],reports=[],mail=[],busy=false,error='',notice='',openedReport=null,openedMail=null,mailFolder='inbox',loaded=false;
let timer=null,lastSynced='',syncing=false,dirty=false;
const cloud=()=>window.ASHEN_CLOUD;
const auth=()=>!!(cloud()?.getClient()&&cloud()?.getSession());
const bound=()=>auth()&&localStorage.getItem(BOUND_KEY)===cloud().currentSlot();
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
async function publish(){if(!bound()||syncing)return;
 const key=cloud().currentSlot(),current=localStorage.getItem(key==='main'?'ashen-save-v010':'ashen-dev-slot-v021:'+key);
 if(!current||current===lastSynced)return;
 syncing=true;
 try{
  const save=JSON.parse(current);if(!save?.created)return;
  const snapshot=window.ASHEN_GET_ONLINE_SNAPSHOT?.();if(!snapshot)throw Error('Nie udało się przygotować statystyk postaci.');
  // Cloud save stays current, and combat state is published separately for other accounts.
  const c=cloud().getClient(),uid=cloud().getSession().user.id;
  const {error:e1}=await c.from('ashen_cloud_saves').upsert({user_id:uid,save_data:save,character_name:String(save.name).slice(0,40),character_level:save.level},{onConflict:'user_id'});
  if(e1)throw e1;
  await rpc('ashen_publish_profile',{p_snapshot:snapshot});
  lastSynced=current;
  if(error.startsWith('Automatyczny zapis'))error='';
 }catch(e){error='Automatyczny zapis online: '+msg(e);draw()}
 finally{syncing=false;if(dirty){dirty=false;localChanged()}}}
function localChanged(){if(!bound())return;dirty=true;if(!timer)timer=setTimeout(()=>{timer=null;dirty=false;void publish()},1800)}
function published(){lastSynced='';if(bound())localChanged();void refresh()}
function authChanged(){lastSynced='';void refresh()}
async function action(fn){if(busy)return;busy=true;error='';notice='';draw();try{await fn()}catch(e){error=msg(e)}finally{busy=false;draw()}}
function intro(){if(!auth())return '<p class="muted">Zaloguj się przez ☁ Konto online, aby korzystać z PvP między kontami.</p>';
 if(!bound())return '<p class="muted">W panelu ☁ Konto online wybierz postać, którą chcesz udostępnić innym graczom, i kliknij „Wyślij aktualną postać”. To przypisze ten lokalny profil do konta online. Innych testerów nie synchronizujemy automatycznie.</p>';
 return '<p class="small muted">Aktywna postać jest powiązana z tym kontem. Postępy publikują się automatycznie. Inni gracze mogą zaatakować Cię również podczas nieobecności.</p>';
}
function renderReport(r){if(!r)return '<p>Nie znaleziono raportu.</p>';
 const a=r.attacker||{},d=r.defender||{},hp=r.hp||[],max=r.maxHp||[],tot=r.totals||[],rnd=r.rounds||[];
 const winner=r.winner===null?'Remis':r.winner===0?'Wygrał atakujący':'Wygrał obrońca';
 return `<div class="panel"><h3>${esc(a.name)} vs ${esc(d.name)} — ${winner}</h3><p class="small muted">${esc(r.at)} · maksymalnie 10 rund, bez trwałej utraty zdrowia i wyposażenia</p><p>Atakujący: ${esc(hp[0])}/${esc(max[0])} PŻ · ${esc(tot[0]?.damage||0)} obrażeń. Obrońca: ${esc(hp[1])}/${esc(max[1])} PŻ · ${esc(tot[1]?.damage||0)} obrażeń.</p>${rnd.map(x=>`<details><summary>Runda ${x.number} — HP: ${x.hp[0]}/${x.hp[1]}</summary>${(x.events||[]).map(e=>`<p class="small">${esc(e)}</p>`).join('')}</details>`).join('')}<div class="actions"><button data-online-close-report="1">Wróć</button></div></div>`;
}
function pvpHtml(){
 const entries=opponents.map(p=>`<article class="pvp-choice"><img src="${p.origin==='tech'?'./assets/characters/technician-'+p.gender+'.webp':p.origin==='fighter'?'./assets/characters/warrior-'+p.gender+'.webp':'./assets/characters/scout-'+p.gender+'.webp'}" onerror="this.style.display='none'" alt=""><div><h4>${esc(p.name)}</h4><p class="small muted">Poziom ${p.level} · ${esc(p.origin)} · ostatni zapis ${fmt(p.updated_at)}</p><p>Ataki dziś: ${p.attacks_today}/2</p><button class="primary" data-online-attack="${esc(p.user_id)}" ${!bound()||busy||p.attacks_today>=2?'disabled':''}>⚔ Zaatakuj online</button></div></article>`).join('');
 return `<section class="section"><h2>🌐 PvP online — prawdziwe konta</h2><p class="small muted">Wyniki rozstrzyga Supabase, limit dwóch ataków na każdą postać resetuje się o północy czasu polskiego. Nie trzeba być zalogowanym, aby zostać zaatakowanym. Lokalny tryb testowy znajduje się niżej.</p>${intro()}${error?`<div class="notice">${esc(error)}</div>`:''}${notice?`<div class="notice">${esc(notice)}</div>`:''}<div class="actions"><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież graczy i raporty</button></div>${openedReport?renderReport(openedReport):`<h3>Przeciwnicy (${opponents.length})</h3><div class="pvp-choices">${!auth()?'<p>Połącz konto ASHEN.</p>':!loaded?'<p class="muted">Odśwież listę, aby zobaczyć graczy.</p>':entries||'<p class="muted">Brak innych opublikowanych kont. Do testu potrzebne jest drugie konto e-mail z własną postacią.</p>'}</div><h3>Raporty walk online</h3>${reports.length?reports.slice(0,15).map(x=>{const own=x.side==='attack'?'Atak':'Obrona',r=x.report||{};return `<button class="mail-row" data-online-report="${x.id}"><strong>${own}: ${esc(r.attacker?.name)} vs ${esc(r.defender?.name)}</strong><small>${fmt(x.created_at)}</small></button>`}).join(''):'<p class="muted">Nie stoczono jeszcze walk online.</p>'}`}</section>`;
}
function mailHtml(){const uid=cloud()?.getSession()?.user?.id;
 const visible=mail.filter(x=>mailFolder==='inbox'?x.recipient_id===uid:x.sender_id===uid),unread=mail.filter(x=>x.recipient_id===uid&&!x.is_read).length;
 const opened=mail.find(x=>String(x.id)===String(openedMail));
 return `<section class="section"><h2>✉ Wiadomości online</h2>${intro()}${error?`<div class="notice">${esc(error)}</div>`:''}${notice?`<div class="notice">${esc(notice)}</div>`:''}<div class="actions"><button data-online-mail-folder="inbox" class="${mailFolder==='inbox'?'primary':''}">Odebrane (${unread} nowych)</button><button data-online-mail-folder="sent" class="${mailFolder==='sent'?'primary':''}">Wysłane</button><button data-online-refresh="1" ${busy?'disabled':''}>↻ Odśwież</button></div>${opened?`<div class="panel"><h3>${esc(opened.subject)}</h3><p class="muted small">${esc(opened.from_name)} → ${esc(opened.to_name)} · ${fmt(opened.created_at)}</p><p style="white-space:pre-wrap">${esc(opened.body)}</p>${opened.battle_id?`<button data-online-report="${opened.battle_id}">Pokaż raport walki</button>`:''}<button data-online-mail-back="1">Wróć do listy</button></div>`:`<div class="mail-list">${visible.map(x=>`<button class="mail-row ${x.is_read?'':'unread'}" data-online-mail-open="${x.id}"><strong>${esc(x.subject)}</strong><span>${esc(x.from_name)} → ${esc(x.to_name)}</span><small>${fmt(x.created_at)}</small></button>`).join('')||'<p class="muted">Brak wiadomości online.</p>'}</div>`}<div class="panel"><h3>Wyślij wiadomość online</h3><label for="online-mail-to">Odbiorca</label><select class="input" id="online-mail-to">${opponents.map(p=>`<option value="${esc(p.user_id)}">${esc(p.name)} (poziom ${p.level})</option>`).join('')}</select><label for="online-mail-text">Treść</label><textarea class="input" id="online-mail-text" rows="3" maxlength="1500" placeholder="Napisz wiadomość..."></textarea><div class="actions"><button class="primary" data-online-send="1" ${!bound()||busy||!opponents.length?'disabled':''}>Wyślij wiadomość</button></div></div><p class="small muted">Poniżej pozostawiono dotychczasową skrzynkę lokalnych testerów.</p></section>`;
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-online-refresh')){e.preventDefault();await refresh();return}
 if(b.hasAttribute('data-online-close-report')){openedReport=null;draw();return}
 if(b.dataset.onlineReport){const item=reports.find(x=>String(x.id)===b.dataset.onlineReport);if(item){openedReport=item.report;draw();return}}
 if(b.dataset.onlineAttack){const id=b.dataset.onlineAttack,p=opponents.find(x=>x.user_id===id);if(!p||!bound())return;
  if(!confirm(`Zaatakować gracza ${p.name} (poziom ${p.level})?\nWalka jest rozliczana na serwerze. Limit: 2 dziennie.`))return;
  await action(async()=>{const r=await rpc('ashen_online_attack',{p_defender:id});openedReport=r;notice='Walka zakończona. Raport trafił do obu kont.'});await refresh();return;
 }
 if(b.dataset.onlineMailFolder){mailFolder=b.dataset.onlineMailFolder;openedMail=null;draw();return}
 if(b.hasAttribute('data-online-mail-back')){openedMail=null;draw();return}
 if(b.dataset.onlineMailOpen){openedMail=b.dataset.onlineMailOpen;const m=mail.find(x=>String(x.id)===openedMail);if(m&&m.recipient_id===cloud()?.getSession()?.user?.id&&!m.is_read){try{await rpc('ashen_online_mark_read',{p_id:m.id});m.is_read=true}catch(e){error=msg(e)}}draw();return}
 if(b.hasAttribute('data-online-send')){const to=document.getElementById('online-mail-to')?.value,body=document.getElementById('online-mail-text')?.value||'';await action(async()=>{await rpc('ashen_online_send',{p_recipient:to,p_body:body});notice='Wiadomość online została wysłana.'});await refresh();return}
});
window.ASHEN_ONLINE={pvpHtml,mailHtml,localChanged,published,authChanged};
if(auth())void refresh();
})();
