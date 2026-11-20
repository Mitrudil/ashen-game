/* ASHEN 0.6.0 — izolowany moduł premiowania (ESM + CommonJS), bez zmian silnika PvP.
 * Dane wejściowe: katalog etapu 6 i migawka wyposażenia. Funkcje nie mutują argumentów.
 * Progi X/Y i wartości rezonansów nie są jeszcze zatwierdzone; caller jawnie przekazuje aktywne poziomy.
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
function compute(snapshot,catalog){requireCondition(snapshot&&catalog&&Array.isArray(catalog.artifact_effects)&&Array.isArray(catalog.sets),'Brak danych');
const items=snapshot.items||{};const mods=[],signals=[],counts={};
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
for(const custom of (snapshot.modifiers||[])){
 requireCondition(['prefix','suffix','upgrade','base'].includes(custom.source),'Źródło modyfikatora musi być jawne');
 mods.push(mod(custom.source,custom.key,custom.value,{source_item_id:custom.source_item_id||null,slot_id:custom.slot_id||null,order:custom.order||30}));
}
mods.sort((a,b)=>a.order-b.order);
const totals={};for(const m of mods){const k=m.stat_key+'|'+m.operation;totals[k]=(totals[k]||0)+m.value}
return {modifiers:mods,totals,signals,artifactCounts:counts};
}
function weaponAttackCount(baseAttacks,result){requireCondition(Number.isInteger(baseAttacks)&&baseAttacks>=1,'Ataki bazowe muszą być stałą liczbą >= 1');return Math.max(1,baseAttacks+(result.totals['extraAttacks|extra_attacks']||0))}
return Object.freeze({QUALITY,LABELS,SOCKET_WEIGHTS,SLOT_CATEGORY,STAT_KEYS,normalizeQuality,rollSockets,createLootItem,validateItem,compute,weaponAttackCount});
});
