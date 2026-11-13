
(()=>{'use strict';const KEY='ashen-save-v010';const attrNames={str:'Siła',dex:'Zręczność',end:'Wytrzymałość',per:'Percepcja',int:'Inteligencja',cha:'Charyzma'};
const rarities=[{name:'Zwykły',color:'#b8bfc3',weight:58,mult:1},{name:'Ulepszony',color:'#8ac78b',weight:25,mult:1.14},{name:'Rzadki',color:'#77afe5',weight:12,mult:1.32},{name:'Epicki',color:'#c391e4',weight:4,mult:1.58},{name:'Legendarny',color:'#f2bb65',weight:1,mult:1.95}];
const items=[
{id:'knife',name:'Zardzewiały nóż',slot:'weapon',min:5,max:9,bonus:{}},{id:'pistol',name:'Pistolet M-9',slot:'weapon',min:11,max:18,bonus:{per:1}},{id:'rifle',name:'Karabin Szabrownika',slot:'weapon',min:19,max:29,bonus:{per:2}},{id:'shotgun',name:'Strzelba Pustkowi',slot:'weapon',min:25,max:42,bonus:{dex:-1}},
{id:'pipe',name:'Żelazna rura',slot:'weapon',min:7,max:12,bonus:{str:1}},{id:'revolver',name:'Rewolwer Strażnika',slot:'weapon',min:14,max:22,bonus:{per:1}},{id:'machete',name:'Maczeta Zbieracza',slot:'weapon',min:13,max:24,bonus:{str:2}},{id:'smg',name:'Pistolet maszynowy Viper',slot:'weapon',min:18,max:27,bonus:{dex:1}},{id:'crossbow',name:'Kusza Tropiciela',slot:'weapon',min:17,max:31,bonus:{per:2}},{id:'carbine',name:'Karabinek Warty',slot:'weapon',min:23,max:34,bonus:{per:1}},{id:'hammer',name:'Młot Złomiarza',slot:'weapon',min:24,max:39,bonus:{str:2,dex:-1}},{id:'sniper',name:'Karabin Dalekiego Zasięgu',slot:'weapon',min:30,max:46,bonus:{per:3}},{id:'flame',name:'Miotacz Żaru',slot:'weapon',min:32,max:49,bonus:{int:2}},{id:'rail',name:'Prototypowa broń szynowa',slot:'weapon',min:38,max:57,bonus:{int:3}},{id:'cleaver',name:'Tasak z Pustkowi',slot:'weapon',min:15,max:25,bonus:{str:1}},
{id:'jacket',name:'Podarta kurtka',slot:'armor',armor:2,bonus:{}},{id:'vest',name:'Kamizelka z płytami',slot:'armor',armor:8,bonus:{end:1}},{id:'military',name:'Pancerz zwiadowcy',slot:'armor',armor:13,bonus:{dex:1}},{id:'coat',name:'Płaszcz Wędrowca',slot:'armor',armor:4,bonus:{per:1}},{id:'leather',name:'Skórzany kaftan',slot:'armor',armor:6,bonus:{dex:1}},{id:'hazmat',name:'Kombinezon skażeniowy',slot:'armor',armor:9,bonus:{end:2}},{id:'riot',name:'Pancerz oddziałów porządkowych',slot:'armor',armor:15,bonus:{end:1}},{id:'kevlar',name:'Kevlar Warty',slot:'armor',armor:17,bonus:{dex:1}},{id:'exosuit',name:'Egzoszkielet Górnika',slot:'armor',armor:21,bonus:{str:2}},{id:'sentinel',name:'Pancerz Strażnika Zero',slot:'armor',armor:25,bonus:{end:3}},
{id:'goggles',name:'Gogle zwiadowcy',slot:'accessory',bonus:{per:2}},{id:'gloves',name:'Rękawice technika',slot:'accessory',bonus:{int:2}},{id:'mask',name:'Maska filtracyjna',slot:'accessory',bonus:{end:2}},{id:'compass',name:'Kompas Wędrowca',slot:'accessory',bonus:{per:1}},{id:'bracelet',name:'Bransoleta ochronna',slot:'accessory',bonus:{end:1}},{id:'radio',name:'Radiostacja polowa',slot:'accessory',bonus:{int:1,cha:1}},{id:'scope',name:'Celownik optyczny',slot:'accessory',bonus:{per:3}},{id:'injector',name:'Wzmacniacz odruchów',slot:'accessory',bonus:{dex:2}},{id:'badge',name:'Odznaka Komendanta',slot:'accessory',bonus:{cha:3}},{id:'module',name:'Moduł neurotechniczny',slot:'accessory',bonus:{int:3}},
{id:'scrap',name:'Złom',slot:'material',bonus:{}},{id:'circuits',name:'Elektronika',slot:'material',bonus:{}},{id:'fuel',name:'Paliwo',slot:'material',bonus:{}},{id:'chemicals',name:'Chemikalia',slot:'material',bonus:{}},{id:'parts',name:'Części zamienne',slot:'material',bonus:{}}];

// Nowy model slotów: dwie ręce i osobne elementy ubioru.
const extraItems=[
{id:'wrench',name:'Klucz francuski',slot:'hand1',min:8,max:13,bonus:{int:1}},{id:'hatchet',name:'Toporek z odzysku',slot:'hand1',min:11,max:19,bonus:{str:1}},{id:'baton',name:'Pałka ochroniarza',slot:'hand1',min:9,max:16,bonus:{dex:1}},{id:'saber',name:'Szabla konwojenta',slot:'hand1',min:17,max:27,bonus:{str:1}},{id:'deserteagle',name:'Pistolet pustynny',slot:'hand1',min:19,max:28,bonus:{per:1}},
{id:'crowbar',name:'Łom zbrojony',slot:'hand2',min:20,max:31,bonus:{str:1}},{id:'sledge',name:'Młot wyburzeniowy',slot:'hand2',min:29,max:45,bonus:{str:3,dex:-1}},{id:'lmg',name:'Karabin maszynowy PK',slot:'hand2',min:33,max:49,bonus:{end:1}},{id:'harpoon',name:'Wyrzutnia harpunów',slot:'hand2',min:24,max:39,bonus:{per:2}},
{id:'jeans',name:'Wytarte dżinsy',slot:'pants',armor:1,bonus:{}},{id:'cargo',name:'Spodnie transportowca',slot:'pants',armor:2,bonus:{end:1}},{id:'scoutpants',name:'Spodnie zwiadowcy',slot:'pants',armor:3,bonus:{dex:2}},{id:'kevlarpants',name:'Spodnie z kevlaru',slot:'pants',armor:6,bonus:{end:1}},{id:'radiopants',name:'Spodnie izolacyjne',slot:'pants',armor:5,bonus:{int:1}},
{id:'sneakers',name:'Zniesione trampki',slot:'boots',armor:1,bonus:{dex:1}},{id:'workboots',name:'Buty robocze',slot:'boots',armor:2,bonus:{end:1}},{id:'combatboots',name:'Buty wojskowe',slot:'boots',armor:4,bonus:{str:1}},{id:'silentboots',name:'Buty cichego kroku',slot:'boots',armor:3,bonus:{dex:2}},{id:'hazboots',name:'Buty uszczelnione',slot:'boots',armor:5,bonus:{end:2}},
{id:'tshirt',name:'Bawełniany T-shirt',slot:'shirt',armor:0,bonus:{}},{id:'thermal',name:'Koszulka termiczna',slot:'shirt',armor:1,bonus:{end:1}},{id:'scoutshirt',name:'Koszulka zwiadowcza',slot:'shirt',armor:1,bonus:{per:2}},{id:'armorshirt',name:'Koszulka wzmocniona',slot:'shirt',armor:3,bonus:{end:1}},{id:'techshirt',name:'Koszulka technika',slot:'shirt',armor:1,bonus:{int:2}},
{id:'cap',name:'Wytarta czapka',slot:'head',armor:0,bonus:{}},{id:'helmet',name:'Hełm patrolowy',slot:'head',armor:4,bonus:{end:1}},{id:'hood',name:'Kaptur zwiadowcy',slot:'head',armor:1,bonus:{dex:2}},{id:'maskhelm',name:'Hełm przeciwgazowy',slot:'head',armor:5,bonus:{per:1}},{id:'commanderhelm',name:'Hełm dowódcy',slot:'head',armor:7,bonus:{cha:2}},
{id:'scarf',name:'Szal Pustkowi',slot:'extra',armor:0,bonus:{end:1}},{id:'neckwarmer',name:'Komin filtrujący',slot:'extra',armor:0,bonus:{end:2}},{id:'dustglasses',name:'Okulary pyłowe',slot:'extra',armor:0,bonus:{per:1}},{id:'nightgoggles',name:'Gogle noktowizyjne',slot:'extra',armor:0,bonus:{per:3}},{id:'bandana',name:'Bandana łowcy',slot:'extra',armor:0,bonus:{dex:1,per:1}},
];
extraItems.push(
{id:'fingerless',name:'Rękawiczki bez palców',slot:'hands',armor:0,bonus:{}},
{id:'workgloves',name:'Rękawice robocze',slot:'hands',armor:1,bonus:{}},
{id:'tacticalgloves',name:'Rękawice taktyczne',slot:'hands',armor:2,bonus:{}},
{id:'leathergloves',name:'Skórzane rękawice',slot:'hands',armor:1,bonus:{}},
{id:'steelbracers',name:'Stalowe karwasze',slot:'hands',armor:4,bonus:{}},
{id:'scoutbracers',name:'Karwasze zwiadowcy',slot:'hands',armor:3,bonus:{}},
{id:'kevlarbracers',name:'Karwasze kevlarowe',slot:'hands',armor:5,bonus:{}},
{id:'zerobracers',name:'Karwasze Strażnika Zero',slot:'hands',armor:8,bonus:{}}
);
items.push(...extraItems);
const twoHandIds=new Set(['rifle','shotgun','crossbow','carbine','hammer','sniper','flame','rail','lmg','harpoon','sledge','crowbar']);
const headIds=new Set(['mask']);
const extraIds=new Set(['compass','radio','scope','injector','badge','module']);
for(const d of items){if(d.slot==='weapon')d.slot=twoHandIds.has(d.id)?'hand2':'hand1';if(d.slot==='armor')d.slot='outer';if(d.slot==='accessory')d.slot=== 'accessory'&&(d.slot=(d.id==='gloves'||d.id==='bracelet')?'hands':headIds.has(d.id)?'head':'extra');}
const slotLabels={right:'Prawa ręka',left:'Lewa ręka',head:'Nakrycie głowy',shirt:'Koszulka',outer:'Kurtka / płaszcz / pancerz',hands:'Rękawice / karwasze',pants:'Spodnie',boots:'Buty',extra:'Akcesorium'};
const emptyEquipment=()=>Object.fromEntries(Object.keys(slotLabels).map(x=>[x,null]));
function normalizeEquip(){
 let old=state.equip||{},eq=emptyEquipment();
 const assign=(slot,uid)=>{if(uid&&instance(uid)&&!Object.values(eq).includes(uid))eq[slot]=uid};
 for(let slot of Object.keys(eq))assign(slot,old[slot]);
 assign('right',old.weapon);assign('outer',old.armor);assign('head',old.accessory1);assign('extra',old.accessory2||old.accessory); if(old.extra&&instance(old.extra)&&['gloves','bracelet'].includes(instance(old.extra).id)){eq.extra=null;assign('hands',old.extra)}
 // Zachowaj możliwie najwięcej wyposażenia ze starych zapisów.
 for(const [slot,uid] of Object.entries({...eq})){
  if(!uid)continue;let d=def(instance(uid));if(!d){eq[slot]=null;continue}
  let valid=(slot==='right'||slot==='left')?(d.slot==='hand1'||d.slot==='hand2'):d.slot===slot;
  if(!valid){eq[slot]=null;let dest=d.slot==='hand1'||d.slot==='hand2'?'right':d.slot;if(!eq[dest])eq[dest]=uid;else if(d.slot==='hand1'&&!eq.left)eq.left=uid}
 }
 if(eq.right&&def(instance(eq.right))?.slot==='hand2')eq.left=null;
 if(eq.left&&def(instance(eq.left))?.slot==='hand2'){eq.right=eq.left;eq.left=null}
 state.equip=eq;
}

const affixes=[{name:'Precyzyjny',bonus:{per:2}},{name:'Wzmocniony',bonus:{end:2}},{name:'Zwinny',bonus:{dex:2}},{name:'Brutalny',bonus:{str:2}},{name:'Techniczny',bonus:{int:2}},{name:'Weterana',bonus:{per:1,end:1}},{name:'Łowcy',bonus:{dex:1,per:1}},{name:'Dowódcy',bonus:{cha:2}}];
const locations=[{id:'ruins',name:'Bliska wyprawa — Ruiny osiedla',level:1,time:5,cost:5,xp:[20,35],scrap:[12,25],enemies:[{name:'Zdziczały szabrownik',hp:45,atk:[5,10],acc:4,dodge:4,armor:1},{name:'Wygłodniały mutant',hp:52,atk:[6,11],acc:4,dodge:3,armor:0}],drops:[['pistol',.18],['jacket',.15],['goggles',.08],['pipe',.15],['coat',.11],['compass',.09],['leather',.08],['revolver',.06]]},{id:'hospital',name:'Średnia wyprawa — Stary szpital',level:4,time:10,cost:12,xp:[45,70],scrap:[25,48],enemies:[{name:'Skażony sanitariusz',hp:105,atk:[11,19],acc:7,dodge:6,armor:3},{name:'Mutant z oddziału B',hp:115,atk:[12,20],acc:6,dodge:5,armor:4}],drops:[['vest',.17],['rifle',.12],['gloves',.12],['machete',.13],['smg',.12],['hazmat',.1],['radio',.08],['crossbow',.08],['injector',.07],['bracelet',.08]]},{id:'outpost',name:'Daleka wyprawa — Posterunek wojskowy',level:8,time:15,cost:25,xp:[90,130],scrap:[50,90],enemies:[{name:'Dezerter z posterunku',hp:180,atk:[19,28],acc:11,dodge:9,armor:9},{name:'Strażnik kompleksu',hp:200,atk:[18,30],acc:12,dodge:7,armor:11}],drops:[['military',.15],['shotgun',.11],['mask',.14],['carbine',.14],['hammer',.12],['sniper',.09],['flame',.06],['rail',.025],['riot',.13],['kevlar',.11],['exosuit',.07],['sentinel',.025],['scope',.12],['badge',.08],['module',.07],['cleaver',.08]]}];
const fresh=()=>({version:1,created:false,origin:'scout',dominantHand:'right',name:'Wędrowiec',level:1,xp:0,points:5,attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5},hp:110,energy:100,lastRegen:Date.now(),scrap:0,credits:0,cores:0,schematics:0,workshopTestGranted:false,materials:{tkanina:0,skora:0,tworzywo:0,elektronika:0,czesci:0},inventory:[{uid:'starter-knife',id:'knife',rarity:0,affix:null},{uid:'starter-jacket',id:'jacket',rarity:0,affix:null}],equip:{right:'starter-knife',left:null,shirt:null,pants:null,boots:null,outer:'starter-jacket',head:null,extra:null},mission:null,reports:[],battles:0,wins:0});let state;try{state=JSON.parse(localStorage.getItem(KEY))||fresh();if(state.version!==1)state=fresh()}catch{state=fresh()}if(state.created===undefined)state.created=true;if(!['left','right'].includes(state.dominantHand))state.dominantHand='right';// Migracja zapisów z v0.1.0–0.1.2; stare wyposażenie zachowuje podstawowe parametry.
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
const materialKeys=['scrap','tkanina','skora','tworzywo','elektronika','czesci'];
const materialLabels={scrap:'Złom',tkanina:'Tkanina',skora:'Skóra',tworzywo:'Tworzywo',elektronika:'Elektronika',czesci:'Części mechaniczne'};
if(!state.materials||typeof state.materials!=='object')state.materials={};
for(const key of materialKeys.slice(1))if(!Number.isFinite(state.materials[key])||state.materials[key]<0)state.materials[key]=0;
for(const inst of state.inventory){if(typeof inst.locked!=='boolean')inst.locked=Number(inst.rarity)>=3}
// Wariant B: dwa NIEZALEŻNE losowania. Rzadkość wpływa na szanse, nie narzuca dodatków.
// Stabilne identyfikatory tekstowe pozwalają dodawać modyfikatory w kolejnych wersjach.
const rangedIds=new Set(['pistol','revolver','smg','deserteagle','rifle','shotgun','crossbow','carbine','sniper','flame','rail','lmg','harpoon']);
const weaponSlot=s=>s==='hand1'||s==='hand2';
// Naturalne odmiany nazw prefiksów dla żeńskich i mnogich nazw sprzętu.
const feminineItemIds=new Set(['shotgun','crossbow','pipe','machete','jacket','vest','radio','bracelet','cap','scarf','bandana','mask','scope','saber','hatchet','sledge','rail','lmg','nightgoggles2','thermal','armorshirt','techshirt','scoutshirt','tshirt','deserteagle2','leather','sneakers2','hood2']);
const pluralItemIds=new Set(['jeans','cargo','scoutpants','kevlarpants','radiopants','sneakers','workboots','combatboots','silentboots','hazboots','goggles','gloves','dustglasses','nightgoggles','parts','fingerless','workgloves','tacticalgloves','leathergloves','steelbracers','scoutbracers','kevlarbracers','zerobracers']);
const femininePrefix={precise:'Precyzyjna',brutal:'Brutalna',agile:'Zwinna',reinforced:'Wzmocniona',technical:'Techniczna',light:'Lekka',armored:'Pancerna',destructive:'Niszczycielska',lethal:'Zabójcza',scrap:'Złomowa'};
const pluralPrefix={precise:'Precyzyjne',brutal:'Brutalne',agile:'Zwinne',reinforced:'Wzmocnione',technical:'Techniczne',light:'Lekkie',armored:'Pancerne',destructive:'Niszczycielskie',lethal:'Zabójcze',scrap:'Złomowe'};
function prefixLabel(mod,base){if(!mod)return null;return pluralItemIds.has(base.id)?pluralPrefix[mod.id]||mod.name:feminineItemIds.has(base.id)?femininePrefix[mod.id]||mod.name:mod.name}
// Rzadkość jest częścią pełnej nazwy. Zwykły pozostaje bez dodatkowego przymiotnika.
const rarityForms={f:['','Ulepszona','Rzadka','Epicka','Legendarna'],p:['','Ulepszone','Rzadkie','Epickie','Legendarne'],m:['','Ulepszony','Rzadki','Epicki','Legendarny']};
function rarityPrefix(inst,d){let n=Number(inst?.rarity)||0;let form=pluralItemIds.has(d.id)?'p':feminineItemIds.has(d.id)?'f':'m';return rarityForms[form][n]||'';}


const prefixDefs=[
 {id:'precise',name:'Precyzyjny',bonus:{per:2},on:'weapon'},
 {id:'brutal',name:'Brutalny',bonus:{str:2},on:'weapon'},
 {id:'agile',name:'Zwinny',bonus:{dex:2},on:'any'},
 {id:'reinforced',name:'Wzmocniony',bonus:{end:2},on:'armor'},
 {id:'technical',name:'Techniczny',bonus:{int:2},on:'any'},
 {id:'light',name:'Lekki',bonus:{dex:1,per:1},on:'armor'},
 {id:'armored',name:'Pancerny',armorPct:15,on:'armor'},
 {id:'destructive',name:'Niszczycielski',damagePct:12,on:'weapon'},
 {id:'lethal',name:'Zabójczy',critPp:5,on:'weapon'},
 {id:'scrap',name:'Złomowy',damagePct:-10,armorPct:-10,on:'any',maxRarity:1}
];
const suffixDefs=[
 {id:'hunter',name:'Łowcy',bonus:{per:2},on:'any'},
 {id:'strong',name:'Siłacza',bonus:{str:2},on:'any'},
 {id:'shadow',name:'Cienia',bonus:{dex:2},on:'any'},
 {id:'veteran',name:'Weterana',bonus:{str:1,end:1},on:'any'},
 {id:'technician',name:'Technika',bonus:{int:2},on:'any'},
 {id:'sniper',name:'Snajpera',bonus:{per:3},on:'ranged'},
 {id:'berserker',name:'Berserkera',damagePct:8,bonus:{end:-1},on:'weapon'},
 {id:'survivor',name:'Ocalonego',bonus:{end:3},on:'armor'},
 {id:'commander',name:'Dowódcy',bonus:{cha:2},on:'any'},
 {id:'mutant',name:'Mutanta',bonus:{str:3,cha:-2},on:'any'}
];
const prefixChance=[.18,.32,.50,.70,.85],suffixChance=[.06,.15,.29,.55,.78];
function suitable(mod,d,rar){
 if(!mod||!d||d.slot==='material'||(mod.maxRarity!==undefined&&rar>mod.maxRarity))return false;
 if(mod.on==='weapon'&&!weaponSlot(d.slot))return false;
 if(mod.on==='armor'&&weaponSlot(d.slot))return false;
 if(mod.on==='ranged'&&!rangedIds.has(d.id))return false;
 if(mod.armorPct&&!weaponSlot(d.slot)&&!d.armor)return false; // Nie dajemy procentów pancerza ubraniom bez pancerza.
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
 const dmgPct=pct('damagePct'),armorPct=pct('armorPct'),critPp=pct('critPp');
 const pref=findModifier(prefixDefs,inst?.prefix),suf=findModifier(suffixDefs,inst?.suffix);
 const legacy=mods.find(x=>x.legacy);
 const name=[rarityPrefix(inst,d),prefixLabel(pref,d)||legacy?.name,d.name,suf?.name].filter(Boolean).join(' ');
 const weapon=weaponSlot(d.slot),upgrade=Math.min(5,Math.max(0,Number(inst?.upgrade)||0));
 const upgradedName=upgrade?name+' +'+upgrade:name;
 const armorUp=UPGRADE_POWER[upgrade];
 return {...d,name:upgradedName,upgrade,rarity:rarity(inst).name,
  min:weapon?Math.max(1,Math.round(d.min*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  max:weapon?Math.max(1,Math.round(d.max*m*(1+dmgPct/100))+UPGRADE_POWER[upgrade]):undefined,
  armor:!weapon&&d.slot!=='material'?Math.max(0,Math.round((d.armor||0)*m*(1+armorPct/100))+((d.armor||0)===0 ? [0,1,2,3,5][Math.min(4,Math.max(0,Number(inst?.rarity)||0))] : 0)+armorUp):undefined,
  bonus:rolledBonus(inst),critPp,damagePct:dmgPct,armorPct,
  prefixName:prefixLabel(pref,d)||null,suffixName:suf?.name||null,
  effects:mods.map(x=>({name:x===pref?prefixLabel(x,d):x.name,description:modifierText(x)}))};
}
function rollItem(id){
 const r=Math.random()*100;let t=0,rar=0;
 for(let i=0;i<rarities.length;i++){t+=rarities[i].weight;if(r<t){rar=i;break}}
 const d=item(id);
 const prefix=d?.slot!=='material'&&Math.random()<prefixChance[rar]?pickModifier(prefixDefs,d,rar):null;
 const suffix=d?.slot!=='material'&&Math.random()<suffixChance[rar]?pickModifier(suffixDefs,d,rar):null;
 return {uid:'loot-'+Date.now()+'-'+Math.random().toString(36).slice(2,10),id,rarity:rar,prefix,suffix,locked:rar>=3};
}
function bonusText(b){return Object.entries(b||{}).filter(([,v])=>v!==0).map(([k,v])=>`${attrNames[k]} ${v>0?'+':''}${v}`).join(' · ')}
function modifierText(m){return [bonusText(m.bonus),m.damagePct?`Obrażenia ${m.damagePct>0?'+':''}${m.damagePct}%`:null,m.armorPct?`Pancerz ${m.armorPct>0?'+':''}${m.armorPct}%`:null,m.critPp?`Szansa trafienia krytycznego +${m.critPp} p.p.`:null].filter(Boolean).join(' · ')}
function slotName(slot){return slotLabels[slot]||({hand1:'Broń jednoręczna',hand2:'Broń dwuręczna',material:'Surowiec'})[slot]||slot}
function statDetails(o){return `${weaponSlot(o.slot)?`Obrażenia ${o.min}–${o.max}${o.slot==='hand2'?' · obie ręce':''}`:o.slot==='material'?'Materiał':`Pancerz ${o.armor||0}`}${bonusText(o.bonus)?' · '+bonusText(o.bonus):''}${o.critPp?` · Krytyk +${o.critPp} p.p.`:''}`}
function affixDetails(o){return (o.effects||[]).length?`<div class="small muted" style="margin-top:5px">${o.effects.map(x=>`<div>↳ ${escape(x.name)}: ${escape(x.description)}</div>`).join('')}</div>`:''}
function pickLoot(loc){
 // Każda wyprawa: 1 przedmiot pewny; 28% szans na drugi, 7% na trzeci.
 const roll=Math.random(),count=roll<.07?3:roll<.35?2:1;
 const all=loc.drops.map(([id,w])=>({id,w}));
 let additions=loc.id==='ruins'?['wrench','hatchet','baton','tshirt','jeans','sneakers','cap','scarf','dustglasses','workboots','thermal','bandana','fingerless','workgloves','leathergloves']:
 loc.id==='hospital'?['saber','deserteagle','crowbar','cargo','scoutpants','combatboots','scoutshirt','hood','neckwarmer','silentboots','techshirt','tacticalgloves','scoutbracers','steelbracers']:
 ['sledge','lmg','harpoon','kevlarpants','radiopants','hazboots','armorshirt','helmet','maskhelm','commanderhelm','nightgoggles','kevlarbracers','zerobracers'];
 for(let id of additions)all.push({id,w:0.12});
 const pool=all.filter(x=>item(x.id));
 const picks=[];
 for(let i=0;i<count;i++){
  const total=pool.reduce((v,x)=>v+x.w,0);let r=Math.random()*total,chosen=pool[pool.length-1];
  for(const p of pool){r-=p.w;if(r<=0){chosen=p;break}}
  const rolled=rollItem(chosen.id);picks.push(rolled);state.inventory.push(rolled);
 }
 return picks;
}
let page='home',message='',invFilter='all',selectedUid=null,workshopUid=null;let bulkSelected=new Set();const $=id=>document.getElementById(id),item=id=>items.find(x=>x.id===id),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{message='Nie można zapisać postępu w tej przeglądarce.'}}function attrs(){const a={...state.attrs};Object.values(state.equip).filter(Boolean).forEach(uid=>{for(const [k,v] of Object.entries(statsOf(instance(uid))?.bonus||{}))a[k]+=v});return a}function maxHp(){return 60+attrs().end*10}function xpNeed(){return Math.floor(80*Math.pow(state.level,1.35))}function regen(){let now=Date.now(),ticks=Math.floor((now-state.lastRegen)/45000);if(ticks>0){state.energy=Math.min(100,state.energy+ticks);state.lastRegen+=ticks*45000}}function levelUp(){let n=0;while(state.xp>=xpNeed()){state.xp-=xpNeed();state.level++;state.points+=3;n++}return n}function damage(p,e){let base=rand(p.min,p.max)+Math.floor(e.str/3);return Math.max(1,Math.floor(base*(1-clamp((e.armor||0)/100,0,.6))))}function fight(enemy){
 const a=attrs();
 const hands=[state.dominantHand,state.dominantHand==='right'?'left':'right'];
 const mainInst=instance(state.equip[hands[0]]),offInst=instance(state.equip[hands[1]]);
 const main=statsOf(mainInst),off=statsOf(offInst);
 const attacks=[];
 if(main)attacks.push({weapon:main,hand:hands[0],power:1});
 if(off&&off.slot==='hand2'){attacks.length=0;attacks.push({weapon:off,hand:hands[1],power:1});}
 else if(off&&off.slot==='hand1')attacks.push({weapon:off,hand:hands[1],power:.8});
 // Broń założona tylko w niedominującej ręce nadal daje jeden atak, przy 80% mocy.
 if(!attacks.length)attacks.push({weapon:statsOf({id:'knife',rarity:0}),hand:hands[0],power:1});
 const armor=Object.entries(state.equip).filter(([k])=>!['right','left'].includes(k))
   .reduce((sum,[,uid])=>sum+(statsOf(instance(uid))?.armor||0),0);
 const hero={hp:maxHp(),acc:6+a.per*1.3,dodge:3+a.dex*1.1,armor:armor+Math.floor(a.end/4)};
 const foe={...enemy},lines=[];
 const hitAttack=(attacker,defender,who,r,weapon=null)=>{
   const chance=clamp(70+2*(attacker.acc-defender.dodge),15,95);
   const handName=weapon?' ('+(weapon.hand==='right'?'prawa':'lewa')+' ręka, '+Math.round(weapon.power*100)+'%)':'';
   if(Math.random()*100>=chance){lines.push(`Runda ${r}: ${who==='hero'?'Chybiasz':'Przeciwnik chybia'}${handName}.`);return}
   const critical=who==='hero'&&Math.random()<clamp(.05+a.per*.005+(weapon?.weapon.critPp||0)/100,0,.35);
   let raw;
   if(weapon){raw=Math.max(1,Math.floor((rand(weapon.weapon.min,weapon.weapon.max)+Math.floor(a.str/3))*weapon.power));}
   else raw=rand(attacker.atk[0],attacker.atk[1]);
   if(critical)raw=Math.floor(raw*1.6);
   const dmg=Math.max(1,Math.floor(raw*(1-clamp(defender.armor/100,0,.6))));
   defender.hp=Math.max(0,defender.hp-dmg);
   lines.push(`Runda ${r}: ${who==='hero'?'Zadajesz':'Otrzymujesz'} ${dmg} obrażeń${handName}${critical?' (KRYTYCZNE)':''}.`);
 };
 for(let r=1;r<=10&&hero.hp>0&&foe.hp>0;r++){
   const order=rand(1,20)+a.dex>=rand(1,20)+foe.dodge?['hero','foe']:['foe','hero'];
   for(const who of order){
     if(hero.hp<=0||foe.hp<=0)break;
     if(who==='hero'){
       for(const weapon of attacks){if(foe.hp<=0)break;hitAttack(hero,foe,'hero',r,weapon)}
     } else hitAttack(foe,hero,'foe',r);
   }
 }
 return {won:foe.hp<=0,lines,heroHp:hero.hp,enemyHp:foe.hp};
}
function finish(){
 let m=state.mission;if(!m||Date.now()<m.ends)return;
 let loc=locations.find(x=>x.id===m.id),enemy=loc.enemies[rand(0,loc.enemies.length-1)],result=fight(enemy),xp=result.won?rand(...loc.xp):Math.ceil(loc.xp[0]*.3),scrap=result.won?rand(...loc.scrap):0;
 state.xp+=xp;state.scrap+=scrap;state.battles++;if(result.won)state.wins++;
 // Znalezisko z wyprawy jest gwarantowane, również gdy starcie zakończy się porażką.
 const drops=pickLoot(loc).map(x=>({uid:x.uid,id:x.id,name:statsOf(x).name,rarity:statsOf(x).rarity,slot:statsOf(x).slot,details:statDetails(statsOf(x)),effects:statsOf(x).effects}));
 // Rzadkie komponenty są losowane OSOBNO od gwarantowanych 1–3 sztuk ekwipunku.
 // Podczas testów również przegrana walka może przynieść znalezisko.
 const special={cores:0,schematics:0};
 if(loc.id==='outpost'){
  if(Math.random()<.08){state.cores+=1;special.cores=1;}
  if(Math.random()<.03){state.schematics+=1;special.schematics=1;}
 }
 let levels=levelUp();state.reports.unshift({at:new Date().toLocaleString('pl-PL'),location:loc.name,enemy:enemy.name,...result,xp,scrap,drops,special,drop:drops[0]?.name||null,dropRarity:drops[0]?.rarity||null,levels});
 state.reports=state.reports.slice(0,30);state.mission=null;
 message=`${result.won?'Zwycięstwo':'Porażka w walce'} · znaleziono ${drops.length} ${drops.length===1?'przedmiot':'przedmioty'}${special.cores?' · RDZEŃ TECHNOLOGICZNY!':''}${special.schematics?' · SCHEMAT PRZEDWOJENNY!':''}!`;
 save()
}
function sync(){regen();if(state.mission)state.mission.ends=0;finish();save()}function bar(label,val,max,color=''){return `<div class="small muted">${label}: ${val} / ${max}</div><div class="bar ${color}"><div class="fill" style="width:${clamp(val/max*100,0,100)}%"></div></div>`}function card(title,body){return `<div class="tile"><h3>${title}</h3>${body}</div>`}function section(title,body){return `<section class="section"><h2>${title}</h2>${body}</section>`}function nav(){return[['home','⌂ Pulpit'],['character','♙ Postać'],['missions','⌖ Wyprawy'],['inventory','▣ Ekwipunek'],['workshop','🔧 Warsztat'],['storage','⚙ Magazyn'],['reports','☷ Raporty'],['bunker','⚙ Kryjówka']].map(([k,v])=>`<button data-page="${k}" class="${page===k?'active':''}">${v}</button>`).join('')}
function home(){return `<div class="hero"><div class="sub">SEKTOR 17 · ROK 2197</div><h1>Witaj na Pustkowiach, ${escape(state.name)}</h1><p class="muted">Świat po Czarnym Świcie nie wybacza błędów. Przeszukuj ruiny, walcz o przetrwanie i zbieraj wyposażenie.</p><button class="primary" data-page="missions">Wyrusz na wyprawę →</button></div><div class="grid">${card('Postać',`<div class="value">Poziom ${state.level}</div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}`)}${card('Zasoby',`<div class="value">${state.scrap} złomu</div><p>Energia: bez limitu (testy)</p>`)}${card('Przetrwanie',`<div class="value">${state.wins}/${state.battles}</div><p>Wygrane walki / wszystkie walki</p>`)}</div><div class="divider"></div>${card('Sygnał z radiostacji',`<p>Na północ od schronu wykryto aktywność. Pierwsza wyprawa do ruin osiedla jest dostępna już teraz.</p><button data-page="missions">Sprawdź lokacje</button>`)}`}
function character(){let a=attrs();return section('Twoja postać',`<div class="panel"><div class="row wrap"><div><div class="tag">OCALAŁY · POZIOM ${state.level}</div><h2 style="margin:8px 0">${escape(state.name)}</h2></div><div class="actions"><button data-action="rename">Zmień imię</button></div></div>${bar('Doświadczenie',state.xp,xpNeed(),'gold')}<p class="small muted">Ręka dominująca: <strong>${state.dominantHand==='left'?'lewa':'prawa'}</strong>. Podczas testów możesz ją zmienić poniżej.</p><div class="actions"><button data-dominant="right" ${state.dominantHand==='right'?'disabled':''}>Ustaw prawą rękę</button><button data-dominant="left" ${state.dominantHand==='left'?'disabled':''}>Ustaw lewą rękę</button></div><p class="tag">Punkty atrybutów do rozdania: ${state.points}</p><div class="grid two">${Object.entries(attrNames).map(([k,n])=>card(n,`<div class="row"><strong class="value">${a[k]}</strong><button data-attr="${k}" ${state.points<=0?'disabled':''}>+1</button></div><div class="small muted">Baza ${state.attrs[k]}${a[k]!==state.attrs[k]?` · Sprzęt ${a[k]-state.attrs[k]>=0?'+':''}${a[k]-state.attrs[k]}`:''}</div>`)).join('')}</div></div>`)}
function missions(){return section('Wyprawy',`<p class="muted">Każda wyprawa gwarantuje przynajmniej 1 przedmiot: 65% szans na jeden, 28% na dwa i 7% na trzy. Wynik otrzymasz natychmiast po kliknięciu wyprawy. <strong>Daleka wyprawa:</strong> dodatkowo 8% szans na rdzeń technologiczny oraz 3% na schemat przedwojenny (losowania niezależne).</p>${state.mission?`<div class="notice">Trwa wyprawa: <strong>${locations.find(x=>x.id===state.mission.id).name}</strong><br>Pozostało <strong id="countdown">...</strong></div>`:''}${state.reports.length?foundLootPreview(state.reports[0]):''}<div class="grid" style="margin-top:14px">${locations.map(l=>card(l.name,`<p>Poziom zalecany: ${l.level}+ (możesz wejść wcześniej)</p><p>Start natychmiastowy · Energia: bez kosztu (testy)</p><p class="small muted">Przykładowe łupy: ${l.drops.map(([id])=>item(id).name).join(', ')}</p><button class="primary" data-mission="${l.id}" ${state.mission?'disabled':''}>Rozpocznij wyprawę</button>${state.mission?'<p class="small muted">Najpierw zakończ obecną wyprawę.</p>':state.level<l.level?'<p class="small muted">Uwaga: trudna wyprawa dla Twojego poziomu.</p>':''}`)).join('')}</div><p class="small muted">Wyprawy kończą się natychmiast na potrzeby testów. Energia nie jest zużywana. Obrażenia z walk nie przenoszą się na kolejne wyprawy.</p>`)}

function itemFamily(d){if(!d)return 'empty';const id=d.id||'';if(d.slot==='material')return 'material';if(d.slot==='shirt')return 'shirt';if(d.slot==='outer')return id==='coat'?'coat':'outer';if(d.slot==='pants')return 'pants';if(d.slot==='boots')return 'boots';if(d.slot==='head'){if(id==='hood')return 'hood';if(id.includes('helm')||id==='helmet'||id==='cap')return 'head';return 'head';}if(d.slot==='hands'){if(id.includes('bracer'))return 'bracer';return 'gloves';}if(d.slot==='extra'){if(id.includes('goggle')||id.includes('glasses'))return 'goggles';if(id==='scarf'||id==='neckwarmer'||id==='bandana')return 'neck';if(id==='radio')return 'radio';if(id==='scope')return 'scope';if(id==='injector')return 'injector';if(id==='badge')return 'badge';if(id==='module')return 'module';if(id==='compass')return 'compass';if(id==='bracelet')return 'bracelet';return 'extra';}if(d.slot==='hand1'){if(['knife','machete','saber','cleaver'].includes(id))return 'blade';if(['hatchet'].includes(id))return 'axe';if(['pistol','revolver','deserteagle','smg'].includes(id))return 'pistol';if(['pipe','wrench','baton'].includes(id))return 'club';return 'hand1';}if(d.slot==='hand2'){if(['shotgun','rifle','carbine','sniper','lmg','harpoon'].includes(id))return 'rifle';if(['crossbow'].includes(id))return 'crossbow';if(['flame'].includes(id))return 'flame';if(['rail'].includes(id))return 'rail';if(['crowbar','sledge','hammer'].includes(id))return 'heavy';return 'hand2';}return d.slot||'generic'}
function slotPlaceholder(slot){return ({head:'head',extra:'extra',right:'hand1',left:'hand1',hands:'gloves',shirt:'shirt',outer:'outer',pants:'pants',boots:'boots'})[slot]||'empty'}
function svgIcon(kind,color){const bg='#11171b',accent=color||'#9ba7ad';const start=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="62" height="62" rx="12" fill="${bg}" stroke="${accent}" stroke-width="1.6"/>`;const end='</svg>';const c=accent;
const map={blade:`<path d="M16 45 L28 33 L31 36 L20 48 Z" fill="${c}"/><path d="M27 32 L45 12 L52 19 L34 39 Z" fill="#d8d7d2" stroke="${c}" stroke-width="1"/><circle cx="30" cy="39" r="2.4" fill="#7b4b2d"/>`,axe:`<path d="M31 12 h4 v36 h-4z" fill="#8b6a43"/><path d="M35 18 q15 4 15 14 q-8 7-18 6 z" fill="${c}"/><path d="M29 24 q-10 2-13 9 q4 7 13 8 z" fill="#6c757c"/>`,pistol:`<path d="M16 28 h26 v8 h-10 l-4 8 h-8 l4-8 h-8 z" fill="${c}"/><rect x="39" y="24" width="10" height="6" rx="2" fill="#76828a"/>`,club:`<path d="M22 16 q10 -4 17 2 q4 5 -2 10 l-2 2 l8 18 l-6 2 l-8-18 l-4 1 q-8 1-11-5 q-2-6 8-12 z" fill="${c}"/>`,rifle:`<path d="M8 33 h38 v5 h-38 z" fill="${c}"/><path d="M24 26 h13 v6 h-13 z" fill="#89959d"/><path d="M37 35 l12 7 l3-3 l-7-7 z" fill="#77553a"/><path d="M16 38 l-3 10 h5 l3-10 z" fill="#6e767c"/>`,crossbow:`<path d="M12 31 q8-12 20-12 q12 0 20 12" fill="none" stroke="${c}" stroke-width="4"/><path d="M32 20 v24" stroke="#d8d7d2" stroke-width="3"/><path d="M24 44 h16" stroke="#8b6a43" stroke-width="4"/>`,flame:`<rect x="18" y="28" width="24" height="10" rx="3" fill="#78838a"/><path d="M44 30 q8 2 10 8 q-4 2-9 1 z" fill="#f59e0b"/><path d="M47 28 q7 2 8 7 q-4 1-7 0 z" fill="#ef4444"/><rect x="14" y="24" width="8" height="18" rx="3" fill="${c}"/>`,rail:`<rect x="12" y="27" width="34" height="10" rx="4" fill="${c}"/><rect x="21" y="22" width="16" height="4" rx="2" fill="#83d0ff"/><path d="M46 29 h9 v6 h-9z" fill="#bfc8cd"/><circle cx="18" cy="32" r="3" fill="#83d0ff"/>`,heavy:`<rect x="29" y="11" width="6" height="38" fill="#8a6940"/><path d="M19 14 h26 v13 h-26 z" fill="${c}"/><path d="M17 25 h30 v4 h-30 z" fill="#788188"/>`,shirt:`<path d="M20 15 l8 5 h8 l8-5 l8 10 l-6 5 v20 h-28 v-20 l-6-5 z" fill="${c}"/>`,outer:`<path d="M17 12 l10 5 h10 l10-5 l7 9 l-7 9 v20 h-30 v-20 l-7-9 z" fill="${c}"/><path d="M32 17 v33" stroke="#10161a" stroke-width="2"/>`,coat:`<path d="M20 10 l12 6 l12-6 l8 12 l-8 7 v22 l-12-7 l-12 7 v-22 l-8-7 z" fill="${c}"/><path d="M32 16 v31" stroke="#10161a" stroke-width="2"/>`,pants:`<path d="M21 14 h22 l-2 16 l5 20 h-10 l-4-15 l-4 15 h-10 l5-20 z" fill="${c}"/>`,boots:`<path d="M18 20 h11 v17 l6 7 h11 v6 h-26 l-6-7 z" fill="${c}"/><path d="M35 24 h11 v13 l4 7 h-15 z" fill="#6f7a82"/>`,head:`<path d="M20 18 q12-12 24 0 v8 q0 8-6 14 l-3 10 h-6 l-3-10 q-6-6-6-14 z" fill="${c}"/>`,hood:`<path d="M18 16 q14-16 28 0 v12 q0 8-6 14 h-16 q-6-6-6-14 z" fill="${c}"/><circle cx="32" cy="29" r="7" fill="#12171a"/>`,gloves:`<path d="M19 17 q4 0 4 4 v8 h2 v-10 q0-3 3-3 q3 0 3 3 v10 h2 v-9 q0-3 3-3 q3 0 3 3 v9 h2 v-7 q0-3 3-3 q3 0 3 3 v15 q0 7-7 11 h-18 q-7-3-7-10 v-10 q0-4 4-4 z" fill="${c}"/>`,bracer:`<path d="M17 18 l13 4 l-4 26 l-13-4 z" fill="${c}"/><path d="M34 22 l13 4 l-4 26 l-13-4 z" fill="#7c858b"/>`,goggles:`<rect x="12" y="26" width="18" height="12" rx="5" fill="${c}"/><rect x="34" y="26" width="18" height="12" rx="5" fill="${c}"/><path d="M30 31 h4" stroke="#95d7ff" stroke-width="3"/><path d="M10 32 h4 M50 32 h4" stroke="#78828a" stroke-width="3"/>`,neck:`<path d="M16 22 q16 10 32 0 v8 q-9 6-9 15 h-14 q0-9-9-15 z" fill="${c}"/>`,compass:`<circle cx="32" cy="32" r="16" fill="${c}"/><circle cx="32" cy="32" r="11" fill="#14191d"/><path d="M32 21 l4 11 l-4 11 l-4-11 z" fill="#e7e8ea"/><path d="M32 21 l4 11 l-4 0 z" fill="#ef4444"/>`,bracelet:`<circle cx="32" cy="32" r="13" fill="none" stroke="${c}" stroke-width="8"/><circle cx="32" cy="32" r="5" fill="#11171b"/>`,radio:`<rect x="20" y="18" width="24" height="30" rx="4" fill="${c}"/><rect x="25" y="23" width="14" height="9" rx="2" fill="#1d2a31"/><circle cx="28" cy="39" r="3" fill="#0e1418"/><circle cx="37" cy="39" r="3" fill="#0e1418"/><path d="M44 20 l5-8" stroke="#bfc8cd" stroke-width="2"/>`,scope:`<rect x="14" y="29" width="36" height="8" rx="4" fill="${c}"/><circle cx="19" cy="33" r="8" fill="none" stroke="#d8d7d2" stroke-width="3"/><circle cx="45" cy="33" r="5" fill="#95d7ff"/>`,injector:`<rect x="18" y="28" width="20" height="8" rx="4" fill="${c}"/><path d="M38 30 l10-10 l4 4 l-10 10 z" fill="#d8d7d2"/><path d="M14 30 h8" stroke="#78828a" stroke-width="3"/>`,badge:`<path d="M32 14 l6 8 l10 2 l-5 8 l2 10 l-10-3 l-10 3 l2-10 l-5-8 l10-2 z" fill="${c}"/>`,module:`<rect x="16" y="16" width="32" height="32" rx="6" fill="${c}"/><rect x="24" y="24" width="16" height="16" rx="3" fill="#11171b"/><path d="M12 24 h6 M12 32 h6 M12 40 h6 M46 24 h6 M46 32 h6 M46 40 h6" stroke="#89c9ff" stroke-width="2"/>`,material:`<path d="M16 34 l12-18 h20 l8 12 l-10 20 h-24 z" fill="${c}"/><path d="M25 22 h10 v8 h-10z" fill="#11171b"/>`,extra:`<circle cx="32" cy="32" r="15" fill="${c}"/><circle cx="32" cy="32" r="6" fill="#11171b"/>`,hand1:`<path d="M20 42 l24-20 l4 4 l-24 20 z" fill="${c}"/>`,hand2:`<path d="M10 32 h40 v4 h-40 z" fill="${c}"/>`,empty:`<path d="M20 20 h24 v24 h-24z" fill="none" stroke="${c}" stroke-dasharray="4 3" stroke-width="2"/><path d="M25 32 h14 M32 25 v14" stroke="${c}" stroke-width="2"/>`}; return start+(map[kind]||map.extra)+end}
function itemIcon(instOrDef,size=''){const d=instOrDef&&instOrDef.id&&instOrDef.uid===undefined?instOrDef:def(instOrDef); const r=instOrDef&&instOrDef.uid!==undefined?rarity(instOrDef):null; const color=r?.color||'#9ba7ad'; const kind=d?itemFamily(d):'empty'; return `<div class="iconbox ${size}">${svgIcon(kind,color)}</div>`}
function slotChip(slot,uid){const inst=instance(uid),o=statsOf(inst),empty=!o;const label=slotLabels[slot];const icon=empty?`<div class="iconbox slot slot-empty">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`:itemIcon(inst,'slot');return `<div class="slot-anchor ${empty?'empty':''}" data-slot="${slot}"><div class="label">${label}</div>${icon}<div class="mini" title="${empty?'Puste miejsce':escape(o.name)}">${empty?'Puste miejsce':escape(o.name)}</div></div>`}
function equippedDetail(slot){const uid=state.equip[slot],inst=instance(uid),o=statsOf(inst); return `<div class="eq-detail"><div>${o?itemIcon(inst):`<div class="iconbox">${svgIcon(slotPlaceholder(slot),'#64717a')}</div>`}</div><div class="grow"><div class="slotname">${slotLabels[slot]}</div>${o?`<strong style="color:${rarities.find(r=>r.name===o.rarity)?.color}">${escape(o.name)}</strong><div class="small muted">${statDetails(o)}</div>${affixDetails(o)}<div class="actions"><button data-unequip="${slot}">Zdejmij</button></div>`:`<div class="muted">Brak przedmiotu.</div>`}</div></div>`}
function itemSummary(inst,o,showSlot=true){return `<div class="itemline"><div>${itemIcon(inst)}</div><div class="grow"><strong style="color:${rarity(inst).color}">${escape(o.name)}</strong> <span class="small muted">${showSlot?slotName(o.slot)+' · ':''}${o.rarity}</span><div class="small muted">${statDetails(o)}</div>${affixDetails(o)}</div></div>`}

// Ekonomia v0.1.16: wartości testowe, łatwo zmienialne w jednym miejscu.
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
function salvageValue(inst){const d=def(inst);if(!d||d.slot==='material')return {};const mult=ECONOMY.yieldRarity[Math.min(4,Math.max(0,Number(inst.rarity)||0))];const raw=SALVAGE_BASE[materialFamily(d)]||SALVAGE_BASE.plastic;return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Math.max(1,Math.round(v*mult))]))}
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
function bulkEligibleVisible(filter){return state.inventory.filter(inst=>eligibleForBulk(inst)&&(filter==='all'||def(inst)?.slot===filter))}
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
 return {credits:Math.ceil(cfg.credits*mul),materials,cores:cfg.cores,level:lvl+1};
}
function upgradeCanAfford(recipe){return !!recipe&&state.credits>=recipe.credits&&state.cores>=recipe.cores&&Object.entries(recipe.materials).every(([key,amount])=>getStock(key)>=amount)}
function workshop(){
 const available=state.inventory.filter(x=>statsOf(x)&&def(x)?.slot!=='material').sort((a,b)=>(b.upgrade||0)-(a.upgrade||0));
 if(!instance(workshopUid)&&available.length)workshopUid=available[0].uid;
 const current=instance(workshopUid),cur=statsOf(current),cost=current?upgradeRecipe(current):null;
 const next=current&&cost?statsOf({...current,upgrade:cost.level}):null;
 const costRow=(name,need,owned)=>`<div class="work-cost ${owned>=need?'work-ok':'work-short'}"><span>${escape(name)}</span><strong>${owned.toLocaleString('pl-PL')} / ${need.toLocaleString('pl-PL')}</strong></div>`;
 const requirements=cost?costRow('Kredyty',cost.credits,state.credits)+Object.entries(cost.materials).map(([key,value])=>costRow(materialLabels[key],value,getStock(key))).join('')+(cost.cores?costRow('Rdzenie technologiczne',cost.cores,state.cores):''):'';
 return section('Warsztat Wędrowca',`${wallet()}<div class="panel section"><div class="tag">ULEPSZENIA BEZ RYZYKA</div><h2 style="margin:8px 0">Warsztat · poziom 1</h2><p class="muted">Każda próba kończy się sukcesem. Możesz ulepszyć dowolny przedmiot wyposażenia do +5, ale kolejne poziomy wymagają większej liczby materiałów i kredytów. Poziomy +3 do +5 zużywają również rdzenie technologiczne. Premie do obrażeń (zarówno minimum, jak i maksimum) lub pancerza wynoszą kolejno +1, +3, +5, +10 i +20; balans sprawdzimy później.</p><p class="small muted">Rdzenie technologiczne (8% szans) i schematy przedwojenne (3%) można znaleźć podczas dalekich wypraw. Schematy są na razie kolekcjonowane — nie są jeszcze zużywane w warsztacie. Pakiet testowy nadal jest dostępny.</p>${state.workshopTestGranted?'<p class="good small">✓ Pakiet testowy został odebrany.</p>':'<button data-action="workshop-test" class="primary">Odbierz jednorazowy pakiet testowy</button>'}</div>
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
function inventory(){
 const selected=instance(selectedUid),sel=selected&&statsOf(selected);
 const filters=[['all','Wszystko'],['hand1','Broń 1-ręczna'],['hand2','Broń 2-ręczna'],['shirt','Koszulki'],['pants','Spodnie'],['boots','Buty'],['outer','Kurtki / pancerze'],['head','Nakrycia głowy'],['hands','Rękawice / karwasze'],['extra','Akcesoria']];
 const visible=state.inventory.map(inst=>({inst,o:statsOf(inst)})).filter(x=>x.o&&(invFilter==='all'||x.o.slot===invFilter));
 for(const uid of [...bulkSelected])if(!eligibleForBulk(instance(uid)))bulkSelected.delete(uid);
 const selectedForBulk=bulkSelectedItems();const bulkSum=bulkTotals(selectedForBulk);
 const eligibleShown=bulkEligibleVisible(invFilter);
 const allShown=eligibleShown.length>0&&eligibleShown.every(x=>bulkSelected.has(x.uid));
 const bulkUi=`<div class="bulk-panel"><div class="bulk-head"><h3>Zarządzanie wieloma przedmiotami</h3><span class="tag">Zaznaczono: ${selectedForBulk.length} / dostępnych ${state.inventory.filter(eligibleForBulk).length}</span></div>
 <div class="actions"><button data-action="bulk-visible">${allShown?'Odznacz widoczne':'Zaznacz widoczne'} (${eligibleShown.length})</button><button data-action="bulk-all">Zaznacz wszystkie dostępne</button><button data-action="bulk-clear">Odznacz wszystkie</button></div>
 <div class="bulk-summary">Wartość zaznaczonych: <strong>${bulkSum.credits.toLocaleString('pl-PL')} kredytów</strong><br>Materiały z rozłożenia: <strong>${selectedForBulk.length?salvageLabel(bulkSum.mats):'—'}</strong></div>
 <div class="actions"><button class="primary" data-action="bulk-sell" ${selectedForBulk.length?'':'disabled'}>Sprzedaj zaznaczone (${selectedForBulk.length})</button><button data-action="bulk-salvage" ${selectedForBulk.length?'':'disabled'}>Rozłóż zaznaczone (${selectedForBulk.length})</button></div>
 <div class="bulk-hint">Założone i zabezpieczone przedmioty nie mogą zostać zaznaczone. Potwierdzenie pokaże łączną nagrodę. Zaznaczenie nie jest zapisywane między uruchomieniami gry.</div></div>`;
 return section('Ekwipunek',`${wallet()}<p class="muted">Masz ${state.inventory.length} przedmiotów. W tej wersji testowej zobaczysz już graficzny ekran ekwipunku: sylwetkę postaci, sloty wyposażenia i podstawowe ikony dla obecnych przedmiotów. Dominująca ręka: <strong>${state.dominantHand==='left'?'lewa':'prawa'}</strong>.</p>
 <div class="equip-stage section">
   <div class="paperdoll-wrap"><div class="paperdoll-title"><div><h3 style="color:var(--gold);margin:0">Wyposażenie postaci</h3><div class="small muted">Sloty wokół sylwetki pokazują, czy wszystko jest założone.</div></div><div class="small muted">Poziom ${state.level}</div></div>
     <div class="paperdoll">
       <div class="paperdoll-col paperdoll-left">${['head','shirt','right','hands','pants'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
       <div class="figure-stage"><div class="figure-halo"></div><div class="silhouette"><div class="head"></div><div class="neck"></div><div class="torso"></div><div class="shirt"></div><div class="pelvis"></div><div class="arm left"></div><div class="arm right"></div><div class="forearm left"></div><div class="forearm right"></div><div class="leg left"></div><div class="leg right"></div><div class="boot left"></div><div class="boot right"></div></div><div class="figure-caption">${escape(state.name)} · ${state.origin==='scout'?'Zwiadowca':state.origin==='fighter'?'Najemnik':'Mechanik'}</div></div>
       <div class="paperdoll-col paperdoll-right">${['extra','outer','left','boots'].map(slot=>slotChip(slot,state.equip[slot])).join('')}</div>
     </div>
   </div>
   <div>
     <div class="panel section"><h3 style="color:var(--gold);margin-top:0">Założone przedmioty</h3><div class="equip-meta">${Object.keys(slotLabels).map(equippedDetail).join('')}</div></div>
     ${sel?`<div class="panel"><h3 style="color:var(--gold);margin-top:0">Porównanie wybranego przedmiotu</h3>${itemSummary(selected,sel,false)}${compareMetrics(sel,(()=>{let targetSlot=sel.slot==='hand1'?(state.dominantHand==='left'?statsOf(instance(state.equip.left)):statsOf(instance(state.equip.right))):sel.slot==='hand2'?(statsOf(instance(state.equip.right))||statsOf(instance(state.equip.left))):statsOf(instance(state.equip[sel.slot]))})())}<div class="actions" style="margin-top:8px"><button data-action="close-inspect">Zamknij porównanie</button></div></div>`:''}
   </div>
 </div>
 <div class="actions section">${filters.map(([id,n])=>`<button data-filter="${id}" class="${invFilter===id?'primary':''}">${n}</button>`).join('')}</div>
 ${bulkUi}
 <div class="stack">${visible.map(({inst,o})=>{let worn=Object.values(state.equip).includes(inst.uid);let weapon=o.slot==='hand1';let buttons=o.slot==='material'?'':worn?'<span class="tag">Założony</span>':weapon?`<button class="primary" data-equip="${inst.uid}" data-hand="right">Prawa ręka</button><button data-equip="${inst.uid}" data-hand="left">Lewa ręka</button>`:`<button class="primary" data-equip="${inst.uid}">Załóż</button>`;return `<div class="item ${bulkSelected.has(inst.uid)?'bulk-picked':''}"><div class="row wrap"><label class="bulk-select" title="Zaznacz do operacji zbiorczej"><input type="checkbox" data-bulk-uid="${inst.uid}" ${bulkSelected.has(inst.uid)?'checked':''} ${eligibleForBulk(inst)?'':'disabled'}></label><div class="grow">${itemSummary(inst,o)}</div><div class="actions"><button data-inspect="${inst.uid}">Porównaj</button><button data-workshop-select="${inst.uid}" data-page="workshop" title="Ulepsz w warsztacie">🔧 Warsztat</button>${buttons}<button data-lock="${inst.uid}" class="${inst.locked?'islocked':''}" title="${inst.locked?'Odblokuj':'Zabezpiecz'} przedmiot">${inst.locked?'🔒 Odblokuj':'🔓 Zabezpiecz'}</button>${o.slot==='material'?'':`<button data-sale="${inst.uid}" ${worn||inst.locked?'disabled':''}>Sprzedaj · ${saleValue(inst)} kr.</button><button data-salvage="${inst.uid}" ${worn||inst.locked?'disabled':''}>Rozłóż</button>`}</div></div>${o.slot==='material'?'':`<div class="item-recovery small muted">Odzysk: ${salvageLabel(salvageValue(inst))}${worn?' · Najpierw zdejmij przedmiot.':''}${inst.locked?' · Zabezpieczony kłódką.':''}</div>`}</div>`}).join('')||'<div class="panel muted">Brak przedmiotów w wybranej kategorii.</div>'}</div>`)}

function specialLoot(r){const p=r?.special||{};return (p.cores||p.schematics)?`<div class="notice" style="margin-top:10px"><strong>Rzadkie znaleziska:</strong> ${[p.cores?`⚙ Rdzeń technologiczny × ${p.cores}`:'',p.schematics?`📜 Schemat przedwojenny × ${p.schematics}`:''].filter(Boolean).join(' · ')}</div>`:''}
function foundLootPreview(r){return `<div class="panel section"><h3 style="color:var(--gold)">Ostatnia ukończona wyprawa: ${escape(r.location)}</h3><p class="small muted">${escape(r.at)}</p><p>Znalazłeś:</p>${(r.drops||[]).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${itemIcon(x,'sm')}<div><span style="color:${rarities.find(q=>q.name===x.rarity)?.color||'#ddd'}">${escape(x.name)}</span><div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||'Brak zapisanych parametrów')} · ${escape(x.slot?slotName(x.slot):'')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'<p class="muted">Sprawdź starszy raport w zakładce Raporty.</p>'}${specialLoot(r)}<button data-page="inventory">Przejdź do ekwipunku</button></div>`}
function reports(){return section('Raporty walk',state.reports.length?`<div class="stack">${state.reports.map((r,i)=>`<div class="panel"><div class="row wrap"><strong class="${r.won?'good':'bad'}">${r.won?'ZWYCIĘSTWO':'PORAŻKA'} · ${escape(r.location)}</strong><span class="small muted">${escape(r.at)}</span></div><p>Przeciwnik: ${escape(r.enemy)}</p><p class="tag">+${r.xp} XP · +${r.scrap} złomu ${r.levels?'· Awans: +'+r.levels+' poziom':''}</p>${specialLoot(r)}<div class="small"><strong>Znalazłeś (${r.drops?.length||Number(!!r.drop)}):</strong><div class="loot-list">${(r.drops|| (r.drop?[{name:r.drop,rarity:r.dropRarity}]:[])).map(x=>`<details class="loot-detail"><summary><div class="loot-row">${itemIcon(x,'sm')}<div><span style="color:${rarities.find(q=>q.name===x.rarity)?.color||'#ddd'}">${escape(x.name)}</span><div class="small muted">Kliknij, aby rozwinąć opis</div></div></div></summary><div class="small muted">${escape(x.details||((x.uid&&instance(x.uid))?statDetails(statsOf(instance(x.uid))):'Szczegóły nie były zapisywane w tej wersji raportu.'))}<br>Rzadkość: ${escape(x.rarity||'Nieznana')} · ${escape(x.slot?slotName(x.slot):'Przedmiot ze starszego raportu')}${(x.effects||[]).map(e=>`<div>↳ ${escape(e.name)}: ${escape(e.description)}</div>`).join('')}</div></details>`).join('')||'Brak'}</div></div><details ${i===0?'open':''}><summary>Przebieg walki</summary>${r.lines.map(line=>`<div class="report small">${escape(line)}</div>`).join('')}</details></div>`).join('')}</div>`:'<div class="panel muted">Brak raportów. Wykonaj pierwszą wyprawę.</div>')}

const HIDEOUT_OPTIONS={
 left:[['none','Puste'],['bed','Łóżko polowe'],['chair','Fotel'],['crate','Skrzynie']],
 center:[['none','Puste'],['table','Stół'],['workbench','Stół warsztatowy'],['rug','Dywan']],
 right:[['none','Puste'],['shelf','Regał'],['locker','Szafa metalowa'],['radio','Radiostacja']],
 wall:[['none','Pusta ściana'],['poster','Plakat'],['map','Mapa Pustkowi'],['trophy','Trofeum']],
 light:[['candle','Świeca'],['bulb','Żarówka'],['neon','Lampa LED']]
};
function hideoutDefault(){return {left:'bed',center:'none',right:'crate',wall:'none',light:'candle'}}
function hideoutState(){let defaults=hideoutDefault();if(!state.hideout||typeof state.hideout!=='object')state.hideout={...defaults};for(let k of Object.keys(defaults))if(!HIDEOUT_OPTIONS[k].some(x=>x[0]===state.hideout[k]))state.hideout[k]=defaults[k];return state.hideout}
function hideoutSvgThing(slot,id){if(id==='none')return '';
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
function hideoutScene(h){const lightColors={candle:'#f1a557',bulb:'#f5d49c',neon:'#81d4d6'};const illum=lightColors[h.light]||lightColors.candle;
 return `<svg viewBox="0 0 960 540" role="img" aria-label="Widok Schronu 17 z ustawionymi meblami i oświetleniem" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ashenwall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#1d282c"/><stop offset="1" stop-color="#3a3b35"/></linearGradient><linearGradient id="ashenfloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4b473b"/><stop offset="1" stop-color="#1a2429"/></linearGradient><radialGradient id="ashenlight"><stop stop-color="${illum}" stop-opacity="${h.light==='candle'?.31:.45}"/><stop offset="1" stop-color="${illum}" stop-opacity="0"/></radialGradient><pattern id="ashenbrick" width="100" height="46" patternUnits="userSpaceOnUse"><path d="M0 0H100 M0 46H100 M50 0V23 M0 23H100 M0 23V46" stroke="#778083" stroke-width="1.6" opacity=".16"/></pattern></defs>
 <rect width="960" height="540" fill="#0c1013"/><path d="M50 38H910L875 374H85Z" fill="url(#ashenwall)" stroke="#69706d" stroke-width="7"/><path d="M85 374H875L955 530H5Z" fill="url(#ashenfloor)" stroke="#746a56" stroke-width="7"/><path d="M50 38H910L875 374H85Z" fill="url(#ashenbrick)"/><path d="M85 374L5 530 M875 374L955 530 M350 375L260 530 M610 375L700 530 M85 426H875 M37 480H923" stroke="#a29c89" stroke-width="2.5" opacity=".17"/>
 <path d="M100 82H262V330H100Z" fill="#1b2528" stroke="#78817d" stroke-width="8"/><path d="M115 100H248V315H115Z" fill="#26333a" stroke="#667175" stroke-width="3"/><path d="M115 186H248" stroke="#737e7d" stroke-width="6"/><path d="M183 100V315" stroke="#737e7d" stroke-width="5"/><path d="M119 106H246V313H119Z" fill="#0e1b23" opacity=".5"/><circle cx="184" cy="148" r="25" fill="#bbaf84" opacity=".25"/>
 <path d="M720 97H848V338H720Z" fill="#242d30" stroke="#7d837b" stroke-width="7"/><path d="M750 111H818V309H750Z" fill="#394340" stroke="#6f776f" stroke-width="3"/><circle cx="802" cy="216" r="5" fill="#dfba7a"/>
 <path d="M50 38H910" stroke="#92968a" stroke-width="12" opacity=".3"/><path d="M475 34V83" stroke="#828c88" stroke-width="5"/><ellipse cx="480" cy="184" rx="390" ry="270" fill="url(#ashenlight)"/><path d="M450 85H510L524 121H436Z" fill="#49545a" stroke="#a5aaa0" stroke-width="4"/><ellipse cx="480" cy="123" rx="35" ry="13" fill="${illum}" opacity=".95"/>
 ${hideoutSvgThing('wall',h.wall)}${hideoutSvgThing('left',h.left)}${hideoutSvgThing('center',h.center)}${hideoutSvgThing('right',h.right)}
 ${h.light==='candle'?`<g transform="translate(572 331)"><path d="M-14 0H14V46H-14Z" fill="#b9a681"/><path d="M0 -20 Q20 -3 0 4 Q-17 -4 0 -20" fill="#ffd387"/></g>`:''}
 ${h.light==='neon'?`<path d="M306 55H651" stroke="#91e3dc" stroke-width="12" opacity=".65"/><path d="M306 55H651" stroke="#e4fffd" stroke-width="4"/>`:''}
 <rect x="13" y="13" width="162" height="27" rx="6" fill="#0c1519" opacity=".8"/><text x="26" y="31" fill="#d5bc8a" font-size="14" letter-spacing="2">SCHRON 17</text><rect x="760" y="13" width="190" height="27" rx="6" fill="#0c1519" opacity=".8"/><text x="775" y="31" fill="#b0c8c6" font-size="13">2197 · SEKTOR PÓŁNOC</text>
 </svg>`}
function hideoutChoice(key,current){return `<div class="hideout-group"><h3>${({left:'Lewa strona pomieszczenia',center:'Środek pomieszczenia',right:'Prawa strona pomieszczenia',wall:'Dekoracja ścienna',light:'Oświetlenie'})[key]}</h3><div class="hideout-choice">${HIDEOUT_OPTIONS[key].map(([id,title])=>`<button type="button" data-hideout-slot="${key}" data-hideout-item="${id}" class="${id===current?'selected':''}" aria-pressed="${id===current}">${escape(title)}</button>`).join('')}</div></div>`}
function setHideoutItem(slot,id){if(!HIDEOUT_OPTIONS[slot]?.some(x=>x[0]===id))return;hideoutState()[slot]=id;message='Zmieniono wyposażenie Schronu 17. Zapisano ustawienie.';save();render()}

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
function bunkerRoomsOverview(h){return `<div class="bunker-overview"><div class="hideout-title"><div><div class="tag">PRZEKRÓJ BAZY · POZIOM -1</div><h3>Schron 17</h3></div><span class="hideout-pill">3 czynne pomieszczenia</span></div><div class="bunker-cutaway">${Object.entries(BUNKER_ROOMS).map(([id,r])=>`<button type="button" class="bunker-module ${activeBunkerRoom===id?'is-selected':''}" data-bunker-room="${id}" aria-pressed="${activeBunkerRoom===id}">${bunkerRoomSvg(id,h,true)}<strong>${r.name}</strong><span class="bunker-state">Poziom 1 · ${id==='bedroom'?'Pokój Wędrowca':id==='storage'?'Zasoby':'Ulepszenia'}</span></button>`).join('')}</div><div class="bunker-floor"></div><div class="bunker-future"><span>Przyszły moduł</span><span>Przyszły moduł</span><span>Przyszły moduł</span></div><p class="hideout-story">Dotknij lub kliknij pomieszczenie, aby obejrzeć je z bliska. Pola na kolejnym poziomie pokazują kierunek przyszłej rozbudowy.</p></div>`}
function bunker(){const h=hideoutState(),r=BUNKER_ROOMS[activeBunkerRoom]||BUNKER_ROOMS.bedroom;return section('Kryjówka',`<div class="hideout-screen"><div class="hideout-title"><div><div class="tag">SEKTOR 17 · SCHRON MODUŁOWY</div><h3>Twoja baza</h3></div><div class="hideout-legend"><span class="hideout-pill">Pomieszczenia mają własne funkcje</span><span class="hideout-pill">Dekoracje są tylko wizualne</span></div></div>${bunkerRoomsOverview(h)}<div class="bunker-focused"><div class="bunker-focused-head"><div><span class="tag">WYBRANE POMIESZCZENIE</span><h3>${r.name}</h3></div><span class="hideout-pill">Poziom pomieszczenia: 1</span></div>${bunkerRoomSvg(activeBunkerRoom,h)}<p class="bunker-room-description">${r.desc}</p><div class="bunker-meta"><span>Obecnie: ${r.unlock}</span><span>${r.future}</span></div>${activeBunkerRoom==='bedroom'?`<div class="hideout-controls">${Object.keys(HIDEOUT_OPTIONS).map(key=>hideoutChoice(key,h[key])).join('')}</div><div class="hideout-hint">Zmiana mebli, plakatu i oświetlenia wpływa jedynie na wygląd sypialni — nie daje bonusów do walki ani statystyk.</div>`:activeBunkerRoom==='storage'?`<div class="bunker-links"><button class="primary" data-page="storage">Otwórz magazyn surowców</button></div>`:`<div class="bunker-links"><button class="primary" data-page="workshop">Przejdź do ulepszania ekwipunku</button></div>`}</div><div class="hideout-hint">Plan rozwoju: poziomy pomieszczeń będą odblokowywać bonusy, zadania lub funkcje. Samo ustawianie dekoracji pozostanie wyłącznie wizualne. Rozbudowa, kupowanie mebli i nowe pokoje pojawią się w kolejnych wersjach.</div><div class="actions" style="margin-top:14px">${activeBunkerRoom==='bedroom'?'<button data-action="hideout-reset">Przywróć wystrój sypialni</button>':''}<button data-page="workshop">Warsztat</button><button data-page="storage">Magazyn</button></div></div><div class="panel section" style="margin-top:14px"><h3 style="color:var(--gold)">Zapis i bezpieczeństwo</h3><p class="small muted">Przed zmianą wersji gry możesz zachować kopię postępów w pliku JSON.</p><button data-action="export">Eksportuj zapis JSON</button> <button data-action="reset">Nowa gra / reset</button></div>`) }

const origins={scout:{title:'Zwiadowca',desc:'Szybki i spostrzegawczy. +2 Zręczności, +1 Percepcji.',bonus:{dex:2,per:1}},fighter:{title:'Najemnik',desc:'Wytrzymały wojownik. +2 Siły, +1 Wytrzymałości.',bonus:{str:2,end:1}},tech:{title:'Mechanik',desc:'Specjalista od technologii. +2 Inteligencji, +1 Percepcji.',bonus:{int:2,per:1}}};
function creation(){return `<div class="hero"><div class="sub">SCHRON 17 · POCZĄTEK HISTORII</div><h1>Stwórz Wędrowca</h1><p class="muted">Wybierz pochodzenie postaci. To bonus początkowy, a nie zamknięta klasa — później rozwijasz dowolne atrybuty.</p></div><div class="panel"><label for="hero-name">Imię Wędrowca</label><input class="input" id="hero-name" maxlength="24" value="${escape(state.name)}" placeholder="Wpisz imię" style="margin:9px 0 18px"><h3 style="color:var(--gold)">Pochodzenie</h3><div class="grid">${Object.entries(origins).map(([id,o])=>`<label class="tile" style="cursor:pointer;border-color:${state.origin===id?'var(--gold)':'var(--line)'}"><input type="radio" name="origin" value="${id}" ${state.origin===id?'checked':''}><h3>${o.title}</h3><p class="small muted">${o.desc}</p></label>`).join('')}</div><h3 style="color:var(--gold)">Ręka dominująca</h3><p class="small muted">Wybór nie zmienia siły postaci. Dominująca ręka atakuje z mocą 100%, druga z mocą 80%. Możesz wybrać swoją naturalną stronę.</p><div class="actions"><label class="tile"><input type="radio" name="dominantHand" value="right" ${state.dominantHand==='right'?'checked':''}> Prawa</label><label class="tile"><input type="radio" name="dominantHand" value="left" ${state.dominantHand==='left'?'checked':''}> Lewa</label></div><p class="small muted">Po rozpoczęciu otrzymasz 5 dodatkowych punktów do rozdania i podstawowy ekwipunek.</p><button class="primary" data-action="create" style="margin-top:10px">Rozpocznij przygodę →</button></div>`}
function render(){sync();let views={home,character,missions,inventory,workshop,storage,reports,bunker};$('app').innerHTML=`<div class="shell"><header class="header"><div><div class="brand">ASHEN</div><div class="sub">KRONIKI UPADKU · v0.1.16</div></div><div class="small muted">PROTOTYP OFFLINE<br>Postęp zapisuje się w przeglądarce</div></header><div class="layout"><aside class="sidebar"><strong>${escape(state.name)}</strong><p class="muted">Poziom ${state.level} · Ocalały</p><p class="small good">Energia: ∞ (testy)</p><p class="small muted">🪙 ${state.credits.toLocaleString('pl-PL')} kredytów · ⚙ ${state.scrap} złomu</p><nav class="nav">${state.created?nav():''}</nav></aside><main class="main">${message?`<div class="notice" style="margin-bottom:12px">${escape(message)}</div>`:''}${state.created?views[page]():creation()}<div class="footer">ASHEN v0.1.16 · Wersja testowa · Brak połączenia z serwerem · Zapis lokalny</div></main></div></div>`;let c=$('countdown');if(c)c.textContent=Math.max(0,Math.ceil((state.mission?.ends-Date.now())/1000))+' s'}
function act(e){let b=e.target.closest('button');if(!b)return;if(b.dataset.bunkerRoom&&BUNKER_ROOMS[b.dataset.bunkerRoom]){activeBunkerRoom=b.dataset.bunkerRoom;message='';render();return;}if(b.dataset.hideoutSlot){setHideoutItem(b.dataset.hideoutSlot,b.dataset.hideoutItem);return}if(b.dataset.action==='hideout-reset'){if(confirm('Przywrócić początkowe wyposażenie i oświetlenie kryjówki?')){state.hideout=hideoutDefault();message='Przywrócono podstawowy wygląd schronu.';save();render()}return}if(b.dataset.page){if(!state.created)return;page=b.dataset.page;if(b.dataset.workshopSelect)workshopUid=b.dataset.workshopSelect;message='';render();return}if(b.dataset.action==='create'){let n=$('hero-name')?.value.trim();if(!n||n.length<2||n.length>24){message='Podaj imię od 2 do 24 znaków.';render();return}state.name=n;state.created=true;let bonus=origins[state.origin]?.bonus||{};for(const [k,v] of Object.entries(bonus))state.attrs[k]+=v;message='Witaj na Pustkowiach, '+n+'!';page='home';save();render();return}if(b.dataset.workshopSelect){workshopUid=b.dataset.workshopSelect;render();return}if(b.dataset.workshopUpgrade){applyUpgrade(b.dataset.workshopUpgrade);return}if(b.dataset.action==='workshop-test'){grantWorkshopTest();return}if(b.dataset.dominant){if(['left','right'].includes(b.dataset.dominant)){state.dominantHand=b.dataset.dominant;message='Zmieniono rękę dominującą.';save();render()}return}if(b.dataset.attr){if(state.points>0){state.attrs[b.dataset.attr]++;state.points--;save();render()}return}if(b.dataset.mission){let l=locations.find(x=>x.id===b.dataset.mission);if(!l||state.mission)return;/* Testy: energia nie jest zużywana */state.mission={id:l.id,ends:Date.now()};finish();render();return}if(b.dataset.lock){const inst=instance(b.dataset.lock);if(inst){inst.locked=!inst.locked;message=inst.locked?'Przedmiot zabezpieczony.':'Zdjęto zabezpieczenie.';save();render()}return}
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
 let slot=(obj.slot==='hand1')?(b.dataset.hand==='left'?'left':'right'):obj.slot==='hand2'?'right':obj.slot;
 for(let key of Object.keys(state.equip))if(state.equip[key]===inst.uid)state.equip[key]=null;
 if(obj.slot==='hand2'){state.equip.right=inst.uid;state.equip.left=null}
 else if(obj.slot==='hand1'){
  if(state.equip.right&&def(instance(state.equip.right))?.slot==='hand2')state.equip.right=null;
  state.equip[slot]=inst.uid;
 }else state.equip[slot]=inst.uid;
 message='Założono: '+statsOf(inst).name;save();render();return
}if(b.dataset.action==='rename'){let name=prompt('Imię postaci (2–24 znaki):',state.name);if(name!==null&&name.trim().length>=2&&name.trim().length<=24){state.name=name.trim();save();render()}return}if(b.dataset.action==='heal'){if(state.scrap>=20&&state.hp<maxHp()){state.scrap-=20;message='Zdrowie przywrócone.';save();render()}return}if(b.dataset.action==='reset'){if(confirm('Usunąć cały lokalny postęp i rozpocząć nową grę?')){state=fresh();page='home';selectedUid=null;workshopUid=null;invFilter='all';bulkSelected.clear();message='Rozpoczęto nową grę.';save();render()}return}if(b.dataset.action==='export'){let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ashen-zapis.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}
document.addEventListener('change',e=>{if(e.target.dataset.bulkUid){const uid=e.target.dataset.bulkUid;const inst=instance(uid);if(e.target.checked&&eligibleForBulk(inst))bulkSelected.add(uid);else bulkSelected.delete(uid);render();return}if(e.target.name==='dominantHand'){state.dominantHand=e.target.value;return}if(e.target.name==='origin'&&origins[e.target.value]){let n=$('hero-name')?.value;state.origin=e.target.value;render();if(n)$('hero-name').value=n}});document.addEventListener('click',act);render();setInterval(()=>{let prev=state.mission?.id;sync();if(prev&&!state.mission)render();else{let c=$('countdown');if(c)c.textContent=Math.max(0,Math.ceil((state.mission?.ends-Date.now())/1000))+' s'}},1000);
})();