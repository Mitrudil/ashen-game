/* ASHEN 0.6 offline 129 — second-pass equipment integrity (no implicit UID certification). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060EquipIntegrity129=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function validate(state,catalog){
 if(!state||!catalog||typeof catalog.entries!=='function')throw Error('Brak danych kontroli wyposażenia 129');
 const definitions=new Map(catalog.entries().map(x=>[x.modernId,x]));
 const inventory=Array.isArray(state.inventory)?state.inventory:[];
 const counts=new Map();for(const item of inventory)if(item&&typeof item.uid==='string')counts.set(item.uid,(counts.get(item.uid)||0)+1);
 const equip={...(state.equip||{})},removed=[];
 function remove(slot,reason){const uid=equip[slot];if(!uid)return;equip[slot]=null;removed.push({slot,uid,reason});}
 const byUid=new Map(inventory.filter(x=>x&&typeof x.uid==='string').map(x=>[x.uid,x]));
 for(const [slot,uid] of Object.entries(equip)){
  if(!uid)continue;
  if((counts.get(uid)||0)>1){remove(slot,'Powtórzony UID w plecaku — nie można ustalić egzemplarza');continue;}
  const item=byUid.get(uid);if(!item||!definitions.has(item.id))continue; // legacy and missing items handled by 128
  const expected=definitions.get(item.id).gameSlot;
  const valid=expected==='hand1'?['right','left'].includes(slot):expected==='hand2'?slot==='right':expected==='extra'?['extra','extra2','extra3'].includes(slot):slot===expected;
  if(!valid)remove(slot,'Przedmiot nie pasuje do slotu '+slot);
 }
 const right=byUid.get(equip.right),left=byUid.get(equip.left);
 if(equip.right&&equip.left&&right&&definitions.get(right.id)?.gameSlot==='hand2')remove('left','Broń dwuręczna blokuje lewą rękę');
 if(equip.left&&left&&definitions.get(left.id)?.gameSlot==='hand2')remove('left','Broń dwuręczna nie może zajmować lewej ręki');
 return {equip,removed};
}
return Object.freeze({validate});
});
