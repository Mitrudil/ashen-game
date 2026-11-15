/* ASHEN v0.2.4 — optional Supabase account + private cloud save.
 * Independent of offline local profiles. No cloud PvP, no automatic sync.
 * Publishable/anon key only. NEVER use service_role/secret key here.
 */
(()=>{'use strict';
const CONFIG_KEY='ashen-cloud-config-v024';
const ACTIVE_KEY='ashen-dev-active-v021';
const SLOT_PREFIX='ashen-dev-slot-v021:';
const MAIN_KEY='ashen-save-v010';
const BACKUP_SUFFIX='-before-cloud-load-v024';
const MAX_SAVE_BYTES=1024*1024;
const STORAGE_READY=()=>typeof window.supabase?.createClient==='function';
let client=null,session=null,config=null,open=false,working=false,status='',statusError=false,cloudInfo=null,loading=false;
const $=id=>document.getElementById(id);
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function localId(){return localStorage.getItem(ACTIVE_KEY)||'main'}
function localKey(){return localId()==='main'?MAIN_KEY:SLOT_PREFIX+localId()}
function localData(){try{return JSON.parse(localStorage.getItem(localKey())||'null')}catch{return null}}
function localMeta(){const s=localData();return s&&s.created?`${s.name||'Wędrowiec'} · poziom ${s.level||1}`:'Niewykreowana postać'}
function publicKey(s){return /^(sb_publishable_[a-zA-Z0-9_-]+|eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)$/.test(s)}
function validUrl(s){try{let u=new URL(s);return u.protocol==='https:'&&/^[a-z0-9-]+\.supabase\.co$/i.test(u.hostname)&&u.pathname==='/'&&u.search===''&&u.hash===''}catch{return false}}
function loadConfig(){try{const c=JSON.parse(localStorage.getItem(CONFIG_KEY)||'null');return c&&validUrl(c.url)&&publicKey(c.key)?c:null}catch{return null}}
function formatError(e){const m=String(e?.message||e||'Nieznany błąd');return m.length>250?m.slice(0,250)+'…':m}
function show(text,error=false){status=text;statusError=error;paint()}
function createClient(){
 if(!config){client=null;session=null;return}
 if(!STORAGE_READY()){client=null;show('Nie udało się wczytać biblioteki Supabase. Sprawdź połączenie z Internetem.',true);return}
 client=window.supabase.createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'ashen-auth-v024-'+new URL(config.url).hostname}});
 client.auth.onAuthStateChange((_event,newSession)=>{session=newSession;if(open)paint()});
}
async function authInit(){if(!client)return;try{const {data,error}=await client.auth.getSession();if(error)throw error;session=data?.session||null;if(session)await readInfo();else cloudInfo=null;paint()}catch(e){show('Nie udało się przywrócić sesji: '+formatError(e),true)}}
async function readInfo(){if(!client||!session){cloudInfo=null;return}
 const {data,error}=await client.from('ashen_cloud_saves').select('character_name,character_level,updated_at').eq('user_id',session.user.id).maybeSingle();
 if(error)throw error;cloudInfo=data||null;
}
function openPanel(){open=true;paint();if(session)refreshInfo()}
function closePanel(){open=false;const el=$('ashen-cloud-dialog');if(el)el.remove()}
function paint(){
 if(!open)return;
 let panel=$('ashen-cloud-dialog');if(!panel){panel=document.createElement('div');panel.id='ashen-cloud-dialog';panel.className='ashen-cloud-overlay';document.body.appendChild(panel)}
 const connected=!!config;
 panel.innerHTML=`<div class="ashen-cloud-dialog" role="dialog" aria-modal="true" aria-label="Konto online i zapis w chmurze"><div class="ashen-cloud-head"><div><span class="tag">ASHEN 0.2.4 · PRYWATNY TEST</span><h2>Konto i zapis online</h2></div><button type="button" data-cloud-action="close" aria-label="Zamknij">✕</button></div><p class="small muted">Tryb lokalny działa nadal bez konta. Chmura przechowuje jedną kopię postaci na konto, wyłącznie na Twoje żądanie. PvP i wiadomości pozostają na razie lokalne.</p>${status?`<p class="ashen-cloud-alert ${statusError?'error':''}" role="status">${html(status)}</p>`:''}
 ${!connected?`<div class="ashen-cloud-section"><h3>1. Połącz prywatny projekt Supabase</h3><p class="small muted">Użyj adresu projektu i klucza <b>publishable</b> albo starszego <b>anon</b>. Nigdy nie wklejaj klucza secret/service_role.</p><label for="cloud-url">Project URL</label><input class="input" id="cloud-url" type="url" placeholder="https://twoj-projekt.supabase.co" autocomplete="off"><label for="cloud-key">Publishable / anon key</label><input class="input" id="cloud-key" type="text" placeholder="sb_publishable_..." autocomplete="off"><div class="actions"><button class="primary" data-cloud-action="configure">Zapisz połączenie w tej przeglądarce</button></div></div>`:
 !session?`<div class="ashen-cloud-section"><h3>Zaloguj się do ASHEN</h3><p class="small muted">Po utworzeniu konta może być wymagane potwierdzenie adresu e-mail.</p><label for="cloud-email">Adres e-mail</label><input class="input" id="cloud-email" type="email" maxlength="254" autocomplete="email" placeholder="twoj@email.pl"><label for="cloud-password">Hasło</label><input class="input" id="cloud-password" type="password" minlength="8" autocomplete="current-password" placeholder="Minimum 8 znaków"><div class="actions"><button class="primary" data-cloud-action="login" ${working?'disabled':''}>Zaloguj</button><button data-cloud-action="signup" ${working?'disabled':''}>Utwórz konto</button><button data-cloud-action="disconnect">Zmień projekt</button></div></div>`:
 `<div class="ashen-cloud-section"><h3>Zalogowano: ${html(session.user.email||'konto')}</h3><p class="small muted">Aktywny profil lokalny: <b>${html(localMeta())}</b> (${html(localId())}).</p><div class="ashen-cloud-save"><div><span class="tag">ZAPIS W CHMURZE</span><p>${cloudInfo?`${html(cloudInfo.character_name)} · poziom ${html(cloudInfo.character_level)}<br><small>Aktualizacja: ${html(new Date(cloudInfo.updated_at).toLocaleString('pl-PL'))}</small>`:'Brak zapisu na tym koncie'}</p></div></div><p class="small muted">Wysyłanie zastępuje poprzednią kopię w chmurze. Pobieranie zastępuje tylko aktywny profil lokalny, po potwierdzeniu i wykonaniu kopii bezpieczeństwa.</p><div class="actions"><button class="primary" data-cloud-action="upload" ${working?'disabled':''}>↑ Wyślij aktualną postać</button><button data-cloud-action="download" ${!cloudInfo||working?'disabled':''}>↓ Pobierz z chmury</button><button data-cloud-action="refresh" ${working?'disabled':''}>Odśwież dane</button></div><div class="actions" style="margin-top:12px"><button data-cloud-action="logout" ${working?'disabled':''}>Wyloguj</button><button data-cloud-action="disconnect" ${working?'disabled':''}>Zmień projekt</button></div></div>`}
 <p class="small muted">Postęp nie synchronizuje się automatycznie. Nie przechowuj w publicznym repozytorium plików JSON z zapisami ani haseł. Dane chmury chroni logowanie i RLS, ale statystyki gry nie są jeszcze weryfikowane przez serwer.</p></div>`;
}
async function refreshInfo(){if(!client||!session)return;try{await readInfo();paint()}catch(e){show('Nie udało się odczytać zapisu. Czy uruchomiono plik SQL 002_cloud_saves.sql? '+formatError(e),true)}}
async function configure(){const url=String($('cloud-url')?.value||'').trim().replace(/\/$/,'')+'/',key=String($('cloud-key')?.value||'').trim();if(!validUrl(url))throw Error('Wprowadź prawidłowy adres https://...supabase.co');if(!publicKey(key))throw Error('Użyj klucza publishable/anon. Nie wklejaj sekretnego klucza.');config={url,key};localStorage.setItem(CONFIG_KEY,JSON.stringify(config));session=null;cloudInfo=null;createClient();await authInit();show('Połączono projekt. Teraz utwórz konto albo zaloguj się.')}
async function signIn(mode){if(!client)throw Error('Projekt nie jest skonfigurowany.');const email=String($('cloud-email')?.value||'').trim(),password=String($('cloud-password')?.value||'');if(!email.includes('@')||password.length<8)throw Error('Podaj adres e-mail i hasło (minimum 8 znaków).');working=true;paint();try{const {data,error}=await (mode==='signup'?client.auth.signUp({email,password}):client.auth.signInWithPassword({email,password}));if(error)throw error;session=data?.session||null;cloudInfo=null;if(session)await readInfo();show(session?'Zalogowano. Możesz wysłać swoją postać do chmury.':'Sprawdź skrzynkę e-mail i potwierdź adres, a następnie się zaloguj.')}finally{working=false;paint()}}
function getSaveForUpload(){const raw=localStorage.getItem(localKey());if(!raw)throw Error('Aktywny profil nie ma jeszcze zapisu.');if(new Blob([raw]).size>MAX_SAVE_BYTES)throw Error('Zapis przekracza limit 1 MB. Wyeksportuj go do JSON.');const s=JSON.parse(raw);if(s?.version!==1||!s?.created||!Array.isArray(s.inventory)||!s.attrs||!s.equip)throw Error('Najpierw utwórz postać w aktywnym profilu.');return s}
async function upload(){if(!client||!session)throw Error('Najpierw się zaloguj.');const s=getSaveForUpload();if(!confirm(`Wysłać postać „${s.name}” (poziom ${s.level}) do chmury?\n\nZastąpi to poprzedni zapis na tym koncie. Nie zmieni zapisów lokalnych.`))return;working=true;paint();try{const {error}=await client.from('ashen_cloud_saves').upsert({user_id:session.user.id,save_data:s,character_name:String(s.name).slice(0,40),character_level:Math.min(100000,Number(s.level)||1)},{onConflict:'user_id'});if(error)throw error;await readInfo();show('Zapis wysłany. Pozostałe lokalne profile nie zostały zmienione.')}finally{working=false;paint()}}
async function download(){if(!client||!session)throw Error('Najpierw się zaloguj.');working=true;paint();try{const {data,error}=await client.from('ashen_cloud_saves').select('save_data').eq('user_id',session.user.id).single();if(error)throw error;const s=data?.save_data;if(!s||s.version!==1||!s.created||!Array.isArray(s.inventory)||!s.attrs||!s.equip)throw Error('Chmurowy zapis ma nieprawidłowy format.');const key=localKey(),existing=localData();if(!confirm(`Pobrać „${s.name}” (poziom ${s.level}) do aktywnego profilu?\n\nZastąpi to lokalną postać „${existing?.name||'Wędrowiec'}”. Przed zmianą powstanie kopia starego zapisu w tej przeglądarce.`))return;const apply=window.ASHEN_APPLY_CLOUD_SAVE;if(typeof apply!=='function')throw Error('Moduł gry nie jest gotowy do wczytania postaci. Odśwież stronę i spróbuj ponownie.');const result=apply(s);status=`Pobrano i wczytano: ${result.name}, poziom ${result.level}, złom: ${result.scrap}.`;statusError=false;paint()}finally{working=false;paint()}}
async function logout(){if(!client)return;const {error}=await client.auth.signOut();if(error)throw error;session=null;cloudInfo=null;show('Wylogowano. Wszystkie lokalne postacie pozostały bez zmian.')}
async function disconnect(){if(!confirm('Rozłączyć projekt Supabase w tej przeglądarce? Zapisy lokalne pozostaną bez zmian.'))return;try{if(client)await client.auth.signOut()}catch{}localStorage.removeItem(CONFIG_KEY);config=null;client=null;session=null;cloudInfo=null;show('Usunięto połączenie z projektem.')}
async function action(a){try{if(a==='close'){closePanel();return}if(a==='configure')return await configure();if(a==='login'||a==='signup')return await signIn(a);if(a==='upload')return await upload();if(a==='download')return await download();if(a==='refresh')return await refreshInfo();if(a==='logout')return await logout();if(a==='disconnect')return await disconnect()}catch(e){working=false;show(formatError(e),true)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cloud-action]');if(b){e.preventDefault();void action(b.dataset.cloudAction)}else if(e.target.closest('[data-cloud-open]')){e.preventDefault();openPanel()}else if(e.target.id==='ashen-cloud-dialog'){closePanel()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)closePanel()});
config=loadConfig();if(config){createClient();void authInit()}
window.ASHEN_CLOUD={openPanel};
})();
