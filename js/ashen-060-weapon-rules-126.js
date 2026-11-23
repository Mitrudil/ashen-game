/* ASHEN Tester 0.6 — pakiet 126: weapon category is the single source of combat style.
 * Legacy ID classification is retained only for legacy item records, not modern bases.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060WeaponRules126=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TYPES=Object.freeze({palna_1h:'firearm',palna_2h:'firearm',biala_1h:'melee1',biala_2h:'melee2',dystansowa:'nonfire'});
function style(w){
 if(!w||!w.modernBase122)return null;
 if(!/^base-\d{2}-\d{2}$/.test(w.id||'')||!Object.hasOwn(TYPES,w.modernCategory))throw Error('Nieprawidłowa baza broni 0.6');
 return TYPES[w.modernCategory];
}
function audit(weapons){
 if(!Array.isArray(weapons)||weapons.length!==33)throw Error('Wymagany kompletny katalog 33 broni');
 const counts={firearm:0,melee1:0,melee2:0,nonfire:0},ids=new Set();
 for(const w of weapons){
  if(ids.has(w.id))throw Error('Zdublowana baza '+w.id);ids.add(w.id);
  const kind=style(w);if(!kind)throw Error('Brak stylu 0.6');counts[kind]++;
  if(w.slot!=='hand1'&&w.slot!=='hand2')throw Error('Brak poprawnego slotu broni');
  if(w.modernCategory==='dystansowa'&&w.slot!=='hand2')throw Error('Broń dystansowa musi zajmować obie ręce: '+w.id);
  if(!Number.isInteger(w.baseAttacks)||w.baseAttacks<1||w.baseAttacks>20)throw Error('Błędna liczba ataków');
 }
 return counts;
}
return Object.freeze({style,audit});
});
