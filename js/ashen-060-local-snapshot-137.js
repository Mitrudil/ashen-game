/* ASHEN 0.6 — etap 137: ręczny odczyt lokalnego zapisu (bez zapisu/serwera). */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060LocalSnapshot137=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ACTIVE='ashen-dev-active-v021';
const LEGACY='ashen-save-v010';
const SLOT_PREFIX='ashen-dev-slot-v021:';
const MAX_BYTES=2*1024*1024;
function readSelected(storage){
 if(!storage||typeof storage.getItem!=='function')throw Error('Brak dostępu do pamięci lokalnej');
 const active=storage.getItem(ACTIVE)||'main';
 // Nie przyjmujemy dowolnych wartości jako kluczy — zapis w grze działa na profilu main lub slotach dev.
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(active))throw Error('Niepoprawna nazwa aktywnego profilu');
 const key=active==='main'?LEGACY:SLOT_PREFIX+active;
 const raw=storage.getItem(key);
 if(raw==null)throw Error('Brak lokalnego zapisu dla aktywnego profilu');
 if(raw.length>MAX_BYTES)throw Error('Lokalny zapis jest zbyt duży do bezpiecznej diagnostyki');
 let parsed;
 try{parsed=JSON.parse(raw)}catch{throw Error('Nie można odczytać JSON lokalnego zapisu')}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||!Array.isArray(parsed.inventory)||!parsed.equip||typeof parsed.equip!=='object'||Array.isArray(parsed.equip))throw Error('Lokalny zapis nie ma pól inventory i equip');
 // Zwracamy TYLKO dane potrzebne audytowi. Bez tokenów, postaci, raportów czy innych pól.
 const inventory=parsed.inventory.map(item=>({uid:item?.uid,id:item?.id}));
 const equip={};
 for(const slot of ['right','left','head','shirt','outer','hands','pants','boots','extra','extra2','extra3']){
  if(Object.prototype.hasOwnProperty.call(parsed.equip,slot))equip[slot]=parsed.equip[slot];
 }
 return {profile:active,source:'localStorage',snapshot:{inventory,equip}};
}
return Object.freeze({readSelected});
});
