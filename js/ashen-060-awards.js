/* ASHEN 0.6 — centralized offline equipment grants; no backward conversion. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Awards=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function create(base,rarity,qualityApi,bonusApi,rng=Math.random){
 if(!base||typeof base!=='object'||!qualityApi||!bonusApi)throw Error('Brak danych nagrody 0.6');
 if(!Number.isInteger(rarity)||rarity<0||rarity>4)throw Error('Nieprawidłowa jakość nagrody 0.6');
 if(typeof base.id!=='string'||!base.id||typeof base.uid!=='string'||!base.uid)throw Error('Brak identyfikatora przedmiotu');
 for(const key of ['qualitySchema','quality','rarity','socketCapacity','socketedArtifacts','sockets'])if(Object.hasOwn(base,key))throw Error('Nagroda zawiera gotową metrykę: '+key);
 const q=qualityApi.NEW_KEYS[rarity];if(!q||typeof bonusApi.createLootItem!=='function')throw Error('Nieprawidłowe moduły jakości');
 const award=bonusApi.createLootItem({...base,rarity,qualitySchema:'ashen-v06'},q,rng);
 qualityApi.validateModern(award);return award;
}
function assertAward(award){if(!award||award.qualitySchema!=='ashen-v06'||!Number.isInteger(award.rarity)||award.rarity<0||award.rarity>4||!Number.isInteger(award.socketCapacity)||award.socketCapacity<0||award.socketCapacity>3)throw Error('Wygenerowano stary lub niepoprawny łup');return award;}
return Object.freeze({create,assertAward});
});
