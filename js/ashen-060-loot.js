/* ASHEN 0.6.0 etap 10 — gniazda losowane WYŁĄCZNIE przy przyznaniu nowego przedmiotu.
 * Legacy rarity 0..4: Zwykły / Ulepszony / Rzadki / Epicki / Legendarny.
 * Mapowanie tymczasowe na rozkład gniazd; NIE jest migracją jakości 0.6.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Loot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LEGACY_SOCKET_TIER=Object.freeze(['zwykly','zwykly','rzadki','epicki','legendarny']);
function prepareNewLoot(item, engine, rng=Math.random){
 if(!item||typeof item!=='object'||!engine||typeof engine.createLootItem!=='function')throw Error('Brak generatora łupów 0.6');
 if('socketCapacity' in item||'sockets' in item||'socketedArtifacts' in item)throw Error('Nie wolno ponownie losować gniazd');
 const tier=LEGACY_SOCKET_TIER[item.rarity];
 if(!tier)throw Error('Nieprawidłowa stara rzadkość');
 const result=engine.createLootItem(item,tier,rng);
 return {...result};
}
return Object.freeze({LEGACY_SOCKET_TIER,prepareNewLoot});
});
