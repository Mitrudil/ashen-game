/* ASHEN 0.6 — lokalne wyposażenie PvE na postaci powiązanej z chmurą.
 * Nigdy nie modyfikuje normalnego wyposażenia ani migawki PvP.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060PveLoadout=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SLOTS=['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3'];
function resolve(base,chosen,inventory,definition){
 if(!base||typeof base!=='object'||!Array.isArray(inventory)||typeof definition!=='function')throw Error('Brak danych zestawu PvE');
 const equip={...base},lookup=new Map(inventory.filter(x=>x&&typeof x.uid==='string').map(x=>[x.uid,x]));
 const selected=chosen&&typeof chosen==='object'?chosen:{};
 for(const slot of SLOTS){
  const uid=selected[slot];if(typeof uid!=='string'||!uid)continue;
  const inst=lookup.get(uid);if(!inst||inst.qualitySchema!=='ashen-v06')continue;
  const def=definition(inst);if(!def||!def.slot)continue;
  const compatible=(def.slot==='hand1'&&['right','left'].includes(slot))||(def.slot==='hand2'&&slot==='right')||(def.slot==='extra'&&['extra','extra2','extra3'].includes(slot))||def.slot===slot;
  if(!compatible||def.slot==='material')continue;
  for(const key of Object.keys(equip))if(equip[key]===uid)equip[key]=null;
  if(def.slot==='hand2'){equip.right=uid;equip.left=null;}
  else if(def.slot==='hand1'){
   const old=lookup.get(equip.right);if(old&&definition(old)?.slot==='hand2')equip.right=null;
   equip[slot]=uid;
  }else equip[slot]=uid;
 }
 // Dwuręczna broń może być również elementem starego ekwipunku.
 const right=lookup.get(equip.right);if(right&&definition(right)?.slot==='hand2')equip.left=null;
 return equip;
}
return Object.freeze({resolve,SLOTS});
});
