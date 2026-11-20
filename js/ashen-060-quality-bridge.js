/* ASHEN 0.6.0 — etap 12: schema-aware client presentation and economics.
 * A legacy index never silently turns into a 0.6 quality. No inventory mutation.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060QualityBridge=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LEGACY_COLORS=['#b8bfc3','#8ac78b','#77afe5','#c391e4','#f2bb65'];
const MODERN_COLORS=['#b8bfc3','#77afe5','#c391e4','#f2bb65','#f080bc'];
const NEW_FORMS=Object.freeze({f:['','Rzadka','Epicka','Legendarna','Mityczna'],p:['','Rzadkie','Epickie','Legendarne','Mityczne'],m:['','Rzadki','Epicki','Legendarny','Mityczny']});
const OLD_FORMS=Object.freeze({f:['','Ulepszona','Rzadka','Epicka','Legendarna'],p:['','Ulepszone','Rzadkie','Epickie','Legendarne'],m:['','Ulepszony','Rzadki','Epicki','Legendarny']});
const clamp=n=>Math.max(0,Math.min(4,Math.trunc(n)));
function resolve(inst,qualityApi){
 if(!qualityApi||typeof qualityApi.describe!=='function')throw Error('Brak modułu jakości 0.6');
 const q=qualityApi.describe(inst);
 if(q.schema==='ashen-v06')return Object.freeze({schema:q.schema,index:q.index,name:q.label,mult:q.multiplier,color:MODERN_COLORS[q.index],rank:q.index,requiresMigration:false});
 const oldMult=[1,1.14,1.32,1.58,1.95][q.index];
 // Dla porównywania jakości stary 'Ulepszony' leży między Zwykłym a Rzadkim.
 const rank=[0,.5,1,2,3][q.index];
 return Object.freeze({schema:q.schema,index:q.index,name:q.label,mult:oldMult,color:LEGACY_COLORS[q.index],rank,requiresMigration:q.requiresMigration});
}
function prefix(inst,form,qualityApi){const q=resolve(inst,qualityApi);if(!['m','f','p'].includes(form))throw Error('Nieznana odmiana');return (q.schema==='ashen-v06'?NEW_FORMS:OLD_FORMS)[form][q.index]||''}
function ranking(inst,qualityApi){return resolve(inst,qualityApi).rank}
function qualityArmorFloor(inst,qualityApi){const q=resolve(inst,qualityApi);return (q.schema==='ashen-v06'?[0,1,2,3,5]:[0,1,2,3,5])[q.index]}
// Wspolny odczyt ekonomii obu schematow. Dawne wartosci pozostaja nietkniete.
// Wartosc mnoznika dla nowych jakosci jest wstepna i nie aktywuje nowych dropow.
const MODERN_ECONOMY=Object.freeze({sale:Object.freeze([1,2.4,4.5,8,11]),salvage:Object.freeze([1,1.5,2,2.7,3.4])});
function economyMultiplier(inst,kind,qualityApi,economy){
 if(!['sale','salvage'].includes(kind))throw Error('Nieznany typ ekonomii');
 const q=resolve(inst,qualityApi);
 if(q.schema==='ashen-v06')return MODERN_ECONOMY[kind][q.index];
 const table=kind==='sale'?economy?.saleRarity:economy?.yieldRarity;
 if(!Array.isArray(table)||table.length!==5)throw Error('Brak tabeli starej ekonomii');
 return table[q.index];
}
return Object.freeze({resolve,prefix,ranking,qualityArmorFloor,economyMultiplier,MODERN_ECONOMY,LEGACY_COLORS,MODERN_COLORS});
});
