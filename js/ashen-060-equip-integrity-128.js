/* ASHEN Tester 0.6 — pakiet 128: walidacja wyposażenia na etapie wczytywania.
 * Nie usuwa przedmiotów z ekwipunku. Odłącza wyłącznie nowoczesne bazy
 * niespełniające wymagań bazowych postaci, również po imporcie profilu.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060EquipIntegrity128=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function validate(state,baseRules){
 if(!state||typeof state!=='object'||!baseRules||typeof baseRules.requirements!=='function'||typeof baseRules.isModernId!=='function')throw Error('Nieprawidłowe dane audytu ekwipunku 0.6');
 const original=state.equip||{},items=new Map((Array.isArray(state.inventory)?state.inventory:[]).filter(x=>x&&typeof x.uid==='string').map(x=>[x.uid,x]));
 const equip={...original},removed=[],seen=new Set();
 for(const [slot,uid] of Object.entries(equip)){
  if(!uid)continue;
  const inst=items.get(uid);
  if(!inst){equip[slot]=null;removed.push({slot,uid,reason:'Brak egzemplarza przedmiotu w zapisie'});continue}
  if(seen.has(uid)){equip[slot]=null;removed.push({slot,uid,reason:'Powtórzone przypisanie egzemplarza'});continue}
  seen.add(uid);
  if(!/^base-\d{2}-\d{2}$/.test(inst.id||''))continue; // Legacy: osobne narzędzie czyszczenia 119
  if(!baseRules.isModernId(inst.id)){equip[slot]=null;removed.push({slot,uid,reason:'Nieznana baza 0.6'});continue}
  if(inst.qualitySchema!=='ashen-v06'){equip[slot]=null;removed.push({slot,uid,reason:'Nieprawidłowy schemat jakości'});continue}
  const gate=baseRules.requirements(inst.id,state.level,state.attrs);
  if(!gate.ok){equip[slot]=null;removed.push({slot,uid,reason:gate.reason});}
 }
 return {equip,removed};
}
return Object.freeze({validate});
});
