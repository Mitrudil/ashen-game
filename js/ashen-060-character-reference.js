/* ASHEN 0.6.0 stage 18 — read-only independent character calculation.
 * Input contains evaluated equipment stats and existing set/reaction effects.
 * Preserves v0.5.4.1 attack rules; doesn't grant full extra strikes.
 * This is a reference/diagnostic only, not authoritative server gameplay.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060CharacterReference=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const ATTR_KEYS=['str','dex','end','per','int','cha'];
 const SET_ATTRIBUTE_KEYS=new Set(ATTR_KEYS);
 const ONE_MELEE=new Set(['knife','pipe','machete','cleaver','wrench','hatchet','baton','saber']);
 const TWO_MELEE=new Set(['hammer','crowbar','sledge']);
 const NONFIRE=new Set(['crossbow','harpoon']);
 function finite(n,label){if(typeof n!=='number'||!Number.isFinite(n))throw Error('Invalid '+label);return n;}
 function numericMap(x,label){if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Invalid '+label);
  for(const [k,v] of Object.entries(x))finite(v,label+'.'+k);return x;}
 function style(id){return ONE_MELEE.has(id)?'melee1':TWO_MELEE.has(id)?'melee2':NONFIRE.has(id)?'nonfire':'firearm'}
 function weaponAttributeDamage(a,w){switch(style(w.id)){
  case 'melee1':return Math.floor(a.str/5+a.dex/10);
  case 'melee2':return Math.floor(a.str/3.5+a.dex/18);
  case 'nonfire':return Math.floor(a.per/9+a.dex/9);
  default:return Math.floor(a.per/6);
 }}
 function weaponAccuracy(a,w){switch(style(w.id)){
  case 'melee1':return 6+a.dex*1.25+a.per*.25;
  case 'melee2':return 6+a.str*.5+a.dex*.75+a.per*.15;
  case 'nonfire':return 6+a.per*.9+a.dex*.7;
  default:return 6+a.per*1.4+a.dex*.25;
 }}
 function calculate(s){
  if(!s||!s.baseAttrs||!s.equipment||!s.equip)throw Error('Missing character snapshot');
  const base=numericMap(s.baseAttrs,'baseAttrs');const set=numericMap(s.setEffects||{},'setEffects');const resonance=numericMap(s.resonanceBonus||{},'resonanceBonus');
  const a={};for(const k of ATTR_KEYS)a[k]=finite(base[k]??0,'base '+k);
  const worn=[];const seen=new Set();
  for(const [slot,uid] of Object.entries(s.equip)){
   if(uid===null||uid===undefined||uid==='')continue;
   if(typeof uid!=='string')throw Error('Invalid equipped uid');
   if(seen.has(uid))throw Error('Duplicate equipped UID');seen.add(uid);
   const o=s.equipment[uid];if(!o)throw Error('Missing equipped object '+uid);
   if(o.uid!==uid)throw Error('UID mismatch '+uid);
   numericMap(o.bonus||{},'bonus '+uid);
   for(const [k,v] of Object.entries(o.bonus||{}))if(k in a)a[k]+=v;
   worn.push({slot,uid,stats:o});
  }
  for(const [k,v] of Object.entries(set))if(SET_ATTRIBUTE_KEYS.has(k))a[k]+=v;
  for(const [k,v] of Object.entries(resonance))if(k in a)a[k]+=v;
  const room=finite(s.infirmaryLevel??1,'infirmaryLevel');if(!Number.isInteger(room)||room<1||room>5)throw Error('Invalid infirmaryLevel');
  const hp=Math.round((60+a.end*10)*(1+.025*(room-1))*(1+(set.hpPct||0)/100)+(set.hpFlat||0));
  let rawArmor=0;for(const item of worn)if(!['right','left'].includes(item.slot))rawArmor+=finite(item.stats.armor||0,'armor');
  const setArmor=set.armorPct||0,pet=finite(s.petArmor||0,'petArmor');
  const vehicleArmor=s.expedition?2*finite(s.vehicleArmorModule||0,'vehicleArmorModule'):0;
  const defense={hp,acc:6+a.per*1.3+(set.accuracy||0),dodge:3+a.dex*1.1+pet+(set.dodge||0),armor:rawArmor+Math.round(rawArmor*setArmor/100)+Math.floor(a.end/4)+pet+vehicleArmor+(set.armorFlat||0),setArmor,pet,vehicleArmor,rawArmor};
  const hand=s.dominantHand||'right';if(!['right','left'].includes(hand))throw Error('Invalid dominant hand');
  const off=hand==='right'?'left':'right';const get=h=>s.equipment[s.equip[h]]||null;
  const main=get(hand),secondary=get(off),attacks=[];
  function addWeapon(w,h,power){if(!w)return;
   const count=Math.max(1,Math.min(3,Number(w.baseAttacks)||1));
   for(let i=0;i<count;i++)attacks.push({id:w.id,hand:h,power,base:true,min:w.min,max:w.max,attributeDamage:weaponAttributeDamage(a,w),accuracy:weaponAccuracy(a,w)});
   if(w.extraAttacks>0&&w.slot==='hand1')attacks.push({id:w.id,hand:h,power:Math.min(.36,.12*count*power),base:false,min:w.min,max:w.max,attributeDamage:weaponAttributeDamage(a,w),accuracy:weaponAccuracy(a,w)});
  }
  if(main?.slot==='hand1')addWeapon(main,hand,1);
  if(secondary?.slot==='hand2'){attacks.length=0;addWeapon(secondary,off,1)}
  else if(secondary?.slot==='hand1')addWeapon(secondary,off,.8);
  if(!attacks.length&&main?.slot==='hand2')addWeapon(main,hand,1);
  if(!attacks.length){if(!s.fallbackKnife)throw Error('Missing fallback knife');addWeapon(s.fallbackKnife,hand,1)}
  return {attributes:a,defense,attacks,attackCount:attacks.length,weaponStyles:attacks.map(x=>style(x.id))};
 }
 return Object.freeze({calculate,weaponAttributeDamage,weaponAccuracy,style});
});
