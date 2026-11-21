/* ASHEN 0.6.0 — etap 23. PROPOZYCJE balansu Z; wyłącznie diagnostyka.
 * Nie uruchamia bonusów w rzeczywistym PvE/PvP; wartości wymagają zatwierdzenia.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060ZRulebook=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // Wpisy odpowiadają jeden do jednego rodzinom i nazwom Z z katalogu 0.6.0.
 const entries=[
  ['Wzmocniony','Drugi oddech','hp_below_threshold','heal_flat',12,'battle',1,0],
  ['Pancerny','Niezłomna płyta','damage_taken','armor_flat',8,'round',1,1],
  ['Elastyczny','Kontratak po uniku','dodge','damage_percent',8,'round',1,1],
  ['Zwinny','Błyskawiczny start','battle_start','initiative_flat',6,'battle',1,0],
  ['Lekki','Seria trafień','hit','accuracy_flat',4,'round',1,1],
  ['Odporny','Redukcja krytyka','damage_taken','shield_flat',9,'round',1,1],
  ['Tropicielski','Oznaczenie celu','critical_hit','accuracy_flat',5,'round',1,1],
  ['Żelazny','Miażdżący cios','critical_hit','penetration_flat',5,'round',1,1],
  ['Wartowniczy','Tarcza ratunkowa','hp_below_threshold','shield_flat',15,'battle',1,0],
  ['Nomadyczny','Bonus po utracie PŻ','damage_taken','damage_percent',6,'round',1,2],
  ['Techniczny','Skan pancerza','round_start','penetration_flat',4,'battle',1,0],
  ['Spostrzegawczy','Drugi celny cios','hit','damage_percent',6,'round',1,1],
  ['Przekonujący','Autorytet','battle_start','accuracy_flat',5,'battle',1,0],
  ['Refleksyjny','Przebicie po uniku','dodge','penetration_flat',5,'round',1,1],
  ['Wszechstronny','Jednorazowa osłona','damage_taken','shield_flat',12,'battle',1,0]
 ];
 const RULES=Object.freeze(Object.fromEntries(entries.map(([family,name,trigger,type,value,limitScope,maxActivations,cooldownRounds])=>[
  family,Object.freeze({family,name,trigger,actor:'self',limitScope,maxActivations,cooldownRounds,
   effect:Object.freeze({type,value}),balanceStatus:'proposal',application:'diagnostic_only'})
 ])));
 function ensureCatalog(catalog){
  if(!catalog||!Array.isArray(catalog.sets))throw Error('Wymagany katalog zestawów 0.6.0');
  const expected=new Map(catalog.sets.map(s=>[s.name,s.z_name_unchanged]));
  if(expected.size!==15||Object.keys(RULES).length!==15)throw Error('Liczba zestawów Z jest niespójna');
  for(const [family,def] of Object.entries(RULES))if(expected.get(family)!==def.name)
   throw Error('Zmiana nazwy Z w katalogu: '+family);
  return true;
 }
 function proposedRules(result,catalog){
  ensureCatalog(catalog);
  if(!result||!Array.isArray(result.signals))throw Error('Brak sygnałów zestawowych');
  const rules={};
  for(const signal of result.signals){
   if(!signal||signal.type!=='set_z')continue;
   const def=RULES[signal.family];
   if(!def||signal.name!==def.name)throw Error('Nieznany sygnał Z: '+String(signal.family));
   rules['set_z:'+signal.family]={trigger:def.trigger,actor:def.actor,limitScope:def.limitScope,
    maxActivations:def.maxActivations,cooldownRounds:def.cooldownRounds,effect:{...def.effect}};
  }
  return rules;
 }
 function preview(result,history,catalog,engine){
  if(!engine||typeof engine.simulate!=='function')throw Error('Wymagany moduł diagnostyczny etapu 22');
  const rules=proposedRules(result,catalog);
  const report=engine.simulate(result,history,rules);
  return {...report,balanceStatus:'proposal_not_approved',readyForLive:false,
   notes:[...report.notes,'Efekty liczbowe są propozycją; nie definiują czasu trwania i nie zmieniają PŻ ani obrażeń.',
    'hp_below_threshold wymaga progu od silnika walki; sam podgląd nie oblicza procentu PŻ.',
    'Wzmacnianie lub aplikacja efektu po zdarzeniu wymaga integracji z silnikiem walki.']};
 }
 return Object.freeze({RULES,ensureCatalog,proposedRules,preview});
});
