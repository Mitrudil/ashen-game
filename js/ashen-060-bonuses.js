/* ASHEN 0.6.0 — izolowany moduł premiowania (ESM + CommonJS), bez zmian silnika PvP.
 * Dane wejściowe: katalog etapu 6 i migawka wyposażenia. Funkcje nie mutują argumentów.
 * Etap 20: opcjonalny automatyczny podgląd progów X/Y i jakości; tryb diagnostyczny.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports)module.exports=api;
  else root.Ashen060Bonuses=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const QUALITY=['zwykly','rzadki','epicki','legendarny','mityczny'];
const LABELS=['Zwykły','Rzadki','Epicki','Legendarny','Mityczny'];
const SOCKET_WEIGHTS=[[75,25,0,0],[45,40,15,0],[25,40,25,10],[15,30,40,15],[10,25,45,20]];
const SLOT_CATEGORY={weapon_main:'broń',weapon_off:'broń',jacket:'kurtka',shirt:'koszulka',pants:'spodnie',boots:'buty',head:'nakrycie głowy',gloves:'rękawice',accessory1:'akcesorium',accessory2:'akcesorium',accessory3:'akcesorium'};
const STAT_KEYS={
 'pancerz':['armor','flat'],'PŻ':['hp','flat'],'przebicie':['penetration','flat'],
 'celność':['accuracy','flat'],'krytyk pp':['critChance','percentage_points'],
 'unik pkt':['dodge','flat'],'obrażenia %':['damage','percent'],
 'szybkość':['extraAttacks','extra_attacks'],'wytrzymałość':['endurance','flat'],
 'surowce %':['expeditionResources','percent'],'PD wypraw %':['expeditionXp','percent'],
 max_hp_pct:['hp','percent'],armor_pct:['armor','percent'],damage_reduction_pct:['damageReduction','percent'],
 dodge_points:['dodge','flat'],accuracy_points:['accuracy','flat'],initiative_points:['initiative','flat'],
 extra_attacks:['extraAttacks','extra_attacks'],crit_points:['critChance','percentage_points'],
 penetration_points:['penetration','flat'],shield_capacity_pct:['shieldCapacity','percent'],
 critical_bonus_reduction_pct:['criticalBonusReduction','percent'],hit_after_dodge_dmg_pct:['hitAfterDodgeDamage','conditional'],
 expedition_resources_pct:['expeditionResources','percent'],strength:['strength','flat'],
 endurance:['endurance','flat'],agility:['agility','flat'],perception:['perception','flat'],
 intelligence:['intelligence','flat'],charisma:['charisma','flat']
};
function requireCondition(ok,msg){if(!ok)throw Error(msg)}
function normalizeQuality(q){const aliases={'zwykły':'zwykly','mityczny':'mityczny'};const v=String(q||'').toLowerCase();const n=aliases[v]||v;requireCondition(QUALITY.includes(n),'Nieznana jakość: '+q);return n}
function rollSockets(quality,rng=Math.random){const w=SOCKET_WEIGHTS[QUALITY.indexOf(normalizeQuality(quality))];const f=Number(rng());requireCondition(Number.isFinite(f)&&f>=0&&f<1,'Losowanie musi być w [0,1)');let c=0;for(let i=0;i<w.length;i++){c+=w[i]/100;if(f<c)return i}return 3}
function createLootItem(base,quality,rng=Math.random){requireCondition(base&&typeof base==='object'&&!('sockets' in base)&&!('socketCapacity' in base),'Gniazda można ustalić tylko podczas nowego dropu');const q=normalizeQuality(quality);return {...base,quality:q,socketCapacity:rollSockets(q,rng),socketedArtifacts:[]}}
function validateItem(item,catalog){requireCondition(item&&typeof item==='object','Brak przedmiotu');const cap=item.socketCapacity;requireCondition(Number.isInteger(cap)&&cap>=0&&cap<=3,'Nieprawidłowa liczba gniazd');const equipped=item.socketedArtifacts||[];requireCondition(Array.isArray(equipped)&&equipped.length<=cap,'Za dużo osadzonych artefaktów');
const families=new Set(), names=new Set();for(const name of equipped){const effects=catalog.artifact_effects.filter(e=>e.artifact===name);requireCondition(effects.length>0,'Nieznany artefakt: '+name);const fam=effects[0].family;requireCondition(!families.has(fam),'Dwa artefakty tej samej rodziny w jednym przedmiocie');requireCondition(!names.has(name),'Artefakt zdublowany w jednym przedmiocie');families.add(fam);names.add(name)}return true}
function mod(source,key,value,meta={}){const d=STAT_KEYS[key];requireCondition(d,'Nieobsługiwany klucz premii: '+key);const num=Number(value);requireCondition(Number.isFinite(num),'Nieprawidłowa wartość premii: '+value);return {source,stat_key:d[0],operation:d[1],value:num,activation_condition:'',source_item_id:null,slot_id:null,order:0,...meta}}
function findSet(catalog,family,kind){return catalog.sets.find(s=>s.name===family&&s.kind===kind)}
// Projekt zasad 0.6 — tylko w wyraźnym trybie diagnostycznym `setPolicy: auto-v20`.
// Odzież: X przy 3+, Y przy 5+, akcesoria: X/Y tylko przy 3/3.
// Nie mnożymy dyskretnych dodatkowych ataków, bo ich zasada walki jest jeszcze nieustalona.
function setCandidate(item,slot,kind){
 const cat=SLOT_CATEGORY[slot];return kind==='Akcesoria'?cat==='akcesorium':cat!==undefined&&cat!=='broń'&&cat!=='akcesorium';
}
function qualityIndex(item){
 requireCondition(item&&item.qualitySchema==='ashen-v06','Automatyczny zestaw wymaga nowego schematu jakości 0.6');
 const q=normalizeQuality(item.quality);const idx=QUALITY.indexOf(q);
 requireCondition(item.rarity===idx,'Niespójna jakość / rarity w zestawie');return idx;
}
function scaleSetEffect(effect,qualitySum,count){
 const n=Number(effect.value);requireCondition(Number.isFinite(n),'Nieprawidłowy efekt zestawu');
 const discrete=STAT_KEYS[effect.key]?.[1]==='extra_attacks';
 // 0..4 jakości na element. 3 elementy zwykłe = 100%, wszystkie mityczne = 200%.
 // Czwarty i następne elementy odzieży dodają po 15% siły (nie do pełnych ataków).
 const qualityPercent=Math.round(100+25*qualitySum/count);
 const piecePercent=100+Math.max(0,count-3)*15;
 const scaled=discrete?n:Math.round(n*qualityPercent*piecePercent/10000);
 return {value:scaled,qualityPercent,piecePercent,discrete};
}
function autoSetBonuses(items,catalog){
 const mods=[],signals=[],details=[];
 for(const def of catalog.sets){
  requireCondition(['Akcesoria','Odzież'].includes(def.kind),'Nieznany rodzaj zestawu');
  const matches=Object.entries(items).filter(([slot,item])=>item&&item.setFamily===def.name&&setCandidate(item,slot,def.kind));
  const count=matches.length; if(!count)continue;
  requireCondition(count<=(def.kind==='Akcesoria'?3:6),'Za dużo części zestawu');
  const qualitySum=matches.reduce((sum,[,item])=>sum+qualityIndex(item),0);
  const activeX=count>=3,activeY=def.kind==='Akcesoria'?count===3:count>=5;
  const detail={family:def.name,kind:def.kind,count,requiredX:3,requiredY:def.kind==='Akcesoria'?3:5,qualityScore:qualitySum,qualityMax:count*4,averageQuality:count?Math.round(qualitySum*100/count)/100:0,activeX,activeY};
  if(activeX){const x=scaleSetEffect(def.x,qualitySum,count);mods.push(mod('set_x',def.x.key,x.value,{activation_condition:'auto-v20;quality-scaled;preview-only',order:50}));detail.x=x;}
  if(activeY){const y=scaleSetEffect(def.y,qualitySum,count);mods.push(mod('set_y',def.y.key,y.value,{activation_condition:'auto-v20;quality-scaled;preview-only',order:60}));detail.y=y;signals.push({type:'set_z',family:def.name,name:def.z_name_unchanged,requires_combat_event:true});}
  if(!activeX)signals.push({type:'set_incomplete',family:def.name,count,kind:def.kind});
  details.push(detail);
 }
 return {modifiers:mods,signals,details};
}
function compute(snapshot,catalog){requireCondition(snapshot&&catalog&&Array.isArray(catalog.artifact_effects)&&Array.isArray(catalog.sets),'Brak danych');
const items=snapshot.items||{};const mods=[],signals=[],counts={};let setDetails=[];
for(const [slot,item] of Object.entries(items)){
 if(item===null)continue;
 const cat=SLOT_CATEGORY[slot];requireCondition(cat,'Nieznany slot: '+slot);validateItem(item,catalog);
 for(const name of (item.socketedArtifacts||[])){
  const effect=catalog.artifact_effects.find(e=>e.artifact===name&&e.slot_category===cat);
  requireCondition(effect,'Brak efektu '+name+' dla '+cat);
  mods.push(mod('artifact',effect.key,effect.value,{source_item_id:item.id||null,slot_id:slot,activation_condition:effect.condition||'',order:40}));
  counts[effect.family]=(counts[effect.family]||0)+1;
 }
}
// Rezonsans aktywuje się raz po trzech artefaktach jednej rodziny, niezależnie od 4. i dalszych.
for(const [family,count] of Object.entries(counts))if(count>=3)signals.push({type:'resonance',family,count,active:true,bonuses_pending_balance:true});
if(snapshot.setPolicy==='auto-v20'){
 requireCondition(!snapshot.activeSets?.length,'Nie wolno mieszać automatycznych i ręcznych progów X/Y');
 const result=autoSetBonuses(items,catalog);mods.push(...result.modifiers);signals.push(...result.signals);setDetails=result.details;
}else{
 requireCondition(snapshot.setPolicy===undefined||snapshot.setPolicy==='manual-legacy-preview','Nieznana polityka progów zestawowych');
// X/Y są jawne: obliczanie progów pozostawiamy istniejącemu silnikowi aż do zatwierdzenia nowych progów.
for(const selected of (snapshot.activeSets||[])){
 const def=findSet(catalog,selected.family,selected.kind);requireCondition(def,'Nieznana rodzina zestawu: '+selected.family);
 const matches=Object.entries(items).filter(([slot,item])=>item&&item.setFamily===selected.family&&((selected.kind==='Akcesoria'&&SLOT_CATEGORY[slot]==='akcesorium')||(selected.kind==='Odzież'&&!['broń','akcesorium'].includes(SLOT_CATEGORY[slot]))));
 const count=matches.length;const complete=selected.kind==='Akcesoria'?count===3:count>=3;
 if(!complete){signals.push({type:'set_incomplete',family:selected.family,count,kind:selected.kind});continue}
 if(selected.x)mods.push(mod('set_x',def.x.key,def.x.value,{activation_condition:'complete',order:50}));
 if(selected.y)mods.push(mod('set_y',def.y.key,def.y.value,{activation_condition:'complete;threshold_confirmed_by_caller',order:60}));
 if(selected.z)signals.push({type:'set_z',family:selected.family,name:def.z_name_unchanged,requires_combat_event:true});
}
}
for(const custom of (snapshot.modifiers||[])){
 requireCondition(['prefix','suffix','upgrade','base'].includes(custom.source),'Źródło modyfikatora musi być jawne');
 mods.push(mod(custom.source,custom.key,custom.value,{source_item_id:custom.source_item_id||null,slot_id:custom.slot_id||null,order:custom.order||30}));
}
mods.sort((a,b)=>a.order-b.order);
const totals={};for(const m of mods){const k=m.stat_key+'|'+m.operation;totals[k]=(totals[k]||0)+m.value}
return {modifiers:mods,totals,signals,artifactCounts:counts,setDetails,policy:snapshot.setPolicy||'manual-legacy-preview'};
}
function weaponAttackCount(baseAttacks,result){requireCondition(Number.isInteger(baseAttacks)&&baseAttacks>=1,'Ataki bazowe muszą być stałą liczbą >= 1');return Math.max(1,baseAttacks+(result.totals['extraAttacks|extra_attacks']||0))}
return Object.freeze({QUALITY,LABELS,SOCKET_WEIGHTS,SLOT_CATEGORY,STAT_KEYS,normalizeQuality,rollSockets,createLootItem,validateItem,compute,weaponAttackCount,autoSetBonuses,scaleSetEffect});
});
