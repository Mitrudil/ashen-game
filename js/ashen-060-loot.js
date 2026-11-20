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
 return {...result,qualitySchema:'legacy-v05'};
}
// Etap 14: w pelni rozdzielona sciezka przedmiotu 0.6. Nie jest aktywna bez bramki zgodnosci PvP.
function prepareModernLoot(base, poolName, qualityApi, engine, rngQuality=Math.random, rngSockets=Math.random){
 if(!base||typeof base!=='object')throw Error('Brak nowej nagrody');
 if('rarity' in base||'quality' in base||'qualitySchema' in base||'socketCapacity' in base||'socketedArtifacts' in base)throw Error('Nagroda 0.6 nie moze zawierac starej jakosci ani gniazd');
 if(!qualityApi||typeof qualityApi.createNewDrop!=='function')throw Error('Brak modulu jakosci 0.6');
 return qualityApi.createNewDrop(base,poolName,engine,rngQuality,rngSockets);
}
function modernWeights(poolName,qualityApi,luck=0){
 const src=qualityApi?.DROP_POOLS?.[poolName];if(!src)throw Error('Nieznana pula 0.6: '+poolName);
 const w=[...src];const maximum=w.reduce((last,val,i)=>val>0?i:last,0);
 let shift=Math.min(12,Math.max(0,Math.floor(Number(luck)||0)),w[0]);
 if(maximum<1||!shift)return w;
 w[0]-=shift;
 if(maximum===1)w[1]+=shift;
 else{const high=Math.ceil(shift*.65);w[maximum]+=high;w[Math.max(1,maximum-1)]+=shift-high;}
 return w;
}
function rollWeightedQuality(weights,rng=Math.random){
 if(!Array.isArray(weights)||weights.length!==5||weights.some(x=>!Number.isFinite(x)||x<0)||Math.abs(weights.reduce((a,b)=>a+b,0)-100)>1e-7)throw Error('Nieprawidlowe wagi jakosci 0.6');
 const roll=Number(rng());if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Nieprawidlowy los');
 let r=roll*100;for(let i=0;i<5;i++){r-=weights[i];if(r<0)return i;}
 return 4;
}
return Object.freeze({LEGACY_SOCKET_TIER,prepareNewLoot,prepareModernLoot,modernWeights,rollWeightedQuality});
});
