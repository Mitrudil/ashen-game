/* ASHEN v0.3.3 — publiczny katalog i profile graczy (bez danych prywatnych). */
(()=>{'use strict';
let entries=[],loading=false,busy=false,error='',notice='',query='',opened=null,initialized='',request=0;
const cloud=()=>window.ASHEN_CLOUD,uid=()=>cloud()?.getSession()?.user?.id;
const logged=()=>Boolean(cloud()?.getClient()&&uid());
const ident=()=>[cloud()?.getProjectUrl(),uid()].join('|');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const redraw=()=>window.ASHEN_FORCE_RENDER?.();
const originName=(origin,gender)=>({scout:gender==='female'?'Zwiadowczyni':'Zwiadowca',fighter:gender==='female'?'Wojowniczka':'Wojownik',tech:gender==='female'?'Techniczka':'Technik'})[origin]||'Ocalały';
const portrait=p=>`./assets/characters/${['scout','fighter','tech'].includes(p?.origin)?p.origin:'scout'}-${p?.gender==='female'?'f':'m'}-full.png`;
async function rpc(name,args={}){if(!logged())throw Error('Zaloguj się do konta online.');const {data,error}=await cloud().getClient().rpc(name,args);if(error)throw error;return data}
async function refresh(){const i=ident(),n=++request;initialized=i;loading=true;error='';redraw();try{const next=logged()?await rpc('ashen_player_directory',{p_query:query}):[];if(n===request&&i===ident())entries=next||[]}catch(e){if(n===request)error=String(e?.message||e).slice(0,220)}finally{if(n===request){loading=false;redraw()}}}
function ensure(){const i=ident();if(initialized!==i){initialized=i;entries=[];opened=null;notice='';error='';void refresh()}}
function open(id){if(!id)return;opened=String(id);error='';notice='';redraw();if(!entries.some(p=>p.user_id===opened)){query='';void refresh()}}
function close(){opened=null;notice='';redraw()}
function playerCard(p,rank=false){return `<button type="button" class="ashen-player-row" data-ashen-player-open="${esc(p.user_id)}"><img src="${portrait(p)}" alt=""><span class="ashen-player-data"><strong>${esc(p.name)}</strong><small>${esc(originName(p.origin,p.gender))} · Poziom ${Number(p.level)||1}</small></span>${rank?`<span class="ashen-player-rank">#${Number(p.rank)||'—'}</span>`:''}<span class="ashen-player-action">Profil ›</span></button>`}
function html(){ensure();if(!logged())return '<section class="section"><h2>♙ Gracze</h2><p>Zaloguj się przez Konto online, aby wyszukiwać graczy i wysyłać im wiadomości.</p></section>';
 const p=entries.find(x=>x.user_id===opened);
 const profile=opened?`<div class="panel ashen-player-profile"><button data-ashen-player-close="1">← Wróć do rankingu</button>${p?`<div class="ashen-player-hero"><img src="${portrait(p)}" alt="${esc(p.name)}"><div><span class="tag">PROFIL GRACZA · RANKING #${Number(p.rank)||'—'}</span><h3>${esc(p.name)}</h3><p>${esc(originName(p.origin,p.gender))} · Poziom ${Number(p.level)||1}</p><p class="small muted">Ranking oparty na poziomie postaci online.</p></div></div>${p.user_id===uid()?'<p class="muted">To Twój profil.</p>':`<div class="ashen-player-compose"><h4>✉ Napisz do gracza ${esc(p.name)}</h4><textarea id="ashen-player-message" class="input" rows="4" maxlength="1500" placeholder="Wpisz wiadomość (1–1500 znaków)…"></textarea><button type="button" class="primary" data-ashen-player-send="${esc(p.user_id)}" ${busy?'disabled':''}>Wyślij wiadomość</button></div>`}`:'<p class="muted">Wczytywanie profilu…</p>'}</div>`:'';
 return `<section class="section ashen-players"><div class="ashen-player-top"><div><span class="tag">ASHEN · SPOŁECZNOŚĆ</span><h2>♙ Ranking i profile graczy</h2><p class="muted small">Wyszukuj graczy po nicku i kontaktuj się przez ich profile. Bez udostępniania e-maili.</p></div><button data-ashen-players-refresh="1" ${loading?'disabled':''}>↻ Odśwież</button></div>${error?`<div class="notice">⚠ ${esc(error)}</div>`:''}${notice?`<div class="notice">✓ ${esc(notice)}</div>`:''}<div class="panel"><form id="ashen-player-search-form" class="ashen-player-search"><input id="ashen-player-query" class="input" value="${esc(query)}" maxlength="40" placeholder="Szukaj po nicku…"><button type="submit" class="primary">Szukaj</button>${query?'<button type="button" data-ashen-players-clear="1">Wyczyść</button>':''}</form>${loading?'<p class="muted">Wczytywanie graczy…</p>':''}<div class="ashen-players-list">${entries.map(p=>playerCard(p,true)).join('')||'<p class="muted">Nie znaleziono graczy.</p>'}</div></div>${profile}</section>`
}
document.addEventListener('submit',e=>{if(e.target.id!=='ashen-player-search-form')return;e.preventDefault();query=document.getElementById('ashen-player-query')?.value.trim()||'';opened=null;void refresh()});
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-ashen-players-refresh')){void refresh();return}
 if(b.hasAttribute('data-ashen-players-clear')){query='';opened=null;void refresh();return}
 if(b.hasAttribute('data-ashen-player-open')){open(b.dataset.ashenPlayerOpen);return}
 if(b.hasAttribute('data-ashen-player-close')){close();return}
 if(b.hasAttribute('data-ashen-player-send')){if(busy)return;const p_recipient=b.dataset.ashenPlayerSend,p_body=document.getElementById('ashen-player-message')?.value.trim();if(!p_body){error='Wpisz treść wiadomości.';redraw();return}busy=true;error='';notice='';try{await rpc('ashen_online_send',{p_recipient,p_body});notice='Wiadomość została wysłana.'}catch(e){error=String(e?.message||e).slice(0,220)}finally{busy=false;redraw()}return}
});
window.ASHEN_PLAYERS={html,refresh,open,close};
})();
