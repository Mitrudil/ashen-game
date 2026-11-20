/* ASHEN 0.6.0 — etap 11. Oddzielne schematy jakości, bez automatycznej migracji.
 * V05: [Zwykły, Ulepszony, Rzadki, Epicki, Legendarny]
 * V06: [Zwykły, Rzadki, Epicki, Legendarny, Mityczny]
 * Nie dotyka produkcyjnego PvP ani istniejących postaci.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Quality=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LEGACY=Object.freeze(['Zwykły','Ulepszony','Rzadki','Epicki','Legendarny']);
const NEW=Object.freeze(['Zwykły','Rzadki','Epicki','Legendarny','Mityczny']);
const NEW_KEYS=Object.freeze(['zwykly','rzadki','epicki','legendarny','mityczny']);
const MULTIPLIERS=Object.freeze([1,1.12,1.26,1.42,1.60]);
// Propozycja startowa 0.6 — bez zmiany obecnych pulek wypraw.
// Mityczny wyłącznie w specjalnej puli późniejszej zawartości; każda pula sumuje się do 100.
const DROP_POOLS=Object.freeze({
 ruins:Object.freeze([94,6,0,0,0]),
 hospital:Object.freeze([72,24,4,0,0]),
 outpost:Object.freeze([48,34,15,3,0]),
 late_game:Object.freeze([8,28,40,23.5,.5])
});
const isIndex=n=>Number.isInteger(n)&&n>=0&&n<=4;
function validateLegacy(item){if(!item||typeof item!=='object'||!isIndex(item.rarity))throw Error('Nieprawidłowy stary przedmiot');
 if(item.qualitySchema&&item.qualitySchema!=='legacy-v05')throw Error('Przedmiot nie pochodzi ze schematu legacy-v05');return item;}
function validateModern(item){if(!item||typeof item!=='object'||item.qualitySchema!=='ashen-v06'||!isIndex(item.rarity))throw Error('Brak jakości 0.6');
 if(item.quality!==NEW_KEYS[item.rarity])throw Error('Niespójna jakość 0.6');return item;}
function describe(item){
 if(item?.qualitySchema==='ashen-v06'){validateModern(item);return Object.freeze({schema:'ashen-v06',index:item.rarity,label:NEW[item.rarity],key:NEW_KEYS[item.rarity],multiplier:MULTIPLIERS[item.rarity]});}
 validateLegacy(item);
 return Object.freeze({schema:'legacy-v05',index:item.rarity,label:LEGACY[item.rarity],requiresMigration:true});
}
function rollQuality(poolName,rng=Math.random){const weights=DROP_POOLS[poolName];if(!weights)throw Error('Nieznana pula jakości: '+poolName);
 const roll=Number(rng());if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Losowanie jakości poza [0,1)');
 let threshold=0;for(let i=0;i<weights.length;i++){threshold+=weights[i]/100;if(roll<threshold)return i;}return 4;
}
// TYLKO nowe przedmioty. Właściwy zapis nowej jakości, z gniazdami wylosowanymi jeden raz.
function createNewDrop(base,poolName,bonuses,rngQuality=Math.random,rngSockets=Math.random){
 if(!base||typeof base!=='object'||!bonuses||typeof bonuses.createLootItem!=='function')throw Error('Brak generatora 0.6');
 if('rarity' in base||'qualitySchema' in base||'quality' in base||'socketCapacity' in base||'socketedArtifacts' in base)throw Error('Nowy drop musi mieć czystą metrykę jakości i gniazd');
 const index=rollQuality(poolName,rngQuality);
 const item=bonuses.createLootItem({...base,rarity:index,qualitySchema:'ashen-v06'},NEW_KEYS[index],rngSockets);
 return validateModern(item);
}
// Audyt, nie mutacja. Stary Ulepszony wymaga decyzji projektowej; NIGDY nie zostaje mitycznym.
function auditInventory(items){if(!Array.isArray(items))throw Error('Ekwipunek musi być tablicą');const counts=Object.fromEntries(LEGACY.map(x=>[x,0]));let modern=0;let incompatible=0;
 for(const item of items){try{const d=describe(item);if(d.schema==='ashen-v06')modern++;else counts[d.label]++;}catch{incompatible++;}}
 return {legacyCounts:counts,modern,incompatible,requiresDecision:counts['Ulepszony']>0,unchanged:true};
}
// Każda migracja wymaga wyraźnie podanej reguły dla Ulepszonego.
// Wersja bezpieczna nie uruchamia się w grze, bo potrzebna jest też migracja serwera i statystyk.
function migrationPreview(items,upgradedPolicy){if(!['to_rare','to_common','block'].includes(upgradedPolicy))throw Error('Podaj jawnie politykę dla starego Ulepszonego');
 if(!Array.isArray(items))throw Error('Ekwipunek musi być tablicą');
 const map=[0,upgradedPolicy==='to_rare'?1:upgradedPolicy==='to_common'?0:null,1,2,3];
 return items.map(item=>{const old=describe(item);if(old.schema==='ashen-v06')return {uid:item.uid||null,from:old.label,to:old.label,status:'modern_unchanged'};
 const target=map[old.index];return {uid:item.uid||null,from:old.label,to:target===null?null:NEW[target],status:target===null?'requires_decision':'preview_only',socketCapacity:item.socketCapacity??null};});
}
return Object.freeze({LEGACY,NEW,NEW_KEYS,MULTIPLIERS,DROP_POOLS,describe,rollQuality,createNewDrop,auditInventory,migrationPreview,validateModern});
});
