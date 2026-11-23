/* ASHEN 0.6 — Etap 134: odczytowy most identyfikatorów (bez migracji). */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.Ashen060ReadBridge134=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const OWN=Object.prototype.hasOwnProperty;
function indexCatalog(catalog){
  const items=Array.isArray(catalog)?catalog:catalog&&catalog.items;
  if(!Array.isArray(items)||items.length!==100)throw Error('Oczekiwano katalogu dokładnie 100 baz');
  const modern=new Map(),legacy=new Map();
  for(const item of items){
    if(!item||typeof item.modernId!=='string'||!item.modernId||typeof item.name!=='string'||!item.name||!['exact','missing'].includes(item.matchStatus))throw Error('Niepoprawna baza katalogu');
    if(modern.has(item.modernId))throw Error('Duplikat modernId: '+item.modernId);
    modern.set(item.modernId,item);
    if(item.matchStatus==='exact'){
      if(typeof item.legacyId!=='string'||!item.legacyId||legacy.has(item.legacyId))throw Error('Niepoprawne lub podwójne legacyId');
      legacy.set(item.legacyId,item);
    } else if(item.legacyId!=null)throw Error('Baza bez dopasowania nie może mieć legacyId');
  }
  if(legacy.size!==74)throw Error('Nieoczekiwana liczba dokładnych dopasowań');
  return {modern,legacy};
}
function inspectInventory(snapshot,catalog){
  if(!snapshot||typeof snapshot!=='object'||!Array.isArray(snapshot.inventory))throw Error('Brak inventory w przekazanej kopii');
  const idx=indexCatalog(catalog);
  const seen=new Set();
  const rows=[];
  const totals={mapped:0,unknownLegacy:0,alreadyModern:0,invalid:0,duplicateUid:0};
  for(let n=0;n<snapshot.inventory.length;n++){
    const entry=snapshot.inventory[n];
    // Bez zwracania referencji do wpisu źródłowego lub kopiowania jego prywatnych pól.
    const uid=entry&&typeof entry.uid==='string'&&entry.uid.trim()?entry.uid:null;
    const id=entry&&typeof entry.id==='string'&&entry.id.trim()?entry.id:null;
    let status='invalid',target=null,reason='Brak poprawnego uid lub id';
    if(uid&&id){
      if(seen.has(uid)){status='duplicateUid';reason='Powtórzony UID — wymaga ręcznego sprawdzenia';}
      else if(idx.modern.has(id)){status='alreadyModern';target=id;reason='Identyfikator nowej bazy; bez migracji';}
      else if(idx.legacy.has(id)){status='mapped';target=idx.legacy.get(id).modernId;reason='Zgodne legacyId; wyłącznie mapowanie diagnostyczne';}
      else {status='unknownLegacy';reason='Brak jednoznacznego odpowiednika w zatwierdzonym katalogu';}
      seen.add(uid);
    }
    totals[status]++;
    rows.push({position:n,uid,id,status,modernId:target,reason});
  }
  return {schema:'ashen-060-read-bridge-134',readOnly:true,totals,rows};
}
return Object.freeze({indexCatalog,inspectInventory});
});
