/* ASHEN 0.6.0 / etap 21 — izolowany, deterministyczny podgląd kontraktu bojowego.
 * Wyłącznie diagnostyka: NIE jest silnikiem PvE/PvP ani walidacją serwera.
 * Bonusy Z / rezonanse pozostają nierozstrzygnięte do zatwierdzenia mechaniki.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060CombatPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function assert(test,message){if(!test)throw Error(message)}
 function int(n){return Number.isInteger(n)&&n>=0}
 function finite(n){return typeof n==='number'&&Number.isFinite(n)}
 // Brak automatycznego rozdziału ataków na bronie — wybór musi być jawny.
 function attacks(weapons,result,allocation){
  assert(weapons&&typeof weapons==='object'&&result&&Array.isArray(result.modifiers),'Brak danych uzbrojenia');
  assert(allocation&&typeof allocation==='object','Wymagany jawny przydział dodatkowych ataków');
  const names=Object.keys(weapons);assert(names.length>=1&&names.length<=2&&names.every(n=>['main','off'].includes(n)),'Nieznane sloty broni');
  const bonus=result.modifiers.filter(m=>m.operation==='extra_attacks').reduce((sum,m)=>{
   assert(finite(m.value)&&int(m.value),'Dodatkowe ataki muszą być liczbami całkowitymi >= 0');return sum+m.value;
  },0);
  assert(Object.keys(allocation).every(n=>names.includes(n)),'Przydział do nieistniejącej broni');
  const allocated=names.reduce((sum,n)=>{
   assert(int(allocation[n]||0),'Przydział musi być liczbą całkowitą');return sum+(allocation[n]||0);
  },0);
  assert(allocated===bonus,'Suma przydzielonych ataków musi równać się premii');
  const perWeapon=names.map(slot=>{
   const w=weapons[slot];assert(w&&int(w.baseAttacks)&&w.baseAttacks>=1,'Ataki bazowe są stałą właściwością broni');
   const extra=allocation[slot]||0;return {slot,baseAttacks:w.baseAttacks,extraAttacks:extra,totalAttacks:w.baseAttacks+extra};
  });
  const total=perWeapon.reduce((sum,w)=>sum+w.totalAttacks,0);
  // Limit dotyczy kompatybilności ze starym kontraktem, nie projektowania nowego balansu.
  return {perWeapon,totalAttacks:total,extraAttacks:bonus,legacyPvpCompatible:total<=8,
   warnings:total>8?['Stary kontrakt PvP obsługuje najwyżej 8 wpisów ataków; nie publikować tej migawki.']:[],status:'diagnostic_only'};
 }
 // Wartości zdarzeniowe są wyłącznie podglądem procentu bonusu do następnego trafienia.
 // Nie obliczamy realnych obrażeń ani trafień i nie zastępujemy silnika walki.
 function events(result,history){
  assert(result&&Array.isArray(result.modifiers)&&Array.isArray(history),'Brak historii zdarzeń');
  const unresolved=(result.signals||[]).filter(s=>s&&['set_z','resonance'].includes(s.type));
  const conditional=result.modifiers.filter(m=>m.operation==='conditional');
  const known=conditional.filter(m=>m.stat_key==='hitAfterDodgeDamage');
  const unknown=conditional.filter(m=>m.stat_key!=='hitAfterDodgeDamage');
  for(const m of conditional)assert(finite(m.value),'Nieprawidłowa wartość bonusu warunkowego');
  const bonus=known.reduce((sum,m)=>sum+m.value,0);
  let armed=false;const resolved=[];
  for(const event of history){
   assert(event&&['dodge','hit','miss','round_end'].includes(event.type),'Nieznane zdarzenie walki');
   if(event.type==='dodge'){armed=true;resolved.push({type:'dodge',armed:true});}
   else if(event.type==='hit'){resolved.push({type:'hit',bonusDamagePercent:armed?bonus:0,triggered:armed&&bonus!==0});armed=false;}
   else resolved.push({type:event.type,bonusDamagePercent:0});
  }
  return {events:resolved,armedForNextHit:armed,unsupportedModifiers:unknown,unresolvedSignals:unresolved,
   complete:unknown.length===0&&unresolved.length===0,status:'diagnostic_only'};
 }
 function inspect(result,weapons,allocation,history){
  const a=attacks(weapons,result,allocation),e=events(result,history);
  return {attacks:a,events:e,readyForLive:false,status:'diagnostic_only',
   pendingDecisions:['Przydział pełnych ataków do broni wymaga zatwierdzenia','Reguły Z i rezonansów wymagają zatwierdzenia','Weryfikacja serwerowa PvP pozostaje obowiązkowa']};
 }
 return Object.freeze({attacks,events,inspect});
});
