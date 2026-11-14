const APP_VERSION='0.1.48';

(()=>{'use strict';const KEY='ashen-save-v010';const attrNames={str:'Siła',dex:'Zręczność',end:'Wytrzymałość',per:'Percepcja',int:'Inteligencja',cha:'Charyzma'};
const rarities=[{name:'Zwykły',color:'#b8bfc3',weight:58,mult:1},{name:'Ulepszony',color:'#8ac78b',weight:25,mult:1.14},{name:'Rzadki',color:'#77afe5',weight:12,mult:1.32},{name:'Epicki',color:'#c391e4',weight:4,mult:1.58},{name:'Legendarny',color:'#f2bb65',weight:1,mult:1.95}];
const items=[
{id:'knife',name:'Zardzewiały nóż',flavor:'Nóż wyciągnięty ze zgliszcz. Zardzewiały, ale nadal ostry.',slot:'weapon',min:8,max:13,bonus:{}},{id:'pistol',name:'Pistolet M-9',flavor:'Niezawodny, choć zużyty pistolet znaleziony na Pustkowiach.',slot:'weapon',min:12,max:18,bonus:{}},{id:'rifle',name:'Karabin szabrownika',slot:'weapon',min:18,max:27,bonus:{per:2}},{id:'shotgun',name:'Strzelba pustkowi',slot:'weapon',min:25,max:38,bonus:{dex:-1}},
{id:'pipe',name:'Żelazna rura',flavor:'Ciężka rura z resztek instalacji. Niepozorna, lecz skuteczna w zwarciu.',slot:'weapon',min:6,max:10,bonus:{}},{id:'revolver',name:'Rewolwer Strażnika',flavor:'Rewolwer o masywnym bębnie, dawniej używany przez strażników.',slot:'weapon',min:19,max:28,bonus:{}},{id:'machete',name:'Maczeta zbieracza',flavor:'Maczeta przystosowana do przecinania zarośli i walki na bliski dystans.',slot:'weapon',min:16,max:24,bonus:{}},{id:'smg',name:'Pistolet maszynowy Viper',flavor:'Kompaktowy pistolet maszynowy, ceniony za szybkostrzelność.',slot:'weapon',min:22,max:32,bonus:{}},{id:'crossbow',name:'Kusza tropiciela',slot:'weapon',min:18,max:28,bonus:{per:2}},{id:'carbine',name:'Karabinek warty',slot:'weapon',min:21,max:31,bonus:{per:1}},{id:'hammer',name:'Młot złomiarza',slot:'weapon',min:21,max:33,bonus:{str:2,dex:-1}},{id:'sniper',name:'Karabin dalekiego zasięgu',slot:'weapon',min:29,max:44,bonus:{per:3}},{id:'flame',name:'Miotacz żaru',slot:'weapon',min:29,max:45,bonus:{int:2}},{id:'rail',name:'Prototypowa broń szynowa',slot:'weapon',min:27,max:42,bonus:{int:3}},{id:'cleaver',name:'Tasak z pustkowi',flavor:'Tasak z grubym ostrzem. Ślady po szlifowaniu zdradzają częste naprawy.',slot:'weapon',min:10,max:16,bonus:{}},
{id:'jacket',name:'Podarta kurtka',flavor:'Rozdarta kurtka z grubego płótna. Chroni przede wszystkim przed zimnem, a nie przed ostrzem.',slot:'armor',armor:2,bonus:{}},{id:'vest',name:'Kamizelka z płytami',flavor:'Prowizoryczna kamizelka z nitowanymi stalowymi płytami. Ciężka, ale odporna na uderzenia.',slot:'armor',armor:8,bonus:{end:1}},{id:'military',name:'Pancerz zwiadowcy',flavor:'Oliwkowy pancerz zwiadowcy, pozwalający poruszać się bez nadmiernego hałasu.',slot:'armor',armor:11,bonus:{dex:1}},{id:'coat',name:'Płaszcz wędrowca',flavor:'Długi płaszcz podróżnika ze wzmocnionymi szwami i wieloma ukrytymi kieszeniami.',slot:'armor',armor:4,bonus:{per:1}},{id:'leather',name:'Skórzany kaftan',flavor:'Gruby skórzany kaftan, zszyty z kilku warstw materiału i utwardzony przy barkach.',slot:'armor',armor:6,bonus:{dex:1}},{id:'hazmat',name:'Kombinezon skażeniowy',flavor:'Uszczelniony kombinezon z maską i filtrami. Dodatkowe osłony zwiększają jego wytrzymałość.',slot:'armor',armor:13,bonus:{end:2}},{id:'riot',name:'Pancerz oddziałów porządkowych',flavor:'Solidny pancerz formacji porządkowych z dużymi osłonami tułowia i ramion.',slot:'armor',armor:16,bonus:{end:1}},{id:'kevlar',name:'Kevlar warty',flavor:'Wielowarstwowy zestaw kevlarowy odzyskany z wyposażenia przedwojennej Warty.',slot:'armor',armor:19,bonus:{dex:1}},{id:'exosuit',name:'Egzoszkielet górnika',flavor:'Górniczy szkielet wspomagający, z hydraulicznymi ramionami i ciężką osłoną klatki piersiowej.',slot:'armor',armor:23,bonus:{str:2}},{id:'sentinel',name:'Pancerz strażnika Zero',flavor:'Wzmocniony pancerz Strażnika Zero. Jeden z najrzadszych reliktów dawnej technologii.',slot:'armor',armor:28,bonus:{end:3}},
{id:'goggles',name:'Gogle zwiadowcy',flavor:'Zmatowiałe, terenowe gogle pomagające wypatrywać ruchu i osłaniające oczy przed pyłem.',slot:'accessory',bonus:{per:2}},{id:'gloves',name:'Rękawice technika',slot:'accessory',bonus:{int:2}},{id:'mask',name:'Maska filtracyjna',flavor:'Dwu-filtrowa półmaska z zapasowymi wkładami. Używana do eksploracji zadymionych ruin.',slot:'accessory',armor:2,bonus:{end:2}},{id:'compass',name:'Kompas tropiciela',flavor:'Wysłużony kompas polowy ułatwiający orientację w ruinach i szybką zmianę kierunku.',slot:'accessory',bonus:{dex:1,per:1}},{id:'bracelet',name:'Bransoleta strażnika',flavor:'Ciężka bransoleta z przedwojennego posterunku. Dodaje pewności ciosu.',slot:'accessory',bonus:{str:1}},{id:'radio',name:'Moduł łączności',flavor:'Przenośny moduł radiowy z improwizowaną anteną. Poprawia koordynację i wymianę informacji.',slot:'accessory',bonus:{int:1,cha:1}},{id:'scope',name:'Celownik optyczny',slot:'accessory',bonus:{per:3}},{id:'injector',name:'Wzmacniacz odruchów',slot:'accessory',bonus:{dex:2}},{id:'badge',name:'Naszyjnik ocalałego',flavor:'Składany z odzyskanych drobiazgów naszyjnik – symbol człowieka, który już zbyt wiele przetrwał.',slot:'accessory',bonus:{cha:1}},{id:'module',name:'Moduł neurotechniczny',slot:'accessory',bonus:{int:3}},
{id:'scrap',name:'Złom',slot:'material',bonus:{}},{id:'circuits',name:'Elektronika',slot:'material',bonus:{}},{id:'fuel',name:'Paliwo',slot:'material',bonus:{}},{id:'chemicals',name:'Chemikalia',slot:'material',bonus:{}},{id:'parts',name:'Części zamienne',slot:'material',bonus:{}}];

// ASHEN v0.1.48 — artefakty mają własne prefiksy i sufiksy.
// Zestaw powstaje z trzech RÓŻNYCH założonych artefaktów o wspólnym modyfikatorze.
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
  const seen=new Set(),members=[];
  for(const row of worn){if(row.inst[kind]!==id||seen.has(row.inst.id))continue;seen.add(row.inst.id);members.push(row)}
  if(members.length)results.push({id,kind,config,members,count:members.length,active:members.length===3});
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
 const cards=results.map(r=>`<div class="ashen-resonance-card ${r.active?'active':'pending'}"><div class="ashen-resonance-title"><strong>${r.kind==='prefix'?'Prefiks':'Sufiks'}: ${escape(r.config.name)}</strong><span>${r.count}/3 · ${r.active?'AKTYWNY':'NIEAKTYWNY'}</span></div><p class="small ${r.active?'good':'muted'}">${escape(r.config.description)}</p><div class="ashen-resonance-members">${r.members.map(m=>`<span class="found">✓ ${escape(statsOf(m.inst).name)} · ${escape(slotLabels[m.slot])}</span>`).join('')}</div>${r.active?'':'<div class="small muted">Brakuje '+(3-r.count)+' innego artefaktu z tym modyfikatorem.</div>'}</div>`).join('');
 return `<section class="ashen-resonance-panel"><h3>◈ Rezonans artefaktów</h3><p class="small muted">Każdy artefakt ma bazowe Szczęście i może mieć prefiks oraz sufiks. <strong>Trzy różne artefakty z tym samym prefiksem lub sufiksem</strong> uruchamiają bonus zestawu. Zwykłe akcesoria nie liczą się do rezonansu. Prefiks i sufiks to dwa niezależne typy zestawów.</p><div class="ashen-resonance-grid">${cards||'<div class="ashen-resonance-card">Załóż artefakt z modyfikatorem, aby zobaczyć postęp zestawu.</div>'}</div></section>`;
}
function artifactDetailPanel(inst){
 const d=def(inst);if(!d?.artifact)return '';
 const equipped=Object.values(state.equip).includes(inst.uid),results=resonanceResults(),names=[];
 for(const [kind,configs] of [['prefix',ARTIFACT_PREFIX_SETS],['suffix',ARTIFACT_SUFFIX_SETS]]){
  const id=inst[kind],cfg=configs[id];if(!cfg)continue;
  const r=results.find(x=>x.kind===kind&&x.id===id),count=r?.count||0,active=equipped&&r?.active;
  names.push(`<div class="ashen-artifact-affix ${active?'is-active':'is-pending'}"><strong>${kind==='prefix'?'Prefiks':'Sufiks'}: ${escape(cfg.name)} · ${count}/3 · ${active?'AKTYWNY':'NIEAKTYWNY'}</strong><div>${escape(cfg.description)}</div><div class="small">${active?'Komplet trzech różnych artefaktów.':!equipped?'Ten artefakt nie jest założony; wybierz jeden ze slotów 1–3.':`Do aktywacji brakuje ${Math.max(0,3-count)} różnych artefaktów.`}</div>${r?.members?.length?`<details><summary>Elementy zestawu</summary>${r.members.map(m=>`<div>${escape(statsOf(m.inst).name)}</div>`).join('')}</details>`:''}</div>`);
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
const locations=[{id:'ruins',name:'Bliska wyprawa — Ruiny osiedla',level:1,time:5,cost:5,xp:[20,35],scrap:[12,25],enemies:[{name:'Zdziczały szabrownik',hp:45,atk:[5,10],acc:4,dodge:4,armor:1},{name:'Wygłodniały mutant',hp:52,atk:[6,11],acc:4,dodge:3,armor:0}],drops:[['pistol',.18],['jacket',.15],['goggles',.08],['pipe',.15],['coat',.11],['compass',.09],['leather',.08],['revolver',.06]]},{id:'hospital',name:'Średnia wyprawa — Stary szpital',level:4,time:10,cost:12,xp:[45,70],scrap:[25,48],enemies:[{name:'Skażony sanitariusz',hp:105,atk:[11,19],acc:7,dodge:6,armor:3},{name:'Mutant z oddziału B',hp:115,atk:[12,20],acc:6,dodge:5,armor:4}],drops:[['vest',.17],['rifle',.12],['bandana',.12],['machete',.13],['smg',.12],['hazmat',.1],['radio',.08],['crossbow',.08],['dustglasses',.07],['bracelet',.08]]},{id:'outpost',name:'Daleka wyprawa — Posterunek wojskowy',level:8,time:15,cost:25,xp:[90,130],scrap:[50,90],enemies:[{name:'Dezerter z posterunku',hp:180,atk:[19,28],acc:11,dodge:9,armor:9},{name:'Strażnik kompleksu',hp:200,atk:[18,30],acc:12,dodge:7,armor:11}],drops:[['military',.15],['shotgun',.11],['mask',.14],['carbine',.14],['hammer',.12],['sniper',.09],['flame',.06],['rail',.025],['riot',.13],['kevlar',.11],['exosuit',.07],['sentinel',.025],['goggles',.12],['badge',.08],['radio',.07],['cleaver',.08]]}];
const fresh=()=>({version:1,created:false,origin:'scout',dominantHand:'right',name:'Wędrowiec',level:1,xp:0,points:5,attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5},hp:110,energy:100,lastRegen:Date.now(),scrap:0,credits:0,cores:0,schematics:0,workshopTestGranted:false,furniture:{bed:0,table:0,nightstand:0},rooms:{bedroom:1,storage:1,workshop:1},materials:{tkanina:0,skora:0,tworzywo:0,elektronika:0,czesci:0},inventory:[{uid:'starter-knife',id:'knife',rarity:0,affix:null},{uid:'starter-jacket',id:'jacket',rarity:0,affix:null}],equip:{right:'starter-knife',left:null,shirt:null,pants:null,boots:null,outer:'starter-jacket',head:null,extra:null},mission:null,reports:[],battles:0,wins:0,companion:null,vehicle:'foot',vehicleUpgrades:{}});let state;try{state=JSON.parse(localStorage.getItem(KEY))||fresh();if(state.version!==1)state=fresh()}catch{state=fresh()}if(state.created===undefined)state.created=true;if(!['left','right'].includes(state.dominantHand))state.dominantHand='right';// Migracja zapisów z v0.1.0–0.1.2; stare wyposażenie zachowuje podstawowe parametry.
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
for(const inst of state.inventory){if(!Number.isInteger(inst.upgrade)||inst.upgrade<0||inst.upgrade>5)inst.upgrade=0;}
// ASHEN 0.1.24: trwały rozwój modułów schronu, niezależny od dekoracji.
function roomLevel(id){const n=state.rooms?.[id];return Number.isInteger(n)&&n>=1&&n<=3?n:1}
if(!state.rooms||typeof state.rooms!=='object'||Array.isArray(state.rooms))state.rooms={};
for(const id of ['bedroom','storage','workshop'])state.rooms[id]=roomLevel(id);
const ROOM_COSTS={
 bedroom:[null,{level:5,credits:350,scrap:120,mat:'tkanina',qty:35},{level:15,credits:1400,scrap:400,mat:'skora',qty:95}],
 storage:[null,{level:5,credits:300,scrap:160,mat:'czesci',qty:35},{level:15,credits:1350,scrap:460,mat:'tworzywo',qty:100}],
 workshop:[null,{level:8,credits:450,scrap:190,mat:'czesci',qty:45},{level:18,credits:1800,scrap:550,mat:'elektronika',qty:100}]
};
const roomBonusText=id=>({
 bedroom:['Brak premii','+3% doświadczenia z wypraw','+6% doświadczenia z wypraw'],
 storage:['Standardowy odzysk materiałów','+10% materiałów przy rozkładaniu','+20% materiałów przy rozkładaniu'],
 workshop:['Standardowy koszt ulepszeń','−5% kosztów ulepszeń (poza rdzeniami)','−10% kosztów ulepszeń (poza rdzeniami)']
})[id][roomLevel(id)-1];
function roomUpgrade(id){
 const current=roomLevel(id),cfg=ROOM_COSTS[id]?.[current];if(!cfg)return;
 if(state.level<cfg.level){message='Rozbudowa wymaga poziomu postaci '+cfg.level+'.';render();return}
 if(state.credits<cfg.credits||state.scrap<cfg.scrap||getStock(cfg.mat)<cfg.qty){message='Brakuje materiałów na rozbudowę pomieszczenia.';render();return}
 const text=`${cfg.credits} kredytów, ${cfg.scrap} złomu, ${cfg.qty} × ${materialLabels[cfg.mat]}`;
 if(!confirm(`Rozbudować ${BUNKER_ROOMS[id].name} do poziomu ${current+1}?\nKoszt: ${text}\nNowa funkcja: ${({bedroom:['','+3% PD','+6% PD'],storage:['','+10% odzysku','+20% odzysku'],workshop:['','−5% kosztów','−10% kosztów']})[id][current]}`))return;
 if(state.level<cfg.level||state.credits<cfg.credits||state.scrap<cfg.scrap||getStock(cfg.mat)<cfg.qty)return;
 state.credits-=cfg.credits;state.scrap-=cfg.scrap;state.materials[cfg.mat]-=cfg.qty;state.rooms[id]=current+1;
 message='Rozbudowano pomieszczenie: '+BUNKER_ROOMS[id].name+' · poziom '+roomLevel(id)+'.';save();render();
}
function roomUpgradePanel(id){
 const lvl=roomLevel(id),cfg=ROOM_COSTS[id]?.[lvl],next=lvl<3?lvl+1:null;
 const cost=cfg?`${cfg.credits} kredytów · ${cfg.scrap} złomu · ${cfg.qty} × ${materialLabels[cfg.mat]}`:'';
 const can=!!cfg&&state.level>=cfg.level&&state.credits>=cfg.credits&&state.scrap>=cfg.scrap&&getStock(cfg.mat)>=cfg.qty;
 return `<div class="room-upgrade-panel"><div><span class="tag">ROZWÓJ MODUŁU · ${lvl}/3</span><h3>Rozbudowa: ${BUNKER_ROOMS[id].name}</h3><p class="small muted">Aktywny bonus: <strong>${roomBonusText(id)}</strong></p>${cfg?`<p class="small muted">Poziom ${next}: ${({bedroom:['','+3% PD','+6% PD'],storage:['','+10% materiałów','+20% materiałów'],workshop:['','−5% kosztów','−10% kosztów']})[id][lvl]}</p><p class="small muted">Wymagany poziom postaci: ${cfg.level}<br>Koszt: ${cost}</p>`:'<p class="good small">Pomieszczenie rozbudowane do maksimum.</p>'}</div>${cfg?`<button class="${can?'primary':''}" data-room-upgrade="${id}" ${can?'':'disabled'}>${state.level<cfg.level?'Od poziomu '+cfg.level:'Rozbuduj do poziomu '+next}</button>`:'<span class="tag">MAKS. POZIOM</span>'}</div>`;
}
const materialKeys=['scrap','tkanina','skora','tworzywo','elektronika','czesci'];
const materialLabels={scrap:'Złom',tkanina:'Tkanina',skora:'Skóra',tworzywo:'Chemikalia',elektronika:'Elektronika',czesci:'Części mechaniczne'};
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


// Prefiksy z dawnych zapisów pozostają czytelne i nie zmieniają swojego ID,
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
 // BROŃ
 {id:'weapon_precise',name:'Precyzyjny',forms:{m:'Precyzyjny',f:'Precyzyjna',p:'Precyzyjne'},bonus:{per:2},on:'weapon'},
 {id:'weapon_brutal',name:'Brutalny',forms:{m:'Brutalny',f:'Brutalna',p:'Brutalne'},bonus:{str:2},on:'weapon'},
 {id:'weapon_destructive',name:'Niszczycielski',forms:{m:'Niszczycielski',f:'Niszczycielska',p:'Niszczycielskie'},damagePct:12,on:'weapon'},
 {id:'weapon_lethal',name:'Zabójczy',forms:{m:'Zabójczy',f:'Zabójcza',p:'Zabójcze'},critPp:5,on:'weapon'},
 // Szybki działa wyłącznie na lekkiej broni (jedna dodatkowa próba ataku w rundzie).
 {id:'weapon_quick',name:'Szybki',forms:{m:'Szybki',f:'Szybka',p:'Szybkie'},extraAttacks:1,on:'lightWeapon'},
 {id:'weapon_stable',name:'Stabilny',forms:{m:'Stabilny',f:'Stabilna',p:'Stabilne'},accuracy:8,on:'weapon'},
 // UBIÓR: tylko te prefiksy mogą budować zestawy w v0.1.39.
 {id:'armor_reinforced',name:'Wzmocniony',forms:{m:'Wzmocniony',f:'Wzmocniona',p:'Wzmocnione'},bonus:{end:2},on:'clothing',setId:'armor_reinforced'},
 {id:'armor_plated',name:'Pancerny',forms:{m:'Pancerny',f:'Pancerna',p:'Pancerne'},armorPct:15,on:'clothingArmor',setId:'armor_plated'},
 {id:'armor_flexible',name:'Elastyczny',forms:{m:'Elastyczny',f:'Elastyczna',p:'Elastyczne'},bonus:{dex:2},on:'clothing',setId:'armor_flexible'},
 {id:'armor_light',name:'Lekki',forms:{m:'Lekki',f:'Lekka',p:'Lekkie'},bonus:{dex:1,per:1},on:'clothing',setId:'armor_light'},
 {id:'armor_resistant',name:'Odporny',forms:{m:'Odporny',f:'Odporna',p:'Odporne'},armorPct:8,bonus:{end:1},on:'clothingArmor',setId:'armor_resistant'},
 {id:'armor_tracker',name:'Tropicielski',forms:{m:'Tropicielski',f:'Tropicielska',p:'Tropicielskie'},bonus:{per:2},on:'clothing',setId:'armor_tracker'},
 {id:'armor_iron',name:'Żelazny',forms:{m:'Żelazny',f:'Żelazna',p:'Żelazne'},bonus:{str:3},on:'clothing',setId:'armor_iron'},
 // AKCESORIA, oddzielne od odzieży i broni
 {id:'accessory_technical',name:'Techniczny',forms:{m:'Techniczny',f:'Techniczna',p:'Techniczne'},bonus:{int:2},on:'accessory'},
 {id:'accessory_observant',name:'Spostrzegawczy',forms:{m:'Spostrzegawczy',f:'Spostrzegawcza',p:'Spostrzegawcze'},bonus:{per:2},on:'accessory'},
 {id:'accessory_persuasive',name:'Przekonujący',forms:{m:'Przekonujący',f:'Przekonująca',p:'Przekonujące'},bonus:{cha:2},on:'accessory'},
 {id:'accessory_reflexive',name:'Refleksyjny',forms:{m:'Refleksyjny',f:'Refleksyjna',p:'Refleksyjne'},bonus:{dex:2},on:'accessory'},
 {id:'accessory_versatile',name:'Wszechstronny',forms:{m:'Wszechstronny',f:'Wszechstronna',p:'Wszechstronne'},bonus:{per:1,int:1},on:'accessory'}
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
 {id:'weapon_hunter',name:'Łowcy',bonus:{per:2},on:'weapon'},
 {id:'weapon_sniper',name:'Snajpera',bonus:{per:3},on:'ranged'},
 {id:'weapon_berserker',name:'Berserkera',damagePct:8,on:'weapon'},
 {id:'weapon_executioner',name:'Egzekutora',critPp:4,on:'weapon'},
 {id:'weapon_warrior',name:'Wojownika',bonus:{str:2},on:'weapon'},
 {id:'weapon_destroyer',name:'Niszczyciela',damagePct:6,on:'weapon'},
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
const lightWeaponIds=new Set(['knife','pipe','machete','hatchet','baton','wrench','cleaver','saber','pistol','revolver','smg']);
function categoryOf(d){return weaponSlot(d.slot)?'weapon':clothingSlots.has(d.slot)?'clothing':d.artifact?'artifact':d.slot==='extra'?'accessory':'other'}
const prefixChance=[.18,.32,.50,.70,.85],suffixChance=[.06,.15,.29,.55,.78];
function suitable(mod,d,rar){
 if(!mod||!d||d.slot==='material'||mod.legacyOnly||(mod.maxRarity!==undefined&&rar>mod.maxRarity))return false;
 const cat=categoryOf(d);
 if(mod.on==='weapon'&&cat!=='weapon')return false;
 if(mod.on==='ranged'&&(cat!=='weapon'||!rangedIds.has(d.id)))return false;
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
const UPGRADE_POWER=[0,1,3,5,10,20];
function statsOf(inst){
 const d=def(inst);if(!d)return null;
 const m=rarity(inst).mult,mods=modifiersOf(inst);
 const pct=(key)=>mods.reduce((sum,x)=>sum+(x[key]||0),0);
 const dmgPct=pct('damagePct'),armorPct=pct('armorPct'),critPp=pct('critPp'),accuracy=pct('accuracy'),extraAttacks=pct('extraAttacks');
 const pref=findModifier(prefixDefs,inst?.prefix),suf=findModifier(suffixDefs,inst?.suffix);
 const legacy=mods.find(x=>x.legacy);
 const legacyLabel=legacy?.name==='Zwinny'&&d.slot==='extra'?prefixLabel({id:'agile',name:'Zwinny'},d):legacy?.name;
 const name=[rarityPrefix(inst,d),prefixLabel(pref,d)||legacyLabel,d.name,suf?.name].filter(Boolean).join(' ');
 const weapon=weaponSlot(d.slot),upgrade=Math.min(5,Math.max(0,Number(inst?.upgrade)||0));
 const upgradedName=upgrade?name+' +'+upgrade:name;
 const armorUp=UPGRADE_POWER[upgrade];
 return {...d,name:upgradedName,upgrade,rarity:rarity(inst).name,
  min:weapon?Math.max(1,Math.round(d.min*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  max:weapon?Math.max(1,Math.round(d.max*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  armor:!weapon&&d.slot!=='material'?Math.max(0,Math.round((d.armor||0)*m*(1+armorPct/100))+((d.armor||0)===0 ? [0,1,2,3,5][Math.min(4,Math.max(0,Number(inst?.rarity)||0))] : 0)+armorUp):undefined,
  bonus:rolledBonus(inst),critPp,accuracy,extraAttacks,damagePct:dmgPct,armorPct,
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
function modifierText(m){return [m.luck?`Szczęście +${m.luck}`:null,bonusText(m.bonus),m.damagePct?`Obrażenia ${m.damagePct>0?'+':''}${m.damagePct}%`:null,m.armorPct?`Pancerz ${m.armorPct>0?'+':''}${m.armorPct}%`:null,m.critPp?`Szansa trafienia krytycznego +${m.critPp} p.p.`:null,m.accuracy?`Celność +${m.accuracy} pkt`:null,m.extraAttacks?`Ataki na rundę +${m.extraAttacks}`:null].filter(Boolean).join(' · ')}
function slotName(slot){return slotLabels[slot]||({hand1:'Broń jednoręczna',hand2:'Broń dwuręczna',material:'Surowiec'})[slot]||slot}
function statDetails(o){return `${weaponSlot(o.slot)?`Obrażenia ${o.min}–${o.max}${o.slot==='hand2'?' · obie ręce':''}`:o.slot==='material'?'Materiał':`Pancerz ${o.armor||0}`}${bonusText(o.bonus)?' · '+bonusText(o.bonus):''}${o.critPp?` · Krytyk +${o.critPp} p.p.`:''}${o.accuracy?` · Celność +${o.accuracy} pkt`:''}${o.extraAttacks?` · Dodatkowy atak +${o.extraAttacks}`:''}`}
function affixDetails(o){return (o.effects||[]).length?`<div class="small muted" style="margin-top:5px">${o.effects.map(x=>`<div>↳ ${escape(x.name)}: ${escape(x.description)}</div>`).join('')}</div>`:''}
function pickLoot(loc,exploration=null,forcedCount=null){
 // Każda wyprawa: 1 przedmiot pewny; 28% szans na drugi, 7% na trzeci.
 const roll=Math.random(),count=roll<.07?3:roll<.35?2:1;
 const all=loc.drops.map(([id,w])=>({id,w}));
 let additions=loc.id==='ruins'?['wrench','hatchet','baton','tshirt','jeans','sneakers','cap','scarf','workboots','thermal','bandana','fingerless','workgloves','leathergloves']:
 loc.id==='hospital'?['saber','deserteagle','crowbar','cargo','scoutpants','combatboots','scoutshirt','hood','dustglasses','silentboots','techshirt','tacticalgloves','scoutbracers','steelbracers','compass']:
 ['sledge','lmg','harpoon','kevlarpants','radiopants','hazboots','armorshirt','helmet','maskhelm','commanderhelm','goggles','badge','radio','bracelet','kevlarbracers','zerobracers'];
 for(let id of additions)all.push({id,w:0.12});
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
const PAGE_IDS=new Set(['home','character','companion','transport','missions','inventory','workshop','storage','reports','bunker']);
let page='home',message='',invFilter='all',selectedUid=null,workshopUid=null;
try{const previousPage=localStorage.getItem(PAGE_KEY);if(PAGE_IDS.has(previousPage))page=previousPage}catch{}
function setPage(next){page=PAGE_IDS.has(next)?next:'home';try{localStorage.setItem(PAGE_KEY,page)}catch{}}let bulkSelected=new Set();const $=id=>document.getElementById(id),item=id=>items.find(x=>x.id===id),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{message='Nie można zapisać postępu w tej przeglądarce.'}}// ASHEN v0.1.39 — zestawy ubioru rozpoznawane po prefiksie, a nie nazwie przedmiotu.
// Stare identyfikatory prefiksów są mapowane na ich współczesne odpowiedniki.
const SETS={
 armor_reinforced:{name:'Wzmocniony',attribute:'end',start:2,step:1},
 armor_plated:{name:'Pancerny',armorPct:true,start:6,step:3},
 armor_flexible:{name:'Elastyczny',attribute:'dex',start:2,step:1},
 armor_agile:{name:'Zwinny',attribute:'dex',start:2,step:1},
 armor_light:{name:'Lekki',attribute:'per',start:2,step:1},
 armor_resistant:{name:'Odporny',attribute:'end',start:2,step:1},
 armor_tracker:{name:'Tropicielski',attribute:'per',start:2,step:1},
 armor_iron:{name:'Żelazny',attribute:'str',start:2,step:1}
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
function characterSetsPanel(){
 const results=setResults();
 return `<section class="ashen-sets-section"><div class="ashen-sets-title"><h3>Zestawy ubioru — prefiksy</h3><p>Załóż 3 elementy ubioru z tym samym prefiksem. Każdy następny zwiększa premię, którą wzmacnia średnia jakość wszystkich części. Liczą się tylko założone przedmioty — nie broń ani akcesoria.</p></div><div class="ashen-sets-grid">${results.length?results.map(setSummaryCard).join(''):'<div class="ashen-sets-empty">Brak założonych elementów z prefiksami zestawowymi. Starszy prefiks „Zwinny” również tworzy zestaw.</div>'}</div></section>`;
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
function attrs(){const a={...state.attrs};Object.values(state.equip).filter(Boolean).forEach(uid=>{for(const [k,v] of Object.entries(statsOf(instance(uid))?.bonus||{}))a[k]+=v});for(const [k,v] of Object.entries(activeSetBonuses().bonus))a[k]=(a[k]||0)+v;for(const [k,v] of Object.entries(resonanceBonuses().bonus))a[k]=(a[k]||0)+v;return a}function maxHp(){return 60+attrs().end*10}function xpNeed(){return Math.floor(80*Math.pow(state.level,1.35))}function regen(){let now=Date.now(),ticks=Math.floor((now-state.lastRegen)/45000);if(ticks>0){state.energy=Math.min(100,state.energy+ticks);state.lastRegen+=ticks*45000}}function levelUp(){let n=0;while(state.xp>=xpNeed()){state.xp-=xpNeed();state.level++;state.points+=3;n++}return n}// Jedna klasyfikacja dla obrażeń, celności i opisu w zakładce Postać.
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
 if(main){attacks.push({weapon:main,hand:hands[0],power:1});if(main.extraAttacks>0&&main.slot==='hand1')attacks.push({weapon:main,hand:hands[0],power:.65});}
 if(off&&off.slot==='hand2'){attacks.length=0;attacks.push({weapon:off,hand:hands[1],power:1});}
 else if(off&&off.slot==='hand1'){attacks.push({weapon:off,hand:hands[1],power:.8});if(off.extraAttacks>0)attacks.push({weapon:off,hand:hands[1],power:.5});}
 if(!attacks.length)attacks.push({weapon:statsOf({id:'knife',rarity:0}),hand:hands[0],power:1});
 return attacks;
}
function fight(enemy){
 const a=attrs();
 const attacks=heroAttacks();
 const armor=Object.entries(state.equip).filter(([k])=>!['right','left'].includes(k))
   .reduce((sum,[,uid])=>sum+(statsOf(instance(uid))?.armor||0),0);
 const setArmor=activeSetBonuses().armorPct;
 const hero={hp:maxHp(),acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:armor+Math.round(armor*setArmor/100)+Math.floor(a.end/4)};
 const foe={...enemy},lines=[];
 const damageSummary={hero:{attempts:0,hits:0,misses:0,crits:0,damage:0,best:0},foe:{attempts:0,hits:0,misses:0,crits:0,damage:0,best:0},rounds:0};
 const hitAttack=(attacker,defender,who,r,weapon=null)=>{
   const performance=damageSummary[who==='hero'?'hero':'foe'];performance.attempts++;
   const accuracy=who==='hero'&&weapon?weaponAccuracy(a,weapon.weapon):attacker.acc;
   const chance=clamp(70+2*(accuracy-defender.dodge)+(who==='hero'?(weapon?.weapon.accuracy||0):0),15,95);
   const handName=weapon?' ('+(weapon.hand==='right'?'prawa':'lewa')+' ręka, '+Math.round(weapon.power*100)+'%)':'';
   if(Math.random()*100>=chance){performance.misses++;lines.push(`Runda ${r}: ${who==='hero'?'Chybiasz':'Przeciwnik chybia'}${handName}.`);return}
   const critical=who==='hero'&&Math.random()<clamp(.05+a.per*.005+(weapon?.weapon.critPp||0)/100,0,.35);
   let raw;
   if(weapon){raw=Math.max(1,Math.floor((rand(weapon.weapon.min,weapon.weapon.max)+weaponAttributeDamage(a,weapon.weapon))*weapon.power));}
   else raw=rand(attacker.atk[0],attacker.atk[1]);
   if(critical)raw=Math.floor(raw*1.6);
   const dmg=Math.max(1,Math.floor(raw*(1-clamp(defender.armor/100,0,.6))));
   const actualDamage=Math.min(defender.hp,dmg);
   defender.hp=Math.max(0,defender.hp-dmg);
   performance.hits++;performance.damage+=actualDamage;performance.best=Math.max(performance.best,actualDamage);if(critical)performance.crits++;
   lines.push(`Runda ${r}: ${who==='hero'?'Zadajesz':'Otrzymujesz'} ${actualDamage} obrażeń${handName}${critical?' (KRYTYCZNE)':''}.`);
 };
 for(let r=1;r<=10&&hero.hp>0&&foe.hp>0;r++){
   damageSummary.rounds=r;
   const order=rand(1,20)+a.dex>=rand(1,20)+foe.dodge?['hero','foe']:['foe','hero'];
   for(const who of order){
     if(hero.hp<=0||foe.hp<=0)break;
     if(who==='hero'){
       for(const weapon of attacks){if(foe.hp<=0)break;hitAttack(hero,foe,'hero',r,weapon)}
     } else hitAttack(foe,hero,'foe',r);
   }
 }
 return {won:foe.hp<=0,lines,heroHp:hero.hp,enemyHp:foe.hp,damageSummary};
}
const COMPANIONS={
 dog:{name:'Pies',desc:'Wierny tropiciel. +10% złomu z wypraw.',icon:'🐕',bonus:'Złom +10%'},
 cat:{name:'Kot',desc:'Cichy łowca skrytek. 10% szans na dodatkowy przedmiot z wyprawy.',icon:'🐈',bonus:'10% szans na dodatkowy łup'},
 falcon:{name:'Sokół',desc:'Dalekie oko Pustkowi. +8% doświadczenia z wypraw.',icon:'🦅',bonus:'Doświadczenie +8%'}
};
const VEHICLES=[
 {id:'foot',name:'Pieszo',level:1,credits:0,scrap:0,part:0,factor:1,icon:'🥾'},
 {id:'bike',name:'Rower',level:5,credits:180,scrap:65,part:0,factor:.85,icon:'🚲'},
 {id:'motorbike',name:'Motocykl',level:10,credits:800,scrap:180,part:30,factor:.70,icon:'🏍️'},
 {id:'wreck',name:'Stary samochód',level:15,credits:1400,scrap:300,part:60,factor:.63,icon:'🚗'},
 {id:'offroad',name:'Terenówka',level:20,credits:2500,scrap:450,part:85,factor:.52,icon:'🚙'},
 {id:'van',name:'Van',level:25,credits:3700,scrap:600,part:115,factor:.48,icon:'🚐'},
 {id:'camper',name:'Kamper',level:30,credits:5500,scrap:900,part:160,factor:.42,icon:'🚐'},
 {id:'truck',name:'Ciężarówka',level:35,credits:8000,scrap:1300,part:230,factor:.38,icon:'🚚'}
];
function companionId(){return COMPANIONS[state.companion]?state.companion:null}
function vehicleDef(){return VEHICLES.find(v=>v.id===state.vehicle)||VEHICLES[0]}
function vehicleStage(){return Math.max(0,Math.min(2,Number(state.vehicleUpgrades?.[vehicleDef().id])||0))}
function travelSeconds(loc){return Math.max(2,Math.ceil(loc.time*vehicleDef().factor*(1-.08*vehicleStage())))}
function chooseCompanion(id){
 if(state.level<20||!COMPANIONS[id])return;
 if(state.companion===id)return;
 const cost=state.companion?500:0;
 if(state.credits<cost){message='Potrzebujesz '+cost+' kredytów, aby zmienić towarzysza.';render();return}
 if(!confirm((state.companion?'Zmienić towarzysza na ':'Przygarnąć towarzysza: ')+COMPANIONS[id].name+(cost?' za '+cost+' kredytów?':'?')))return;
 state.credits-=cost;state.companion=id;message='Twój nowy towarzysz: '+COMPANIONS[id].name+'.';save();render();
}
function acquireVehicle(id){
 if(state.mission)return;const v=VEHICLES.find(x=>x.id===id);if(!v)return;
 if(v.id==='foot'){state.vehicle='foot';message='Wyruszasz pieszo.';save();render();return}
 if(state.level<v.level){message='Wymagany poziom: '+v.level;render();return}
 if(!Array.isArray(state.ownedVehicles))state.ownedVehicles=[];
 if(state.ownedVehicles.includes(id)){state.vehicle=id;message='Wybrano pojazd: '+v.name;save();render();return}
 if(state.credits<v.credits||state.scrap<v.scrap||getStock('czesci')<v.part){message='Brakuje zasobów na pojazd.';render();return}
 if(!confirm('Zdobyć '+v.name+' za '+v.credits+' kredytów, '+v.scrap+' złomu i '+v.part+' części?'))return;
 state.credits-=v.credits;state.scrap-=v.scrap;state.materials['czesci']-=v.part;state.ownedVehicles.push(id);state.vehicle=id;message='Zdobyto pojazd: '+v.name+'.';save();render();
}
function upgradeVehicle(){
 if(state.mission)return;const v=vehicleDef(),lvl=vehicleStage();if(v.id==='foot'||lvl>=2)return;
 const credits=(lvl+1)*500,parts=(lvl+1)*25,scrap=(lvl+1)*90;
 if(state.credits<credits||state.scrap<scrap||getStock('czesci')<parts){message='Brakuje zasobów na usprawnienie transportu.';render();return}
 if(!confirm('Usprawnić '+v.name+' do poziomu '+(lvl+2)+' za '+credits+' kr., '+scrap+' złomu i '+parts+' części?'))return;
 state.credits-=credits;state.scrap-=scrap;state.materials['czesci']-=parts;state.vehicleUpgrades[v.id]=lvl+1;message='Usprawniono pojazd.';save();render();
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
 let loc=locations.find(x=>x.id===m.id),enemy=loc.enemies[rand(0,loc.enemies.length-1)],result=fight(enemy),xp=result.won?rand(...loc.xp):Math.ceil(loc.xp[0]*.3),scrap=result.won?rand(...loc.scrap):0;
 xp=Math.ceil(xp*(1+0.03*(roomLevel('bedroom')-1))*(companionId()==='falcon'?1.08:1));scrap=Math.ceil(scrap*(companionId()==='dog'?1.1:1));state.xp+=xp;state.scrap+=scrap;state.battles++;if(result.won)state.wins++;
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
 if(companionId()==='cat'&&Math.random()<.10){const extra=pickLoot(loc,{...exploration,success:false},1)[0];if(extra)rolledLoot.push(extra)}
 const drops=rolledLoot.map(x=>({uid:x.uid,id:x.id,name:statsOf(x).name,rarity:statsOf(x).rarity,slot:statsOf(x).slot,details:statDetails(statsOf(x)),effects:statsOf(x).effects}));
 // Rzadkie komponenty są losowane OSOBNO od gwarantowanych 1–3 sztuk ekwipunku.
 // Podczas testów również przegrana walka może przynieść znalezisko.
 const special={cores:0,schematics:0};
 if(loc.id==='outpost'){
  if(Math.random()<.08){state.cores+=1;special.cores=1;}
  if(Math.random()<.03){state.schematics+=1;special.schematics=1;}
 }
 if(anomaly?.scrap){
  const change=anomaly.scrap<0?-Math.min(state.scrap,-anomaly.scrap):anomaly.scrap;
  state.scrap+=change;scrap+=change;anomaly.scrap=change;
 }
 let levels=levelUp();const story=storyForExpedition(loc.id);state.reports.unshift({story:story.text,storyId:story.id,at:new Date().toLocaleString('pl-PL'),location:loc.name,enemy:enemy.name,...result,xp,scrap,drops,special,exploration,anomaly,drop:drops[0]?.name||null,dropRarity:drops[0]?.rarity||null,levels});
 state.reports=state.reports.slice(0,30);state.mission=null;state.missionOutcomePending=true;
 message=''; // Pełny raport wyprawy jest już wyświetlany na ekranie Wypraw.
 save()
}
function sync(){if(!state.vehicle||!VEHICLES.some(v=>v.id===state.vehicle))state.vehicle='foot';if(!Array.isArray(state.ownedVehicles))state.ownedVehicles=[];if(!state.vehicleUpgrades||typeof state.vehicleUpgrades!=='object')state.vehicleUpgrades={};if(!companionId())state.companion=null;regen();if(state.mission&&Date.now()>=state.mission.ends)finish();save()}function bar(label,val,max,color=''){return `<div class="small muted">${label}: ${val} / ${max}</div><div class="bar ${color}"><div class="fill" style="width:${clamp(val/max*100,0,100)}%"></div></div>`}function card(title,body){return `<div class="tile"><h3>${title}</h3>${body}</div>`}function section(title,body){return `<section class="section"><h2>${title}</h2>${body}</section>`}function nav(){return[['home','⌂ Pulpit'],['character','♙ Postać'],['companion','🐾 Towarzysz'],['transport','🚙 Transport'],['missions','⌖ Wyprawy'],['inventory','▣ Ekwipunek'],['workshop','🔧 Warsztat'],['storage','⚙ Magazyn'],['reports','☷ Raporty'],['bunker','⚙ Kryjówka']].map(([k,v])=>`<button data-page="${k}" class="${page===k?'active':''}">${v}</button>`).join('')}
function home(){return `<div class="hero"><div class="sub">SEKTOR 17 · ROK 2197</div><h1>Witaj na Pustkowiach, ${escape(state.name)}</h1><p class="muted">Świat po Czarnym Świcie nie wybacza błędów. Przeszukuj ruiny, walcz o przetrwanie i zbieraj wyposażenie.</p><button class="primary" data-page="missions">Wyrusz na wyprawę →</button></div><div class="grid">${card('Postać',`<div class="value">Poziom ${state.level}</div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}`)}${card('Zasoby',`<div class="value">${state.scrap} złomu</div><p>Energia: bez limitu (testy)</p>`)}${card('Przetrwanie',`<div class="value">${state.wins}/${state.battles}</div><p>Wygrane walki / wszystkie walki</p>`)}</div><div class="divider"></div>${card('Sygnał z radiostacji',`<p>Na północ od schronu wykryto aktywność. Pierwsza wyprawa do ruin osiedla jest dostępna już teraz.</p><button data-page="missions">Sprawdź lokacje</button>`)}`}
function characterPortrait(id){return `./assets/characters/${['fighter','tech','scout'].includes(id)?id:'scout'}.webp`}
function characterFigure(id){return `./assets/characters/${['fighter','tech','scout'].includes(id)?id:'scout'}-full.png`}
function companionVisual(id){if(id==='dog')return '<img src="./assets/companions/dog.webp" alt="Pies towarzysz">'; if(id==='cat')return '<div class="character-side-emoji">🐈</div>'; if(id==='falcon')return '<div class="character-side-emoji">🦅</div>'; return '<div class="character-side-emoji">?</div>'}

// Podsumowanie siły bojowej — wartości wyliczane tymi samymi regułami co walka.
function combatPanel(){
 const a=attrs(),attacks=heroAttacks(),setArmor=activeSetBonuses().armorPct;
 const equipArmor=Object.entries(state.equip).filter(([slot])=>!['right','left'].includes(slot)).reduce((sum,[,uid])=>sum+(statsOf(instance(uid))?.armor||0),0);
 const armor=Math.round(equipArmor*(1+setArmor/100))+Math.floor(a.end/4);
 const dodge=3+a.dex*1.1;
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
function character(){let a=attrs();const comp=companionId()?COMPANIONS[companionId()]:null;const vehicle=vehicleDef();const travelBonus=Math.round((1-vehicle.factor*(1-.08*vehicleStage()))*100);return section('Postać',`<div class="character-screen-modern"><div class="character-top-grid"><div class="character-figure-panel"><div class="character-figure-frame"><img src="${characterFigure(state.origin)}" alt="Pełna sylwetka postaci – ${origins[state.origin]?.title||'Ocalały'}"></div><div class="character-figure-caption">${origins[state.origin]?.title||'Ocalały'}</div></div><div class="character-info-panel"><div class="character-heading"><div><div class="tag">OCALAŁY · POZIOM ${state.level}</div><h3>${escape(state.name)}</h3><p class="small muted">Wybrany wygląd zależy od pochodzenia postaci i pozostaje stały.</p></div><button data-action="rename">Zmień imię</button></div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}<div class="character-meta-line"><span><strong>Ręka dominująca:</strong> ${state.dominantHand==='left'?'lewa':'prawa'}</span><span><strong>Punkty atrybutów:</strong> ${state.points}</span></div><div class="actions"><button data-dominant="right" ${state.dominantHand==='right'?'disabled':''}>Prawa ręka</button><button data-dominant="left" ${state.dominantHand==='left'?'disabled':''}>Lewa ręka</button></div><div class="character-sidecards"><div class="character-sidecard"><div class="character-sidevisual ${comp?'':'placeholder'}">${comp?companionVisual(state.companion):'<div class="character-side-emoji">🐾</div>'}</div><div class="character-sidecontent"><div class="tag">AKTYWNY TOWARZYSZ</div><h4>${comp?comp.name:'Brak towarzysza'}</h4><p class="small muted">${comp?comp.desc:`Towarzysz odblokuje się na poziomie 20. Obecny poziom: ${state.level}.`}</p><p class="good small">${comp?comp.bonus:'Jeszcze niedostępny'}</p><button data-page="companion">${comp?'Zmień towarzysza':'Przejdź do towarzyszy'}</button></div></div><div class="character-sidecard"><div class="character-sidevisual transport"><div class="character-vehicle-big">${vehicle.icon}</div></div><div class="character-sidecontent"><div class="tag">AKTUALNY TRANSPORT</div><h4>${vehicle.name}</h4><p class="small muted">Przyspieszenie wypraw: <strong>${travelBonus}%</strong>. Usprawnienie: ${vehicleStage()+1}/3.</p><p class="good small">Skraca czas podróży, nie wpływa na walkę ani łupy.</p><button data-page="transport">Zarządzaj transportem</button></div></div></div></div></div><div class="character-attr-grid">${Object.entries(attrNames).map(([k,n])=>`<div class="character-attr-card"><div class="character-attr-head"><span>${n} <details class="ashen-attr-help"><summary aria-label="Opis atrybutu ${n}" title="Co daje ${n}?">ⓘ</summary><div class="ashen-attr-help-content">${escape(ATTRIBUTE_HELP[k])}</div></details></span><strong>${a[k]}</strong></div><div class="small muted">Baza ${state.attrs[k]}${a[k]!==state.attrs[k]?` · Sprzęt i zestawy ${a[k]-state.attrs[k]>=0?'+':''}${a[k]-state.attrs[k]}`:''}</div><button data-attr="${k}" ${state.points<=0?'disabled':''}>+1</button></div>`).join('')}</div>${combatPanel()}${characterSetsPanel()}${resonancePanel()}</div>`)}
function companion(){
 const selected=companionId(),active=selected?COMPANIONS[selected]:null;
 const visual=id=>id==='dog'?'<img src="./assets/companions/dog.webp" alt="Pies">':`<span role="img" aria-label="${COMPANIONS[id].name}">${COMPANIONS[id].icon}</span>`;
 return section('Towarzysz',`<div class="ashen-premium-screen"><div class="premium-hero"><div class="tag">SCHRON 17 · DRUŻYNA</div><h3>Nie musisz przemierzać Pustkowi samotnie</h3><p>Wybierz zwierzę, które będzie Ci towarzyszyć podczas wypraw. Każde zapewnia inny bonus, ale aktywny może być tylko jeden towarzysz.</p></div><div class="premium-active"><div class="premium-active-picture">${active?visual(selected):'<span>🐾</span>'}</div><div class="premium-active-copy"><div class="tag">AKTYWNY TOWARZYSZ</div><h3>${active?active.name:'Jeszcze nikogo nie wybrano'}</h3><p class="muted">${active?active.desc:'Towarzysz odblokowuje się na 20. poziomie. Do tego czasu możesz poznawać dostępne możliwości.'}</p><div class="premium-active-bonus">${active?active.bonus:`Poziom postaci: ${state.level} / wymagany 20`}</div></div><button data-page="character" class="premium-outline">Wróć do postaci</button></div><div class="premium-section-title"><h3>Dostępni towarzysze</h3><span>${state.level>=20?'Pierwszy wybór darmowy · Zmiana 500 kredytów':'Odblokowanie na poziomie 20'}</span></div><div class="premium-choices companions">${Object.entries(COMPANIONS).map(([id,c])=>`<article class="premium-choice ${selected===id?'is-selected':''}"><div class="premium-choice-image">${visual(id)}</div><div class="premium-choice-body"><h3>${c.name}</h3><p>${c.desc}</p><div class="premium-bonus">${c.bonus}</div><div class="premium-foot"><button data-companion="${id}" ${state.level<20||selected===id?'disabled':''} class="${selected===id?'premium-outline':'primary'}">${selected===id?'Aktywny':state.level<20?'Od poziomu 20':selected?'Zmień · 500 kr.':'Przygarnij'}</button></div></div></article>`).join('')}</div></div>`)
}
function transport(){
 const current=vehicleDef(),stage=vehicleStage(),bonus=Math.round((1-current.factor*(1-.08*stage))*100);
 return section('Transport',`<div class="ashen-premium-screen"><div class="premium-hero"><div class="tag">SCHRON 17 · GARAŻ</div><h3>Droga przez Pustkowia</h3><p>Środek transportu skraca czas wyprawy, ale nie zmienia szans w walce ani zdobywanych łupów. Pojazdy możesz zmieniać pomiędzy wyprawami.</p></div><div class="premium-active"><div class="premium-active-picture premium-vehicle-visual"><span>${current.icon}</span></div><div class="premium-active-copy"><div class="tag">AKTUALNY TRANSPORT</div><h3>${current.name}</h3><p class="muted">Przyspieszenie wypraw: <strong>${bonus}%</strong> · Ulepszenie: <strong>${stage+1}/3</strong></p><div class="premium-active-bonus">${current.id==='foot'?'Podróżujesz pieszo':`Skrócony czas podróży o ${bonus}%`}</div></div>${current.id!=='foot'&&stage<2?`<button data-vehicle-upgrade ${state.mission?'disabled':''} class="primary">Usprawnij do poziomu ${stage+2}<span class="premium-btn-sub">${(stage+1)*500} kr. · ${(stage+1)*90} złomu · ${(stage+1)*25} części</span></button>`:'<button data-page="character" class="premium-outline">Wróć do postaci</button>'}</div><div class="premium-section-title"><h3>Dostępne środki transportu</h3><span>Postęp i posiadane pojazdy są zapisywane</span></div><div class="premium-choices vehicles">${VEHICLES.map(v=>{const owned=v.id==='foot'||(state.ownedVehicles||[]).includes(v.id);const selected=v.id===current.id;return `<article class="premium-choice ${selected?'is-selected':''}"><div class="premium-choice-image premium-vehicle-visual"><span>${v.icon}</span></div><div class="premium-choice-body"><h3>${v.name}</h3><p>Wymagany poziom: ${v.level}${owned?' · Posiadany':''}</p><div class="premium-bonus">−${Math.round((1-v.factor)*100)}% czasu wyprawy</div><div class="premium-price">${owned?'Gotowy do użycia':`${v.credits.toLocaleString('pl-PL')} kr. · ${v.scrap} złomu · ${v.part} części`}</div><div class="premium-foot"><button data-vehicle="${v.id}" ${state.level<v.level||selected||state.mission?'disabled':''} class="${selected?'premium-outline':'primary'}">${selected?'Wybrany':state.level<v.level?'Zablokowany':owned?'Wybierz':'Zdobądź'}</button></div></div></article>`}).join('')}</div></div>`)
}
function missionImage(id){return `./assets/missions/${id}.webp`}
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
function lootDetailName(x){
 const owned=x.uid&&instance(x.uid);
 const catalog=!owned&&x.id&&item(x.id);
 const color=rarities.find(q=>q.name===x.rarity)?.color||'#e8dccb';
 const name=escape(x.name||item(x.id)?.name||'Przedmiot');
 return owned||catalog?`<button class="loot-open-name" style="color:${color}" ${owned?`data-item-open="${escape(owned.uid)}"`:`data-item-catalog="${escape(x.id)}"`}>${name}</button>`:`<strong style="color:${color}">${name}</strong>`;
}
function missionLootDetails(r){
 const ds=r.drops||(r.drop?[{name:r.drop,rarity:r.dropRarity}]:[]);
 return `<div class="mission-loot-grid">${ds.map(x=>`<div class="mission-loot-item">${lootDetailButton(x)}<div class="grow">${lootDetailName(x)}<div class="small muted">${escape(x.rarity||'Znaleziony przedmiot')}</div><details class="mission-loot-more"><summary>Parametry przedmiotu</summary><p>${escape(x.details||'Brak zapisanych parametrów')}</p>${(x.effects||[]).map(e=>`<p>${escape(e.name)}: ${escape(e.description)}</p>`).join('')}</details></div></div>`).join('')||'<p>Brak zapisanych przedmiotów.</p>'}</div>${specialLoot(r)}`;
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

function missions(){return `<section class="section mission-screen"><div class="mission-topbar">${[
 {icon:'credits',label:'Kredyty',value:state.credits.toLocaleString('pl-PL')},
 {icon:'scrap',label:'Złom',value:state.scrap.toLocaleString('pl-PL')},
 {icon:'fabric',label:'Tkanina',value:getStock('tkanina').toLocaleString('pl-PL')},
 {icon:'polymer',label:'Chemikalia',value:getStock('tworzywo').toLocaleString('pl-PL')},
 {icon:'electronics',label:'Elektronika',value:getStock('elektronika').toLocaleString('pl-PL')},
 {icon:'parts',label:'Części',value:getStock('czesci').toLocaleString('pl-PL')}
].map(r=>`<div class="mission-resource"><div class="ico"><img src="./assets/ui/resources/${r.icon}.webp" alt="" loading="eager"></div><div><div class="lab">${r.label}</div><div class="num">${r.value}</div></div></div>`).join('')}</div><div class="ashen-explore-overview"><strong>⌖ Eksploracja:</strong> ${explorationStats().chance}% szansy na dodatkowy przedmiot <span>✧ Szczęście: +${explorationStats().luck}</span><details><summary>Jak to działa?</summary><p>Percepcja i Inteligencja zwiększają skuteczność poszukiwań, Zręczność pomaga w terenie. Szczęście zapewniają wybrane założone akcesoria i artefakty oraz pełne zestawy rezonansowe; poprawia ono rzadkość łupów, nie przekraczając limitu danej wyprawy. Podczas wyprawy może również pojawić się anomalia, której wpływ znajdziesz w raporcie.</p>${explorationStats().sources.length?`<p>Źródła Szczęścia: ${explorationStats().sources.map(q=>escape(q.name)+" +"+q.value).join(', ')}</p>`:''}</details></div>${missionInstantResult()}<div class="mission-board"><div class="mission-stage"><div class="mission-title"><h2>Wybierz wyprawę</h2></div><div class="mission-meta-row"><span>Transport: <strong>${vehicleDef().icon} ${vehicleDef().name}</strong></span><span>Towarzysz: <strong>${companionId()?COMPANIONS[companionId()].name:'brak'}</strong></span></div>${state.mission?`<div class="mission-active-strip" role="status"><div class="mission-active-main"><div><span class="mission-active-label">⌛ TRWA WYPRAWA</span><strong>${escape(locations.find(l=>l.id===state.mission.id)?.name||'Nieznana lokacja')}</strong></div><div class="mission-active-time">Pozostało <strong id="countdown">${Math.max(0,Math.ceil((state.mission.ends-Date.now())/1000))} s</strong></div></div><div class="mission-active-track"><div id="mission-progress-fill" style="width:${Math.max(0,Math.min(100,100*(1-(state.mission.ends-Date.now())/(state.mission.durationMs||travelSeconds(locations.find(l=>l.id===state.mission.id)||locations[0])*1000))))}%"></div></div></div>`:''}<div class="mission-grid">${locations.map(l=>{const diff=missionDifficultyMeta(l);return `<article class="mission-card"><img src="${missionImage(l.id)}" alt="${escape(l.name)}"><div class="mission-card-body"><h3>${escape(l.name.replace(/^.*—\s*/,''))}</h3><p class="flavor">${missionFlavor(l.id)}</p><div class="mission-difficulty"><div class="mission-bars ${diff.cls}"><span></span><span></span><span></span></div><span>Trudność: <strong>${diff.label}</strong></span></div><div class="mission-facts"><div class="line"><span>Poziom zalecany</span><strong>${l.level}+</strong></div><div class="line"><span>Powrót za</span><strong>${travelSeconds(l)} s</strong></div></div><div class="mission-rarity-info"><span>Jakość znalezisk (z Twoim Szczęściem)</span><div>${explorationRarityWeights(l,explorationStats().luck).map((w,i)=>w?`${rarities[i].name} ${w}%`:null).filter(Boolean).join(" · ")}</div></div><div class="ashen-anomaly-odds">◈ Ryzyko zjawiska: <strong>${ANOMALY_FREQUENCY[l.id]}%</strong></div><div class="ashen-explore-card">⌖ Szansa dodatkowego łupu: <strong>${explorationStats().chance}%</strong> · Szczęście: <strong>+${explorationStats().luck}</strong></div><button class="primary" data-mission="${l.id}" ${state.mission?'disabled':''}>Wyrusz</button>${state.level<l.level?'<div class="mission-locked">Ryzykowna wyprawa dla twojej postaci.</div>':''}</div></article>`}).join('')}</div><p class="mission-note small">Szczęście wpływa na jakość łupów wyłącznie w ramach poziomów dostępnych w danej lokacji. Udany test eksploracji daje jeden dodatkowy przedmiot. Anomalie mogą wpłynąć na poszukiwania i nagrody; wszystko zapisuje się w raporcie.</p></div><aside class="mission-sideart"><img src="${missionSidebarImage()}" alt="Pustkowia ASHEN"><div class="caption"><strong>Pustkowia czekają</strong><div class="small">Każda wyprawa to nowa opowieść. Przetrwają tylko przygotowani.</div></div></aside></div><div class="mission-latest"><h3>Ostatnia wyprawa</h3>${lastMissionCard()}</div></section>`}
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
function inventoryMatchesFilter(inst,filter){const d=def(inst);if(!d)return false;if(filter==='all')return true;return WEAPON_CATEGORIES[filter]?weaponCategoryFor(d)===filter:d.slot===filter}
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
 return `<span class="ashen-mod-icon ${kind} ${cat}" title="${escape(title)}" role="img" aria-label="${escape(title)}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MOD_SYMBOLS[motif]}</svg></span>`;
}
function itemAffixBadges(o,d,inst=null){
 if(!o?.prefixName&&!o?.suffixName)return '';
 return `<span class="ashen-mod-badges" aria-label="Modyfikatory przedmiotu">${o.prefixName?modifierGlyph('prefix',d,findModifier(prefixDefs,inst?.prefix)):''}${o.suffixName?modifierGlyph('suffix',d,findModifier(suffixDefs,inst?.suffix)):''}</span>`;
}
// Sumaryczne parametry walki zapisywane przy ukończeniu wyprawy. Historyczne
// raporty pozbawione statystyk odczytujemy z ich tekstu, bez zgadywania krytyków wroga.
function damageReportStats(r){
 if(r?.damageSummary?.hero&&r?.damageSummary?.foe)return {...r.damageSummary,legacy:false};
 const summary={hero:{attempts:0,hits:0,misses:0,crits:0,damage:0,best:0},foe:{attempts:0,hits:0,misses:0,crits:0,damage:0,best:0},rounds:0,legacy:true};
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
 return `<div class="ashen-item-overlay" role="presentation"><div class="ashen-item-modal" role="dialog" aria-modal="true" aria-labelledby="ashen-item-title"><button class="ashen-item-close" data-item-close aria-label="Zamknij szczegóły">✕</button><div class="tag">${escape(weaponFamilyLabel(defn))}</div><h2 id="ashen-item-title">${escape(o.name)}</h2><div class="ashen-item-modal-grid"><div class="ashen-item-art">${itemDetailImage(defn)}</div><div class="ashen-item-facts"><p class="small muted">${escape(defn.flavor||'Przedmiot zdobyty na Pustkowiach.')}</p><div class="detail-stat"><span>${weaponSlot(o.slot)?'Obrażenia':o.slot==='material'?'Rodzaj':'Pancerz'}</span><strong>${weaponSlot(o.slot)?`${Number(o.min)||0}–${Number(o.max)||0}`:o.slot==='material'?'Surowiec':String(Number(o.armor)||0)}</strong></div><div class="detail-stat"><span>Rzadkość</span><strong>${escape(o.rarity||'Zwykły')}</strong></div>${owned?`<div class="detail-stat"><span>Ulepszenie</span><strong>+${owned.upgrade||0}</strong></div>`:''}${weaponSlot(defn.slot)?`<div class="detail-stat"><span>Ręce</span><strong>${defn.slot==='hand1'?'Jedna':'Dwie'}</strong></div><div class="detail-stat"><span>Ataki na rundę</span><strong>${1+(Number(o.extraAttacks)||0)}</strong></div>`:''}<div class="detail-affix"><strong>${modifierGlyph('prefix',defn,owned?findModifier(prefixDefs,owned.prefix):null)} Prefiks</strong><span>${escape(o.prefixName||'Brak')}</span></div><div class="detail-affix"><strong>${modifierGlyph('suffix',defn,owned?findModifier(suffixDefs,owned.suffix):null)} Sufiks</strong><span>${escape(o.suffixName||'Brak')}</span></div>${owned?`<div class="small muted">${statDetails(o)}</div>${itemSetPanel(owned)}${artifactDetailPanel(owned)}`:''}</div></div><div class="actions"><button class="primary" data-item-close>Zamknij</button></div></div></div>`
}
function slotChip(slot,uid){
 const inst=instance(uid),o=statsOf(inst),empty=!o,label=slotLabels[slot];
 const icon=empty?`<div class="iconbox slot slot-empty">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`:`<button class="item-view-icon equipped-item-trigger" data-item-open="${escape(inst.uid)}" aria-label="Otwórz opis: ${escape(o.name)}">${itemIcon(inst,'slot')}</button>`;
 const name=empty?'<span class="mini">Puste miejsce</span>':`<button class="item-view-name mini equipped-item-trigger" data-item-open="${escape(inst.uid)}" title="${escape(o.name)}">${escape(o.name)}</button>`;
 return `<div class="slot-anchor ${empty?'empty':''}" data-slot="${slot}"><div class="label">${label}</div>${icon}${name}</div>`
}
function equippedDetail(slot){const uid=state.equip[slot],inst=instance(uid),o=statsOf(inst); return `<div class="eq-detail"><div>${o?itemIcon(inst):`<div class="iconbox">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`}</div><div class="grow"><div class="slotname">${slotLabels[slot]}</div>${o?`<button class="item-view-name" style="color:${rarities.find(r=>r.name===o.rarity)?.color}" data-item-open="${inst.uid}">${escape(o.name)}</button><div class="small muted">${statDetails(o)}</div>${affixDetails(o)}<div class="actions"><button data-unequip="${slot}">Zdejmij</button></div>`:`<div class="muted">Brak przedmiotu.</div>`}</div></div>`}
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
function storage(){return section('Magazyn i gospodarka',`${wallet()}<div class="panel section"><h3 style="color:var(--gold);margin-top:0">Odzyskane surowce</h3><p class="muted">Materiały wykorzystasz już teraz w Warsztacie do ulepszania broni, pancerzy i akcesoriów. Wyższe poziomy wymagają również rdzeni technologicznych. Schematy przedwojenne zbierasz na przyszłe receptury.</p><div class="material-grid"><div class="material-card"><div class="material-name">Rdzenie technologiczne</div><div class="value">${state.cores}</div></div><div class="material-card"><div class="material-name">Schematy przedwojenne</div><div class="value">${state.schematics}</div><div class="small muted">Do przyszłych receptur</div></div>${materialKeys.map(k=>`<div class="material-card"><div class="material-name">${materialLabels[k]}</div><div class="value">${getStock(k).toLocaleString('pl-PL')}</div></div>`).join('')}</div></div><div class="panel"><h3 style="color:var(--gold);margin-top:0">Zasady handlu</h3><p>Sprzedaż przedmiotów przynosi <strong>kredyty</strong>, a rozkładanie — materiały właściwe dla danej kategorii. Rzadkość zwiększa wartość sprzedaży i liczbę odzyskanych surowców.</p><p class="muted small">Wyposażone przedmioty trzeba najpierw zdjąć. Epickie i legendarne znaleziska są automatycznie zabezpieczane kłódką. Każdą operację sprzedaży lub rozłożenia potwierdzasz osobno.</p></div>`)}

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
 return section('Warsztat Wędrowca',`${wallet()}<div class="panel section"><div class="tag">ULEPSZENIA BEZ RYZYKA</div><h2 style="margin:8px 0">Warsztat · poziom ${roomLevel('workshop')}</h2><p class="muted">Rozbudowa warsztatu do poziomu 2/3 daje zniżkę 5/10% na materiały i kredyty (rdzenie bez zmian). Każda próba kończy się sukcesem. Możesz ulepszyć dowolny przedmiot wyposażenia do +5, ale kolejne poziomy wymagają większej liczby materiałów i kredytów. Poziomy +3 do +5 zużywają również rdzenie technologiczne. Premie do obrażeń (zarówno minimum, jak i maksimum) lub pancerza wynoszą kolejno +1, +3, +5, +10 i +20; balans sprawdzimy później.</p><p class="small muted">Rdzenie technologiczne (8% szans) i schematy przedwojenne (3%) można znaleźć podczas dalekich wypraw. Schematy są na razie kolekcjonowane — nie są jeszcze zużywane w warsztacie. Pakiet testowy nadal jest dostępny.</p>${state.workshopTestGranted?'<p class="good small">✓ Pakiet testowy został odebrany.</p>':'<button data-action="workshop-test" class="primary">Odbierz jednorazowy pakiet testowy</button>'}</div>
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
 state.credits+=25000;state.scrap+=500;for(const key of materialKeys.slice(1))state.materials[key]+=500;state.cores+=12;state.workshopTestGranted=true;
 message='Dodano pakiet testowy warsztatu.';save();render();
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
function inventory(){
 const filters=[['all','Wszystko'],...Object.entries(WEAPON_CATEGORIES).map(([id,v])=>[id,v.name]),['shirt','Koszulki'],['pants','Spodnie'],['boots','Buty'],['outer','Kurtki / pancerze'],['head','Nakrycia głowy'],['hands','Rękawice / karwasze'],['extra','Akcesoria']];
 const visible=inventorySortEntries(state.inventory.map(inst=>({inst,o:statsOf(inst)})).filter(x=>x.o&&inventoryMatchesFilter(x.inst,invFilter)));
 for(const uid of [...bulkSelected])if(!eligibleForBulk(instance(uid)))bulkSelected.delete(uid);
 const selectedForBulk=bulkSelectedItems();const bulkSum=bulkTotals(selectedForBulk);
 const eligibleShown=bulkEligibleVisible(invFilter);
 const allShown=eligibleShown.length>0&&eligibleShown.every(x=>bulkSelected.has(x.uid));
 const bulkUi=`<div class="bulk-panel"><div class="bulk-head"><h3>Zarządzanie wieloma przedmiotami</h3><span class="tag">Zaznaczono: ${selectedForBulk.length} / dostępnych ${state.inventory.filter(eligibleForBulk).length}</span></div>
 <div class="actions"><button data-action="bulk-visible">${allShown?'Odznacz widoczne':'Zaznacz widoczne'} (${eligibleShown.length})</button><button data-action="bulk-all">Zaznacz wszystkie dostępne</button><button data-action="bulk-clear">Odznacz wszystkie</button></div>
 <div class="bulk-summary">Wartość zaznaczonych: <strong>${bulkSum.credits.toLocaleString('pl-PL')} kredytów</strong><br>Materiały z rozłożenia: <strong>${selectedForBulk.length?salvageLabel(bulkSum.mats):'—'}</strong></div>
 <div class="actions"><button class="primary" data-action="bulk-sell" ${selectedForBulk.length?'':'disabled'}>Sprzedaj zaznaczone (${selectedForBulk.length})</button><button data-action="bulk-salvage" ${selectedForBulk.length?'':'disabled'}>Rozłóż zaznaczone (${selectedForBulk.length})</button></div>
 <div class="bulk-hint">Założone i zabezpieczone przedmioty nie mogą zostać zaznaczone. Potwierdzenie pokaże łączną nagrodę. Zaznaczenie nie jest zapisywane między uruchomieniami gry.</div></div>`;
 return section('Ekwipunek',`${wallet()}<p class="muted">Masz ${state.inventory.length} przedmiotów. Artefakty w trzech slotach akcesoriów wzmacniają Szczęście. Ich prefiksy i sufiksy tworzą niezależne rezonansowe zestawy 3/3. Ikona i nazwa przedmiotu otwierają szczegóły. Prefiksy ubrań tworzą zestawy od 3 założonych elementów; nowe przedmioty odkrywasz podczas wypraw. Dominująca ręka: <strong>${state.dominantHand==='left'?'lewa':'prawa'}</strong>.</p>
 <div class="equip-stage section">
   <div class="paperdoll-wrap"><div class="paperdoll-title"><div><h3 style="color:var(--gold);margin:0">Wyposażenie postaci</h3><div class="small muted">Kliknij ikonę albo nazwę przedmiotu, aby zobaczyć jego parametry.</div></div><div class="small muted">Poziom ${state.level}</div></div>
     <div class="paperdoll">
       <div class="paperdoll-col paperdoll-left">${['head','shirt','right','hands','pants'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
       <div class="figure-stage"><div class="figure-halo"></div><img class="inventory-figure" src="${characterFigure(state.origin)}" alt="Sylwetka postaci ${escape(state.name)}"><div class="figure-caption">${escape(state.name)} · ${state.origin==='scout'?'Zwiadowca':state.origin==='fighter'?'Najemnik':'Mechanik'}</div></div>
       <div class="paperdoll-col paperdoll-right">${['extra','extra2','extra3','outer','left','boots'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
     </div>
   </div>

 </div>
 ${resonancePanel()}
 <div class="actions section">${filters.map(([id,n])=>`<button data-filter="${id}" class="${invFilter===id?'primary':''}">${n}</button>`).join('')}</div>
 <div class="ashen-inventory-sortbar"><label for="ashen-inventory-sort">Sortuj przedmioty</label><select id="ashen-inventory-sort" class="input" data-inventory-sort>${INVENTORY_SORTS.map(([id,label])=>`<option value="${id}" ${(state.inventorySort||'rarity-desc')===id?'selected':''}>${label}</option>`).join('')}</select><div class="small muted">Domyślnie: legendarne → epickie → rzadkie → ulepszone → zwykłe</div></div>
 ${bulkUi}

 <div class="stack">${visible.map(({inst,o})=>{let worn=Object.values(state.equip).includes(inst.uid);let weapon=o.slot==='hand1';let buttons=o.slot==='material'?'':worn?`<span class="tag">Założony</span><button data-unequip="${Object.keys(state.equip).find(k=>state.equip[k]===inst.uid)||''}">Zdejmij</button>`:weapon?`<button class="primary" data-equip="${inst.uid}" data-hand="right">Prawa ręka</button><button data-equip="${inst.uid}" data-hand="left">Lewa ręka</button>`:(o.slot==='extra'?['extra','extra2','extra3'].map((s,i)=>`<button class="${state.equip[s]?'':'primary'}" data-equip="${inst.uid}" data-extra-slot="${s}" title="${state.equip[s]?'Zastąpi aktualne akcesorium w tym slocie':'Wolny slot akcesorium'}">${i+1}${state.equip[s]?' ↺':''}</button>`).join(''):`<button class="primary" data-equip="${inst.uid}">Załóż</button>`);return `<div class="item ashen-rarity-${Math.min(4,Math.max(0,Number(inst.rarity)||0))} ${bulkSelected.has(inst.uid)?'bulk-picked':''}"><div class="row wrap"><label class="bulk-select" title="Zaznacz do operacji zbiorczej"><input type="checkbox" data-bulk-uid="${inst.uid}" ${bulkSelected.has(inst.uid)?'checked':''} ${eligibleForBulk(inst)?'':'disabled'}></label><div class="grow">${itemSummary(inst,o)}</div><div class="actions"><button data-workshop-select="${inst.uid}" data-page="workshop" title="Ulepsz w warsztacie">🔧 Warsztat</button>${buttons}<button data-lock="${inst.uid}" class="${inst.locked?'islocked':''}" title="${inst.locked?'Odblokuj':'Zabezpiecz'} przedmiot">${inst.locked?'🔒 Odblokuj':'🔓 Zabezpiecz'}</button>${o.slot==='material'?'':`<button data-sale="${inst.uid}" ${worn||inst.locked?'disabled':''}>Sprzedaj · ${saleValue(inst)} kr.</button><button data-salvage="${inst.uid}" ${worn||inst.locked?'disabled':''}>Rozłóż</button>`}</div></div></div>`}).join('')||'<div class="panel muted">Brak przedmiotów w wybranej kategorii.</div>'}</div>`)}

function specialLoot(r){const p=r?.special||{};return (p.cores||p.schematics)?`<div class="notice" style="margin-top:10px"><strong>Rzadkie znaleziska:</strong> ${[p.cores?`⚙ Rdzeń technologiczny × ${p.cores}`:'',p.schematics?`📜 Schemat przedwojenny × ${p.schematics}`:''].filter(Boolean).join(' · ')}</div>`:''}
function foundLootPreview(r){return `<div class="panel section"><h3 style="color:var(--gold)">Ostatnia ukończona wyprawa: ${escape(r.location)}</h3><p class="small muted">${escape(r.at)}</p><p>Znalazłeś:</p>${(r.drops||[]).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${lootDetailButton(x)}<div>${lootDetailName(x)}<div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||'Brak zapisanych parametrów')} · ${escape(x.slot?slotName(x.slot):'')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'<p class="muted">Sprawdź starszy raport w zakładce Raporty.</p>'}${specialLoot(r)}<button data-page="inventory">Przejdź do ekwipunku</button></div>`}
function reports(){return section('Raporty walk',state.reports.length?`<div class="stack">${state.reports.map((r,i)=>`<div class="panel"><div class="row wrap"><strong class="${r.won?'good':'bad'}">${r.won?'ZWYCIĘSTWO':'PORAŻKA'} · ${escape(r.location)}</strong><span class="small muted">${escape(r.at)}</span></div><p>Przeciwnik: ${escape(r.enemy)}</p>${damageReportPanel(r)}${anomalyReportPanel(r)}${explorationReportPanel(r)}<p class="tag">+${r.xp} XP · +${r.scrap} złomu ${r.levels?'· Awans: +'+r.levels+' poziom':''}</p>${specialLoot(r)}<div class="small"><strong>Znalazłeś (${r.drops?.length||Number(!!r.drop)}):</strong><div class="loot-list">${(r.drops|| (r.drop?[{name:r.drop,rarity:r.dropRarity}]:[])).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${lootDetailButton(x)}<div>${lootDetailName(x)}<div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||((x.uid&&instance(x.uid))?statDetails(statsOf(instance(x.uid))):'Szczegóły nie były zapisywane w tej wersji raportu.'))}<br>Rzadkość: ${escape(x.rarity||'Nieznana')} · ${escape(x.slot?slotName(x.slot):'Przedmiot ze starszego raportu')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'Brak'}</div></div><details ${i===0?'open':''}><summary>Przebieg walki</summary>${r.lines.map(line=>`<div class="report small">${escape(line)}</div>`).join('')}</details></div>`).join('')}</div>`:'<div class="panel muted">Brak raportów. Wykonaj pierwszą wyprawę.</div>')}

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
const bedroomBackgroundByLevel=lvl=>`./assets/bunker/rooms/${lvl>=3?'bedroom-level3.webp':lvl===2?'bedroom-level2.webp':'bedroom-level1.webp'}`;
function hideoutScene(h){
 const lightColors={candle:'#f1a557',bulb:'#f5d49c',neon:'#81d4d6'};
 const illum=lightColors[h.light]||lightColors.candle;
 const lvl=roomLevel('bedroom');
 const roomLabel=lvl===1?'Poziom 1 — surowa, zaniedbana sypialnia':lvl===2?'Poziom 2 — odnowiona i uporządkowana sypialnia':'Poziom 3 — nowoczesna, surowa sypialnia';
 return `<svg viewBox="0 0 960 540" role="img" aria-label="Sypialnia Schronu 17: ${roomLabel}" xmlns="http://www.w3.org/2000/svg"><defs>
  <radialGradient id="ashenlight"><stop stop-color="${illum}" stop-opacity="${h.light==='candle'?.24:.33}"/><stop offset="1" stop-color="${illum}" stop-opacity="0"/></radialGradient>
  <linearGradient id="ashenfallback" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#272e2e"/><stop offset="1" stop-color="#151b20"/></linearGradient>
 </defs>
 <rect width="960" height="540" fill="url(#ashenfallback)"/>
 <image href="${bedroomBackgroundByLevel(lvl)}" x="0" y="0" width="960" height="540" preserveAspectRatio="xMidYMid slice"/>
 <ellipse cx="480" cy="210" rx="435" ry="310" fill="url(#ashenlight)"/>
 ${hideoutSvgThing('wall',h.wall)}${hideoutSvgThing('left',h.left)}${hideoutSvgThing('center',h.center)}${hideoutSvgThing('right',h.right)}
 ${h.light==='candle'?`<g transform="translate(572 331)"><path d="M-14 0H14V46H-14Z" fill="#b9a681"/><path d="M0 -20 Q20 -3 0 4 Q-17 -4 0 -20" fill="#ffd387"/></g>`:''}
 ${h.light==='neon'?`<path d="M306 64H651" stroke="#91e3dc" stroke-width="12" opacity=".65"/><path d="M306 64H651" stroke="#e4fffd" stroke-width="4"/>`:''}
 <rect x="13" y="13" width="173" height="29" rx="6" fill="#0c1519" opacity=".84"/><text x="26" y="32" fill="#d5bc8a" font-size="14" letter-spacing="2">SCHRON 17</text>
 <rect x="745" y="13" width="203" height="29" rx="6" fill="#0c1519" opacity=".84"/><text x="760" y="32" fill="#d5bc8a" font-size="14" letter-spacing="1.2">SYPIALNIA · POZIOM ${lvl}</text>
 </svg>`;
}
function hideoutChoice(key,current){return `<div class="hideout-group"><h3>${({left:'Lewa strona pomieszczenia',center:'Środek pomieszczenia',right:'Prawa strona pomieszczenia',wall:'Dekoracja ścienna',light:'Oświetlenie'})[key]}</h3><div class="hideout-choice">${HIDEOUT_OPTIONS[key].map(([id,title])=>`<button type="button" data-hideout-slot="${key}" data-hideout-item="${id}" class="${id===current?'selected':''}" aria-pressed="${id===current}">${escape(title)}</button>`).join('')}</div></div>`}
function setHideoutItem(slot,id){if(!['wall','light'].includes(slot)||!HIDEOUT_OPTIONS[slot]?.some(x=>x[0]===id))return;hideoutState()[slot]=id;message='Zmieniono wyposażenie Schronu 17. Zapisano ustawienie.';save();render()}

const BUNKER_ROOMS={bedroom:{name:'Sypialnia',desc:'Osobiste pomieszczenie Wędrowca. Możesz urządzić je po swojemu, zmieniając meble, światło i dekoracje.',unlock:'Personalizacja wnętrza',future:'W przyszłości: komfort i odpoczynek'},storage:{name:'Magazyn',desc:'Pomieszczenie do przechowywania materiałów i zdobyczy. Stan surowców jest już dostępny w istniejącym Magazynie.',unlock:'Podgląd surowców',future:'W przyszłości: pojemność składowania'},workshop:{name:'Warsztat',desc:'Miejsce przerabiania zdobyczy i ulepszania ekwipunku. Korzysta z istniejącego systemu ulepszeń +1 do +5.',unlock:'Ulepszanie przedmiotów',future:'W przyszłości: nowe receptury i projekty'}};
let activeBunkerRoom='bedroom';
function bunkerRoomSvg(type,h,compact=false){
 if(type==='bedroom'){
  // Zachowujemy istniejący widok umeblowanej sypialni, w przekroju pomniejszony przez CSS.
  return hideoutScene(h);
 }
 const storage=type==='storage';
 const title=storage?'STORAGE · MAGAZYN':'WORKSHOP · WARSZTAT';
 const scene=storage?`<g><rect x="135" y="140" width="220" height="225" rx="7" fill="#343d3e" stroke="#87918b" stroke-width="10"/><path d="M151 196H341M151 256H341M151 316H341" stroke="#86918d" stroke-width="8"/><rect x="162" y="152" width="75" height="35" fill="#70664c"/><rect x="247" y="158" width="72" height="27" fill="#5b655c"/><rect x="159" y="218" width="83" height="33" fill="#65513c"/><rect x="258" y="215" width="56" height="35" fill="#455b61"/><rect x="165" y="279" width="147" height="29" fill="#74654b"/><path d="M166 166H233M168 228H234M171 291H302" stroke="#aa9471" stroke-width="3"/></g><g><rect x="520" y="300" width="252" height="112" fill="#544a39" stroke="#9b8b68" stroke-width="7"/><path d="M520 341H772M635 304V410" stroke="#9e8a63" stroke-width="7"/><rect x="576" y="249" width="130" height="47" fill="#35474b" stroke="#73878a" stroke-width="5"/><path d="M600 268h82m-82 11h60" stroke="#849ca0" stroke-width="5"/></g><g><rect x="395" y="304" width="85" height="82" fill="#66604e" stroke="#aaa18b" stroke-width="5"/><rect x="405" y="316" width="65" height="24" fill="#35474b"/><path d="M410 355H468" stroke="#959488" stroke-width="4"/></g>`:`<g><rect x="165" y="298" width="645" height="45" fill="#5e4d37" stroke="#9e8764" stroke-width="7"/><path d="M197 345V465M776 343V465" stroke="#777e79" stroke-width="14"/><rect x="212" y="266" width="123" height="27" fill="#5b6260" stroke="#87918e" stroke-width="4"/><path d="M249 260V239H302V263" stroke="#949f9c" stroke-width="8"/><circle cx="302" cy="279" r="9" fill="#c28d42"/><rect x="410" y="222" width="110" height="73" fill="#3d4a4c" stroke="#788b8c" stroke-width="7"/><rect x="430" y="237" width="69" height="40" fill="#73a5a9" opacity=".5"/><path d="M447 240L481 267M482 239L447 267" stroke="#9ec5c4" stroke-width="3"/><path d="M595 235L628 270H665L697 235" stroke="#919c96" stroke-width="8" fill="none"/><path d="M626 266V292" stroke="#8b8f88" stroke-width="9"/><rect x="105" y="157" width="110" height="130" fill="#343f40" stroke="#71807c" stroke-width="8"/><path d="M126 195H194M126 234H194" stroke="#a6a78c" stroke-width="5"/><rect x="730" y="158" width="113" height="131" fill="#343e40" stroke="#788681" stroke-width="8"/><circle cx="780" cy="205" r="20" fill="#bd954f" opacity=".5"/></g>`;
 return `<svg viewBox="0 0 960 540" role="img" aria-label="${storage?'Graficzny magazyn':'Graficzny warsztat'} w Schronie 17" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wall-${type}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#172126"/><stop offset="1" stop-color="#3a3932"/></linearGradient><linearGradient id="floor-${type}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4b473c"/><stop offset="1" stop-color="#1b272a"/></linearGradient><radialGradient id="lamp-${type}"><stop stop-color="${storage?'#c0cda9':'#d5b578'}" stop-opacity=".22"/><stop offset="1" stop-color="#bda782" stop-opacity="0"/></radialGradient></defs><rect width="960" height="540" fill="#0c1013"/><path d="M50 35H910L875 375H85Z" fill="url(#wall-${type})" stroke="#71746e" stroke-width="8"/><path d="M85 375H875L953 535H7Z" fill="url(#floor-${type})" stroke="#716d5e" stroke-width="7"/><path d="M85 410H875M53 470H917M85 375L7 535M875 375L953 535" stroke="#908a76" stroke-width="3" opacity=".2"/><path d="M475 35V88" stroke="#9aa49d" stroke-width="7"/><rect x="440" y="78" width="73" height="22" rx="7" fill="#a0a9a1"/><ellipse cx="475" cy="220" rx="370" ry="290" fill="url(#lamp-${type})"/><path d="M67 85H879" stroke="#53646b" stroke-width="8" opacity=".6"/><text x="95" y="111" font-size="22" fill="#a5a596" font-family="monospace">${title}</text>${scene}</svg>`;
}
function bunkerRoomsOverview(h){return `<div class="bunker-overview"><div class="hideout-title"><div><div class="tag">PRZEKRÓJ BAZY · POZIOM -1</div><h3>Schron 17</h3></div><span class="hideout-pill">3 czynne pomieszczenia</span></div><div class="bunker-cutaway">${Object.entries(BUNKER_ROOMS).map(([id,r])=>`<button type="button" class="bunker-module ${activeBunkerRoom===id?'is-selected':''}" data-bunker-room="${id}" aria-pressed="${activeBunkerRoom===id}">${bunkerRoomSvg(id,h,true)}<strong>${r.name}</strong><span class="bunker-state">Poziom ${roomLevel(id)}/3 · ${id==='bedroom'?'Pokój Wędrowca':id==='storage'?'Zasoby':'Ulepszenia'}</span></button>`).join('')}</div><div class="bunker-floor"></div><div class="bunker-future"><span>Przyszły moduł</span><span>Przyszły moduł</span><span>Przyszły moduł</span></div><p class="hideout-story">Dotknij lub kliknij pomieszczenie, aby obejrzeć je z bliska. Pola na kolejnym poziomie pokazują kierunek przyszłej rozbudowy.</p></div>`}
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
function bunker(){const h=hideoutState(),r=BUNKER_ROOMS[activeBunkerRoom]||BUNKER_ROOMS.bedroom;return section('Kryjówka',`<div class="hideout-screen"><div class="hideout-title"><div><div class="tag">SEKTOR 17 · SCHRON MODUŁOWY</div><h3>Twoja baza</h3></div><div class="hideout-legend"><span class="hideout-pill">Pomieszczenia mają własne funkcje</span><span class="hideout-pill">Dekoracje są tylko wizualne</span></div></div>${bunkerRoomsOverview(h)}<div class="bunker-focused"><div class="bunker-focused-head"><div><span class="tag">WYBRANE POMIESZCZENIE</span><h3>${r.name}</h3></div><span class="hideout-pill">Poziom pomieszczenia: ${roomLevel(activeBunkerRoom)} / 3</span></div>${bunkerRoomSvg(activeBunkerRoom,h)}<p class="bunker-room-description">${r.desc}</p><div class="bunker-meta"><span>${roomBonusText(activeBunkerRoom)}</span><span>${r.unlock}</span></div>${roomUpgradePanel(activeBunkerRoom)}${activeBunkerRoom==='bedroom'?`<div class="hideout-controls">${['wall','light'].map(key=>hideoutChoice(key,h[key])).join('')}</div><div class="hideout-hint">${furnitureControls()}<div class="hideout-hint">Wyposażenie i oświetlenie wpływają jedynie na wygląd sypialni — nie dają bonusów do walki ani statystyk.</div></div>`:activeBunkerRoom==='storage'?`<div class="bunker-links"><button class="primary" data-page="storage">Otwórz magazyn surowców</button></div>`:`<div class="bunker-links"><button class="primary" data-page="workshop">Przejdź do ulepszania ekwipunku</button></div>`}</div><div class="hideout-hint">Rozbudowa trzech pomieszczeń daje pierwsze bonusy do wypraw, odzysku i ulepszeń. Meble, oświetlenie oraz dekoracje pozostają wyłącznie wizualne. Nowe typy pokoi i misje odblokowywane przez bazę pojawią się w kolejnych aktualizacjach.</div><div class="actions" style="margin-top:14px"><button data-page="workshop">Warsztat</button><button data-page="storage">Magazyn</button></div></div><div class="panel section" style="margin-top:14px"><h3 style="color:var(--gold)">Zapis i bezpieczeństwo</h3><p class="small muted">Eksport zapisuje postać i ekwipunek do pliku JSON. Import zastępuje obecny stan gry. Przed importem automatycznie zachowamy poprzedni zapis w pamięci tej przeglądarki.</p><div class="actions"><button data-action="export">Pobierz kopię zapisu JSON</button><button class="primary" data-action="import">Importuj zapis JSON</button><button data-action="restore-backup">Przywróć poprzedni zapis</button><button data-action="reset">Nowa gra / reset</button></div><p class="small muted">Po imporcie gra odświeży stronę. Pliki z zapisami przechowuj u siebie, nie w publicznym repozytorium GitHub.</p></div>`) }

const origins={scout:{title:'Zwiadowca',desc:'Szybki i spostrzegawczy. +2 Zręczności, +1 Percepcji.',bonus:{dex:2,per:1}},fighter:{title:'Najemnik',desc:'Wytrzymały wojownik. +2 Siły, +1 Wytrzymałości.',bonus:{str:2,end:1}},tech:{title:'Mechanik',desc:'Specjalista od technologii. +2 Inteligencji, +1 Percepcji.',bonus:{int:2,per:1}}};
function creation(){return `<div class="hero"><div class="sub">SCHRON 17 · POCZĄTEK HISTORII</div><h1>Stwórz Wędrowca</h1><p class="muted">Wybierz pochodzenie postaci. To bonus początkowy, a nie zamknięta klasa — później rozwijasz dowolne atrybuty.</p></div><div class="panel"><label for="hero-name">Imię Wędrowca</label><input class="input" id="hero-name" maxlength="24" value="${escape(state.name)}" placeholder="Wpisz imię" style="margin:9px 0 18px"><h3 style="color:var(--gold)">Pochodzenie</h3><div class="grid">${Object.entries(origins).map(([id,o])=>`<label class="tile" style="cursor:pointer;border-color:${state.origin===id?'var(--gold)':'var(--line)'}"><input type="radio" name="origin" value="${id}" ${state.origin===id?'checked':''}><img class="origin-thumb" src="${characterPortrait(id)}" alt="Portret: ${o.title}"><h3>${o.title}</h3><p class="small muted">${o.desc}</p></label>`).join('')}</div><h3 style="color:var(--gold)">Ręka dominująca</h3><p class="small muted">Wybór nie zmienia siły postaci. Dominująca ręka atakuje z mocą 100%, druga z mocą 80%. Możesz wybrać swoją naturalną stronę.</p><div class="actions"><label class="tile"><input type="radio" name="dominantHand" value="right" ${state.dominantHand==='right'?'checked':''}> Prawa</label><label class="tile"><input type="radio" name="dominantHand" value="left" ${state.dominantHand==='left'?'checked':''}> Lewa</label></div><p class="small muted">Po rozpoczęciu otrzymasz 5 dodatkowych punktów do rozdania i podstawowy ekwipunek.</p><div class="actions" style="margin-top:10px"><button class="primary" data-action="create">Rozpocznij przygodę →</button><button data-action="import">Wczytaj istniejącą postać (JSON)</button><button data-action="restore-backup">Przywróć kopię zapasową</button></div></div>`}
function render(){sync();let views={home,character,companion,transport,missions,inventory,workshop,storage,reports,bunker};$('app').innerHTML=`<div class="shell ashen-wide-shell ${page==='missions'?'ashen-missions-shell':''} ${page==='character'?'ashen-character-shell':''} ashen-premium-shell"><header class="header"><div><div class="brand">ASHEN</div><div class="sub">KRONIKI UPADKU · v${APP_VERSION}</div></div><div class="small muted">PROTOTYP OFFLINE<br>Postęp zapisuje się w przeglądarce</div></header><div class="layout"><aside class="sidebar"><strong>${escape(state.name)}</strong><p class="muted">Poziom ${state.level} · Ocalały</p><p class="small good">Energia: ∞ (testy)</p><p class="small muted">🪙 ${state.credits.toLocaleString('pl-PL')} kredytów · ⚙ ${state.scrap} złomu</p><nav class="nav">${state.created?nav():''}</nav></aside><main class="main">${message?`<div class="notice" style="margin-bottom:12px">${escape(message)}</div>`:''}${state.created?views[page]():creation()}${itemDetailContent()}<div class="footer">ASHEN v${APP_VERSION} · Wersja testowa · Brak połączenia z serwerem · Zapis lokalny</div><input id="ashen-import-file" type="file" accept=".json,application/json" hidden aria-label="Plik zapisu gry JSON"></main></div></div>`;let c=$('countdown');if(c)c.textContent=Math.max(0,Math.ceil((state.mission?.ends-Date.now())/1000))+' s'}
function act(e){let b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-item-close')){openItemDetail=null;render();return}if(b.dataset.itemOpen){openItemDetail={kind:'owned',id:b.dataset.itemOpen};render();return}if(b.dataset.itemCatalog){openItemDetail={kind:'catalog',id:b.dataset.itemCatalog};render();return}if(b.dataset.missionDetail){const key=b.dataset.missionDetail;if(key==='report'||key==='loot'){missionExpand[key]=!missionExpand[key];render()}return;}if(b.dataset.action==='mission-dismiss-result'){state.missionOutcomePending=false;save();render();return;}if(b.dataset.companion){chooseCompanion(b.dataset.companion);return}if(b.dataset.vehicle){acquireVehicle(b.dataset.vehicle);return}if(b.hasAttribute('data-vehicle-upgrade')){upgradeVehicle();return}if(b.dataset.bunkerRoom&&BUNKER_ROOMS[b.dataset.bunkerRoom]){activeBunkerRoom=b.dataset.bunkerRoom;message='';render();return;}if(b.dataset.roomUpgrade){roomUpgrade(b.dataset.roomUpgrade);return}if(b.dataset.furnitureUpgrade){furnitureUpgrade(b.dataset.furnitureUpgrade);return}if(b.dataset.hideoutSlot){setHideoutItem(b.dataset.hideoutSlot,b.dataset.hideoutItem);return}if(b.dataset.action==='hideout-reset'){if(confirm('Przywrócić początkowe wyposażenie i oświetlenie kryjówki?')){state.hideout=hideoutDefault();message='Przywrócono podstawowy wygląd schronu.';save();render()}return}if(b.dataset.page){if(!state.created)return;setPage(b.dataset.page);if(b.dataset.workshopSelect)workshopUid=b.dataset.workshopSelect;message='';render();return}if(b.dataset.action==='create'){let n=$('hero-name')?.value.trim();if(!n||n.length<2||n.length>24){message='Podaj imię od 2 do 24 znaków.';render();return}state.name=n;state.created=true;let bonus=origins[state.origin]?.bonus||{};for(const [k,v] of Object.entries(bonus))state.attrs[k]+=v;message='Witaj na Pustkowiach, '+n+'!';setPage('home');save();render();return}if(b.dataset.workshopSelect){workshopUid=b.dataset.workshopSelect;render();return}if(b.dataset.workshopUpgrade){applyUpgrade(b.dataset.workshopUpgrade);return}if(b.dataset.action==='workshop-test'){grantWorkshopTest();return}if(b.dataset.dominant){if(['left','right'].includes(b.dataset.dominant)){state.dominantHand=b.dataset.dominant;message='Zmieniono rękę dominującą.';save();render()}return}if(b.dataset.attr){if(state.points>0){state.attrs[b.dataset.attr]++;state.points--;save();render()}return}if(b.dataset.mission){let l=locations.find(x=>x.id===b.dataset.mission);if(!l||state.mission)return;/* Testy: energia nie jest zużywana */state.missionOutcomePending=false;state.mission={id:l.id,started:Date.now(),durationMs:travelSeconds(l)*1000,ends:Date.now()+travelSeconds(l)*1000,exploration:explorationStats()};message='';save();render();return}if(b.dataset.lock){const inst=instance(b.dataset.lock);if(inst){inst.locked=!inst.locked;message=inst.locked?'Przedmiot zabezpieczony.':'Zdjęto zabezpieczenie.';save();render()}return}
if(b.dataset.action==='bulk-visible'){const arr=bulkEligibleVisible(invFilter);if(arr.length&&arr.every(x=>bulkSelected.has(x.uid)))arr.forEach(x=>bulkSelected.delete(x.uid));else arr.forEach(x=>bulkSelected.add(x.uid));render();return}
if(b.dataset.action==='bulk-all'){state.inventory.filter(eligibleForBulk).forEach(x=>bulkSelected.add(x.uid));render();return}
if(b.dataset.action==='bulk-clear'){bulkSelected.clear();render();return}
if(b.dataset.action==='bulk-sell'){disposeBulk('sell');return}
if(b.dataset.action==='bulk-salvage'){disposeBulk('salvage');return}
if(b.dataset.sale){disposeItem(b.dataset.sale,'sell');return}
if(b.dataset.salvage){disposeItem(b.dataset.salvage,'salvage');return}
if(b.dataset.filter){invFilter=b.dataset.filter;render();return}if(b.dataset.inspect){selectedUid=b.dataset.inspect;render();return}if(b.dataset.action==='close-inspect'){selectedUid=null;render();return}if(b.dataset.unequip){let slot=b.dataset.unequip;if(slot in state.equip){state.equip[slot]=null;message='Zdjęto przedmiot.';save();render()}return}
if(b.dataset.equip!==undefined){
 let inst=instance(b.dataset.equip),obj=def(inst);if(!obj||obj.slot==='material')return;
 let slot=(obj.slot==='hand1')?(b.dataset.hand==='left'?'left':'right'):obj.slot==='hand2'?'right':obj.slot==='extra'?(['extra','extra2','extra3'].includes(b.dataset.extraSlot)?b.dataset.extraSlot:['extra','extra2','extra3'].find(s=>!state.equip[s])||'extra'):obj.slot;
 for(let key of Object.keys(state.equip))if(state.equip[key]===inst.uid)state.equip[key]=null;
 if(obj.slot==='hand2'){state.equip.right=inst.uid;state.equip.left=null}
 else if(obj.slot==='hand1'){
  if(state.equip.right&&def(instance(state.equip.right))?.slot==='hand2')state.equip.right=null;
  state.equip[slot]=inst.uid;
 }else state.equip[slot]=inst.uid;
 message='Założono: '+statsOf(inst).name;save();render();return
}if(b.dataset.action==='rename'){let name=prompt('Imię postaci (2–24 znaki):',state.name);if(name!==null&&name.trim().length>=2&&name.trim().length<=24){state.name=name.trim();save();render()}return}if(b.dataset.action==='heal'){if(state.scrap>=20&&state.hp<maxHp()){state.scrap-=20;message='Zdrowie przywrócone.';save();render()}return}if(b.dataset.action==='import'){$('ashen-import-file')?.click();return}if(b.dataset.action==='restore-backup'){restoreSaveBackup();return}if(b.dataset.action==='reset'){if(confirm('Rozpocząć nową grę? Bieżący postęp zostanie zastąpiony, ale zapiszemy jego kopię w tej przeglądarce.')){try{backupCurrentAndReplace(fresh());location.reload()}catch(err){message=err.message;render()}}return}if(b.dataset.action==='export'){exportSave();return}}
document.addEventListener('change',e=>{if(e.target.dataset.inventorySort!==undefined){if(INVENTORY_SORTS.some(([id])=>id===e.target.value)){state.inventorySort=e.target.value;save();render()}return}if(e.target.id==='ashen-import-file'){const file=e.target.files?.[0];if(file)importSaveFile(file);return}if(e.target.dataset.bulkUid){const uid=e.target.dataset.bulkUid;const inst=instance(uid);if(e.target.checked&&eligibleForBulk(inst))bulkSelected.add(uid);else bulkSelected.delete(uid);render();return}if(e.target.name==='dominantHand'){state.dominantHand=e.target.value;return}if(e.target.name==='origin'&&origins[e.target.value]){let n=$('hero-name')?.value;state.origin=e.target.value;render();if(n)$('hero-name').value=n}});document.addEventListener('click',act);if(!state.created)setPage('home');render();setInterval(()=>{let prev=state.mission?.id;sync();if(prev&&!state.mission){setPage('missions');render();}else{let c=$('countdown');if(c&&state.mission)c.textContent=Math.max(0,Math.ceil((state.mission.ends-Date.now())/1000))+' s';let f=$('mission-progress-fill');if(f&&state.mission){const loc=locations.find(l=>l.id===state.mission.id)||locations[0];const duration=state.mission.durationMs||travelSeconds(loc)*1000;f.style.width=Math.max(0,Math.min(100,100*(1-(state.mission.ends-Date.now())/duration)))+'%'}}},1000);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openItemDetail){openItemDetail=null;render()}});
})();
