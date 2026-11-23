/* ASHEN 0.6 — Etap 135: audyt wyposażenia, tylko odczyt, bez zapisu. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./ashen-060-read-bridge-134.js'):root.Ashen060ReadBridge134);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060EquipAudit135=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(bridge){
'use strict';
const SLOTS=['right','left','head','shirt','outer','hands','pants','boots','extra','extra2','extra3'];
const HANDS=new Set(['right','left']);
const EXTRAS=new Set(['extra','extra2','extra3']);
function slotCompatible(slot,base){
 const group=base.slotCategory;
 if(group==='palna_1h'||group==='biala_1h')return HANDS.has(slot);
 if(group==='palna_2h'||group==='biala_2h'||group==='dystansowa_2h')return slot==='right';
 if(group==='accessory')return EXTRAS.has(slot);
 return slot===group;
}
function inspectEquipment(snapshot,catalog){
 if(!bridge||typeof bridge.inspectInventory!=='function')throw Error('Brak modułu 134');
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!snapshot.equip||typeof snapshot.equip!=='object'||Array.isArray(snapshot.equip))throw Error('Brak equip w przekazanej kopii');
 const inventory=bridge.inspectInventory(snapshot,catalog);
 const idx=bridge.indexCatalog(catalog);
 const uidEntries=new Map();
 for(const entry of snapshot.inventory){
  if(entry&&typeof entry.uid==='string'&&entry.uid.trim()){
   const a=uidEntries.get(entry.uid)||[];a.push(entry);uidEntries.set(entry.uid,a);
  }
 }
 const rows=[],seenEquipped=new Map();
 for(const slot of SLOTS){
  const uid=snapshot.equip[slot];
  if(uid==null||uid==='')continue;
  let status='ok',reason='Zgodny slot i jednoznaczny UID',modernId=null;
  if(typeof uid!=='string'||!uid.trim()){status='invalidUid';reason='Niepoprawny identyfikator slotu';}
  else {
   const matches=uidEntries.get(uid)||[];
   if(matches.length===0){status='missingUid';reason='Brak UID w plecaku';}
   else if(matches.length>1){status='ambiguousUid';reason='UID powtarza się w plecaku';}
   else {
    const item=matches[0];
    const id=typeof item.id==='string'?item.id:null;
    const base=(id&&idx.modern.get(id))||(id&&idx.legacy.get(id));
    if(!base){status='unknownBase';reason='Baza poza zatwierdzonym katalogiem — nie rozstrzygamy poprawności';}
    else {modernId=base.modernId;
     if(!slotCompatible(slot,base)){status='wrongSlot';reason='Niezgodna kategoria przedmiotu ze slotem';}
    }
   }
   if(seenEquipped.has(uid)&&status!=='invalidUid'){
    status='reusedEquippedUid';reason='Ten UID występuje także w slocie '+seenEquipped.get(uid);
   } else seenEquipped.set(uid,slot);
  }
  rows.push({slot,uid:typeof uid==='string'?uid:null,status,reason,modernId});
 }
 const bySlot=Object.fromEntries(rows.map(r=>[r.slot,r]));
 const right=bySlot.right,left=bySlot.left;
 if(right&&left&&right.status==='ok'&&left.status==='ok'){
  const rightBase=idx.modern.get(right.modernId);
  if(rightBase&&rightBase.handMode==='2h'){
   right.status='twoHandConflict';right.reason='Broń dwuręczna koliduje z przedmiotem w lewej ręce';
   left.status='twoHandConflict';left.reason='Lewa ręka zajęta przy broni dwuręcznej';
  }
 }
 // Nieznane dodatkowe klucze traktujemy wyłącznie jako ostrzeżenie diagnostyczne.
 const unexpectedSlots=Object.keys(snapshot.equip).filter(s=>!SLOTS.includes(s));
 const totals={};for(const r of rows)totals[r.status]=(totals[r.status]||0)+1;
 return {schema:'ashen-060-equip-audit-135',readOnly:true,inventoryTotals:inventory.totals,totals,rows,unexpectedSlots,checkedSlots:SLOTS.length};
}
return Object.freeze({inspectEquipment,slotCompatible,SLOTS:Object.freeze(SLOTS.slice())});
});
