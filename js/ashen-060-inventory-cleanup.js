/* ASHEN Tester 0.6 — migration planner (119). No automatic deletion.
 * Pure plan/apply for only the active offline tester.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060InventoryCleanup=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function isModern(inst){return !!inst&&typeof inst==='object'&&inst.qualitySchema==='ashen-v06'&&typeof inst.id==='string'&&typeof inst.uid==='string'&&inst.uid.length>0;}
function plan(state,category){
 if(!state||!Array.isArray(state.inventory)||!state.equip||typeof state.equip!=='object')throw Error('Nieprawidłowy zapis ekwipunku.');
 if(typeof category!=='function')throw Error('Brak klasyfikatora kategorii.');
 const keep=[],remove=[],seen=new Set();
 for(const inst of state.inventory){
  if(!inst||typeof inst!=='object'||typeof inst.uid!=='string'||!inst.uid||seen.has(inst.uid))throw Error('Niezgodne identyfikatory w zapisie; czyszczenie zatrzymane.');
  seen.add(inst.uid);
  if(isModern(inst)||category(inst)==='material')keep.push(inst);else remove.push(inst);
 }
 const kept=new Set(keep.map(x=>x.uid));const eq={...state.equip};const unequipped=[];
 for(const [slot,uid] of Object.entries(eq)){if(uid&&!kept.has(uid)){unequipped.push(slot);eq[slot]=null;}}
 return {kept:keep.length,removed:remove.length,equippedRemoved:unequipped.length,removedUids:remove.map(x=>x.uid),unequippedSlots:unequipped,inventory:keep,equip:eq};
}
function apply(state,result){
 if(!state||!result||!Array.isArray(result.inventory))throw Error('Niepoprawny plan czyszczenia.');
 const next={...state,inventory:result.inventory.map(x=>({...x})),equip:{...result.equip},equipmentV06Cleanup:119};
 const ids=new Set(next.inventory.map(x=>x.uid));
 for(const uid of Object.values(next.equip))if(uid&&!ids.has(uid))throw Error('Pozostał nieistniejący przedmiot w slocie.');
 return next;
}
return Object.freeze({isModern,plan,apply});
});
