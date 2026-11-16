/* ASHEN v0.2.9 — klany online; wyłącznie konto Supabase ASHEN.
 * Role i zaproszenia egzekwuje serwer RPC, nie przeglądarka.
 */
(()=>{'use strict';
let state=null,base=null,loading=false,busy=false,baseBusy=false,error='',info='',lastIdentity='',requests=0;
const cloud=()=>window.ASHEN_CLOUD;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const client=()=>cloud()?.getClient();
const user=()=>cloud()?.getSession()?.user?.id;
const active=()=>Boolean(client()&&user());
const identity=()=>[cloud()?.getProjectUrl(),user()].join('|');
const roleName=r=>({leader:'Lider',officer:'Oficer',member:'Członek'})[r]||r;
const setError=e=>{error=String(e?.message||e||'Nieznany błąd').slice(0,250);info=''};
const redraw=()=>window.ASHEN_FORCE_RENDER?.();
async function rpc(name,args={}){if(!active())throw Error('Zaloguj się w panelu ☁ Konto online.');const {data,error}=await client().rpc(name,args);if(error)throw error;return data}
async function refresh(){const id=identity(),n=++requests;lastIdentity=id;state=null;base=null;error='';loading=true;redraw();try{if(!active())return;const result=await rpc('ashen_clan_state');if(n===requests&&id===identity()){state=result;await loadBase();}}catch(e){if(n===requests)setError(e)}finally{if(n===requests){loading=false;redraw()}}}
function ensure(){const id=identity();if(id!==lastIdentity){lastIdentity=id;state=null;base=null;info='';error='';void refresh()}}
const buildingSpecs=[
 {id:'command',name:'Centrum dowodzenia',icon:'⌁',desc:'Struktura dowodzenia i organizacja wypraw'},
 {id:'warehouse',name:'Magazyn frakcji',icon:'⚙',desc:'Infrastruktura przechowywania zasobów'},
 {id:'radio',name:'Stacja łączności',icon:'⌁',desc:'Łączność i koordynacja członków'}
];
const costFor=l=>({scrap:150*l*l,czesci:30*l});
const resourceSpecs=[{key:'scrap',label:'Złom',icon:'⚙'},{key:'czesci',label:'Części mechaniczne',icon:'🔩'},{key:'food',label:'Żywność',icon:'🥫'},{key:'water',label:'Czysta woda',icon:'💧'},{key:'medical',label:'Zaopatrzenie medyczne',icon:'✚'}];
const resourceName=k=>resourceSpecs.find(x=>x.key===k)?.label||k;
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const fmt=v=>Math.max(0,num(v)).toLocaleString('pl-PL');
async function loadBase(){
 if(!state?.clan){base=null;return}
 try{base=await rpc('ashen_faction_base_state')}catch(e){base=null;error='Baza frakcji: '+String(e?.message||e).slice(0,185)+' · Sprawdź SQL 018.'}
}
async function baseAction(fn){
 if(baseBusy||busy||loading)return;
 baseBusy=true;error='';info='';redraw();
 try{await fn();await loadBase()}catch(e){setError(e)}finally{baseBusy=false;redraw()}
}
function baseHtml(role){
 if(!base)return `<div class="panel clan-panel faction-base"><h3>⌂ Baza frakcji</h3><p class="small muted">Nie pobrano bazy. Uruchom SQL 017 i 018 w projekcie Supabase ASHEN i kliknij Odśwież.</p></div>`;
 const stock=base.stock||{},levels=base.levels||{},wallet=window.ASHEN_FACTION_WALLET?.()||{};
 const authBound=cloud()?.getBoundSlot()===cloud()?.currentSlot();
 const blocks=buildingSpecs.map(b=>{
  const level=Math.max(0,Math.min(5,num(levels[b.id]))),next=level+1,cost=costFor(next),ready=num(stock.scrap)>=cost.scrap&&num(stock.czesci)>=cost.czesci;
  return `<div class="faction-building"><strong>${b.icon} ${b.name}</strong><span>${b.desc}</span><div class="faction-building-level">Poziom <strong>${level}/5</strong></div><div class="faction-progress"><i style="width:${level*20}%"></i></div>${level>=5?'<span class="good">Ukończono rozbudowę</span>':`<span class="small muted">Następny: ${fmt(cost.scrap)} złomu + ${fmt(cost.czesci)} części</span><button data-base-build="${b.id}" ${baseBusy||!ready||!['leader','officer'].includes(role)?'disabled':''}>Rozbuduj do ${next}</button>`}</div>`;
 }).join('');
 const ranks=(base.ranking||[]).map((r,i)=>`<tr><td><strong>${i+1}. ${esc(r.name||'Nieznany gracz')}</strong></td>${resourceSpecs.map(x=>`<td class="faction-num">${fmt(r[x.key])}</td>`).join('')}</tr>`).join('');
 const ranksHtml=`<div class="faction-ranking-scroll"><table class="faction-ranking-table"><thead><tr><th>Postać</th>${resourceSpecs.map(x=>`<th title="${x.label}">${x.icon} <span>${x.label}</span></th>`).join('')}</tr></thead><tbody>${ranks||`<tr><td colspan="6" class="muted">Brak wpłat. Pierwszy wkład pojawi się tutaj.</td></tr>`}</tbody></table></div>`;
 const logs=(base.history||[]).map(h=>`<div class="faction-base-log"><span><strong>${esc(h.name||'Nieznany gracz')}</strong><br>${h.action==='build'?'Rozbudowa '+esc(buildingSpecs.find(x=>x.id===h.building)?.name||'budynku'):'Wpłata · '+esc(resourceName(h.kind))}</span><strong>${h.action==='build'?'poziom '+fmt(h.level):'+'+fmt(h.amount)}</strong><small>${new Date(h.at).toLocaleString('pl-PL')}</small></div>`).join('');
 const walletHtml=resourceSpecs.map(x=>`${x.icon} ${x.label}: <strong>${fmt(wallet[x.key])}</strong>`).join(' · ');
 const stockHtml=resourceSpecs.map(x=>`<span>${x.icon} ${x.label} <strong>${fmt(stock[x.key])}</strong></span>`).join('');
 return `<div class="panel clan-panel faction-base"><div class="faction-base-heading"><div><span class="tag">WSPÓLNE · SUPABASE</span><h3>⌂ Baza frakcji</h3></div><span class="small muted">Wspólny magazyn i wkład członków</span></div><div class="faction-stats">${stockHtml}</div><p class="small muted">Rozbudowa trzech istniejących budynków nadal wymaga złomu i części mechanicznych. Nowe zaopatrzenie przygotowujemy pod kuchnię polową, lecznicę i przyszłe technologie. Nie zużywa się samo.</p><div class="faction-building-grid">${blocks}</div><details class="faction-details"><summary>Planowane obiekty — następny etap rozwoju</summary><p class="small muted">Kuchnia polowa — żywność i woda · Lecznica — zaopatrzenie medyczne · Warsztat frakcji — technologie i części. Na razie nie pobierają surowców i nie zapewniają premii.</p></details><details class="faction-contribute" open><summary>⚙ Wpłać materiały do frakcji</summary><p class="small muted">Twoje zapasy: ${walletHtml}</p><p class="small muted">Wpłata jest dobrowolna i nieodwracalna. Wymaga powiązania postaci z kontem online oraz synchronizacji zapisu.</p><div class="faction-contribute-form"><select class="input" id="base-kind">${resourceSpecs.map(x=>`<option value="${x.key}">${x.icon} ${x.label}</option>`).join('')}</select><input id="base-amount" class="input" type="number" min="1" max="5000" step="1" value="10" aria-label="Ilość materiałów"><button class="primary" data-base-deposit="1" ${baseBusy||!authBound?'disabled':''}>Wpłać</button></div>${!authBound?'<p class="small muted">Najpierw połącz aktywną postać z kontem w panelu ☁ Konto online.</p>':''}</details><div class="faction-ranking"><h3>🏅 Wkład członków frakcji</h3><p class="small muted">Łączne wpłaty według postaci — bez sztucznego przeliczania różnych surowców na punkty.</p>${ranksHtml}</div><details class="faction-details"><summary>Historia wpłat i rozbudowy (ostatnie 30 działań)</summary><div>${logs||'<p class="small muted">Brak wpłat i rozbudowy.</p>'}</div></details></div>`;
}
function clanHtml(){
 ensure();
 const intro='<span class="tag">ASHEN v0.4.2 · FRAKCJE</span><h2>☷ Frakcje Pustkowi</h2><p class="small muted">Twoja społeczność ocalałych. Wspólne walki z bossami znajdziesz w zakładce Ekspedycje.</p>';
 if(!active())return `<section class="section ashen-clan-page"><div class="clan-header"><div>${intro}</div></div><div class="notice">Zaloguj się przez ☁ Konto online, aby utworzyć frakcję lub przyjąć zaproszenie. Profile lokalne nie są osobnymi kontami online.</div></section>`;
 const c=state?.clan,role=state?.my_role,members=state?.members||[],invites=state?.invitations||[],pending=state?.pending_sent||[],candidates=state?.candidates||[];
 const header=`<section class="section ashen-clan-page"><div class="clan-header"><div>${intro}</div><button data-clan-refresh="1" ${loading||busy?'disabled':''}>↻ Odśwież</button></div>${error?`<div class="notice">⚠ ${esc(error)}</div>`:''}${info?`<div class="notice">✓ ${esc(info)}</div>`:''}${loading?'<p class="small muted">Pobieranie danych frakcji…</p>':''}`;
 if(!state)return header+(!loading?'<p class="muted">Nie udało się pobrać danych. Kliknij Odśwież.</p>':'')+'</section>';
 const invitations=invites.length?`<div class="panel clan-panel"><h3>Zaproszenia (${invites.length})</h3>${invites.map(i=>`<div class="clan-member"><div><strong>[${esc(i.tag)}] ${esc(i.name)}</strong><p class="small muted">Zaprasza ${esc(i.sender)} · do ${new Date(i.expires_at).toLocaleString('pl-PL')}</p></div><div class="actions"><button class="primary" data-clan-accept="${i.id}">Dołącz</button><button data-clan-reject="${i.id}">Odrzuć</button></div></div>`).join('')}</div>`:'';
 if(!c)return header+invitations+`<div class="panel clan-panel"><h3>Załóż własną frakcję</h3><p class="small muted">Jedna frakcja na konto · maksymalnie 30 członków. Nazwa i skrót muszą być unikalne.</p><div class="faction-create-grid"><div><label for="clan-name">Nazwa frakcji</label><input class="input" id="clan-name" maxlength="40" placeholder="np. Strażnicy Pustkowi"></div><div><label for="clan-tag">Skrót (2–5 znaków)</label><input class="input" id="clan-tag" maxlength="5" placeholder="np. STRAZ"></div></div><label for="clan-description">Opis</label><textarea class="input" id="clan-description" maxlength="400" rows="2" placeholder="Kim jesteście?"></textarea><div class="actions"><button class="primary" data-clan-create="1" ${busy?'disabled':''}>Utwórz frakcję</button></div></div></section>`;
 const memberRows=members.map(m=>`<div class="clan-member"><div><strong>${esc(m.name)}</strong> <span class="tag">${roleName(m.role)}</span><p class="small muted">Poziom ${Number(m.level)||1}${m.user_id===user()?' · Ty':''}</p></div><div class="actions"><button data-clan-profile="${m.user_id}">Profil</button>${role==='leader'&&m.user_id!==user()?`${m.role==='member'?`<button data-clan-manage="promote" data-clan-target="${m.user_id}">Awansuj</button>`:m.role==='officer'?`<button data-clan-manage="demote" data-clan-target="${m.user_id}">Degraduj</button>`:''}<button data-clan-manage="kick" data-clan-target="${m.user_id}">Usuń</button>`:''}</div></div>`).join('');
 const membersPanel=`<div class="panel clan-panel"><h3>👥 Członkowie <span class="muted small">${members.length}/30</span></h3><div class="faction-member-list">${memberRows||'<p class="muted">Brak członków</p>'}</div></div>`;
 const invitePanel=['leader','officer'].includes(role)?`<div class="panel clan-panel"><h3>✉ Zaproś gracza</h3><p class="muted small">Zaproszenia ważne 7 dni · do 10 oczekujących.</p><div class="actions"><select id="clan-target" class="input">${candidates.map(p=>`<option value="${p.user_id}">${esc(p.name)} · poziom ${Number(p.level)||1}</option>`).join('')}</select><button data-clan-invite="1" class="primary" ${!candidates.length||busy?'disabled':''}>Zaproś</button></div>${pending.length?`<details class="faction-details"><summary>Wysłane zaproszenia (${pending.length})</summary>${pending.map(i=>`<p class="small muted">${esc(i.name)} · do ${new Date(i.expires_at).toLocaleString('pl-PL')}</p>`).join('')}</details>`:''}</div>`:'';
 const basePanel=baseHtml(role);
 const managePanel=`<details class="faction-management panel clan-panel"><summary>⚙ Zarządzanie frakcją</summary><p class="small muted">${role==='leader'?'Lider może rozwiązać frakcję dopiero po usunięciu pozostałych członków.':'Opuszczenie frakcji nie usuwa postaci ani wyposażenia.'}</p><button data-clan-leave="1">${role==='leader'?'Rozwiąż pustą frakcję':'Opuść frakcję'}</button></details>`;
 return header+`<div class="panel clan-panel faction-summary"><div><span class="tag">[${esc(c.tag)}]</span><h3>${esc(c.name)}</h3><p class="small muted">${esc(c.description||'Brak opisu frakcji.')}</p></div><div class="faction-stats"><span>Rola <strong>${roleName(role)}</strong></span><span>Skład <strong>${members.length}/30</strong></span></div></div>${invitations}<div class="faction-columns">${membersPanel}<div class="faction-side">${invitePanel}<div class="panel clan-panel faction-expedition-shortcut"><strong>⚔ Ekspedycje frakcyjne</strong><p class="small muted">Bossowie i wspólne wyprawy pozostają w istniejącej zakładce Ekspedycje.</p></div></div></div>${basePanel}${managePanel}</section>`;
}
async function change(fn){if(busy||loading)return;busy=true;error='';info='';redraw();try{const text=await fn();info=text||'Zapisano zmiany.';const id=identity(),n=++requests;const data=await rpc('ashen_clan_state');if(n===requests&&id===identity()){state=data;await loadBase();}}catch(e){setError(e)}finally{busy=false;redraw()}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-base-deposit')){
  const kind=document.getElementById('base-kind')?.value,amount=Number(document.getElementById('base-amount')?.value);
  if(!resourceSpecs.some(x=>x.key===kind)||!Number.isSafeInteger(amount)||amount<1||amount>5000){error='Wpisz liczbę od 1 do 5000.';redraw();return}
  const local=window.ASHEN_FACTION_WALLET?.()||{};
  if(num(local[kind])<amount){error='Nie masz tylu materiałów w aktywnej postaci.';redraw();return}
  if(!confirm(`Wpłacić ${amount} × ${resourceName(kind)} do wspólnej bazy? Nie można cofnąć wpłaty.`))return;
  void baseAction(async()=>{
   if(cloud()?.getBoundSlot()!==cloud()?.currentSlot())throw Error('Połącz aktywny profil z kontem online.');
   // Block concurrent automatic publication while server debits the cloud save.
   await window.ASHEN_ONLINE?.pauseSync?.();
   try{
    await rpc('ashen_faction_base_deposit',{p_kind:kind,p_amount:amount});
    try{window.ASHEN_FACTION_APPLY_PAYMENT?.(kind,amount)}catch(e){
     error='Wpłata zatwierdzona na serwerze. Zapis lokalny wymaga ręcznej synchronizacji; nie wysyłaj starej postaci do chmury.';throw e;
    }
    info=`Wpłacono ${amount} × ${resourceName(kind)}.`;
   }finally{window.ASHEN_ONLINE?.resumeSync?.()}
  });return;
 }
 if(b.dataset.baseBuild){const building=b.dataset.baseBuild;
  if(!buildingSpecs.some(x=>x.id===building))return;
  if(!confirm('Rozbudować budynek za zasoby frakcji?'))return;
  void baseAction(async()=>{await rpc('ashen_faction_base_build',{p_building:building});info='Budynek rozbudowany!'});return;
 }
 if(b.hasAttribute('data-clan-profile')){window.ASHEN_OPEN_PLAYER?.(b.dataset.clanProfile);return}
 if(b.hasAttribute('data-clan-refresh')){void refresh();return}
 if(b.hasAttribute('data-clan-create')){const p_name=document.getElementById('clan-name')?.value?.trim(),p_tag=document.getElementById('clan-tag')?.value?.trim(),p_description=document.getElementById('clan-description')?.value||'';if(!p_name||!p_tag){error='Podaj nazwę i skrót.';redraw();return}if(!confirm(`Utworzyć frakcję „${p_name}” [${p_tag.toUpperCase()}]?`))return;void change(async()=>{await rpc('ashen_clan_create',{p_name,p_tag,p_description});return 'Frakcja utworzona!'})}
 if(b.hasAttribute('data-clan-invite')){const p_recipient=document.getElementById('clan-target')?.value;if(!p_recipient)return;void change(async()=>{await rpc('ashen_clan_invite',{p_recipient});return 'Zaproszenie wysłane.'})}
 if(b.hasAttribute('data-clan-accept')){const p_invite=Number(b.dataset.clanAccept);void change(async()=>{await rpc('ashen_clan_respond',{p_invite,p_accept:true});return 'Dołączono do frakcji.'})}
 if(b.hasAttribute('data-clan-reject')){const p_invite=Number(b.dataset.clanReject);void change(async()=>{await rpc('ashen_clan_respond',{p_invite,p_accept:false});return 'Zaproszenie odrzucone.'})}
 if(b.dataset.clanManage){const action=b.dataset.clanManage,target=b.dataset.clanTarget;if(action==='kick'&&!confirm('Usunąć tego członka z frakcji?'))return;void change(async()=>{await rpc('ashen_clan_manage',{p_target:target,p_action:action});return 'Zmieniono uprawnienia członka.'})}
 if(b.hasAttribute('data-clan-leave')){if(!confirm('Potwierdzasz opuszczenie lub rozwiązanie frakcji?'))return;void change(async()=>{await rpc('ashen_clan_leave');return 'Opuszczono frakcję.'})}
});
window.ASHEN_CLANS={html:clanHtml,refresh};
})();
