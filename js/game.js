const APP_VERSION='0.4.7.3';
// Odswiezanie grafik pojazdow przy kazdym zaladowaniu strony; staly token podczas renderow.
const VEHICLE_ART_LOAD_TOKEN=Date.now();

(()=>{'use strict';const LEGACY_KEY='ashen-save-v010';const attrNames={str:'Siła',dex:'Zręczność',end:'Wytrzymałość',per:'Percepcja',int:'Inteligencja',cha:'Charyzma'};

// ASHEN 0.2.0: izolowane profile deweloperskie. To NIE jest logowanie online.
// Dotychczasowy zapis pozostaje pod tym samym kluczem, aby uniknąć resetu.
const DEV_ACTIVE='ashen-dev-active-v021';
const DEV_PROFILES='ashen-dev-profiles-v021';
const DEV_SLOT_PREFIX='ashen-dev-slot-v021:';
let devPanelOpen=false,devPendingResetId=null;
function devProfileList(){
 try{const raw=JSON.parse(localStorage.getItem(DEV_PROFILES)||'null');
  if(Array.isArray(raw)&&raw.length&&raw.length<=20&&raw.every(x=>x&&typeof x.id==='string'&&typeof x.label==='string'))return raw;
 }catch{}
 return [{id:'main',label:'Główna postać'}];
}
function devActiveId(){
 const id=localStorage.getItem(DEV_ACTIVE)||'main';
 return devProfileList().some(x=>x.id===id)?id:'main';
}
function devWriteProfiles(list){localStorage.setItem(DEV_PROFILES,JSON.stringify(list));}
function devCurrentLabel(){return devProfileList().find(x=>x.id===devActiveId())?.label||'Główna postać';}
function normalizeGender(g){return g==='female'?'female':'male';}
function normalizeOrigin(id){return ['scout','fighter','tech'].includes(id)?id:'scout';}
function genderLabel(g){return normalizeGender(g)==='female'?'Kobieta':'Mężczyzna';}
function originTitle(id,gender='male'){const g=normalizeGender(gender),o=normalizeOrigin(id);return o==='scout'?(g==='female'?'Zwiadowczyni':'Zwiadowca'):o==='fighter'?(g==='female'?'Wojowniczka':'Wojownik'):(g==='female'?'Techniczka':'Technik')}
function characterAssetBase(id='scout',gender='male'){return `${normalizeOrigin(id)}-${normalizeGender(gender)==='female'?'f':'m'}`;}
// Each profile has one authoritative save key. The historical key belongs ONLY to main.
// Migration for 0.2.0: its active slot and main backup were already saved separately.
const DEV_START_ACTIVE=devActiveId();
function devProfileSaveKey(id){return DEV_SLOT_PREFIX+id;}
function devPrepareLegacy(){
 const mainSlot=localStorage.getItem(devProfileSaveKey('main'));
 const historical=localStorage.getItem(LEGACY_KEY);
 if(DEV_START_ACTIVE==='main'){
  // Main is active: its most recent historical save wins; keep a separate copy.
  if(historical!==null)localStorage.setItem(devProfileSaveKey('main'),historical);
  else if(mainSlot!==null)localStorage.setItem(LEGACY_KEY,mainSlot);
 }else{
  // In 0.2.0 the legacy key mirrored the selected tester. Restore the main
  // player's historical key from the already preserved main slot.
  if(mainSlot!==null)localStorage.setItem(LEGACY_KEY,mainSlot);
  else if(historical!==null)localStorage.setItem(devProfileSaveKey('main'),historical);
 }
}
devPrepareLegacy();
const KEY=devActiveId()==='main'?LEGACY_KEY:devProfileSaveKey(devActiveId());
function devSwitch(id){
 devPendingResetId=null;
 const list=devProfileList(),current=devActiveId();
 if(id===current)return;
 if(!list.some(x=>x.id===id))throw Error('Nieznany profil.');
 if(localStorage.getItem(devProfileSaveKey(id))===null)throw Error('Profil nie zawiera zapisu.');
 // Only preserve the active profile; never copy its save onto another profile.
 const currentSave=localStorage.getItem(KEY);
 if(currentSave!==null)localStorage.setItem(devProfileSaveKey(current),currentSave);
 localStorage.setItem(DEV_ACTIVE,id);
 location.reload();
}
function devAskResetTestProfile(id){
 if(id==='main'||!devProfileList().some(x=>x.id===id))throw Error('Wybierz profil testowy.');
 devPendingResetId=id;devPanelOpen=true;message='';render();
}
function devResetTestProfile(id){
 if(id==='main'||devPendingResetId!==id||!devProfileList().some(x=>x.id===id))throw Error('Reset nie został potwierdzony.');
 // Never touch the main character or any other test profile.
 const key=devProfileSaveKey(id),old=localStorage.getItem(key);
 if(old!==null)localStorage.setItem(key+'-backup-before-reset',old);
 const clean=JSON.stringify(fresh());
 localStorage.setItem(key,clean);
 if(localStorage.getItem(key)!==clean)throw Error('Nie udało się zapisać nowej postaci.');
 // Always open the cleared profile, even when it was previously inactive.
 // This avoids confusing a successful reset with the unchanged current profile.
 localStorage.setItem(DEV_ACTIVE,id);
 devPendingResetId=null;
 location.reload();
}

function devCreateProfile(){
 const list=devProfileList();
 if(list.length>=5)throw Error('Dostępnych jest maksymalnie 5 slotów postaci.');
 const label=prompt('Nazwa profilu testowego (2–30 znaków):','Tester '+list.length);
 if(label===null)return;
 const safe=label.trim();
 if(safe.length<2||safe.length>30)throw Error('Nazwa powinna mieć 2–30 znaków.');
 const id='test-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
 // Dostępność miejsca sprawdzamy, zanim zapis pojawi się na liście profili.
 localStorage.setItem(devProfileSaveKey(id),JSON.stringify(fresh()));
 try{devWriteProfiles([...list,{id,label:safe}]);}
 catch(e){localStorage.removeItem(devProfileSaveKey(id));throw e;}
 devSwitch(id);
}
function devDeleteProfile(id){
 devPendingResetId=null;
 if(id==='main')throw Error('Profilu głównego nie można usunąć.');
 if(id===devActiveId())throw Error('Najpierw przełącz się na inny profil.');
 const list=devProfileList();
 if(!list.some(x=>x.id===id))throw Error('Profil nie istnieje.');
 if(!confirm('Usunąć profil testowy i jego lokalny zapis? Tej operacji nie można cofnąć.'))return;
 devWriteProfiles(list.filter(x=>x.id!==id));
 localStorage.removeItem(devProfileSaveKey(id));
 devPanelOpen=true;
 render();
}
function devProfileState(id){
 const key=id==='main'?LEGACY_KEY:devProfileSaveKey(id);
 try{return JSON.parse(localStorage.getItem(key)||'null')||fresh()}catch{return fresh()}
}
function devProfileCard(p,active){
 const snap=devProfileState(p.id),gender=normalizeGender(snap.gender),origin=normalizeOrigin(snap.origin),created=!!snap.created;
 const title=created?escape(snap.name||p.label):escape(p.label);
 const subtitle=created?`${originTitle(origin,gender)} · ${genderLabel(gender)} · Poziom ${snap.level||1}`:`Nowy slot postaci`;
 return `<article class="dev-profile-card ${p.id===active?'active':''}"><div class="dev-profile-art"><img src="${characterFigure(origin,gender)}" alt="${originTitle(origin,gender)}"></div><div class="dev-profile-body"><div class="tag">${p.id==='main'?'GŁÓWNA POSTAĆ':'PROFIL TESTOWY'}${p.id===active?' · aktywny':''}</div><h4>${title}</h4><p class="small muted">${subtitle}</p><div class="dev-profile-actions">${p.id!==active?`<button type="button" data-dev-switch="${escape(p.id)}">Przełącz</button>`:''}${p.id!=='main'?`<button type="button" data-dev-reset="${escape(p.id)}">Nowa postać / reset</button>`:''}${p.id!=='main'&&p.id!==active?`<button type="button" data-dev-delete="${escape(p.id)}">Usuń</button>`:''}</div></div></article>`
}
function devPanel(){
 const active=devActiveId(),pending=devProfileList().find(p=>p.id===devPendingResetId&&p.id!=='main');
 const profiles=devProfileList();
 return `<section class="dev-profile-panel"><div class="dev-profile-panel-head"><strong>Profile lokalne — laboratorium multiplayer</strong><span class="tag">0.2.1 · OFFLINE</span></div><p class="small muted">Docelowo masz do dyspozycji 5 slotów postaci. Każdy profil ma własny zapis, własny ekwipunek i niezależną historię. Główna postać nie jest resetowana.</p><div class="dev-profile-grid">${profiles.map(p=>devProfileCard(p,active)).join('')}${profiles.length<5?`<button type="button" class="dev-profile-add" data-dev-create="1"><span>＋</span><strong>Dodaj postać testową</strong><small>Wolny slot ${profiles.length+1}/5</small></button>`:''}</div>${pending?`<div class="notice" role="alert"><strong>Reset profilu: ${escape(pending.label)}</strong><p>Usunie postać, jej ekwipunek, statystyki i historię. Zachowamy lokalną kopię tego Testera, a następnie od razu otworzymy tworzenie nowej postaci.</p><div class="actions"><button type="button" class="primary" data-dev-reset-confirm="${escape(pending.id)}">Tak, zresetuj i otwórz Testera</button><button type="button" data-dev-reset-cancel="1">Anuluj</button></div></div>`:''}<p class="small muted">Przed zmianą urządzenia wyeksportuj zapisy każdej postaci osobno. Profile nie są synchronizowane między urządzeniami.</p></section>`;
}

const rarities=[{name:'Zwykły',color:'#b8bfc3',weight:58,mult:1},{name:'Ulepszony',color:'#8ac78b',weight:25,mult:1.14},{name:'Rzadki',color:'#77afe5',weight:12,mult:1.32},{name:'Epicki',color:'#c391e4',weight:4,mult:1.58},{name:'Legendarny',color:'#f2bb65',weight:1,mult:1.95}];
const items=[
{id:'knife',name:'Zardzewiały nóż',flavor:'Nóż wyciągnięty ze zgliszcz. Zardzewiały, ale nadal ostry.',slot:'weapon',min:8,max:13,bonus:{}},{id:'pistol',name:'Pistolet M-9',flavor:'Niezawodny, choć zużyty pistolet znaleziony na Pustkowiach.',slot:'weapon',min:12,max:18,bonus:{}},{id:'rifle',name:'Karabin szabrownika',slot:'weapon',min:18,max:27,bonus:{per:2}},{id:'shotgun',name:'Strzelba pustkowi',slot:'weapon',min:25,max:38,bonus:{dex:-1}},
{id:'pipe',name:'Żelazna rura',flavor:'Ciężka rura z resztek instalacji. Niepozorna, lecz skuteczna w zwarciu.',slot:'weapon',min:6,max:10,bonus:{}},{id:'revolver',name:'Rewolwer Strażnika',flavor:'Rewolwer o masywnym bębnie, dawniej używany przez strażników.',slot:'weapon',min:19,max:28,bonus:{}},{id:'machete',name:'Maczeta zbieracza',flavor:'Maczeta przystosowana do przecinania zarośli i walki na bliski dystans.',slot:'weapon',min:16,max:24,bonus:{}},{id:'smg',name:'Pistolet maszynowy Viper',flavor:'Kompaktowy pistolet maszynowy, ceniony za szybkostrzelność.',slot:'weapon',min:22,max:32,bonus:{}},{id:'crossbow',name:'Kusza tropiciela',slot:'weapon',min:18,max:28,bonus:{per:2}},{id:'carbine',name:'Karabinek warty',slot:'weapon',min:21,max:31,bonus:{per:1}},{id:'hammer',name:'Młot złomiarza',slot:'weapon',min:21,max:33,bonus:{str:2,dex:-1}},{id:'sniper',name:'Karabin dalekiego zasięgu',slot:'weapon',min:29,max:44,bonus:{per:3}},{id:'flame',name:'Miotacz żaru',slot:'weapon',min:29,max:45,bonus:{int:2}},{id:'rail',name:'Prototypowa broń szynowa',slot:'weapon',min:27,max:42,bonus:{int:3}},{id:'cleaver',name:'Tasak z pustkowi',flavor:'Tasak z grubym ostrzem. Ślady po szlifowaniu zdradzają częste naprawy.',slot:'weapon',min:10,max:16,bonus:{}},
{id:'jacket',name:'Podarta kurtka',flavor:'Rozdarta kurtka z grubego płótna. Chroni przede wszystkim przed zimnem, a nie przed ostrzem.',slot:'armor',armor:2,bonus:{}},{id:'vest',name:'Kamizelka z płytami',flavor:'Prowizoryczna kamizelka z nitowanymi stalowymi płytami. Ciężka, ale odporna na uderzenia.',slot:'armor',armor:8,bonus:{end:1}},{id:'military',name:'Pancerz zwiadowcy',flavor:'Oliwkowy pancerz zwiadowcy, pozwalający poruszać się bez nadmiernego hałasu.',slot:'armor',armor:11,bonus:{dex:1}},{id:'coat',name:'Płaszcz wędrowca',flavor:'Długi płaszcz podróżnika ze wzmocnionymi szwami i wieloma ukrytymi kieszeniami.',slot:'armor',armor:4,bonus:{per:1}},{id:'leather',name:'Skórzany kaftan',flavor:'Gruby skórzany kaftan, zszyty z kilku warstw materiału i utwardzony przy barkach.',slot:'armor',armor:6,bonus:{dex:1}},{id:'hazmat',name:'Kombinezon skażeniowy',flavor:'Uszczelniony kombinezon z maską i filtrami. Dodatkowe osłony zwiększają jego wytrzymałość.',slot:'armor',armor:13,bonus:{end:2}},{id:'riot',name:'Pancerz oddziałów porządkowych',flavor:'Solidny pancerz formacji porządkowych z dużymi osłonami tułowia i ramion.',slot:'armor',armor:16,bonus:{end:1}},{id:'kevlar',name:'Kevlar warty',flavor:'Wielowarstwowy zestaw kevlarowy odzyskany z wyposażenia przedwojennej Warty.',slot:'armor',armor:19,bonus:{dex:1}},{id:'exosuit',name:'Egzoszkielet górnika',flavor:'Górniczy szkielet wspomagający, z hydraulicznymi ramionami i ciężką osłoną klatki piersiowej.',slot:'armor',armor:23,bonus:{str:2}},{id:'sentinel',name:'Pancerz strażnika Zero',flavor:'Wzmocniony pancerz Strażnika Zero. Jeden z najrzadszych reliktów dawnej technologii.',slot:'armor',armor:28,bonus:{end:3}},
{id:'goggles',name:'Gogle zwiadowcy',flavor:'Zmatowiałe, terenowe gogle pomagające wypatrywać ruchu i osłaniające oczy przed pyłem.',slot:'accessory',bonus:{per:2}},{id:'gloves',name:'Rękawice technika',slot:'accessory',bonus:{int:2}},{id:'mask',name:'Maska filtracyjna',flavor:'Dwu-filtrowa półmaska z zapasowymi wkładami. Używana do eksploracji zadymionych ruin.',slot:'accessory',armor:2,bonus:{end:2}},{id:'compass',name:'Kompas tropiciela',flavor:'Wysłużony kompas polowy ułatwiający orientację w ruinach i szybką zmianę kierunku.',slot:'accessory',bonus:{dex:1,per:1}},{id:'bracelet',name:'Bransoleta strażnika',flavor:'Ciężka bransoleta z przedwojennego posterunku. Dodaje pewności ciosu.',slot:'accessory',bonus:{str:1}},{id:'radio',name:'Moduł łączności',flavor:'Przenośny moduł radiowy z improwizowaną anteną. Poprawia koordynację i wymianę informacji.',slot:'accessory',bonus:{int:1,cha:1}},{id:'scope',name:'Celownik optyczny',slot:'accessory',bonus:{per:3}},{id:'injector',name:'Wzmacniacz odruchów',slot:'accessory',bonus:{dex:2}},{id:'badge',name:'Naszyjnik ocalałego',flavor:'Składany z odzyskanych drobiazgów naszyjnik – symbol człowieka, który już zbyt wiele przetrwał.',slot:'accessory',bonus:{cha:1}},{id:'module',name:'Moduł neurotechniczny',slot:'accessory',bonus:{int:3}},
// ASHEN v0.3.6 — dziewięć unikatowych łupów z pierwszych trzech bossów.
// Dostępne wyłącznie w puli nagród za ekspedycje, nie są zwykłym łupem z misji.
{id:'boss1_cleaver',name:'Tasak Rzeźnika',flavor:'Oryginalna broń władcy Złomowiska. Ślady na ostrzu mówią więcej niż opowieści szabrowników.',slot:'weapon',min:18,max:28,bonus:{str:1}},
{id:'boss1_hook',name:'Hak Rozpruwacza',flavor:'Zardzewiały hak Rzeźnika, przerobiony do walki w zwarciu.',slot:'weapon',min:16,max:25,bonus:{dex:2}},
{id:'boss1_plate',name:'Płyta ze Złomowiska',flavor:'Pamiątka z pierwszego obozu szabrowników, noszona jak pancerz.',slot:'armor',armor:13,bonus:{end:2,dex:-1}},
{id:'boss2_fang',name:'Zatruty Kieł Pożeracza',flavor:'Ostry kieł wyrwany mutantowi. Toksyczna historia wciąż budzi strach.',slot:'weapon',min:21,max:33,bonus:{dex:2,per:1}},
{id:'boss2_hide',name:'Skóra Skażonego Łowcy',flavor:'Wzmocniony kombinezon z fragmentami skóry bestii z kanałów.',slot:'armor',armor:17,bonus:{end:2}},
{id:'boss2_eye',name:'Oko z Głębin',flavor:'Niezwykły sensor z pozostałości biologicznych Pożeracza.',slot:'accessory',bonus:{per:3}},
{id:'boss3_nailgun',name:'Gwoździarka Mechanika',flavor:'Seryjnie modyfikowany miotacz gwoździ Brata Mechanika.',slot:'weapon',min:25,max:36,bonus:{per:2}},
{id:'boss3_plate',name:'Pancerz Braci Rdzy',flavor:'Ciężkie blachy zakładane przez tarczownika w Opuszczonej Fabryce.',slot:'armor',armor:22,bonus:{end:3,dex:-2}},
{id:'boss3_rifle',name:'Karabin Ostatniego Brata',flavor:'Precyzyjna broń wyciągnięta z rąk Brata Strzelca.',slot:'weapon',min:27,max:40,bonus:{per:3}},
{id:'scrap',name:'Złom',slot:'material',bonus:{}},{id:'circuits',name:'Elektronika',slot:'material',bonus:{}},{id:'fuel',name:'Paliwo',slot:'material',bonus:{}},{id:'chemicals',name:'Chemikalia',slot:'material',bonus:{}},{id:'parts',name:'Części zamienne',slot:'material',bonus:{}}];

// ASHEN v0.1.48 — artefakty mają własne prefiksy i sufiksy.
// Zestaw powstaje z trzech osobno założonych egzemplarzy artefaktów o wspólnym modyfikatorze. Powtórzone typy są dozwolone.
// Prefiks i sufiks mogą tworzyć odrębne rezonanse; główną nagrodą jest Szczęście.
const ARTIFACT_PREFIX_SETS=Object.freeze({
 art_fortunate:{name:'Pomyślny',luck:4,explore:0,bonus:{},description:'Szczęście +4'},
 art_echo:{name:'Nasłuchujący',luck:3,explore:5,bonus:{},description:'Szczęście +3 · Eksploracja +5 p.p.'},
 art_ward:{name:'Osłonowy',luck:2,explore:0,bonus:{end:2},description:'Szczęście +2 · Wytrzymałość +2'}
});
const ARTIFACT_SUFFIX_SETS=Object.freeze({
 art_find:{name:'Odkrywcy',luck:3,explore:0,bonus:{},description:'Szczęście +3'},
 art_path:{name:'Wędrowca',luck:2,explore:5,bonus:{},description:'Szczęście +2 · Eksploracja +5 p.p.'},
 art_survive:{name:'Ocalałego',luck:2,explore:0,bonus:{end:1},description:'Szczęście +2 · Wytrzymałość +1'}
});
const artifactPrefixDefs=[
 {id:'art_fortunate',name:'Pomyślny',forms:{m:'Pomyślny',f:'Pomyślna',p:'Pomyślne'},luck:1,on:'artifact'},
 {id:'art_echo',name:'Nasłuchujący',forms:{m:'Nasłuchujący',f:'Nasłuchująca',p:'Nasłuchujące'},luck:1,on:'artifact'},
 {id:'art_ward',name:'Osłonowy',forms:{m:'Osłonowy',f:'Osłonowa',p:'Osłonowe'},luck:1,on:'artifact'}
];
const artifactSuffixDefs=[
 {id:'art_find',name:'Odkrywcy',luck:1,on:'artifact'},
 {id:'art_path',name:'Wędrowca',luck:1,on:'artifact'},
 {id:'art_survive',name:'Ocalałego',luck:1,on:'artifact'}
];
const artifactItems=[
 {id:'ash_needle',name:'Igła północy',flavor:'Drga nawet w bezwietrznej ciszy. Nie wskazuje kierunku, tylko miejsca, które ktoś zapomniał.',slot:'extra',artifact:true,artifactSet:'seeker',artifactLuck:1,artifactSign:'✧',bonus:{per:1}},
 {id:'ash_eye',name:'Oko martwej strefy',flavor:'Matowe szkiełko, w którym błyskają światła nieistniejących zabudowań.',slot:'extra',artifact:true,artifactSet:'seeker',artifactLuck:1,artifactSign:'◉',bonus:{int:1}},
 {id:'ash_dust',name:'Pył wspomnień',flavor:'Pył zamknięty w starej fiolce. Układa się w ślady stóp, gdy nikt nie patrzy.',slot:'extra',artifact:true,artifactSet:'seeker',artifactLuck:2,artifactSign:'✺',bonus:{dex:1}},
 {id:'ash_core',name:'Rdzeń szkwału',flavor:'Ciepły fragment metalu, który pulsuje jakby był częścią czegoś żywego.',slot:'extra',artifact:true,artifactSet:'guardian',artifactLuck:1,artifactSign:'✹',bonus:{end:1}},
 {id:'ash_ember',name:'Żar bez płomienia',flavor:'Zaczerwieniony kamień oddający ciepło dopiero w chwili zagrożenia.',slot:'extra',artifact:true,artifactSet:'guardian',artifactLuck:1,artifactSign:'◆',bonus:{str:1}},
 {id:'ash_shard',name:'Odłamek ciszy',flavor:'Ciemny kryształ, przy którym odgłosy broni brzmią jak dalekie echo.',slot:'extra',artifact:true,artifactSet:'guardian',artifactLuck:1,artifactSign:'◇',bonus:{per:1}}
];
items.push(...artifactItems);
function resonanceResults(){
 const worn=['extra','extra2','extra3'].map(slot=>({slot,inst:instance(state.equip?.[slot])})).filter(x=>x.inst&&def(x.inst)?.artifact);
 const results=[];
 for(const [kind,configs] of [['prefix',ARTIFACT_PREFIX_SETS],['suffix',ARTIFACT_SUFFIX_SETS]])for(const [id,config] of Object.entries(configs)){
  // Liczymy fizyczne egzemplarze (UID), nie typy przedmiotów (id).
  // Każdy slot jest odwiedzany raz; zabezpieczenie UID chroni przed
  // ewentualnym błędnym zapisem tego samego egzemplarza w kilku slotach.
  const seenUids=new Set(),members=[];
  for(const row of worn){
   if(row.inst[kind]!==id||seenUids.has(row.inst.uid))continue;
   seenUids.add(row.inst.uid);members.push(row);
  }
  if(members.length)results.push({id,kind,config,members,count:members.length,active:members.length>=3});
 }
 return results;
}
function resonanceBonuses(){
 const active=resonanceResults().filter(x=>x.active),bonus={};let luck=0,explore=0;
 for(const r of active){luck+=r.config.luck;explore+=r.config.explore;for(const [key,v] of Object.entries(r.config.bonus||{}))bonus[key]=(bonus[key]||0)+v}
 return {active,bonus,luck,explore};
}
function resonancePanel(){
 const results=resonanceResults();
 const cards=results.map(r=>`<div class="ashen-resonance-card ${r.active?'active':'pending'}"><div class="ashen-resonance-title"><strong>${r.kind==='prefix'?'Prefiks':'Sufiks'}: ${escape(r.config.name)}</strong><span>${r.count}/3 · ${r.active?'AKTYWNY':'NIEAKTYWNY'}</span></div><p class="small ${r.active?'good':'muted'}">${escape(r.config.description)}</p><div class="ashen-resonance-members">${r.members.map(m=>`<span class="found">✓ ${escape(statsOf(m.inst).name)} · ${escape(slotLabels[m.slot])}</span>`).join('')}</div>${r.active?'':'<div class="small muted">Brakuje '+(3-r.count)+' '+(3-r.count===1?'założonego artefaktu':'założonych artefaktów')+' z tym modyfikatorem.</div>'}</div>`).join('');
 return `<section class="ashen-resonance-panel"><h3>◈ Rezonans artefaktów</h3><p class="small muted">Każdy artefakt ma bazowe Szczęście i może mieć prefiks oraz sufiks. <strong>Trzy założone egzemplarze artefaktów z tym samym prefiksem lub sufiksem (mogą być identyczne)</strong> uruchamiają bonus zestawu. Zwykłe akcesoria nie liczą się do rezonansu. Prefiks i sufiks to dwa niezależne typy zestawów.</p><div class="ashen-resonance-grid">${cards||'<div class="ashen-resonance-card">Załóż artefakt z modyfikatorem, aby zobaczyć postęp zestawu.</div>'}</div></section>`;
}
function artifactDetailPanel(inst){
 const d=def(inst);if(!d?.artifact)return '';
 const equipped=Object.values(state.equip).includes(inst.uid),results=resonanceResults(),names=[];
 for(const [kind,configs] of [['prefix',ARTIFACT_PREFIX_SETS],['suffix',ARTIFACT_SUFFIX_SETS]]){
  const id=inst[kind],cfg=configs[id];if(!cfg)continue;
  const r=results.find(x=>x.kind===kind&&x.id===id),count=r?.count||0,active=equipped&&r?.active;
  names.push(`<div class="ashen-artifact-affix ${active?'is-active':'is-pending'}"><strong>${kind==='prefix'?'Prefiks':'Sufiks'}: ${escape(cfg.name)} · ${count}/3 · ${active?'AKTYWNY':'NIEAKTYWNY'}</strong><div>${escape(cfg.description)}</div><div class="small">${active?'Komplet trzech założonych artefaktów.':!equipped?'Ten artefakt nie jest założony; wybierz jeden ze slotów 1–3.':`Do aktywacji brakuje ${Math.max(0,3-count)} ${3-count===1?'założonego artefaktu':'założonych artefaktów'} z tym modyfikatorem.`}</div>${r?.members?.length?`<details><summary>Elementy zestawu</summary>${r.members.map(m=>`<div>${escape(statsOf(m.inst).name)}</div>`).join('')}</details>`:''}</div>`);
 }
 return `<section class="ashen-artifact-detail"><strong>◈ Rezonans i Szczęście</strong><p class="small">Bazowe Szczęście: +${d.artifactLuck||0}. Bonusy prefiksu i sufiksu działają również bez kompletu.</p>${names.join('')||'<p class="small">Ten artefakt nie ma jeszcze modyfikatorów.</p>'}</section>`;
}

// Nowy model slotów: dwie ręce i osobne elementy ubioru.
const extraItems=[
{id:'wrench',name:'Klucz francuski',flavor:'Solidny klucz z warsztatu; jego szczęki są wyszczerbione od uderzeń.',slot:'hand1',min:7,max:12,bonus:{}},{id:'hatchet',name:'Toporek z odzysku',flavor:'Mały toporek z odzysku, osadzony na prowizorycznym trzonku.',slot:'hand1',min:12,max:18,bonus:{}},{id:'baton',name:'Pałka ochroniarza',flavor:'Krótka pałka dawnej ochrony. Wytarty uchwyt pamięta lepsze czasy.',slot:'hand1',min:5,max:8,bonus:{}},{id:'saber',name:'Szabla konwojenta',flavor:'Długa, wyszczerbiona szabla ze starego konwoju.',slot:'hand1',min:14,max:21,bonus:{}},{id:'deserteagle',name:'Pistolet pustynny',flavor:'Ciężki pistolet dużego kalibru. Wymaga pewnej ręki.',slot:'hand1',min:16,max:24,bonus:{}},
{id:'crowbar',name:'Łom zbrojony',slot:'hand2',min:15,max:23,bonus:{str:1}},{id:'sledge',name:'Młot wyburzeniowy',slot:'hand2',min:32,max:50,bonus:{str:3,dex:-1}},{id:'lmg',name:'Karabin maszynowy PK',slot:'hand2',min:34,max:51,bonus:{end:1}},{id:'harpoon',name:'Wyrzutnia harpunów',slot:'hand2',min:23,max:36,bonus:{per:2}},
{id:'jeans',name:'Wytarte dżinsy',flavor:'Wielokrotnie cerowane dżinsy z naszywkami i przetartymi kolanami. Tanie, ale zaskakująco trwałe.',slot:'pants',armor:1,bonus:{}},{id:'cargo',name:'Spodnie transportowca',flavor:'Grube spodnie robocze z dodatkowymi kieszeniami. Lubiane przez kurierów i tragarzy z ruin.',slot:'pants',armor:2,bonus:{end:1}},{id:'scoutpants',name:'Spodnie zwiadowcy',flavor:'Lekkie spodnie terenowe ułatwiające cichy ruch i szybkie pokonywanie przeszkód.',slot:'pants',armor:3,bonus:{dex:2}},{id:'kevlarpants',name:'Spodnie z kevlaru',flavor:'Wzmocnione spodnie z kevlarowymi wkładami. Zapewniają dobrą ochronę bez pełnej utraty mobilności.',slot:'pants',armor:6,bonus:{end:1}},{id:'radiopants',name:'Spodnie izolacyjne',flavor:'Spodnie robocze z warstwą ochronną przeciw pyłom i skażeniu. Popularne w strefach technicznych.',slot:'pants',armor:5,bonus:{int:1}},
{id:'sneakers',name:'Zniszczone trampki',flavor:'Lekkie, sfatygowane trampki. Dają swobodę ruchu, ale słabo chronią stopy.',slot:'boots',armor:1,bonus:{dex:1}},{id:'workboots',name:'Buty robocze',flavor:'Ciężkie buty z twardą podeszwą i zużytą skórą. Niezawodne podczas długiej roboty w ruinach.',slot:'boots',armor:2,bonus:{end:1}},{id:'combatboots',name:'Buty wojskowe',flavor:'Sznurowane buty bojowe z wysoką cholewą. Stabilne i odporne na trudny teren.',slot:'boots',armor:4,bonus:{str:1}},{id:'silentboots',name:'Buty cichego kroku',flavor:'Wyciszone obuwie zwiadowcze z miękką podeszwą. Dobre dla tych, którzy wolą pozostać niezauważeni.',slot:'boots',armor:3,bonus:{dex:2}},{id:'hazboots',name:'Buty trapera',flavor:'Solidne buty terenowe z grubą podeszwą i dodatkowymi osłonami. Sprawdzają się w błocie, gruzie i chłodzie.',slot:'boots',armor:5,bonus:{end:2}},
{id:'tshirt',name:'Bawełniany T-shirt',flavor:'Sprany, połatany T-shirt z odzysku. Nie zapewnia ochrony, lecz łatwo go naprawić.',slot:'shirt',armor:0,bonus:{}},{id:'thermal',name:'Koszulka termiczna',flavor:'Wielowarstwowa, termiczna koszulka na chłodne noce i długie marsze.',slot:'shirt',armor:1,bonus:{end:1}},{id:'scoutshirt',name:'Koszulka zwiadowcza',flavor:'Oliwkowa koszula terenowa z wzmocnieniami i kieszeniami na wyposażenie.',slot:'shirt',armor:2,bonus:{per:2}},{id:'armorshirt',name:'Koszulka wzmocniona',flavor:'Miękka zbroja tekstylna ze wstawkami ochronnymi. Najsolidniejsza koszulka w tej grupie.',slot:'shirt',armor:4,bonus:{end:1}},{id:'techshirt',name:'Koszulka technika',flavor:'Odzież warsztatowa z odpornymi na otarcia panelami i kieszeniami na narzędzia.',slot:'shirt',armor:3,bonus:{int:2}},
{id:'cap',name:'Wytarta czapka',flavor:'Wysłużona czapka z daszkiem, pozszywana w kilku miejscach.',slot:'head',armor:0,bonus:{}},{id:'helmet',name:'Hełm patrolowy',flavor:'Zużyty hełm z przedwojennego posterunku, nadal skuteczny przeciw uderzeniom.',slot:'head',armor:4,bonus:{end:1}},{id:'hood',name:'Kaptur zwiadowcy',flavor:'Lekki kaptur maskujący twarz przed pyłem i wzrokiem obcych.',slot:'head',armor:1,bonus:{dex:2}},{id:'maskhelm',name:'Hełm przeciwgazowy',flavor:'Zintegrowany hełm ochronny z wizjerem i filtrem powietrza.',slot:'head',armor:5,bonus:{per:1}},{id:'commanderhelm',name:'Hełm dowódcy',flavor:'Ciężki hełm z modułami łączności i znakami dawnej formacji dowódczej.',slot:'head',armor:7,bonus:{cha:2}},
{id:'scarf',name:'Szal wędrowca',flavor:'Wielokrotnie cerowany szal chroniący przed pyłem i chłodem.',slot:'extra',armor:0,bonus:{end:1}},{id:'neckwarmer',name:'Komin filtrujący',flavor:'Awaryjny komin z prostą warstwą filtrującą. Nadal przydatny, choć ustępuje nowszym akcesoriom.',slot:'extra',armor:0,bonus:{end:2}},{id:'dustglasses',name:'Okulary technika',flavor:'Warsztatowe okulary z dodatkowymi wzmocnieniami. Pomagają dostrzec detale i schematy.',slot:'extra',armor:0,bonus:{int:2}},{id:'nightgoggles',name:'Gogle noktowizyjne',flavor:'Zaawansowane gogle z trybem nocnym. Rzadki, wartościowy sprzęt zwiadowczy.',slot:'extra',armor:0,bonus:{per:3}},{id:'bandana',name:'Bandana zbieracza',flavor:'Nosi ślady wielu wypraw. Daje praktyczną osłonę twarzy i przydatny spryt terenowy.',slot:'extra',armor:0,bonus:{per:1}},
];
extraItems.push(
{id:'fingerless',name:'Rękawiczki bez palców',slot:'hands',armor:0,bonus:{}},
{id:'workgloves',name:'Rękawice robocze',slot:'hands',armor:1,bonus:{}},
{id:'tacticalgloves',name:'Rękawice taktyczne',slot:'hands',armor:2,bonus:{}},
{id:'leathergloves',name:'Skórzane rękawice',slot:'hands',armor:1,bonus:{}},
{id:'steelbracers',name:'Stalowe karwasze',slot:'hands',armor:4,bonus:{}},
{id:'scoutbracers',name:'Karwasze zwiadowcy',slot:'hands',armor:3,bonus:{}},
{id:'kevlarbracers',name:'Karwasze kevlarowe',slot:'hands',armor:5,bonus:{}},
{id:'zerobracers',name:'Karwasze strażnika Zero',slot:'hands',armor:8,bonus:{}}
);
items.push(...extraItems);
const twoHandIds=new Set(['rifle','shotgun','crossbow','carbine','hammer','sniper','flame','rail','lmg','harpoon','sledge','crowbar']);
const headIds=new Set(['mask']);
const extraIds=new Set(['compass','radio','scope','injector','badge','module']);
for(const d of items){if(d.slot==='weapon')d.slot=twoHandIds.has(d.id)?'hand2':'hand1';if(d.slot==='armor')d.slot='outer';if(d.slot==='accessory')d.slot=== 'accessory'&&(d.slot=d.id==='gloves'?'hands':headIds.has(d.id)?'head':'extra');}
const slotLabels={right:'Prawa ręka',left:'Lewa ręka',head:'Nakrycie głowy',shirt:'Koszulka',outer:'Kurtka / płaszcz / pancerz',hands:'Rękawice / karwasze',pants:'Spodnie',boots:'Buty',extra:'Akcesorium I',extra2:'Akcesorium II',extra3:'Akcesorium III'};
const emptyEquipment=()=>Object.fromEntries(Object.keys(slotLabels).map(x=>[x,null]));
function normalizeEquip(){
 let old=state.equip||{},eq=emptyEquipment();
 const assign=(slot,uid)=>{if(uid&&instance(uid)&&!Object.values(eq).includes(uid))eq[slot]=uid};
 for(let slot of Object.keys(eq))assign(slot,old[slot]);
 assign('right',old.weapon);assign('outer',old.armor);assign('head',old.accessory1);assign('extra',old.accessory2||old.accessory); if(old.extra&&instance(old.extra)&&instance(old.extra).id==='gloves'){eq.extra=null;assign('hands',old.extra)}
 // Zachowaj możliwie najwięcej wyposażenia ze starych zapisów.
 for(const [slot,uid] of Object.entries({...eq})){
  if(!uid)continue;let d=def(instance(uid));if(!d){eq[slot]=null;continue}
  let valid=(slot==='right'||slot==='left')?(d.slot==='hand1'||d.slot==='hand2'):(['extra','extra2','extra3'].includes(slot)?d.slot==='extra':d.slot===slot);
  if(!valid){eq[slot]=null;let dest=d.slot==='hand1'||d.slot==='hand2'?'right':d.slot;if(dest==='extra')dest=['extra','extra2','extra3'].find(x=>!eq[x])||'extra';if(!eq[dest])eq[dest]=uid;else if(d.slot==='hand1'&&!eq.left)eq.left=uid}
 }
 if(eq.hands&&instance(eq.hands)?.id==='bracelet'){const braceletUid=eq.hands;eq.hands=null;const free=['extra','extra2','extra3'].find(x=>!eq[x]);if(free)eq[free]=braceletUid;}
 if(eq.right&&def(instance(eq.right))?.slot==='hand2')eq.left=null;
 if(eq.left&&def(instance(eq.left))?.slot==='hand2'){eq.right=eq.left;eq.left=null}
 state.equip=eq;
}

const affixes=[{name:'Precyzyjny',bonus:{per:2}},{name:'Wzmocniony',bonus:{end:2}},{name:'Zwinny',bonus:{dex:2}},{name:'Brutalny',bonus:{str:2}},{name:'Techniczny',bonus:{int:2}},{name:'Weterana',bonus:{per:1,end:1}},{name:'Łowcy',bonus:{dex:1,per:1}},{name:'Dowódcy',bonus:{cha:2}}];
const locations=[{id:'ruins',name:'Bliska wyprawa — Ruiny osiedla',level:1,time:5,cost:5,xp:[20,35],scrap:[12,25],enemies:[{name:'Zdziczały szabrownik',hp:45,atk:[5,10],acc:4,dodge:4,armor:1},{name:'Wygłodniały mutant',hp:52,atk:[6,11],acc:4,dodge:3,armor:0}],drops:[['pistol',.18],['jacket',.15],['goggles',.08],['pipe',.15],['coat',.11],['compass',.09],['leather',.08],['revolver',.06]]},{id:'hospital',name:'Średnia wyprawa — Stary szpital',level:4,time:10,cost:12,xp:[45,70],scrap:[25,48],enemies:[{name:'Skażony sanitariusz',hp:105,atk:[11,19],acc:7,dodge:6,armor:3},{name:'Mutant z oddziału B',hp:115,atk:[12,20],acc:6,dodge:5,armor:4}],drops:[['vest',.17],['rifle',.12],['bandana',.12],['machete',.13],['smg',.12],['hazmat',.1],['radio',.08],['crossbow',.08],['dustglasses',.07],['bracelet',.08]]},{id:'outpost',name:'Daleka wyprawa — Posterunek wojskowy',level:8,time:15,cost:25,xp:[90,130],scrap:[50,90],enemies:[{name:'Dezerter z posterunku',hp:180,atk:[19,28],acc:11,dodge:9,armor:9},{name:'Strażnik kompleksu',hp:200,atk:[18,30],acc:12,dodge:7,armor:11}],drops:[['military',.15],['shotgun',.11],['mask',.14],['carbine',.14],['hammer',.12],['sniper',.09],['flame',.06],['rail',.025],['riot',.13],['kevlar',.11],['exosuit',.07],['sentinel',.025],['goggles',.12],['badge',.08],['radio',.07],['cleaver',.08],['revolver',.08],['smg',.10],['deserteagle',.12]]}];
const fresh=()=>({version:1,created:false,gender:'male',origin:'scout',dominantHand:'right',name:'Wędrowiec',level:1,xp:0,points:5,attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5},hp:110,energy:100,lastRegen:Date.now(),scrap:0,credits:0,cores:0,schematics:0,workshopTestGranted:false,factionTestPackGranted:false,furniture:{bed:0,table:0,nightstand:0},rooms:{bedroom:1,storage:1,workshop:1},materials:{tkanina:0,skora:0,tworzywo:0,elektronika:0,czesci:0,food:0,water:0,medical:0},inventory:[{uid:'starter-knife',id:'knife',rarity:0,affix:null},{uid:'starter-jacket',id:'jacket',rarity:0,affix:null}],equip:{right:'starter-knife',left:null,shirt:null,pants:null,boots:null,outer:'starter-jacket',head:null,extra:null},mission:null,reports:[],arena:{highest:0,attempts:{},victories:{},losses:{},draws:{},history:[]},battles:0,wins:0,companion:null,companionLevels:{},ownedCompanions:[],companionExperience:{},vehicle:'foot',vehicleUpgrades:{},vehicleSelectedStages:{},ownedVehicles:[],vehicleModules:{}});let state;try{state=JSON.parse(localStorage.getItem(KEY))||fresh();if(state.version!==1)state=fresh()}catch{state=fresh()}if(state.created===undefined)state.created=true;state.gender=normalizeGender(state.gender);state.origin=normalizeOrigin(state.origin);if(!['left','right'].includes(state.dominantHand))state.dominantHand='right';// Migracja zapisów z v0.1.0–0.1.2; stare wyposażenie zachowuje podstawowe parametry.
if(!Array.isArray(state.inventory))state.inventory=[];
if(state.inventory.some(x=>typeof x==='string')){
 let old=state.inventory;state.inventory=old.map((id,i)=>({uid:'legacy-'+i,id,rarity:0,affix:null}));
 // stare sloty przełożymy na nowe po zdefiniowaniu funkcji instance/def
 let previous=state.equip||{};let used=new Set();let eq={};
 for(const [slot,id] of Object.entries(previous)){
  let found=state.inventory.find(x=>x.id===id&&!used.has(x.uid));if(found){eq[slot]=found.uid;used.add(found.uid)}
 }state.equip=eq;
}
const instance=uid=>state.inventory.find(x=>x.uid===uid),def=inst=>items.find(x=>x.id===inst?.id),rarity=inst=>rarities[inst?.rarity||0]||rarities[0];
normalizeEquip();
if(!Number.isFinite(state.credits)||state.credits<0)state.credits=0;
if(!Number.isFinite(state.cores)||state.cores<0)state.cores=0;
if(!Number.isFinite(state.schematics)||state.schematics<0)state.schematics=0;
if(typeof state.workshopTestGranted!=='boolean')state.workshopTestGranted=false;
if(typeof state.factionTestPackGranted!=='boolean')state.factionTestPackGranted=false;
for(const inst of state.inventory){if(!Number.isInteger(inst.upgrade)||inst.upgrade<0||inst.upgrade>5)inst.upgrade=0;}
// ASHEN 0.1.24: trwały rozwój modułów schronu, niezależny od dekoracji.
function roomLevel(id){const n=state.rooms?.[id];return Number.isInteger(n)&&n>=1&&n<=5?n:1}
if(!state.rooms||typeof state.rooms!=='object'||Array.isArray(state.rooms))state.rooms={};
for(const id of ['bedroom','storage','workshop','sanctuary','garage','infirmary'])state.rooms[id]=roomLevel(id);
// Testy Kryjówki: zapamiętujemy najwyższy kiedykolwiek opłacony etap.
// Cofanie nie zwraca zasobów, a powrót do zakupionego poziomu nie pobiera opłat.
if(!state.roomUnlocked||typeof state.roomUnlocked!=='object'||Array.isArray(state.roomUnlocked))state.roomUnlocked={};
for(const id of ['bedroom','storage','workshop','sanctuary','garage','infirmary']){
 const purchased=Number(state.roomUnlocked[id]);
 state.roomUnlocked[id]=Math.max(roomLevel(id),Number.isInteger(purchased)?Math.min(5,Math.max(1,purchased)):1);
}

const ROOM_COSTS={
 bedroom:[null,{level:5,credits:350,scrap:120,mat:'tkanina',qty:35},{level:15,credits:1400,scrap:400,mat:'skora',qty:95},{level:25,credits:3200,scrap:900,mat:'tkanina',qty:180},{level:35,credits:6500,scrap:1800,mat:'skora',qty:300}],
 storage:[null,{level:5,credits:300,scrap:160,mat:'czesci',qty:35},{level:15,credits:1350,scrap:460,mat:'tworzywo',qty:100},{level:25,credits:3300,scrap:940,mat:'czesci',qty:180},{level:35,credits:7000,scrap:1900,mat:'tworzywo',qty:320}],
 workshop:[null,{level:8,credits:450,scrap:190,mat:'czesci',qty:45},{level:18,credits:1800,scrap:550,mat:'elektronika',qty:100},{level:28,credits:4400,scrap:1100,mat:'czesci',qty:200},{level:38,credits:8800,scrap:2250,mat:'elektronika',qty:350}],
 sanctuary:[null,{level:5,credits:250,scrap:110,mat:'tkanina',qty:25},{level:15,credits:1100,scrap:350,mat:'skora',qty:80},{level:25,credits:2850,scrap:800,mat:'tkanina',qty:160},{level:35,credits:6000,scrap:1600,mat:'skora',qty:280}],
 garage:[null,{level:5,credits:400,scrap:170,mat:'czesci',qty:40},{level:15,credits:1500,scrap:450,mat:'tworzywo',qty:100},{level:25,credits:3700,scrap:1000,mat:'czesci',qty:210},{level:35,credits:7300,scrap:1950,mat:'elektronika',qty:300}],
 infirmary:[null,{level:5,credits:380,scrap:145,mat:'tkanina',qty:35},{level:15,credits:1400,scrap:410,mat:'elektronika',qty:90},{level:25,credits:3400,scrap:950,mat:'tworzywo',qty:190},{level:35,credits:6800,scrap:1850,mat:'elektronika',qty:320}]
};
const ROOM_BONUSES={
 bedroom:['Brak premii','+3% doświadczenia z wypraw','+6% doświadczenia z wypraw','+9% doświadczenia z wypraw','+12% doświadczenia z wypraw'],
 storage:['Standardowy odzysk materiałów','+10% materiałów przy rozkładaniu','+20% materiałów przy rozkładaniu','+30% materiałów przy rozkładaniu','+40% materiałów przy rozkładaniu'],
 workshop:['Standardowy koszt ulepszeń','−5% kosztów ulepszeń (poza rdzeniami)','−10% kosztów ulepszeń (poza rdzeniami)','−15% kosztów ulepszeń (poza rdzeniami)','−20% kosztów ulepszeń (poza rdzeniami)'],
 sanctuary:['Standardowy bonus aktywnego towarzysza','+2,5% do efektu aktywnego towarzysza','+5% do efektu aktywnego towarzysza','+7,5% do efektu aktywnego towarzysza','+10% do efektu aktywnego towarzysza'],
 garage:['Standardowy czas zwykłych wypraw','−2,5% czasu zwykłych wypraw','−5% czasu zwykłych wypraw','−7,5% czasu zwykłych wypraw','−10% czasu zwykłych wypraw'],
 infirmary:['Standardowe maksymalne PŻ','+2,5% maksymalnych PŻ','+5% maksymalnych PŻ','+7,5% maksymalnych PŻ','+10% maksymalnych PŻ']
};
const roomBonusText=id=>ROOM_BONUSES[id]?.[roomLevel(id)-1]||'Brak premii';
function roomUpgrade(id){
 const current=roomLevel(id),unlocked=state.roomUnlocked[id]||current;
 if(current<unlocked){state.rooms[id]=current+1;message=`Przywrócono opłacony poziom ${current+1}: ${BUNKER_ROOMS[id].name}.`;save();render();return;}
 const cfg=ROOM_COSTS[id]?.[current];if(!cfg)return;
 if(state.level<cfg.level){message='Rozbudowa wymaga poziomu postaci '+cfg.level+'.';render();return}
 if(state.credits<cfg.credits||state.scrap<cfg.scrap||getStock(cfg.mat)<cfg.qty){message='Brakuje materiałów na rozbudowę pomieszczenia.';render();return}
 const text=`${cfg.credits} kredytów, ${cfg.scrap} złomu, ${cfg.qty} × ${materialLabels[cfg.mat]}`;
 if(!confirm(`Rozbudować ${BUNKER_ROOMS[id].name} do poziomu ${current+1}?\nKoszt: ${text}\nNowa funkcja: ${ROOM_BONUSES[id][current]}`))return;
 if(state.level<cfg.level||state.credits<cfg.credits||state.scrap<cfg.scrap||getStock(cfg.mat)<cfg.qty)return;
 state.credits-=cfg.credits;state.scrap-=cfg.scrap;state.materials[cfg.mat]-=cfg.qty;state.rooms[id]=current+1;state.roomUnlocked[id]=Math.max(state.roomUnlocked[id]||1,current+1);
 message='Rozbudowano pomieszczenie: '+BUNKER_ROOMS[id].name+' · poziom '+roomLevel(id)+'.';save();render();
}
function roomDowngrade(id){
 if(!Object.prototype.hasOwnProperty.call(BUNKER_ROOMS,id))return;
 const current=roomLevel(id);
 if(current<=1)return;
 if(!confirm(`Tryb testowy: cofnąć ${BUNKER_ROOMS[id].name} do poziomu ${current-1}?\nPremia i wygląd zmienią się natychmiast. Surowce nie są zwracane.\nOpłacony poziom ${state.roomUnlocked[id]||current} pozostanie odblokowany.`))return;
 state.rooms[id]=current-1;
 message=`Tryb testowy: ${BUNKER_ROOMS[id].name} cofnięto do poziomu ${current-1}. Możesz bezpłatnie przywrócić opłacony rozwój.`;
 save();render();
}
function roomTestSet(id,level){
 if(!Object.prototype.hasOwnProperty.call(BUNKER_ROOMS,id))return;
 const target=Number(level);
 if(!Number.isInteger(target)||target<1||target>5)return;
 // Jawny tryb testowy: przestawia aktywny etap bez wydawania waluty i bez poziomu postaci.
 // Zapisany najwyższy poziom pozwala dowolnie porównywać sceny po odświeżeniu.
 state.rooms[id]=target;
 state.roomUnlocked[id]=5;
 message=`TEST KRYJÓWKI: ${BUNKER_ROOMS[id].name} — poziom ${target}/5 (bez opłat i wymagań).`;
 save();render();
}
function roomUpgradePanel(id){
 const lvl=roomLevel(id),max=state.roomUnlocked[id]||lvl,cfg=ROOM_COSTS[id]?.[lvl],next=lvl<5?lvl+1:null;
 const alreadyOwned=next!==null&&next<=max;
 const cost=cfg?`${cfg.credits} kredytów · ${cfg.scrap} złomu · ${cfg.qty} × ${materialLabels[cfg.mat]}`:'';
 const can=alreadyOwned||(!!cfg&&state.level>=cfg.level&&state.credits>=cfg.credits&&state.scrap>=cfg.scrap&&getStock(cfg.mat)>=cfg.qty);
 const nextBonus=ROOM_BONUSES[id]?.[lvl]||'';
 return `<div class="room-upgrade-panel"><div><span class="tag">ROZWÓJ MODUŁU · ${lvl}/5</span><h3>Rozbudowa: ${BUNKER_ROOMS[id].name}</h3><p class="small muted">Aktywny bonus: <strong>${roomBonusText(id)}</strong></p>${next!==null?`<p class="small muted">Poziom ${next}: ${nextBonus}</p><p class="small muted">${alreadyOwned?`Etap ${next} został wcześniej opłacony — przywrócenie jest bezpłatne.`:`Wymagany poziom postaci: ${cfg.level}<br>Koszt: ${cost}`}</p>`:'<p class="good small">Pomieszczenie rozbudowane do maksimum.</p>'}<p class="small muted">Tryb testowy: najwyższy odblokowany poziom ${max}/5. Cofanie nie zwraca materiałów.</p></div><div class="ashen-room-level-selector"><div class="small muted"><strong>Podgląd testowy scen 1–5:</strong> dowolny poziom, bez ograniczeń poziomu postaci, kredytów i materiałów. Zmienia też aktywne bonusy.</div><div class="ashen-room-level-buttons">${[1,2,3,4,5].map(n=>`<button type="button" class="${n===lvl?'primary is-current':''}" data-room-test-level="${id}:${n}" aria-pressed="${n===lvl}">Poziom ${n}</button>`).join('')}</div></div><div class="actions ashen-room-test-actions">${lvl>1?`<button data-room-downgrade="${id}" title="Testowe cofnięcie poziomu bez zwrotu surowców">↶ Cofnij poziom (test)</button>`:''}${next!==null?`<button class="${can?'primary':''}" data-room-upgrade="${id}" ${can?'':'disabled'}>${alreadyOwned?'Przywróć poziom '+next:state.level<cfg.level?'Od poziomu '+cfg.level:'Rozbuduj do poziomu '+next}</button>`:'<span class="tag">MAKS. POZIOM</span>'}</div></div>`;
}

const materialKeys=['scrap','tkanina','skora','tworzywo','elektronika','czesci','food','water','medical'];
const materialLabels={scrap:'Złom',tkanina:'Tkanina',skora:'Skóra',tworzywo:'Chemikalia',elektronika:'Elektronika',czesci:'Części mechaniczne',food:'Żywność',water:'Czysta woda',medical:'Zaopatrzenie medyczne'};
if(!state.materials||typeof state.materials!=='object')state.materials={};
for(const key of materialKeys.slice(1))if(!Number.isFinite(state.materials[key])||state.materials[key]<0)state.materials[key]=0;
for(const inst of state.inventory){if(typeof inst.locked!=='boolean')inst.locked=Number(inst.rarity)>=3}
// Wariant B: dwa NIEZALEŻNE losowania. Rzadkość wpływa na szanse, nie narzuca dodatków.
// Stabilne identyfikatory tekstowe pozwalają dodawać modyfikatory w kolejnych wersjach.
const rangedIds=new Set(['pistol','revolver','smg','deserteagle','rifle','shotgun','crossbow','carbine','sniper','flame','rail','lmg','harpoon']);
const weaponSlot=s=>s==='hand1'||s==='hand2';
// Naturalne odmiany nazw prefiksów dla żeńskich i mnogich nazw sprzętu.
const feminineItemIds=new Set(['ash_needle','shotgun','crossbow','pipe','machete','jacket','vest','radio','bracelet','cap','scarf','bandana','mask','scope','saber','hatchet','sledge','rail','lmg','nightgoggles2','thermal','armorshirt','techshirt','scoutshirt','tshirt','deserteagle2','sneakers2','hood2']);
const pluralItemIds=new Set(['jeans','cargo','scoutpants','kevlarpants','radiopants','sneakers','workboots','combatboots','silentboots','hazboots','goggles','gloves','dustglasses','nightgoggles','parts','fingerless','workgloves','tacticalgloves','leathergloves','steelbracers','scoutbracers','kevlarbracers','zerobracers']);
const femininePrefix={precise:'Precyzyjna',brutal:'Brutalna',agile:'Zwinna',reinforced:'Wzmocniona',technical:'Techniczna',light:'Lekka',armored:'Pancerna',destructive:'Niszczycielska',lethal:'Zabójcza',scrap:'Złomowa'};
const pluralPrefix={precise:'Precyzyjne',brutal:'Brutalne',agile:'Zwinne',reinforced:'Wzmocnione',technical:'Techniczne',light:'Lekkie',armored:'Pancerne',destructive:'Niszczycielskie',lethal:'Zabójcze',scrap:'Złomowe'};
function prefixLabel(mod,base){
 if(!mod)return null;
 const form=pluralItemIds.has(base.id)?'p':feminineItemIds.has(base.id)?'f':'m';
 // Dawne akcesoria 'Zwinne' pozostają sprawne, ale wyświetlamy osobną nazwę.
 if(base.slot==='extra'&&mod.id==='agile')return {m:'Refleksyjny',f:'Refleksyjna',p:'Refleksyjne'}[form];
 if(mod.forms)return mod.forms[form]||mod.name;
 return form==='p'?pluralPrefix[mod.id]||mod.name:form==='f'?femininePrefix[mod.id]||mod.name:mod.name;
}
// Rzadkość jest częścią pełnej nazwy. Zwykły pozostaje bez dodatkowego przymiotnika.
const rarityForms={f:['','Ulepszona','Rzadka','Epicka','Legendarna'],p:['','Ulepszone','Rzadkie','Epickie','Legendarne'],m:['','Ulepszony','Rzadki','Epicki','Legendarny']};
function rarityPrefix(inst,d){let n=Number(inst?.rarity)||0;let form=pluralItemIds.has(d.id)?'p':feminineItemIds.has(d.id)?'f':'m';return rarityForms[form][n]||'';}


// Prefiksy ze starych zapisów pozostają czytelne i nie zmieniają swojego ID,
// ale nigdy nie są losowane po aktualizacji. Nowe modyfikatory mają osobne
// przestrzenie identyfikatorów dla broni, ubioru i akcesoriów.
const legacyPrefixDefs=[
 {id:'precise',name:'Precyzyjny',bonus:{per:2},on:'weapon',legacyOnly:true},
 {id:'brutal',name:'Brutalny',bonus:{str:2},on:'weapon',legacyOnly:true},
 {id:'agile',name:'Zwinny',bonus:{dex:2},on:'any',legacyOnly:true,setId:'armor_agile'},
 {id:'reinforced',name:'Wzmocniony',bonus:{end:2},on:'clothing',legacyOnly:true,setId:'armor_reinforced'},
 {id:'technical',name:'Techniczny',bonus:{int:2},on:'any',legacyOnly:true},
 {id:'light',name:'Lekki',bonus:{dex:1,per:1},on:'clothing',legacyOnly:true,setId:'armor_light'},
 {id:'armored',name:'Pancerny',armorPct:15,on:'clothing',legacyOnly:true,setId:'armor_plated'},
 {id:'destructive',name:'Niszczycielski',damagePct:12,on:'weapon',legacyOnly:true},
 {id:'lethal',name:'Zabójczy',critPp:5,on:'weapon',legacyOnly:true},
 // Dawny ujemny prefiks nie wypada już w łupach i nie osłabia zdobytego wyposażenia.
 {id:'scrap',name:'Odzyskany',forms:{m:'Odzyskany',f:'Odzyskana',p:'Odzyskane'},bonus:{end:1},on:'any',legacyOnly:true}
];
const newPrefixDefs=[
 // ASHEN 0.4.7.0: nowe bronie losuja strategiczne, porownywalne warianty.
 // Prefiks okresla sposob wykonania ataku; bonusy nie rosna wraz z liczba ciosow.
 {id:'weapon_precise',name:'Precyzyjny',forms:{m:'Precyzyjny',f:'Precyzyjna',p:'Precyzyjne'},bonus:{per:2},accuracy:3,on:'weapon'},
 {id:'weapon_brutal',name:'Brutalny',forms:{m:'Brutalny',f:'Brutalna',p:'Brutalne'},bonus:{str:2},damagePct:4,on:'meleeWeapon'},
 {id:'weapon_destructive',name:'Niszczycielski',forms:{m:'Niszczycielski',f:'Niszczycielska',p:'Niszczycielskie'},damagePct:8,on:'weapon'},
 {id:'weapon_lethal',name:'Zabójczy',forms:{m:'Zabójczy',f:'Zabójcza',p:'Zabójcze'},critPp:4,on:'weapon'},
 // Bonusowy cios jest ograniczony do 12% sily sekwencji (por. heroAttacks).
 {id:'weapon_quick',name:'Szybki',forms:{m:'Szybki',f:'Szybka',p:'Szybkie'},extraAttacks:1,on:'lightWeapon'},
 {id:'weapon_stable',name:'Stabilny',forms:{m:'Stabilny',f:'Stabilna',p:'Stabilne'},accuracy:5,critPp:2,on:'weapon'},
 {id:'weapon_piercing',name:'Przebijający',forms:{m:'Przebijający',f:'Przebijająca',p:'Przebijające'},armorPen:4,on:'weapon'},
 // UBIÓR — ich własna pula pozostaje niezależna od broni.
 {id:'armor_reinforced',name:'Wzmocniony',forms:{m:'Wzmocniony',f:'Wzmocniona',p:'Wzmocnione'},bonus:{end:2},on:'clothing',setId:'armor_reinforced'},
 {id:'armor_plated',name:'Pancerny',forms:{m:'Pancerny',f:'Pancerna',p:'Pancerne'},armorPct:15,on:'clothingArmor',setId:'armor_plated'},
 {id:'armor_flexible',name:'Elastyczny',forms:{m:'Elastyczny',f:'Elastyczna',p:'Elastyczne'},bonus:{dex:2},on:'clothing',setId:'armor_flexible'},
 {id:'armor_light',name:'Lekki',forms:{m:'Lekki',f:'Lekka',p:'Lekkie'},bonus:{dex:1,per:1},on:'clothing',setId:'armor_light'},
 {id:'armor_resistant',name:'Odporny',forms:{m:'Odporny',f:'Odporna',p:'Odporne'},armorPct:8,bonus:{end:1},on:'clothingArmor',setId:'armor_resistant'},
 {id:'armor_tracker',name:'Tropicielski',forms:{m:'Tropicielski',f:'Tropicielska',p:'Tropicielskie'},bonus:{per:2},on:'clothing',setId:'armor_tracker'},
 {id:'armor_iron',name:'Żelazny',forms:{m:'Żelazny',f:'Żelazna',p:'Żelazne'},bonus:{str:3},on:'clothing',setId:'armor_iron'},
 {id:'armor_warden',name:'Wartownika',forms:{m:'Wartownika',f:'Wartownika',p:'Wartownika'},bonus:{end:2},on:'clothing',setId:'armor_warden'},
 {id:'armor_nomad',name:'Nomady',forms:{m:'Nomady',f:'Nomady',p:'Nomady'},bonus:{dex:2},on:'clothing',setId:'armor_nomad'},
 // AKCESORIA: bez zmian na tym etapie przebudowy.
 {id:'accessory_technical',name:'Techniczny',forms:{m:'Techniczny',f:'Techniczna',p:'Techniczne'},bonus:{int:2},on:'accessory',setId:'accessory_technical'},
 {id:'accessory_observant',name:'Spostrzegawczy',forms:{m:'Spostrzegawczy',f:'Spostrzegawcza',p:'Spostrzegawcze'},bonus:{per:2},on:'accessory',setId:'accessory_observant'},
 {id:'accessory_persuasive',name:'Przekonujący',forms:{m:'Przekonujący',f:'Przekonująca',p:'Przekonujące'},bonus:{cha:2},on:'accessory',setId:'accessory_persuasive'},
 {id:'accessory_reflexive',name:'Refleksyjny',forms:{m:'Refleksyjny',f:'Refleksyjna',p:'Refleksyjne'},bonus:{dex:2},on:'accessory',setId:'accessory_reflexive'},
 {id:'accessory_versatile',name:'Wszechstronny',forms:{m:'Wszechstronny',f:'Wszechstronna',p:'Wszechstronne'},bonus:{per:1,int:1},on:'accessory',setId:'accessory_versatile'}
];
const prefixDefs=[...legacyPrefixDefs,...newPrefixDefs,...artifactPrefixDefs];
const legacySuffixDefs=[
 {id:'hunter',name:'Łowcy',bonus:{per:2},on:'any',legacyOnly:true},
 {id:'strong',name:'Siłacza',bonus:{str:2},on:'any',legacyOnly:true},
 {id:'shadow',name:'Cienia',bonus:{dex:2},on:'any',legacyOnly:true},
 {id:'veteran',name:'Weterana',bonus:{str:1,end:1},on:'any',legacyOnly:true},
 {id:'technician',name:'Technika',bonus:{int:2},on:'any',legacyOnly:true},
 {id:'sniper',name:'Snajpera',bonus:{per:3},on:'ranged',legacyOnly:true},
 {id:'berserker',name:'Berserkera',damagePct:8,on:'weapon',legacyOnly:true},
 {id:'survivor',name:'Ocalonego',bonus:{end:3},on:'clothing',legacyOnly:true},
 {id:'commander',name:'Dowódcy',bonus:{cha:2},on:'any',legacyOnly:true},
 {id:'mutant',name:'Mutanta',bonus:{str:3},on:'any',legacyOnly:true}
];
const newSuffixDefs=[
 // Sufiks okresla specjalizacje w walce — oddzielny wybor od prefiksu.
 {id:'weapon_hunter',name:'Łowcy',bonus:{per:2},accuracy:2,on:'weapon'},
 {id:'weapon_sniper',name:'Snajpera',bonus:{per:2},critPp:2,on:'ranged'},
 {id:'weapon_berserker',name:'Berserkera',damagePct:8,accuracy:-4,on:'weapon'},
 {id:'weapon_executioner',name:'Egzekutora',critPp:4,on:'weapon'},
 {id:'weapon_warrior',name:'Wojownika',bonus:{str:2},damagePct:3,on:'meleeWeapon'},
 {id:'weapon_destroyer',name:'Niszczyciela',damagePct:5,armorPen:1,on:'weapon'},
 {id:'weapon_piercer',name:'Penetratora',armorPen:5,on:'weapon'},
 {id:'weapon_duelist',name:'Fechmistrza',critPp:3,accuracy:3,on:'oneHandWeapon'},
 {id:'armor_survivor',name:'Ocalonego',bonus:{end:3},on:'clothing'},
 {id:'armor_guard',name:'Strażnika',armorPct:10,on:'clothingArmor'},
 {id:'armor_wanderer',name:'Wędrowca',bonus:{end:1,per:1},on:'clothing'},
 {id:'armor_scout',name:'Zwiadowcy',bonus:{dex:2},on:'clothing'},
 {id:'armor_tough',name:'Twardziela',bonus:{str:2},on:'clothing'},
 {id:'armor_ironwill',name:'Żelaznej Woli',bonus:{end:1,int:1},on:'clothing'},
 {id:'accessory_technician',name:'Technika',bonus:{int:3},on:'accessory'},
 {id:'accessory_negotiator',name:'Negocjatora',bonus:{cha:3},on:'accessory'},
 {id:'accessory_tracker',name:'Tropiciela',bonus:{per:3},on:'accessory'},
 {id:'accessory_leader',name:'Przywódcy',bonus:{cha:2,end:1},on:'accessory'},
 {id:'accessory_explorer',name:'Odkrywcy',bonus:{int:1,per:1},on:'accessory'},
 {id:'accessory_survivor',name:'Ocalałego',bonus:{end:2},on:'accessory'}
];
const suffixDefs=[...legacySuffixDefs,...newSuffixDefs,...artifactSuffixDefs];
// Jednorazowa, bezstratna migracja artefaktów z 0.1.46–0.1.47:
// stare kolekcje otrzymują odpowiedniki prefiksów; oryginalne UID i rzadkość zostają.
for(const inst of state.inventory){
 const d=def(inst);if(!d?.artifact||inst.artifactAffixesInitialized)continue;
 if(!inst.prefix)inst.prefix=d.artifactSet==='seeker'?'art_fortunate':'art_ward';
 inst.artifactAffixesInitialized=true;
}
const clothingSlots=new Set(['head','shirt','outer','hands','pants','boots']);
const meleeWeaponIds=new Set(['knife','pipe','machete','cleaver','wrench','hatchet','baton','saber','hammer','crowbar','sledge']);
const lightWeaponIds=new Set(['knife','pipe','machete','hatchet','baton','wrench','cleaver','saber','pistol','revolver','smg']);
function categoryOf(d){return weaponSlot(d.slot)?'weapon':clothingSlots.has(d.slot)?'clothing':d.artifact?'artifact':d.slot==='extra'?'accessory':'other'}
const prefixChance=[.18,.32,.50,.70,.85],suffixChance=[.06,.15,.29,.55,.78];
function suitable(mod,d,rar){
 if(!mod||!d||d.slot==='material'||mod.legacyOnly||(mod.maxRarity!==undefined&&rar>mod.maxRarity))return false;
 const cat=categoryOf(d);
 if(mod.on==='weapon'&&cat!=='weapon')return false;
 if(mod.on==='ranged'&&(cat!=='weapon'||!rangedIds.has(d.id)))return false;
 if(mod.on==='meleeWeapon'&&(cat!=='weapon'||!meleeWeaponIds.has(d.id)))return false;
 if(mod.on==='oneHandWeapon'&&d.slot!=='hand1')return false;
 if(mod.on==='lightWeapon'&&(cat!=='weapon'||!lightWeaponIds.has(d.id)))return false;
 if(mod.on==='clothing'&&cat!=='clothing')return false;
 if(mod.on==='clothingArmor'&&(cat!=='clothing'||!(d.armor>0)))return false;
 if(mod.on==='accessory'&&cat!=='accessory')return false;
 if(mod.on==='artifact'&&cat!=='artifact')return false;
 if(mod.armorPct&&!(d.armor>0))return false;
 return true;
}
function findModifier(collection,id){return collection.find(x=>x.id===id)}
function pickModifier(collection,d,r){const available=collection.filter(x=>suitable(x,d,r));return available.length?available[rand(0,available.length-1)].id:null}
function modifiersOf(inst){
 const mods=[];
 if(inst?.prefix) {const p=findModifier(prefixDefs,inst.prefix);if(p)mods.push(p)}
 if(inst?.suffix) {const p=findModifier(suffixDefs,inst.suffix);if(p)mods.push(p)}
 // Starsze łupy z wersji 0.1.3–0.1.5: zachowanie nazwy oraz przyznanego bonusu.
 if(mods.length===0&&inst?.affix!==undefined&&inst?.affix!==null){
  const old=affixes[inst.affix];if(old)mods.push({...old,legacy:true})
 }
 return mods;
}
function rolledBonus(inst){const b={};for(const mod of modifiersOf(inst))for(const [k,v] of Object.entries(mod.bonus||{}))b[k]=(b[k]||0)+v;return b}
// ASHEN v0.4.6.9 — rzeczywisty silnik Starć: katalog 24 broni z potwierdzonej kalibracji.
// Eksperymentalne współczynniki klas pochodzą z Laboratorium 0.4.6.7–0.4.6.8.
// Nie zmieniamy SQL serwerowych Ekspedycji w tej wersji.
const COMBAT_V2_WEAPONS={"baton":{"min":5,"max":8,"attacks":1,"accuracy":2,"crit":0,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"pipe":{"min":6,"max":10,"attacks":1,"accuracy":-2,"crit":0,"pen":1,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"wrench":{"min":7,"max":12,"attacks":1,"accuracy":2,"crit":0,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"knife":{"min":6,"max":10,"attacks":2,"accuracy":4,"crit":3,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"cleaver":{"min":10,"max":16,"attacks":1,"accuracy":-3,"crit":5,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"hatchet":{"min":12,"max":18,"attacks":1,"accuracy":-2,"crit":2,"pen":2,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"saber":{"min":10,"max":15,"attacks":2,"accuracy":1,"crit":2,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"machete":{"min":12,"max":18,"attacks":2,"accuracy":-1,"crit":1,"pen":0,"category":"Biała 1R","scale":0.72,"critMultiplier":2},"pistol":{"min":12,"max":18,"attacks":1,"accuracy":5,"crit":0,"pen":0,"category":"Palna 1R","scale":1.12,"critMultiplier":1.6},"deserteagle":{"min":18,"max":27,"attacks":1,"accuracy":-3,"crit":2,"pen":1,"category":"Palna 1R","scale":1.12,"critMultiplier":1.6},"revolver":{"min":19,"max":28,"attacks":1,"accuracy":0,"crit":5,"pen":1,"category":"Palna 1R","scale":1.12,"critMultiplier":1.6},"smg":{"min":8,"max":13,"attacks":3,"accuracy":-7,"crit":-2,"pen":0,"category":"Palna 1R","scale":1.12,"critMultiplier":1.6},"rifle":{"min":18,"max":27,"attacks":1,"accuracy":2,"crit":0,"pen":1,"category":"Palna 2R","scale":0.93,"critMultiplier":1.8},"carbine":{"min":13,"max":20,"attacks":2,"accuracy":2,"crit":0,"pen":1,"category":"Palna 2R","scale":0.93,"critMultiplier":1.8},"shotgun":{"min":28,"max":42,"attacks":1,"accuracy":-7,"crit":1,"pen":1,"category":"Palna 2R","scale":0.93,"critMultiplier":1.8},"sniper":{"min":36,"max":54,"attacks":1,"accuracy":5,"crit":5,"pen":4,"category":"Palna 2R","scale":0.93,"critMultiplier":1.8},"lmg":{"min":13,"max":20,"attacks":3,"accuracy":-10,"crit":-2,"pen":1,"category":"Palna 2R","scale":0.93,"critMultiplier":1.8},"crossbow":{"min":18,"max":28,"attacks":1,"accuracy":1,"crit":4,"pen":3,"category":"Dystansowa 2R","scale":1.42,"critMultiplier":2.3},"harpoon":{"min":23,"max":36,"attacks":1,"accuracy":-3,"crit":3,"pen":4,"category":"Dystansowa 2R","scale":1.42,"critMultiplier":2.3},"flame":{"min":12,"max":19,"attacks":3,"accuracy":-6,"crit":-3,"pen":2,"category":"Technologiczna 2R","scale":1.22,"critMultiplier":1.8},"crowbar":{"min":15,"max":23,"attacks":1,"accuracy":-2,"crit":0,"pen":3,"category":"Biała 2R","scale":0.91,"critMultiplier":2.8},"hammer":{"min":21,"max":33,"attacks":1,"accuracy":-4,"crit":2,"pen":2,"category":"Biała 2R","scale":0.91,"critMultiplier":2.8},"rail":{"min":31,"max":47,"attacks":1,"accuracy":3,"crit":3,"pen":6,"category":"Technologiczna 2R","scale":1.22,"critMultiplier":1.8},"sledge":{"min":32,"max":50,"attacks":1,"accuracy":-6,"crit":4,"pen":3,"category":"Biała 2R","scale":0.91,"critMultiplier":2.8}};
const COMBAT_V2_WORKSHOP=[0,.028,.056,.084,.112,.14];
function combatV2WeaponConfig(id){return COMBAT_V2_WEAPONS[id]||null;}
const UPGRADE_POWER=[0,1,3,5,10,20];
function statsOf(inst){
 const d=def(inst);if(!d)return null;
 const m=rarity(inst).mult,mods=modifiersOf(inst);
 const pct=(key)=>mods.reduce((sum,x)=>sum+(x[key]||0),0);
 const dmgPct=pct('damagePct'),armorPct=pct('armorPct'),critPp=pct('critPp'),accuracy=pct('accuracy'),extraAttacks=pct('extraAttacks'),armorPen=pct('armorPen');
 const pref=findModifier(prefixDefs,inst?.prefix),suf=findModifier(suffixDefs,inst?.suffix);
 const legacy=mods.find(x=>x.legacy);
 const legacyLabel=legacy?.name==='Zwinny'&&d.slot==='extra'?prefixLabel({id:'agile',name:'Zwinny'},d):legacy?.name;
 const name=[rarityPrefix(inst,d),prefixLabel(pref,d)||legacyLabel,d.name,suf?.name].filter(Boolean).join(' ');
 const weapon=weaponSlot(d.slot),upgrade=Math.min(5,Math.max(0,Number(inst?.upgrade)||0));
 const combatModel=weapon?combatV2WeaponConfig(d.id):null;
 const upgradedName=upgrade?name+' +'+upgrade:name;
 const armorUp=UPGRADE_POWER[upgrade];
 return {...d,name:upgradedName,upgrade,rarity:rarity(inst).name,
  min:weapon?Math.max(1,combatModel?Math.round(combatModel.min*combatModel.scale*m*(1+dmgPct/100)*(1+COMBAT_V2_WORKSHOP[upgrade])):Math.round(d.min*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  max:weapon?Math.max(1,combatModel?Math.round(combatModel.max*combatModel.scale*m*(1+dmgPct/100)*(1+COMBAT_V2_WORKSHOP[upgrade])):Math.round(d.max*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  armor:!weapon&&d.slot!=='material'?Math.max(0,Math.round((d.armor||0)*m*(1+armorPct/100))+((d.armor||0)===0 ? [0,1,2,3,5][Math.min(4,Math.max(0,Number(inst?.rarity)||0))] : 0)+armorUp):undefined,
  bonus:rolledBonus(inst),critPp:critPp+(combatModel?.crit||0),accuracy:accuracy+(combatModel?.accuracy||0),extraAttacks,damagePct:dmgPct,armorPct,
  combatV2:!!combatModel,baseAttacks:combatModel?.attacks||1,labPen:(combatModel?.pen||0)+armorPen,labCritMultiplier:combatModel?.critMultiplier||1.6,
  prefixName:prefixLabel(pref,d)||null,suffixName:suf?.name||null,
  effects:mods.map(x=>({name:x===pref?prefixLabel(x,d):x.name,description:modifierText(x)}))};
}
// ASHEN v0.1.43 — bazowe pule jakości łupów z wypraw; brak wpływu szczęścia (kolejny etap).
// Łączna suma wag w każdej lokalizacji wynosi dokładnie 100.
const EXPEDITION_RARITY_WEIGHTS=Object.freeze({
 ruins:Object.freeze([78,22,0,0,0]),
 hospital:Object.freeze([55,30,13,2,0]),
 outpost:Object.freeze([37,29,23,9,2])
});
// ASHEN v0.1.45 — Eksploracja i szczęście: jeden model dla podglądu, losowania i raportu.
// Szczęście pochodzi na razie z wyposażonych akcesoriów; przyszłe artefakty będą mogły je zwiększać.
const LUCK_ITEMS=Object.freeze({compass:1,goggles:1,nightgoggles:2,badge:1,radio:1});
function explorationStats(){
 const a=attrs();
 let luck=0;const sources=[];
 for(const slot of ['extra','extra2','extra3']){
  const inst=instance(state.equip?.[slot]);
  if(!inst)continue;
  const pts=(LUCK_ITEMS[inst.id]||0)+(def(inst)?.artifactLuck||0)+modifiersOf(inst).reduce((sum,mod)=>sum+(mod.luck||0),0);
  if(pts){luck+=pts;sources.push({name:statsOf(inst).name,value:pts});}
 }
 const resonance=resonanceBonuses();
 if(resonance.luck){luck+=resonance.luck;for(const r of resonance.active.filter(x=>x.config.luck))sources.push({name:'Zestaw '+r.config.name,value:r.config.luck});}
 // Bonus za komplet rezonansowy nie może przekroczyć 80% limitu skuteczności.
 const chance=clamp(Math.round(28+(a.per-5)*1.05+(a.int-5)*1.05+(a.dex-5)*0.45+resonance.explore),15,80);
 return {chance,luck:Math.min(15,luck),sources,per:a.per,int:a.int,dex:a.dex,resonance:resonance.active.map(x=>x.config.name)};
}
function explorationRarityWeights(loc,luck=0){
 const base=rarityWeightsForExpedition(loc);
 if(!base)return rarities.map(q=>q.weight);
 const weights=[...base];
 const maximum=weights.reduce((last,w,i)=>w>0?i:last,0);
 if(maximum<1||luck<=0)return weights;
 // Każdy punkt szczęścia przesuwa 1 p.p. z jakości zwykłej na wyższą.
 // W obrębie dostępnych jakości w pierwszej kolejności premiowane są rzadsze znaleziska.
 let shift=Math.min(Math.floor(luck),weights[0],12);
 weights[0]-=shift;
 if(maximum===1){weights[1]+=shift;return weights;}
 const rareShare=Math.ceil(shift*.65);
 weights[maximum]+=rareShare;
 weights[Math.max(1,maximum-1)]+=shift-rareShare;
 return weights;
}
// v0.1.47: autorskie anomalie Rezonansu Pustkowi. Wydarzenia są losowane
// wyłącznie na zakończenie wyprawy i odnotowywane w raporcie.
const ANOMALY_FREQUENCY=Object.freeze({ruins:18,hospital:32,outpost:50});
const ANOMALY_EVENTS=Object.freeze([
 {id:'echo',name:'Echo nieobecnych',icon:'◉',kind:'boon',weight:22,description:'W opuszczonym pomieszczeniu powraca głos, który wskazuje nietkniętą skrytkę. Ślady prowadzą do dodatkowego znaleziska.',bonusLoot:1},
 {id:'glimmer',name:'Błysk drugiej szansy',icon:'✧',kind:'boon',weight:20,description:'Na moment przedmioty świecą obcym blaskiem. Podczas tej wyprawy łatwiej odnaleźć lepszą jakość wyposażenia.',luck:3},
 {id:'whisper',name:'Szept w przewodach',icon:'⌁',kind:'boon',weight:18,description:'Niezrozumiały sygnał ujawnia ukryte przejście. Poszukiwania stają się skuteczniejsze.',explore:15},
 {id:'cache',name:'Martwy depozyt',icon:'▣',kind:'boon',weight:14,description:'Za fałszywą ścianą znajduje się zapomniany magazyn odzyskiwalnych części.',scrap:25},
 {id:'static',name:'Strefa ciszy',icon:'◌',kind:'hazard',weight:16,description:'Wszystkie przyrządy milkną, a teren staje się nieczytelny. Poszukiwania są utrudnione.',explore:-14},
 {id:'surge',name:'Puls Pustkowi',icon:'⚡',kind:'hazard',weight:10,description:'Nagły impuls Rezonansu wywołuje dezorientację i zabiera część zapasów.',scrap:-18}
]);
function rollAnomaly(loc,snapshot){
 const location=typeof loc==='string'?loc:loc?.id;
 const frequency=ANOMALY_FREQUENCY[location]||0;
 if(Math.random()*100>=frequency)return null;
 const total=ANOMALY_EVENTS.reduce((sum,x)=>sum+x.weight,0);
 let roll=Math.random()*total;let pick=ANOMALY_EVENTS[0];
 for(const event of ANOMALY_EVENTS){roll-=event.weight;if(roll<0){pick=event;break}}
 // Zestawy rezonansowe pomagają przeżyć zagrożenia, bez zmiany puli rzadkości lokacji.
 const active=Array.isArray(snapshot?.resonance)?snapshot.resonance:[];
 const seeker=active.includes('Ślady Wędrowca'),guardian=active.includes('Pieczęć Burzy');
 const protectedHazard=pick.kind==='hazard'&&(seeker||guardian);
 return {id:pick.id,name:pick.name,icon:pick.icon,kind:pick.kind,
  description:pick.description,protected:protectedHazard,
  protection:protectedHazard?(guardian?'Pieczęć Burzy':'Ślady Wędrowca'):null,
  luck:pick.luck||0,explore:protectedHazard?0:(pick.explore||0),
  scrap:protectedHazard?0:(pick.scrap||0),bonusLoot:pick.bonusLoot||0};
}
function anomalyReportPanel(r){
 const e=r?.anomaly;if(!e)return '';
 const mods=[e.luck?`Szczęście ${e.luck>0?'+':''}${e.luck}`:'',e.explore?`Eksploracja ${e.explore>0?'+':''}${e.explore} pp.`:'',e.bonusLoot?`Dodatkowe znalezisko +${e.bonusLoot}`:'',e.scrap?`Złom ${e.scrap>0?'+':''}${e.scrap}`:''].filter(Boolean);
 return `<div class="ashen-anomaly-report ${e.kind==='hazard'?'hazard':'boon'}"><div class="ashen-anomaly-heading"><span>${escape(e.icon||'◈')} ZJAWISKO REZONANSU</span><strong>${escape(e.name||'Nieznana anomalia')}</strong></div><p>${escape(e.description||'')}</p>${e.protected?`<p class="good">◈ Ochrona zestawu ${escape(e.protection)} zneutralizowała negatywny efekt.</p>`:''}${mods.length?`<div class="ashen-anomaly-modifiers">${mods.map(v=>`<span>${escape(v)}</span>`).join('')}</div>`:''}</div>`;
}
function explorationReportPanel(r){
 const e=r?.exploration;
 if(!e)return '';
 const chances=(e.rarityWeights||[]).map((w,i)=>w?`${rarities[i].name} ${w}%`:null).filter(Boolean).join(' · ');
 return `<div class="ashen-exploration-report"><div class="ashen-explore-heading">⌖ WYNIK EKSPLORACJI</div><div class="ashen-explore-metrics"><span>Skuteczność <strong>${e.chance}%</strong></span><span>Szczęście <strong>+${e.luck}</strong></span><span>Test <strong class="${e.success?'good':'bad'}">${e.success?'Udany':'Nieudany'}</strong></span></div><p class="small ${e.success?'good':'muted'}">${e.success?'Odnaleziono dodatkowy przedmiot dzięki eksploracji.':'Nie znaleziono dodatkowego przedmiotu z testu eksploracji.'}</p><p class="small muted">Pula rzadkości podczas wyprawy: ${escape(chances)}</p></div>`;
}
function rarityWeightsForExpedition(loc){
 const id=typeof loc==='string'?loc:loc?.id;
 return EXPEDITION_RARITY_WEIGHTS[id]||null;
}
function rollRarity(weights){
 const pool=weights||rarities.map(q=>q.weight);
 const total=pool.reduce((sum,w)=>sum+w,0);
 if(total<=0)return 0;
 let value=Math.random()*total;
 for(let i=0;i<pool.length;i++){
  value-=pool[i];if(value<0)return i;
 }
 return pool.length-1;
}
function expeditionRarityLabel(loc){
 const weights=rarityWeightsForExpedition(loc);
 return weights?weights.map((w,i)=>w?`${rarities[i].name} ${w}%`:null).filter(Boolean).join(' · '):'';
}
function rollItem(id,expedition=null,luck=0){
 const d=item(id);
 let weights=explorationRarityWeights(expedition,luck);
 // Artefakty zaczynają się od rzadkiej jakości; legenda tylko na dalekiej wyprawie.
 if(d?.artifact){weights=weights.map((w,i)=>i>=2?w:0);if(!weights.some(Boolean))weights=[0,0,1,0,0]}
 const rar=rollRarity(weights);
 const prefix=d?.artifact?pickModifier(artifactPrefixDefs,d,rar):d?.slot!=='material'&&Math.random()<prefixChance[rar]?pickModifier(prefixDefs,d,rar):null;
 const suffix=d?.artifact?(Math.random()<(rar>=4?.9:rar>=3?.75:.5)?pickModifier(artifactSuffixDefs,d,rar):null):d?.slot!=='material'&&Math.random()<suffixChance[rar]?pickModifier(suffixDefs,d,rar):null;
 return {uid:'loot-'+Date.now()+'-'+Math.random().toString(36).slice(2,10),id,rarity:rar,prefix,suffix,artifactAffixesInitialized:!!d?.artifact,locked:rar>=3};
}
function bonusText(b){return Object.entries(b||{}).filter(([,v])=>v!==0).map(([k,v])=>`${attrNames[k]} ${v>0?'+':''}${v}`).join(' · ')}
function modifierText(m){return [m.luck?`Szczęście +${m.luck}`:null,bonusText(m.bonus),m.damagePct?`Obrażenia ${m.damagePct>0?'+':''}${m.damagePct}%`:null,m.armorPct?`Pancerz ${m.armorPct>0?'+':''}${m.armorPct}%`:null,m.critPp?`Szansa trafienia krytycznego +${m.critPp} p.p.`:null,m.accuracy?`Celność ${m.accuracy>0?'+':''}${m.accuracy} pkt`:null,m.armorPen?`Przebicie pancerza +${m.armorPen} pkt`:null,m.extraAttacks?`Dodatkowy osłabiony atak (około +12% sekwencji)`:null].filter(Boolean).join(' · ')}
function slotName(slot){return slotLabels[slot]||({hand1:'Broń jednoręczna',hand2:'Broń dwuręczna',material:'Surowiec'})[slot]||slot}
function statDetails(o){return `${weaponSlot(o.slot)?`Obrażenia ${o.min}–${o.max}${o.slot==='hand2'?' · obie ręce':''}`:o.slot==='material'?'Materiał':`Pancerz ${o.armor||0}`}${bonusText(o.bonus)?' · '+bonusText(o.bonus):''}${o.critPp?` · Krytyk +${o.critPp} p.p.`:''}${o.accuracy?` · Celność +${o.accuracy} pkt`:''}${o.extraAttacks?` · Osłabiony atak +${o.extraAttacks}`:''}${o.labPen?` · Przebicie pancerza ${o.labPen}`:''}`}
function affixDetails(o){return (o.effects||[]).length?`<div class="small muted" style="margin-top:5px">${o.effects.map(x=>`<div>↳ ${escape(x.name)}: ${escape(x.description)}</div>`).join('')}</div>`:''}
// Podstawowe wyposażenie może wypaść na KAŻDEJ zwykłej wyprawie.
// Zachowujemy względne wagi przedmiotów z wcześniejszych pul, bez ograniczeń lokacji.
// Oddzielne pule bossów, artefaktów i surowców nie są tu mieszane.
const COMMON_EXPEDITION_DROPS=(()=>{
 const weights=new Map();
 for(const loc of locations)for(const [id,w] of loc.drops){
  if(Number.isFinite(w)&&w>0)weights.set(id,Math.max(weights.get(id)||0,w));
 }
 return items.filter(d=>d.slot!=='material'&&!d.artifact&&!d.id.startsWith('boss'))
  .map(d=>({id:d.id,w:weights.get(d.id)||0.10}));
})();
function pickLoot(loc,exploration=null,forcedCount=null){
 // Każda wyprawa: 1 przedmiot pewny; 28% szans na drugi, 7% na trzeci.
 const roll=Math.random(),count=roll<.07?3:roll<.35?2:1;
 const all=COMMON_EXPEDITION_DROPS.slice();
 // Artefakty są rzadkimi znaleziskami, niezależnymi od zwykłej puli akcesoriów.
 if(loc.id==='hospital')for(const id of ['ash_needle','ash_eye','ash_dust'])all.push({id,w:0.018});
 if(loc.id==='outpost')for(const id of artifactItems.map(x=>x.id))all.push({id,w:0.034});
 const pool=all.filter(x=>item(x.id));
 const picks=[];
 const actualCount=(forcedCount===null?count:forcedCount)+(exploration?.success?1:0);
 for(let i=0;i<actualCount;i++){
  const total=pool.reduce((v,x)=>v+x.w,0);let r=Math.random()*total,chosen=pool[pool.length-1];
  for(const p of pool){r-=p.w;if(r<=0){chosen=p;break}}
  const rolled=rollItem(chosen.id,loc,exploration?.luck||0);picks.push(rolled);state.inventory.push(rolled);
 }
 return picks;
}
const PAGE_KEY='ashen-active-page';
const PAGE_IDS=new Set(['character','companion','transport','missions','arena','pvp','messages','clans','expeditions','players','inventory','workshop','storage','reports','bunker']);
let page='character',message='',invFilter='all',invGroup='all',selectedUid=null,workshopUid=null;
try{const previousPage=localStorage.getItem(PAGE_KEY);if(PAGE_IDS.has(previousPage))page=previousPage}catch{}
function setPage(next){page=PAGE_IDS.has(next)?next:'character';try{localStorage.setItem(PAGE_KEY,page)}catch{}}let bulkSelected=new Set();const $=id=>document.getElementById(id),item=id=>items.find(x=>x.id===id),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{const data=JSON.stringify(state);localStorage.setItem(KEY,data);if(devActiveId()==='main')localStorage.setItem(devProfileSaveKey('main'),data);window.ASHEN_ONLINE?.localChanged()}catch{message='Nie można zapisać postępu w tej przeglądarce.'}}// ASHEN v0.1.39 — zestawy ubioru rozpoznawane po prefiksie, a nie nazwie przedmiotu.
// Stare identyfikatory prefiksów są mapowane na ich współczesne odpowiedniki.
const SETS={
 armor_reinforced:{name:'Wzmocniony',attribute:'end',start:2,step:1},
 armor_plated:{name:'Pancerny',armorPct:true,start:6,step:3},
 armor_flexible:{name:'Elastyczny',attribute:'dex',start:2,step:1},
 armor_agile:{name:'Zwinny',attribute:'dex',start:2,step:1},
 armor_light:{name:'Lekki',attribute:'per',start:2,step:1},
 armor_resistant:{name:'Odporny',attribute:'end',start:2,step:1},
 armor_tracker:{name:'Tropicielski',attribute:'per',start:2,step:1},
 armor_iron:{name:'Żelazny',attribute:'str',start:2,step:1},
 armor_warden:{name:'Wartownika',attribute:'end',start:2,step:1},
 armor_nomad:{name:'Nomady',attribute:'dex',start:2,step:1}
};
function setPrefixId(inst){
 const d=def(inst);if(!d||!clothingSlots.has(d.slot))return null;
 const p=findModifier(prefixDefs,inst?.prefix);
 return p&&p.setId&&SETS[p.setId]?p.setId:null;
}
function setQuality(inst){const i=Math.max(0,Math.min(4,Number(inst?.rarity)||0));return [1,1.2,1.5,2,2.5][i]}
function setResults(){
 const groups={};
 for(const slot of clothingSlots){
  const inst=instance(state.equip?.[slot]);if(!inst)continue;
  const id=setPrefixId(inst);if(!id)continue;
  (groups[id]??=[]).push({slot,inst});
 }
 return Object.entries(groups).map(([id,members])=>{
  const config=SETS[id],count=members.length;
  const avg=members.reduce((sum,m)=>sum+setQuality(m.inst),0)/count;
  const base=count>=3?config.start+Math.max(0,count-3)*config.step:0;
  const amount=count>=3?Math.round(base*avg):0;
  return {id,name:config.name,config,members,count,avg,base,amount,active:count>=3};
 });
}
function activeSetBonuses(){
 const bonus={},results=setResults();let armorPct=0;
 for(const s of results){if(!s.active)continue;
  if(s.config.armorPct)armorPct+=s.amount;
  else bonus[s.config.attribute]=(bonus[s.config.attribute]||0)+s.amount;
 }
 return {bonus,armorPct,results};
}
function setBonusDescription(result){
 if(!result)return '';
 return result.config.armorPct?`Pancerz +${result.amount}%`:`${attrNames[result.config.attribute]} +${result.amount}`;
}
// Prognoza liczona z obecnej średniej jakości części; dla przedmiotu spoza ekwipunku
// pokazuje orientacyjną premię za 3/3 z jego rzadkością.
function projectedSetBonus(config,average){
 const amount=Math.max(1,Math.round(config.start*(average||1)));
 return config.armorPct?`Pancerz +${amount}%`:`${attrNames[config.attribute]} +${amount}`;
}
function setStatusText(inst){
 const id=setPrefixId(inst);if(!id)return '';
 const cfg=SETS[id],result=setResults().find(s=>s.id===id);
 const count=result?.count||0,equipped=Object.values(state.equip||{}).includes(inst.uid),active=count>=3&&equipped;
 const avg=result?.avg||setQuality(inst);
 return `<div class="ashen-set-inline ${active?'is-active':'is-pending'}" aria-label="Zestaw ${escape(cfg.name)}"><strong>${active?'✓ AKTYWNY':equipped?'◌ NIEAKTYWNY':'◇ ELEMENT ZESTAWU'} · Zestaw ${escape(cfg.name)} (${count}/6)</strong><span>${active?`Premia zestawu: ${escape(setBonusDescription(result))}`:`Premia za 3 elementy: ${escape(projectedSetBonus(cfg,avg))} · ${equipped?`brakuje ${Math.max(0,3-count)}`:'załóż przedmiot, by go zaliczyć'}`}</span></div>`;
}
function setSummaryCard(result){
 const missing=Math.max(0,3-result.count);
 const items=result.members.map(m=>`<div class="ashen-set-member"><span>${escape(slotLabels[m.slot])}</span><strong>${escape(statsOf(m.inst)?.name||def(m.inst)?.name||'Przedmiot')}</strong><span class="ashen-set-quality">${escape(rarities[Math.max(0,Math.min(4,Number(m.inst.rarity)||0))].name)}</span></div>`).join('');
 const bonus=result.active?`AKTYWNY · ${setBonusDescription(result)}`:`NIEAKTYWNY · za 3/3: ${projectedSetBonus(result.config,result.avg)} · brakuje ${missing} ${missing===1?'elementu':'elementów'}`;
 return `<article class="ashen-set-card ${result.active?'is-active':''}"><div class="ashen-set-top"><strong>Zestaw ${escape(result.name)}</strong><span class="ashen-set-count">${result.count}/6 · ${result.active?'AKTYWNY':'NIEAKTYWNY'}</span></div><div class="ashen-set-track">${Array.from({length:6},(_,i)=>`<i class="${i<result.count?'filled':''}"></i>`).join('')}</div><div class="ashen-set-members">${items}</div><div class="ashen-set-bottom"><span>${escape(bonus)}</span><small>Śr. jakość ×${result.avg.toFixed(2).replace('.',',')}${result.active?' · premia doliczona':''}</small></div></article>`;
}

// ASHEN 0.4.7.2 — planowanie setów nie wymaga posiadania przedmiotów.
// Obliczenia korzystają z tych samych SETS, ACCESSORY_SETS i setQuality,
// które napędzają rzeczywisty ekwipunek. Plan nie zapisuje się w postaci.
const SET_PLANNER_KEY='ashen-set-planner-v0472';
const SET_PLANNER_FAMILIES=Object.keys(SETS);
function defaultSetPlan(){return {clothing:['armor_warden','armor_warden','armor_warden','armor_nomad','armor_nomad','armor_nomad'],accessories:['accessory_observant','accessory_observant','accessory_observant'],quality:0}}
function loadSetPlan(){
 let stored;try{stored=JSON.parse(localStorage.getItem(SET_PLANNER_KEY)||'null')}catch{}
 const d=defaultSetPlan();
 const valid=(values,allowed,count,fallback)=>Array.isArray(values)&&values.length===count?values.map((v,i)=>allowed.includes(v)?v:fallback[i]):fallback;
 return {clothing:valid(stored?.clothing,['none',...SET_PLANNER_FAMILIES],6,d.clothing),accessories:valid(stored?.accessories,['none',...Object.keys(ACCESSORY_SETS)],3,d.accessories),quality:Math.max(0,Math.min(4,Number.isInteger(stored?.quality)?stored.quality:0))};
}
let setPlanner=null;let setPlannerOpen=false;
function saveSetPlan(){try{localStorage.setItem(SET_PLANNER_KEY,JSON.stringify(setPlanner))}catch{}}
function plannerBonuses(){
 const avg=setQuality({rarity:setPlanner.quality});
 const groups={};
 for(const id of setPlanner.clothing){if(SETS[id])groups[id]=(groups[id]||0)+1}
 const clothes=Object.entries(groups).map(([id,count])=>{
  const cfg=SETS[id],base=count>=3?cfg.start+(count-3)*cfg.step:0;
  return {id,count,name:cfg.name,active:count>=3,amount:count>=3?Math.round(base*avg):0,config:cfg};
 });
 const extras={};for(const id of setPlanner.accessories){if(ACCESSORY_SETS[id])extras[id]=(extras[id]||0)+1}
 const accessories=Object.entries(extras).map(([id,count])=>{
  const cfg=ACCESSORY_SETS[id],active=count===3;
  const bonus=active?Object.fromEntries(Object.entries(cfg.bonus).map(([key,value])=>[key,Math.max(1,Math.round(value*avg))])):{};
  return {id,count,name:cfg.name,active,bonus};
 });
 return {clothes,accessories,avg};
}
function plannerResultHtml(){
 const r=plannerBonuses();
 const cloth=r.clothes.length?r.clothes.map(v=>`<div class="ashen-set-member"><span>${escape(v.name)} · ${v.count}/6</span><strong>${v.active?escape(v.config.armorPct?`Pancerz +${v.amount}%`:`${attrNames[v.config.attribute]} +${v.amount}`):'Brak premii (minimum 3)'}</strong></div>`).join(''):'<div class="small muted">Brak odzieży z rodziny setowej.</div>';
 const extras=r.accessories.length?r.accessories.map(v=>`<div class="ashen-set-member"><span>${escape(v.name)} · ${v.count}/3</span><strong>${v.active?escape(accessoryBonusText(v.bonus)):'Brak premii (wymagane 3/3)'}</strong></div>`).join(''):'<div class="small muted">Brak akcesoriów z rodziny setowej.</div>';
 return `<div class="ashen-sets-grid"><article class="ashen-set-card"><strong>Sety ubioru</strong><div class="ashen-set-members">${cloth}</div></article><article class="ashen-set-card"><strong>Sety akcesoriów</strong><div class="ashen-set-members">${extras}</div></article></div><p class="small muted" style="margin:10px 0 0">Jakość: ×${r.avg.toFixed(2).replace('.',',')} · Liczymy dokładnie jak w aktualnym ekwipunku. Indywidualne premie przedmiotów nie są tu uwzględnione.</p>`;
}
function setPlannerPanel(){
 const clothingOpts=[['none','— Bez prefiksu setowego —'],...SET_PLANNER_FAMILIES.map(id=>[id,SETS[id].name])];
 const accessoryOpts=[['none','— Bez prefiksu setowego —'],...Object.keys(ACCESSORY_SETS).map(id=>[id,ACCESSORY_SETS[id].name])];
 const field=(type,index,opts)=>`<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem"><span>${type==='clothing'?slotLabels[['head','shirt','outer','hands','pants','boots'][index]]:`Akcesorium ${index+1}`}</span><select data-set-planner="${type}" data-set-slot="${index}" style="width:100%;min-width:0;padding:8px;background:var(--panel,#171e27);color:inherit;border:1px solid var(--border,#57606c);border-radius:6px">${opts.map(([id,label])=>`<option value="${id}" ${(setPlanner[type][index]===id)?'selected':''}>${escape(label)}</option>`).join('')}</select></label>`;
 return `<details class="panel section" id="ashen-set-planner" ${setPlannerOpen?'open':''}><summary style="cursor:pointer;font-weight:700">🧩 Planer setów — porównaj 6+0 i 3+3 bez zdobywania przedmiotów</summary><p class="small muted">Symulator używa obecnych progów i premii setowych. Nie zmienia ekwipunku, statystyk ani zapisu postaci; zapamiętuje tylko wybór w tej przeglądarce.</p><div class="actions" style="margin:12px 0;flex-wrap:wrap"><button type="button" data-set-preset="full">6 × Wartownika</button><button type="button" data-set-preset="mixed">3 Wartownika + 3 Nomady</button><button type="button" data-set-preset="partial">4 Wartownika + 2 Nomady</button><button type="button" data-set-preset="clear">Wyczyść</button></div><label style="display:flex;align-items:center;gap:8px;margin-bottom:12px">Jakość wszystkich elementów (testowo): <select data-set-planner="quality" style="padding:8px;background:var(--panel,#171e27);color:inherit;border:1px solid var(--border,#57606c);border-radius:6px">${rarities.map((r,i)=>`<option value="${i}" ${setPlanner.quality===i?'selected':''}>${escape(r.name)} · ×${setQuality({rarity:i}).toFixed(2)}</option>`).join('')}</select></label><h4>Odzież — sześć slotów</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:16px">${setPlanner.clothing.map((_,i)=>field('clothing',i,clothingOpts)).join('')}</div><h4>Akcesoria — trzy sloty</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:16px">${setPlanner.accessories.map((_,i)=>field('accessories',i,accessoryOpts)).join('')}</div><div id="ashen-set-planner-result" aria-live="polite">${plannerResultHtml()}</div></details>`;
}
function updateSetPlannerDisplay(){const target=document.getElementById('ashen-set-planner-result');if(target)target.innerHTML=plannerResultHtml();}

function characterSetsPanel(){
 const results=setResults();
 return `<section class="ashen-sets-section"><div class="ashen-sets-title"><h3>Zestawy ubioru — prefiksy</h3><p>Załóż 3 elementy ubioru z tym samym prefiksem. Każdy następny zwiększa premię, którą wzmacnia średnia jakość wszystkich części. Możesz nosić dwa zestawy naraz (3+3). Liczą się tylko założone przedmioty — nie broń ani akcesoria.</p></div><div class="ashen-sets-grid">${results.length?results.map(setSummaryCard).join(''):'<div class="ashen-sets-empty">Brak założonych elementów z prefiksami zestawowymi. Starszy prefiks „Zwinny” również tworzy zestaw.</div>'}</div></section>`;
}
function itemSetPanel(inst){
 const id=setPrefixId(inst);if(!id)return '';
 const config=SETS[id],result=setResults().find(s=>s.id===id);
 const equipped=Object.values(state.equip||{}).includes(inst.uid);
 const count=result?.count||0, active=Boolean(result?.active)&&equipped;
 const ownQuality=setQuality(inst), currentAvg=result?.avg||0;
 // For a non-equipped item estimate the bonus from the proposed set of worn pieces.
 // If the slot is occupied by another piece, replace rather than double-count that slot.
 const slot=def(inst)?.slot;
 const prospectiveMembers=equipped?(result?.members||[]):(result?.members||[]).filter(m=>m.slot!==slot).concat([{slot,inst}]);
 const prospectiveCount=prospectiveMembers.length;
 const prospectiveAvg=prospectiveMembers.reduce((total,m)=>total+setQuality(m.inst),0)/Math.max(1,prospectiveCount);
 const projectedCount=Math.max(3,prospectiveCount),projectedBase=config.start+Math.max(0,projectedCount-3)*config.step;
 const projectedAmount=Math.round(projectedBase*prospectiveAvg);
 const description=config.armorPct?`Pancerz +${projectedAmount}%`:`${attrNames[config.attribute]} +${projectedAmount}`;
 const members=result?.members||[];
 const membersHtml=members.map(m=>{const rarityIndex=Math.max(0,Math.min(4,Number(m.inst.rarity)||0));return `<div class="ashen-set-detail-member"><span>${escape(slotLabels[m.slot])}: <strong>${escape(statsOf(m.inst)?.name||def(m.inst)?.name||'Przedmiot')}</strong></span><span>${escape(rarities[rarityIndex].name)} · ×${setQuality(m.inst).toFixed(2).replace('.',',')}</span></div>`}).join('');
 const owningInSet=equipped&&count>0;
 const text=active?`Premia zestawu: ${escape(setBonusDescription(result))}`:
  owningInSet?`Premia za 3 elementy: ${escape(description)} · brakuje ${Math.max(0,3-count)}`:
  `Po założeniu tego przedmiotu: ${prospectiveCount}/6 · ${prospectiveCount>=3?`możliwy bonus: ${escape(description)}`:`premia za 3 elementy: ${escape(description)}`}`;
 const note=active?'Ta premia jest już doliczana do statystyk postaci.':equipped?'Premia jest nieaktywna — załóż brakujące elementy z tym samym prefiksem.':'Przedmiot nie jest założony. Prognoza uwzględnia zastąpienie wyposażenia w tym samym slocie.';
 return `<div class="ashen-set-item-info ${active?'is-active':'is-pending'}"><strong>${active?'✓ AKTYWNY':equipped?'◌ NIEAKTYWNY':'◇ ELEMENT ZESTAWU'} · Zestaw ${escape(config.name)} (${count}/6 założonych)</strong><div class="ashen-set-detail-main">${text}</div><small>${escape(note)}</small><details class="ashen-set-breakdown"><summary>Skąd bierze się premia? · Założone elementy i jakość</summary><div class="ashen-set-detail-members">${membersHtml||'<div class="muted">Brak założonych elementów tego zestawu.</div>'}</div><div class="ashen-set-detail-equation">${count?`Średnia jakości: (${members.map(m=>setQuality(m.inst).toFixed(2).replace('.',',')).join(' + ')}) / ${count} = ×${currentAvg.toFixed(2).replace('.',',')}`:'Średnia jakości zostanie obliczona z założonych części.'}</div>${result?.active?`<div class="ashen-set-detail-equation">Bonus bazowy: ${result.base} × ${result.avg.toFixed(2).replace('.',',')} → ${escape(setBonusDescription(result))}</div>`:`<div class="ashen-set-detail-equation">Do aktywacji potrzeba minimum 3 części z tym samym prefiksem. Kolejne części wzmacniają premię.</div>`}</details></div>`;
}
// ASHEN 0.4.7.1 — sety zwyklych akcesoriow (3/3) oraz wspolistnienie wielu setow ubioru.
// Prefiks decyduje o rodzinie. Sufiks pozostaje niezalezny; 1/3 i 2/3 nie daja premii.
// Artefakty maja wlasny, osobny rezonans i nie sa liczone do zwyklych setow akcesoriow.
const ACCESSORY_SETS=Object.freeze({
 accessory_technical:{name:'Technika',bonus:{int:3}},
 accessory_observant:{name:'Tropiciela',bonus:{per:3}},
 accessory_persuasive:{name:'Negocjatora',bonus:{cha:3}},
 accessory_reflexive:{name:'Nomady',bonus:{dex:3}},
 accessory_versatile:{name:'Ocalałego',bonus:{end:2,per:1}}
});
// Planer uruchamiamy dopiero po zdefiniowaniu ACCESSORY_SETS,
// aby uniknac ReferenceError (temporal dead zone) przy starcie gry.
setPlanner=loadSetPlan();
const ACCESSORY_SLOTS=['extra','extra2','extra3'];
function accessorySetPrefixId(inst){
 const d=def(inst);
 if(!d||d.artifact||d.slot!=='extra')return null;
 const p=findModifier(prefixDefs,inst.prefix);
 return p&&p.setId&&ACCESSORY_SETS[p.setId]?p.setId:null;
}
function accessorySetResults(){
 const groups={};const seen=new Set();
 for(const slot of ACCESSORY_SLOTS){
  const inst=instance(state.equip?.[slot]);if(!inst||seen.has(inst.uid))continue;
  seen.add(inst.uid);
  const id=accessorySetPrefixId(inst);if(!id)continue;
  (groups[id]??=[]).push({slot,inst});
 }
 return Object.entries(groups).map(([id,members])=>{
  const count=members.length,avg=members.reduce((a,m)=>a+setQuality(m.inst),0)/count;
  const active=count===3,config=ACCESSORY_SETS[id],bonus={};
  if(active)for(const [stat,val] of Object.entries(config.bonus))bonus[stat]=Math.max(1,Math.round(val*avg));
  return {id,name:config.name,config,members,count,avg,active,bonus};
 });
}
function accessorySetBonuses(){
 const results=accessorySetResults(),bonus={};
 for(const result of results)if(result.active)for(const [key,value] of Object.entries(result.bonus))bonus[key]=(bonus[key]||0)+value;
 return {results,bonus};
}
function accessoryBonusText(bonus){return Object.entries(bonus).map(([k,v])=>`${attrNames[k]||k} +${v}`).join(' · ');}
function accessorySetPanel(){
 const results=accessorySetResults();
 const cards=results.map(r=>`<article class="ashen-set-card ${r.active?'is-active':''}"><div class="ashen-set-top"><strong>Zestaw akcesoriów: ${escape(r.name)}</strong><span class="ashen-set-count">${r.count}/3 · ${r.active?'AKTYWNY':'NIEAKTYWNY'}</span></div><div class="ashen-set-track">${Array.from({length:3},(_,i)=>`<i class="${i<r.count?'filled':''}"></i>`).join('')}</div><div class="ashen-set-members">${r.members.map(m=>`<div class="ashen-set-member"><span>${escape(slotLabels[m.slot])}</span><strong>${escape(statsOf(m.inst)?.name||def(m.inst)?.name||'Akcesorium')}</strong></div>`).join('')}</div><div class="ashen-set-bottom"><span>${r.active?`Bonus: ${escape(accessoryBonusText(r.bonus))}`:`Brak premii · potrzebne 3/3 (brakuje ${3-r.count})`}</span><small>Różne sufiksy i jakości są dozwolone</small></div></article>`).join('');
 return `<section class="ashen-sets-section"><div class="ashen-sets-title"><h3>Zestawy akcesoriów — 3/3</h3><p>Trzy zwykłe akcesoria z tej samej rodziny prefiksu uruchamiają bonus. Jeden lub dwa elementy nie dają żadnej premii setowej. Artefakty zachowują osobny system Rezonansu.</p></div><div class="ashen-sets-grid">${cards||'<div class="ashen-sets-empty">Załóż zwykłe akcesoria z setowymi prefiksami, aby kompletować zestaw.</div>'}</div></section>`;
}
function accessorySetItemPanel(inst){
 const id=accessorySetPrefixId(inst);if(!id)return '';
 const cfg=ACCESSORY_SETS[id],result=accessorySetResults().find(r=>r.id===id),count=result?.count||0;
 const equipped=ACCESSORY_SLOTS.some(slot=>state.equip?.[slot]===inst.uid);
 const active=Boolean(result?.active)&&equipped;
 return `<div class="ashen-set-item-info ${active?'is-active':'is-pending'}"><strong>${active?'✓ AKTYWNY':equipped?'◌ NIEAKTYWNY':'◇ ELEMENT SETU'} · Akcesoria ${escape(cfg.name)} (${count}/3)</strong><div class="ashen-set-detail-main">${active?`Bonus setowy: ${escape(accessoryBonusText(result.bonus))}`:'Bonus setowy nieaktywny. Aktywacja dopiero przy 3/3.'}</div><small>${equipped?`Liczba brakujących elementów: ${Math.max(0,3-count)}.`:'Załóż to akcesorium w jednym z trzech slotów.'} Rodzina zależy od prefiksu; sufiks może być dowolny.</small></div>`;
}
function attrs(){const a={...state.attrs};Object.values(state.equip).filter(Boolean).forEach(uid=>{for(const [k,v] of Object.entries(statsOf(instance(uid))?.bonus||{}))a[k]+=v});for(const [k,v] of Object.entries(activeSetBonuses().bonus))a[k]=(a[k]||0)+v;for(const [k,v] of Object.entries(accessorySetBonuses().bonus))a[k]=(a[k]||0)+v;for(const [k,v] of Object.entries(resonanceBonuses().bonus))a[k]=(a[k]||0)+v;return a}function maxHp(){return Math.round((60+attrs().end*10)*(1+0.025*(roomLevel('infirmary')-1)))}function xpNeed(){return Math.floor(80*Math.pow(state.level,1.35))}function regen(){let now=Date.now(),ticks=Math.floor((now-state.lastRegen)/45000);if(ticks>0){state.energy=Math.min(100,state.energy+ticks);state.lastRegen+=ticks*45000}}function levelUp(){let n=0;while(state.xp>=xpNeed()){state.xp-=xpNeed();state.level++;state.points+=3;n++}return n}// Jedna klasyfikacja dla obrażeń, celności i opisu w zakładce Postać.
// Typ broni wynika z niezmiennego identyfikatora — nie z jej nazwy ani prefiksu.
const MELEE_ONE_IDS=new Set(['knife','pipe','machete','cleaver','wrench','hatchet','baton','saber']);
const MELEE_TWO_IDS=new Set(['hammer','crowbar','sledge']);
const NONFIRE_RANGED_IDS=new Set(['crossbow','harpoon']);
const WEAPON_STYLES={
 melee1:{label:'Broń biała jednoręczna',main:'Zręczność',secondary:'Siła',desc:'Zręczność zwiększa celność, a Siła i Zręczność zwiększają obrażenia.'},
 melee2:{label:'Broń biała dwuręczna',main:'Siła',secondary:'Zręczność',desc:'Siła zwiększa przede wszystkim obrażenia, a Siła i Zręczność wspierają celność.'},
 firearm:{label:'Broń palna / technologiczna',main:'Percepcja',secondary:'Zręczność',desc:'Percepcja zwiększa celność i obrażenia; Zręczność wspomaga celność.'},
 nonfire:{label:'Broń dystansowa niepalna',main:'Percepcja',secondary:'Zręczność',desc:'Percepcja i Zręczność wspólnie zwiększają celność i obrażenia.'}
};
function weaponStyle(weapon){
 const id=weapon?.id;
 if(MELEE_ONE_IDS.has(id))return 'melee1';
 if(MELEE_TWO_IDS.has(id))return 'melee2';
 if(NONFIRE_RANGED_IDS.has(id))return 'nonfire';
 return 'firearm';
}
function weaponAttributeDamage(a,weapon){
 const str=a.str||0,dex=a.dex||0,per=a.per||0;
 switch(weaponStyle(weapon)){
  case 'melee1':return Math.floor(str/5+dex/10);
  case 'melee2':return Math.floor(str/3.5+dex/18);
  case 'nonfire':return Math.floor(per/9+dex/9);
  default:return Math.floor(per/6);
 }
}
function weaponAccuracy(a,weapon){
 const str=a.str||0,dex=a.dex||0,per=a.per||0;
 switch(weaponStyle(weapon)){
  case 'melee1':return 6+dex*1.25+per*.25;
  case 'melee2':return 6+str*.5+dex*.75+per*.15;
  case 'nonfire':return 6+per*.9+dex*.7;
  default:return 6+per*1.4+dex*.25;
 }
}
function weaponDamageRange(a,weapon,power=1){
 const bonus=weaponAttributeDamage(a,weapon),low=Math.max(1,Math.floor(((weapon?.min||1)+bonus)*power));
 return {low,high:Math.max(low,Math.floor(((weapon?.max||1)+bonus)*power)),bonus};
}
function damage(p,e){let base=rand(p.min,p.max)+Math.floor(e.str/3);return Math.max(1,Math.floor(base*(1-clamp((e.armor||0)/100,0,.6))))}
// Jedno źródło prawdy dla liczby ataków: bitwa i karta postaci.
function heroAttacks(){
 const hands=[state.dominantHand,state.dominantHand==='right'?'left':'right'];
 const main=statsOf(instance(state.equip[hands[0]])),off=statsOf(instance(state.equip[hands[1]]));
 const attacks=[];
 const addWeapon=(weapon,hand,power)=>{
  const count=Math.max(1,Math.min(3,Number(weapon?.baseAttacks)||1));
  for(let i=0;i<count;i++)attacks.push({weapon,hand,power});
  // Extra strike from Szybki is weak relative to ENTIRE base attack sequence,
  // not a free full hit from a single-shot high-damage weapon.
  // 0.12 applies to this weapon's sequence; never more than one bonus strike.
  if(weapon?.extraAttacks>0&&weapon.slot==='hand1')attacks.push({weapon,hand,power:Math.min(.36,.12*count*power)});
 };
 if(main&&main.slot==='hand1')addWeapon(main,hands[0],1);
 if(off&&off.slot==='hand2'){attacks.length=0;addWeapon(off,hands[1],1);}
 else if(off&&off.slot==='hand1')addWeapon(off,hands[1],.8);
 // Also support equipping 2R weapon in primary hand if UI permits it.
 if(!attacks.length&&main&&main.slot==='hand2')addWeapon(main,hands[0],1);
 if(!attacks.length)addWeapon(statsOf({id:'knife',rarity:0}),hands[0],1);
 return attacks;
}
// ASHEN v0.4.4: shared combat defense computation for exploration, Starcia,
// PvP snapshots and the character panel. The expedition flag here is historical:
// it marks a *solo exploration mission*, not a server-side faction expedition.
function heroDefense(options={}){
 const a=attrs();
 const rawArmor=Object.entries(state.equip).filter(([slot])=>!['right','left'].includes(slot))
  .reduce((sum,[,uid])=>sum+(statsOf(instance(uid))?.armor||0),0);
 const setArmor=activeSetBonuses().armorPct;
 const pet=companionId()==='boar'?petPower('boar'):0;
 const vehicleArmor=options.expedition?2*activeVehicleModule('armor'):0;
 return {hp:maxHp(),acc:6+a.per*1.3,dodge:3+a.dex*1.1+pet,
  armor:rawArmor+Math.round(rawArmor*setArmor/100)+Math.floor(a.end/4)+pet+vehicleArmor,
  setArmor,pet,vehicleArmor,rawArmor};
}
function fight(enemy,options={}){
 const a=options.testSnapshot?.attributes||attrs();
 const attacks=options.testSnapshot?.attacks||heroAttacks();
 const d=options.testSnapshot?.defense||heroDefense(options);
 const random=typeof options.testRandom==='function'?options.testRandom:Math.random;
 const randomInt=(lo,hi)=>Math.floor(random()*(hi-lo+1))+lo;
 const hero={hp:d.hp,acc:d.acc,dodge:d.dodge,armor:d.armor};
 const foe={...enemy},lines=[];
 // Rozszerzone raporty zapisujemy tylko dla Starć. Wyprawy pozostają bez zmian.
 const recordRounds=!!options.recordRounds;
 const heroMaxHp=hero.hp,foeMaxHp=foe.hp,roundHistory=[];
 const battleProfile=recordRounds?{
   hero:{name:state.name,origin:state.origin,level:state.level,hp:heroMaxHp,armor:hero.armor,dodge:Math.round(hero.dodge),accuracy:Math.round(hero.acc),str:a.str,dex:a.dex,end:a.end,per:a.per,int:a.int,cha:a.cha,attacks:attacks.length,
     weapons:attacks.map(w=>({name:w.weapon?.name||'Broń',hand:w.hand,power:Math.round(w.power*100),...weaponDamageRange(a,w.weapon,w.power)}))},
   enemy:{name:enemy.name,hp:foeMaxHp,armor:foe.armor,dodge:foe.dodge,accuracy:foe.acc,attackMin:foe.atk[0],attackMax:foe.atk[1]}
 }:null;
 const damageSummary={hero:{attempts:0,hits:0,misses:0,crits:0,damage:0,potential:0,best:0},foe:{attempts:0,hits:0,misses:0,crits:0,damage:0,potential:0,best:0},rounds:0};
 const hitAttack=(attacker,defender,who,r,weapon=null)=>{
   const performance=damageSummary[who==='hero'?'hero':'foe'];performance.attempts++;
   const accuracy=who==='hero'&&weapon?weaponAccuracy(a,weapon.weapon):attacker.acc;
   const chance=clamp(70+2*(accuracy-defender.dodge)+(who==='hero'?(weapon?.weapon.accuracy||0):0),15,95);
   const handName=weapon?' ('+(weapon.hand==='right'?'prawa':'lewa')+' ręka, '+Math.round(weapon.power*100)+'%)':'';
   if(random()*100>=chance){performance.misses++;lines.push(`Runda ${r}: ${who==='hero'?'Chybiasz':'Przeciwnik chybia'}${handName}.`);return}
   const critical=who==='hero'&&random()<clamp(.05+a.per*.005+(weapon?.weapon.critPp||0)/100,0,.35);
   let raw;
   if(weapon){raw=Math.max(1,Math.floor((randomInt(weapon.weapon.min,weapon.weapon.max)+weaponAttributeDamage(a,weapon.weapon))*weapon.power));}
   else raw=randomInt(attacker.atk[0],attacker.atk[1]);
   const labWeapon=who==='hero'&&weapon&&(options.testWeaponModel||weapon.weapon.combatV2)?weapon.weapon:null;
   const effectiveArmor=labWeapon?Math.max(0,defender.armor-(labWeapon.labPen||0)):defender.armor;
   if(critical&&!labWeapon)raw=Math.floor(raw*1.6);
   let dmg=Math.max(1,Math.floor(raw*(1-clamp(effectiveArmor/100,0,.6))));
   if(critical&&labWeapon)dmg=Math.max(1,Math.floor(dmg*(labWeapon.labCritMultiplier||1.6)));
   const actualDamage=Math.min(defender.hp,dmg);
   defender.hp=Math.max(0,defender.hp-dmg);
   performance.hits++;performance.damage+=actualDamage;performance.potential+=dmg;performance.best=Math.max(performance.best,actualDamage);if(critical)performance.crits++;
   lines.push(`Runda ${r}: ${who==='hero'?'Zadajesz':'Otrzymujesz'} ${actualDamage} obrażeń${handName}${critical?' (KRYTYCZNE)':''}.`);
 };
 const maxRounds=options.testSnapshot&&[10,15,20].includes(options.testMaxRounds)?options.testMaxRounds:10;
 for(let r=1;r<=maxRounds&&hero.hp>0&&foe.hp>0;r++){
   const startLine=lines.length,heroDamageStart=damageSummary.hero.damage,foeDamageStart=damageSummary.foe.damage;
   damageSummary.rounds=r;
   const order=randomInt(1,20)+a.dex>=randomInt(1,20)+foe.dodge?['hero','foe']:['foe','hero'];
   for(const who of order){
     if(hero.hp<=0||foe.hp<=0)break;
     if(who==='hero'){
       for(const weapon of attacks){if(foe.hp<=0)break;hitAttack(hero,foe,'hero',r,weapon)}
     } else hitAttack(foe,hero,'foe',r);
   }
   if(recordRounds)roundHistory.push({number:r,heroHp:hero.hp,enemyHp:foe.hp,
     heroDamage:damageSummary.hero.damage-heroDamageStart,enemyDamage:damageSummary.foe.damage-foeDamageStart,
     events:lines.slice(startLine)});
 }
 return {won:foe.hp<=0,lines,heroHp:hero.hp,enemyHp:foe.hp,damageSummary,
  ...(recordRounds?{battleProfile,roundHistory,heroMaxHp,enemyMaxHp:foeMaxHp}:{})};
}

// ASHEN v0.1.61 — Starcia: pięć rozdziałów po 10 etapów, osobny progres i raporty.
// Każde 10 poziomów stanowi rozdział, a etap 10, 20, 30, 40 i 50 jest bossem.
// Rozdział V domyka pierwszy cykl PvE bez zmiany schematu danych.
const ARENA_STAGES=[
 {level:1,name:'Głodny Włóczęga',epithet:'Cień przy starym wiadukcie',hp:25,atk:[2,4],acc:2,dodge:2,armor:0,description:'Nie znalazł jedzenia od wielu dni. Atakuje każdego, kto wygląda na łatwy cel.',story:'Na skraju wyschniętego kanału słyszysz skrzypienie ostrza. Ktoś zastępuje ci drogę.',reward:{xp:12,scrap:8,credits:8}},
 {level:2,name:'Zbieracz z Żelaznej Drogi',epithet:'Łowca cudzych zapasów',hp:36,atk:[3,5],acc:3,dodge:3,armor:1,description:'Ma tylko metalowy pręt, ale zna każdy zakręt ruin.',story:'Złomiarz unosi pręt jak znak ostrzegawczy. Za chwilę zacznie się walka.',reward:{xp:16,scrap:10,credits:12}},
 {level:3,name:'Rdzawy Rozbójnik',epithet:'Członek bandy z wiaduktu',hp:48,atk:[4,7],acc:4,dodge:4,armor:2,description:'Ruchy pod zbroją ma pewne. Nosi łupiony pancerz pełen kolców.',story:'Na pustej szosie błyska zardzewiały napierśnik. Rozbójnik przyjmuje pozycję bojową.',reward:{xp:20,scrap:14,credits:18}},
 {level:4,name:'Skażony Ratownik',epithet:'Ostatni z żółtego oddziału',hp:58,atk:[5,8],acc:5,dodge:4,armor:3,description:'Z resztek kombinezonu wydostaje się szary pył. Zbliża się bez słowa.',story:'Przy bramie szpitala stoi sylwetka w żółtym hełmie. Dłoń zaciska na ciężkim narzędziu.',reward:{xp:24,scrap:18,credits:24}},
 {level:5,name:'Mutant z Kanałów',epithet:'Żyjący pod spękaną ziemią',hp:72,atk:[6,10],acc:5,dodge:7,armor:1,description:'Szybki i nieprzewidywalny. Ciężki oddech zdradza go na chwilę przed skokiem.',story:'Z ciemnego włazu wychodzi coś, co kiedyś mogło być człowiekiem.',reward:{xp:30,scrap:22,credits:30}},
 {level:6,name:'Dezerter z Posterunku',epithet:'Szkolony do zabijania',hp:86,atk:[7,11],acc:7,dodge:5,armor:5,description:'Wojskowe szkolenie daje mu przewagę, choć sprzęt widział lepsze czasy.',story:'Dezerter sprawdza zamek karabinu. Nie zamierza odpuścić bez walki.',reward:{xp:36,scrap:28,credits:40}},
 {level:7,name:'Pielgrzym Pyłu',epithet:'Człowiek w masce z filtrami',hp:96,atk:[8,13],acc:7,dodge:7,armor:5,description:'Twierdzi, że słyszy szepty Zony. Zanim atakuje, przykłada dłoń do maski.',story:'W ruinach kaplicy metalowe filtry wydają cichy świst. Pielgrzym wyciąga broń.',reward:{xp:43,scrap:33,credits:50}},
 {level:8,name:'Snajper Złomowiska',epithet:'Oko z martwej wieży',hp:104,atk:[9,15],acc:11,dodge:8,armor:5,description:'Nie pozwala zbliżyć się bez walki. Utrzymuje dystans i oszczędza amunicję.',story:'Z drugiej strony placu rozbłyskuje luneta. Wróg zauważył cię pierwszy.',reward:{xp:50,scrap:38,credits:65}},
 {level:9,name:'Żelazny Egzekutor',epithet:'Osobisty strażnik Króla',hp:126,atk:[11,17],acc:9,dodge:6,armor:11,description:'Ciężkie płyty i hełm maskują jego twarz. Każdy cios waży tyle co młot.',story:'Przed bramą złomowiska stoi człowiek w stalowej skorupie. Blokuje przejście.',reward:{xp:64,scrap:50,credits:85}},
 {level:10,name:'Król Złomowiska',epithet:'Władca ruin i pierwszy boss',hp:190,atk:[14,21],acc:11,dodge:9,armor:14,description:'Zbudował swoje królestwo z odpadów i strachu. To pierwsze starcie, które wymaga naprawdę dobrego wyposażenia.',story:'Król unosi młot nad zardzewiałym tronem. Tłum cichnie. Pierwszy rozdział kończy się tutaj.',reward:{xp:120,scrap:100,credits:180},boss:true},

 // ROZDZIAŁ II — ZIEMIE BEZPRAWIA (poziomy 11–20). Trudność orientacyjna; balans zostaje na później.
 {level:11,name:'Łamacz Szlaków',epithet:'Poborca opłat na drodze Północnej',hp:210,atk:[14,23],acc:11,dodge:9,armor:13,description:'Wymusza haracz od każdej karawany, a odmowę traktuje jak zaproszenie do pojedynku.',story:'Na zniszczonym wiadukcie wysoki bandyta blokuje drogę metalową pałką.',reward:{xp:135,scrap:110,credits:195}},
 {level:12,name:'Cichy Nożownik',epithet:'Nocny łowca handlarzy',hp:230,atk:[16,25],acc:12,dodge:14,armor:11,description:'Walcząc dwoma ostrzami stawia na szybkość i uniki, nie na ciężki pancerz.',story:'Z bocznej alejki wychodzi kapturowa postać. W obu dłoniach połyskują noże.',reward:{xp:150,scrap:120,credits:215}},
 {level:13,name:'Łowca Konwojów',epithet:'Złodziej wojskowych zapasów',hp:255,atk:[18,27],acc:15,dodge:12,armor:15,description:'Doświadczony tropiciel z lunetą, który zna każdą drogę ucieczki.',story:'Daleki trzask zamka karabinu zagłusza wiatr. Na wzgórzu stoi łowca.',reward:{xp:170,scrap:135,credits:240}},
 {level:14,name:'Alchemik Wyziewów',epithet:'Chemik z nielegalnej rafinerii',hp:275,atk:[19,30],acc:14,dodge:11,armor:20,description:'Nosi fiolki lotnych substancji i grubą maskę. Jego sprzęt sprawdza się nawet w skażonym pyle.',story:'Za bramą rafinerii słychać syk palnika. Ktoś w żółtym kombinezonie podnosi broń.',reward:{xp:190,scrap:150,credits:270}},
 {level:15,name:'Oko bez Granic',epithet:'Snajperka z gangu Czarnej Linii',hp:300,atk:[22,33],acc:20,dodge:17,armor:14,description:'Wybitna strzelczyni. Dysponuje lekkim wyposażeniem i celuje bez wahania.',story:'Na szczycie opuszczonej stacji zarysowuje się sylwetka snajperki.',reward:{xp:220,scrap:165,credits:295}},
 {level:16,name:'Pięściarz z Betonowni',epithet:'Niepokonany w walkach o racje',hp:345,atk:[24,37],acc:16,dodge:13,armor:21,description:'Walczy pięściami obwiązanymi stalową taśmą i znosi obrażenia, które złamałyby innych.',story:'W betonowym kręgu rozlega się dźwięk uderzających o siebie pięści.',reward:{xp:245,scrap:185,credits:340}},
 {level:17,name:'Podpalacz Karawan',epithet:'Strażnik płonącej granicy',hp:370,atk:[26,39],acc:17,dodge:12,armor:27,description:'Jego improwizowany miotacz płomieni odstrasza nawet doświadczonych najemników.',story:'Spomiędzy wraków unosi się żar. Zamaskowany bandyta odpala palnik.',reward:{xp:275,scrap:205,credits:380}},
 {level:18,name:'Kapitan Zbrojnej Bandy',epithet:'Weteran najemników ze Wschodu',hp:410,atk:[28,43],acc:20,dodge:13,armor:31,description:'Dowodzi najemnikami wśród ruin. Ciężki pancerz i karabin czynią go wyjątkowo groźnym.',story:'Za rozbitym transporterem czeka kapitan. Nie daje rozkazu swoim ludziom — chce walczyć sam.',reward:{xp:305,scrap:230,credits:425}},
 {level:19,name:'Kat Czerwonego Placu',epithet:'Osobisty wykonawca wyroków Egzekutora',hp:465,atk:[31,47],acc:18,dodge:13,armor:36,description:'Nie rozstaje się z wielkim młotem. Każde jego zwycięstwo przypomina ostrzeżenie.',story:'Przed stalowymi drzwiami staje zakapturzony kat. Powoli unosi ciężki młot.',reward:{xp:350,scrap:270,credits:500}},
 {level:20,name:'Egzekutor',epithet:'Władca Ziem Bezprawia · drugi boss',hp:610,atk:[37,54],acc:23,dodge:16,armor:42,description:'Przejął kontrolę nad karawanami i targowiskami. Prowadzi bandy żelazną ręką, a przegranych skazuje na zapomnienie.',story:'Na placu egzekucji milkną generatory. W czerwonym pancerzu pojawia się człowiek, którego wszyscy się boją.',reward:{xp:700,scrap:450,credits:850},boss:true},

 // ROZDZIAŁ III — SKAŻONA STREFA (poziomy 21–30). Roboczy balans bez naruszania zasad starć.
 {level:21,name:'Tropiciel Skażenia',epithet:'Samotny zwiadowca strefy zakazanej',hp:650,atk:[39,57],acc:24,dodge:17,armor:39,description:'Przez wiele miesięcy obserwował życie na granicy toksycznej strefy. Jego filtr ledwo wytrzymuje.',story:'Z zielonej mgły wychodzi wychudzony tropiciel. W spojrzeniu ma więcej nieufności niż strachu.',reward:{xp:760,scrap:490,credits:910}},
 {level:22,name:'Medyk z Sektora C',epithet:'Ostatni sanitariusz zamkniętej placówki',hp:710,atk:[40,61],acc:24,dodge:19,armor:45,description:'Skażony ratownik w szczelnym skafandrze. Jego fiolki nie służą już do leczenia.',story:'Zawiasy drzwi ambulatorium jęczą. Medyk wyciąga zza pleców ciężki skalpel techniczny.',reward:{xp:820,scrap:530,credits:975}},
 {level:23,name:'Zdziczały Tropiciel',epithet:'Bestia z obozu badawczego',hp:790,atk:[44,65],acc:25,dodge:24,armor:35,description:'Szybka, zmutowana istota. Atakuje nagle i częściej unika ciosów niż osłania się pancerzem.',story:'Ciszę przerywa chrobot pazurów na betonie. Z ciemności wyskakuje zdeformowany drapieżnik.',reward:{xp:890,scrap:580,credits:1040}},
 {level:24,name:'Doktor Zarodników',epithet:'Eksperymentator bez skrupułów',hp:830,atk:[46,69],acc:28,dodge:19,armor:52,description:'Badacz, którego ciało przejęły obce zarodniki. Chemiczny osad na odzieży twardnieje jak pancerz.',story:'W szklarni laboratoryjnej ktoś mierzy twoje kroki. Wśród zarodników zapalają się zielone oczy.',reward:{xp:960,scrap:630,credits:1120}},
 {level:25,name:'Strażnik Zielonej Granicy',epithet:'Wojownik w pancerzu z odzysku',hp:910,atk:[48,73],acc:29,dodge:21,armor:57,description:'Były żołnierz, który podporządkował sobie przygranicznych szabrowników.',story:'Wśród toksycznych mokradeł słychać przeładowanie broni. Strażnik nie przepuszcza nikogo dalej.',reward:{xp:1050,scrap:690,credits:1220}},
 {level:26,name:'Nosiciel Zarazy',epithet:'Ofiara eksperymentu biologicznego',hp:1010,atk:[52,78],acc:27,dodge:20,armor:54,description:'Jego mięśnie pokrywa świecąca tkanka. Nie ma już ludzkich odruchów ani lęku.',story:'Ze zbiornika wydostaje się rozprysk zielonego płynu. Postać podnosi zdeformowane ręce.',reward:{xp:1150,scrap:750,credits:1340}},
 {level:27,name:'Dowódca Kwarantanny',epithet:'Egzekutor protokołu odcięcia',hp:1090,atk:[55,83],acc:34,dodge:24,armor:70,description:'Komendant zamkniętej stacji wojskowej. Ciężki kombinezon i broń maszynowa czynią go groźnym.',story:'Czerwona lampka nad śluzą rozbłyskuje. Dowódca daje ci ostatnią szansę odwrotu.',reward:{xp:1260,scrap:830,credits:1460}},
 {level:28,name:'Kryształowy Łowca',epithet:'Cień z reaktora anomalii',hp:1180,atk:[59,90],acc:34,dodge:28,armor:75,description:'Jego pancerz obrósł radioaktywnymi kryształami. Każdy ruch pozostawia ślad toksycznego pyłu.',story:'Pośród popękanych zbiorników rozbrzmiewa suchy trzask kryształów. Łowca rusza w twoją stronę.',reward:{xp:1380,scrap:920,credits:1610}},
 {level:29,name:'Tytan Kwarantanny',epithet:'Ostatni obrońca rdzenia',hp:1330,atk:[64,97],acc:33,dodge:18,armor:97,description:'Olbrzymi mutant w stalowym napierśniku. Jest powolny, ale potrafi przetrwać długie serie trafień.',story:'Za pękniętą pancerną ścianą rozlega się ciężki oddech. Tytan zagradza drogę do serca strefy.',reward:{xp:1520,scrap:1030,credits:1790}},
 {level:30,name:'Matka Skażenia',epithet:'Władczyni toksycznego gniazda · trzeci boss',hp:1790,atk:[73,110],acc:37,dodge:28,armor:108,description:'Centrum biologicznej anomalii, z której wyrosły żywe kolonie grzybni. Płaszcz zarodników chroni ją przed ogniem i stalą.',story:'W podziemnej komorze pulsują zielone pęcherze. Matka Skażenia otwiera oczy i cała strefa zaczyna drżeć.',reward:{xp:2600,scrap:1600,credits:2800},boss:true}
,

 // ROZDZIAŁ IV — MARTWY SEKTOR (poziomy 31–40). Trudność robocza, balans całości później.
 {level:31,name:'Strażnik Wewnętrznej Bramy',epithet:'Ostatni posterunek Martwego Sektora',hp:1880,atk:[78,114],acc:39,dodge:29,armor:102,description:'Weteran służby w podziemnych tunelach. Nie ufa już nikomu bez wojskowego identyfikatora.',story:'Śluza otwiera się z metalicznym hukiem. Żołnierz przy wejściu podnosi broń.',reward:{xp:2740,scrap:1680,credits:3000}},
 {level:32,name:'Weteran z Implantem',epithet:'Żołnierz z oka odzyskanego z laboratorium',hp:1990,atk:[81,119],acc:43,dodge:31,armor:111,description:'W jego ciele działają przedwojenne implanty bojowe, choć część z nich została naprawiona drutem i taśmą.',story:'Błysk sztucznego oka zdradza, że żołnierz analizuje twoją pozycję.',reward:{xp:2920,scrap:1790,credits:3200}},
 {level:33,name:'Łowca z Tunelu 8',epithet:'Snajper podziemnych korytarzy',hp:2120,atk:[85,126],acc:47,dodge:38,armor:103,description:'Wyjątkowo ruchliwy strzelec. Unika zwarcia, wykorzystuje ciemność i zrujnowane przejścia.',story:'W odległym końcu tunelu zapala się laserowy celownik. Łowca już wie, gdzie stoisz.',reward:{xp:3100,scrap:1910,credits:3420}},
 {level:34,name:'Tarczownik Protokołu',epithet:'Żywy mur w stalowej osłonie',hp:2310,atk:[88,130],acc:43,dodge:26,armor:136,description:'Ciężkozbrojna jednostka powołana do obrony laboratoryjnych śluz. Ma ograniczoną mobilność, ale wyjątkowy pancerz.',story:'Stalowe płyty ocierają się o siebie. Tarczownik zagradza przejście.',reward:{xp:3340,scrap:2080,credits:3700}},
 {level:35,name:'Medyk Czarnej Stacji',epithet:'Nadzorca zamkniętego laboratorium',hp:2450,atk:[94,138],acc:48,dodge:33,armor:122,description:'Wojskowy lekarz pilnuje zapasów substancji wykorzystywanych do eksperymentów na żołnierzach.',story:'W opuszczonym ambulatorium zapala się zimne światło. Ktoś sprawdza stan fiolek.',reward:{xp:3580,scrap:2230,credits:3960}},
 {level:36,name:'Jednostka Echo-6',epithet:'Prototypowy żołnierz syntetyczny',hp:2600,atk:[98,144],acc:49,dodge:36,armor:131,description:'Półmechaniczna jednostka o precyzyjnych odruchach. Działa nawet bez łączności z centralą.',story:'Z głębi hangaru dobiega szum serwomechanizmów. Niebieski wizjer kieruje się ku tobie.',reward:{xp:3840,scrap:2390,credits:4220}},
 {level:37,name:'Widmo Siódmego Piętra',epithet:'Zwiadowca o czerwonym wizjerze',hp:2730,atk:[104,151],acc:55,dodge:47,armor:121,description:'Zwiadowca elitarnych oddziałów. Zna wszystkie kanały serwisowe i błyskawicznie zmienia pozycję.',story:'Zgaszone światła ożywają czerwienią optycznego celownika. Wróg schodzi ze schodów.',reward:{xp:4110,scrap:2570,credits:4500}},
 {level:38,name:'Kolumna Żelaznego Serca',epithet:'Ulepszony egzekutor bojowy',hp:2990,atk:[109,161],acc:52,dodge:30,armor:161,description:'Wzmocnione kończyny i pancerz mechaniczny czynią z niego prawdziwą maszynę do przełamywania obrony.',story:'Z wnęki wyłania się masywna sylwetka. Hydraulika skrzypi pod ciężarem zbroi.',reward:{xp:4470,scrap:2830,credits:4950}},
 {level:39,name:'Komendant Ostatniej Warty',epithet:'Dowódca obrony kompleksu',hp:3240,atk:[118,172],acc:62,dodge:39,armor:172,description:'Dowodził oddziałami, które zniknęły wiele lat temu. Jego rozkazy nadal rozbrzmiewają w starych głośnikach.',story:'Głośnik odtwarza sygnał alarmowy. Komendant wychodzi z sali dowodzenia.',reward:{xp:4850,scrap:3110,credits:5450}},
 {level:40,name:'Strażnik Zero',epithet:'Pierwsza i ostatnia linia obrony · czwarty boss',hp:4260,atk:[133,192],acc:69,dodge:43,armor:204,description:'Najbardziej zaawansowany obrońca Martwego Sektora. Pancerz z odzysku i przedwojenny reaktor czynią go niemal niepowstrzymanym.',story:'Za szczelnymi wrotami budzi się olbrzymia maszyna. Błękitne rdzenie pancerza rozświetlają cały bunkier.',reward:{xp:8300,scrap:5100,credits:8950},boss:true},

 // ROZDZIAŁ V — RDZEŃ OTCHŁANI (poziomy 41–50). Najgłębsze szyby i serce dawnego reaktora.
 {level:41,name:'Wartownik Szybu Delta',epithet:'Straż przy wejściu do rdzenia',hp:4410,atk:[138,201],acc:70,dodge:44,armor:211,description:'Patroluje pierwsze szyby prowadzące do Rdzenia Otchłani. Zna każdy pomost, a każdy intruz staje się dla niego celem ćwiczebnym.',story:'Za wrotami serwisowymi słychać metaliczny zgrzyt. Z półmroku wychodzi wartownik w ciężkim pancerzu szybowym.',reward:{xp:8600,scrap:5300,credits:9300}},
 {level:42,name:'Technożerca',epithet:'Padlinożerca karmiący się energią rdzenia',hp:4680,atk:[144,208],acc:72,dodge:46,armor:220,description:'Żywi się tym, co zostało z ludzi i maszyn. Kradnie części, implanty i energię z uszkodzonych modułów reaktora.',story:'Wśród zwisających kabli rozlega się ochrypły syk. Coś wychodzi z kanału technicznego, ciągnąc za sobą przewody.',reward:{xp:9000,scrap:5560,credits:9750}},
 {level:43,name:'Operator Ciśnieniowy',epithet:'Pan zaworów i awaryjnych obejść',hp:4950,atk:[149,216],acc:74,dodge:45,armor:233,description:'Utrzymuje piekielne układy pod ciśnieniem. Każdy wyciek potrafi zamienić w broń, a każdy zawór w pułapkę.',story:'Z rur bucha para, a wskazówki manometrów drżą jak szalone. Ciężki operator odwraca się w twoją stronę z ogromnym kluczem.',reward:{xp:9450,scrap:5850,credits:10250}},
 {level:44,name:'Zwiadowca Iskier',epithet:'Błyskawiczny łowca z górnych pomostów',hp:5220,atk:[153,223],acc:79,dodge:55,armor:225,description:'Lekki, szybki i śmiertelnie precyzyjny. Porusza się po pomostach szybciej niż rozbłysk zwarcia.',story:'Nad głową przeskakują iskry, a w cieniu rusztowań miga czerwony wizjer. Zwiadowca już znalazł najlepszy kąt ataku.',reward:{xp:9950,scrap:6170,credits:10900}},
 {level:45,name:'Kapłan Reaktora',epithet:'Fanatyk służący pulsującemu rdzeniowi',hp:5560,atk:[159,232],acc:78,dodge:50,armor:244,description:'Dawno porzucił rozum dla kultu energii. Wierzy, że rdzeń przemawia, a jego rozkazy wypełnia bez mrugnięcia okiem.',story:'W komorze pełnej świec i przewodów ktoś unosi laskę zwieńczoną świetlistym rdzeniem. W blasku cyjanu otwierają się martwe oczy kapłana.',reward:{xp:10550,scrap:6540,credits:11650}},
 {level:46,name:'Analityk Rdzenia',epithet:'Strażnik danych i błędów systemu',hp:5930,atk:[165,241],acc:82,dodge:53,armor:256,description:'Pół człowiek, pół zimny algorytm. Analizuje ruch, przewiduje słabości i eliminuje zagrożenia z kliniczną precyzją.',story:'Na ścianach zapalają się panele diagnostyczne. Z ich blasku wyłania się twarz rozcięta implantami i zimnym spojrzeniem.',reward:{xp:11250,scrap:6960,credits:12550}},
 {level:47,name:'Młot Otchłani',epithet:'Egzekutor najgłębszych komór',hp:6410,atk:[171,250],acc:81,dodge:46,armor:284,description:'Olbrzym wyznaczony do łamania wszystkiego, co dostało się zbyt blisko jądra kompleksu. Jego młot kończy większość walk jednym wejściem.',story:'Grube wrota rozstępują się powoli. W ich świetle staje masywna sylwetka, a metalowy młot opada na posadzkę z hukiem.',reward:{xp:12100,scrap:7440,credits:13650}},
 {level:48,name:'Nosiciel Czarnego Łuku',epithet:'Skażony anomalią wewnętrznego pierścienia',hp:6980,atk:[178,260],acc:84,dodge:57,armor:279,description:'Anomalia wypaliła w nim wszystko poza gniewem. Ciemna energia rozchodzi się po pancerzu jak pęknięcia po szkle.',story:'Powietrze drży, a nad komorą otwiera się czarny wir. Z jego wnętrza schodzi istota opleciona ciemnymi wyładowaniami.',reward:{xp:12850,scrap:7980,credits:14900}},
 {level:49,name:'Arcywartownik Rdzenia',epithet:'Ostatni dowódca przed tronem',hp:7580,atk:[186,272],acc:89,dodge:60,armor:302,description:'Najdoskonalszy strażnik, jaki przetrwał w głębi obiektu. Dowodził obroną jeszcze przed upadkiem świata i nie uznał, że wojna się skończyła.',story:'Po obu stronach korytarza rozpalają się sygnały alarmowe. Z komory dowodzenia wychodzi arcywartownik z bronią gotową do strzału.',reward:{xp:13850,scrap:8650,credits:16450}},
 {level:50,name:'Serce Otchłani',epithet:'Suweren najgłębszego reaktora · piąty boss',hp:9800,atk:[205,305],acc:95,dodge:62,armor:348,description:'To nie tylko strażnik — to władca zrośnięty z energią reaktora. Jego ciało i rdzeń kompleksu działają jak jeden organizm.',story:'W najgłębszej komorze otwiera się pierścień światła. Z wnętrza rdzenia podnosi się istota, której puls wyznacza rytm całego obiektu.',reward:{xp:22000,scrap:13500,credits:24500},boss:true},

];
let arenaSelected=1,arenaReportOpen=null,arenaChapter=0,arenaTestMode=false,arenaTestReport=null;
function arenaData(){
 if(!state.arena||typeof state.arena!=='object'||Array.isArray(state.arena))state.arena={};
 const a=state.arena;
 if(!Number.isInteger(a.highest)||a.highest<0)a.highest=0;
 a.highest=Math.min(ARENA_STAGES.length,a.highest);
 if(!a.attempts||typeof a.attempts!=='object'||Array.isArray(a.attempts))a.attempts={};
 if(!a.victories||typeof a.victories!=='object'||Array.isArray(a.victories))a.victories={};
 if(!Array.isArray(a.history))a.history=[];
 // Starsze zapisy nie przechowywały sum porażek/remisów. Migrujemy wyłącznie
 // wyniki z zachowanych raportów; nie wymyślamy wyniku dawniej usuniętych walk.
 if(!a.losses||typeof a.losses!=='object'||Array.isArray(a.losses)){
  a.losses={};for(const r of a.history)if(arenaOutcome(r)==='loss')a.losses[r.stage]=(Number(a.losses[r.stage])||0)+1;
 }
 if(!a.draws||typeof a.draws!=='object'||Array.isArray(a.draws)){
  a.draws={};for(const r of a.history)if(arenaOutcome(r)==='draw')a.draws[r.stage]=(Number(a.draws[r.stage])||0)+1;
 }
 if(a.history.length>40)a.history=a.history.slice(0,40);
 return a;
}
function arenaArt(level){return `./assets/enemies/starcia-${String(level).padStart(2,'0')}.webp?v=0.1.61`}
function arenaEnemy(stage){return {name:stage.name,hp:stage.hp,atk:stage.atk,acc:stage.acc,dodge:stage.dodge,armor:stage.armor}}
// Starcia: zwycięstwo = wróg pokonany; porażka = bohater pokonany;
// remis = po dziesięciu rundach obaj nadal żyją. Działa również dla starszych raportów.
function arenaOutcome(entry){
 if(entry?.won===true)return 'win';
 if(Number.isFinite(entry?.heroHp)&&Number.isFinite(entry?.enemyHp)&&entry.heroHp>0&&entry.enemyHp>0)return 'draw';
 return 'loss';
}
function arenaOutcomeLabel(entry){return ({win:'ZWYCIĘSTWO',draw:'REMIS',loss:'PORAŻKA'})[arenaOutcome(entry)]}
function arenaOutcomeClass(entry){return ({win:'good',draw:'arena-draw-text',loss:'bad'})[arenaOutcome(entry)]}
function arenaOutcomeSymbol(entry){return ({win:'✓',draw:'=',loss:'✕'})[arenaOutcome(entry)]}
function arenaOutcomeReason(entry){
 const outcome=arenaOutcome(entry);
 if(outcome==='draw')return 'Upłynął limit 10 rund, a obaj walczący nadal mają PŻ. Remis nie odblokowuje kolejnego etapu ani nie daje nagród — potrzebujesz skuteczniejszego uzbrojenia lub lepszych statystyk.';
 if(outcome==='win')return 'Przeciwnik stracił wszystkie PŻ. Starcie zakończyło się zwycięstwem.';
 return 'Twoja postać straciła wszystkie PŻ, zanim zdołała pokonać przeciwnika.';
}
function startArenaFight(number){
 const stage=ARENA_STAGES.find(s=>s.level===number),progress=arenaData();
 if(!stage||!state.created||(!arenaTestMode&&number>Math.min(ARENA_STAGES.length,progress.highest+1)))return;
 if(!confirm(`${arenaTestMode?'TEST · bez nagród i zapisu postępu\n\n':''}Starcie ${number}/${ARENA_STAGES.length}: ${stage.name}${stage.boss?' (BOSS)':''}\n\nWalka trwa maksymalnie 10 rund. Zwyciężysz, jeśli pokonasz przeciwnika. Jeśli po 10 rundach obie strony nadal żyją, nastąpi REMIS: bez nagród i odblokowania kolejnego etapu.\n\nRozpocząć starcie?`))return;
 const result=fight(arenaEnemy(stage),{recordRounds:true});
 // Profil taktyczny jest pochodną bazowych statystyk wroga; nie zmienia walki.
 result.battleProfile.enemy.attributes=arenaEnemyAttributes(stage);
 if(arenaTestMode){
  // Próba testowa nie zapisuje postępu, statystyk ani nagród do stanu gry.
  arenaTestReport={stage:number,name:stage.name,boss:!!stage.boss,won:result.won,firstWin:false,at:new Date().toLocaleString('pl-PL'),xp:0,scrap:0,credits:0,levels:0,rewardItem:null,testOnly:true,...result};
  arenaSelected=number;arenaChapter=Math.ceil(number/10);arenaReportOpen=-1;
  message='';render();return;
 }

 const firstWin=result.won&&!(Number(progress.victories[number])>0);
 const multiplier=result.won?(firstWin?1:.25):0;
 const xp=Math.round(stage.reward.xp*multiplier),scrap=Math.round(stage.reward.scrap*multiplier),credits=Math.round(stage.reward.credits*multiplier);
 progress.attempts[number]=(Number(progress.attempts[number])||0)+1;
 if(result.won){
  progress.victories[number]=(Number(progress.victories[number])||0)+1;
  // Rozdział odblokowuje się wyłącznie po ukończeniu poprzedniego etapu.
  if(number===progress.highest+1)progress.highest=number;
 }
 state.xp+=xp;state.scrap+=scrap;state.credits+=credits;
 state.battles++;if(result.won)state.wins++;
 if(result.won)gainCompanionXp(Math.min(20,5+Math.floor(number/4)));
 const levels=result.won?levelUp():0;
 let rewardItem=null;
 if(firstWin&&stage.boss){
   const wonItem={uid:'arena-boss-'+number+'-'+Date.now()+'-'+Math.floor(Math.random()*100000),id:number===50?'sentinel':number===40?'exosuit':number===30?'hazmat':number===20?'military':'vest',rarity:3,prefix:number===50?'armor_iron':number===40?'armor_iron':number===30?'armor_resistant':number===20?'armor_plated':'armor_reinforced',suffix:'armor_survivor',upgrade:0,locked:true};
   state.inventory.push(wonItem);
   rewardItem={uid:wonItem.uid,id:wonItem.id,name:statsOf(wonItem).name,rarity:statsOf(wonItem).rarity};
 }
 const entry={stage:number,name:stage.name,boss:!!stage.boss,won:result.won,firstWin,at:new Date().toLocaleString('pl-PL'),xp,scrap,credits,levels,rewardItem,...result};
 const outcome=arenaOutcome(entry);
 if(outcome==='loss')progress.losses[number]=(Number(progress.losses[number])||0)+1;
 if(outcome==='draw')progress.draws[number]=(Number(progress.draws[number])||0)+1;
 progress.history.unshift(entry);progress.history=progress.history.slice(0,40);
 arenaSelected=number;arenaChapter=Math.ceil(number/10);arenaReportOpen=0;
 message=''; // Wynik oglądamy od razu na osobnym ekranie raportu, bez komunikatu nad planszą.
 save();render();
}
function arenaHpLabel(value,max){
 if(!Number.isFinite(value))return '—';
 return `${Math.max(0,Math.round(value))}${Number.isFinite(max)?' / '+Math.round(max):' / ?'}`;
}
function arenaHpBar(value,max,enemy=false){
 if(!Number.isFinite(value)||!Number.isFinite(max)||max<=0)return '';
 const pct=Math.max(0,Math.min(100,value/max*100));
 return `<div class="arena-health-track" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.round(max)}" aria-valuenow="${Math.round(Math.max(0,value))}"><span class="${enemy?'is-enemy':'is-hero'}" style="width:${pct}%"></span></div>`;
}
function arenaEnemyAttributes(stage){
 // Wrogowie nie używają sześciu atrybutów bohatera w aktualnym silniku.
 // To jawnie orientacyjny profil taktyczny, wyliczony z ich prawdziwych
 // obrażeń, celności, uniku i PŻ; nie nakładamy ukrytych bonusów do walki.
 const avg=((Number(stage.atk?.[0])||0)+(Number(stage.atk?.[1])||0))/2;
 return {
  str:Math.round(avg*.65), dex:Math.round(stage.dodge*1.25),
  end:Math.round(stage.hp/20), per:Math.round(stage.acc*1.3),
  int:null,cha:null
 };
}
function arenaCombatProfiles(entry){
 const p=entry?.battleProfile;
 if(!p?.hero||!p?.enemy)return `<div class="arena-report-legacy"><strong>Parametry przed walką</strong><p>Ten starszy raport nie zawiera zapisanych statystyk z chwili starcia. Nie podstawiamy aktualnego wyposażenia postaci, które mogło się zmienić.</p></div>`;
 const hero=p.hero,foe=p.enemy;
 const tactical=foe.attributes||arenaEnemyAttributes(ARENA_STAGES.find(s=>s.level===entry.stage)||{hp:foe.hp,atk:[foe.attackMin,foe.attackMax],acc:foe.accuracy,dodge:foe.dodge});
 const a=[['Siła','str'],['Zręczność','dex'],['Wytrzymałość','end'],['Percepcja','per'],['Inteligencja','int'],['Charyzma','cha']];
 const hasHeroDamage=Array.isArray(hero.weapons)&&hero.weapons.length>0&&hero.weapons.every(w=>Number.isFinite(w.low)&&Number.isFinite(w.high));
 const heroLow=hasHeroDamage?hero.weapons.reduce((sum,w)=>sum+w.low,0):null;
 const heroHigh=hasHeroDamage?hero.weapons.reduce((sum,w)=>sum+w.high,0):null;
 const heroDmg=hasHeroDamage?`${heroLow}–${heroHigh}`:'Brak danych';
 const foeLow=Number(foe.attackMin),foeHigh=Number(foe.attackMax);
 const foeDmg=Number.isFinite(foeLow)&&Number.isFinite(foeHigh)?`${foeLow}–${foeHigh}`:'—';
 // Porównujemy liczby z historycznego zapisu, nie z aktualnego stanu postaci.
 // Dla zakresów mocy porównujemy średnie; przy brakujących wartościach nie kolorujemy.
 const rows=[
  ['PŻ na początku',hero.hp,foe.hp,'main'],
  ['Pancerz',hero.armor,foe.armor,'main'],
  ['Unik',hero.dodge,foe.dodge,'main'],
  ['Celność',hero.accuracy,foe.accuracy,'main'],
  ['Ataki w rundzie',hero.attacks,1,'main'],
  ['Obrażenia / rundę (potencjalne)',heroDmg,foeDmg,'main',hasHeroDamage?(heroLow+heroHigh)/2:null,Number.isFinite(foeLow)&&Number.isFinite(foeHigh)?(foeLow+foeHigh)/2:null],
  ...a.map(([name,key])=>[name,hero[key]??'—',tactical?.[key]??'—','attr'])
 ];
 const compare=(ours,theirs)=>{
  if(!Number.isFinite(ours)||!Number.isFinite(theirs))return ['arena-stat-neutral','arena-stat-neutral'];
  if(ours===theirs)return ['arena-stat-even','arena-stat-even'];
  return ours>theirs?['arena-stat-better','arena-stat-worse']:['arena-stat-worse','arena-stat-better'];
 };
 const portraitOrigin=['scout','fighter','tech'].includes(hero.origin)?hero.origin:null;
 const heroPortrait=portraitOrigin?`<img src="./assets/characters/${portraitOrigin}.webp" alt="Portret: ${escape(hero.name)}" loading="eager">`:`<div class="arena-portrait-unknown" aria-label="Portret postaci niedostępny w starszym raporcie">?</div>`;
 const enemyPortrait=ARENA_STAGES.some(x=>x.level===entry.stage)?`<img src="${arenaArt(entry.stage)}" alt="Portret: ${escape(foe.name)}" loading="eager">`:`<div class="arena-portrait-unknown">?</div>`;
 return `<section class="arena-combat-profile"><div class="arena-battle-section-title"><span>01 / PORÓWNANIE</span><h4>Statystyki przed walką</h4></div>
 <div class="arena-fighter-portraits"><div class="arena-fighter-portrait is-hero">${heroPortrait}<strong>${escape(hero.name)}</strong><small>Twoja postać · Poziom ${hero.level}</small></div><span class="arena-fighter-versus">VS</span><div class="arena-fighter-portrait is-enemy">${enemyPortrait}<strong>${escape(foe.name)}</strong><small>${entry.boss?'Boss':'Przeciwnik'} · Etap ${entry.stage}</small></div></div>
 <div class="arena-combat-table-wrap"><table class="arena-combat-table arena-comparison-expanded"><thead><tr><th scope="col">Parametr</th><th scope="col">${escape(hero.name)}</th><th scope="col">${escape(foe.name)}</th></tr></thead><tbody>${rows.map(([label,h,f,group,overrideH,overrideF],i)=>{const hNumber=overrideH!==undefined?overrideH:(typeof h==='number'?h:null),fNumber=overrideF!==undefined?overrideF:(typeof f==='number'?f:null);const [hc,fc]=compare(hNumber,fNumber);return `<tr class="${group==='attr'?'arena-attribute-row':''} ${i===6?'arena-attribute-start':''}"><th scope="row">${escape(label)}</th><td class="${hc}">${escape(String(h))}</td><td class="${fc}">${escape(String(f))}</td></tr>`}).join('')}</tbody></table></div>
 <p class="arena-profile-explainer">Kolory porównują wyższe wartości: <strong class="arena-stat-better">zielony — wyższa</strong>, <strong class="arena-stat-worse">czerwony — niższa</strong>, <strong class="arena-stat-even">pomarańczowy — równa</strong>. Obrażenia to suma potencjalnych zakresów ataków przed trafieniem, krytykiem i pancerzem. Atrybuty przeciwnika (Siła, Zręczność, Wytrzymałość, Percepcja) pozostają <strong>orientacyjnym profilem taktycznym</strong>, nie są dodatkowymi mnożnikami walki.</p>
 <div class="arena-profile-weapons"><strong>Uzbrojenie bohatera w chwili starcia:</strong> ${(hero.weapons||[]).map(w=>`${escape(w.name)} (${w.hand==='right'?'prawa':'lewa'} ręka, ${w.power}%${Number.isFinite(w.low)&&Number.isFinite(w.high)?`, ${w.low}–${w.high} obr.`:''})`).join(' · ')||'Brak danych o uzbrojeniu.'}<div><strong>Przeciwnik:</strong> jeden atak ${foeDmg} obrażeń bazowych na rundę.</div></div></section>`;
}

function arenaRoundReview(entry){
 if(!Array.isArray(entry?.roundHistory)||!entry.roundHistory.length)return `<div class="arena-report-legacy"><strong>Przebieg rund</strong><p>Ten zapis pochodzi ze starszej wersji, dlatego nie zawiera PŻ po każdej rundzie. Przebieg starszych walk nie zawiera zapisu poszczególnych rund.</p></div>`;
 return `<section class="arena-round-review"><div class="arena-battle-section-title"><span>02 / RUNDY</span><h4>Przebieg starcia</h4></div><div class="arena-rounds-list">${entry.roundHistory.map((r,i)=>`<details class="arena-round-card"><summary><span class="arena-round-number">RUNDA ${r.number}</span><span class="arena-round-damage">Zadane ${r.heroDamage} · Otrzymane ${r.enemyDamage}</span><span class="arena-round-expand">Szczegóły</span></summary><div class="arena-round-card-body"><div class="arena-round-hp-grid"><div><span>Twoje PŻ</span><strong>${arenaHpLabel(r.heroHp,entry.heroMaxHp)}</strong>${arenaHpBar(r.heroHp,entry.heroMaxHp)}</div><div><span>PŻ przeciwnika</span><strong>${arenaHpLabel(r.enemyHp,entry.enemyMaxHp)}</strong>${arenaHpBar(r.enemyHp,entry.enemyMaxHp,true)}</div></div><div class="arena-round-events">${(r.events||[]).map(line=>`<p class="${line.includes('Zadajesz')||line.includes('Przeciwnik chybia')?'is-hero':'is-enemy'}">${escape(line)}</p>`).join('')||'<p>W tej rundzie nie zarejestrowano zdarzeń.</p>'}</div></div></details>`).join('')}</div></section>`;
}
function arenaBattleReport(entry,index=0){
 const stats=damageReportStats(entry);
 const maxHero=entry.heroMaxHp??entry.battleProfile?.hero?.hp;
 const maxEnemy=entry.enemyMaxHp??entry.battleProfile?.enemy?.hp??ARENA_STAGES.find(s=>s.level===entry.stage)?.hp;
 return `<div class="arena-report"><div class="arena-report-header"><div><span class="tag">RAPORT · STARCIE ${entry.stage}</span><h3 class="${arenaOutcomeClass(entry)}">${arenaOutcomeLabel(entry)} — ${escape(entry.name)}</h3><p class="small muted">${escape(entry.at)} · ${entry.boss?'BOSS':'Przeciwnik'} · ${stats.rounds} ${stats.rounds===1?'runda':'rund'}</p></div></div>
 ${arenaCombatProfiles(entry)}
 ${arenaRoundReview(entry)}
 <section class="arena-battle-finale"><div class="arena-battle-section-title"><span>03 / WYNIK</span><h4>Podsumowanie starcia</h4></div><div class="arena-outcome-reason ${arenaOutcome(entry)==='draw'?'is-draw':''}"><strong>${arenaOutcomeLabel(entry)} · Powód zakończenia</strong><p>${arenaOutcomeReason(entry)}</p><div class="arena-final-hp"><div><span>${escape(entry.battleProfile?.hero?.name||'Postać')} · PŻ po walce</span><strong>${arenaHpLabel(entry.heroHp,maxHero)}</strong>${arenaHpBar(entry.heroHp,maxHero)}</div><div><span>${escape(entry.name)} · PŻ po walce</span><strong>${arenaHpLabel(entry.enemyHp,maxEnemy)}</strong>${arenaHpBar(entry.enemyHp,maxEnemy,true)}</div></div></div></section>
 ${damageReportPanel(entry)}
 <div class="arena-report-reward"><strong>${entry.testOnly?'Próba testowa — bez nagród:':'Nagrody:'}</strong> +${entry.xp} PD · +${entry.scrap} złomu · +${entry.credits} kredytów${entry.levels?' · Awans: '+entry.levels:''}${entry.rewardItem?`<div class="arena-special-loot">★ Łup bossa: <strong>${escape(entry.rewardItem.name)}</strong> (epicki, zabezpieczony) <button data-page="inventory">Otwórz ekwipunek</button></div>`:''}</div>
 </div>`;
}
// ASHEN v0.4.5.1 — Laboratorium: symulacje tego samego lokalnego silnika PvE.
// Nigdy nie zmienia `state`, nie wywołuje save() i nie rejestruje nagród.
let combatLabCount=100,combatLabEnemy='scavenger',combatLabRounds=10,combatLabResults=null;
const COMBAT_LAB_FOES={
 scavenger:{label:'Włóczęga (etap 1)',stage:1},
 boss:{label:'Boss początkowy (etap 10)',stage:10},
 veteran:{label:'Boss zaawansowany (etap 20)',stage:20}
};
function combatLabSnapshot(){
 const a={...attrs()},d={...heroDefense()},attacks=heroAttacks().map(w=>({...w,weapon:{...w.weapon}}));
 const knife=statsOf({id:'knife',rarity:0});
 return {attributes:a,defense:d,current:attacks,reference:[{weapon:{...knife},hand:state.dominantHand,power:1}]};
}
function combatLabRandom(seed){
 let x=(seed>>>0)||1;
 return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
}
function combatLabRun(){
 if(!state.created)return;
 const preset=COMBAT_LAB_FOES[combatLabEnemy]||COMBAT_LAB_FOES.scavenger;
 const stage=ARENA_STAGES.find(s=>s.level===preset.stage);
 if(!stage)return;
 const snapshots=combatLabSnapshot(),n=combatLabCount,maxRounds=combatLabRounds;
 const enemy=arenaEnemy(stage);
 const init=()=>({wins:0,draws:0,losses:0,rounds:0,attacks:0,hits:0,damage:0,taken:0,heroHpLeft:0,enemyHpLeft:0,roundLimitDraws:0});
 const current=init(),reference=init();
 const accumulate=(target,result)=>{
   if(result.won)target.wins++;
   else if(result.heroHp>0&&result.enemyHp>0)target.draws++;
   else target.losses++;
   const d=result.damageSummary;
   target.rounds+=d.rounds;target.attacks+=d.hero.attempts;target.hits+=d.hero.hits;
   target.damage+=d.hero.damage;target.taken+=d.foe.damage;
   target.heroHpLeft+=result.heroHp;target.enemyHpLeft+=result.enemyHp;
   if(result.heroHp>0&&result.enemyHp>0&&d.rounds>=maxRounds)target.roundLimitDraws++;
 };
 // Te same ziarna RNG dla pary prób, bez zmiany globalnego Math.random.
 for(let i=0;i<n;i++){
   const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
   accumulate(current,fight(enemy,{testSnapshot:{attributes:snapshots.attributes,defense:snapshots.defense,attacks:snapshots.current},testRandom:combatLabRandom(seed),testMaxRounds:maxRounds}));
   accumulate(reference,fight(enemy,{testSnapshot:{attributes:snapshots.attributes,defense:snapshots.defense,attacks:snapshots.reference},testRandom:combatLabRandom(seed),testMaxRounds:maxRounds}));
 }
 combatLabResults={n,maxRounds,enemyHp:enemy.hp,heroHp:snapshots.defense.hp,enemy:preset.label,at:new Date().toLocaleTimeString('pl-PL'),current,reference,
 currentWeapons:snapshots.current.map(a=>a.weapon.name).join(' + '),referenceWeapon:snapshots.reference[0].weapon.name};
 render();
}
function combatLabHtml(){
 const lab=combatLabResults;
 const fmt=(value,digits=1)=>Number(value).toFixed(digits).replace('.',',');
 const summary=(m,n)=>({wins:`${fmt(100*m.wins/n)}%`,
 accuracy:m.attacks?`${fmt(100*m.hits/m.attacks)}%`:'—',
 avgDamage:fmt(m.damage/n),avgTaken:fmt(m.taken/n),
 avgDamageRound:fmt(m.damage/m.rounds),avgTakenRound:fmt(m.taken/m.rounds),
 heroHpLeft:fmt(m.heroHpLeft/n),enemyHpLeft:fmt(m.enemyHpLeft/n),
 rounds:fmt(m.rounds/n,2),draws:m.draws,losses:m.losses,roundLimitDraws:m.roundLimitDraws});
 const a=lab?summary(lab.current,lab.n):null,b=lab?summary(lab.reference,lab.n):null;
 const rows=lab?[
 ['Wygrane',a.wins,b.wins],['Remisy',a.draws,b.draws],['Porażki',a.losses,b.losses],
 ['Remisy przez limit rund',a.roundLimitDraws,b.roundLimitDraws],
 ['Celność (trafienia / próby)',a.accuracy,b.accuracy],
 ['Średnie zadane obrażenia na walkę',a.avgDamage,b.avgDamage],
 ['Średnie otrzymane obrażenia na walkę',a.avgTaken,b.avgTaken],
 ['Średnie zadane obrażenia na rundę',a.avgDamageRound,b.avgDamageRound],
 ['Średnie otrzymane obrażenia na rundę',a.avgTakenRound,b.avgTakenRound],
 ['Średnie pozostałe PŻ postaci',a.heroHpLeft,b.heroHpLeft],
 ['Średnie pozostałe PŻ przeciwnika',a.enemyHpLeft,b.enemyHpLeft],
 ['Średnia liczba rund',a.rounds,b.rounds]
 ]:[];
 return `<details class="combat-lab" ${lab?'open':''}><summary>🧪 Laboratorium walk · test statystyczny bez nagród</summary>
 <div class="combat-lab-content"><p class="muted">Testuje prawdziwy silnik <strong>Starć PvE</strong> na stałym przeciwniku. Porównuje obecne wyposażenie bojowe ze zwykłym nożem przy takich samych atrybutach i pancerzu. Limit rund zmienia się <strong>tylko w Laboratorium</strong>, nie w prawdziwych Starciach ani Ekspedycjach.</p>
 <div class="combat-lab-config"><label>Przeciwnik testowy<select id="combat-lab-enemy">${Object.entries(COMBAT_LAB_FOES).map(([id,v])=>`<option value="${id}" ${combatLabEnemy===id?'selected':''}>${escape(v.label)}</option>`).join('')}</select></label>
 <label>Liczba symulacji<select id="combat-lab-count">${[10,100,1000].map(n=>`<option value="${n}" ${combatLabCount===n?'selected':''}>${n} walk</option>`).join('')}</select></label>
 <label>Maksymalna liczba rund<select id="combat-lab-rounds">${[10,15,20].map(n=>`<option value="${n}" ${combatLabRounds===n?'selected':''}>${n} rund</option>`).join('')}</select></label>
 <button class="primary" data-combat-lab-run="1">▶ Uruchom porównanie</button></div>
 ${lab?`<div class="combat-lab-outcome"><strong>Wyniki · ${lab.n} prób na zestaw · ${escape(lab.enemy)} · limit ${lab.maxRounds} rund</strong><small>Godzina testu: ${escape(lab.at)}</small></div>
 <div class="combat-lab-vitals"><span><strong>Startowe PŻ postaci:</strong> ${lab.heroHp}</span><span><strong>Startowe PŻ przeciwnika:</strong> ${lab.enemyHp}</span></div>
 <div class="combat-lab-table-wrap"><table><thead><tr><th>Parametr</th><th>Twoje wyposażenie</th><th>Zwykły nóż</th></tr></thead><tbody>
 ${rows.map(([label,x,y])=>`<tr><th>${escape(String(label))}</th><td>${escape(String(x))}</td><td>${escape(String(y))}</td></tr>`).join('')}
 </tbody></table></div><p class="small muted"><strong>Aktualna broń:</strong> ${escape(lab.currentWeapons)} · <strong>Wariant testowy:</strong> ${escape(lab.referenceWeapon)}.</p>
 <p class="small muted">Wartości pozostałych PŻ to średnie ze wszystkich symulacji. „Remis przez limit rund” oznacza, że obie strony przeżyły do końca wybranego limitu. Obrażenia na rundę to suma obrażeń podzielona przez łączną liczbę rozegranych rund.</p>`:'<p class="small muted">Wybierz przeciwnika, liczbę prób i limit rund, a następnie uruchom symulację.</p>'}
 <p class="small muted">Prawdziwe Starcia nadal trwają maksymalnie 10 rund. Laboratorium nie przyznaje XP, surowców, przedmiotów ani postępu; nie zużywa energii. Wyniki są tylko w pamięci strony. Ekspedycje frakcyjne korzystają z osobnego silnika serwerowego.</p></div></details>`;
}

// ASHEN v0.4.6.1 — eksperymentalne uzbrojenie, wyłącznie w Laboratorium.
// Używa produkcyjnego fight() na kopiach danych. Żadne rezultaty nie trafiają do save().
const WEAPON_LAB_MODELS=[{"id":"baton","name":"Pałka ochroniarza","category":"Biała 1R","oldMin":5,"oldMax":8,"newMin":5,"newMax":8,"attacks":1,"accuracy":2,"crit":0,"pen":0,"role":"Startowa; niewielka celność"},{"id":"pipe","name":"Żelazna rura","category":"Biała 1R","oldMin":6,"oldMax":10,"newMin":6,"newMax":10,"attacks":1,"accuracy":-2,"crit":0,"pen":1,"role":"Pancerz / przebicie"},{"id":"wrench","name":"Klucz francuski","category":"Biała 1R","oldMin":7,"oldMax":12,"newMin":7,"newMax":12,"attacks":1,"accuracy":2,"crit":0,"pen":0,"role":"Trafienie"},{"id":"knife","name":"Zardzewiały nóż","category":"Biała 1R","oldMin":8,"oldMax":13,"newMin":6,"newMax":10,"attacks":2,"accuracy":4,"crit":3,"pen":0,"role":"Dwa słabe ciosy"},{"id":"cleaver","name":"Tasak z pustkowi","category":"Biała 1R","oldMin":10,"oldMax":16,"newMin":10,"newMax":16,"attacks":1,"accuracy":-3,"crit":5,"pen":0,"role":"Krytyk / ciężki cios"},{"id":"hatchet","name":"Toporek z odzysku","category":"Biała 1R","oldMin":12,"oldMax":18,"newMin":12,"newMax":18,"attacks":1,"accuracy":-2,"crit":2,"pen":2,"role":"Obrażenia / penetracja"},{"id":"saber","name":"Szabla konwojenta","category":"Biała 1R","oldMin":14,"oldMax":21,"newMin":10,"newMax":15,"attacks":2,"accuracy":1,"crit":2,"pen":0,"role":"Dwa cięcia"},{"id":"machete","name":"Maczeta zbieracza","category":"Biała 1R","oldMin":16,"oldMax":24,"newMin":12,"newMax":18,"attacks":2,"accuracy":-1,"crit":1,"pen":0,"role":"Dwa cięcia; wymaga testów"},{"id":"pistol","name":"Pistolet M-9","category":"Palna 1R","oldMin":12,"oldMax":18,"newMin":12,"newMax":18,"attacks":1,"accuracy":5,"crit":0,"pen":0,"role":"Celność"},{"id":"deserteagle","name":"Pistolet pustynny","category":"Palna 1R","oldMin":16,"oldMax":24,"newMin":18,"newMax":27,"attacks":1,"accuracy":-3,"crit":2,"pen":1,"role":"Jeden mocny strzał"},{"id":"revolver","name":"Rewolwer Strażnika","category":"Palna 1R","oldMin":19,"oldMax":28,"newMin":19,"newMax":28,"attacks":1,"accuracy":0,"crit":5,"pen":1,"role":"Krytyk"},{"id":"smg","name":"Pistolet maszynowy Viper","category":"Palna 1R","oldMin":22,"oldMax":32,"newMin":8,"newMax":13,"attacks":3,"accuracy":-7,"crit":-2,"pen":0,"role":"Szybka seria; gorsza celność"},{"id":"rifle","name":"Karabin szabrownika","category":"Palna 2R","oldMin":18,"oldMax":27,"newMin":18,"newMax":27,"attacks":1,"accuracy":2,"crit":0,"pen":1,"role":"Równowaga"},{"id":"carbine","name":"Karabinek warty","category":"Palna 2R","oldMin":21,"oldMax":31,"newMin":13,"newMax":20,"attacks":2,"accuracy":2,"crit":0,"pen":1,"role":"Dwa strzały"},{"id":"shotgun","name":"Strzelba pustkowi","category":"Palna 2R","oldMin":25,"oldMax":38,"newMin":28,"newMax":42,"attacks":1,"accuracy":-7,"crit":1,"pen":1,"role":"Silny strzał, kara do celności"},{"id":"sniper","name":"Karabin dalekiego zasięgu","category":"Palna 2R","oldMin":29,"oldMax":44,"newMin":36,"newMax":54,"attacks":1,"accuracy":5,"crit":5,"pen":4,"role":"Jeden precyzyjny strzał"},{"id":"lmg","name":"Karabin maszynowy PK","category":"Palna 2R","oldMin":34,"oldMax":51,"newMin":13,"newMax":20,"attacks":3,"accuracy":-10,"crit":-2,"pen":1,"role":"Seria, niska celność"},{"id":"crossbow","name":"Kusza tropiciela","category":"Dystansowa 2R","oldMin":18,"oldMax":28,"newMin":18,"newMax":28,"attacks":1,"accuracy":1,"crit":4,"pen":3,"role":"Przebicie"},{"id":"harpoon","name":"Wyrzutnia harpunów","category":"Dystansowa 2R","oldMin":23,"oldMax":36,"newMin":23,"newMax":36,"attacks":1,"accuracy":-3,"crit":3,"pen":4,"role":"Mocna pojedyncza salwa"},{"id":"flame","name":"Miotacz żaru","category":"Technologiczna 2R","oldMin":29,"oldMax":45,"newMin":12,"newMax":19,"attacks":3,"accuracy":-6,"crit":-3,"pen":2,"role":"3 impulsy, redukcja pancerza do testu"},{"id":"crowbar","name":"Łom zbrojony","category":"Biała 2R","oldMin":15,"oldMax":23,"newMin":15,"newMax":23,"attacks":1,"accuracy":-2,"crit":0,"pen":3,"role":"Przebicie"},{"id":"hammer","name":"Młot złomiarza","category":"Biała 2R","oldMin":21,"oldMax":33,"newMin":21,"newMax":33,"attacks":1,"accuracy":-4,"crit":2,"pen":2,"role":"Silny krytyk"},{"id":"rail","name":"Prototypowa broń szynowa","category":"Technologiczna 2R","oldMin":27,"oldMax":42,"newMin":31,"newMax":47,"attacks":1,"accuracy":3,"crit":3,"pen":6,"role":"Celność / przebicie"},{"id":"sledge","name":"Młot wyburzeniowy","category":"Biała 2R","oldMin":32,"oldMax":50,"newMin":32,"newMax":50,"attacks":1,"accuracy":-6,"crit":4,"pen":3,"role":"Największy pojedynczy cios"}];
const WEAPON_LAB_RARITIES=[1,1.14,1.32,1.58,1.95];
const WEAPON_LAB_CRITS={'Biała 1R':2,'Biała 2R':2.8,'Palna 1R':1.6,'Palna 2R':1.8,'Dystansowa 2R':2.3,'Technologiczna 2R':1.8};
let weaponLabConfig={id:'lmg',count:100,enemy:'veteran',armor:60,profile:'average',rarity:0,upgrade:0,workshop:'A',prefix:'none',suffix:'none',dual:false},weaponLabResults=null,weaponLabOpen=false;
// Osobna pamięć Laboratorium: nie dotyka stanu postaci i nie wywołuje zapisu online.
const WEAPON_LAB_FIELDS={id:'wlab-id',enemy:'wlab-enemy',armor:'wlab-armor',profile:'wlab-profile',count:'wlab-count',rarity:'wlab-rarity',upgrade:'wlab-upgrade',workshop:'wlab-workshop',prefix:'wlab-prefix',suffix:'wlab-suffix'};
const WEAPON_LAB_NUMERIC=new Set(['armor','count','rarity','upgrade']);
function weaponLabKey(){return 'ashen-weapon-lab-v0462-'+devActiveId()}
function weaponLabSave(){try{localStorage.setItem(weaponLabKey(),JSON.stringify({config:weaponLabConfig,results:weaponLabResults,open:weaponLabOpen}))}catch{}}
function weaponLabRestore(){
 try{
  const data=JSON.parse(localStorage.getItem(weaponLabKey())||'null');
  if(!data||typeof data!=='object')return;
  const cfg=data.config||{};
  if(WEAPON_LAB_MODELS.some(m=>m.id===cfg.id))weaponLabConfig.id=cfg.id;
  if(Object.hasOwn(COMBAT_LAB_FOES,cfg.enemy))weaponLabConfig.enemy=cfg.enemy;
  if([0,20,40,60].includes(cfg.armor))weaponLabConfig.armor=cfg.armor;
  if(['starter','average','veteran','actual'].includes(cfg.profile))weaponLabConfig.profile=cfg.profile;
  if([10,100,1000].includes(cfg.count))weaponLabConfig.count=cfg.count;
  if([0,1,2,3,4].includes(cfg.rarity))weaponLabConfig.rarity=cfg.rarity;
  if([0,5].includes(cfg.upgrade))weaponLabConfig.upgrade=cfg.upgrade;
  if(['A','B','C'].includes(cfg.workshop))weaponLabConfig.workshop=cfg.workshop;
  if(['none','precise','brutal','destructive','killer','quick','stable'].includes(cfg.prefix))weaponLabConfig.prefix=cfg.prefix;
  if(['none','hunter','sniper','berserk','executioner'].includes(cfg.suffix))weaponLabConfig.suffix=cfg.suffix;
  weaponLabConfig.dual=cfg.dual===true;
  if(data.results?.config&&WEAPON_LAB_MODELS.some(m=>m.id===data.results.model?.id))weaponLabResults=data.results;
  weaponLabOpen=data.open===true||!!weaponLabResults;
 }catch{}
}
function weaponLabReadControls(){
 for(const [key,id] of Object.entries(WEAPON_LAB_FIELDS)){
  const control=$(id);if(control)weaponLabConfig[key]=WEAPON_LAB_NUMERIC.has(key)?Number(control.value):control.value;
 }
 weaponLabConfig.dual=!!$('wlab-dual')?.checked;
 weaponLabSave();
}
function weaponLabPreset(letter){
 const p={A:['lmg',20],B:['sniper',20],C:['lmg',60],D:['sniper',60]}[letter];
 if(!p)return;
 weaponLabConfig={id:p[0],enemy:'veteran',armor:p[1],profile:'average',count:1000,rarity:0,upgrade:0,workshop:'A',prefix:'none',suffix:'executioner',dual:false};
 weaponLabOpen=true;weaponLabResults=null;weaponLabSave();render();
}
weaponLabRestore();
function weaponLabBuild(model,experimental,a){
 const c=weaponLabConfig;
 const old=!experimental;
 const min=old?model.oldMin:model.newMin,max=old?model.oldMax:model.newMax;
 const quality=WEAPON_LAB_RARITIES[c.rarity];
 const p=old?'none':c.prefix, su=old?'none':c.suffix;
 const buffDamage=p==='destructive'?0.08:0;
 const sufDamage=su==='berserk'?0.06:0;
 const damageFactor=1+buffDamage+sufDamage;
 const bonusFlat=c.upgrade?c.workshop==='A'?20:c.workshop==='B'?10:0:0;
 const workshopFactor=c.upgrade?c.workshop==='B'?1.08:c.workshop==='C'?1.14:1:1;
 const scaled=(v)=>Math.max(1,Math.round((v*quality*damageFactor)*workshopFactor+bonusFlat));
 const w={id:model.id,name:model.name,min:scaled(min),max:scaled(max),slot:model.category.includes('1R')?'hand1':'hand2',
 accuracy:experimental?model.accuracy+(p==='precise'?6:p==='stable'?5:0)+(su==='sniper'?5:su==='berserk'?-4:0):0,
 critPp:experimental?model.crit+(p==='killer'?4:p==='stable'?2:0)+(su==='executioner'?3:0):0,
 labPen:experimental?model.pen:0,labCritMultiplier:experimental?WEAPON_LAB_CRITS[model.category]:1.6};
 return {weapon:w,hand:'right',power:1};
}
function weaponLabRun(){
 if(!state.created)return;
 const c=weaponLabConfig,model=WEAPON_LAB_MODELS.find(x=>x.id===c.id);
 if(!model)return;
 const fo=COMBAT_LAB_FOES[c.enemy]||COMBAT_LAB_FOES.veteran;
 const enemy={...arenaEnemy(ARENA_STAGES.find(x=>x.level===fo.stage)),armor:c.armor};
 const base=attrs(),a=c.profile==='actual'?{...base}:c.profile==='starter'?{str:8,dex:8,end:8,per:8,int:8,cha:8}:c.profile==='veteran'?{str:30,dex:30,end:30,per:30,int:30,cha:30}:{str:17,dex:17,end:17,per:17,int:17,cha:17};
 // Both configurations use identical defense; in preset mode there are no equipment/room bonuses.
 const def=c.profile==='actual'?{...heroDefense()}:{hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
 if(c.prefix==='brutal'&&model.category.startsWith('Biała'))a.str+=3;
 if(c.suffix==='hunter'&&(model.category.includes('Palna')||model.category.includes('Dystansowa')))a.per+=3;
 const old=weaponLabBuild(model,false,a),neu=weaponLabBuild(model,true,a);
 const builds=[ [old],Array.from({length:model.attacks},()=>({...neu,weapon:{...neu.weapon}})) ];
 const isOneHand=model.category.endsWith('1R');
 if(c.dual&&isOneHand){builds[0].push({...old,hand:'left',power:.8});
   for(let k=0;k<model.attacks;k++)builds[1].push({...neu,weapon:{...neu.weapon},hand:'left',power:.8});}
 if(c.prefix==='quick'&&model.attacks<3&&['Biała 1R','Palna 1R','Palna 2R','Dystansowa 2R'].includes(model.category)){
   builds[1].push({...neu,weapon:{...neu.weapon},power:.45});
 }
 // For fixed-seed comparisons, random source is reset separately for both builds.
 const summary=()=>({wins:0,draws:0,losses:0,rounds:0,attempts:0,hits:0,crits:0,damage:0,taken:0,hpLeft:0,foeLeft:0});
 const totals=[summary(),summary()];
 for(let i=0;i<c.count;i++){
   const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
   builds.forEach((attacks,j)=>{
     const result=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:j===1});
     const t=totals[j],d=result.damageSummary;
     if(result.won)t.wins++;else if(result.heroHp>0&&result.enemyHp>0)t.draws++;else t.losses++;
     t.rounds+=d.rounds;t.attempts+=d.hero.attempts;t.hits+=d.hero.hits;t.crits+=d.hero.crits;t.damage+=d.hero.damage;t.taken+=d.foe.damage;t.hpLeft+=result.heroHp;t.foeLeft+=result.enemyHp;
   });
 }
 weaponLabResults={model,old:totals[0],new:totals[1],config:{...c},enemy:{name:enemy.name,hp:enemy.hp,armor:enemy.armor},attacks:[builds[0].length,builds[1].length]};
 weaponLabOpen=true;weaponLabSave();render();
}

// ASHEN 0.4.6.3: porównanie klas w identycznych warunkach, bez zmiany ekwipunku.
// Dla uczciwego porównania zróżnicowanych modeli pokazujemy wyniki per model, NIE wyciągamy
// wniosku, że bazowy nóż ma dorównywać zaawansowanej broni technologicznej.
const WEAPON_BALANCE_ARMORS=[0,20,40,60];
let weaponBalanceReport=null,weaponBalanceRunning=false;
function weaponBalanceKey(){return 'ashen-weapon-balance-v0463-'+devActiveId()}
function weaponBalanceRestore(){
 try{const data=JSON.parse(localStorage.getItem(weaponBalanceKey())||'null');
  if(data?.version===1&&Array.isArray(data.results)&&data.results.length===WEAPON_LAB_MODELS.length)weaponBalanceReport=data;
 }catch{}
}
function weaponBalanceSave(){try{localStorage.setItem(weaponBalanceKey(),JSON.stringify(weaponBalanceReport))}catch{}}
weaponBalanceRestore();
function weaponBalanceRun(){
 if(!state.created||weaponBalanceRunning)return;
 weaponLabReadControls();
 const c={...weaponLabConfig};
 const fo=COMBAT_LAB_FOES[c.enemy]||COMBAT_LAB_FOES.veteran;
 const baseEnemy=arenaEnemy(ARENA_STAGES.find(x=>x.level===fo.stage));
 const baseAttrs=attrs();
 const fixedAttrs=c.profile==='actual'?{...baseAttrs}:c.profile==='starter'?{str:8,dex:8,end:8,per:8,int:8,cha:8}:c.profile==='veteran'?{str:30,dex:30,end:30,per:30,int:30,cha:30}:{str:17,dex:17,end:17,per:17,int:17,cha:17};
 // 100 prób × 24 modele × 4 poziomy ochrony = 9600 walk, bez zapisu online.
 const n=100,results=[];
 weaponBalanceRunning=true;
 try{
  for(const model of WEAPON_LAB_MODELS){
   const series=[];
   for(const armor of WEAPON_BALANCE_ARMORS){
    const enemy={...baseEnemy,armor};
    const a={...fixedAttrs};
    if(c.prefix==='brutal'&&model.category.startsWith('Biała'))a.str+=3;
    if(c.suffix==='hunter'&&(model.category.includes('Palna')||model.category.includes('Dystansowa')))a.per+=3;
    const def=c.profile==='actual'?{...heroDefense()}:{hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
    // Build uses config from weaponLabConfig (currently read and frozen for duration of run).
    const current=weaponLabBuild(model,true,a);
    const attacks=Array.from({length:model.attacks},()=>({...current,weapon:{...current.weapon}}));
    if(c.dual&&model.category.endsWith('1R')){
     for(let k=0;k<model.attacks;k++)attacks.push({...current,weapon:{...current.weapon},hand:'left',power:.8});
    }
    if(c.prefix==='quick'&&model.attacks<3&&['Biała 1R','Palna 1R','Palna 2R','Dystansowa 2R'].includes(model.category))attacks.push({...current,weapon:{...current.weapon},power:.45});
    let wins=0,damage=0,rounds=0,attempts=0,hits=0,critical=0;
    for(let i=0;i<n;i++){
     // Ten sam seed dla danego numeru próby we wszystkich konfiguracjach.
     const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
     const r=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:true});
     if(r.won)wins++;
     damage+=r.damageSummary.hero.damage;
     rounds+=r.damageSummary.rounds;
     attempts+=r.damageSummary.hero.attempts;
     hits+=r.damageSummary.hero.hits;
     critical+=r.damageSummary.hero.crits;
    }
    series.push({armor,dpr:rounds?damage/rounds:0,wins:wins/n*100,accuracy:attempts?hits/attempts*100:0,crit:hits?critical/hits*100:0});
   }
   results.push({id:model.id,name:model.name,category:model.category,attacks:model.attacks,series});
  }
  weaponBalanceReport={version:1,at:new Date().toLocaleString('pl-PL'),settings:{enemy:fo.label,profile:c.profile,rarity:c.rarity,upgrade:c.upgrade,workshop:c.workshop,prefix:c.prefix,suffix:c.suffix,dual:c.dual},n,results};
  weaponBalanceSave();weaponLabOpen=true;
 }catch(err){message='Błąd testu równowagi: '+(err?.message||String(err));}
 finally{weaponBalanceRunning=false;render()}
}
function weaponBalanceHtml(){
 const r=weaponBalanceReport;
 const fmt=v=>Number(v||0).toFixed(1).replace('.',',');
 const labels=WEAPON_BALANCE_ARMORS;
 const cells=r?`<div class="combat-lab-table-wrap"><table class="weapon-balance-table"><thead><tr><th>Broń / klasa</th><th>Ataki</th>${labels.map(n=>`<th>Pancerz ${n}<small>obr./rundę</small></th>`).join('')}<th>Zmiana 0→60</th></tr></thead><tbody>${r.results.map(m=>{const lo=m.series[0].dpr,hi=m.series[3].dpr;const fall=lo>0?(1-hi/lo)*100:0;return `<tr><th>${escape(m.name)}<small>${escape(m.category)}</small></th><td>${m.attacks}</td>${m.series.map(v=>`<td>${fmt(v.dpr)}</td>`).join('')}<td>${fmt(fall)}%</td></tr>`}).join('')}</tbody></table></div>`:'';
 const groups=r?[...new Set(r.results.map(x=>x.category))].map(category=>{
  const values=r.results.filter(x=>x.category===category).map(x=>x.series[1].dpr);
  const sum=values.reduce((a,b)=>a+b,0);
  return {category,average:values.length?sum/values.length:0,models:values.length};
 }):[];
 return `<section class="weapon-balance-panel"><h4>⚖ Równowaga klas broni · test zbiorczy</h4><p class="small muted">Cel: każda klasa ma umożliwiać przejście gry przy rozsądnym rozwoju postaci. Zmiana broni pod konkretnego bossa <strong>nie powinna być konieczna</strong>. Różnice w celności, liczbie ataków i krytykach tworzą styl, a nie obowiązkowy zestaw.</p>
 <button type="button" class="primary" data-wlab-balance="1" ${weaponBalanceRunning?'disabled':''}>▶ Przetestuj 24 bronie × 4 poziomy pancerza</button><p class="small muted">96 konfiguracji · po 100 symulacji · jeden przeciwnik i te same atrybuty, jakość, prefiks, sufiks oraz Warsztat co w formularzu powyżej. Wyniki zapisane lokalnie. Test nie przyznaje nagród.</p>
 ${r?`<div class="combat-lab-outcome"><strong>Ostatni test: ${escape(r.at)}</strong><small>${escape(r.settings.enemy)} · 100 prób / konfigurację</small></div>
 <div class="weapon-balance-summary"><strong>Średnia na klasę (pancerz 20) — wyłącznie wskaźnik orientacyjny</strong><div class="combat-lab-table-wrap"><table><thead><tr><th>Klasa</th><th>Modele</th><th>Śr. obrażenia / rundę</th></tr></thead><tbody>${groups.map(g=>`<tr><th>${escape(g.category)}</th><td>${g.models}</td><td>${fmt(g.average)}</td></tr>`).join('')}</tbody></table></div></div>
 ${cells}<p class="small muted"><strong>Uwaga:</strong> zestaw obejmuje broń początkową i zaawansowaną. Różnice między pojedynczymi modelami nie dowodzą nierównowagi całych klas. Test służy do wykrywania skrajności i jest liczony tym samym lokalnym silnikiem, nie serwerowym silnikiem Ekspedycji. Wyniki przy limicie 10 rund i tym przeciwniku mogą być zaniżane przez śmierć postaci.</p>
 <button type="button" data-wlab-balance-copy="1">📋 Kopiuj raport do analizy</button>`:'<p class="small muted">Uruchom pierwszy zbiorczy test, aby zobaczyć wszystkie modele obok siebie.</p>'}
 </section>`;
}
function weaponBalanceCopy(){
 const r=weaponBalanceReport;if(!r)return;
 const fmt=n=>Number(n).toFixed(1).replace('.',',');
 const lines=[`ASHEN · Równowaga 24 broni · ${r.at}`,`Przeciwnik: ${r.settings.enemy}; profil: ${r.settings.profile}; jakość: ${r.settings.rarity}; warsztat: +${r.settings.upgrade}; prefiks: ${r.settings.prefix}; sufiks: ${r.settings.suffix}; dwie bronie: ${r.settings.dual?'tak':'nie'}`,`100 prób na broń i pancerz`, 'Broń | Klasa | Ataki | Pancerz 0 | 20 | 40 | 60', ...r.results.map(m=>[m.name,m.category,m.attacks,...m.series.map(v=>fmt(v.dpr))].join(' | '))];
 const output=lines.join('\n');
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(output).then(()=>{message='Skopiowano raport Laboratorium.';render()}).catch(()=>{window.prompt('Skopiuj raport:',output)});
 else window.prompt('Skopiuj raport:',output);
}


// ASHEN v0.4.6.4 — diagnostyka pełnych specjalizacji (TYLKO LABORATORIUM).
// Wyposażenie jest reprezentatywne, lecz bazowe wartości modeli nie są jeszcze wyrównane.
// Wynik nie może automatycznie zatwierdzić balansu, zwłaszcza przy zerowych zwycięstwach.
const WEAPON_KIT_PROFILES=[
 {id:'melee1',name:'Biała 1R · dwie maczety',category:'Biała 1R',weapon:'machete',dual:true},
 {id:'melee2',name:'Biała 2R · młot wyburzeniowy',category:'Biała 2R',weapon:'sledge',dual:false},
 {id:'gun1',name:'Palna 1R · dwa rewolwery',category:'Palna 1R',weapon:'revolver',dual:true},
 {id:'gun2',name:'Palna 2R · karabin PK',category:'Palna 2R',weapon:'lmg',dual:false},
 {id:'ranged',name:'Dystansowa · wyrzutnia harpunów',category:'Dystansowa 2R',weapon:'harpoon',dual:false},
 {id:'tech',name:'Technologiczna · broń szynowa',category:'Technologiczna 2R',weapon:'rail',dual:false}
];
const WEAPON_KIT_STAGES=[
 {name:'Początek',profile:'starter',rarity:0,upgrade:0,enemy:'scavenger'},
 {name:'Rozwój',profile:'average',rarity:2,upgrade:0,enemy:'boss'},
 {name:'Zaawansowany',profile:'veteran',rarity:4,upgrade:5,enemy:'veteran'}
];
let weaponKitReport=null,weaponKitRunning=false;
function weaponKitKey(){return 'ashen-weapon-kits-v0465-'+devActiveId()}
function weaponKitRestore(){try{const data=JSON.parse(localStorage.getItem(weaponKitKey())||'null');if(data?.version===1&&Array.isArray(data.rows)&&data.rows.length===WEAPON_KIT_PROFILES.length*WEAPON_KIT_STAGES.length)weaponKitReport=data}catch{}}
function weaponKitSave(){try{localStorage.setItem(weaponKitKey(),JSON.stringify(weaponKitReport))}catch{}}
weaponKitRestore();
function weaponKitBuild(model,kit){
 const attrsForKit=model.category.startsWith('Biała')?'str':model.category.startsWith('Technologiczna')?'int':'per';
 // NIE zmieniamy istniejących bonusów atrybutów: działa autentyczny lokalny silnik fight().
 const built=weaponLabBuild(model,true,{});
 let attacks=Array.from({length:model.attacks},()=>({...built,weapon:{...built.weapon}}));
 if(kit.dual){attacks=attacks.concat(Array.from({length:model.attacks},()=>({...built,weapon:{...built.weapon},hand:'left',power:.8})))}
 return attacks;
}
function weaponKitRun(){
 if(!state.created||weaponKitRunning)return;
 weaponLabReadControls();
 const saved={...weaponLabConfig};
 const armors=[0,20,40,60];
 const n=300,rows=[];
 weaponKitRunning=true;
 try{
  for(const stage of WEAPON_KIT_STAGES){
   const preset=COMBAT_LAB_FOES[stage.enemy];
   const baseEnemy=arenaEnemy(ARENA_STAGES.find(x=>x.level===preset.stage));
   const lv=stage.profile==='starter'?8:stage.profile==='average'?17:30;
   const a={str:lv,dex:lv,end:lv,per:lv,int:lv,cha:lv};
   const def={hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
   // Brak prefiksów/sufiksów: najpierw izolujemy klasy, ataki i jakość.
   weaponLabConfig={...saved,rarity:stage.rarity,upgrade:stage.upgrade,workshop:'C',prefix:'none',suffix:'none'};
   for(const kit of WEAPON_KIT_PROFILES){
    const model=WEAPON_LAB_MODELS.find(x=>x.id===kit.weapon);
    const attacks=weaponKitBuild(model,kit);
    const series=[];
    for(const armor of armors){
     const enemy={...baseEnemy,armor};
     const acc={wins:0,draws:0,losses:0,rounds:0,damage:0,potential:0,taken:0,attempts:0,hits:0,crits:0,killRounds:0,heroHpRemaining:0};
     for(let i=0;i<n;i++){
      const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
      const r=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:true});
      const d=r.damageSummary;
      if(r.won)acc.wins++;else if(r.heroHp>0&&r.enemyHp>0)acc.draws++;else acc.losses++;
      acc.rounds+=d.rounds;acc.damage+=d.hero.damage;acc.potential+=d.hero.potential;acc.killRounds+=r.won?d.rounds:0;acc.heroHpRemaining+=r.heroHp;acc.taken+=d.foe.damage;acc.attempts+=d.hero.attempts;acc.hits+=d.hero.hits;acc.crits+=d.hero.crits;
     }
     series.push({armor,dpr:acc.rounds?acc.damage/acc.rounds:0,potentialDpr:acc.rounds?acc.potential/acc.rounds:0,averageKillRounds:acc.wins?acc.killRounds/acc.wins:null,averageHeroHp:acc.heroHpRemaining/n,wins:100*acc.wins/n,draws:100*acc.draws/n,losses:100*acc.losses/n,accuracy:acc.attempts?100*acc.hits/acc.attempts:0,crit:acc.hits?100*acc.crits/acc.hits:0,taken:acc.taken/n});
    }
    rows.push({stage:stage.name,kit:kit.name,category:kit.category,attacks:attacks.length,series});
   }
  }
  weaponKitReport={version:1,at:new Date().toLocaleString('pl-PL'),n,armors,stages:WEAPON_KIT_STAGES.map(x=>x.name),rows,notes:'Reprezentanci klas mają różne wartości bazowe, nie wyrównano budżetu przedmiotów. Przeciwnicy: etap 1 / 10 / 20. Obrażenia rzeczywiste są ograniczone do pozostałego PŻ przeciwnika, a potencjalne liczone po pancerzu, przed ograniczeniem PŻ. Średnie rundy do wygranej tylko z wygranych walk. 10 rund; wspólne losowania; prawdziwy lokalny fight(); bez modyfikatorów. Nie dotyczy serwerowych Ekspedycji.'};
  weaponKitSave();weaponLabOpen=true;
 }catch(err){message='Błąd porównania specjalizacji: '+(err?.message||String(err))}
 finally{weaponLabConfig=saved;weaponLabSave();weaponKitRunning=false;render()}
}
function weaponKitText(){
 if(!weaponKitReport)return '';
 const r=weaponKitReport,f=v=>Number(v).toFixed(1).replace('.',',');
 return [`ASHEN · Specjalizacje · ${r.at}`,`${r.n} prób na zestaw / poziom / pancerz; brak prefiksu i sufiksu`,r.notes,'Etap | Zestaw | Ataki | Pancerz 0 | 20 | 40 | 60 (rzeczywiste obrażenia/rundę) | Potencjał/rundę (pancerz 20) | Wygrane % (pancerz 20) | Średnia runda wygranej (pancerz 20) | PŻ gracza po walce (pancerz 20) | Celność % (pancerz 20) | Krytyki % (pancerz 20)',...r.rows.map(x=>[x.stage,x.kit,x.attacks,...x.series.map(v=>f(v.dpr)),f(x.series[1].potentialDpr),f(x.series[1].wins),x.series[1].averageKillRounds===null?'—':f(x.series[1].averageKillRounds),f(x.series[1].averageHeroHp),f(x.series[1].accuracy),f(x.series[1].crit)].join(' | '))].join('\n');
}
function weaponKitCopy(){const output=weaponKitText();if(!output)return;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(output).then(()=>{message='Skopiowano porównanie specjalizacji.';render()}).catch(()=>window.prompt('Skopiuj raport:',output));else window.prompt('Skopiuj raport:',output)}
function weaponKitHtml(){
 const r=weaponKitReport;const f=v=>Number(v).toFixed(1).replace('.',',');
 const sections=r?r.stages.map(stage=>{
  const rows=r.rows.filter(x=>x.stage===stage);
  const measured=rows.map(x=>x.series[1].dpr);const high=Math.max(...measured),low=Math.min(...measured);
  const spread=high?100*(high-low)/high:0;
  const allZero=rows.every(x=>x.series[1].wins===0);const allFull=rows.every(x=>x.series[1].wins===100);
  return `<div class="weapon-kit-stage"><h5>${escape(stage)} · pancerz 20 · rozrzut ${f(spread)}%</h5>${allZero?'<p class="weapon-kit-warning">Brak zwycięstw: ten etap nie pozwala ocenić równowagi wygranych. Porównuj na razie obrażenia.</p>':''}${allFull?'<p class="weapon-kit-warning">Wszystkie zestawy wygrywają: odsetek zwycięstw nie rozróżnia siły. Porównaj rundę wygranej i potencjał obrażeń.</p>':''}<div class="combat-lab-table-wrap"><table class="weapon-balance-table"><thead><tr><th>Zestaw</th><th>Ataki</th><th>Pancerz 0</th><th>20</th><th>40</th><th>60</th><th>Potencjał/runda 20</th><th>Wygrane przy 20</th><th>Śr. runda wygranej</th><th>PŻ gracza po walce</th><th>Celność</th><th>Krytyki</th></tr></thead><tbody>${rows.map(x=>`<tr><th>${escape(x.kit)}</th><td>${x.attacks}</td>${x.series.map(v=>`<td>${f(v.dpr)}</td>`).join('')}<td>${f(x.series[1].potentialDpr)}</td><td>${f(x.series[1].wins)}%</td><td>${x.series[1].averageKillRounds===null?'—':f(x.series[1].averageKillRounds)}</td><td>${f(x.series[1].averageHeroHp)}</td><td>${f(x.series[1].accuracy)}%</td><td>${f(x.series[1].crit)}%</td></tr>`).join('')}</tbody></table></div></div>`
 }).join(''):'';
 return `<section class="weapon-balance-panel weapon-kit-panel"><h4>🧪 Laboratorium specjalizacji · ASHEN 0.4.6.5</h4><p class="small muted">Sześć reprezentatywnych <strong>pełnych zestawów</strong>, trzy etapy rozwoju, cztery poziomy pancerza. Dwie bronie 1R są liczone z drugim egzemplarzem na 80% mocy. Ten test bada, czy obrana klasa pozostaje grywalna — <strong>nie wymaga dobierania broni do konkretnego bossa</strong>.</p><button type="button" class="primary" data-wlab-kits="1" ${weaponKitRunning?'disabled':''}>▶ Porównaj specjalizacje (21 600 walk)</button><p class="small muted">6 zestawów × 3 poziomy rozwoju × 4 wartości pancerza × 300 prób = 21 600 symulacji. Przeciwnicy: etap 1 / 10 / 20, odpowiednio do rozwoju. Początek: zwykła +0, rozwój: rzadka +0, zaawansowany: legendarna +5 (Warsztat C). Bez prefiksów i sufiksów. Wyniki zostają zapisane lokalnie. Dodatkowo raport pokazuje <strong>potencjalne obrażenia po pancerzu bez obcięcia do pozostałego PŻ</strong> oraz <strong>rundę zakończenia zwycięskiej walki</strong>.</p><p class="small muted"><strong>Ograniczenie:</strong> bazowe modele (np. młot i harpun) mają różne budżety obrażeń, dlatego to audyt odniesienia, a nie końcowy certyfikat balansu. Krytyki, celność i pancerz działają według testowego lokalnego silnika. Ekspedycje serwerowe pozostają bez zmian.</p>${r?`<strong>Ostatni test: ${escape(r.at)}</strong>${sections}<button type="button" data-wlab-kits-copy="1">📋 Kopiuj pełny raport specjalizacji</button>`:'<p class="small muted">Uruchom test. Możesz przełączać zakładki po zakończeniu; raport zostanie zachowany.</p>'}</section>`;
}


// ASHEN 0.4.6.6 — druga, niezależna próba: kontrolne wyrównanie budżetu obrażeń.
// Nie jest to propozycja nowych statystyk przedmiotów. Lokalny fight(), bez zapisu nagród.
const WEAPON_NORMAL_ARMORS=[0,20,40,60];
let weaponNormalReport=null,weaponNormalRunning=false;
function weaponNormalKey(){return 'ashen-weapon-normal-v0466-'+devActiveId()}
function weaponNormalSave(){try{localStorage.setItem(weaponNormalKey(),JSON.stringify(weaponNormalReport))}catch{}}
function weaponNormalRestore(){try{const r=JSON.parse(localStorage.getItem(weaponNormalKey())||'null');if(r?.version===1&&Array.isArray(r.rows)&&r.rows.length===18)weaponNormalReport=r}catch{}}
weaponNormalRestore();
function weaponNormalBudget(attacks,a){
 let sum=0;
 for(const attack of attacks){
  const w=attack.weapon,average=(w.min+w.max)/2+weaponAttributeDamage(a,w);
  const critChance=clamp(.05+a.per*.005+(w.critPp||0)/100,0,.35);
  const critMultiplier=w.labCritMultiplier||1.6;
  // Model bazowy: oczekiwana wartość ciosów przed ochroną, z krytykiem, bez trafienia.
  sum+=Math.max(1,average)*attack.power*(1+critChance*(critMultiplier-1));
 }
 return Math.max(.001,sum);
}
function weaponNormalRun(){
 if(!state.created||weaponNormalRunning)return;
 weaponLabReadControls();
 const saved={...weaponLabConfig},rows=[],n=300;
 weaponNormalRunning=true;
 try{
  for(const stage of WEAPON_KIT_STAGES){
   const fo=COMBAT_LAB_FOES[stage.enemy];
   const baseEnemy=arenaEnemy(ARENA_STAGES.find(x=>x.level===fo.stage));
   const lv=stage.profile==='starter'?8:stage.profile==='average'?17:30;
   const a={str:lv,dex:lv,end:lv,per:lv,int:lv,cha:lv};
   const def={hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
   weaponLabConfig={...saved,rarity:stage.rarity,upgrade:stage.upgrade,workshop:'C',prefix:'none',suffix:'none'};
   const candidate=WEAPON_KIT_PROFILES.map(kit=>{
    const model=WEAPON_LAB_MODELS.find(x=>x.id===kit.weapon);
    const attacks=weaponKitBuild(model,kit);
    return {kit,model,attacks,rawBudget:weaponNormalBudget(attacks,a)};
   });
   // Każdy etap ma własny wspólny budżet; nie zmieniamy liczby ataków ani krytyków.
   const target=candidate.reduce((sum,x)=>sum+x.rawBudget,0)/candidate.length;
   for(const entry of candidate){
    const factor=target/entry.rawBudget;
    const attacks=entry.attacks.map(x=>{
     const w={...x.weapon};
     // Skalujemy obrażenia broni; nie skaluje to premii atrybutów, krytyka ani penetracji.
     const attribute=weaponAttributeDamage(a,w);
     w.min=Math.max(1,Math.round((w.min+attribute)*factor-attribute));
     w.max=Math.max(w.min,Math.round((w.max+attribute)*factor-attribute));
     return {...x,weapon:w};
    });
    const series=[];
    for(const armor of WEAPON_NORMAL_ARMORS){
     const enemy={...baseEnemy,armor};
     const agg={wins:0,rounds:0,potential:0,damage:0,hp:0,killRounds:0,attempts:0,hits:0,crits:0};
     for(let i=0;i<n;i++){
      const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
      const r=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:true});
      const d=r.damageSummary;
      agg.wins+=r.won?1:0;agg.killRounds+=r.won?d.rounds:0;
      agg.rounds+=d.rounds;agg.potential+=d.hero.potential;agg.damage+=d.hero.damage;
      agg.hp+=r.heroHp;agg.attempts+=d.hero.attempts;agg.hits+=d.hero.hits;agg.crits+=d.hero.crits;
     }
     series.push({armor,potential:agg.potential/Math.max(1,agg.rounds),dpr:agg.damage/Math.max(1,agg.rounds),wins:agg.wins/n*100,killRound:agg.wins?agg.killRounds/agg.wins:null,hp:agg.hp/n,accuracy:agg.attempts?100*agg.hits/agg.attempts:0});
    }
    rows.push({stage:stage.name,kit:entry.kit.name,attacks:attacks.length,originalBudget:entry.rawBudget,target,factor,actualBudget:weaponNormalBudget(attacks,a),series});
   }
  }
  weaponNormalReport={version:1,at:new Date().toLocaleString('pl-PL'),n,rows};
  weaponNormalSave();weaponLabOpen=true;
 }catch(e){message='Błąd testu kontrolnego: '+(e?.message||String(e))}
 finally{weaponLabConfig=saved;weaponLabSave();weaponNormalRunning=false;render()}
}
function weaponNormalText(){
 const r=weaponNormalReport;if(!r)return '';
 const f=x=>Number(x).toFixed(1).replace('.',',');
 return [`ASHEN · Kontrola klas / równy budżet · ${r.at}`,
  `${r.n} prób / zestaw / etap / pancerz · silnik Starć · bez prefiksów i sufiksów`,
  'Uwaga: skalowanie tylko eksperymentalne; budżet = oczekiwane obrażenia wszystkich prób ataków przed pancerzem i trafieniem, z krytykami. Nie są to statystyki docelowych przedmiotów.',
  'Etap | Zestaw | Ataki | Budżet wyjściowy | Wspólny cel | Współczynnik | Budżet po zaokrągleniu | Potencjał/runda 0 | 20 | 40 | 60 | Wygrane % (pancerz 20) | Runda wygranej (20) | PŻ postaci po walce (20)',
  ...r.rows.map(x=>[x.stage,x.kit,x.attacks,f(x.originalBudget),f(x.target),f(x.factor),f(x.actualBudget),...x.series.map(v=>f(v.potential)),f(x.series[1].wins),x.series[1].killRound===null?'—':f(x.series[1].killRound),f(x.series[1].hp)].join(' | '))
 ].join('\n');
}
function weaponNormalCopy(){const content=weaponNormalText();if(!content)return;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(content).then(()=>{message='Skopiowano test kontrolny.';render()}).catch(()=>window.prompt('Skopiuj raport:',content));else window.prompt('Skopiuj raport:',content)}
function weaponNormalHtml(){
 const r=weaponNormalReport,f=x=>Number(x).toFixed(1).replace('.',',');
 const stages=r?[...new Set(r.rows.map(x=>x.stage))]:[];
 const tables=stages.map(stage=>{
  const rows=r.rows.filter(x=>x.stage===stage);
  const values=rows.map(x=>x.series[1].potential),max=Math.max(...values),min=Math.min(...values);
  return `<h5>${escape(stage)} · rozrzut potencjału przy pancerzu 20: ${f(max>0?100*(max-min)/max:0)}%</h5><div class="combat-lab-table-wrap"><table class="weapon-balance-table"><thead><tr><th>Zestaw</th><th>Ataki</th><th>Skala obrażeń</th><th>Budżet</th><th>Potencjał 0</th><th>20</th><th>40</th><th>60</th><th>Wygrane 20</th><th>Runda wygranej</th></tr></thead><tbody>${rows.map(x=>`<tr><th>${escape(x.kit)}</th><td>${x.attacks}</td><td>×${f(x.factor)}</td><td>${f(x.actualBudget)}</td>${x.series.map(v=>`<td>${f(v.potential)}</td>`).join('')}<td>${f(x.series[1].wins)}%</td><td>${x.series[1].killRound===null?'—':f(x.series[1].killRound)}</td></tr>`).join('')}</tbody></table></div>`;
 }).join('');
 return `<section class="weapon-balance-panel weapon-kit-panel"><h4>⚖ Test kontrolny · wyrównany budżet klas (0.4.6.6)</h4><p class="small muted">Eksperymentalnie wyrównujemy <strong>oczekiwane obrażenia serii przed pancerzem</strong> w ramach jednego etapu rozwoju. Nie zmieniamy liczby ataków, zasad trafień, krytyków ani penetracji. W ten sposób sprawdzimy, czy przewaga klasy bierze się z mechaniki, czy z samych wartości broni. <strong>To nie jest automatyczny balans ani nowe statystyki ekwipunku.</strong></p><button type="button" class="primary" data-wlab-normal="1" ${weaponNormalRunning?'disabled':''}>▶ Porównaj 6 klas przy równym budżecie (21 600 walk)</button><p class="small muted">3 etapy × 6 zestawów × 4 poziomy pancerza × 300 prób. Przeciwnicy etap 1 / 10 / 20. Raport zapisuje się lokalnie. Przy wysokim odsetku zwycięstw porównuj przede wszystkim potencjał i rundy wygranej. Pojedyncze ataki mogą się różnić z powodu zaokrągleń.</p>${r?`<strong>Ostatni test: ${escape(r.at)}</strong>${tables}<button type="button" data-wlab-normal-copy="1">📋 Kopiuj raport kontrolny</button>`:''}</section>`;
}


// ASHEN v0.4.6.7 - pierwsza STAŁA kalibracja testowych klas, nie zmienia graczy ani serwera.
// Mnożniki zaokrąglone z testu v0.4.6.6; ten sam na wszystkich etapach rozwoju.
const WEAPON_CANDIDATE_CLASS_SCALE={melee1:.72,melee2:.91,gun1:1.12,gun2:.93,ranged:1.42,tech:1.22};
const WEAPON_CANDIDATE_LABEL={melee1:'Biała 1R · dwie maczety',melee2:'Biała 2R · młot',gun1:'Palna 1R · dwa rewolwery',gun2:'Palna 2R · PK',ranged:'Dystansowa · harpuny',tech:'Technologiczna · szynowa'};
const WEAPON_CANDIDATE_IDS={melee1:'machete',melee2:'sledge',gun1:'revolver',gun2:'lmg',ranged:'harpoon',tech:'rail'};
let weaponCandidateReport=null,weaponCandidateRunning=false;
function weaponCandidateKey(){return 'ashen-weapon-candidate-v0467-'+devActiveId()}
function weaponCandidateSave(){try{localStorage.setItem(weaponCandidateKey(),JSON.stringify(weaponCandidateReport))}catch{}}
function weaponCandidateRestore(){try{const r=JSON.parse(localStorage.getItem(weaponCandidateKey())||'null');if(r?.version===1&&r.rows?.length===18)weaponCandidateReport=r}catch{}}
weaponCandidateRestore();
function weaponCandidateRun(){
 if(!state.created||weaponCandidateRunning)return;
 weaponLabReadControls();
 const saved={...weaponLabConfig},rows=[],n=300;
 const kitToClass={melee1:'melee1',melee2:'melee2',gun1:'gun1',gun2:'gun2',ranged:'ranged',tech:'tech'};
 weaponCandidateRunning=true;
 try{
  for(const stage of WEAPON_KIT_STAGES){
   const fo=COMBAT_LAB_FOES[stage.enemy];
   const baseEnemy=arenaEnemy(ARENA_STAGES.find(x=>x.level===fo.stage));
   const lv=stage.profile==='starter'?8:stage.profile==='average'?17:30;
   const a={str:lv,dex:lv,end:lv,per:lv,int:lv,cha:lv};
   const def={hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
   weaponLabConfig={...saved,rarity:stage.rarity,upgrade:stage.upgrade,workshop:'C',prefix:'none',suffix:'none'};
   for(const kit of WEAPON_KIT_PROFILES){
    const model=WEAPON_LAB_MODELS.find(x=>x.id===kit.weapon);
    const scale=WEAPON_CANDIDATE_CLASS_SCALE[kitToClass[kit.id]];
    if(!Number.isFinite(scale))throw new Error('Brak kalibracji dla '+kit.id);
    const original=weaponKitBuild(model,kit);
    // Kalibrujemy tylko bazowe obrażenia modelu przed modyfikacją rzadkością i warsztatem.
    // Rarity/upgrade pozostają identyczne z oryginalną konfiguracją etapu.
    const candidateModel={...model,newMin:Math.max(1,Math.round(model.newMin*scale)),newMax:Math.max(1,Math.round(model.newMax*scale))};
    const attacks=weaponKitBuild(candidateModel,kit);
    const series=[];
    for(const armor of WEAPON_NORMAL_ARMORS){
     const enemy={...baseEnemy,armor};
     const results=[];
     for(const active of [original,attacks]){
      const agg={wins:0,draws:0,losses:0,rounds:0,potential:0,real:0,hp:0,killRounds:0,attempts:0,hits:0,crits:0};
      for(let i=0;i<n;i++){
       const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
       const r=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks:active},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:true});
       const d=r.damageSummary;
       agg.wins+=r.won?1:0;
       agg.draws+=!r.won&&r.heroHp>0&&r.enemyHp>0?1:0;
       agg.losses+=!r.won&&(r.heroHp<=0||r.enemyHp<=0)?1:0;
       agg.killRounds+=r.won?d.rounds:0;
       agg.rounds+=d.rounds;agg.potential+=d.hero.potential;agg.real+=d.hero.damage;
       agg.hp+=r.heroHp;agg.attempts+=d.hero.attempts;agg.hits+=d.hero.hits;agg.crits+=d.hero.crits;
      }
      results.push({dpr:agg.potential/Math.max(1,agg.rounds),wins:agg.wins*100/n,kill:agg.wins?agg.killRounds/agg.wins:null,hp:agg.hp/n,acc:agg.attempts?100*agg.hits/agg.attempts:0,crit:agg.hits?100*agg.crits/agg.hits:0});
     }
     series.push({armor,before:results[0],after:results[1]});
    }
    rows.push({stage:stage.name,kit:kit.name,scale,oldRange:`${model.newMin}–${model.newMax}`,newRange:`${candidateModel.newMin}–${candidateModel.newMax}`,attacks:attacks.length,series});
   }
  }
  weaponCandidateReport={version:1,at:new Date().toLocaleString('pl-PL'),n,rows};
  weaponCandidateSave();weaponLabOpen=true;
 }catch(e){message='Błąd testu kalibracji: '+(e?.message||String(e))}
 finally{weaponLabConfig=saved;weaponLabSave();weaponCandidateRunning=false;render()}
}
function weaponCandidateText(){
 const r=weaponCandidateReport;if(!r)return '';
 const f=x=>x===null?'—':Number(x).toFixed(1).replace('.',',');
 return [`ASHEN · Stała kalibracja klas 0.4.6.7 · ${r.at}`,
  '300 prób na wariant / zestaw / etap / pancerz (łącznie 43 200 walk); ten sam mnożnik niezależnie od etapu; nic nie zmienia w prawdziwym eq ani walkach.',
  'Parametry z v0.4.6.6 wyznaczają jedynie mnożniki na start; wartości docelowe wymagają testów także z prefiksami/sufiksami i różnymi atrybutami.',
  'Etap | Zestaw | Ataki | Współczynnik | Dmg bazowe przed | Po | Potencjał stary przy pancerzu 0 / 20 / 40 / 60 | Potencjał kalibrowany przy pancerzu 0 / 20 / 40 / 60 | Wygrane stary/nowy (pancerz 20) | Runda wygranej stary/nowy',
  ...r.rows.map(x=>[x.stage,x.kit,x.attacks,f(x.scale),x.oldRange,x.newRange,
   x.series.map(y=>f(y.before.dpr)).join(' / '),x.series.map(y=>f(y.after.dpr)).join(' / '),
   `${f(x.series[1].before.wins)}% / ${f(x.series[1].after.wins)}%`,
   `${f(x.series[1].before.kill)} / ${f(x.series[1].after.kill)}`].join(' | '))].join('\n');
}
function weaponCandidateCopy(){const val=weaponCandidateText();if(!val)return;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(val).then(()=>{message='Skopiowano kalibrację.';render()}).catch(()=>window.prompt('Skopiuj raport:',val));else window.prompt('Skopiuj raport:',val)}
function weaponCandidateHtml(){
 const r=weaponCandidateReport,f=x=>x===null?'—':Number(x).toFixed(1).replace('.',',');
 const stages=r?[...new Set(r.rows.map(x=>x.stage))]:[];
 const content=stages.map(stage=>{
  const rows=r.rows.filter(x=>x.stage===stage);
  const values=rows.map(x=>x.series[1].after.dpr);
  const hi=Math.max(...values),lo=Math.min(...values);
  return `<h5>${escape(stage)} · pancerz 20 · rozrzut ${f(100*(hi-lo)/hi)}%</h5><div class="combat-lab-table-wrap"><table class="weapon-balance-table"><thead><tr><th>Zestaw</th><th>Ataki</th><th>Skala</th><th>Obrażenia bazowe przed → po</th><th>Stary 20</th><th>Nowy 20</th><th>Nowy 0</th><th>Nowy 40</th><th>Nowy 60</th><th>Wygrane 20</th><th>Runda wygranej 20</th></tr></thead><tbody>${rows.map(x=>`<tr><th>${escape(x.kit)}</th><td>${x.attacks}</td><td>×${f(x.scale)}</td><td>${x.oldRange} → ${x.newRange}</td><td>${f(x.series[1].before.dpr)}</td><td>${f(x.series[1].after.dpr)}</td><td>${f(x.series[0].after.dpr)}</td><td>${f(x.series[2].after.dpr)}</td><td>${f(x.series[3].after.dpr)}</td><td>${f(x.series[1].after.wins)}%</td><td>${f(x.series[1].after.kill)}</td></tr>`).join('')}</tbody></table></div>`;
 }).join('');
 return `<section class="weapon-balance-panel weapon-kit-panel"><h4>⚖ Pierwsza stała kalibracja · kandydat do ASHEN 0.5</h4><p class="small muted">Z poprzedniej kontroli przyjęliśmy <strong>stały współczynnik obrażeń dla każdego z 6 testowych modeli</strong> (taki sam na wszystkich trzech etapach), zamiast liczyć nowe wyrównanie dla każdej symulacji. Otrzymasz wyniki przed i po kalibracji w identycznych warunkach. <strong>To prototyp: nie zmienia prawdziwych broni, Starć, nagród ani Ekspedycji.</strong></p><button type="button" class="primary" data-wlab-candidate="1" ${weaponCandidateRunning?'disabled':''}>▶ Testuj pierwszą kalibrację (43 200 walk)</button><p class="small muted">6 zestawów × 3 etapy × 4 pancerze × 300 prób × 2 warianty. Mierzymy potencjał obrażeń, nie tylko obrażenia obcięte do PŻ przeciwnika. Przy 100% wygranych liczy się potencjał i szybkość zwycięstwa. Zapis raportu działa lokalnie.</p>${r?`<strong>Ostatni test: ${escape(r.at)}</strong>${content}<button type="button" data-wlab-candidate-copy="1">📋 Kopiuj raport stałej kalibracji</button>`:''}</section>`;
}

// ASHEN v0.4.6.8 — test odpornosci pierwszej kalibracji na atrybuty i modyfikatory.
// Nie modyfikuje wyposazenia ani walk; wykorzystuje lokalny fight() i testSnapshot.
const WEAPON_STRESS_BUILDS=[
 {id:'balanced',name:'Równe atrybuty'},
 {id:'focused',name:'Specjalizacja klasy'}
];
const WEAPON_STRESS_MODS=[
 {id:'none',name:'Bez modyfikatorów',prefix:'none',suffix:'none'},
 {id:'damage',name:'Niszczycielski + Berserkera',prefix:'destructive',suffix:'berserk'},
 {id:'critical',name:'Zabójczy + Egzekutora',prefix:'killer',suffix:'executioner'},
 {id:'speed',name:'Szybki + Łowcy (zgodność warunkowa)',prefix:'quick',suffix:'hunter'}
];
let weaponStressReport=null,weaponStressRunning=false;
function weaponStressKey(){return 'ashen-weapon-stress-v0468-'+devActiveId()}
function weaponStressSave(){try{localStorage.setItem(weaponStressKey(),JSON.stringify(weaponStressReport))}catch{}}
function weaponStressRestore(){try{const x=JSON.parse(localStorage.getItem(weaponStressKey())||'null');if(x?.version===1&&Array.isArray(x.rows)&&x.rows.length===144)weaponStressReport=x}catch{}}
weaponStressRestore();
function weaponStressAttrs(kit,level,focused){
 const a={str:level,dex:level,end:level,per:level,int:level,cha:level};
 if(!focused)return a;
 // Staly budzet sumy atrybutow. Na starcie +/-7, aby uniknac uciecia statystyki do 1.
 const delta=level<9?7:8;
 const changes=kit.id.startsWith('melee')?{str:delta,dex:4,per:-delta,int:-4}:
  kit.id.startsWith('gun')?{per:delta,dex:4,str:-delta,int:-4}:
  kit.id==='ranged'?{dex:delta,per:4,str:-delta,int:-4}:
  {int:delta,per:4,str:-delta,dex:-4};
 for(const [key,change] of Object.entries(changes))a[key]=Math.max(1,a[key]+change);
 return a;
}
function weaponStressAttacks(kit,mod,attrs){
 const model=WEAPON_LAB_MODELS.find(x=>x.id===kit.weapon);
 const scale=WEAPON_CANDIDATE_CLASS_SCALE[kit.id];
 const testModel={...model,newMin:Math.max(1,Math.round(model.newMin*scale)),newMax:Math.max(1,Math.round(model.newMax*scale))};
 const attacks=weaponKitBuild(testModel,kit);
 // Ten sam eksperymentalny bonus Szybki co w porownaniu starego i nowego modelu.
 if(mod.prefix==='quick'&&model.attacks<3&&['Biała 1R','Palna 1R','Palna 2R','Dystansowa 2R'].includes(model.category)){
  const extra=attacks[0];attacks.push({...extra,weapon:{...extra.weapon},power:.45});
 }
 return attacks;
}
function weaponStressRun(){
 if(!state.created||weaponStressRunning)return;
 weaponLabReadControls();
 const saved={...weaponLabConfig},rows=[];
 const n=150,armors=[20,60];
 weaponStressRunning=true;
 try{
  for(const stage of WEAPON_KIT_STAGES){
   const preset=COMBAT_LAB_FOES[stage.enemy];
   const baseEnemy=arenaEnemy(ARENA_STAGES.find(x=>x.level===preset.stage));
   const level=stage.profile==='starter'?8:stage.profile==='average'?17:30;
   for(const build of WEAPON_STRESS_BUILDS){
    for(const mod of WEAPON_STRESS_MODS){
     weaponLabConfig={...saved,rarity:stage.rarity,upgrade:stage.upgrade,workshop:'C',prefix:mod.prefix,suffix:mod.suffix};
     for(const kit of WEAPON_KIT_PROFILES){
      const a=weaponStressAttrs(kit,level,build.id==='focused');
      // Sufiks Łowcy ma bonus percepcji wyłącznie w palnej/dystansowej (jak w głównym teście).
      if(mod.suffix==='hunter'&&(kit.id.startsWith('gun')||kit.id==='ranged'))a.per+=3;
      const def={hp:60+a.end*10,acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:Math.floor(a.end/4)};
      const attacks=weaponStressAttacks(kit,mod,a);
      const series=[];
      for(const armor of armors){
       const enemy={...baseEnemy,armor};
       const acc={wins:0,rounds:0,potential:0,hp:0,killRounds:0,hits:0,attempts:0,crits:0};
       for(let i=0;i<n;i++){
        const seed=(0x9e3779b9^Math.imul(i+1,2654435761))>>>0;
        const result=fight(enemy,{testSnapshot:{attributes:a,defense:def,attacks},testRandom:combatLabRandom(seed),testMaxRounds:10,testWeaponModel:true});
        const d=result.damageSummary;
        acc.wins+=result.won?1:0;
        acc.rounds+=d.rounds;acc.potential+=d.hero.potential;acc.hp+=result.heroHp;
        acc.killRounds+=result.won?d.rounds:0;
        acc.hits+=d.hero.hits;acc.attempts+=d.hero.attempts;acc.crits+=d.hero.crits;
       }
       series.push({armor,dpr:acc.potential/Math.max(1,acc.rounds),wins:100*acc.wins/n,kill:acc.wins?acc.killRounds/acc.wins:null,hp:acc.hp/n,accuracy:acc.attempts?100*acc.hits/acc.attempts:0,crits:acc.hits?100*acc.crits/acc.hits:0});
      }
      rows.push({stage:stage.name,build:build.name,mod:mod.name,kit:kit.name,attacks:attacks.length,series});
     }
    }
   }
  }
  weaponStressReport={version:1,at:new Date().toLocaleString('pl-PL'),n,rows};
  weaponStressSave();weaponLabOpen=true;
 }catch(e){message='Błąd testu odporności balansu: '+(e?.message||String(e))}
 finally{weaponLabConfig=saved;weaponLabSave();weaponStressRunning=false;render()}
}
function weaponStressSummary(){
 const r=weaponStressReport;if(!r)return [];
 const groups=[];
 for(const stage of WEAPON_KIT_STAGES){for(const build of WEAPON_STRESS_BUILDS){for(const mod of WEAPON_STRESS_MODS){
  const set=r.rows.filter(x=>x.stage===stage.name&&x.build===build.name&&x.mod===mod.name);
  const low=Math.min(...set.map(x=>x.series[0].dpr)),hi=Math.max(...set.map(x=>x.series[0].dpr));
  groups.push({stage:stage.name,build:build.name,mod:mod.name,low,hi,gap:hi>0?100*(hi-low)/hi:0});
 }}}
 return groups;
}
function weaponStressText(){
 const r=weaponStressReport;if(!r)return '';
 const fmt=x=>Number(x).toFixed(1).replace('.',',');
 return [`ASHEN · Odporność balansu klas · ${r.at}`,
 `${r.n} prób × 6 zestawów × 3 etapy × 2 pancerze × 2 rozkłady atrybutów × 4 zestawy modyfikatorów = 43 200 symulacji`,
 'Stałe mnożniki z 0.4.6.7. Rozkład specjalizacji przesuwa atrybuty bez zwiększania ich sumy. Zestaw Szybki+Łowcy działa tylko w zakresie zgodności z modelem.',
 'UWAGA: ten test nie wyrównuje budżetów po dodaniu modyfikatorów, sprawdza ich wpływ.',
 'Rozrzut przy pancerzu 20 (od min do max względem max):',
 'Etap | Atrybuty | Modyfikatory | Minimum | Maksimum | Rozrzut %',
 ...weaponStressSummary().map(x=>[x.stage,x.build,x.mod,fmt(x.low),fmt(x.hi),fmt(x.gap)].join(' | ')),
 '', 'Szczegóły:',
 'Etap | Atrybuty | Modyfikatory | Zestaw | Ataki | Potencjał p20 | Potencjał p60 | Wygrane p20 | Runda zwycięstwa p20 | Celność p20 | Krytyki p20',
 ...r.rows.map(x=>[x.stage,x.build,x.mod,x.kit,x.attacks,...x.series.map(y=>fmt(y.dpr)),fmt(x.series[0].wins),x.series[0].kill===null?'—':fmt(x.series[0].kill),fmt(x.series[0].accuracy),fmt(x.series[0].crits)].join(' | '))].join('\n');
}
function weaponStressCopy(){const t=weaponStressText();if(!t)return;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>{message='Skopiowano raport odporności balansu.';render()}).catch(()=>window.prompt('Skopiuj raport:',t));else window.prompt('Skopiuj raport:',t)}
function weaponStressHtml(){
 const r=weaponStressReport,fmt=x=>Number(x).toFixed(1).replace('.',',');
 const groups=weaponStressSummary();
 const table=r?`<div class="combat-lab-table-wrap"><table class="weapon-balance-table"><thead><tr><th>Etap</th><th>Atrybuty</th><th>Modyfikatory</th><th>Min p20</th><th>Max p20</th><th>Rozrzut</th></tr></thead><tbody>${groups.map(x=>`<tr><td>${escape(x.stage)}</td><td>${escape(x.build)}</td><td>${escape(x.mod)}</td><td>${fmt(x.low)}</td><td>${fmt(x.hi)}</td><td>${fmt(x.gap)}%</td></tr>`).join('')}</tbody></table></div>`:'';
 return `<section class="weapon-balance-panel weapon-kit-panel"><h4>🧪 Odporność balansu · atrybuty i modyfikatory (0.4.6.8)</h4><p class="small muted">Sprawdzamy stałą kalibrację w <strong>dwóch rozkładach atrybutów</strong> i czterech kombinacjach modyfikatorów. Celem jest wykrycie sytuacji, w których klasa nagle staje się dominująca. Wariant specjalizacji ma taki sam łączny budżet atrybutów jak wariant równy. Zestaw „Szybki + Łowcy” nie zapewnia identycznych efektów wszystkim klasom — jest celowym testem zgodności, nie uczciwym porównaniem uniwersalnych premii.</p>
 <button type="button" class="primary" data-wlab-stress="1" ${weaponStressRunning?'disabled':''}>▶ Sprawdź atrybuty i modyfikatory (43 200 walk)</button><p class="small muted">6 zestawów × 3 etapy × 2 pancerze × 2 profile × 4 kombinacje × 150 prób. Lokalny silnik Starć, 10 rund. Nie zmienia wyposażenia ani nagród. Pełne wyniki dostępne po skopiowaniu raportu.</p>
 ${r?`<strong>Ostatni raport: ${escape(r.at)}</strong>${table}<button type="button" data-wlab-stress-copy="1">📋 Kopiuj pełny raport</button>`:''}</section>`;
}

function weaponLabHtml(){
 const c=weaponLabConfig,r=weaponLabResults;
 const options=(arr,value)=>arr.map(([v,label])=>`<option value="${escape(String(v))}" ${String(v)===String(value)?'selected':''}>${escape(String(label))}</option>`).join('');
 const field=(name,id,arr,val)=>`<label>${name}<select id="${id}">${options(arr,val)}</select></label>`;
 const format=(x,places=1)=>Number(x).toFixed(places).replace('.',',');
 const col=(t,n)=>({wins:format(t.wins/n*100)+'%',draws:t.draws,losses:t.losses,attacks:format(t.attempts/t.rounds,2),accuracy:t.attempts?format(t.hits/t.attempts*100)+'%':'—',crits:t.hits?format(t.crits/t.hits*100)+'%':'—',damage:format(t.damage/t.rounds),taken:format(t.taken/n),rounds:format(t.rounds/n,2),hp:format(t.hpLeft/n),foe:format(t.foeLeft/n)});
 const a=r?col(r.old,r.config.count):null,b=r?col(r.new,r.config.count):null;
 const metrics=r?[['Wygrane',a.wins,b.wins],['Remisy',a.draws,b.draws],['Porażki',a.losses,b.losses],['Ataki na rundę (próby)',a.attacks,b.attacks],['Celność',a.accuracy,b.accuracy],['Krytyki / trafienia',a.crits,b.crits],['Średnie obrażenia na rundę',a.damage,b.damage],['Średnie obrażenia otrzymane / walka',a.taken,b.taken],['Średnia liczba rund',a.rounds,b.rounds],['Średnie pozostałe PŻ gracza',a.hp,b.hp],['Średnie pozostałe PŻ bossa',a.foe,b.foe]]:[];
 return `<details class="combat-lab weapon-lab" ${weaponLabOpen?'open':''}><summary>⚙ Laboratorium wyposażenia · model Necro II / ASHEN (TEST)</summary>
 <div class="combat-lab-content"><p class="muted">Dwa modele porównywane w <strong>tym samym silniku Starć</strong> na identycznym przeciwniku. Wariant nowy używa tabeli 24 broni, zróżnicowanej liczby ataków, celności, przebicia i krytyków. Wariant stary zachowuje podstawowe parametry broni (1 atak), przy tej samej wybranej jakości i ulepszeniu. Prefiksy/sufiksy działają tylko w nowym modelu. Wszystko wyłącznie do testów — bez zapisu i nagród.</p>
 <div class="weapon-lab-presets"><strong>Gotowe testy porównawcze — jednakowe pozostałe ustawienia:</strong>
 <div class="weapon-lab-preset-buttons">${[['A','A · PK / pancerz 20'],['B','B · Snajper / pancerz 20'],['C','C · PK / pancerz 60'],['D','D · Snajper / pancerz 60']].map(([k,label])=>`<button type="button" data-wlab-preset="${k}">${label}</button>`).join('')}</div>
 <small>Ustawiają automatycznie: Boss etap 20, postać średnia (17), 1000 prób, jakość zwykła, Warsztat +0 (model A), prefiks brak, sufiks Egzekutora, jedna broń. Po wybraniu kliknij „Porównaj stare i nowe”.</small>
 </div>
 <div class="combat-lab-config">
 ${field('Broń', 'wlab-id',WEAPON_LAB_MODELS.map(x=>[x.id,x.name]),c.id)}
 ${field('Przeciwnik','wlab-enemy',Object.entries(COMBAT_LAB_FOES).map(([id,x])=>[id,x.label]),c.enemy)}
 ${field('Pancerz celu (testowy)','wlab-armor',[[0,'0 · brak'],[20,'20 · lekki'],[40,'40 · średni'],[60,'60 · ciężki']],c.armor)}
 ${field('Atrybuty postaci','wlab-profile',[['starter','Początkujący (8)'],['average','Średni (17)'],['veteran','Rozwinięty (30)'],['actual','Moja postać']],c.profile)}
 ${field('Próby na wariant','wlab-count',[[10,'10'],[100,'100'],[1000,'1000']],c.count)}
 ${field('Jakość','wlab-rarity',[[0,'Zwykła'],[1,'Ulepszona'],[2,'Rzadka'],[3,'Epicka'],[4,'Legendarna']],c.rarity)}
 ${field('Warsztat','wlab-upgrade',[[0,'+0'],[5,'+5']],c.upgrade)}
 ${field('Model Warsztatu','wlab-workshop',[['A','A: +20'],['B','B: +10 i +8%'],['C','C: +14%']],c.workshop)}
 ${field('Prefiks (nowy model)','wlab-prefix',[['none','Brak'],['precise','Precyzyjny'],['brutal','Brutalny'],['destructive','Niszczycielski'],['killer','Zabójczy'],['quick','Szybki'],['stable','Stabilny']],c.prefix)}
 ${field('Sufiks (nowy model)','wlab-suffix',[['none','Brak'],['hunter','Łowcy'],['sniper','Snajpera'],['berserk','Berserkera'],['executioner','Egzekutora']],c.suffix)}
 <label class="weapon-lab-dual"><input type="checkbox" id="wlab-dual" ${c.dual?'checked':''}> Dwie takie same bronie 1R (test)</label>
 <button class="primary" data-weapon-lab-run="1">▶ Porównaj stare i nowe</button></div>
 ${r?`<div class="combat-lab-outcome"><strong>${escape(r.model.name)} · ${r.config.count} prób · ${escape(r.enemy.name)} · pancerz ${r.enemy.armor}</strong></div>
 <div class="combat-lab-table-wrap"><table><thead><tr><th>Parametr</th><th>Stary model</th><th>Nowy model</th></tr></thead><tbody>${metrics.map(([name,x,y])=>`<tr><th>${escape(name)}</th><td>${escape(String(x))}</td><td>${escape(String(y))}</td></tr>`).join('')}</tbody></table></div>
 <p class="small muted">Użyto ${r.attacks[0]} / ${r.attacks[1]} ataków na rundę. Limit walki 10 rund. Testowy pancerz jest redukowany według istniejącego wzoru ASHEN z limitem 60%; w nowym modelu stosuje się punkty przebicia przed redukcją. Dla modyfikatorów poza zgodnością z klasą broni użyto wyłącznie wstępnego zestawu efektów. Pierwsza trafiona próba nie ma jeszcze specjalnego bonusu „Snajpera”.</p>`:
 '<p class="small muted">Wybierz broń i parametry, następnie uruchom porównanie. Wyniki nie zmieniają ekwipunku.</p>'}
 ${weaponBalanceHtml()}
 ${weaponKitHtml()}${weaponNormalHtml()}${weaponCandidateHtml()}${weaponStressHtml()}
 <details><summary>Lista wszystkich 24 modeli i ról</summary><div class="combat-lab-table-wrap"><table><thead><tr><th>Broń</th><th>Stare dmg / ataki</th><th>Nowe dmg / ataki</th><th>Rola</th></tr></thead><tbody>${WEAPON_LAB_MODELS.map(w=>`<tr><td>${escape(w.name)}</td><td>${w.oldMin}–${w.oldMax} / 1</td><td>${w.newMin}–${w.newMax} / ${w.attacks}</td><td>${escape(w.role)}</td></tr>`).join('')}</tbody></table></div></details>
 <p class="small muted">Eksperyment: nie zmienia prawdziwych Wypraw, Starć, Ekspedycji ani zapisów. Osobny serwerowy silnik Ekspedycji nie jest jeszcze porównywany.</p></div></details>`;
}
function arena(){
 if(!arenaChapter){const initial=arenaData();arenaChapter=Math.min(Math.ceil(ARENA_STAGES.length/10),Math.floor(initial.highest/10)+1);arenaSelected=Math.min(ARENA_STAGES.length,initial.highest+1);}
 const a=arenaData(),max=Math.min(ARENA_STAGES.length,a.highest+1),stage=ARENA_STAGES.find(s=>s.level===arenaSelected)||ARENA_STAGES[0];
 if(arenaReportOpen!==null&&!(arenaReportOpen===-1?arenaTestReport:a.history[arenaReportOpen]))arenaReportOpen=null;
 const locked=!arenaTestMode&&stage.level>max,last=a.history[0];
 const completed=a.highest===ARENA_STAGES.length;
 const chapters=[{id:1,start:1,end:10,title:'Ruiny cywilizacji',tag:'ROZDZIAŁ I'},{id:2,start:11,end:20,title:'Ziemie bezprawia',tag:'ROZDZIAŁ II'},{id:3,start:21,end:30,title:'Skażona strefa',tag:'ROZDZIAŁ III'},{id:4,start:31,end:40,title:'Martwy sektor',tag:'ROZDZIAŁ IV'},{id:5,start:41,end:50,title:'Rdzeń otchłani',tag:'ROZDZIAŁ V'}];
 const activeChapter=chapters.find(c=>c.id===arenaChapter)||chapters[0];
 const shownStages=ARENA_STAGES.filter(s=>s.level>=activeChapter.start&&s.level<=activeChapter.end);
 return section('Starcia',`<div class="arena-screen">
 <div class="arena-hero"><div><span class="tag">${activeChapter.tag.toUpperCase()} · ${activeChapter.title.toUpperCase()}</span><h3>Szlak pięćdziesięciu przeciwników</h3><p>Pięć rozdziałów po dziesięć starć, każdy przeciwnik z własnym uzbrojeniem i historią. Na poziomach 10, 20, 30, 40 i 50 czekają bossowie. Bohater walczy automatycznie — liczy się przygotowanie i sprzęt.</p></div><div class="arena-progress"><strong>${a.highest}<span>/${ARENA_STAGES.length}</span></strong><small>${completed?'WSZYSTKIE DOSTĘPNE ETAPY UKOŃCZONE':'POKONANYCH ETAPÓW'}</small><div class="arena-progress-track"><div style="width:${100*a.highest/ARENA_STAGES.length}%"></div></div></div></div>
 ${combatLabHtml()}
 ${weaponLabHtml()}
 <div class="arena-test-controls ${arenaTestMode?'is-active':''}"><div><strong>Tryb testowania Starć</strong><p>Możesz sprawdzić dowolny poziom bez wcześniejszego zwycięstwa. Test nie przyznaje nagród, nie odblokowuje etapów i nie zmienia zapisanych statystyk.</p></div><button type="button" data-arena-test-toggle="1" aria-pressed="${arenaTestMode}" class="${arenaTestMode?'primary':''}">${arenaTestMode?'✓ Tryb testowy włączony':'Włącz tryb testowy'}</button></div>
 <div class="arena-chapter-tabs" aria-label="Rozdziały Starć">${chapters.map(c=>`<button type="button" data-arena-chapter="${c.id}" class="arena-chapter-tab ${arenaChapter===c.id?'selected':''}"><span>${c.tag}</span><strong>${c.title}</strong><small>Poziomy ${c.start}–${c.end} ${a.highest>=c.end?'· ✓ ukończony':arenaTestMode?'· TEST':a.highest>=c.start-1?'· dostępny':'· zablokowany'}</small></button>`).join('')}</div><div class="arena-level-grid" aria-label="Wybór poziomu Starć">${shownStages.map(s=>{const done=s.level<=a.highest,isLocked=!arenaTestMode&&s.level>max;return `<button type="button" data-arena-select="${s.level}" class="arena-level-btn ${s.boss?'boss':''} ${done?'completed':''} ${isLocked?'locked':''} ${arenaSelected===s.level?'selected':''}" aria-pressed="${arenaSelected===s.level}" title="${escape(s.name)}">${s.boss?'♛ ':''}${s.level}${done?' ✓':isLocked?' 🔒':''}</button>`}).join('')}</div>
 <div class="arena-layout"><article class="arena-enemy-card ${stage.boss?'boss':''}"><div class="arena-portrait-wrap"><img src="${arenaArt(stage.level)}" alt="${escape(stage.name)}" loading="eager"><div class="arena-portrait-number">ETAP ${stage.level} / ${ARENA_STAGES.length} ${stage.boss?'· BOSS':''}</div></div><div class="arena-enemy-details"><span class="tag">${stage.boss?'⚔ WALKA Z BOSSEM':'PRZECIWNIK'}</span><h3>${escape(stage.name)}</h3><p class="arena-epithet">${escape(stage.epithet)}</p><p>${escape(stage.description)}</p><p class="arena-story">${escape(stage.story)}</p><div class="arena-stat-grid">${[['PŻ',stage.hp],['Atak',stage.atk.join('–')],['Celność',stage.acc],['Unik',stage.dodge],['Pancerz',stage.armor],['Próby',Number(a.attempts[stage.level])||0]].map(([name,value])=>`<div><span>${name}</span><strong>${value}</strong></div>`).join('')}</div><div class="arena-reward-preview"><strong>Nagroda za pierwsze zwycięstwo</strong><span>+${stage.reward.xp} PD · +${stage.reward.scrap} złomu · +${stage.reward.credits} kredytów${stage.boss?' · epicki przedmiot':''}</span><small>Powtórki: 25% podstawowych zasobów, bez kolejnego przedmiotu bossa.</small></div><div class="arena-enemy-actions"><button class="primary" data-arena-fight="${stage.level}" ${locked?'disabled':''}>${locked?'🔒 Pokonaj poprzedniego przeciwnika':arenaTestMode?'🧪 Testuj starcie':stage.boss?'⚔ Zmierz się z bossem':'⚔ Rozpocznij starcie'}</button>${arenaTestMode?'<span class="tag">Bez nagród i postępu</span>':stage.level<=a.highest?'<span class="tag">✓ Pokonany · można powtórzyć</span>':''}</div></div></article>
 <aside class="arena-sidebar"><div class="arena-note"><span class="tag">ZASADY STARCIA</span><h3>Przygotowanie decyduje</h3><p>Poziom Starcia jest niezależny od poziomu postaci. <strong>Każda walka trwa maksymalnie 10 rund.</strong> Zwyciężasz, gdy pokonasz przeciwnika; przegrywasz, gdy Twoje PŻ spadną do zera. <strong class="arena-draw-text">REMIS (pomarańczowy)</strong> oznacza, że po 10 rundach obie strony nadal żyją. Nie odblokowuje kolejnego etapu i nie daje nagród — warto wtedy ulepszyć broń lub zmienić wyposażenie. Porażka i remis nie niszczą wyposażenia ani nie kosztują zasobów.</p><p>Możesz wracać do ukończonych starć, aby sprawdzać inne bronie i zestawy. Raport zapisuje całkowite obrażenia, liczbę trafień, rundy i dokładny przebieg.</p><button data-page="inventory">Przygotuj wyposażenie</button></div><div class="arena-note"><span class="tag">TWOJE POSTĘPY</span><div class="arena-progress-stats"><div><span>Ukończone</span><strong>${a.highest}/${ARENA_STAGES.length}</strong></div><div><span>Wszystkie próby</span><strong>${Object.values(a.attempts).reduce((n,k)=>n+(Number(k)||0),0)}</strong></div><div><span class="good">Zwycięstwa</span><strong class="good">${Object.values(a.victories).reduce((n,k)=>n+(Number(k)||0),0)}</strong></div><div><span class="bad">Porażki</span><strong class="bad">${Object.values(a.losses).reduce((n,k)=>n+(Number(k)||0),0)}</strong></div><div><span class="arena-draw-text">Remisy</span><strong class="arena-draw-text">${Object.values(a.draws).reduce((n,k)=>n+(Number(k)||0),0)}</strong></div></div></div></aside></div>
 ${last?`<section class="arena-reports-area"><div class="arena-reports-heading"><div><span class="tag">DZIENNIK STARCIA</span><h3>Ostatnie walki</h3></div><small>Zapisane: ${a.history.length} / 40</small></div><div class="arena-report-list">${a.history.slice(0,12).map((entry,i)=>`<button class="arena-history-button" data-arena-report="${i}" title="Otwórz raport"><span class="${arenaOutcomeClass(entry)}">${arenaOutcomeSymbol(entry)} ${arenaOutcomeLabel(entry)} · Poziom ${entry.stage} · ${escape(entry.name)}</span><span>${escape(entry.at)}</span></button>`).join('')}</div></section>`:''}
 <p class="arena-future-note">Rozdziały I–V (poziomy 1–50) są już dostępne. Postęp z poprzednich wersji pozostaje zachowany, a balans nowych walk można dalej dopracowywać po testach.</p></div>${arenaReportOpen!==null?`<div class="arena-report-overlay" data-arena-overlay="1"><div class="arena-report-dialog" role="dialog" aria-modal="true" aria-label="Raport Starcia ${(arenaReportOpen===-1?arenaTestReport:a.history[arenaReportOpen]).stage}"><div class="arena-report-dialog-toolbar"><span>⚔ RAPORT STARCIA</span><button type="button" data-arena-report-close="1">✕ Wróć do Starć</button></div><div class="arena-report-dialog-scroll">${arenaBattleReport(arenaReportOpen===-1?arenaTestReport:a.history[arenaReportOpen],arenaReportOpen)}</div></div></div>`:''}`);
}

const COMPANIONS={
 dog:{name:'Pies tropiciel',desc:'Najlepszy tropiciel ukrytych skrytek. Może odnaleźć dodatkowy przedmiot na wyprawie.',icon:'🐕'},
 cat:{name:'Kot cieni',desc:'Cichy szabrownik wyszukujący złom i drobiazgi.',icon:'🐈'},
 raven:{name:'Kruk zwiadowca',desc:'Rozpoznaje teren i pomaga zdobywać doświadczenie.',icon:'🐦'},
 boar:{name:'Dzik pustkowi',desc:'Wytrzymały obrońca. Zwiększa pancerz i zdolność unikania ran.',icon:'🐗'}
};
const PET_BONUSES={dog:[12,18,25],cat:[10,15,20],raven:[8,12,16],boar:[2,4,6]};
function petPower(id=companionId()){return id&&PET_BONUSES[id]?PET_BONUSES[id][companionStage(id)]*(1+0.025*(roomLevel('sanctuary')-1))*(1+0.015*(companionLevel(id)-1)):0}
function companionStage(id=companionId()){return id?Math.max(0,Math.min(2,Number(state.companionLevels?.[id])||0)):0}
const COMPANION_MAX_LEVEL=10;
function companionXpNeed(level){return 30+Math.max(0,level-1)*20}
function companionProgress(id){return state.companionExperience?.[id]||{level:1,xp:0}}
function companionLevel(id){return Math.max(1,Math.min(COMPANION_MAX_LEVEL,Number(companionProgress(id).level)||1))}
function companionExp(id){return Math.max(0,Number(companionProgress(id).xp)||0)}
function isCompanionOwned(id){return Array.isArray(state.ownedCompanions)&&state.ownedCompanions.includes(id)}
function gainCompanionXp(amount){
 const id=companionId();if(!id||!isCompanionOwned(id))return;
 const before=companionLevel(id);let level=before,xp=companionExp(id)+Math.max(0,Math.round(amount));
 while(level<COMPANION_MAX_LEVEL&&xp>=companionXpNeed(level)){xp-=companionXpNeed(level);level++}
 if(level>=COMPANION_MAX_LEVEL)xp=0;
 state.companionExperience[id]={level,xp};
 if(level>before)message=`${COMPANIONS[id].name} osiągnął poziom ${level}!`;
}

function companionBonus(id=companionId()){
 if(!id||!PET_BONUSES[id])return '';
 const n=petPower(id),shown=Number(n.toFixed(1));
 return id==='dog'?`${shown}% szans na dodatkowy łup`:id==='cat'?`+${shown}% złomu`:id==='raven'?`+${shown}% doświadczenia`:`+${shown} pancerza i uniku`;
}
function companionArt(id,stage=companionStage(id)){
 return COMPANIONS[id]?`<img src="./assets/rosters/companion-${id}-${stage+1}.webp?v=${APP_VERSION}" alt="${COMPANIONS[id].name}, etap ${stage+1}" loading="lazy">`:'<span>🐾</span>';
}
function vehicleArt(id,stage=0){return VEHICLES.some(v=>v.id===id)?`<img src="./assets/rosters/vehicle-${id}-${id==='foot'?1:stage+1}.webp?v=${APP_VERSION}&load=${VEHICLE_ART_LOAD_TOKEN}" alt="${escape((VEHICLES.find(v=>v.id===id)||{}).name||id)}${id==='foot'?'':`, etap ${stage+1}`}" loading="lazy">`:'<span class="ashen-onfoot">🥾</span>'}
const VEHICLES=[
 {id:'foot',name:'Pieszo',level:1,credits:0,scrap:0,part:0,factor:1,icon:'🥾'},
 {id:'bike',name:'Rower szabrownika',level:5,credits:180,scrap:65,part:0,factor:.85,icon:'🚲'},
 {id:'motorbike',name:'Motocykl zwiadowcy',level:10,credits:800,scrap:180,part:30,factor:.70,icon:'🏍️'},
 {id:'buggy',name:'Buggy pustkowi',level:20,credits:2500,scrap:450,part:85,factor:.52,icon:'🚙'},
 {id:'car',name:'Samochód osobowy',level:25,credits:3800,scrap:650,part:120,factor:.46,icon:'🚗'},
 {id:'van',name:'Van / kamper',level:30,credits:5600,scrap:910,part:175,factor:.42,icon:'🚐'},
 {id:'truck',name:'Ciężarówka opancerzona',level:35,credits:8000,scrap:1300,part:230,factor:.38,icon:'🚚'}
];
function companionId(){return COMPANIONS[state.companion]?state.companion:null}
function vehicleDef(){return VEHICLES.find(v=>v.id===state.vehicle)||VEHICLES[0]}
// Najwyższy zakupiony etap pozostaje odblokowany na zawsze.
function vehicleUnlockedStage(id=vehicleDef().id){return Math.max(0,Math.min(2,Math.trunc(Number(state.vehicleUpgrades?.[id])||0)))}
// Wybrany etap decyduje o aktualnym wyglądzie i skuteczności transportu.
function vehicleStage(id=vehicleDef().id){
 const unlocked=vehicleUnlockedStage(id),chosen=state.vehicleSelectedStages?.[id];
 return chosen===undefined?unlocked:Math.max(0,Math.min(unlocked,Math.trunc(Number(chosen)||0)));
}
function selectVehicleStage(id,level){
 const v=VEHICLES.find(x=>x.id===id),n=Number(level);
 if(!v||v.id==='foot'||!state.ownedVehicles?.includes(id)||!Number.isInteger(n)||n<1||n>vehicleUnlockedStage(id)+1)return;
 if(state.mission){message='Zmiana etapu pojazdu jest niedostępna podczas wyprawy.';render();return}
 if(!state.vehicleSelectedStages||typeof state.vehicleSelectedStages!=='object')state.vehicleSelectedStages={};
 state.vehicleSelectedStages[id]=n-1;
 message=`${v.name}: ustawiono aktywny etap ${n}/${vehicleUnlockedStage(id)+1}.`;
 save();render();
}
function vehicleStageControls(id){
 if(id==='foot'||!state.ownedVehicles?.includes(id))return '';
 const max=vehicleUnlockedStage(id)+1,chosen=vehicleStage(id)+1;
 return `<div class="ashen-roster-test"><div class="small muted"><strong>AKTYWNY ETAP: ${chosen}/${max}</strong> · dostępne tylko odblokowane etapy; wybór wpływa na wygląd i szybkość pojazdu</div><div class="ashen-roster-test-buttons">${Array.from({length:max},(_,i)=>`<button type="button" data-vehicle-stage="${id}:${i+1}" class="${chosen===i+1?'is-current':''}" aria-pressed="${chosen===i+1}" ${state.mission?'disabled':''}>Etap ${i+1}</button>`).join('')}</div></div>`;
}
const VEHICLE_MODULES={engine:{name:'Silnik',desc:'Skraca czas wypraw',max:3},cargo:{name:'Ładowność',desc:'Zwiększa zdobywany złom',max:3},armor:{name:'Pancerz',desc:'Zmniejsza ryzyko obrażeń na wyprawie',max:3}};
function vehicleModuleLevel(id,key){return Math.max(0,Math.min(3,Math.trunc(Number(state.vehicleModules?.[id]?.[key])||0)))}
function activeVehicleModule(key){const id=vehicleDef().id;return id==='foot'?0:vehicleModuleLevel(id,key)}
function vehicleTimeFactor(id=vehicleDef().id){const v=VEHICLES.find(x=>x.id===id)||VEHICLES[0];return v.factor*(1-.08*vehicleStage(id))*(1-.025*(roomLevel('garage')-1))*(1-.04*(id==='foot'?0:vehicleModuleLevel(id,'engine')))}
function travelSeconds(loc){return Math.max(2,Math.ceil(loc.time*vehicleTimeFactor()))}
function vehicleModuleCost(key,level){const m=level+1;return {credits:m*(key==='armor'?430:350),scrap:m*(key==='cargo'?100:80),parts:m*(key==='engine'?30:20)}}
function upgradeVehicleModule(key){
 const v=vehicleDef();if(state.mission||v.id==='foot'||!VEHICLE_MODULES[key])return;
 if(!state.ownedVehicles.includes(v.id)){message='Najpierw zdobądź pojazd.';render();return}
 const level=activeVehicleModule(key);if(level>=3)return;
 const cost=vehicleModuleCost(key,level);
 if(state.credits<cost.credits||state.scrap<cost.scrap||getStock('czesci')<cost.parts){message='Brakuje zasobów na ulepszenie modułu.';render();return}
 if(!confirm(`Ulepszyć ${VEHICLE_MODULES[key].name.toLowerCase()} w ${v.name} na poziom ${level+1}/3?\n${cost.credits} kredytów · ${cost.scrap} złomu · ${cost.parts} części`))return;
 state.credits-=cost.credits;state.scrap-=cost.scrap;state.materials.czesci-=cost.parts;
 if(!state.vehicleModules[v.id])state.vehicleModules[v.id]={};state.vehicleModules[v.id][key]=level+1;
 message=`${v.name}: ${VEHICLE_MODULES[key].name} ${level+1}/3.`;save();render();
}
function vehicleModulesPanel(){
 const v=vehicleDef();if(v.id==='foot')return '<p class="small muted">Wybierz pojazd, aby rozbudowywać jego wyposażenie.</p>';
 return `<div class="ashen-vehicle-modules"><h3>Moduły pojazdu · ${v.name}</h3><p class="small muted">Ulepszenia są przypisane do pojazdu i pozostają zapisane po jego zmianie. Koszty pobieramy wyłącznie po potwierdzeniu.</p><div class="ashen-vehicle-module-grid">${Object.entries(VEHICLE_MODULES).map(([key,mod])=>{const level=activeVehicleModule(key),cost=vehicleModuleCost(key,level);const effect=key==='engine'?`−${level*4}% czasu`:key==='cargo'?`+${level*5}% złomu`:`+${level*2} pancerza na wyprawie`;return `<div class="ashen-vehicle-module"><strong>${mod.name} · ${level}/3</strong><p class="small muted">${mod.desc}</p><div class="premium-bonus">${effect}</div>${level>=3?'<span class="tag">MAKSIMUM</span>':`<button type="button" data-vehicle-module="${key}" ${state.mission?'disabled':''}>Ulepsz · ${cost.credits} kr. / ${cost.scrap} złomu / ${cost.parts} części</button>`}</div>`}).join('')}</div></div>`;
}
// ASHEN 0.1.54.3: swobodny podgląd testowy zwierząt i pojazdów.
// Ustawienie jest zapisywane; nie kosztuje zasobów i nie wymaga poziomu postaci.
function companionTestSelect(id){
 if(id!=='none'&&!Object.prototype.hasOwnProperty.call(COMPANIONS,id))return;
 if(id!=='none'&&!isCompanionOwned(id))state.ownedCompanions.push(id);
 state.companion=id==='none'?null:id;
 message=id==='none'?'TEST: towarzysz odłączony.':`TEST: wybrano ${COMPANIONS[id].name}, bez kosztów i wymagań.`;
 save();render();
}
let companionPreviewStages={};
function companionTestStage(id,stage){
 if(!Object.prototype.hasOwnProperty.call(COMPANIONS,id))return;
 const n=Number(stage);if(!Number.isInteger(n)||n<1||n>3)return;
 companionPreviewStages[id]=n-1;
 message=`PODGLĄD: ${COMPANIONS[id].name}, etap ${n}/3. Aktywny towarzysz i jego bonusy nie zostały zmienione.`;
 render();
}
function vehicleTestSelect(id){
 const v=VEHICLES.find(v=>v.id===id);if(!v)return;
 state.vehicle=id;
 message=`TEST: wybrano ${v.name}, bez opłat i ograniczeń.`;
 save();render();
}
function testUnlockVehicle(id){
 const v=VEHICLES.find(x=>x.id===id);if(!v||v.id==='foot')return;
 if(!Array.isArray(state.ownedVehicles))state.ownedVehicles=[];
 if(!state.ownedVehicles.includes(id))state.ownedVehicles.push(id);
 message=`TEST: odblokowano pojazd ${v.name} bez opłat. Wybierz „Aktywuj”, aby nim podróżować.`;
 save();render();
}
function companionTestControls(id){
 const stage=companionPreviewStages[id]??companionStage(id);
 return `<div class="ashen-roster-test"><div class="small muted"><strong>PODGLĄD GRAFIKI · ETAP</strong> — nie aktywuje i nie szkoli zwierzęcia</div><div class="ashen-roster-test-buttons">${[1,2,3].map(n=>`<button type="button" data-companion-test-stage="${id}:${n}" class="${stage===n-1?'is-current':''}" aria-pressed="${stage===n-1}">Etap ${n}</button>`).join('')}</div></div>`;
}
function chooseCompanion(id){
 if(!COMPANIONS[id]||state.mission)return;
 if(state.companion===id)return;
 if(isCompanionOwned(id)){
  state.companion=id;message=`Aktywny towarzysz: ${COMPANIONS[id].name}.`;save();render();return;
 }
 if(state.level<20){message='Nowe zwierzęta możesz zdobywać od poziomu 20.';render();return}
 const cost=state.ownedCompanions.length?500:0;
 if(state.credits<cost){message=`Potrzebujesz ${cost} kredytów na przygarnięcie towarzysza.`;render();return}
 if(!confirm(`Przygarnąć na stałe: ${COMPANIONS[id].name}${cost?' za '+cost+' kredytów':' bez kosztów'}?`))return;
 state.credits-=cost;state.ownedCompanions.push(id);state.companion=id;
 message=`${COMPANIONS[id].name} dołączył do Legowiska i może być wybierany w dowolnej chwili.`;
 save();render();
}
function upgradeCompanion(){
 const id=companionId(),stage=companionStage();
 if(!id||stage>=2||state.mission)return;
 const credits=(stage+1)*450,scrap=(stage+1)*120,parts=(stage+1)*20;
 if(state.credits<credits||state.scrap<scrap||getStock('czesci')<parts){message='Brakuje zasobów na szkolenie towarzysza.';render();return}
 if(!confirm(`Rozwinąć ${COMPANIONS[id].name} do etapu ${stage+2} za ${credits} kr., ${scrap} złomu i ${parts} części?`))return;
 state.credits-=credits;state.scrap-=scrap;state.materials.czesci-=parts;
 state.companionLevels[id]=stage+1;
 message=`${COMPANIONS[id].name}: osiągnięto etap ${stage+2}/3!`;
 save();render();
}
function acquireVehicle(id){
 if(state.mission)return;const v=VEHICLES.find(x=>x.id===id);if(!v)return;
 if(v.id==='foot'){state.vehicle='foot';message='Wyruszasz pieszo.';save();render();return}
 if(!Array.isArray(state.ownedVehicles))state.ownedVehicles=[];
 // Posiadany (również testowo odblokowany) pojazd można aktywować niezależnie od wymaganego poziomu.
 if(state.ownedVehicles.includes(id)){state.vehicle=id;message='Wybrano pojazd: '+v.name;save();render();return}
 if(state.level<v.level){message='Wymagany poziom: '+v.level;render();return}
 if(state.credits<v.credits||state.scrap<v.scrap||getStock('czesci')<v.part){message='Brakuje zasobów na pojazd.';render();return}
 if(!confirm('Zdobyć '+v.name+' za '+v.credits+' kredytów, '+v.scrap+' złomu i '+v.part+' części?'))return;
 state.credits-=v.credits;state.scrap-=v.scrap;state.materials['czesci']-=v.part;state.ownedVehicles.push(id);state.vehicle=id;message='Zdobyto pojazd: '+v.name+'.';save();render();
}
function upgradeVehicle(){
 if(state.mission)return;const v=vehicleDef(),lvl=vehicleUnlockedStage();if(v.id==='foot'||lvl>=2)return;
 const credits=(lvl+1)*500,parts=(lvl+1)*25,scrap=(lvl+1)*90;
 if(state.credits<credits||state.scrap<scrap||getStock('czesci')<parts){message='Brakuje zasobów na usprawnienie transportu.';render();return}
 if(!confirm('Usprawnić '+v.name+' do poziomu '+(lvl+2)+' za '+credits+' kr., '+scrap+' złomu i '+parts+' części?'))return;
 state.credits-=credits;state.scrap-=scrap;state.materials['czesci']-=parts;state.vehicleUpgrades[v.id]=lvl+1;if(!state.vehicleSelectedStages)state.vehicleSelectedStages={};state.vehicleSelectedStages[v.id]=lvl+1;message='Usprawniono pojazd. Nowy etap został aktywowany.';save();render();
}
const EXPEDITION_STORIES={
 "ruins": [
  "Przy zardzewiałej huśtawce dostrzegasz świeże ślady butów. Podążasz za nimi do klatki schodowej, gdzie za wybitym oknem ktoś urządził sobie kryjówkę.",
  "Na czwartym piętrze blokowiska skrzypi niedomknięte okno. W mieszkaniu wciąż stoi nakryty stół, ale pod obrusem leży tylko gruby kurz i wojskowy notatnik.",
  "Z piwnicy dobiega rytmiczne stukanie. Okazuje się, że wiatr porusza metalową rurą, lecz hałas zwabił już kogoś jeszcze.",
  "W dawnym sklepie spożywczym znajdujesz zapadnię przykrytą lodówką. Prowadzi do wąskiego schowka, którego właściciel nie zdążył opróżnić.",
  "Na ścianie szkoły widnieje kredowy napis: „Nie idź za światłem”. Kilka minut później dostrzegasz słaby blask w głębi sąsiedniego budynku.",
  "Z opuszczonego balkonu spada doniczka i roztrzaskuje się tuż przed tobą. To nie wiatr — na wyższych piętrach ktoś obserwuje twoją drogę.",
  "Zardzewiały tramwaj tarasuje ulicę między blokami. Przeciskasz się przez jego wnętrze, gdzie w ciemności szeleści coś większego od szczura.",
  "W osiedlowej kotłowni pracuje jeszcze stary zegar. Jego wskazówki stanęły dokładnie w godzinie, w której rozpoczął się Czarny Świt.",
  "Za zarośniętym placem zabaw znajdujesz garaż ze świeżo naprawionym zamkiem. Ktoś wrócił tu niedawno i raczej nie życzy sobie gości.",
  "W windzie martwego wieżowca dostrzegasz smugę błota. Ślad prowadzi przez otwarty szyb techniczny do pustej dyżurki dozorcy.",
  "Między dachami rozwieszono prowizoryczny most z desek. Przechodzisz ostrożnie i odkrywasz punkt obserwacyjny z widokiem na całe osiedle.",
  "Na przystanku autobusowym leży mapa miasta, na której zaznaczono czerwonym tuszem kilka piwnic. Jedna z nich znajduje się tuż obok.",
  "W zalanej pralni odnajdujesz ślady małego ogniska. Ktoś ogrzewał się tutaj podczas ostatniej burzy, pozostawiając po sobie kilka drobiazgów.",
  "Z ciemnego mieszkania rozlega się stara audycja radiowa. Gdy docierasz do środka, odbiornik milknie, a na podłodze leży rozładowany akumulator.",
  "Przy osiedlowym śmietniku zauważasz świeżo poruszone płyty chodnikowe. Pod jedną ukryto skrzynkę, lecz jej zawartość ktoś już próbował przejąć."
 ],
 "hospital": [
  "W rejestracji wciąż wiszą listy pacjentów sprzed katastrofy. Na odwrocie jednej karty ktoś narysował drogę do zamkniętego skrzydła.",
  "W korytarzu oddziału chirurgicznego migocze samotna lampa. Jej przewody prowadzą do pomieszczenia, w którym ktoś niedawno uruchomił generator.",
  "Od strony prosektorium dobiega brzęk metalowej tacy. Zatrzymujesz się za rogiem i obserwujesz ruch cieni na popękanych kafelkach.",
  "W aptece szpitalnej wszystkie półki są puste, poza jedną szafką z zabezpieczonym zamkiem. Pod nogami chrupią resztki rozbitego szkła.",
  "Na ścianie sali zabiegowej zachował się napis: „Strefa B — bez dostępu”. Ktoś wyrwał pieczęć z drzwi zaledwie kilka dni temu.",
  "W pokoju pielęgniarek znajdujesz zeszyt dyżurów. Ostatnie wpisy kończą się zdaniem: „Nie otwierać piwnicy po zmroku”.",
  "Z piwnicznej wentylacji wydobywa się chłodne powietrze. Niewielkie urządzenie wciąż działa, chociaż reszta szpitala dawno zgasła.",
  "W zrujnowanej sali dziecięcej wisi papierowy żuraw. Kiedy go podnosisz, za ścianą słychać przesuwanie ciężkich mebli.",
  "Przechodzisz przez zarośnięty dziedziniec pogotowia. W ambulansie odnajdujesz skrzynkę narzędziową, ale drzwi pojazdu nagle zatrzaskują się za tobą.",
  "W izolatce zachowały się szczelnie zamknięte szafki. Jedna z nich nosi ślady świeżego łomu i odciski zakrwawionej dłoni.",
  "Za zasłoną na końcu korytarza ktoś zbudował prowizoryczne legowisko. Obok pozostawiono kubek jeszcze pachnący gorzkimi ziołami.",
  "Na bloku operacyjnym widzisz ślady stóp prowadzące po suficie technicznym. Podążasz za nimi, zanim odgłosy ucichną.",
  "W magazynie sprzętu medycznego działa awaryjny alarm. Jego monotonny sygnał zagłusza kroki zbliżającego się nieznajomego.",
  "W starej pracowni rentgenowskiej odkrywasz kasetę z czarno-białymi zdjęciami. Jedno przedstawia coś, co nie przypomina ludzkiego szkieletu.",
  "Zamknięta winda nagle rusza o jedno piętro. Kiedy drzwi się otwierają, z kabiny wydobywa się zapach środka odkażającego i mokrej ziemi."
 ],
 "outpost": [
  "Przy głównej bramie dostrzegasz nowe ślady opon. Ktoś używał tego posterunku na długo po upadku armii.",
  "Wieża wartownicza trzeszczy pod naporem wiatru. Na górze znajdujesz lornetkę skierowaną w stronę Schronu 17.",
  "Za linią worków z piaskiem leży dziennik służby. Ostatni rozkaz nakazywał zamknąć wszystkie wyjścia, bez względu na liczbę ocalałych.",
  "W hangarze stoi pojazd pozbawiony silnika. Na jego masce ktoś wykreślił mapę pobliskich tuneli wojskowych.",
  "Starannie omijasz zardzewiałe zapory. Pod jedną z nich tkwi przewód alarmowy, najwyraźniej niedawno ponownie podłączony.",
  "Z bunkra łączności dobiegają urwane trzaski radia. W eterze ktoś powtarza trzy cyfry i prosi o natychmiastową ewakuację.",
  "W opuszczonej zbrojowni znajdujesz pustą gablotę z napisem „Prototyp”. Na posadzce widać świeże ślady przeciąganego ładunku.",
  "Na placu apelowym leży przewrócony maszt flagowy. Pod nim zakopano metalową puszkę z dokumentami opatrzonymi pieczęcią sztabu.",
  "Przed wejściem do magazynu amunicji odnajdujesz stary identyfikator. Jego właściciel figuruje jako zaginiony od ponad stu lat.",
  "Pod betonowym schronem odkrywasz korytarz techniczny. W ciemności słychać wolno obracający się wentylator i cichy stuk obcasów.",
  "W kabinie strażnika wisi tablica z nazwiskami wartowników. Wszystkie przekreślono czerwonym markerem, oprócz jednego.",
  "Przy stanowisku radarowym migocze zielona dioda. Panel pokazuje sygnał poruszający się wprost w twoim kierunku.",
  "Za zasiekami znajdujesz niewielki obóz szabrowników. Ogień już zgasł, ale popiół nadal jest ciepły.",
  "W podziemnej sali odpraw dostrzegasz ślady niedawnej walki. Pęknięta szyba zasłania mapę sektorów, których nie ma na żadnym cywilnym planie.",
  "Z betonowego silosu słychać serię krótkich uderzeń. Kiedy otwierasz właz, odkrywasz coś, czego obsługa posterunku próbowała się pozbyć."
 ]
};
function storyForExpedition(id){
 const list=EXPEDITION_STORIES[id]||EXPEDITION_STORIES.ruins;
 if(!state.lastStoryIds||typeof state.lastStoryIds!=='object')state.lastStoryIds={};
 let picked=Math.floor(Math.random()*list.length);
 if(list.length>1&&picked===state.lastStoryIds[id])picked=(picked+1+Math.floor(Math.random()*(list.length-1)))%list.length;
 state.lastStoryIds[id]=picked;
 return {text:list[picked],id:picked};
}
function reportLocId(r){return r.location?.includes('szpital')?'hospital':r.location?.includes('Posterunek')?'outpost':'ruins'}
function reportStory(r){return r.story||'Wśród ruin doszło do nieoczekiwanego spotkania. Szczegółowy zapis tej wyprawy pochodzi ze starszej wersji gry.'}
function finish(){
 let m=state.mission;if(!m||Date.now()<m.ends)return;
 let loc=locations.find(x=>x.id===m.id),enemy=loc.enemies[rand(0,loc.enemies.length-1)],result=fight(enemy,{expedition:true}),xp=result.won?rand(...loc.xp):Math.ceil(loc.xp[0]*.3),scrap=result.won?rand(...loc.scrap):0;
 xp=Math.ceil(xp*(1+0.03*(roomLevel('bedroom')-1))*(companionId()==='raven'?1+petPower('raven')/100:1));scrap=Math.ceil(scrap*(companionId()==='cat'?1+petPower('cat')/100:1)*(1+activeVehicleModule('cargo')*.05));state.xp+=xp;state.scrap+=scrap;state.battles++;if(result.won)state.wins++;
 // Znalezisko z wyprawy jest gwarantowane, również gdy starcie zakończy się porażką.
 const snapshot=m.exploration||explorationStats();
 const anomaly=rollAnomaly(loc,snapshot);
 const chance=clamp(snapshot.chance+(anomaly?.explore||0),0,95);
 const luck=clamp(snapshot.luck+(anomaly?.luck||0),0,15);
 const exploration={...snapshot,chance,luck,success:Math.random()*100<chance,rarityWeights:explorationRarityWeights(loc,luck)};
 const rolledLoot=pickLoot(loc,exploration);
 if(anomaly?.bonusLoot){for(let i=0;i<anomaly.bonusLoot;i++){
  const extra=pickLoot(loc,{...exploration,success:false},1)[0];if(extra)rolledLoot.push(extra);
 }}
 if(companionId()==='dog'&&Math.random()<petPower('dog')/100){const extra=pickLoot(loc,{...exploration,success:false},1)[0];if(extra)rolledLoot.push(extra)}
 const drops=rolledLoot.map(x=>({uid:x.uid,id:x.id,prefix:x.prefix||null,suffix:x.suffix||null,name:statsOf(x).name,rarity:statsOf(x).rarity,slot:statsOf(x).slot,details:statDetails(statsOf(x)),effects:statsOf(x).effects}));
 // Rzadkie komponenty są losowane OSOBNO od gwarantowanych 1–3 sztuk ekwipunku.
 // Podczas testów również przegrana walka może przynieść znalezisko.
 // Przetrwanie: proste znaleziska na każdej wyprawie, bez głodu i opłat pasywnych.
 // Surowce są prywatne; przekazanie frakcji wymaga osobnej decyzji gracza.
 const supplies={food:0,water:0,medical:0};
 const supplyChances={ruins:[.47,.27,.09],hospital:[.43,.41,.32],outpost:[.51,.34,.22]};
 const chances=supplyChances[loc.id]||supplyChances.ruins;
 for(const [i,key] of ['food','water','medical'].entries()){
  if(Math.random()<chances[i]){const qty=rand(1,loc.id==='outpost'?4:3);state.materials[key]=(state.materials[key]||0)+qty;supplies[key]=qty;}
 }
 const special={cores:0,schematics:0};
 if(loc.id==='outpost'){
  if(Math.random()<.08){state.cores+=1;special.cores=1;}
  if(Math.random()<.03){state.schematics+=1;special.schematics=1;}
 }
 if(anomaly?.scrap){
  const change=anomaly.scrap<0?-Math.min(state.scrap,-anomaly.scrap):anomaly.scrap;
  state.scrap+=change;scrap+=change;anomaly.scrap=change;
 }
 gainCompanionXp(result.won?({ruins:12,hospital:23,outpost:35}[loc.id]||12):5);
 let levels=levelUp();const story=storyForExpedition(loc.id);state.reports.unshift({story:story.text,storyId:story.id,at:new Date().toLocaleString('pl-PL'),location:loc.name,enemy:enemy.name,...result,xp,scrap,drops,special,supplies,exploration,anomaly,drop:drops[0]?.name||null,dropRarity:drops[0]?.rarity||null,levels});
 state.reports=state.reports.slice(0,30);state.mission=null;state.missionOutcomePending=true;
 message=''; // Pełny raport wyprawy jest już wyświetlany na ekranie Wypraw.
 save()
}
function sync(){if(!state.rooms||typeof state.rooms!=='object')state.rooms={};if(!state.roomUnlocked||typeof state.roomUnlocked!=='object')state.roomUnlocked={};for(const id of ['bedroom','storage','workshop','sanctuary','garage','infirmary']){const lv=roomLevel(id);state.rooms[id]=lv;state.roomUnlocked[id]=Math.max(lv,Math.min(5,Math.max(1,Number(state.roomUnlocked[id])||1)))}if(!state.companionLevels||typeof state.companionLevels!=='object')state.companionLevels={};
 if(state.companion==='falcon')state.companion='raven';
 if(!Array.isArray(state.ownedCompanions))state.ownedCompanions=[];
 const owned=new Set(state.ownedCompanions.filter(id=>Object.prototype.hasOwnProperty.call(COMPANIONS,id)));
 if(state.companion&&COMPANIONS[state.companion])owned.add(state.companion);
 state.ownedCompanions=Array.from(owned);
 if(!state.companionExperience||typeof state.companionExperience!=='object'||Array.isArray(state.companionExperience))state.companionExperience={};
 for(const id of Object.keys(COMPANIONS)){const old=state.companionExperience[id];if(!old)continue;
  const level=Math.max(1,Math.min(COMPANION_MAX_LEVEL,Math.trunc(Number(old.level)||1)));
  state.companionExperience[id]={level,xp:level===COMPANION_MAX_LEVEL?0:Math.max(0,Math.min(companionXpNeed(level)-1,Math.trunc(Number(old.xp)||0)))};
 }
 const oldVehicleMap={wreck:'buggy',offroad:'buggy',camper:'van'};if(oldVehicleMap[state.vehicle])state.vehicle=oldVehicleMap[state.vehicle];if(Array.isArray(state.ownedVehicles))state.ownedVehicles=[...new Set(state.ownedVehicles.map(id=>oldVehicleMap[id]||id))];if(!state.vehicle||!VEHICLES.some(v=>v.id===state.vehicle))state.vehicle='foot';if(!Array.isArray(state.ownedVehicles))state.ownedVehicles=[];state.ownedVehicles=[...new Set(state.ownedVehicles.filter(id=>VEHICLES.some(v=>v.id===id&&id!=='foot')))];if(state.vehicle!=='foot'&&!state.ownedVehicles.includes(state.vehicle))state.ownedVehicles.push(state.vehicle);if(!state.vehicleModules||typeof state.vehicleModules!=='object'||Array.isArray(state.vehicleModules))state.vehicleModules={};for(const v of VEHICLES){if(v.id==='foot')continue;const data=state.vehicleModules[v.id];state.vehicleModules[v.id]={};for(const key of Object.keys(VEHICLE_MODULES))state.vehicleModules[v.id][key]=Math.max(0,Math.min(3,Math.trunc(Number(data?.[key])||0)))}if(!state.vehicleUpgrades||typeof state.vehicleUpgrades!=='object')state.vehicleUpgrades={};for(const [legacy,current] of Object.entries(oldVehicleMap)){if(state.vehicleUpgrades[legacy]!==undefined)state.vehicleUpgrades[current]=Math.max(Number(state.vehicleUpgrades[current])||0,Number(state.vehicleUpgrades[legacy])||0)}// Migracja v0.3.9.2: stare zapisy miały tylko najwyższy kupiony etap.
 if(!state.vehicleSelectedStages||typeof state.vehicleSelectedStages!=='object'||Array.isArray(state.vehicleSelectedStages))state.vehicleSelectedStages={};
 for(const v of VEHICLES){if(v.id==='foot')continue;const max=vehicleUnlockedStage(v.id);const old=state.vehicleSelectedStages[v.id];state.vehicleSelectedStages[v.id]=old===undefined?max:Math.max(0,Math.min(max,Math.trunc(Number(old)||0)))}
 if(!companionId())state.companion=null;regen();if(state.mission&&Date.now()>=state.mission.ends)finish();save()}function bar(label,val,max,color=''){return `<div class="small muted">${label}: ${val} / ${max}</div><div class="bar ${color}"><div class="fill" style="width:${clamp(val/max*100,0,100)}%"></div></div>`}function card(title,body){return `<div class="tile"><h3>${title}</h3>${body}</div>`}function section(title,body){return `<section class="section"><h2>${title}</h2>${body}</section>`}function nav(){return[['character','♙ Postać'],['companion','🐾 Towarzysz'],['transport','🚙 Transport'],['missions','⌖ Wyprawy'],['arena','⚔ Starcia'],['pvp','⚔ PvP'],['messages','✉ Wiadomości'+(window.ASHEN_ONLINE?.unreadCount?.()?' ('+window.ASHEN_ONLINE.unreadCount()+')':'')],['clans','☷ Frakcje'],['expeditions','☠ Ekspedycje'],['players','♙ Gracze'],['inventory','▣ Ekwipunek'],['workshop','🔧 Warsztat'],['storage','⚙ Magazyn'],['reports','☷ Raporty'],['bunker','⚙ Kryjówka']].map(([k,v])=>`<button data-page="${k}" class="${page===k?'active':''}">${v}</button>`).join('')}
function home(){return `<div class="hero"><div class="sub">SEKTOR 17 · ROK 2197</div><h1>Witaj na Pustkowiach, ${escape(state.name)}</h1><p class="muted">Świat po Czarnym Świcie nie wybacza błędów. Przeszukuj ruiny, walcz o przetrwanie i zbieraj wyposażenie.</p><button class="primary" data-page="missions">Wyrusz na wyprawę →</button></div><div class="grid">${card('Postać',`<div class="value">Poziom ${state.level}</div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}`)}${card('Zasoby',`<div class="value">${state.scrap} złomu</div><p>Energia: bez limitu (testy)</p>`)}${card('Przetrwanie',`<div class="value">${state.wins}/${state.battles}</div><p>Wygrane walki / wszystkie walki</p>`)}</div><div class="divider"></div>${card('Sygnał z radiostacji',`<p>Na północ od schronu wykryto aktywność. Pierwsza wyprawa do ruin osiedla jest dostępna już teraz.</p><button data-page="missions">Sprawdź lokacje</button>`)}`}
function characterPortrait(id=state.origin,gender=state.gender){return `./assets/characters/${characterAssetBase(id,gender)}.webp`}
function characterFigure(id=state.origin,gender=state.gender){return `./assets/characters/${characterAssetBase(id,gender)}-full.png?v=${APP_VERSION}`}
function companionVisual(id){return companionArt(id)}

// Podsumowanie siły bojowej — wartości wyliczane tymi samymi regułami co walka.
function combatPanel(){
 const a=attrs(),attacks=heroAttacks(),d=heroDefense();
 const setArmor=d.setArmor,armor=d.armor,dodge=d.dodge;
 const cr=attacks.map(x=>Math.round(Math.min(.35,.05+a.per*.005+(x.weapon.critPp||0)/100)*1000)/10);
 const attackRows=attacks.map((x,i)=>{
  const w=x.weapon,style=WEAPON_STYLES[weaponStyle(w)],range=weaponDamageRange(a,w,x.power),acc=weaponAccuracy(a,w);
  return `<tr><td>${i+1}. ${escape(w.name)}<small>${escape(style.label)} · ${x.hand==='right'?'Prawa':'Lewa'} ręka · ${Math.round(x.power*100)}% mocy</small><small>Główny: ${style.main} · dodatkowy: ${style.secondary}</small></td><td>${range.low}–${range.high}<small>Atrybuty: +${range.bonus} przed mnożnikiem</small></td><td>${acc.toFixed(1).replace('.',',')} + ${w.accuracy||0}<small>Atrybuty + modyfikator broni</small></td><td>${cr[i].toFixed(1).replace('.',',')}%</td></tr>`;
 }).join('');
 const mainStyle=WEAPON_STYLES[weaponStyle(attacks[0].weapon)],mainAcc=weaponAccuracy(a,attacks[0].weapon);
 return `<section class="ashen-combat-panel" aria-label="Siła bojowa"><div class="ashen-combat-heading"><div><span class="tag">STATYSTYKI WALKI</span><h3>⚔ Siła bojowa</h3></div><span class="ashen-combat-attack-count">${attacks.length} ${attacks.length===1?'atak':'ataki'} / rundę</span></div>
 <div class="ashen-combat-grid"><div class="ashen-combat-card"><h4>ATAK</h4><div class="ashen-combat-scroll"><table class="ashen-combat-table"><thead><tr><th>Broń / specjalizacja</th><th>Obrażenia*</th><th>Celność**</th><th>Krytyk</th></tr></thead><tbody>${attackRows}</tbody></table></div>
 <div class="ashen-combat-metrics"><div><span>Celność broni głównej</span><strong>${mainAcc.toFixed(1).replace('.',',')} pkt</strong></div><div><span>Inicjatywa</span><strong>k20 + ${a.dex} ZR</strong></div><div><span>Siła krytyka</span><strong>×1,60</strong></div></div>
 <div class="ashen-combat-specialization"><strong>${escape(mainStyle.label)}</strong><span>${escape(mainStyle.desc)}</span></div>
 <p class="ashen-combat-note">* Obrażenia przed pancerzem przeciwnika. ** Celność pokazuje wynik z atrybutów i osobno premię broni; rzeczywista szansa trafienia zależy od uników wroga i wynosi 15–95%. Kolejne ataki drugą ręką lub z prefiksu „Szybki” mają obniżoną moc.</p></div>
 <div class="ashen-combat-card"><h4>OBRONA</h4><div class="ashen-combat-metrics defense"><div><span>Punkty życia</span><strong>${maxHp()}</strong></div><div><span>Pancerz łącznie</span><strong>${armor}</strong></div><div><span>Uniki</span><strong>${dodge.toFixed(1).replace('.',',')}</strong></div><div><span>Ochrona przed obrażeniami</span><strong>${Math.min(60,Math.max(0,armor))}%</strong></div><div><span>Premia pancerza z zestawów</span><strong>+${setArmor}%</strong></div><div><span>Odporność (WYT)</span><strong>${a.end}</strong></div></div><p class="ashen-combat-note">Pancerz zmniejsza otrzymane obrażenia maksymalnie o 60%. Uniki przeciwnika wpływają na skuteczność jego i Twoich trafień.</p></div></div></section>`;
}

const ATTRIBUTE_HELP={
 str:'Najważniejsza dla ciężkiej broni białej (obrażenia i celność); wspiera obrażenia lekkiej broni białej. Nie wzmacnia bezpośrednio broni palnej.',
 dex:'Zwiększa uniki o 1,1 pkt na punkt oraz inicjatywę (k20 + Zręczność). Decyduje o celności lekkiej broni białej, pomaga ciężkiej, palnej i dystansowej; zwiększa obrażenia broni białej i dystansowej niepalnej.',
 end:'Każdy punkt dodaje 10 maksymalnych punktów życia; co 4 punkty zwiększa pancerz o 1.',
 per:'Kluczowa dla broni palnej i dystansowej: zwiększa ich celność i obrażenia. Daje też 0,5 punktu procentowego szansy na trafienie krytyczne na punkt (maks. 35%).',
 int:'Obecnie służy jako atrybut wyposażenia i premii; bez bezpośredniego wpływu na aktualną symulację walki. Rozwój zdolności technicznych jest planowany.',
 cha:'Obecnie służy jako atrybut wyposażenia i premii; bez bezpośredniego wpływu na aktualną symulację walki. Handel i rozmowy są planowane.'
};
function activityConnectionsPanel(){
 const pet=companionId(),petInfo=pet?escape(COMPANIONS[pet].name)+' · '+escape(companionBonus(pet)):'Brak aktywnego zwierzęcia';
 const bedroomXp=3*Math.max(0,roomLevel('bedroom')-1);
 const vehicleSeconds=Math.round((1-vehicleTimeFactor())*100);
 const cargo=activeVehicleModule('cargo')*5;
 const extraArmor=2*activeVehicleModule('armor');
 const d=heroDefense();
 return `<details class="ashen-integration-summary" style="margin:12px 0;padding:12px 14px;border:1px solid var(--border,#4a4a4a);border-radius:10px">
 <summary style="cursor:pointer"><strong>⌁ Skąd pochodzą premie? · Wyprawy / Starcia / Ekspedycje</strong> <span class="small muted">(rozwiń)</span></summary>
 <div style="margin-top:10px;display:grid;gap:8px;font-size:.92em">
 <div><strong>Wyprawy:</strong> Sypialnia +${bedroomXp}% XP, transport −${vehicleSeconds}% czasu, ładowność +${cargo}% złomu, pancerz pojazdu +${extraArmor} podczas walki. ${petInfo}.</div>
 <div><strong>Starcia:</strong> wyposażenie, atrybuty i zestawy; obrona z tej samej funkcji co raport (${d.hp} PŻ, ${Math.round(d.armor*10)/10} pancerza, ${Math.round(d.dodge*10)/10} uniku). Transport nie pomaga.</div>
 <div><strong>Ekspedycje frakcyjne:</strong> walka rozstrzygana na Supabase na podstawie opublikowanego profilu. Dodatkowo stałe premie bazy i dobrowolne wsparcie organizatora; ich wartości sprawdzisz przy ekspedycji. Moduły pojazdu nie dodają premii bojowych do ekspedycji frakcyjnej.</div>
 <div class="small muted">To podsumowanie aktualnych źródeł premii, nie nowe bonusy. Statystyki do walk online aktualizują się po synchronizacji profilu.</div>
 </div></details>`;
}
function character(){let a=attrs();const comp=companionId()?COMPANIONS[companionId()]:null;const vehicle=vehicleDef();const travelBonus=Math.round((1-vehicleTimeFactor())*100);return section('Postać',`<div class="character-screen-modern"><div class="character-top-grid"><div class="character-figure-panel"><div class="character-figure-frame"><img src="${characterFigure(state.origin,state.gender)}" alt="Pełna sylwetka postaci – ${originTitle(state.origin,state.gender)}"></div><div class="character-figure-caption">${originTitle(state.origin,state.gender)}</div></div><div class="character-info-panel"><div class="character-heading"><div><div class="tag">OCALAŁY · POZIOM ${state.level}</div><h3>${escape(state.name)}</h3><p class="small muted">Wybrany wygląd zależy od płci i archetypu postaci. Możesz testować różne warianty na osobnych slotach.</p></div><button data-action="rename">Zmień imię</button></div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}<div class="character-meta-line"><span><strong>Płeć:</strong> ${genderLabel(state.gender)}</span><span><strong>Ręka dominująca:</strong> ${state.dominantHand==='left'?'lewa':'prawa'}</span><span><strong>Punkty atrybutów:</strong> ${state.points}</span></div><div class="actions"><button data-dominant="right" ${state.dominantHand==='right'?'disabled':''}>Prawa ręka</button><button data-dominant="left" ${state.dominantHand==='left'?'disabled':''}>Lewa ręka</button></div><div class="character-sidecards"><div class="character-sidecard"><div class="character-sidevisual ${comp?'':'placeholder'}">${comp?companionVisual(state.companion):'<div class="character-side-emoji">🐾</div>'}</div><div class="character-sidecontent"><div class="tag">AKTYWNY TOWARZYSZ</div><h4>${comp?comp.name:'Brak towarzysza'}</h4><p class="small muted">${comp?comp.desc:`Towarzysz odblokuje się na poziomie 20. Obecny poziom: ${state.level}.`}</p><p class="good small">${comp?companionBonus():'Jeszcze niedostępny'}</p><button data-page="companion">${comp?'Zmień towarzysza':'Przejdź do towarzyszy'}</button></div></div><div class="character-sidecard"><div class="character-sidevisual transport">${vehicleArt(vehicle.id,vehicleStage())}</div><div class="character-sidecontent"><div class="tag">AKTUALNY TRANSPORT</div><h4>${vehicle.name}</h4><p class="small muted">Przyspieszenie wypraw: <strong>${travelBonus}%</strong>. Usprawnienie: ${vehicleStage()+1}/3.</p><p class="good small">Silnik skraca czas; ładowność zwiększa złom, a pancerz pomaga podczas zwykłych wypraw (nie w Starciach ani PvP).</p><button data-page="transport">Zarządzaj transportem</button></div></div></div></div></div><div class="character-attr-grid">${Object.entries(attrNames).map(([k,n])=>`<div class="character-attr-card"><div class="character-attr-head"><span>${n} <details class="ashen-attr-help"><summary aria-label="Opis atrybutu ${n}" title="Co daje ${n}?">ⓘ</summary><div class="ashen-attr-help-content">${escape(ATTRIBUTE_HELP[k])}</div></details></span><strong>${a[k]}</strong></div><div class="small muted">Baza ${state.attrs[k]}${a[k]!==state.attrs[k]?` · Sprzęt i zestawy ${a[k]-state.attrs[k]>=0?'+':''}${a[k]-state.attrs[k]}`:''}</div><button data-attr="${k}" ${state.points<=0?'disabled':''}>+1</button></div>`).join('')}</div>${combatPanel()}${activityConnectionsPanel()}${characterSetsPanel()}${accessorySetPanel()}${setPlannerPanel()}${resonancePanel()}</div>`)}
function companion(){
 const selected=companionId(),active=selected?COMPANIONS[selected]:null;
 const owned=state.ownedCompanions||[];
 const stage=selected?companionStage(selected):0,level=selected?companionLevel(selected):1,xp=selected?companionExp(selected):0;
 return section('Towarzysz',`<div class="ashen-premium-screen"><div class="premium-hero"><div class="tag">SCHRON 17 · LEGOWISKO TOWARZYSZY</div><h3>Towarzysze Pustkowi</h3><p>Kolekcjonuj wszystkie cztery gatunki, rozwijaj każdego oddzielnie i wybieraj jednego aktywnego. Tylko aktywny towarzysz zapewnia bonusy i zdobywa doświadczenie podczas zwykłych wypraw.</p></div>
 <div class="premium-active"><div class="premium-active-picture">${active?companionArt(selected):'<span>🐾</span>'}</div><div class="premium-active-copy"><div class="tag">AKTYWNY TOWARZYSZ</div><h3>${active?active.name:'Brak aktywnego zwierzęcia'}</h3><p class="muted">${active?active.desc:'Przygarnij zwierzę lub wybierz je z kolekcji.'}</p><div class="premium-active-bonus">${active?`Etap treningu ${stage+1}/3 · Poziom ${level}/${COMPANION_MAX_LEVEL} · ${companionBonus()}`:'Bonusy zwierząt są nieaktywne'}</div>${active?`<div class="ashen-pet-xp">Doświadczenie: ${level>=COMPANION_MAX_LEVEL?'MAX':`${xp} / ${companionXpNeed(level)}`}<div class="ashen-pet-xp-track"><span style="width:${level>=COMPANION_MAX_LEVEL?100:Math.min(100,Math.round(xp/companionXpNeed(level)*100))}%"></span></div></div>`:''}</div>${active&&stage<2?`<button data-companion-upgrade ${state.mission?'disabled':''} class="primary">Rozwiń etap ${stage+2}<span class="premium-btn-sub">${(stage+1)*450} kr. · ${(stage+1)*120} złomu · ${(stage+1)*20} części</span></button>`:'<button data-page="bunker" class="premium-outline">Zobacz Legowisko</button>'}</div>
 <div class="ashen-roster-test-banner"><span>PODGLĄD · Przyciski „Etap 1–3” pokazują tylko grafikę i nie zmieniają aktywnego zwierzęcia. Do wyboru służy „Aktywuj”.</span><button type="button" data-companion-test-select="none" ${selected?'':'disabled'}>Odłącz aktywnego</button></div>
 <div class="premium-section-title"><h3>Twoja kolekcja</h3><span>${owned.length} / ${Object.keys(COMPANIONS).length} gatunków · jeden aktywny</span></div>
 <div class="premium-choices companions">${Object.entries(COMPANIONS).map(([id,c])=>{const has=isCompanionOwned(id),chosen=selected===id,pl=companionLevel(id),petXp=companionExp(id);return `<article class="premium-choice ${chosen?'is-selected':''}"><div class="premium-choice-image">${companionArt(id,companionPreviewStages[id]??companionStage(id))}</div><div class="premium-choice-body"><h3>${c.name}</h3><p>${c.desc}</p><div class="premium-bonus">${has?`Poziom ${pl}/${COMPANION_MAX_LEVEL} · Etap ${companionStage(id)+1}/3 · ${companionBonus(id)}`:'Nieodkryty · dostępny do przygarnięcia'}</div>${has?`<p class="small muted">EXP zwierzęcia: ${pl>=COMPANION_MAX_LEVEL?'MAX':`${petXp}/${companionXpNeed(pl)}`}</p>`:''}${companionTestControls(id)}<div class="premium-foot"><button data-companion="${id}" ${chosen||state.mission||(!has&&state.level<20)?'disabled':''} class="${chosen?'premium-outline':'primary'}">${chosen?'✓ Aktywny':has?'Aktywuj':state.level<20?'Od poziomu 20':`Przygarnij${owned.length?' · 500 kr.':' · za darmo'}`}</button></div></div></article>`}).join('')}</div><p class="small muted">Bonus Legowiska wzmacnia działanie aktywnego zwierzęcia. Poziom towarzysza rośnie od 1 do 10 dzięki zwykłym wyprawom; za każdy poziom otrzymuje +1,5% skuteczności swojego dotychczasowego bonusu. Etapy treningu 1–3 pozostają osobnym systemem.</p></div>`)
}
function transport(){
 const current=vehicleDef(),stage=vehicleStage(),bonus=Math.round((1-vehicleTimeFactor())*100),ownedVehicles=state.ownedVehicles||[];
 return section('Transport',`<div class="ashen-premium-screen"><div class="premium-hero"><div class="tag">SCHRON 17 · GARAŻ</div><h3>Pojazdy Pustkowi</h3><p>Wszystkie zdobyte pojazdy zostają w Garażu. Jeden aktywny transport skraca czas wypraw, a jego silnik, ładowność i pancerz rozwijasz osobno.</p></div>
 <div class="premium-active"><div class="premium-active-picture premium-vehicle-visual">${vehicleArt(current.id,stage)}</div><div class="premium-active-copy"><div class="tag">AKTYWNY POJAZD</div><h3>${current.name}</h3><p class="muted">Skrócenie czasu wypraw: <strong>${bonus}%</strong> · ${current.id==='foot'?'Bez ulepszeń':`Etap pojazdu: <strong>${stage+1}/3</strong>`}</p><div class="premium-active-bonus">${current.id==='foot'?'Podróżujesz pieszo':`Silnik ${activeVehicleModule('engine')}/3 · Ładowność ${activeVehicleModule('cargo')}/3 · Pancerz ${activeVehicleModule('armor')}/3`}</div></div>${current.id!=='foot'&&vehicleUnlockedStage()<2?`<button data-vehicle-upgrade ${state.mission?'disabled':''} class="primary">Rozwiń etap pojazdu ${vehicleUnlockedStage()+2}/3<span class="premium-btn-sub">${(vehicleUnlockedStage()+1)*500} kr. · ${(vehicleUnlockedStage()+1)*90} złomu · ${(vehicleUnlockedStage()+1)*25} części</span></button>`:'<button data-page="bunker" class="premium-outline">Zobacz Garaż</button>'}</div>
 ${vehicleModulesPanel()}
 <div class="ashen-roster-test-banner">Kupione etapy pojazdów pozostają odblokowane. Możesz wybrać dowolny zdobyty etap — również niższy. Wygląd, przyspieszenie wypraw i karta Postaci pokażą aktywny etap. TEST: odblokowanie pojazdu jest bezpłatne; potem naciśnij „Aktywuj”.</div>
 <div class="premium-section-title"><h3>Twoja kolekcja pojazdów</h3><span>${ownedVehicles.length} / ${VEHICLES.length-1} zdobytych · jeden aktywny</span></div>
 <div class="premium-choices vehicles">${VEHICLES.map(v=>{const owned=v.id==='foot'||ownedVehicles.includes(v.id),selected=v.id===current.id,st=vehicleStage(v.id);return `<article class="premium-choice ${selected?'is-selected':''}"><div class="premium-choice-image premium-vehicle-visual">${vehicleArt(v.id,st)}</div><div class="premium-choice-body"><h3>${v.name}</h3><p>Wymagany poziom: ${v.level} · ${owned?'W garażu':'Nieposiadany'}</p><div class="premium-bonus">${v.id==='foot'?'Podróż bez pojazdu':`Podstawowo −${Math.round((1-v.factor)*100)}% czasu · aktywny etap ${st+1}/${vehicleUnlockedStage(v.id)+1}`}</div>${vehicleStageControls(v.id)}<div class="premium-price">${owned?'Gotowy do użycia':`${v.credits.toLocaleString('pl-PL')} kr. · ${v.scrap} złomu · ${v.part} części`}</div><div class="premium-foot"><button data-vehicle="${v.id}" ${selected||state.mission||(!owned&&state.level<v.level)?'disabled':''} class="${selected?'premium-outline':'primary'}">${selected?'✓ Aktywny':owned?'Aktywuj':state.level<v.level?'Od poziomu '+v.level:'Zdobądź'}</button>${!owned&&v.id!=='foot'?`<button type="button" data-vehicle-test-unlock="${v.id}">TEST · Odblokuj</button>`:''}</div></div></article>`}).join('')}</div><p class="small muted">Wybór etapu jest dostępny wyłącznie dla wykupionych poziomów. Wybrany etap wpływa na wygląd i faktyczną szybkość pojazdu; wyższe etapy pozostają odblokowane. Silnik: −4% czasu za poziom; ładowność: +5% złomu za poziom; pancerz: +2 pancerza w walce podczas zwykłej wyprawy za poziom. Moduły nie działają w PvP i Starciach. Paliwo, zużycie i naprawy dodamy później.</p></div>`);
}
function missionImage(id){return `./assets/missions/${id}.webp?v=${APP_VERSION}`}
function missionFlavor(id){return ({ruins:'Ciche bloki i zarośnięte podwórza, gdzie każdy ruch może ściągnąć szabrowników.',hospital:'Zrujnowany kompleks medyczny pełen ciemnych korytarzy i niepokojącej ciszy.',outpost:'Porzucona placówka wojskowa z ciężkimi bramami, umocnieniami i śladami dawnych walk.'})[id]||'Nieznana lokacja.'}
function missionDifficultyMeta(loc){return loc.id==='ruins'?{label:'Niska',cls:'low'}:loc.id==='hospital'?{label:'Średnia',cls:'mid'}:{label:'Wysoka',cls:'high'}}
function missionDurationLabel(loc){return ({ruins:'ok. 1 h',hospital:'ok. 2 h',outpost:'ok. 4 h'})[loc.id]||(`${travelSeconds(loc)} s`)}
function missionSidebarImage(){return missionImage(state.reports[0]?.location?.includes('szpital')?'hospital':state.reports[0]?.location?.includes('Posterunek')?'outpost':'outpost')}
let missionExpand={report:false,loot:false};
function lootDetailButton(x,withImage=true){
 const owned=x.uid&&instance(x.uid);
 const catalog=!owned&&x.id&&item(x.id);
 if(!owned&&!catalog)return `<span class="loot-static-icon">${withImage?itemIcon(x,'sm'):''}</span>`;
 const key=owned?`data-item-open="${escape(owned.uid)}"`:`data-item-catalog="${escape(x.id)}"`;
 return `<button type="button" class="loot-open-icon" ${key} aria-label="Otwórz szczegóły: ${escape(x.name||item(x.id)?.name||'przedmiot')}">${withImage?itemIcon(owned||item(x.id),'sm'):''}</button>`;
}
function lootAffixBadges(x){
 // Wykorzystujemy migawkę wyprawy: przedmiot mógł być później sprzedany.
 const owned=x?.uid&&instance(x.uid);
 const d=(owned&&def(owned))||(x?.id&&item(x.id));
 if(!d)return '';
 const snap=x?.prefix||x?.suffix?x:owned;
 if(snap?.prefix||snap?.suffix){
  const pref=findModifier(prefixDefs,snap.prefix),suf=findModifier(suffixDefs,snap.suffix);
  return `<span class="ashen-mod-badges loot-affix-badges">${pref?modifierGlyph('prefix',d,pref):''}${suf?modifierGlyph('suffix',d,suf):''}</span>`;
 }
 // Raport sprzed wersji zapisującej identyfikatory modyfikatorów.
 if(Array.isArray(x?.effects)&&x.effects.length){
  return `<span class="ashen-mod-badges loot-affix-badges">${x.effects.slice(0,2).map((e,i)=>{
   const kind=i===0?'prefix':'suffix';
   const fallback=String(e.name||'');
   const guess=(i===0?prefixDefs:suffixDefs).find(z=>z.name===fallback||prefixLabel(z,d)===fallback);
   if(guess)return modifierGlyph(kind,d,guess);
   const text=(i?'Sufiks':'Prefiks')+': '+fallback+' — '+String(e.description||'');
   return `<span class="ashen-mod-icon ${kind}" tabindex="0" role="img" title="${escape(text)}" aria-label="${escape(text)}">${i?'✦':'◆'}<span class="ashen-mod-tooltip">${escape(text)}</span></span>`;
  }).join('')}</span>`;
 }
 return '';
}
function lootDetailName(x){
 const owned=x.uid&&instance(x.uid);
 const catalog=!owned&&x.id&&item(x.id);
 const color=rarities.find(q=>q.name===x.rarity)?.color||'#e8dccb';
 const name=escape(x.name||item(x.id)?.name||'Przedmiot');
 return owned||catalog?`<button class="loot-open-name" style="color:${color}" ${owned?`data-item-open="${escape(owned.uid)}"`:`data-item-catalog="${escape(x.id)}"`}>${name}</button>`:`<strong style="color:${color}">${name}</strong>`;
}
function missionLootDetails(r){
 const ds=r.drops||(r.drop?[{name:r.drop,rarity:r.dropRarity}]:[]);
 return `<div class="mission-loot-grid">${ds.map(x=>`<div class="mission-loot-item">${lootDetailButton(x)}<div class="grow">${lootDetailName(x)}${lootAffixBadges(x)}<div class="small muted">${escape(x.rarity||'Znaleziony przedmiot')}</div><details class="mission-loot-more"><summary>Parametry przedmiotu</summary><p>${escape(x.details||'Brak zapisanych parametrów')}</p>${(x.effects||[]).map(e=>`<p>${escape(e.name)}: ${escape(e.description)}</p>`).join('')}</details></div></div>`).join('')||'<p>Brak zapisanych przedmiotów.</p>'}</div>${specialLoot(r)}`;
}
function missionStoryBody(r){
 return `<p class="mission-story-copy">${escape(reportStory(r))}</p><p class="mission-story-result">${r.won?'Po niebezpiecznym starciu z przeciwnikiem udaje ci się oczyścić drogę i bezpiecznie wrócić do schronu.':'Starcie kończy się odwrotem, ale nie opuszczasz lokacji z pustymi rękami.'}</p>`;
}
function missionReportDetail(r){return `<div class="mission-inline-report">${missionStoryBody(r)}<div class="mission-report-meta"><span>⚔ ${escape(r.enemy||'Nieznany przeciwnik')}</span><span>⭐ ${r.xp||0} PD</span><span>⚙ ${r.scrap||0} złomu</span></div>${damageReportPanel(r)}${anomalyReportPanel(r)}${explorationReportPanel(r)}<h4>Przebieg walki</h4><div class="mission-battle-lines">${(r.lines||[]).map(line=>`<p>${escape(line)}</p>`).join('')||'<p>Brak szczegółowego raportu z wcześniejszej wersji.</p>'}</div></div>`}
function missionInstantResult(){
 const r=state.reports[0];if(!r||!state.missionOutcomePending)return '';
 return `<div class="mission-result-now" id="mission-result-now"><div class="mission-result-head"><div><span class="mission-result-eyebrow">RAPORT Z PUSTKOWI · ŚWIEŻY POWRÓT</span><h2>${r.won?'Powrót ze zwycięstwem':'Powrót po ciężkiej walce'}</h2><p>${escape(r.location.replace(/^.*—\s*/,''))} · ${escape(r.at)}</p></div><button data-action="mission-dismiss-result" aria-label="Zamknij raport z wyprawy">✕ Zamknij</button></div><div class="mission-result-columns"><div><h3>Historia wyprawy</h3>${missionStoryBody(r)}<div class="mission-report-meta"><span>⚔ ${escape(r.enemy||'Nieznany wróg')}</span><span>⭐ +${r.xp||0} PD</span><span>⚙ +${r.scrap||0} złomu</span></div>${damageReportPanel(r)}${anomalyReportPanel(r)}${explorationReportPanel(r)}</div><div><h3>Zdobyte łupy</h3>${missionLootDetails(r)}</div></div></div>`;
}
function lastMissionCard(){
 const r=state.reports[0];if(!r)return `<div class="mission-empty">Nie masz jeszcze ukończonej wyprawy. Wyrusz po pierwszy raport z Pustkowi.</div>`;
 const img=missionImage(reportLocId(r));
 return `<div class="mission-latest-card"><img src="${img}" alt="${escape(r.location)}"><div class="mission-latest-copy"><h4>${escape(r.location.replace(/^.*—\s*/,''))}</h4><div class="state">${r.won?'✔ Zwycięstwo':'↩ Powrót'}</div><div class="minirow"><span>🗓 ${escape(r.at)}</span><span>⭐ +${r.xp||0} PD</span><span>⚙ +${r.scrap||0} złomu</span></div></div><div class="mission-latest-actions"><button data-mission-detail="report" aria-expanded="${missionExpand.report}">📜 ${missionExpand.report?'Zwiń raport':'Zobacz raport'}</button><button data-mission-detail="loot" aria-expanded="${missionExpand.loot}">🎒 ${missionExpand.loot?'Zwiń łupy':'Zobacz łupy'}</button></div></div>${missionExpand.report?`<div class="mission-inline-section"><h4>Raport wyprawy</h4>${missionReportDetail(r)}</div>`:''}${missionExpand.loot?`<div class="mission-inline-section"><h4>Zdobyte łupy</h4>${missionLootDetails(r)}</div>`:''}`;
}

function resourceBar(){return `<div class="mission-topbar ashen-global-resources">${[
 {icon:'credits',label:'Kredyty',value:state.credits.toLocaleString('pl-PL')},
 {icon:'scrap',label:'Złom',value:state.scrap.toLocaleString('pl-PL')},
 {icon:'fabric',label:'Tkanina',value:getStock('tkanina').toLocaleString('pl-PL')},
 {icon:'polymer',label:'Chemikalia',value:getStock('tworzywo').toLocaleString('pl-PL')},
 {icon:'electronics',label:'Elektronika',value:getStock('elektronika').toLocaleString('pl-PL')},
 {icon:'parts',label:'Części',value:getStock('czesci').toLocaleString('pl-PL')}
].map(r=>`<div class="mission-resource"><div class="ico"><img src="./assets/ui/resources/${r.icon}.webp" alt="" loading="eager"></div><div class="resource-copy"><div class="lab">${r.label}</div><div class="num">${r.value}</div></div></div>`).join('')}</div>`}
function missions(){return `<section class="section mission-screen"><div class="ashen-explore-overview"><strong>⌖ Eksploracja:</strong> ${explorationStats().chance}% szansy na dodatkowy przedmiot <span>✧ Szczęście: +${explorationStats().luck}</span><details><summary>Jak to działa?</summary><p>Percepcja i Inteligencja zwiększają skuteczność poszukiwań, Zręczność pomaga w terenie. Szczęście zapewniają wybrane założone akcesoria i artefakty oraz pełne zestawy rezonansowe; poprawia ono rzadkość łupów, nie przekraczając limitu danej wyprawy. Podczas wyprawy może również pojawić się anomalia, której wpływ znajdziesz w raporcie.</p>${explorationStats().sources.length?`<p>Źródła Szczęścia: ${explorationStats().sources.map(q=>escape(q.name)+" +"+q.value).join(', ')}</p>`:''}</details></div>${missionInstantResult()}<div class="mission-board"><div class="mission-stage"><div class="mission-title"><h2>Wybierz wyprawę</h2></div>${state.mission?`<div class="mission-active-strip" role="status"><div class="mission-active-main"><div><span class="mission-active-label">⌛ TRWA WYPRAWA</span><strong>${escape(locations.find(l=>l.id===state.mission.id)?.name||'Nieznana lokacja')}</strong></div><div class="mission-active-time">Pozostało <strong id="countdown">${Math.max(0,Math.ceil((state.mission.ends-Date.now())/1000))} s</strong></div></div><div class="mission-active-track"><div id="mission-progress-fill" style="width:${Math.max(0,Math.min(100,100*(1-(state.mission.ends-Date.now())/(state.mission.durationMs||travelSeconds(locations.find(l=>l.id===state.mission.id)||locations[0])*1000))))}%"></div></div></div>`:''}<div class="mission-grid">${locations.map(l=>{const diff=missionDifficultyMeta(l);return `<article class="mission-card"><img src="${missionImage(l.id)}" alt="${escape(l.name)}"><div class="mission-card-body"><h3>${escape(l.name.replace(/^.*—\s*/,''))}</h3><p class="flavor">${missionFlavor(l.id)}</p><div class="mission-difficulty"><div class="mission-bars ${diff.cls}"><span></span><span></span><span></span></div><span>Trudność: <strong>${diff.label}</strong></span></div><div class="mission-facts"><div class="line"><span>Poziom zalecany</span><strong>${l.level}+</strong></div><div class="line"><span>Powrót za</span><strong>${travelSeconds(l)} s</strong></div></div><div class="mission-rarity-info"><span>Jakość znalezisk (z Twoim Szczęściem)</span><div>${explorationRarityWeights(l,explorationStats().luck).map((w,i)=>w?`${rarities[i].name} ${w}%`:null).filter(Boolean).join(" · ")}</div></div><div class="ashen-anomaly-odds">◈ Ryzyko zjawiska: <strong>${ANOMALY_FREQUENCY[l.id]}%</strong></div><div class="ashen-explore-card">⌖ Szansa dodatkowego łupu: <strong>${explorationStats().chance}%</strong> · Szczęście: <strong>+${explorationStats().luck}</strong></div><button class="primary" data-mission="${l.id}" ${state.mission?'disabled':''}>Wyrusz</button>${state.level<l.level?'<div class="mission-locked">Ryzykowna wyprawa dla twojej postaci.</div>':''}</div></article>`}).join('')}</div><p class="mission-note small">Szczęście wpływa na jakość łupów wyłącznie w ramach poziomów dostępnych w danej lokacji. Udany test eksploracji daje jeden dodatkowy przedmiot. Anomalie mogą wpłynąć na poszukiwania i nagrody; wszystko zapisuje się w raporcie.</p></div><aside class="mission-sideart"><img src="${missionSidebarImage()}" alt="Pustkowia ASHEN"><div class="caption"><strong>Pustkowia czekają</strong><div class="small">Każda wyprawa to nowa opowieść. Przetrwają tylko przygotowani.</div></div></aside></div><div class="mission-latest"><h3>Ostatnia wyprawa</h3>${lastMissionCard()}</div></section>`}
function itemFamily(d){if(!d)return 'empty';const id=d.id||'';if(d.slot==='material')return 'material';if(d.slot==='shirt')return 'shirt';if(d.slot==='outer')return id==='coat'?'coat':'outer';if(d.slot==='pants')return 'pants';if(d.slot==='boots')return 'boots';if(d.slot==='head'){if(id==='hood')return 'hood';if(id.includes('helm')||id==='helmet'||id==='cap')return 'head';return 'head';}if(d.slot==='hands'){if(id.includes('bracer'))return 'bracer';return 'gloves';}if(d.slot==='extra'){if(d.artifact)return 'extra';if(id.includes('goggle')||id.includes('glasses'))return 'goggles';if(id==='scarf'||id==='neckwarmer'||id==='bandana')return 'neck';if(id==='radio')return 'radio';if(id==='scope')return 'scope';if(id==='injector')return 'injector';if(id==='badge')return 'badge';if(id==='module')return 'module';if(id==='compass')return 'compass';if(id==='bracelet')return 'bracelet';return 'extra';}if(d.slot==='hand1'){if(['knife','machete','saber','cleaver'].includes(id))return 'blade';if(['hatchet'].includes(id))return 'axe';if(['pistol','revolver','deserteagle','smg'].includes(id))return 'pistol';if(['pipe','wrench','baton'].includes(id))return 'club';return 'hand1';}if(d.slot==='hand2'){if(['shotgun','rifle','carbine','sniper','lmg','harpoon'].includes(id))return 'rifle';if(['crossbow'].includes(id))return 'crossbow';if(['flame'].includes(id))return 'flame';if(['rail'].includes(id))return 'rail';if(['crowbar','sledge','hammer'].includes(id))return 'heavy';return 'hand2';}return d.slot||'generic'}
function slotPlaceholder(slot){return ({head:'head',extra:'extra',extra2:'extra',extra3:'extra',right:'hand1',left:'hand1',hands:'gloves',shirt:'shirt',outer:'outer',pants:'pants',boots:'boots'})[slot]||'empty'}
function svgIcon(kind,color){const bg='#11171b',accent=color||'#9ba7ad';const start=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="62" height="62" rx="12" fill="${bg}" stroke="${accent}" stroke-width="1.6"/>`;const end='</svg>';const c=accent;
const map={blade:`<path d="M16 45 L28 33 L31 36 L20 48 Z" fill="${c}"/><path d="M27 32 L45 12 L52 19 L34 39 Z" fill="#d8d7d2" stroke="${c}" stroke-width="1"/><circle cx="30" cy="39" r="2.4" fill="#7b4b2d"/>`,axe:`<path d="M31 12 h4 v36 h-4z" fill="#8b6a43"/><path d="M35 18 q15 4 15 14 q-8 7-18 6 z" fill="${c}"/><path d="M29 24 q-10 2-13 9 q4 7 13 8 z" fill="#6c757c"/>`,pistol:`<path d="M16 28 h26 v8 h-10 l-4 8 h-8 l4-8 h-8 z" fill="${c}"/><rect x="39" y="24" width="10" height="6" rx="2" fill="#76828a"/>`,club:`<path d="M22 16 q10 -4 17 2 q4 5 -2 10 l-2 2 l8 18 l-6 2 l-8-18 l-4 1 q-8 1-11-5 q-2-6 8-12 z" fill="${c}"/>`,rifle:`<path d="M8 33 h38 v5 h-38 z" fill="${c}"/><path d="M24 26 h13 v6 h-13 z" fill="#89959d"/><path d="M37 35 l12 7 l3-3 l-7-7 z" fill="#77553a"/><path d="M16 38 l-3 10 h5 l3-10 z" fill="#6e767c"/>`,crossbow:`<path d="M12 31 q8-12 20-12 q12 0 20 12" fill="none" stroke="${c}" stroke-width="4"/><path d="M32 20 v24" stroke="#d8d7d2" stroke-width="3"/><path d="M24 44 h16" stroke="#8b6a43" stroke-width="4"/>`,flame:`<rect x="18" y="28" width="24" height="10" rx="3" fill="#78838a"/><path d="M44 30 q8 2 10 8 q-4 2-9 1 z" fill="#f59e0b"/><path d="M47 28 q7 2 8 7 q-4 1-7 0 z" fill="#ef4444"/><rect x="14" y="24" width="8" height="18" rx="3" fill="${c}"/>`,rail:`<rect x="12" y="27" width="34" height="10" rx="4" fill="${c}"/><rect x="21" y="22" width="16" height="4" rx="2" fill="#83d0ff"/><path d="M46 29 h9 v6 h-9z" fill="#bfc8cd"/><circle cx="18" cy="32" r="3" fill="#83d0ff"/>`,heavy:`<rect x="29" y="11" width="6" height="38" fill="#8a6940"/><path d="M19 14 h26 v13 h-26 z" fill="${c}"/><path d="M17 25 h30 v4 h-30 z" fill="#788188"/>`,shirt:`<path d="M20 15 l8 5 h8 l8-5 l8 10 l-6 5 v20 h-28 v-20 l-6-5 z" fill="${c}"/>`,outer:`<path d="M17 12 l10 5 h10 l10-5 l7 9 l-7 9 v20 h-30 v-20 l-7-9 z" fill="${c}"/><path d="M32 17 v33" stroke="#10161a" stroke-width="2"/>`,coat:`<path d="M20 10 l12 6 l12-6 l8 12 l-8 7 v22 l-12-7 l-12 7 v-22 l-8-7 z" fill="${c}"/><path d="M32 16 v31" stroke="#10161a" stroke-width="2"/>`,pants:`<path d="M21 14 h22 l-2 16 l5 20 h-10 l-4-15 l-4 15 h-10 l5-20 z" fill="${c}"/>`,boots:`<path d="M18 20 h11 v17 l6 7 h11 v6 h-26 l-6-7 z" fill="${c}"/><path d="M35 24 h11 v13 l4 7 h-15 z" fill="#6f7a82"/>`,head:`<path d="M20 18 q12-12 24 0 v8 q0 8-6 14 l-3 10 h-6 l-3-10 q-6-6-6-14 z" fill="${c}"/>`,hood:`<path d="M18 16 q14-16 28 0 v12 q0 8-6 14 h-16 q-6-6-6-14 z" fill="${c}"/><circle cx="32" cy="29" r="7" fill="#12171a"/>`,gloves:`<path d="M19 17 q4 0 4 4 v8 h2 v-10 q0-3 3-3 q3 0 3 3 v10 h2 v-9 q0-3 3-3 q3 0 3 3 v9 h2 v-7 q0-3 3-3 q3 0 3 3 v15 q0 7-7 11 h-18 q-7-3-7-10 v-10 q0-4 4-4 z" fill="${c}"/>`,bracer:`<path d="M17 18 l13 4 l-4 26 l-13-4 z" fill="${c}"/><path d="M34 22 l13 4 l-4 26 l-13-4 z" fill="#7c858b"/>`,goggles:`<rect x="12" y="26" width="18" height="12" rx="5" fill="${c}"/><rect x="34" y="26" width="18" height="12" rx="5" fill="${c}"/><path d="M30 31 h4" stroke="#95d7ff" stroke-width="3"/><path d="M10 32 h4 M50 32 h4" stroke="#78828a" stroke-width="3"/>`,neck:`<path d="M16 22 q16 10 32 0 v8 q-9 6-9 15 h-14 q0-9-9-15 z" fill="${c}"/>`,compass:`<circle cx="32" cy="32" r="16" fill="${c}"/><circle cx="32" cy="32" r="11" fill="#14191d"/><path d="M32 21 l4 11 l-4 11 l-4-11 z" fill="#e7e8ea"/><path d="M32 21 l4 11 l-4 0 z" fill="#ef4444"/>`,bracelet:`<circle cx="32" cy="32" r="13" fill="none" stroke="${c}" stroke-width="8"/><circle cx="32" cy="32" r="5" fill="#11171b"/>`,radio:`<rect x="20" y="18" width="24" height="30" rx="4" fill="${c}"/><rect x="25" y="23" width="14" height="9" rx="2" fill="#1d2a31"/><circle cx="28" cy="39" r="3" fill="#0e1418"/><circle cx="37" cy="39" r="3" fill="#0e1418"/><path d="M44 20 l5-8" stroke="#bfc8cd" stroke-width="2"/>`,scope:`<rect x="14" y="29" width="36" height="8" rx="4" fill="${c}"/><circle cx="19" cy="33" r="8" fill="none" stroke="#d8d7d2" stroke-width="3"/><circle cx="45" cy="33" r="5" fill="#95d7ff"/>`,injector:`<rect x="18" y="28" width="20" height="8" rx="4" fill="${c}"/><path d="M38 30 l10-10 l4 4 l-10 10 z" fill="#d8d7d2"/><path d="M14 30 h8" stroke="#78828a" stroke-width="3"/>`,badge:`<path d="M32 14 l6 8 l10 2 l-5 8 l2 10 l-10-3 l-10 3 l2-10 l-5-8 l10-2 z" fill="${c}"/>`,module:`<rect x="16" y="16" width="32" height="32" rx="6" fill="${c}"/><rect x="24" y="24" width="16" height="16" rx="3" fill="#11171b"/><path d="M12 24 h6 M12 32 h6 M12 40 h6 M46 24 h6 M46 32 h6 M46 40 h6" stroke="#89c9ff" stroke-width="2"/>`,material:`<path d="M16 34 l12-18 h20 l8 12 l-10 20 h-24 z" fill="${c}"/><path d="M25 22 h10 v8 h-10z" fill="#11171b"/>`,extra:`<circle cx="32" cy="32" r="15" fill="${c}"/><circle cx="32" cy="32" r="6" fill="#11171b"/>`,hand1:`<path d="M20 42 l24-20 l4 4 l-24 20 z" fill="${c}"/>`,hand2:`<path d="M10 32 h40 v4 h-40 z" fill="${c}"/>`,empty:`<path d="M20 20 h24 v24 h-24z" fill="none" stroke="${c}" stroke-dasharray="4 3" stroke-width="2"/><path d="M25 32 h14 M32 25 v14" stroke="${c}" stroke-width="2"/>`}; return start+(map[kind]||map.extra)+end}
const WEAPON_ART_IDS=new Set(['saber','baton','wrench','cleaver','smg','machete','revolver','pipe','knife','rifle','pistol','hatchet','harpoon','carbine','hammer','crowbar','rail','flame','sniper','sledge','lmg','crossbow','shotgun','deserteagle']);
const ARMOR_ART_IDS=new Set(['jacket','coat','leather','vest','military','hazmat','riot','kevlar','exosuit','sentinel']);
const PANTS_ART_IDS=new Set(['jeans','cargo','scoutpants','kevlarpants','radiopants']);
const BOOTS_ART_IDS=new Set(['sneakers','workboots','combatboots','silentboots','hazboots']);
const SHIRT_ART_IDS=new Set(['tshirt','thermal','scoutshirt','armorshirt','techshirt']);
const HEAD_ART_IDS=new Set(['cap','hood','helmet','mask','maskhelm','commanderhelm']);
const HANDS_ART_IDS=new Set(['fingerless','workgloves','tacticalgloves','leathergloves','steelbracers','scoutbracers','kevlarbracers','zerobracers']);
const ACCESSORY_ART_IDS=new Set(['goggles','scarf','bandana','dustglasses','badge','bracelet','compass','radio','nightgoggles','scope','module','injector','neckwarmer']);
const EXTRA_HANDS_ART_IDS=new Set(['gloves']);
const MATERIAL_ART_IDS=new Set(['scrap','circuits','fuel','chemicals','parts']);
function itemArtUrl(d){if(!d)return null; if(WEAPON_ART_IDS.has(d.id))return `./assets/items/weapons/${d.id}.webp`; if(ARMOR_ART_IDS.has(d.id))return `./assets/items/armor/${d.id}.webp`; if(PANTS_ART_IDS.has(d.id))return `./assets/items/pants/${d.id}.webp`; if(BOOTS_ART_IDS.has(d.id))return `./assets/items/boots/${d.id}.webp`; if(SHIRT_ART_IDS.has(d.id))return `./assets/items/shirts/${d.id}.webp`; if(HEAD_ART_IDS.has(d.id))return `./assets/items/head/${d.id}.webp`; if(HANDS_ART_IDS.has(d.id))return `./assets/items/hands/${d.id}.webp`; if(ACCESSORY_ART_IDS.has(d.id))return `./assets/items/accessories/${d.id}.webp`; if(EXTRA_HANDS_ART_IDS.has(d.id))return `./assets/items/hands/${d.id}.webp`; if(MATERIAL_ART_IDS.has(d.id))return `./assets/items/materials/${d.id}.webp`; return null}
function itemIcon(instOrDef,size=''){const d=instOrDef&&instOrDef.id&&instOrDef.uid===undefined?instOrDef:def(instOrDef); const r=instOrDef&&instOrDef.uid!==undefined?rarity(instOrDef):null; const color=r?.color||'#9ba7ad'; const kind=d?itemFamily(d):'empty'; return `<div class="iconbox ${size} ${r?'ashen-rarity-'+Math.min(4,Math.max(0,Number(instOrDef.rarity)||0)):''} ${itemArtUrl(d)?'has-item-art':''} ${d?.artifact?'ashen-artifact-icon':''}">${d?.artifact?`<span class="ashen-artifact-glyph" style="color:${color}">${d.artifactSign||'◈'}</span>`:itemArtUrl(d)?`<img class="inventory-item-art" src="${itemArtUrl(d)}" alt="${escape(d.name)}" loading="lazy">`:svgIcon(kind,color)}</div>`}
const WEAPON_CATEGORIES={
 'hand1-melee':{name:'Broń biała jednoręczna',ids:['baton','pipe','wrench','knife','cleaver','hatchet','saber','machete']},
 'hand1-gun':{name:'Broń palna jednoręczna',ids:['pistol','deserteagle','revolver','smg']},
 'hand2-gun':{name:'Broń palna dwuręczna',ids:['rifle','carbine','shotgun','sniper','lmg']},
 'hand2-ranged':{name:'Broń dystansowa dwuręczna',ids:['crossbow','harpoon','flame']},
 'hand2-melee':{name:'Broń biała dwuręczna',ids:['crowbar','hammer','rail','sledge']}
};
function weaponCategoryFor(d){return d?Object.keys(WEAPON_CATEGORIES).find(k=>WEAPON_CATEGORIES[k].ids.includes(d.id))||null:null}
function inventoryMatchesFilter(inst,filter){const d=def(inst);if(!d)return false;if(filter==='all')return true;if(filter==='weapons-all')return d.slot==='hand1'||d.slot==='hand2';if(filter==='clothing-all')return ['shirt','pants','boots','outer','head','hands'].includes(d.slot);if(filter==='accessories-all')return d.slot==='extra'&&!d.artifact;if(filter==='artifacts-all')return !!d.artifact;return WEAPON_CATEGORIES[filter]?weaponCategoryFor(d)===filter:d.slot===filter}
let openItemDetail=null;
function weaponFamilyLabel(d){const c=weaponCategoryFor(d);return c?WEAPON_CATEGORIES[c].name:slotName(d?.slot||'')}
function itemDetailImage(d){if(itemArtUrl(d))return `<img class="ashen-detail-artwork" src="${itemArtUrl(d)}" alt="${escape(d.name)}">`;return d?.id&&!!weaponCategoryFor(d)?`<div class="detail-placeholder" aria-label="Grafika przedmiotu będzie dodana później">${itemIcon(d,'')}<span>Grafika w przygotowaniu</span></div>`:itemIcon(d,'')}
// Wektorowe piktogramy: rozpoznawalne motywy modyfikatora, a nie jeden znak na kategorię.
const MOD_SYMBOLS=Object.freeze({
 luck:'<path d="M12 10C6 2 2 7 7 12c-7-1-7 7 1 7l4-6 4 6c8 0 8-8 1-7 5-5 1-10-5-2Z"/><path d="M12 13v8"/>',
 eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 ward:'<path d="M12 2 20 5v6c0 5-3.6 8.5-8 11-4.4-2.5-8-6-8-11V5Z"/><path d="m8.5 12 2.3 2.5 4.8-5"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.5 6.5-4.5.5 2.5-6.5Z"/>',
 spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
 survival:'<path d="M12 22s8-4 8-11a8 8 0 0 0-16 0c0 7 8 11 8 11Z"/><path d="M12 7v8m-4-4h8"/>',
 blade:'<path d="M21 3 9 15 5 19l-2 2 4-1 3-4L21 3Z"/><path d="m8 14 2 2M5 17l2 2"/>',
 bolt:'<path d="m13 2-9 11h7l-1 9 10-12h-7Z"/>',
 skill:'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 shield:'<path d="M12 2 20 5v6c0 5-4 9-8 11-4-2-8-6-8-11V5Z"/><path d="M9 12h6m-3-3v6"/>',
 circuit:'<circle cx="12" cy="12" r="4"/><path d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6 4 4M19 5l-4 4m-6 6-4 4"/>',
 speed:'<path d="M3 7h12M3 12h9M3 17h12m0-13 6 8-6 8"/>',
 focus:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>'
});
function modifierMotif(mod,kind){
 const id=mod?.id||'',b=mod?.bonus||{};
 // Najpierw konkretny typ rezonansu, później ogólne właściwości.
 if(id==='art_fortunate'||id==='art_find')return 'luck';
 if(id==='art_echo')return 'eye';
 if(id==='art_ward')return 'ward';
 if(id==='art_path')return 'compass';
 if(id==='art_survive')return 'survival';
 if(mod?.luck)return 'luck';
 if(id.includes('tracker')||b.per)return 'eye';
 if(b.end||mod?.armorPct)return 'ward';
 if(id.includes('path')||id.includes('explore'))return 'compass';
 if(mod?.accuracy)return 'focus';
 if(mod?.critPp)return 'spark';
 if(mod?.extraAttacks||b.dex)return 'speed';
 if(mod?.damagePct||b.str)return 'blade';
 if(b.int)return 'circuit';
 return kind==='prefix'?'shield':'spark';
}
function modifierGlyph(kind,d,mod=null){
 const cat=categoryOf(d||{}),motif=modifierMotif(mod,kind);
 const title=(kind==='prefix'?'Prefiks':'Sufiks')+(mod?': '+mod.name:'');
 const bonus=mod?modifierText(mod):'';
 const tip=bonus?title+' — '+bonus:title;
 return `<span class="ashen-mod-icon ${kind} ${cat}" tabindex="0" title="${escape(tip)}" role="img" aria-label="${escape(tip)}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MOD_SYMBOLS[motif]}</svg><span class="ashen-mod-tooltip"><strong>${escape(title)}</strong><span>${escape(bonus||'Modyfikator wyposażenia')}</span></span></span>`;
}
function itemAffixBadges(o,d,inst=null){
 if(!o?.prefixName&&!o?.suffixName)return '';
 return `<span class="ashen-mod-badges" aria-label="Modyfikatory przedmiotu">${o.prefixName?modifierGlyph('prefix',d,findModifier(prefixDefs,inst?.prefix)):''}${o.suffixName?modifierGlyph('suffix',d,findModifier(suffixDefs,inst?.suffix)):''}</span>`;
}
// Sumaryczne parametry walki zapisywane przy ukończeniu wyprawy. Historyczne
// raporty pozbawione statystyk odczytujemy z ich tekstu, bez zgadywania krytyków wroga.
function damageReportStats(r){
 if(r?.damageSummary?.hero&&r?.damageSummary?.foe)return {...r.damageSummary,legacy:false};
 const summary={hero:{attempts:0,hits:0,misses:0,crits:0,damage:0,potential:0,best:0},foe:{attempts:0,hits:0,misses:0,crits:0,damage:0,potential:0,best:0},rounds:0,legacy:true};
 for(const line of r?.lines||[]){
  const round=String(line).match(/^Runda (\d+):/);if(round)summary.rounds=Math.max(summary.rounds,Number(round[1]));
  const outgoing=String(line).match(/Zadajesz (\d+) obrażeń/);
  const incoming=String(line).match(/Otrzymujesz (\d+) obrażeń/);
  const who=outgoing?'hero':incoming?'foe':null;
  if(who){const entry=summary[who],value=Number((outgoing||incoming)[1]);entry.attempts++;entry.hits++;entry.damage+=value;entry.best=Math.max(entry.best,value);if(who==='hero'&&line.includes('(KRYTYCZNE)'))entry.crits++;}
  else if(String(line).includes('Chybiasz')){summary.hero.attempts++;summary.hero.misses++;}
  else if(String(line).includes('Przeciwnik chybia')){summary.foe.attempts++;summary.foe.misses++;}
 }
 return summary;
}
function damageReportPanel(r){
 const x=damageReportStats(r),h=x.hero,f=x.foe;
 const percentage=entry=>entry.attempts?`${Math.round(entry.hits/entry.attempts*100)}%`:'—';
 const row=(title,hero,foe)=>`<tr><th scope="row">${title}</th><td>${hero}</td><td>${foe}</td></tr>`;
 return `<div class="ashen-damage-summary" aria-label="Podsumowanie obrażeń w walce"><div class="ashen-damage-header"><strong>⚔ PODSUMOWANIE WALKI</strong><span>${x.rounds} ${x.rounds===1?'runda':'rund'}</span></div><div class="ashen-damage-table-wrap"><table class="ashen-damage-table"><thead><tr><th>Parametr</th><th>Postać</th><th>Przeciwnik</th></tr></thead><tbody>${row('Zadane obrażenia',h.damage,f.damage)}${row('Najmocniejsze trafienie',h.best,f.best)}${row('Trafienia / próby',`${h.hits} / ${h.attempts}`,`${f.hits} / ${f.attempts}`)}${row('Skuteczność',percentage(h),percentage(f))}${row('Trafienia krytyczne',h.crits,x.legacy?'—':f.crits)}</tbody></table></div><div class="ashen-damage-total"><span>Bilans obrażeń</span><strong class="${h.damage>=f.damage?'good':'bad'}">${h.damage-f.damage>=0?'+':''}${h.damage-f.damage}</strong></div>${x.legacy?'<p class="small muted">Raport ze starszej wersji: wartości odtworzone z przebiegu walki. Niektóre dane mogły nie być zapisywane.</p>':''}</div>`;
}
function itemDetailContent(){if(!openItemDetail)return '';
 const owned=openItemDetail.kind==='owned'?instance(openItemDetail.id):null;
 const defn=owned?def(owned):item(openItemDetail.id);
 if(!defn)return '';
 const o=owned?statsOf(owned):{...defn,rarity:'Zwykły',name:defn.name,bonus:defn.bonus||{}};
 const wornSlot=owned?Object.keys(state.equip).find(slot=>state.equip[slot]===owned.uid):null;
 const equipActions=!owned||defn.slot==='material'?'':wornSlot?`<button class="primary" data-unequip="${wornSlot}">Zdejmij</button>`:defn.slot==='hand1'?`<button class="primary" data-equip="${owned.uid}" data-hand="right">Załóż · prawa ręka</button><button data-equip="${owned.uid}" data-hand="left">Załóż · lewa ręka</button>`:defn.slot==='extra'?`<span class="small muted">Załóż do slotu:</span>${['extra','extra2','extra3'].map((slot,i)=>`<button class="${state.equip[slot]?'':'primary'}" data-equip="${owned.uid}" data-extra-slot="${slot}">${i+1}${state.equip[slot]?' · zamień':''}</button>`).join('')}`:`<button class="primary" data-equip="${owned.uid}">Załóż</button>`;
 return `<div class="ashen-item-overlay" role="presentation"><div class="ashen-item-modal" role="dialog" aria-modal="true" aria-labelledby="ashen-item-title"><button class="ashen-item-close" data-item-close aria-label="Zamknij szczegóły">✕</button><div class="tag">${escape(weaponFamilyLabel(defn))}</div><h2 id="ashen-item-title">${escape(o.name)}</h2><div class="ashen-item-modal-grid"><div class="ashen-item-art">${itemDetailImage(defn)}</div><div class="ashen-item-facts"><p class="small muted">${escape(defn.flavor||'Przedmiot zdobyty na Pustkowiach.')}</p><div class="detail-stat"><span>${weaponSlot(o.slot)?'Obrażenia':o.slot==='material'?'Rodzaj':'Pancerz'}</span><strong>${weaponSlot(o.slot)?`${Number(o.min)||0}–${Number(o.max)||0}`:o.slot==='material'?'Surowiec':String(Number(o.armor)||0)}</strong></div><div class="detail-stat"><span>Rzadkość</span><strong>${escape(o.rarity||'Zwykły')}</strong></div>${owned?`<div class="detail-stat"><span>Ulepszenie</span><strong>+${owned.upgrade||0}</strong></div>`:''}${weaponSlot(defn.slot)?`<div class="detail-stat"><span>Ręce</span><strong>${defn.slot==='hand1'?'Jedna':'Dwie'}</strong></div><div class="detail-stat"><span>Ataki na rundę</span><strong>${(Number(o.baseAttacks)||1)+(Number(o.extraAttacks)||0)}</strong></div>${o.combatV2?`<div class="detail-stat"><span>Model walki</span><strong>ASHEN 0.5 · test bojowy</strong></div>`:''}`:''}<div class="detail-affix"><strong>${modifierGlyph('prefix',defn,owned?findModifier(prefixDefs,owned.prefix):null)} Prefiks</strong><span>${escape(o.prefixName||'Brak')}</span></div><div class="detail-affix"><strong>${modifierGlyph('suffix',defn,owned?findModifier(suffixDefs,owned.suffix):null)} Sufiks</strong><span>${escape(o.suffixName||'Brak')}</span></div>${owned?`<div class="small muted">${statDetails(o)}</div>${itemSetPanel(owned)}${accessorySetItemPanel(owned)}${artifactDetailPanel(owned)}`:''}</div></div><div class="actions ashen-modal-equip-actions">${equipActions}<button data-item-close>Zamknij</button></div></div></div>`
}
function slotChip(slot,uid){
 const inst=instance(uid),o=statsOf(inst),empty=!o,label=slotLabels[slot];
 const blocked=slot==='left'&&state.equip.right&&def(instance(state.equip.right))?.slot==='hand2';
 const icon=empty?`<div class="iconbox slot slot-empty">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`:`<button class="item-view-icon equipped-item-trigger" data-item-open="${escape(inst.uid)}" aria-label="Otwórz opis: ${escape(o.name)}">${itemIcon(inst,'slot')}</button>`;
 const name=empty?(blocked?'<span class="mini blocked-hand-note" title="Slot zajmuje broń dwuręczna">Zajęta (broń dwuręczna)</span>':'<span class="mini">Puste miejsce</span>'):`<button class="item-view-name mini equipped-item-trigger" data-item-open="${escape(inst.uid)}" title="${escape(o.name)}">${escape(o.name)}</button>${itemAffixBadges(o,def(inst),inst)}`;
 return `<div class="slot-anchor ${empty?'empty':''} ${blocked?'blocked-by-twohanded':''}" data-slot="${slot}"><div class="label">${label}</div>${icon}${name}</div>`
}
function equippedDetail(slot){const uid=state.equip[slot],inst=instance(uid),o=statsOf(inst),blocked=slot==='left'&&state.equip.right&&def(instance(state.equip.right))?.slot==='hand2'; return `<div class="eq-detail"><div>${o?itemIcon(inst):`<div class="iconbox">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`}</div><div class="grow"><div class="slotname">${slotLabels[slot]}</div>${o?`<button class="item-view-name" style="color:${rarities.find(r=>r.name===o.rarity)?.color}" data-item-open="${inst.uid}">${escape(o.name)}</button><div class="small muted">${statDetails(o)}</div>${itemAffixBadges(o,def(inst),inst)}${affixDetails(o)}<div class="actions"><button data-unequip="${slot}">Zdejmij</button></div>`:`<div class="muted">${blocked?'Zajęta przez broń dwuręczną.':'Brak przedmiotu.'}</div>`}</div></div>`}
function itemSummary(inst,o,showSlot=true){return `<div class="itemline"><button class="item-view-icon" data-item-open="${escape(inst.uid)}" aria-label="Otwórz opis: ${escape(o.name)}">${itemIcon(inst)}</button><div class="grow"><button class="item-view-name" data-item-open="${escape(inst.uid)}" style="color:${rarity(inst).color}">${escape(o.name)}</button>${itemAffixBadges(o,def(inst),inst)}</div></div>`}

// Ekonomia v0.1.24: wartości testowe, łatwo zmienialne w jednym miejscu.
const ECONOMY={saleBase:8,saleRarity:[1,1.5,2.4,4.5,8],yieldRarity:[1,1.2,1.5,2,2.7],prefixValue:1.18,suffixValue:1.18};
function getStock(key){return key==='scrap'?state.scrap:(state.materials[key]||0)}
function materialFamily(d){
 const id=d.id;
 if(d.slot==='hand1'||d.slot==='hand2')return rangedIds.has(id)?'gun':'melee';
 if(d.slot==='shirt'||d.slot==='pants')return 'cloth';
 if(d.slot==='boots')return 'leather';
 if(d.slot==='hands')return id.includes('bracer')||id==='bracelet'?'metalarmor':'leather';
 if(d.slot==='outer')return ['leather','jacket','coat'].includes(id)?'leather':'metalarmor';
 if(d.slot==='head')return ['cap','hood','mask'].includes(id)?'cloth':'metalarmor';
 if(d.slot==='extra')return ['scarf','neckwarmer','bandana'].includes(id)?'cloth':['goggles','dustglasses','nightgoggles','radio','scope','injector','module'].includes(id)?'electronics':'plastic';
 return 'plastic';
}
const SALVAGE_BASE={gun:{scrap:6,czesci:3},melee:{scrap:5,czesci:1},cloth:{tkanina:4},leather:{skora:3,tkanina:1},metalarmor:{scrap:4,tworzywo:2},electronics:{elektronika:3,tworzywo:2},plastic:{tworzywo:3}};
function salvageValue(inst){const d=def(inst);if(!d||d.slot==='material')return {};const mult=ECONOMY.yieldRarity[Math.min(4,Math.max(0,Number(inst.rarity)||0))];const raw=SALVAGE_BASE[materialFamily(d)]||SALVAGE_BASE.plastic;return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Math.max(1,Math.round(v*mult*(1+0.10*(roomLevel('storage')-1))))]))}
function saleValue(inst){const o=statsOf(inst);if(!o||o.slot==='material')return 0;const b=ECONOMY.saleBase+(o.min||0)+(o.max||0)+3*(o.armor||0);const m=ECONOMY.saleRarity[Math.min(4,Math.max(0,Number(inst.rarity)||0))];return Math.max(1,Math.round(b*m*(inst.prefix?ECONOMY.prefixValue:1)*(inst.suffix?ECONOMY.suffixValue:1)))}
function salvageLabel(yieldObj){return Object.entries(yieldObj).map(([k,v])=>`${v} × ${materialLabels[k]}`).join(' · ')}
function disposeItem(uid,mode){
 const inst=instance(uid),o=statsOf(inst);
 if(!inst||!o||o.slot==='material'){message='Nie można przetworzyć tego przedmiotu.';render();return}
 if(Object.values(state.equip).includes(uid)){message='Najpierw zdejmij ten przedmiot z postaci.';render();return}
 if(inst.locked){message='Przedmiot jest zabezpieczony. Otwórz kłódkę przed sprzedażą lub rozłożeniem.';render();return}
 const earned=mode==='sell'?saleValue(inst):salvageValue(inst);
 const detail=mode==='sell'?`${earned} kredytów`:salvageLabel(earned);
 if(!confirm(`${mode==='sell'?'Sprzedać':'Rozłożyć na części'}: ${o.name}?\nOtrzymasz: ${detail}\n\nTej operacji nie można cofnąć.`))return;
 // Wyłącznie jednoznacznie wskazany egzemplarz (UID), nigdy wszystkie przedmioty danego typu.
 const pos=state.inventory.findIndex(x=>x.uid===uid);if(pos<0)return;
 state.inventory.splice(pos,1);bulkSelected.delete(uid);
 if(mode==='sell')state.credits+=earned;
 else for(const [k,v] of Object.entries(earned)){if(k==='scrap')state.scrap+=v;else state.materials[k]=(state.materials[k]||0)+v}
 if(selectedUid===uid)selectedUid=null;
 message=`${mode==='sell'?'Sprzedano':'Rozłożono'}: ${o.name}. Otrzymano ${detail}.`;
 save();render();
}
function eligibleForBulk(inst){return !!inst&&!!statsOf(inst)&&statsOf(inst).slot!=='material'&&!inst.locked&&!Object.values(state.equip).includes(inst.uid)}
function bulkEligibleVisible(filter){return state.inventory.filter(inst=>eligibleForBulk(inst)&&inventoryMatchesFilter(inst,filter))}
function bulkSelectedItems(){return state.inventory.filter(inst=>bulkSelected.has(inst.uid)&&eligibleForBulk(inst))}
function bulkTotals(arr){const mats={};let credits=0;for(const inst of arr){credits+=saleValue(inst);for(const [k,v] of Object.entries(salvageValue(inst))){mats[k]=(mats[k]||0)+v}}return {credits,mats}}
function disposeBulk(mode){
 const arr=bulkSelectedItems();if(!arr.length){message='Nie wybrano dostępnych przedmiotów. Założone i zabezpieczone przedmioty są pomijane.';render();return}
 const totals=bulkTotals(arr);const text=mode==='sell'?`${totals.credits} kredytów`:salvageLabel(totals.mats);
 const verb=mode==='sell'?'SPRZEDAĆ':'ROZŁOŻYĆ NA CZĘŚCI';
 if(!confirm(`${verb} ${arr.length} przedmiotów?\nOtrzymasz: ${text}\n\nOperacji nie można cofnąć.`))return;
 // Jedna kontrolowana transakcja na zestawie konkretnych UID; zabezpieczone/założone pomijane.
 const ids=new Set(arr.map(x=>x.uid));state.inventory=state.inventory.filter(x=>!ids.has(x.uid));
 if(mode==='sell')state.credits+=totals.credits;
 else for(const [k,v] of Object.entries(totals.mats)){if(k==='scrap')state.scrap+=v;else state.materials[k]=(state.materials[k]||0)+v}
 for(const uid of ids)bulkSelected.delete(uid);
 if(selectedUid&&ids.has(selectedUid))selectedUid=null;
 message=`${mode==='sell'?'Sprzedano':'Rozłożono'} ${arr.length} przedmiotów. Otrzymano: ${text}.`;
 save();render();
}
function wallet(){return `<div class="economy-wallet"><div>🪙 Kredyty: <strong>${state.credits.toLocaleString('pl-PL')}</strong></div><div>⚙ Złom: <strong>${state.scrap.toLocaleString('pl-PL')}</strong></div><button data-page="storage">Magazyn surowców →</button><button data-page="workshop">Warsztat →</button></div>`}
function storage(){return section('Magazyn i gospodarka',`<div class="panel section"><h3 style="color:var(--gold);margin-top:0">Odzyskane surowce</h3><p class="muted">Materiały wykorzystasz już teraz w Warsztacie do ulepszania broni, pancerzy i akcesoriów. Wyższe poziomy wymagają również rdzeni technologicznych. Schematy przedwojenne zbierasz na przyszłe receptury. Żywność, wodę i zaopatrzenie medyczne możesz dobrowolnie przekazać frakcji; nie są zużywane automatycznie.</p><div class="material-grid"><div class="material-card"><div class="material-name">Rdzenie technologiczne</div><div class="value">${state.cores}</div></div><div class="material-card"><div class="material-name">Schematy przedwojenne</div><div class="value">${state.schematics}</div><div class="small muted">Do przyszłych receptur</div></div>${materialKeys.map(k=>`<div class="material-card"><div class="material-name">${materialLabels[k]}</div><div class="value">${getStock(k).toLocaleString('pl-PL')}</div></div>`).join('')}</div></div><div class="panel section"><span class="tag">TRYB TESTOWY · BAZA FRAKCJI</span><h3>📦 Duży pakiet materiałów</h3><p class="small muted">Jednorazowa paczka do testowania rozbudowy i wpłat: 50 000 złomu, 20 000 każdego pozostałego materiału (w tym żywności, wody i zaopatrzenia medycznego), 100 000 kredytów, 100 rdzeni i 100 schematów. Trafia do prywatnych zapasów aktywnej postaci — nic nie jest wpłacane automatycznie do frakcji.</p>${state.factionTestPackGranted?'<p class="good small">✓ Duży pakiet testowy został już odebrany na tej postaci.</p>':'<button class="primary" data-action="faction-test-pack">📦 Odbierz duży pakiet testowy</button>'}</div><div class="panel"><h3 style="color:var(--gold);margin-top:0">Zasady handlu</h3><p>Sprzedaż przedmiotów przynosi <strong>kredyty</strong>, a rozkładanie — materiały właściwe dla danej kategorii. Rzadkość zwiększa wartość sprzedaży i liczbę odzyskanych surowców.</p><p class="muted small">Wyposażone przedmioty trzeba najpierw zdjąć. Epickie i legendarne znaleziska są automatycznie zabezpieczane kłódką. Każdą operację sprzedaży lub rozłożenia potwierdzasz osobno.</p></div>`)}

// Wersja 0.1.13: warsztat bez ryzyka porażki, koszt każdej kolejnej operacji rośnie.
const WORKSHOP_COST=[
 {credits:100,base:10,special:3,cores:0},
 {credits:250,base:25,special:7,cores:0},
 {credits:600,base:55,special:15,cores:1},
 {credits:1400,base:110,special:30,cores:2},
 {credits:3000,base:210,special:60,cores:3}
];
function upgradeRecipe(inst){
 const o=statsOf(inst);if(!o||o.slot==='material')return null;
 const lvl=Number(inst.upgrade)||0;if(lvl>=5)return null;
 const cfg=WORKSHOP_COST[lvl],mul=1+Math.min(4,Math.max(0,Number(inst.rarity)||0))*.35;
 const materials={};
 const add=(key,value)=>{materials[key]=(materials[key]||0)+Math.ceil(value*mul)};
 const d=def(inst),fam=materialFamily(d);
 if(fam==='gun'){add('scrap',cfg.base);add('czesci',cfg.special)}
 else if(fam==='melee'){add('scrap',cfg.base);add('czesci',Math.max(1,Math.ceil(cfg.special*.5)))}
 else if(fam==='cloth'){add('tkanina',cfg.base);add('skora',Math.max(1,Math.ceil(cfg.special*.5)))}
 else if(fam==='leather'){add('skora',cfg.base);add('tkanina',cfg.special)}
 else if(fam==='metalarmor'){add('scrap',cfg.base);add('tworzywo',cfg.special)}
 else if(fam==='electronics'){add('elektronika',cfg.base);add('tworzywo',cfg.special)}
 else {add('tworzywo',cfg.base);add('elektronika',cfg.special)}
 const discount=1-0.05*(roomLevel('workshop')-1);
 for(const key of Object.keys(materials))materials[key]=Math.max(1,Math.ceil(materials[key]*discount));
 return {credits:Math.ceil(cfg.credits*mul*discount),materials,cores:cfg.cores,level:lvl+1};
}
function upgradeCanAfford(recipe){return !!recipe&&state.credits>=recipe.credits&&state.cores>=recipe.cores&&Object.entries(recipe.materials).every(([key,amount])=>getStock(key)>=amount)}
function workshop(){
 const available=state.inventory.filter(x=>statsOf(x)&&def(x)?.slot!=='material').sort((a,b)=>(b.upgrade||0)-(a.upgrade||0));
 if(!instance(workshopUid)&&available.length)workshopUid=available[0].uid;
 const current=instance(workshopUid),cur=statsOf(current),cost=current?upgradeRecipe(current):null;
 const next=current&&cost?statsOf({...current,upgrade:cost.level}):null;
 const costRow=(name,need,owned)=>`<div class="work-cost ${owned>=need?'work-ok':'work-short'}"><span>${escape(name)}</span><strong>${owned.toLocaleString('pl-PL')} / ${need.toLocaleString('pl-PL')}</strong></div>`;
 const requirements=cost?costRow('Kredyty',cost.credits,state.credits)+Object.entries(cost.materials).map(([key,value])=>costRow(materialLabels[key],value,getStock(key))).join('')+(cost.cores?costRow('Rdzenie technologiczne',cost.cores,state.cores):''):'';
 return section('Warsztat Wędrowca',`${wallet()}<div class="panel section"><div class="tag">ULEPSZENIA BEZ RYZYKA</div><h2 style="margin:8px 0">Warsztat · poziom ${roomLevel('workshop')}</h2><p class="muted">Rozbudowa warsztatu do poziomu 2–5 daje zniżkę 5/10/15/20% na materiały i kredyty (rdzenie bez zmian). Każda próba kończy się sukcesem. Możesz ulepszyć dowolny przedmiot wyposażenia do +5, ale kolejne poziomy wymagają większej liczby materiałów i kredytów. Poziomy +3 do +5 zużywają również rdzenie technologiczne. Premie do obrażeń (zarówno minimum, jak i maksimum) lub pancerza wynoszą kolejno +1, +3, +5, +10 i +20; balans sprawdzimy później.</p><p class="small muted">Rdzenie technologiczne (8% szans) i schematy przedwojenne (3%) można znaleźć podczas dalekich wypraw. Schematy są na razie kolekcjonowane — nie są jeszcze zużywane w warsztacie. Pakiet testowy nadal jest dostępny.</p>${state.workshopTestGranted?'<p class="good small">✓ Pakiet testowy został odebrany.</p>':'<button data-action="workshop-test" class="primary">Odbierz jednorazowy pakiet testowy</button>'}</div>
 <div class="work-layout"><div class="panel"><h3 style="color:var(--gold);margin-top:0">Przedmioty do ulepszenia (${available.length})</h3><div class="work-list">${available.map(inst=>{const o=statsOf(inst);return `<button class="work-item ${inst.uid===workshopUid?'selected':''}" data-workshop-select="${inst.uid}">${itemIcon(inst,'sm')}<span class="grow"><strong style="color:${rarity(inst).color}">${escape(o.name)}</strong><small>${escape(slotName(o.slot))} · ${escape(statDetails(o))}</small></span>${inst.uid===workshopUid?'◉':''}</button>`}).join('')||'<p class="muted">Brak przedmiotów do ulepszania.</p>'}</div></div><div class="panel"><h3 style="color:var(--gold);margin-top:0">Stanowisko ulepszeń</h3>${current&&cur?`<div class="work-selected">${itemIcon(current)}<div><strong style="color:${rarity(current).color}">${escape(cur.name)}</strong><div class="muted small">Poziom ulepszenia: +${cur.upgrade||0} / +5</div></div></div>${cost?`<div class="work-stats"><div><div class="small muted">Obecnie</div><strong>${weaponSlot(cur.slot)?cur.min+'–'+cur.max+' obrażeń':'Pancerz '+cur.armor}</strong></div><div class="work-arrow">→</div><div><div class="small muted">Po ulepszeniu +${cost.level}</div><strong class="good">${weaponSlot(next.slot)?next.min+'–'+next.max+' obrażeń':'Pancerz '+next.armor}</strong></div></div><div class="work-need"><h4>Koszt ulepszenia</h4>${requirements}</div><p class="small muted">${upgradeCanAfford(cost)?'Masz komplet wymaganych zasobów.': 'Brakuje części zasobów. Zdobądź je przez sprzedaż i rozkładanie niepotrzebnego wyposażenia.'}</p><button class="primary" data-workshop-upgrade="${current.uid}" ${upgradeCanAfford(cost)?'':'disabled'}>Ulepsz do +${cost.level} (100% sukcesu)</button>`:'<div class="notice">Osiągnięto maksymalny poziom +5.</div>'}`:'<p class="muted">Wybierz przedmiot po lewej stronie.</p>'}</div></div>`)
}
function applyUpgrade(uid){
 const inst=instance(uid),recipe=upgradeRecipe(inst);
 if(!inst||!recipe){message='Ten przedmiot nie może być dalej ulepszany.';render();return}
 if(!upgradeCanAfford(recipe)){message='Nie masz wystarczających zasobów na to ulepszenie.';render();return}
 const name=statsOf(inst).name;
 if(!confirm(`Ulepszyć ${name} do +${recipe.level}?\nKoszt: ${recipe.credits} kredytów, ${Object.entries(recipe.materials).map(([k,v])=>v+' × '+materialLabels[k]).join(', ')}${recipe.cores?', '+recipe.cores+' × rdzeń technologiczny':''}.\nSukces gwarantowany.`))return;
 if(!upgradeCanAfford(recipe))return;
 state.credits-=recipe.credits;state.cores-=recipe.cores;
 for(const [key,amount] of Object.entries(recipe.materials)){
  if(key==='scrap')state.scrap-=amount;else state.materials[key]-=amount;
 }
 inst.upgrade=recipe.level;
 message='Ulepszono: '+statsOf(inst).name+'. Operacja zakończona sukcesem.';save();render();
}
function grantWorkshopTest(){
 if(state.workshopTestGranted)return;
 if(!confirm('Odebrać JEDNORAZOWY pakiet testowy? Doda 25 000 kredytów, 500 złomu, po 500 pozostałych surowców i 12 rdzeni technologicznych do bieżącego zapisu.'))return;
 state.credits+=25000;state.scrap+=500;for(const key of ['tkanina','skora','tworzywo','elektronika','czesci'])state.materials[key]+=500;state.cores+=12;state.workshopTestGranted=true;
 message='Dodano pakiet testowy warsztatu.';save();render();
}
function grantFactionTestPack(){
 if(state.factionTestPackGranted)return;
 if(!confirm('TESTY FRAKCJI: dodać JEDNORAZOWO do tej postaci 50 000 złomu, 20 000 każdego z pozostałych 8 materiałów, 100 000 kredytów, 100 rdzeni i 100 schematów?\n\nZasoby trafią tylko do prywatnego Magazynu. Do frakcji wpłacasz je oddzielnie.'))return;
 if(!state.materials||typeof state.materials!=='object')state.materials={};
 state.scrap=Math.max(0,Number(state.scrap)||0)+50000;
 for(const key of ['tkanina','skora','tworzywo','elektronika','czesci','food','water','medical'])state.materials[key]=Math.max(0,Number(state.materials[key])||0)+20000;
 state.credits=Math.max(0,Number(state.credits)||0)+100000;
 state.cores=Math.max(0,Number(state.cores)||0)+100;
 state.schematics=Math.max(0,Number(state.schematics)||0)+100;
 state.factionTestPackGranted=true;
 message='Dodano dużą paczkę testową do prywatnego Magazynu.';
 save();render();
}
function compareMetrics(chosen,current){
 const rows=[['Obrażenia min.',chosen?.min||0,current?.min||0],['Obrażenia maks.',chosen?.max||0,current?.max||0],['Pancerz',chosen?.armor||0,current?.armor||0],['Szansa krytyka (p.p.)',chosen?.critPp||0,current?.critPp||0],...Object.entries(attrNames).map(([k,n])=>[n,chosen?.bonus?.[k]||0,current?.bonus?.[k]||0])];
 return `<div class="comparison"><div class="small muted">Porównanie względem wyposażonego przedmiotu (zielony = lepiej, czerwony = gorzej):</div>${rows.filter(([,v,old])=>v!==0||old!==0).map(([name,v,old])=>{const delta=v-old;return `<div class="compare-row"><span>${escape(name)}</span><span>${old} → ${v} <strong class="${delta>0?'good':delta<0?'bad':'muted'}">(${delta>0?'+':''}${delta})</strong></span></div>`}).join('')||'<p class="small muted">Brak różnic w atrybutach bojowych.</p>'}</div>`;
}
const INVENTORY_SORTS=[
 ['rarity-desc','Rzadkość: najlepsze na górze'],
 ['rarity-asc','Rzadkość: zwykłe na górze'],
 ['power-desc','Siła / pancerz: malejąco'],
 ['power-asc','Siła / pancerz: rosnąco'],
 ['name','Nazwa: A–Z'],
 ['newest','Ostatnio zdobyte'],
 ['oldest','Najdawniej zdobyte']
];
function inventorySortEntries(rows){
 const mode=INVENTORY_SORTS.some(([key])=>key===state.inventorySort)?state.inventorySort:'rarity-desc';
 const power=row=>row.o.slot==='hand1'||row.o.slot==='hand2'?(row.o.max||0):(row.o.armor||0);
 return rows.map((row,index)=>({...row,originalIndex:index})).sort((a,b)=>{
  if(mode==='newest')return b.originalIndex-a.originalIndex;
  if(mode==='oldest')return a.originalIndex-b.originalIndex;
  if(mode==='name')return a.o.name.localeCompare(b.o.name,'pl')||a.originalIndex-b.originalIndex;
  if(mode==='power-desc')return power(b)-power(a)||(b.inst.rarity||0)-(a.inst.rarity||0)||a.originalIndex-b.originalIndex;
  if(mode==='power-asc')return power(a)-power(b)||(b.inst.rarity||0)-(a.inst.rarity||0)||a.originalIndex-b.originalIndex;
  const rarityDelta=(Number(b.inst.rarity)||0)-(Number(a.inst.rarity)||0);
  const rarityCompare=mode==='rarity-asc'?-rarityDelta:rarityDelta;
  return rarityCompare||(Number(b.inst.upgrade)||0)-(Number(a.inst.upgrade)||0)||power(b)-power(a)||a.o.name.localeCompare(b.o.name,'pl')||a.originalIndex-b.originalIndex;
 });
}

function equippedArmorTotal(){
 const base=Object.entries(state.equip).filter(([slot])=>!['right','left'].includes(slot)).reduce((sum,[,uid])=>sum+(statsOf(instance(uid))?.armor||0),0);
 const setArmor=activeSetBonuses().armorPct||0;
 const a=attrs();
 const boar=companionId()==='boar'?(petPower('boar')||0):0;
 return base+Math.round(base*setArmor/100)+Math.floor((a.end||0)/4)+boar;
}
function inventoryCombatSummary(){
 const a=attrs(),attacks=heroAttacks(),main=attacks[0],mainWeapon=main?.weapon||statsOf({id:'knife',rarity:0});
 const attackRanges=attacks.map(at=>({...weaponDamageRange(a,at.weapon,at.power),weapon:at.weapon,hand:at.hand,power:at.power}));
 const range={low:attackRanges.reduce((sum,v)=>sum+v.low,0),high:attackRanges.reduce((sum,v)=>sum+v.high,0)};
 const accuracy=Math.round(main?weaponAccuracy(a,mainWeapon):6+(a.per||0)*1.3);
 const crit=Math.round(clamp(.05+(a.per||0)*.005+((mainWeapon?.critPp)||0)/100,0,.35)*100);
 const dodge=Math.round(3+(a.dex||0)*1.1+(companionId()==='boar'?(petPower('boar')||0):0));
 return {range,attackRanges,accuracy,crit,dodge,armor:equippedArmorTotal(),hp:maxHp(),attacks:attacks.length,weapon:mainWeapon};
}
function inventorySummaryPanels(){
 const combat=inventoryCombatSummary();
 const a=attrs();
 const sets=activeSetBonuses().results||[];
 const activeSets=sets.filter(s=>s.active);
 const pendingSets=sets.filter(s=>!s.active&&s.count>0);
 const resonance=resonanceBonuses();
 const accessorySets=accessorySetBonuses().results;
 const lines=[
  ['PŻ maks.',combat.hp],
  ['Pancerz',combat.armor],
  ['Unik',combat.dodge],
  ['Celność',combat.accuracy+'%'],
  ['Krytyk',combat.crit+'%'],
  ['Ataki / runda',combat.attacks]
 ].map(([label,val])=>`<div class="inventory-metric"><span>${label}</span><strong>${val}</strong></div>`).join('');
 const attrBlock=Object.entries(attrNames).map(([id,label])=>`<div class="inventory-attr"><span>${label}</span><strong>${a[id]||0}</strong></div>`).join('');
 const support=`<div class="inventory-support-line"><span>Towarzysz</span><strong>${companionId()?COMPANIONS[companionId()].name+' · '+companionBonus():'Brak'}</strong></div><div class="inventory-support-line"><span>Transport</span><strong>${vehicleDef().name}${vehicleDef().id!=='foot'?' · etap '+(vehicleStage()+1):''}</strong></div>`;
 const setHtml=activeSets.map(s=>`<div class="inventory-set-card active"><strong>${escape(s.config.name)}</strong><span>${setBonusDescription(s)}</span><small>${s.count}/6 elementów · średnia jakości ×${s.avg.toFixed(2).replace('.',',')}</small></div>`).join('') + pendingSets.map(s=>`<div class="inventory-set-card pending"><strong>${escape(s.config.name)}</strong><span>Postęp ${s.count}/3 · premia za 3/3: ${escape(projectedSetBonus(s.config,s.avg))}</span></div>`).join('');
 const accessorySetHtml=accessorySets.map(r=>`<div class="inventory-set-card ${r.active?'active':'pending'}"><strong>Akcesoria · ${escape(r.name)}</strong><span>${r.active?escape(accessoryBonusText(r.bonus)):`${r.count}/3 · brak premii (wymagane 3/3)`}</span></div>`).join('');
 const resonanceHtml=(resonance.active||[]).map(r=>`<div class="inventory-set-card active"><strong>${r.kind==='prefix'?'Prefiks':'Sufiks'} · ${escape(r.config.name)}</strong><span>${escape(r.config.description)}</span><small>Bonus: ${Object.keys(r.config.bonus||{}).length?Object.entries(r.config.bonus).map(([k,v])=>`${attrNames[k]} +${v}`).join(' · '):'brak statystyk'}${r.config.luck?` · Szczęście +${r.config.luck}`:''}${r.config.explore?` · Eksploracja +${r.config.explore}%`:''}</small></div>`).join('');
 return `
 <aside class="inventory-summary-stack">
   <section class="inventory-summary-card inventory-overview-card">
      <div class="inventory-summary-head"><div><span class="tag">PODSUMOWANIE BOJOWE</span><h3>Stan ocalałego</h3></div><div class="inventory-rarity-chip">Broń główna: ${escape(combat.weapon?.name||'Nóż')}</div></div>
      <div class="inventory-metric-grid">${lines}</div>
      <div class="inventory-damage-highlight"><span>Łączne obrażenia na rundę · ${combat.attacks} ${combat.attacks===1?'atak':'ataki/ataków'}</span><strong>${combat.range.low}–${combat.range.high}</strong><small>Suma ${combat.attacks} ${combat.attacks===1?'ataku':'ataków'} przed redukcją pancerza, trafieniami i krytykami. Każdy atak uwzględnia swoją broń i mnożnik drugiej ręki.</small><details class="ashen-damage-breakdown"><summary>Rozpisz obrażenia poszczególnych ataków</summary>${combat.attackRanges.map((at,i)=>`<div><span>Atak ${i+1} · ${escape(at.weapon.name)} · ${Math.round(at.power*100)}%</span><strong>${at.low}–${at.high}</strong></div>`).join('')}</details></div>
   </section>
   <section class="inventory-summary-card">
      <div class="inventory-summary-head"><div><span class="tag">Atrybuty</span><h3>Profil postaci</h3></div><div class="inventory-rarity-chip">Poziom ${state.level}</div></div>
      <div class="inventory-attr-grid">${attrBlock}</div>
      <div class="inventory-support-box">${support}</div>
   </section>
   <section class="inventory-summary-card">
      <div class="inventory-summary-head"><div><span class="tag">Synergie</span><h3>Zestawy i rezonans</h3></div><div class="inventory-rarity-chip">Aktywne: ${activeSets.length+accessorySets.filter(r=>r.active).length+(resonance.active||[]).length}</div></div>
      <div class="inventory-bonus-overview"><span>Zestawy pancerza / ubrań</span><strong>${activeSets.length?activeSets.length+' aktywnych':'Brak aktywnych'}</strong></div>
      <div class="inventory-bonus-overview"><span>Rezonans artefaktów</span><strong>${(resonance.active||[]).length?`Szczęście +${resonance.luck}${resonance.explore?` · Eksploracja +${resonance.explore}%`:''}`:'Brak aktywnego'}</strong></div>
      <div class="inventory-set-stack">${setHtml||'<div class="muted small">Załóż trzy zgodne elementy ubioru, aby aktywować pierwszy zestaw.</div>'}${accessorySetHtml}${resonanceHtml||'<div class="muted small">Artefakty z tym samym prefiksem lub sufiksem uruchomią rezonans 3/3.</div>'}</div>
   </section>
 </aside>`;
}
function inventoryItemCard(inst,o){
 const worn=Object.values(state.equip).includes(inst.uid);
 const weapon=o.slot==='hand1';
 const rarityMeta=rarity(inst);
 const slotLabel=slotName(o.slot);
 const buttons=o.slot==='material'?'':worn?`<span class="inventory-action-tag equipped">Założony</span><button data-unequip="${Object.keys(state.equip).find(k=>state.equip[k]===inst.uid)||''}">Zdejmij</button>`:weapon?`<button class="primary" data-equip="${inst.uid}" data-hand="right">Prawa ręka</button><button data-equip="${inst.uid}" data-hand="left">Lewa ręka</button>`:(o.slot==='extra'?['extra','extra2','extra3'].map((s,i)=>`<button class="${state.equip[s]?'':'primary'}" data-equip="${inst.uid}" data-extra-slot="${s}" title="${state.equip[s]?'Zastąpi aktualne akcesorium w tym slocie':'Wolny slot akcesorium'}">Slot ${i+1}${state.equip[s]?' ↺':''}</button>`).join(''):`<button class="primary" data-equip="${inst.uid}">Załóż</button>`);
 return `<article class="item inventory-premium-item ashen-rarity-${Math.min(4,Math.max(0,Number(inst.rarity)||0))} ${bulkSelected.has(inst.uid)?'bulk-picked':''}">
   <div class="inventory-premium-head">
      <label class="bulk-select inventory-bulk-marker" title="Zaznacz do operacji zbiorczej"><input type="checkbox" data-bulk-uid="${inst.uid}" ${bulkSelected.has(inst.uid)?'checked':''} ${eligibleForBulk(inst)?'':'disabled'}></label>
      <button class="item-view-icon inventory-premium-icon" data-item-open="${escape(inst.uid)}" aria-label="Otwórz opis: ${escape(o.name)}">${itemIcon(inst)}</button>
      <div class="inventory-premium-copy">
         <div class="inventory-premium-badges"><span class="inventory-slot-chip">${escape(slotLabel)}</span><span class="inventory-rarity-chip" style="--rarity:${rarityMeta.color}">${escape(rarityMeta.name)}</span>${worn?'<span class="inventory-action-tag equipped">Założony</span>':''}${inst.locked?'<span class="inventory-action-tag locked">Zabezpieczony</span>':''}</div>
         <button class="item-view-name inventory-premium-name" data-item-open="${escape(inst.uid)}" style="color:${rarityMeta.color}">${escape(o.name)}</button>
         ${itemAffixBadges(o,def(inst),inst)}
      </div>
   </div>
   <details class="inventory-item-expand"><summary>Rozwiń szczegóły i działania</summary><div class="inventory-item-expanded"><p class="small muted">${escape(statDetails(o))}</p>${setStatusText(inst)}${accessorySetItemPanel(inst)}<div class="inventory-premium-actions"><button data-item-open="${escape(inst.uid)}">Pełny opis</button><button data-workshop-select="${inst.uid}" data-page="workshop" title="Ulepsz w warsztacie">🔧 Warsztat</button>${buttons}<button data-lock="${inst.uid}" class="${inst.locked?'islocked':''}" title="${inst.locked?'Odblokuj':'Zabezpiecz'} przedmiot">${inst.locked?'🔒 Odblokuj':'🔓 Zabezpiecz'}</button>${o.slot==='material'?'':`<button data-sale="${inst.uid}" ${worn||inst.locked?'disabled':''}>Sprzedaj · ${saleValue(inst)} kr.</button><button data-salvage="${inst.uid}" ${worn||inst.locked?'disabled':''}>Rozłóż</button>`}</div></div></details>
 </article>`;
}

function inventory(){
 const categories=[['all','▣ Wszystko','all'],['weapons','⚔ Broń','weapons-all'],['clothing','⬡ Odzież i pancerz','clothing-all'],['accessories','◈ Akcesoria','accessories-all'],['artifacts','✧ Artefakty','artifacts-all']];
 const filtersByGroup={all:[],weapons:[['weapons-all','Wszystkie bronie'],...Object.entries(WEAPON_CATEGORIES).map(([id,v])=>[id,v.name])],clothing:[['clothing-all','Cała odzież'],['shirt','Koszulki'],['pants','Spodnie'],['boots','Buty'],['outer','Kurtki / pancerze'],['head','Nakrycia głowy'],['hands','Rękawice / karwasze']],accessories:[['accessories-all','Wszystkie akcesoria']],artifacts:[['artifacts-all','Wszystkie artefakty']]};
 const filters=filtersByGroup[invGroup]||[];
 const visible=inventorySortEntries(state.inventory.map(inst=>({inst,o:statsOf(inst)})).filter(x=>x.o&&inventoryMatchesFilter(x.inst,invFilter)));
 for(const uid of [...bulkSelected])if(!eligibleForBulk(instance(uid)))bulkSelected.delete(uid);
 const selectedForBulk=bulkSelectedItems();
 const bulkSum=bulkTotals(selectedForBulk);
 const eligibleShown=bulkEligibleVisible(invFilter);
 const allShown=eligibleShown.length>0&&eligibleShown.every(x=>bulkSelected.has(x.uid));
 const bulkUi=`<div class="bulk-panel inventory-bulk-panel"><div class="bulk-head"><div><span class="tag">Operacje zbiorcze</span><h3>Zarządzanie zapasowym wyposażeniem</h3></div><span class="tag">Zaznaczono: ${selectedForBulk.length} / dostępnych ${state.inventory.filter(eligibleForBulk).length}</span></div>
 <div class="actions"><button data-action="bulk-visible">${allShown?'Odznacz widoczne':'Zaznacz widoczne'} (${eligibleShown.length})</button><button data-action="bulk-all">Zaznacz wszystkie dostępne</button><button data-action="bulk-clear">Odznacz wszystkie</button></div>
 <div class="bulk-summary">Wartość zaznaczonych: <strong>${bulkSum.credits.toLocaleString('pl-PL')} kredytów</strong><br>Materiały z rozłożenia: <strong>${selectedForBulk.length?salvageLabel(bulkSum.mats):'—'}</strong></div>
 <div class="actions"><button class="primary" data-action="bulk-sell" ${selectedForBulk.length?'':'disabled'}>Sprzedaj zaznaczone (${selectedForBulk.length})</button><button data-action="bulk-salvage" ${selectedForBulk.length?'':'disabled'}>Rozłóż zaznaczone (${selectedForBulk.length})</button></div>
 <div class="bulk-hint">Założone i zabezpieczone przedmioty nie mogą zostać zaznaczone. Potwierdzenie pokaże łączną nagrodę. Zaznaczenie nie jest zapisywane między uruchomieniami gry.</div></div>`;
 return section('Ekwipunek',`
 <div class="inventory-premium-intro">
   <div class="inventory-premium-copyblock">
      <span class="tag">SEKTOR OPERACYJNY</span>
      <h3>Uzbrojenie, pancerz i synergie ekwipunku</h3>
      <p class="muted">Przeglądaj założone wyposażenie, sprawdzaj premie zestawów i zarządzaj zdobytymi przedmiotami. Szczegóły przedmiotów otworzysz po kliknięciu ich nazwy lub ikony.</p>
   </div>
   <div class="inventory-premium-quickstrip">
      <div class="inventory-quick-pill"><span>Przedmioty</span><strong>${state.inventory.length}</strong></div>
      <div class="inventory-quick-pill"><span>Założone sloty</span><strong>${Object.values(state.equip).filter(Boolean).length}</strong></div>
      <div class="inventory-quick-pill"><span>Artefakty</span><strong>${['extra','extra2','extra3'].filter(s=>instance(state.equip[s])&&def(instance(state.equip[s]))?.artifact).length}/3</strong></div>
      <div class="inventory-quick-pill"><span>Dominująca ręka</span><strong>${state.dominantHand==='left'?'Lewa':'Prawa'}</strong></div>
   </div>
 </div>
 <div class="inventory-premium-layout">
   <div class="inventory-premium-maincol">
     <div class="equip-stage section inventory-premium-stage">
       <div class="paperdoll-wrap"><div class="paperdoll-title"><div><span class="tag">AKTYWNE WYPOSAŻENIE</span><h3 style="color:var(--gold);margin:4px 0 0">Wyposażenie postaci</h3><div class="small muted">Kliknij ikonę albo nazwę przedmiotu, aby zobaczyć jego parametry. Slot lewej ręki zostanie oznaczony jako zajęty, gdy korzystasz z broni dwuręcznej.</div></div><div class="small muted">Poziom ${state.level}</div></div>
         <div class="paperdoll">
           <div class="paperdoll-col paperdoll-left">${['head','shirt','right','hands','pants'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
           <div class="figure-stage"><div class="figure-halo"></div><img class="inventory-figure" src="${characterFigure(state.origin,state.gender)}" alt="Sylwetka postaci ${escape(state.name)}"><div class="figure-caption">${escape(state.name)} · ${originTitle(state.origin,state.gender)}</div></div>
           <div class="paperdoll-col paperdoll-right">${['extra','extra2','extra3','outer','left','boots'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
         </div>
       </div>
     </div>
     ${resonancePanel()}
   </div>
   ${inventorySummaryPanels()}
 </div>
 <div class="inventory-controls-panel">
   <div class="inventory-group-nav">${categories.map(([id,label])=>`<button class="inventory-group-choice ${invGroup===id?'chosen':''}" data-inv-group="${id}">${label}</button>`).join('')}</div>${filters.length?`<div class="actions section inventory-filter-row">${filters.map(([id,n])=>`<button data-filter="${id}" class="${invFilter===id?'primary':''}">${n}</button>`).join('')}</div>`:''}
   <div class="ashen-inventory-sortbar inventory-sortbar-premium"><label for="ashen-inventory-sort">Sortowanie listy łupów</label><select id="ashen-inventory-sort" class="input" data-inventory-sort>${INVENTORY_SORTS.map(([id,label])=>`<option value="${id}" ${(state.inventorySort||'rarity-desc')===id?'selected':''}>${label}</option>`).join('')}</select><div class="small muted">Kolejność domyślna premiuje jakość, potem ulepszenia i moc bojową.</div></div>
   ${bulkUi}
 </div>
 <div class="inventory-premium-list">${visible.map(({inst,o})=>inventoryItemCard(inst,o)).join('')||'<div class="panel muted">Brak przedmiotów w wybranej kategorii.</div>'}</div>`)}

function specialLoot(r){const p=r?.special||{},s=r?.supplies||{};
 const rare=(p.cores||p.schematics)?`<div class="notice" style="margin-top:10px"><strong>Rzadkie znaleziska:</strong> ${[p.cores?`⚙ Rdzeń technologiczny × ${p.cores}`:'',p.schematics?`📜 Schemat przedwojenny × ${p.schematics}`:''].filter(Boolean).join(' · ')}</div>`:'';
 const supplies=[s.food?`🥫 Żywność × ${s.food}`:'',s.water?`💧 Czysta woda × ${s.water}`:'',s.medical?`✚ Zaopatrzenie medyczne × ${s.medical}`:''].filter(Boolean);
 return rare+(supplies.length?`<div class="notice" style="margin-top:7px"><strong>Zaopatrzenie z wyprawy:</strong> ${supplies.join(' · ')}</div>`:'');}
function foundLootPreview(r){return `<div class="panel section"><h3 style="color:var(--gold)">Ostatnia ukończona wyprawa: ${escape(r.location)}</h3><p class="small muted">${escape(r.at)}</p><p>Znalazłeś:</p>${(r.drops||[]).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${lootDetailButton(x)}<div>${lootDetailName(x)}${lootAffixBadges(x)}<div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||'Brak zapisanych parametrów')} · ${escape(x.slot?slotName(x.slot):'')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'<p class="muted">Sprawdź starszy raport w zakładce Raporty.</p>'}${specialLoot(r)}<button data-page="inventory">Przejdź do ekwipunku</button></div>`}
function reports(){const ah=arenaData().history;return section('Raporty walk',`<div class="arena-report-links"><h3>⚔ Raporty Starć (${ah.length})</h3><p class="small muted">Szczegółowy przebieg i podsumowanie obrażeń znajdziesz w zakładce Starcia.</p>${ah.slice(0,5).map(x=>`<div class="arena-report-brief"><span class="${arenaOutcomeClass(x)}">${arenaOutcomeSymbol(x)} ${arenaOutcomeLabel(x)} · Etap ${x.stage} — ${escape(x.name)}</span><span>${escape(x.at)}</span></div>`).join('')||'<p class="muted small">Nie rozegrano jeszcze starcia.</p>'}<button data-page="arena">Przejdź do Starć</button></div>`+(state.reports.length?`<div class="stack">${state.reports.map((r,i)=>`<div class="panel"><div class="row wrap"><strong class="${r.won?'good':'bad'}">${r.won?'ZWYCIĘSTWO':'PORAŻKA'} · ${escape(r.location)}</strong><span class="small muted">${escape(r.at)}</span></div><p>Przeciwnik: ${escape(r.enemy)}</p>${damageReportPanel(r)}${anomalyReportPanel(r)}${explorationReportPanel(r)}<p class="tag">+${r.xp} XP · +${r.scrap} złomu ${r.levels?'· Awans: +'+r.levels+' poziom':''}</p>${specialLoot(r)}<div class="small"><strong>Znalazłeś (${r.drops?.length||Number(!!r.drop)}):</strong><div class="loot-list">${(r.drops|| (r.drop?[{name:r.drop,rarity:r.dropRarity}]:[])).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${lootDetailButton(x)}<div>${lootDetailName(x)}${lootAffixBadges(x)}<div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||((x.uid&&instance(x.uid))?statDetails(statsOf(instance(x.uid))):'Szczegóły nie były zapisywane w tej wersji raportu.'))}<br>Rzadkość: ${escape(x.rarity||'Nieznana')} · ${escape(x.slot?slotName(x.slot):'Przedmiot ze starszego raportu')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'Brak'}</div></div><details ${i===0?'open':''}><summary>Przebieg walki</summary>${r.lines.map(line=>`<div class="report small">${escape(line)}</div>`).join('')}</details></div>`).join('')}</div>`:'<div class="panel muted">Brak raportów. Wykonaj pierwszą wyprawę.</div>'))}

const HIDEOUT_OPTIONS={
 left:[['none','Puste'],['bed','Łóżko polowe'],['chair','Fotel'],['crate','Skrzynie']],
 center:[['none','Puste'],['table','Stół'],['workbench','Stół warsztatowy'],['rug','Dywan']],
 right:[['none','Puste'],['nightstand','Szafka nocna'],['shelf','Regał'],['locker','Szafa metalowa'],['radio','Radiostacja']],
 wall:[['none','Pusta ściana'],['poster','Plakat'],['map','Mapa Pustkowi'],['trophy','Trofeum']],
 light:[['candle','Świeca'],['bulb','Żarówka'],['neon','Lampa LED']]
};
// Meble to WYŁĄCZNIE wygląd. Premie w przyszłości wynikają z rozwoju pomieszczeń.
const FURNITURE_PLAN={
 bed:{title:'Łóżko',slot:'left',id:'bed',levels:[
  {level:1,name:'Łóżko polowe',scrap:70,mat:'tkanina',qty:15,credits:0},
  {level:20,name:'Łóżko wzmocnione',scrap:240,mat:'skora',qty:50,credits:650},
  {level:30,name:'Łóżko przedwojenne',scrap:530,mat:'tkanina',qty:130,credits:1800}]},
 table:{title:'Stół',slot:'center',id:'table',levels:[
  {level:1,name:'Stół z odzysku',scrap:65,mat:'czesci',qty:8,credits:0},
  {level:20,name:'Stół warsztatowy',scrap:200,mat:'czesci',qty:35,credits:450},
  {level:30,name:'Stół techniczny',scrap:430,mat:'elektronika',qty:60,credits:1500}]},
 nightstand:{title:'Szafka',slot:'right',id:'nightstand',levels:[
  {level:1,name:'Metalowa szafka nocna',scrap:50,mat:'tworzywo',qty:7,credits:0},
  {level:20,name:'Szafka zamykana',scrap:180,mat:'czesci',qty:28,credits:400},
  {level:30,name:'Szafka modułowa',scrap:380,mat:'elektronika',qty:55,credits:1250}]}
};
function hideoutDefault(){return {left:'bed',center:'none',right:'none',wall:'none',light:'candle'}}
function furnitureState(){
 // Starsze zapisy zachowują istniejące umeblowanie bez ponownego płacenia.
 if(!state.furniture||typeof state.furniture!=='object'||Array.isArray(state.furniture)){
  const old=state.hideout||{};
  state.furniture={bed:old.left==='bed'?1:0,table:old.center==='table'?1:0,nightstand:old.right==='nightstand'?1:0};
 }
 for(const key of Object.keys(FURNITURE_PLAN)){
  const n=state.furniture[key];if(!Number.isInteger(n)||n<0||n>3)state.furniture[key]=0;
 }
 return state.furniture;
}
function hideoutState(){
 const defaults=hideoutDefault();if(!state.hideout||typeof state.hideout!=='object')state.hideout={...defaults};
 const f=furnitureState();
 for(const k of ['wall','light'])if(!HIDEOUT_OPTIONS[k].some(x=>x[0]===state.hideout[k]))state.hideout[k]=defaults[k];
 // Wystrój dotychczasowych postaci migruje do systemu mebli; łóżko zawsze zajmuje swój slot.
 state.hideout.left='bed';state.hideout.center=f.table?'table':'none';state.hideout.right=f.nightstand?'nightstand':'none';
 return state.hideout;
}
function furnitureUpgrade(key){
 const f=furnitureState(),plan=FURNITURE_PLAN[key];if(!plan)return;
 const current=f[key],next=plan.levels[current];if(!next){message='Ten mebel ma już najwyższy wariant.';render();return}
 if(state.level<next.level){message=`Wariant ${next.name} wymaga poziomu ${next.level}.`;render();return}
 if(state.scrap<next.scrap||getStock(next.mat)<next.qty||state.credits<next.credits){message='Brakuje surowców lub kredytów na ten wariant.';render();return}
 const cost=`${next.scrap} złomu, ${next.qty} ${materialLabels[next.mat].toLowerCase()}${next.credits?' i '+next.credits+' kredytów':''}`;
 if(!confirm(`Wykonać: ${next.name}?\nKoszt: ${cost}\nMeble są wyłącznie wizualne.`))return;
 state.scrap-=next.scrap;state.materials[next.mat]-=next.qty;state.credits-=next.credits;f[key]=current+1;
 message='Utworzono: '+next.name+'. Zapisano w kryjówce.';save();render();
}
function furnitureControls(){
 const f=furnitureState();return `<div class="furniture-catalog">${Object.entries(FURNITURE_PLAN).map(([key,plan])=>{
 const stage=f[key],next=plan.levels[stage],current=stage?plan.levels[stage-1].name:key==='bed'?'Materac zastępczy':'Puste miejsce';
 const label=next?`${next.scrap} złomu · ${next.qty} ${materialLabels[next.mat]}${next.credits?' · '+next.credits+' kr.':''}`:'Wszystkie 3 warianty odblokowane';
 const locked=next&&state.level<next.level;const unaffordable=next&&(state.scrap<next.scrap||getStock(next.mat)<next.qty||state.credits<next.credits);
 return `<div class="furniture-card"><h3>${plan.title} · ${stage}/3</h3><p class="small muted">Obecnie: <strong>${current}</strong>${key==='bed'?' · wymagane w sypialni':''}</p><p class="small muted">${next?`Następny: ${next.name} (poziom postaci ${next.level})`:'Mebel ukończony'}</p><p class="small muted">${label}</p>${next?`<button class="${!locked&&!unaffordable?'primary':''}" data-furniture-upgrade="${key}" ${locked||unaffordable?'disabled':''}>${locked?'Od poziomu '+next.level:stage?'Ulepsz do wariantu '+(stage+1):'Wykonaj mebel'}</button>`:'<span class="tag">Maksymalny wariant</span>'}</div>`}).join('')}</div><p class="hideout-hint">Na razie tylko pierwszy wariant ma własną grafikę WebP. Wyższe warianty otrzymują rozpoznawalne dodatki wizualne; docelowo podmienimy je na oddzielne ilustracje. Żaden mebel nie zmienia statystyk ani nagród z wypraw.</p>`;
}
function hideoutSvgThing(slot,id){if(id==='none')return '';
 // Grafiki umeblowania sa oddzielnymi assetami w folderze furniture.
 // Pozostale wybory zachowuja dotychczasowe rysunki SVG.
 const furniture={
   'left:bed':{path:'bed-rusty.webp',x:-40,y:302,w:500,h:272},
   'center:table':{path:'table-rusty.webp',x:500,y:334,w:246,h:182},
   'right:nightstand':{path:'nightstand-metal.webp',x:780,y:360,w:122,h:150}
 };
 const art=furniture[slot+':'+id];
 if(art){
 const key=slot==='left'?'bed':slot==='center'?'table':'nightstand',stage=furnitureState()[key];
 if(!stage){return key==='bed'?`<g><ellipse cx="252" cy="495" rx="158" ry="19" fill="#090c0d" opacity=".4"/><path d="M105 450L298 421L407 470L205 509Z" fill="#696354" stroke="#a79879" stroke-width="7"/><path d="M135 447L189 431L225 447L170 460Z" fill="#99917d"/></g>`:'';}
 const image=`<ellipse cx="${art.x+art.w/2}" cy="${Math.min(526,art.y+art.h-6)}" rx="${art.w*.38}" ry="13" fill="#06090a" opacity=".35"/><image href="./assets/bunker/furniture/${art.path}" x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" preserveAspectRatio="xMidYMax meet"/>`;
 const enhancements=stage===2?(key==='bed'?`<path d="M100 495L386 496" stroke="#819aa0" stroke-width="8" opacity=".6"/>`:key==='table'?`<path d="M498 411h121" stroke="#abc2ae" stroke-width="7" opacity=".75"/>`:`<rect x="780" y="405" width="28" height="11" rx="3" fill="#b3aa7c" opacity=".9"/>`):stage===3?(key==='bed'?`<path d="M106 495L385 495" stroke="#bda77d" stroke-width="11" opacity=".75"/><rect x="140" y="424" width="64" height="12" rx="4" fill="#6d9b92"/>`:key==='table'?`<path d="M490 410h144" stroke="#9ad2d3" stroke-width="9" opacity=".8"/><rect x="519" y="380" width="57" height="22" rx="3" fill="#4e817e"/>`:`<rect x="775" y="405" width="38" height="14" rx="4" fill="#93ced2" opacity=".85"/>`):'';
 return `<g>${image}${enhancements}</g>`;
 }

 const dark='#273035',iron='#626f70',glow='#d8a25c',wood='#65503a';
 let content='';
 if(id==='bed')content=`<ellipse cx="10" cy="96" rx="142" ry="20" fill="#070a0d" opacity=".45"/><path d="M-136 38 L-41 -4 L124 33 L34 83 Z" fill="#4b4b46" stroke="#979081" stroke-width="3"/><path d="M-108 28 L-53 4 L-6 20 L-59 45 Z" fill="#9e9886"/><path d="M-59 45 L34 83 L124 33 L105 48 L35 95 L-65 58 Z" fill="#3f5147"/><path d="M-128 39 L-128 76 M35 88 L35 109 M124 38 L124 77" stroke="#899196" stroke-width="6"/>`;
 if(id==='chair')content=`<ellipse cx="0" cy="104" rx="92" ry="18" fill="#070a0d" opacity=".5"/><path d="M-64 -53 L58 -53 L53 25 L-61 25 Z" fill="#46534f" stroke="#8c7961" stroke-width="6"/><path d="M-70 28 L68 28 L43 69 L-40 69 Z" fill="#34413d" stroke="#a18a6a" stroke-width="5"/><path d="M-51 69 L-57 105 M40 69 L49 105" stroke="#6f7471" stroke-width="7"/><path d="M-70 -2 L-105 15 L-90 50 M58 -2 L91 15 L88 50" fill="none" stroke="#8c7961" stroke-width="8"/>`;
 if(id==='crate')content=`<ellipse cy="103" rx="120" ry="17" fill="#070a0d" opacity=".4"/><path d="M-107 -8 L-13 -38 L87 -7 L-8 22 Z" fill="#766045" stroke="#a88e60" stroke-width="3"/><path d="M-107 -8 L-8 22 L-8 91 L-107 61 Z" fill="#52412e" stroke="#a88e60" stroke-width="3"/><path d="M-8 22 L87 -7 L87 63 L-8 91 Z" fill="#655038" stroke="#a88e60" stroke-width="3"/><path d="M-99 4 L-17 29 M-99 48 L-17 78 M1 30 L80 4 M1 77 L80 52" stroke="#a17a47" stroke-width="6"/>`;
 if(id==='table')content=`<ellipse cy="99" rx="135" ry="17" fill="#070a0d" opacity=".4"/><path d="M-120 -15 L5 -56 L125 -18 L0 24 Z" fill="#6d5840" stroke="#b49c74" stroke-width="4"/><path d="M-112 -6 L-112 88 M107 -8 L107 89 M0 22 L0 103" stroke="#555d5a" stroke-width="9"/><path d="M-80 -19 L3 -46 L87 -19" fill="none" stroke="#928368" stroke-width="3"/>`;
 if(id==='workbench')content=`<ellipse cy="106" rx="140" ry="16" fill="#070a0d" opacity=".4"/><path d="M-126 -10 L8 -49 L127 -12 L-8 27 Z" fill="#5f5344" stroke="#aba08a" stroke-width="4"/><path d="M-111 14 L-111 98 M113 12 L113 97 M-9 31 L-9 101" stroke="#556569" stroke-width="9"/><rect x="-43" y="-78" width="80" height="31" rx="3" fill="#3d474b" stroke="#768687" stroke-width="3"/><path d="M-26 -59 l19-16 6 5 -19 16 M15 -57 l14 -13" stroke="#adb8b8" stroke-width="5"/><circle cx="60" cy="-32" r="14" fill="#353f45" stroke="#93a3a7" stroke-width="4"/>`;
 if(id==='rug')content=`<path d="M-128 11 L10 -59 L138 13 L-1 89 Z" fill="#574742" stroke="#897668" stroke-width="5"/><path d="M-99 11 L9 -39 L109 13 L-1 68 Z" fill="none" stroke="#b49d77" stroke-width="4"/><path d="M-53 10 L9 -18 L62 11 L0 45 Z" fill="#7a6254"/>`;
 if(id==='shelf')content=`<ellipse cy="110" rx="106" ry="15" fill="#070a0d" opacity=".4"/><path d="M-90 -122 L84 -122 L84 100 L-90 100 Z" fill="#27343a" stroke="#85908a" stroke-width="8"/><path d="M-85 -52 H81 M-85 14 H81 M-85 76 H81" stroke="#8d8e7c" stroke-width="9"/><rect x="-67" y="-102" width="47" height="44" fill="#736c5c"/><rect x="7" y="-94" width="51" height="32" fill="#4d665b"/><rect x="-65" y="-35" width="25" height="40" fill="#726e53"/><rect x="-30" y="-40" width="38" height="45" fill="#4d585c"/><rect x="22" y="-27" width="41" height="29" fill="#877356"/><rect x="-70" y="27" width="50" height="45" fill="#555344"/><rect x="20" y="35" width="43" height="35" fill="#6e735d"/>`;
 if(id==='locker')content=`<ellipse cy="111" rx="92" ry="16" fill="#070a0d" opacity=".4"/><path d="M-78 -128 H79 V106 H-78Z" fill="#414d50" stroke="#85918b" stroke-width="8"/><path d="M0 -124 V105" stroke="#202a2c" stroke-width="6"/><path d="M-63 -111 H-11 V-91 H-63z M15 -111 H65 V-91 H15z" fill="#202c2f"/><path d="M-64 -63 h47 M20 -63 h44 M-64 -49 h47 M20 -49 h44" stroke="#9ba5a0" stroke-width="4"/><path d="M-12 -19 V22 M12 -19 V22" stroke="#b2a58b" stroke-width="7"/>`;
 if(id==='radio')content=`<ellipse cy="111" rx="113" ry="16" fill="#070a0d" opacity=".4"/><path d="M-105 14 L-105 100 M100 16 V100" stroke="#626e6a" stroke-width="8"/><path d="M-124 13 H117" stroke="#8c7755" stroke-width="15"/><rect x="-73" y="-80" width="145" height="94" rx="8" fill="#354344" stroke="#91a39d" stroke-width="5"/><rect x="-51" y="-59" width="61" height="44" fill="#172b32" stroke="#648c8e" stroke-width="2"/><path d="M-45 -26 q25 -28 48 0" fill="none" stroke="#a0bca0" stroke-width="3"/><circle cx="46" cy="-37" r="14" fill="#a38e6a"/><path d="M65 -80 L90 -153" stroke="#a5abaa" stroke-width="5"/>`;
 if(id==='poster')content=`<path d="M-70 -85 H70 V85 H-70Z" fill="#715442" stroke="#a9a093" stroke-width="5"/><path d="M-40 35 L-12 -34 L10 9 L29 -39 L47 38Z" fill="#423d36"/><text x="0" y="64" font-size="13" text-anchor="middle" letter-spacing="2" fill="#ddc38e">PRZETRWAJ</text>`;
 if(id==='map')content=`<path d="M-92 -76 L-30 -89 L24 -74 L88 -91 V87 L26 68 L-31 82 L-92 71Z" fill="#b1a084" stroke="#6a5c48" stroke-width="5"/><path d="M-30 -89 V82 M24 -74 V68" stroke="#675b48" stroke-width="2"/><path d="M-70 22 Q-20 -49 15 -4 T70 -30" fill="none" stroke="#665c4c" stroke-width="5" stroke-dasharray="8 6"/><circle cx="20" cy="-2" r="9" fill="#8d4139"/>`;
 if(id==='trophy')content=`<path d="M-8 -82 h16 v50 h-16z" fill="#7c8b83"/><path d="M-43 -59 Q-23 -80 0 -62 Q23 -80 43 -59 Q51 -28 23 -17 L12 5 H-12 L-23 -17 Q-51 -28 -43 -59Z" fill="#695d4d" stroke="#b8a17d" stroke-width="5"/><path d="M-13 14 H13 L20 57 H-20 Z" fill="#726452"/><path d="M-33 65 H33" stroke="#b8a17d" stroke-width="9"/>`;
 return content?`<g transform="translate(${slot==='left'?218:slot==='center'?488:slot==='right'?759:480} ${slot==='wall'?174:405})">${content}</g>`:'';
}
const bedroomBackgroundByLevel=lvl=>`./assets/bunker/rooms/bedroom-level${Math.max(1,Math.min(5,lvl))}.webp?v=0.1.54.2`;
function hideoutScene(h){
 const lvl=roomLevel('bedroom');
 const roomLabel=lvl===1?'Poziom 1 — surowa sypialnia':lvl===2?'Poziom 2 — odnowiona sypialnia':'Poziom 3 — wyposażona sypialnia';
 // Cała scena pochodzi z jednej gotowej ilustracji. Żadnych nakładek z meblami.
 return `<svg viewBox="0 0 960 540" role="img" aria-label="Sypialnia Schronu 17: ${roomLabel}" xmlns="http://www.w3.org/2000/svg"><rect width="960" height="540" fill="#151b20"/><image href="${bedroomBackgroundByLevel(lvl)}" x="0" y="0" width="960" height="540" preserveAspectRatio="xMidYMid slice"/></svg>`;
}

function hideoutChoice(key,current){return `<div class="hideout-group"><h3>${({left:'Lewa strona pomieszczenia',center:'Środek pomieszczenia',right:'Prawa strona pomieszczenia',wall:'Dekoracja ścienna',light:'Oświetlenie'})[key]}</h3><div class="hideout-choice">${HIDEOUT_OPTIONS[key].map(([id,title])=>`<button type="button" data-hideout-slot="${key}" data-hideout-item="${id}" class="${id===current?'selected':''}" aria-pressed="${id===current}">${escape(title)}</button>`).join('')}</div></div>`}
function setHideoutItem(slot,id){if(!['wall','light'].includes(slot)||!HIDEOUT_OPTIONS[slot]?.some(x=>x[0]===id))return;hideoutState()[slot]=id;message='Zmieniono wyposażenie Schronu 17. Zapisano ustawienie.';save();render()}

const BUNKER_ROOMS={bedroom:{name:'Sypialnia',desc:'Osobiste pomieszczenie Wędrowca. Każdy poziom ma gotową scenę bez nakładanych mebli.',unlock:'Gotowe sceny rozwoju',future:'W przyszłości: komfort i odpoczynek'},storage:{name:'Magazyn',desc:'Pomieszczenie do przechowywania materiałów i zdobyczy. Stan surowców jest już dostępny w istniejącym Magazynie.',unlock:'Podgląd surowców',future:'W przyszłości: pojemność składowania'},workshop:{name:'Warsztat',desc:'Miejsce przerabiania zdobyczy i ulepszania ekwipunku. Korzysta z istniejącego systemu ulepszeń +1 do +5.',unlock:'Ulepszanie przedmiotów',future:'W przyszłości: nowe receptury i projekty'},
 sanctuary:{name:'Legowisko towarzyszy',desc:'Przestrzeń wypoczynku i treningu zwierząt. Każdy poziom wzmacnia bonus aktywnego towarzysza; tylko jedno zwierzę daje premie w danej chwili.',unlock:'Silniejszy aktywny towarzysz',future:'Kolekcja i trening towarzyszy'},
 garage:{name:'Garaż',desc:'Baza napraw i przygotowania pojazdów. Wzmacnia skrócenie czasu zwykłych wypraw niezależnie od rodzaju pojazdu; nie dotyczy ekspedycji frakcyjnych.',unlock:'Krótszy czas zwykłych wypraw',future:'W przyszłości: rozbudowa floty'},
 infirmary:{name:'Ambulatorium',desc:'Punkt medyczny Schronu 17. Rozbudowa zwiększa maksymalne PŻ postaci we wszystkich obliczeniach walki.',unlock:'Więcej punktów życia',future:'W przyszłości: leczenie i medykamenty'}};
let activeBunkerRoom='bedroom';
function bunkerRoomSvg(type,h,compact=false){
 if(type==='bedroom'){
  // Zachowujemy istniejący widok umeblowanej sypialni, w przekroju pomniejszony przez CSS.
  return hideoutScene(h);
 }
 const storage=type==='storage';
 // Grafiki pomieszczeń są pełnymi ilustracjami 16:9, nie wyciętymi fragmentami planszy.
 // Ten sam asset działa w miniaturze przekroju bazy i dużym widoku pomieszczenia.
 const background=`./assets/bunker/rooms/${type}-level${Math.max(1,Math.min(5,roomLevel(type)))}.webp?v=${APP_VERSION}`;
 const label=BUNKER_ROOMS[type]?.name||'MODUŁ';
 const level=roomLevel(type);
 return `<svg viewBox="0 0 960 540" role="img" aria-label="${label} w Schronie 17, poziom ${level}" xmlns="http://www.w3.org/2000/svg"><rect width="960" height="540" fill="#151b20"/><image href="${background}" x="0" y="0" width="960" height="540" preserveAspectRatio="xMidYMid meet"/></svg>`;
}
function bunkerRoomsOverview(h){return `<div class="bunker-overview"><div class="hideout-title"><div><div class="tag">PRZEKRÓJ BAZY · POZIOM -1</div><h3>Schron 17</h3></div><span class="hideout-pill">6 czynnych pomieszczeń</span></div><div class="bunker-cutaway">${Object.entries(BUNKER_ROOMS).map(([id,r])=>`<button type="button" class="bunker-module ${activeBunkerRoom===id?'is-selected':''}" data-bunker-room="${id}" aria-pressed="${activeBunkerRoom===id}">${bunkerRoomSvg(id,h,true)}<strong>${r.name}</strong><span class="bunker-state">Poziom ${roomLevel(id)}/5 · ${({bedroom:'Pokój Wędrowca',storage:'Zasoby',workshop:'Ulepszenia',sanctuary:'Towarzysze',garage:'Transport',infirmary:'Zdrowie'})[id]}</span></button>`).join('')}</div><div class="bunker-floor"></div><p class="hideout-story">Dotknij lub kliknij pomieszczenie, aby obejrzeć je z bliska. Wszystkie sześć pomieszczeń ma własne ulepszenia i bonusy.</p></div>`}
const BACKUP_KEY=KEY+'-backup-before-import';
function exportSave(data=state,label='ashen-zapis'){
 const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=label+'-'+stamp+'.json';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function validImport(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Plik nie zawiera poprawnego zapisu ASHEN.');
 if(raw.version!==1)throw Error('Nieobsługiwana wersja zapisu.');
 if(typeof raw.name!=='string'||raw.name.trim().length<2||raw.name.length>24)throw Error('Nieprawidłowe imię postaci.');
 if(typeof raw.created!=='boolean')throw Error('Brak informacji o utworzeniu postaci.');
 if(!Number.isInteger(raw.level)||raw.level<1||raw.level>100000)throw Error('Nieprawidłowy poziom postaci.');
 if(!raw.attrs||typeof raw.attrs!=='object'||Array.isArray(raw.attrs))throw Error('Brak atrybutów postaci.');
 for(const k of Object.keys(attrNames)){if(!Number.isFinite(raw.attrs[k])||raw.attrs[k]<0||raw.attrs[k]>1000000)throw Error('Nieprawidłowe atrybuty postaci.');}
 if(!Array.isArray(raw.inventory)||raw.inventory.length>20000)throw Error('Nieprawidłowy lub zbyt duży ekwipunek.');
 if(!raw.equip||typeof raw.equip!=='object'||Array.isArray(raw.equip))throw Error('Brak informacji o wyposażeniu.');
 if(!Array.isArray(raw.reports)||raw.reports.length>2000)throw Error('Nieprawidłowe raporty.');
 const uidSet=new Set();
 for(const x of raw.inventory){
  if(typeof x==='string'){if(!item(x))throw Error('Nieznany przedmiot w starszym zapisie.');continue;}
  if(!x||typeof x!=='object'||Array.isArray(x)||typeof x.uid!=='string'||x.uid.length>200||!item(x.id)||!Number.isInteger(x.rarity)||x.rarity<0||x.rarity>4)throw Error('Nieprawidłowy przedmiot w pliku zapisu.');
  if(uidSet.has(x.uid))throw Error('W pliku są zduplikowane identyfikatory przedmiotów.');uidSet.add(x.uid);
  if(x.upgrade!==undefined&&(!Number.isInteger(x.upgrade)||x.upgrade<0||x.upgrade>5))throw Error('Nieprawidłowe ulepszenie przedmiotu.');
 }
 for(const key of ['xp','points','scrap','credits','cores','schematics','battles','wins']){
  if(raw[key]!==undefined&&(!Number.isFinite(raw[key])||raw[key]<0||raw[key]>1e12))throw Error('Nieprawidłowa wartość: '+key);
 }
 if(raw.materials!==undefined){if(!raw.materials||typeof raw.materials!=='object'||Array.isArray(raw.materials))throw Error('Nieprawidłowe materiały.');for(const v of Object.values(raw.materials)){if(!Number.isFinite(v)||v<0||v>1e12)throw Error('Nieprawidłowe ilości materiałów.');}}
 if(raw.hideout!==undefined&&(!raw.hideout||typeof raw.hideout!=='object'||Array.isArray(raw.hideout)))throw Error('Nieprawidłowe dane kryjówki.');
 const json=JSON.stringify(raw);if(json.length>5*1024*1024)throw Error('Plik zapisu jest zbyt duży.');
 return raw;
}
function backupCurrentAndReplace(next){
 // Najpierw zapis do localStorage, potem weryfikacja. Nie zmieniamy aktywnej postaci,
 // dopóki nie mamy pewności, że nowy zapis faktycznie przetrwa odświeżenie.
 const current=localStorage.getItem(KEY);
 const serialized=JSON.stringify(next);
 try{
  if(current!==null)localStorage.setItem(BACKUP_KEY,current);
  localStorage.setItem(KEY,serialized);
  const stored=localStorage.getItem(KEY);
  if(stored!==serialized)throw Error('Zapis nie został utrwalony.');
 }catch(err){
  try{if(current!==null)localStorage.setItem(KEY,current)}catch{}
  throw Error('Przeglądarka nie zapisała nowej postaci. Sprawdź, czy zapis danych strony jest dozwolony.');
 }
}
function activateImportedSave(data,source){
 // Nie polegamy na location.reload(): od razu zastępujemy aktywny stan gry.
 state=data;
 if(!['left','right'].includes(state.dominantHand))state.dominantHand='right';
 if(!Number.isFinite(state.credits)||state.credits<0)state.credits=0;
 if(!Number.isFinite(state.cores)||state.cores<0)state.cores=0;
 if(!Number.isFinite(state.schematics)||state.schematics<0)state.schematics=0;
 if(typeof state.workshopTestGranted!=='boolean')state.workshopTestGranted=false;
if(typeof state.factionTestPackGranted!=='boolean')state.factionTestPackGranted=false;
 if(!state.materials||typeof state.materials!=='object')state.materials={};
 for(const k of materialKeys.slice(1))if(!Number.isFinite(state.materials[k])||state.materials[k]<0)state.materials[k]=0;
 if(state.inventory.some(x=>typeof x==='string')){
  const legacy=state.inventory;
  const previous=state.equip||{};
  state.inventory=legacy.map((id,i)=>({uid:'legacy-'+i,id,rarity:0,affix:null}));
  const used=new Set(),eq={};
  for(const [slot,id] of Object.entries(previous)){
   const found=state.inventory.find(x=>x.id===id&&!used.has(x.uid));
   if(found){eq[slot]=found.uid;used.add(found.uid)}
  }
  state.equip=eq;
 }
 for(const inst of state.inventory){
  if(!Number.isInteger(inst.upgrade)||inst.upgrade<0||inst.upgrade>5)inst.upgrade=0;
  if(typeof inst.locked!=='boolean')inst.locked=Number(inst.rarity)>=3;
 }
 normalizeEquip();
 bulkSelected.clear();selectedUid=null;workshopUid=null;
 setPage(state.created?'home':'bunker');
 message=`${source}: „${state.name}”, poziom ${state.level}. Postać jest już aktywna.`;
 render();
}
// v0.2.4.1: cloud downloads must update both localStorage and the LIVE game state.
// A reload alone can be defeated by in-memory state and periodic sync/save.
// Wpłata frakcyjna zatwierdzona przez serwer: pomniejsz wyłącznie aktywny,
// powiązany z kontem profil; nie nadpisuj innych zasobów ani ekwipunku.
window.ASHEN_FACTION_WALLET=()=>Object.fromEntries(['scrap','czesci','food','water','medical'].map(k=>[k,Math.floor(Math.max(0,Number(k==='scrap'?state.scrap:state.materials?.[k])||0))]));
window.ASHEN_FACTION_APPLY_PAYMENT=(kind,amount)=>{
 const n=Number(amount);
 if(!['scrap','czesci','food','water','medical'].includes(kind)||!Number.isSafeInteger(n)||n<1)throw Error('Nieprawidłowa wpłata');
 const cloud=window.ASHEN_CLOUD;
 if(!cloud?.getSession()?.user?.id||cloud.getBoundSlot()!==cloud.currentSlot())throw Error('Profil nie jest powiązany z kontem online.');
 if(kind==='scrap')state.scrap=Math.max(0,(Number(state.scrap)||0)-n);
 else {state.materials=state.materials||{};state.materials[kind]=Math.max(0,(Number(state.materials[kind])||0)-n)}
 save();render();return window.ASHEN_FACTION_WALLET();
};
// ASHEN v0.4.3.2: mirror only server-confirmed private expedition expenditures/refunds.
window.ASHEN_FACTION_SETTLE_EXPEDITION=(cost,direction= -1)=>{
 const cloud=window.ASHEN_CLOUD;
 if(!cloud?.getSession()?.user?.id||cloud.getBoundSlot()!==cloud.currentSlot())throw Error('Bieżąca postać nie jest przypisana do konta online. Pobierz zapis z chmury.');
 const keys=['scrap','czesci','food','water','medical'];
 const change=Object.fromEntries(keys.map(k=>[k,Math.floor(Number(cost?.[k]||0))]));
 if(keys.some(k=>!Number.isSafeInteger(change[k])||change[k]<0))throw Error('Niepoprawne rozliczenie serwera.');
 if(direction!==1&&direction!==-1)throw Error('Niepoprawny kierunek rozliczenia.');
 for(const k of keys){const old=Number(k==='scrap'?state.scrap:state.materials?.[k])||0;
  if(direction<0&&old<change[k])throw Error('Stan lokalny jest starszy niż serwerowy. Pobierz zapis z chmury, aby zobaczyć aktualne zasoby.');}
 state.materials=state.materials||{};
 for(const k of keys){if(k==='scrap')state.scrap=(Number(state.scrap)||0)+direction*change[k];
  else state.materials[k]=(Number(state.materials[k])||0)+direction*change[k];}
 save();render();return window.ASHEN_FACTION_WALLET();
};
window.ASHEN_APPLY_CLOUD_SAVE=function(raw){
 const data=validImport(raw);
 backupCurrentAndReplace(data);
 if(devActiveId()==='main')localStorage.setItem(devProfileSaveKey('main'),JSON.stringify(data));
 activateImportedSave(data,'Pobrano zapis z chmury');
 const persisted=JSON.parse(localStorage.getItem(KEY)||'null');
 if(!persisted||persisted.scrap!==data.scrap)throw Error('Nie udało się potwierdzić zapisu w aktywnym profilu.');
 return {name:state.name,level:state.level,scrap:state.scrap};
};
async function importSaveFile(file){
 try{
  if(!file)return;
  if(file.size>5*1024*1024)throw Error('Plik przekracza limit 5 MB.');
  const data=validImport(JSON.parse(await file.text()));
  if(!confirm(`Importować zapis postaci „${data.name}” (poziom ${data.level})?\n\nZastąpi to aktualny zapis „${state.name}” (poziom ${state.level}). Obecny zapis zostanie zabezpieczony jako lokalna kopia.`))return;
  backupCurrentAndReplace(data);
  activateImportedSave(data,'Zaimportowano zapis');
 }catch(err){message='Nie udało się zaimportować: '+(err instanceof SyntaxError?'plik nie jest prawidłowym JSON.':err.message);render();}
}
function restoreSaveBackup(){
 const b=localStorage.getItem(BACKUP_KEY);
 if(!b){message='Brak poprzedniego zapisu do przywrócenia.';render();return}
 try{
  const restored=validImport(JSON.parse(b));
  if(!confirm(`Przywrócić kopię postaci „${restored.name}” (poziom ${restored.level})?\nBieżący zapis zostanie nadpisany.`))return;
  backupCurrentAndReplace(restored);
  // Zachowaj dotychczasowy zapis jako nową kopię, co umożliwia cofnięcie tej operacji.
  activateImportedSave(restored,'Przywrócono kopię zapisu');
 }catch(err){message='Nie udało się przywrócić kopii: '+err.message;render();}
}
function bunker(){const h=hideoutState(),r=BUNKER_ROOMS[activeBunkerRoom]||BUNKER_ROOMS.bedroom;return section('Kryjówka',`<div class="hideout-screen"><div class="hideout-title"><div><div class="tag">SEKTOR 17 · SCHRON MODUŁOWY</div><h3>Twoja baza</h3></div><div class="hideout-legend"><span class="hideout-pill">Pomieszczenia mają własne funkcje</span><span class="hideout-pill">Testowe cofanie poziomów</span></div></div>${bunkerRoomsOverview(h)}<div class="bunker-focused"><div class="bunker-focused-head"><div><span class="tag">WYBRANE POMIESZCZENIE</span><h3>${r.name}</h3></div><span class="hideout-pill">Poziom pomieszczenia: ${roomLevel(activeBunkerRoom)} / 5</span></div>${bunkerRoomSvg(activeBunkerRoom,h)}<p class="bunker-room-description">${r.desc}</p><div class="bunker-meta"><span>${roomBonusText(activeBunkerRoom)}</span><span>${r.unlock}</span></div>${roomUpgradePanel(activeBunkerRoom)}${activeBunkerRoom==='bedroom'?`<p class="hideout-hint">Wyposażenie sypialni jest częścią gotowego obrazu pomieszczenia. Rozbuduj lub testowo cofnij poziom, aby zobaczyć różnicę między scenami.</p>`:activeBunkerRoom==='storage'?`<div class="bunker-links"><button class="primary" data-page="storage">Otwórz magazyn surowców</button></div>`:activeBunkerRoom==='workshop'?`<div class="bunker-links"><button class="primary" data-page="workshop">Przejdź do ulepszania ekwipunku</button></div>`:activeBunkerRoom==='sanctuary'?`<div class="bunker-links"><button class="primary" data-page="companion">Zobacz towarzyszy</button></div>`:activeBunkerRoom==='garage'?`<div class="bunker-links"><button class="primary" data-page="transport">Zobacz transport</button></div>`:`<div class="bunker-links"><button data-page="character">Zobacz postać i maksymalne PŻ</button></div>`}</div><div class="hideout-hint">Sześć pomieszczeń daje bonusy do wypraw, odzysku, ulepszeń, towarzyszy, transportu i maksymalnych PŻ. Nowe moduły mają pięć poziomów rozwoju i są dostępne do testów bez kosztów; grafiki pomieszczeń są aktualizowane wraz z wersją gry.</div><div class="actions" style="margin-top:14px"><button data-page="workshop">Warsztat</button><button data-page="storage">Magazyn</button></div></div><div class="panel section" style="margin-top:14px"><h3 style="color:var(--gold)">Zapis i bezpieczeństwo</h3><p class="small muted">Eksport zapisuje postać i ekwipunek do pliku JSON. Import zastępuje obecny stan gry. Przed importem automatycznie zachowamy poprzedni zapis w pamięci tej przeglądarki.</p><div class="actions"><button data-action="export">Eksportuj zapis (JSON)</button><button class="primary" data-action="import">Importuj zapis JSON</button><button data-action="restore-backup">Przywróć poprzedni zapis</button><button data-action="reset">Nowa gra / reset</button></div><p class="small muted">Po imporcie gra odświeży stronę. Pliki z zapisami przechowuj u siebie, nie w publicznym repozytorium GitHub.</p></div>`) }

// ASHEN 0.2.3: local-only mailbox and per-attacker/per-defender daily PvP limits.
// Clock and persistence are browser-controlled in this prototype; enforce on server online.
const PVP_ATTACK_LIMIT=2;
function pvpDayKey(date=new Date()){
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
 return `${y}-${m}-${d}`;
}
function pvpDailyUsed(s,targetId){
 const v=pvpData(s),d=v.dailyAttacks;
 return d&&d.date===pvpDayKey()?Math.max(0,Number(d.targets?.[targetId])||0):0;
}
function pvpRecordAttack(s,targetId){
 const v=pvpData(s),today=pvpDayKey();
 if(!v.dailyAttacks||v.dailyAttacks.date!==today)v.dailyAttacks={date:today,targets:{}};
 v.dailyAttacks.targets[targetId]=(Number(v.dailyAttacks.targets[targetId])||0)+1;
}
function mailbox(s){
 if(!s.mailbox||typeof s.mailbox!=='object'||Array.isArray(s.mailbox))s.mailbox={};
 if(!Array.isArray(s.mailbox.inbox))s.mailbox.inbox=[];
 if(!Array.isArray(s.mailbox.sent))s.mailbox.sent=[];
 return s.mailbox;
}
function mailboxUnread(s){return mailbox(s).inbox.filter(m=>!m.read).length}
function mailAdd(s,folder,msg){const box=mailbox(s);box[folder].unshift(msg);box[folder]=box[folder].slice(0,150)}
let mailFolder='inbox',mailOpenedId=null,mailComposeTo=null;
function mailSend(targetId,body){
 const selfId=devActiveId(),target=devProfileList().find(p=>p.id===targetId);
 if(!target||targetId===selfId)throw Error('Wybierz innego odbiorcę.');
 const text=String(body||'').trim();
 if(text.length<1||text.length>1500)throw Error('Wiadomość powinna mieć od 1 do 1500 znaków.');
 const targetKey=targetId==='main'?LEGACY_KEY:devProfileSaveKey(targetId),raw=localStorage.getItem(targetKey);
 if(!raw)throw Error('Brak zapisu odbiorcy.');
 const targetSave=JSON.parse(raw);
 if(!targetSave.created)throw Error('Odbiorca nie utworzył jeszcze postaci.');
 const id='mail-'+Date.now()+'-'+Math.random().toString(36).slice(2,10),at=new Date().toLocaleString('pl-PL');
 const entry={id,kind:'personal',fromId:selfId,from:state.name,toId:targetId,to:targetSave.name,subject:'Wiadomość od '+state.name,body:text,at,read:false};
 mailAdd(targetSave,'inbox',{...entry});
 mailAdd(state,'sent',{...entry,read:true});
 localStorage.setItem(targetKey,JSON.stringify(targetSave));
 if(targetId==='main')localStorage.setItem(devProfileSaveKey('main'),JSON.stringify(targetSave));
 save();mailComposeTo=null;mailFolder='sent';message='Wiadomość została wysłana.';render();
}
function mailOpen(id){
 const entries=mailbox(state)[mailFolder],found=entries.find(m=>m.id===id);
 if(!found)return;
 if(mailFolder==='inbox'&&!found.read){found.read=true;save()}
 mailOpenedId=id;render();
}
function messages(){
 const box=mailbox(state),entries=box[mailFolder],unread=mailboxUnread(state);
 const opened=entries.find(m=>m.id===mailOpenedId);
 const others=pvpOtherProfiles();
 const recipient=mailComposeTo===null?'':mailComposeTo;
 return section('Wiadomości',`<div class="mail-intro"><span class="tag">ASHEN 0.2.4 · SKRZYNKA LOKALNA</span><h3>Korespondencja ocalałych</h3><p>Raporty z ataków PvP trafiają automatycznie do obrońcy. Możesz też pisać prywatne wiadomości do innych profili testowych.</p><p class="small muted">Wersja offline — wiadomości działają między postaciami w tej samej przeglądarce. Prawdziwa dostawa online wymaga serwera.</p></div><div class="mail-toolbar"><button type="button" data-mail-folder="inbox" class="${mailFolder==='inbox'?'primary':''}">Odebrane (${unread} nowych)</button><button type="button" data-mail-folder="sent" class="${mailFolder==='sent'?'primary':''}">Wysłane</button><button type="button" data-mail-compose="1" class="primary">+ Napisz wiadomość</button></div>${mailComposeTo!==null?`<div class="mail-compose"><h3>Nowa wiadomość</h3><label for="mail-target">Odbiorca</label><select class="input" id="mail-target">${others.map(p=>`<option value="${escape(p.id)}" ${recipient===p.id?'selected':''}>${escape(p.save.name)} (${escape(p.label)})</option>`).join('')}</select><label for="mail-body">Treść</label><textarea id="mail-body" class="input" rows="6" maxlength="1500" placeholder="Napisz wiadomość..."></textarea><div class="actions"><button type="button" class="primary" data-mail-send="1" ${others.length?'':'disabled'}>Wyślij</button><button type="button" data-mail-cancel="1">Anuluj</button></div></div>`:opened?`<article class="mail-detail"><span class="tag">${opened.kind==='battle'?'AUTOMATYCZNY RAPORT PvP':'PRYWATNA WIADOMOŚĆ'}</span><h3>${escape(opened.subject)}</h3><p class="small muted">Od: ${escape(opened.from)} · Do: ${escape(opened.to)} · ${escape(opened.at)}</p><p class="mail-text">${escape(opened.body)}</p><div class="actions">${opened.kind==='battle'?`<button type="button" data-mail-report="${escape(opened.reportId||'')}">Zobacz szczegółowy raport walki</button>`:''}${opened.kind==='personal'&&opened.fromId!==devActiveId()?`<button type="button" data-mail-reply="${escape(opened.fromId)}">Odpowiedz</button>`:''}<button type="button" data-mail-back="1">Wróć do listy</button></div></article>`:`<div class="mail-list">${entries.length?entries.map(m=>`<button type="button" class="mail-row ${m.read?'':'unread'}" data-mail-open="${escape(m.id)}"><span>${m.read?'✉':'●'} ${escape(m.kind==='battle'?'Raport PvP':m.from)}</span><strong>${escape(m.subject)}</strong><small>${escape(m.at)}</small></button>`).join(''):'<p class="muted">Brak wiadomości w tej skrzynce.</p>'}</div>`}`);
}
// ASHEN 0.2.2: isolated OFFLINE PvP. No items, permanent HP, XP or resources move between profiles.
let pvpSelectedId=null,pvpOpenedReport=null;
function pvpData(s){if(!s.pvp||typeof s.pvp!=='object'||Array.isArray(s.pvp))s.pvp={};const v=s.pvp;
 if(!Array.isArray(v.history))v.history=[];
 for(const k of ['attackWins','attackLosses','attackDraws','defenseWins','defenseLosses','defenseDraws'])if(!Number.isFinite(v[k])||v[k]<0)v[k]=0;
 return v;
}
function pvpOtherProfiles(){return devProfileList().filter(p=>p.id!==devActiveId()).map(p=>({...p,save:devProfileState(p.id)})).filter(p=>p.save.created&&p.save.version===1)}
function pvpSnapshot(profileSave){
 // Reuse the exact current player-equipment functions for BOTH fighters.
 // No mutations of player saves or equipment; the temporary state is always restored.
 const previous=state;
 try{
  state=profileSave;
  const a=attrs(), attacks=heroAttacks().map(x=>({hand:x.hand,power:x.power,weapon:{...x.weapon}}));
  const d=heroDefense();
  return {name:profileSave.name,origin:normalizeOrigin(profileSave.origin),gender:normalizeGender(profileSave.gender),level:profileSave.level,attrs:{...a},attacks,
   hp:d.hp,armor:d.armor,dodge:d.dodge,acc:d.acc};
 }finally{state=previous}
}
// ASHEN 0.3.5: indywidualne nagrody klanowe. Idempotencja w zapisie postaci,
// niezależnie od potwierdzenia odbioru po stronie Supabase.
window.ASHEN_APPLY_EXPEDITION_REWARD=function(reward){
 const cloud=window.ASHEN_CLOUD;
 if(!cloud?.getSession()?.user?.id || cloud.getBoundSlot()!==cloud.currentSlot())
  throw Error('Najpierw przypisz aktywną postać do zalogowanego konta w panelu Konto online.');
 if(!state.created)throw Error('Aktywna postać nie jest utworzona.');
 const id=Number(reward?.id);
 if(!Number.isSafeInteger(id)||id<1)throw Error('Błędny identyfikator nagrody.');
 const key=String(id),history=Array.isArray(state.expeditionRewardIds)?state.expeditionRewardIds:[];
 if(history.includes(key))return {alreadyApplied:true,name:state.name,levels:0};
 const xp=Number(reward.xp),credits=Number(reward.credits),scrap=Number(reward.scrap);
 if(![xp,credits,scrap].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=100000))throw Error('Nieprawidłowe wartości nagrody.');
 const itemId=reward.item_id==null?null:String(reward.item_id),rar=Number(reward.item_rarity);
 if(itemId&&(!items.some(x=>x.id===itemId&&x.slot!=='material')||!Number.isInteger(rar)||rar<0||rar>4))
  throw Error('Nieznany przedmiot w nagrodzie — nie można bezpiecznie odebrać łupu.');
 const previous=JSON.stringify(state),prevMessage=message;
 try{
  state.expeditionRewardIds=[...history,key];
  state.xp+=xp; state.credits+=credits; state.scrap+=scrap;
  if(itemId)state.inventory.push({uid:'raid-'+key,id:itemId,rarity:rar,prefix:null,suffix:null,locked:rar>=3});
  const levels=levelUp();
  const data=JSON.stringify(state);
  localStorage.setItem(KEY,data);
  if(localStorage.getItem(KEY)!==data)throw Error('Przeglądarka nie potwierdziła zapisu nagrody.');
  if(devActiveId()==='main')localStorage.setItem(devProfileSaveKey('main'),data);
  window.ASHEN_ONLINE?.localChanged?.();
  message='Odebrano nagrodę za ekspedycję: '+xp+' EXP, '+credits+' kredytów, '+scrap+' złomu'+(itemId?' oraz przedmiot':'')+'.';
  render();
  return {alreadyApplied:false,name:state.name,levels};
 }catch(err){
  state=JSON.parse(previous);message=prevMessage;
  try{localStorage.setItem(KEY,previous);if(devActiveId()==='main')localStorage.setItem(devProfileSaveKey('main'),previous)}catch{}
  throw err;
 }
};
window.ASHEN_GET_ONLINE_SNAPSHOT=()=>pvpSnapshot(state);
function pvpResolve(first,second){
 const fighters=[{...first,hp:first.hp},{...second,hp:second.hp}];
 const maxHp=fighters.map(x=>x.hp),events=[],rounds=[];
 const totals=fighters.map(()=>({attempts:0,hits:0,misses:0,critical:0,damage:0}));
 for(let r=1;r<=10&&fighters.every(x=>x.hp>0);r++){
  const details=[],start=fighters.map(x=>x.hp);
  const firstInitiative=rand(1,20)+fighters[0].attrs.dex,secondInitiative=rand(1,20)+fighters[1].attrs.dex;
  const order=firstInitiative>=secondInitiative?[0,1]:[1,0];
  for(const i of order){
   const opponent=1-i,a=fighters[i],d=fighters[opponent];if(a.hp<=0||d.hp<=0)break;
   for(const strike of a.attacks){
    if(a.hp<=0||d.hp<=0)break;
    const t=totals[i],w=strike.weapon;t.attempts++;
    const chance=clamp(70+2*(weaponAccuracy(a.attrs,w)-d.dodge)+(w.accuracy||0),15,95);
    const label=`${a.name}: ${w.name||'Broń'} (${strike.hand==='left'?'lewa':'prawa'} ręka)`;
    if(Math.random()*100>=chance){t.misses++;details.push(`${label} — pudło.`);continue}
    const critical=Math.random()<clamp(.05+a.attrs.per*.005+(w.critPp||0)/100,0,.35);
    const bonus=weaponAttributeDamage(a.attrs,w);
    let raw=Math.max(1,Math.floor((rand(w.min,w.max)+bonus)*strike.power));
    if(critical)raw=Math.floor(raw*1.6);
    const dealt=Math.min(d.hp,Math.max(1,Math.floor(raw*(1-clamp(d.armor/100,0,.6)))));
    d.hp-=dealt;t.hits++;t.damage+=dealt;if(critical)t.critical++;
    details.push(`${label} — ${dealt} obrażeń${critical?' (KRYTYCZNE)':''}.`);
   }
  }
  rounds.push({number:r,events:details,hp:fighters.map(x=>x.hp),damage:start.map((h,i)=>h-fighters[i].hp)});
  events.push(...details);
 }
 const winner=fighters[0].hp<=0?1:fighters[1].hp<=0?0:null;
 return {winner,rounds,totals,hp:fighters.map(x=>x.hp),maxHp};
}
function pvpStart(targetId){
 const ownId=devActiveId(),opponent=devProfileList().find(x=>x.id===targetId);
 if(!opponent||targetId===ownId)throw Error('Nieprawidłowy przeciwnik.');
 const opponentKey=targetId==='main'?LEGACY_KEY:devProfileSaveKey(targetId);
 const saved=localStorage.getItem(opponentKey);
 if(!saved)throw Error('Nie znaleziono zapisu przeciwnika.');
 const opponentState=JSON.parse(saved);
 if(!opponentState?.created||opponentState.version!==1)throw Error('Przeciwnik nie ma jeszcze gotowej postaci.');
 const used=pvpDailyUsed(state,targetId);
 if(used>=PVP_ATTACK_LIMIT)throw Error('Limit 2 ataków dziennie na tego przeciwnika został wykorzystany. Kolejne ataki będą dostępne po północy.');
 if(!confirm(`Rozpocząć walkę PvP: ${state.name} kontra ${opponentState.name}?\n\nMaksymalnie 10 rund. Każde starcie ma osobne HP. Ekwipunek i zasoby obu postaci pozostają bez zmian.`))return;
 const own=pvpSnapshot(state),def=pvpSnapshot(opponentState),result=pvpResolve(own,def);
 const won=result.winner===null?'draw':result.winner===0?'win':'loss';
 const id='pvp-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
 const timestamp=new Date().toLocaleString('pl-PL');
 const report={id,at:timestamp,attackerId:ownId,defenderId:targetId,attacker:own,defender:def,...result};
 pvpRecordAttack(state,targetId);
 const left=pvpData(state),right=pvpData(opponentState);
 const keyA=won==='win'?'attackWins':won==='loss'?'attackLosses':'attackDraws';
 const keyD=won==='win'?'defenseLosses':won==='loss'?'defenseWins':'defenseDraws';
 left[keyA]++;right[keyD]++;
 left.history.unshift({id,side:'attack',result:won,report});
 right.history.unshift({id,side:'defense',result:won==='win'?'loss':won==='loss'?'win':'draw',report});
 left.history=left.history.slice(0,40);right.history=right.history.slice(0,40);
 const reportTitle=won==='win'?'Przegrana obrona':won==='loss'?'Udana obrona':'Remis w obronie';
 const notice={id:'battle-'+id,kind:'battle',fromId:ownId,from:state.name,toId:targetId,to:opponentState.name,subject:reportTitle+' — atak '+state.name,body:state.name+' zaatakował(a) Twoją postać. Wynik: '+(won==='win'?'porażka':won==='loss'?'zwycięstwo':'remis')+'. Szczegółowy raport znajdziesz w tej wiadomości oraz w zakładce PvP.',at:timestamp,read:false,reportId:id};
 mailAdd(opponentState,'inbox',notice);
 // Preserve only PvP stats in the defender save. No inventory/HP/XP/currency changes.
 localStorage.setItem(opponentKey,JSON.stringify(opponentState));
 if(targetId==='main')localStorage.setItem(devProfileSaveKey('main'),JSON.stringify(opponentState));
 save();pvpOpenedReport=id;pvpSelectedId=targetId;message='';render();
}
function pvpStatistics(p){const v=pvpData(p),wins=v.attackWins+v.defenseWins,losses=v.attackLosses+v.defenseLosses,draws=v.attackDraws+v.defenseDraws;return {wins,losses,draws,points:wins*3+draws}}
function pvpReport(entry){
 if(!entry)return '';
 const r=entry.report,role=entry.side==='attack'?0:1,foe=1-role;
 const current=r.winner===null?'REMIS':r.winner===role?'ZWYCIĘSTWO':'PORAŻKA';
 const a=r.attacker,b=r.defender;
 return `<article class="pvp-report"><div class="pvp-report-head"><span class="tag">${escape(r.at)} · WALKI PvP</span><h3>${current} · ${escape(a.name)} vs ${escape(b.name)}</h3><p>10 rund maksymalnie · Bez utraty ekwipunku, PŻ i zasobów</p></div><div class="pvp-duel-summary">${[a,b].map((f,i)=>`<div><img src="${characterFigure(f.origin,f.gender)}" alt="${escape(f.name)}"><h4>${escape(f.name)}</h4><small>${i===0?'Atakujący':'Obrońca'} · Poziom ${f.level}</small><strong>PŻ: ${r.hp[i]} / ${r.maxHp[i]}</strong><small>Pancerz ${f.armor.toFixed(0)} · Unik ${f.dodge.toFixed(0)}</small><small>Ataki ${r.totals[i].attempts} · Trafienia ${r.totals[i].hits} · Krytyki ${r.totals[i].critical}</small><strong>Obrażenia: ${r.totals[i].damage}</strong></div>`).join('')}</div><div class="pvp-rounds">${r.rounds.map(x=>`<details><summary>Runda ${x.number} · ${escape(a.name)} ${x.hp[0]}/${r.maxHp[0]} PŻ · ${escape(b.name)} ${x.hp[1]}/${r.maxHp[1]} PŻ</summary>${x.events.map(line=>`<p>${escape(line)}</p>`).join('')}</details>`).join('')}</div><button type="button" data-pvp-report-close="1">Wróć do PvP</button></article>`
}
function pvp(){
 const opponents=pvpOtherProfiles(),all=devProfileList().map(x=>({...x,save:devProfileState(x.id)})).filter(x=>x.save.created&&x.save.version===1);
 const mine=pvpStatistics(state),history=pvpData(state).history,opened=history.find(x=>x.id===pvpOpenedReport);
 if(opened)return section('Arena PvP',pvpReport(opened));
 return section('Arena PvP',`<div class="pvp-intro"><span class="tag">ASHEN 0.2.4 · TESTY LOKALNE</span><h3>Starcia między postaciami</h3><p>Wybierz inny zapisany profil i stocz automatyczną walkę do 10 rund. Każdy walczy z pełnym HP obliczonym z własnych statystyk i wyposażenia. Po walce nie ma trwałych obrażeń, przejmowania przedmiotów ani utraty waluty. Każdy atakujący może zaatakować konkretnego obrońcę maksymalnie 2 razy dziennie. Limit odnawia się o północy.</p><p class="muted small">To prototyp offline. Nie są to prawdziwe konta online. Wyniki testowe można później zastąpić wynikami rozliczanymi na serwerze.</p></div><div class="pvp-metrics"><div><small>Twoje zwycięstwa</small><strong>${mine.wins}</strong></div><div><small>Porażki</small><strong>${mine.losses}</strong></div><div><small>Remisy</small><strong>${mine.draws}</strong></div><div><small>Punkty</small><strong>${mine.points}</strong></div></div><h3>Wybierz przeciwnika</h3><div class="pvp-choices">${opponents.length?opponents.map(p=>`<article class="pvp-choice"><img src="${characterFigure(p.save.origin,p.save.gender)}" alt="${escape(p.save.name)}"><div><span class="tag">${escape(p.label)}</span><h4>${escape(p.save.name)}</h4><p class="small muted">${originTitle(p.save.origin,p.save.gender)} · Poziom ${p.save.level}</p><p class="small muted">Ataki dziś: ${pvpDailyUsed(state,p.id)} / ${PVP_ATTACK_LIMIT} · Reset o północy</p><button class="primary" type="button" data-pvp-fight="${escape(p.id)}" ${pvpDailyUsed(state,p.id)>=PVP_ATTACK_LIMIT?'disabled':''}>${pvpDailyUsed(state,p.id)>=PVP_ATTACK_LIMIT?'Limit wyczerpany':'⚔ Zaatakuj'}</button></div></article>`).join(''):'<div class="notice">Brak gotowych przeciwników. Utwórz postać na innym profilu testowym, aby rozpocząć walkę PvP.</div>'}</div><h3>Ranking lokalny</h3><div class="pvp-ranking">${all.sort((x,y)=>pvpStatistics(y.save).points-pvpStatistics(x.save).points).map((p,i)=>{const q=pvpStatistics(p.save);return `<div class="pvp-rank"><strong>${i+1}. ${escape(p.save.name)}</strong><span>${originTitle(p.save.origin,p.save.gender)} · Poz. ${p.save.level}</span><span>${q.wins} W / ${q.losses} P / ${q.draws} R</span><b>${q.points} pkt</b></div>`}).join('')}</div><h3>Ostatnie raporty PvP</h3><div class="pvp-history">${history.length?history.slice(0,15).map(x=>{const opp=x.side==='attack'?x.report.defender:x.report.attacker;return `<button type="button" data-pvp-report="${escape(x.id)}"><span>${escape(x.at)}</span><strong>${x.result==='win'?'✓ Zwycięstwo':x.result==='loss'?'✕ Porażka':'= Remis'}</strong><span>vs ${escape(opp.name)}</span></button>`}).join(''):'<p class="muted">Nie rozegrano jeszcze walk PvP.</p>'}</div>`);
}

const origins={scout:{desc:'Szybki i spostrzegawczy. +2 Zręczności, +1 Percepcji.',bonus:{dex:2,per:1}},fighter:{desc:'Wytrzymały wojownik. +2 Siły, +1 Wytrzymałości.',bonus:{str:2,end:1}},tech:{desc:'Specjalista od technologii. +2 Inteligencji, +1 Percepcji.',bonus:{int:2,per:1}}};
function creation(){return `<div class="hero"><div class="sub">SCHRON 17 · POCZĄTEK HISTORII</div><h1>Stwórz Wędrowca</h1><p class="muted">Najpierw wybierz płeć, a następnie archetyp. Każdy z trzech archetypów ma pełny odpowiednik męski i żeński — różni się wygląd, ale bonusy startowe pozostają takie same.</p></div><div class="panel creation-panel"><label for="hero-name">Imię Wędrowca</label><input class="input" id="hero-name" maxlength="24" value="${escape(state.name)}" placeholder="Wpisz imię" style="margin:9px 0 18px"><h3 style="color:var(--gold)">Płeć postaci</h3><div class="creation-gender-grid"><label class="gender-card ${state.gender==='male'?'selected':''}"><input type="radio" name="gender" value="male" ${state.gender==='male'?'checked':''}><span class="tag">WARIANT A</span><strong>Mężczyzna</strong><small>3 archetypy męskie</small></label><label class="gender-card ${state.gender==='female'?'selected':''}"><input type="radio" name="gender" value="female" ${state.gender==='female'?'checked':''}><span class="tag">WARIANT B</span><strong>Kobieta</strong><small>3 archetypy żeńskie</small></label></div><h3 style="color:var(--gold);margin-top:18px">Archetyp</h3><div class="creation-origin-grid">${Object.entries(origins).map(([id,o])=>`<label class="origin-card ${state.origin===id?'selected':''}"><input type="radio" name="origin" value="${id}" ${state.origin===id?'checked':''}><div class="origin-card-visual"><img src="${characterFigure(id,state.gender)}" alt="Pełna sylwetka: ${originTitle(id,state.gender)}" loading="eager"></div><div class="origin-card-body"><span class="tag">${genderLabel(state.gender)}</span><h3>${originTitle(id,state.gender)}</h3><p class="small muted">${o.desc}</p></div></label>`).join('')}</div><h3 style="color:var(--gold)">Ręka dominująca</h3><p class="small muted">Wybór nie zmienia siły postaci. Dominująca ręka atakuje z mocą 100%, druga z mocą 80%.</p><div class="actions"><label class="tile"><input type="radio" name="dominantHand" value="right" ${state.dominantHand==='right'?'checked':''}> Prawa</label><label class="tile"><input type="radio" name="dominantHand" value="left" ${state.dominantHand==='left'?'checked':''}> Lewa</label></div><p class="small muted">Po rozpoczęciu otrzymasz 5 dodatkowych punktów do rozdania i podstawowy ekwipunek.</p><div class="actions" style="margin-top:10px"><button class="primary" data-action="create">Rozpocznij przygodę →</button><button data-action="import">Wczytaj istniejącą postać (JSON)</button><button data-action="restore-backup">Przywróć kopię zapasową</button></div></div>`}
function render(){sync();document.body.classList.toggle('arena-report-modal-open',(page==='arena'&&arenaReportOpen!==null)||(page==='expeditions'&&window.ASHEN_EXPEDITIONS?.isReportOpen?.()));let views={character,companion,transport,missions,arena,pvp:()=> (window.ASHEN_ONLINE?.pvpHtml()||'')+pvp(),messages:()=>window.ASHEN_ONLINE?.mailHtml()||'<p>Wczytywanie wiadomości…</p>',clans:()=>window.ASHEN_CLANS?.html()||'<p>Wczytywanie klanów…</p>',players:()=>window.ASHEN_PLAYERS?.html()||'<p>Wczytywanie graczy…</p>',expeditions:()=>window.ASHEN_EXPEDITIONS?.html()||'<p>Wczytywanie ekspedycji…</p>',inventory,workshop,storage,reports,bunker};$('app').innerHTML=`<div class="shell ashen-wide-shell ${page==='missions'?'ashen-missions-shell':''} ${page==='character'?'ashen-character-shell':''} ashen-premium-shell"><header class="header"><div><div class="brand">ASHEN</div><div class="sub">KRONIKI UPADKU · v${APP_VERSION}</div></div><div class="dev-profile-header"><small>TRYB LOKALNY + OPCJONALNY ZAPIS ONLINE</small><div class="ashen-cloud-header-actions"><button type="button" data-cloud-open="1">☁ Konto online</button><button type="button" data-dev-panel="1">☷ Profil: ${escape(devCurrentLabel())}</button></div></div></header>${devPanelOpen?devPanel():''}<div class="layout"><aside class="sidebar"><strong>${escape(state.name)}</strong><p class="muted">Poziom ${state.level} · ${originTitle(state.origin,state.gender)}</p><p class="small good">Energia: ∞ (testy)</p><p class="small muted">🪙 ${state.credits.toLocaleString('pl-PL')} kredytów · ⚙ ${state.scrap} złomu</p><nav class="nav">${state.created?nav():''}</nav></aside><main class="main">${state.created?resourceBar():''}${message&&!(page==='arena'&&arenaReportOpen!==null)&&!(page==='expeditions'&&window.ASHEN_EXPEDITIONS?.isReportOpen?.())?`<div class="notice" style="margin-bottom:12px">${escape(message)}</div>`:''}${state.created?views[page]():creation()}${itemDetailContent()}<div class="footer">ASHEN v${APP_VERSION} · 5 profili lokalnych · Opcjonalna chmura</div><input id="ashen-import-file" type="file" accept=".json,application/json" hidden aria-label="Plik zapisu gry JSON"></main></div></div>${window.ASHEN_PLAYERS?.dialog?.()||''}`;let c=$('countdown');if(c)c.textContent=Math.max(0,Math.ceil((state.mission?.ends-Date.now())/1000))+' s'}
function act(e){if(e.target?.matches?.('[data-arena-overlay]')){arenaReportOpen=null;render();return}let b=e.target.closest('button');if(!b)return;if(b.dataset.mailFolder){mailFolder=b.dataset.mailFolder;mailOpenedId=null;mailComposeTo=null;render();return}if(b.dataset.mailCompose){mailComposeTo='';mailOpenedId=null;render();return}if(b.dataset.mailCancel){mailComposeTo=null;render();return}if(b.dataset.mailOpen){mailOpen(b.dataset.mailOpen);return}if(b.dataset.mailBack){mailOpenedId=null;render();return}if(b.dataset.mailReply){mailComposeTo=b.dataset.mailReply;mailOpenedId=null;render();return}if(b.dataset.mailSend){try{mailSend($('mail-target')?.value,$('mail-body')?.value)}catch(err){message=err.message;render()}return}if(b.dataset.mailReport){const found=pvpData(state).history.find(x=>x.id===b.dataset.mailReport);if(found){pvpOpenedReport=found.id;setPage('pvp');render()}else{message='Raport został usunięty ze starszej historii PvP.';render()}return}if(b.dataset.pvpFight){try{pvpStart(b.dataset.pvpFight)}catch(err){message=err.message;render()}return}if(b.dataset.pvpReport){pvpOpenedReport=b.dataset.pvpReport;render();return}if(b.dataset.pvpReportClose){pvpOpenedReport=null;render();return}if(b.dataset.devPanel){devPanelOpen=!devPanelOpen;if(!devPanelOpen)devPendingResetId=null;render();return}if(b.dataset.devCreate){try{devCreateProfile()}catch(err){message=err.message;render()}return}if(b.dataset.devSwitch){try{devSwitch(b.dataset.devSwitch)}catch(err){message=err.message;render()}return}if(b.dataset.devDelete){try{devDeleteProfile(b.dataset.devDelete)}catch(err){message=err.message;render()}return}if(b.dataset.devResetCancel){devPendingResetId=null;render();return}if(b.dataset.devResetConfirm){try{devResetTestProfile(b.dataset.devResetConfirm)}catch(err){message=err.message;render()}return}if(b.dataset.devReset){try{devAskResetTestProfile(b.dataset.devReset)}catch(err){message=err.message;render()}return}if(b.hasAttribute('data-item-close')){openItemDetail=null;render();return}if(b.dataset.itemOpen){openItemDetail={kind:'owned',id:b.dataset.itemOpen};render();return}if(b.dataset.itemCatalog){openItemDetail={kind:'catalog',id:b.dataset.itemCatalog};render();return}if(b.dataset.wlabStress){weaponStressRun();return}if(b.dataset.wlabStressCopy){weaponStressCopy();return}if(b.dataset.wlabCandidate){weaponCandidateRun();return}if(b.dataset.wlabCandidateCopy){weaponCandidateCopy();return}if(b.dataset.wlabNormal){weaponNormalRun();return}if(b.dataset.wlabNormalCopy){weaponNormalCopy();return}if(b.dataset.wlabKits){weaponKitRun();return}if(b.dataset.wlabKitsCopy){weaponKitCopy();return}if(b.dataset.wlabBalance){weaponBalanceRun();return}if(b.dataset.wlabBalanceCopy){weaponBalanceCopy();return}if(b.dataset.wlabPreset){weaponLabPreset(b.dataset.wlabPreset);return}if(b.dataset.weaponLabRun){weaponLabReadControls();weaponLabRun();return;}if(b.dataset.combatLabRun){const selected=$('combat-lab-enemy')?.value;const count=Number($('combat-lab-count')?.value);const rounds=Number($('combat-lab-rounds')?.value);if([10,15,20].includes(rounds))combatLabRounds=rounds;if(COMBAT_LAB_FOES[selected])combatLabEnemy=selected;if([10,100,1000].includes(count))combatLabCount=count;combatLabRun();return;}if(b.dataset.arenaTestToggle){arenaTestMode=!arenaTestMode;arenaReportOpen=null;arenaTestReport=null;message='';render();return;}if(b.dataset.arenaChapter){arenaChapter=Number(b.dataset.arenaChapter);arenaSelected=(arenaChapter-1)*10+1;message='';render();return;}if(b.dataset.arenaSelect){arenaSelected=Number(b.dataset.arenaSelect);arenaChapter=Math.ceil(arenaSelected/10);message='';render();return;}if(b.dataset.arenaFight){startArenaFight(Number(b.dataset.arenaFight));return;}if(b.dataset.arenaReport){arenaReportOpen=Number(b.dataset.arenaReport);message='';render();return;}if(b.dataset.arenaReportClose!==undefined){arenaReportOpen=null;render();return;}if(b.dataset.missionDetail){const key=b.dataset.missionDetail;if(key==='report'||key==='loot'){missionExpand[key]=!missionExpand[key];render()}return;}if(b.dataset.action==='mission-dismiss-result'){state.missionOutcomePending=false;save();render();return;}if(b.dataset.companionTestStage){const [id,n]=b.dataset.companionTestStage.split(':');companionTestStage(id,n);return}if(b.dataset.companionTestSelect){companionTestSelect(b.dataset.companionTestSelect);return}if(b.dataset.vehicleTestSelect){vehicleTestSelect(b.dataset.vehicleTestSelect);return}if(b.dataset.vehicleTestUnlock){testUnlockVehicle(b.dataset.vehicleTestUnlock);return}if(b.dataset.vehicleStage){const [id,n]=b.dataset.vehicleStage.split(':');selectVehicleStage(id,n);return}if(b.dataset.vehicleModule){upgradeVehicleModule(b.dataset.vehicleModule);return}if(b.dataset.companion){chooseCompanion(b.dataset.companion);return}if(b.hasAttribute('data-companion-upgrade')){upgradeCompanion();return}if(b.dataset.vehicle){acquireVehicle(b.dataset.vehicle);return}if(b.hasAttribute('data-vehicle-upgrade')){upgradeVehicle();return}if(b.dataset.bunkerRoom&&BUNKER_ROOMS[b.dataset.bunkerRoom]){activeBunkerRoom=b.dataset.bunkerRoom;message='';render();return;}if(b.dataset.roomTestLevel){const [id,level]=b.dataset.roomTestLevel.split(':');roomTestSet(id,level);return}if(b.dataset.roomUpgrade){roomUpgrade(b.dataset.roomUpgrade);return}if(b.dataset.roomDowngrade){roomDowngrade(b.dataset.roomDowngrade);return}if(b.dataset.action==='hideout-reset'){if(confirm('Przywrócić początkowe wyposażenie i oświetlenie kryjówki?')){state.hideout=hideoutDefault();message='Przywrócono podstawowy wygląd schronu.';save();render()}return}if(b.dataset.page){if(!state.created)return;arenaReportOpen=null;setPage(b.dataset.page);if(b.dataset.workshopSelect)workshopUid=b.dataset.workshopSelect;message='';render();
 if(page==='expeditions')void window.ASHEN_EXPEDITIONS?.refresh?.();
 if(page==='clans')void window.ASHEN_CLANS?.refresh?.();
 if(page==='messages'||page==='pvp')void window.ASHEN_ONLINE?.refresh?.();
 if(page==='players')void window.ASHEN_PLAYERS?.refresh?.();
 return}if(b.dataset.action==='create'){let n=$('hero-name')?.value.trim();if(!n||n.length<2||n.length>24){message='Podaj imię od 2 do 24 znaków.';render();return}state.name=n;state.gender=normalizeGender(state.gender);state.origin=normalizeOrigin(state.origin);state.created=true;let bonus=origins[state.origin]?.bonus||{};for(const [k,v] of Object.entries(bonus))state.attrs[k]+=v;message='Witaj na Pustkowiach, '+n+'!';setPage('character');save();render();return}if(b.dataset.workshopSelect){workshopUid=b.dataset.workshopSelect;render();return}if(b.dataset.workshopUpgrade){applyUpgrade(b.dataset.workshopUpgrade);return}if(b.dataset.action==='workshop-test'){grantWorkshopTest();return}if(b.dataset.action==='faction-test-pack'){grantFactionTestPack();return}if(b.dataset.dominant){if(['left','right'].includes(b.dataset.dominant)){state.dominantHand=b.dataset.dominant;message='Zmieniono rękę dominującą.';save();render()}return}if(b.dataset.attr){if(state.points>0){state.attrs[b.dataset.attr]++;state.points--;save();render()}return}if(b.dataset.mission){let l=locations.find(x=>x.id===b.dataset.mission);if(!l||state.mission)return;/* Testy: energia nie jest zużywana */state.missionOutcomePending=false;state.mission={id:l.id,started:Date.now(),durationMs:travelSeconds(l)*1000,ends:Date.now()+travelSeconds(l)*1000,exploration:explorationStats()};message='';save();render();return}if(b.dataset.lock){const inst=instance(b.dataset.lock);if(inst){inst.locked=!inst.locked;message=inst.locked?'Przedmiot zabezpieczony.':'Zdjęto zabezpieczenie.';save();render()}return}
if(b.dataset.action==='bulk-visible'){const arr=bulkEligibleVisible(invFilter);if(arr.length&&arr.every(x=>bulkSelected.has(x.uid)))arr.forEach(x=>bulkSelected.delete(x.uid));else arr.forEach(x=>bulkSelected.add(x.uid));render();return}
if(b.dataset.action==='bulk-all'){state.inventory.filter(eligibleForBulk).forEach(x=>bulkSelected.add(x.uid));render();return}
if(b.dataset.action==='bulk-clear'){bulkSelected.clear();render();return}
if(b.dataset.action==='bulk-sell'){disposeBulk('sell');return}
if(b.dataset.action==='bulk-salvage'){disposeBulk('salvage');return}
if(b.dataset.sale){disposeItem(b.dataset.sale,'sell');return}
if(b.dataset.salvage){disposeItem(b.dataset.salvage,'salvage');return}
if(b.dataset.invGroup){const groups={all:'all',weapons:'weapons-all',clothing:'clothing-all',accessories:'accessories-all',artifacts:'artifacts-all'};if(Object.prototype.hasOwnProperty.call(groups,b.dataset.invGroup)){invGroup=b.dataset.invGroup;invFilter=groups[invGroup];render()}return}if(b.dataset.filter){invFilter=b.dataset.filter;render();return}if(b.dataset.inspect){selectedUid=b.dataset.inspect;render();return}if(b.dataset.action==='close-inspect'){selectedUid=null;render();return}if(b.dataset.unequip){let slot=b.dataset.unequip;if(slot in state.equip){state.equip[slot]=null;openItemDetail=null;message='Zdjęto przedmiot.';save();render()}return}
if(b.dataset.equip!==undefined){
 let inst=instance(b.dataset.equip),obj=def(inst);if(!obj||obj.slot==='material')return;
 let slot=(obj.slot==='hand1')?(b.dataset.hand==='left'?'left':'right'):obj.slot==='hand2'?'right':obj.slot==='extra'?(['extra','extra2','extra3'].includes(b.dataset.extraSlot)?b.dataset.extraSlot:['extra','extra2','extra3'].find(s=>!state.equip[s])||'extra'):obj.slot;
 for(let key of Object.keys(state.equip))if(state.equip[key]===inst.uid)state.equip[key]=null;
 if(obj.slot==='hand2'){state.equip.right=inst.uid;state.equip.left=null}
 else if(obj.slot==='hand1'){
  if(state.equip.right&&def(instance(state.equip.right))?.slot==='hand2')state.equip.right=null;
  state.equip[slot]=inst.uid;
 }else state.equip[slot]=inst.uid;
 openItemDetail=null;message='Założono: '+statsOf(inst).name;save();render();return
}if(b.dataset.action==='rename'){let name=prompt('Imię postaci (2–24 znaki):',state.name);if(name!==null&&name.trim().length>=2&&name.trim().length<=24){state.name=name.trim();save();render()}return}if(b.dataset.action==='heal'){if(state.scrap>=20&&state.hp<maxHp()){state.scrap-=20;message='Zdrowie przywrócone.';save();render()}return}if(b.dataset.action==='import'){$('ashen-import-file')?.click();return}if(b.dataset.action==='restore-backup'){restoreSaveBackup();return}if(b.dataset.action==='reset'){if(confirm('Rozpocząć nową grę? Bieżący postęp zostanie zastąpiony, ale zapiszemy jego kopię w tej przeglądarce.')){try{backupCurrentAndReplace(fresh());location.reload()}catch(err){message=err.message;render()}}return}if(b.dataset.action==='export'){exportSave();return}}
document.addEventListener('toggle',e=>{if(e.target?.id==='ashen-set-planner')setPlannerOpen=e.target.open},true);
document.addEventListener('change',e=>{
 const t=e.target;if(!t?.dataset?.setPlanner)return;
 const typ=t.dataset.setPlanner;
 if(typ==='quality')setPlanner.quality=Math.max(0,Math.min(4,Number(t.value)||0));
 else if(['clothing','accessories'].includes(typ)){
  const idx=Number(t.dataset.setSlot);if(Number.isInteger(idx)&&idx>=0&&idx<setPlanner[typ].length)setPlanner[typ][idx]=t.value;
 }
 saveSetPlan();updateSetPlannerDisplay();
});
document.addEventListener('click',e=>{
 const button=e.target.closest?.('[data-set-preset]');if(!button)return;
 const preset=button.dataset.setPreset;const d=defaultSetPlan();
 if(preset==='full')setPlanner.clothing=Array(6).fill('armor_warden');
 else if(preset==='mixed')setPlanner.clothing=d.clothing.slice();
 else if(preset==='partial')setPlanner.clothing=['armor_warden','armor_warden','armor_warden','armor_warden','armor_nomad','armor_nomad'];
 else if(preset==='clear'){setPlanner.clothing=Array(6).fill('none');setPlanner.accessories=Array(3).fill('none')}
 saveSetPlan();setPlannerOpen=true;render();
});
document.addEventListener('change',e=>{if(e.target.closest?.('.weapon-lab-config')){weaponLabReadControls();return}if(e.target.dataset.inventorySort!==undefined){if(INVENTORY_SORTS.some(([id])=>id===e.target.value)){state.inventorySort=e.target.value;save();render()}return}if(e.target.id==='ashen-import-file'){const file=e.target.files?.[0];if(file)importSaveFile(file);return}if(e.target.dataset.bulkUid){const uid=e.target.dataset.bulkUid;const inst=instance(uid);if(e.target.checked&&eligibleForBulk(inst))bulkSelected.add(uid);else bulkSelected.delete(uid);render();return}if(e.target.name==='dominantHand'){state.dominantHand=e.target.value;return}if(e.target.name==='gender'&&['male','female'].includes(e.target.value)){let n=$('hero-name')?.value;state.gender=e.target.value;render();if(n)$('hero-name').value=n;return}if(e.target.name==='origin'&&origins[e.target.value]){let n=$('hero-name')?.value;state.origin=e.target.value;render();if(n)$('hero-name').value=n}});window.ASHEN_FORCE_RENDER=render;
window.ASHEN_OPEN_PLAYER=id=>{if(!state.created)return;void window.ASHEN_PLAYERS?.open?.(id)};
window.ASHEN_OPEN_EXPEDITION_REPORT=id=>{if(!state.created)return;setPage('expeditions');render();void window.ASHEN_EXPEDITIONS?.openReport?.(id)};
document.addEventListener('click',e=>{const summary=e.target.closest?.('.weapon-lab > summary');if(summary){weaponLabOpen=!summary.parentElement.open;weaponLabSave()}},true);
document.addEventListener('click',act);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&arenaReportOpen!==null){arenaReportOpen=null;render()} });if(!state.created)setPage('character');render();setInterval(()=>{let prev=state.mission?.id;sync();if(prev&&!state.mission){setPage('missions');render();}else{let c=$('countdown');if(c&&state.mission)c.textContent=Math.max(0,Math.ceil((state.mission.ends-Date.now())/1000))+' s';let f=$('mission-progress-fill');if(f&&state.mission){const loc=locations.find(l=>l.id===state.mission.id)||locations[0];const duration=state.mission.durationMs||travelSeconds(loc)*1000;f.style.width=Math.max(0,Math.min(100,100*(1-(state.mission.ends-Date.now())/duration)))+'%'}}},1000);
function positionPremiumTooltip(target){
 const icon=target?.closest?.('.ashen-mod-icon');if(!icon)return;
 const tip=icon.querySelector('.ashen-mod-tooltip');if(!tip)return;
 const rect=icon.getBoundingClientRect(),width=Math.min(300,Math.max(160,window.innerWidth-24));
 const x=Math.min(window.innerWidth-width/2-12,Math.max(width/2+12,rect.left+rect.width/2));
 const desiredTop=rect.top-10,above=desiredTop>150;
 tip.style.setProperty('--ashen-tip-x',`${Math.round(x)}px`);
 tip.style.setProperty('--ashen-tip-y',`${Math.round(above?rect.top-10:rect.bottom+10)}px`);
 tip.style.setProperty('--ashen-tip-side',above?'translate(-50%,-100%)':'translate(-50%,0)');
}
document.addEventListener('mouseover',e=>positionPremiumTooltip(e.target));
document.addEventListener('focusin',e=>positionPremiumTooltip(e.target));
document.addEventListener('touchstart',e=>positionPremiumTooltip(e.target),{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openItemDetail){openItemDetail=null;render()}});
})();
