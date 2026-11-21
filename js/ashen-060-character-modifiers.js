/* ASHEN 0.6.0 etap 19 — izolowany podgląd premii postaci, bez ingerencji w PvP/PvE.
 * Nie utożsamia roboczych wartości X/Y z zatwierdzonym balansem.
 * Zdarzeniowe bonusy, rezonans oraz rozdział dodatkowych ataków wymagają osobnego kontraktu.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060CharacterModifiers=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const ATTR={strength:'str',agility:'dex',endurance:'end',perception:'per',intelligence:'int',charisma:'cha'};
 const GLOBAL={hp:'hp',armor:'armor',accuracy:'accuracy',dodge:'dodge'};
 const VALID=new Set(['flat','percent','percentage_points','extra_attacks','conditional']);
 const isNum=x=>typeof x==='number'&&Number.isFinite(x);
 function preview(snapshot,result,reference){
  if(!reference||typeof reference.calculate!=='function')throw Error('Missing reference calculator');
  if(!snapshot||!result||!Array.isArray(result.modifiers))throw Error('Missing snapshot/modifiers');
  if(Object.keys(snapshot.setEffects||{}).length||Object.keys(snapshot.resonanceBonus||{}).length)
   throw Error('Modern preview must not mix legacy set or resonance effects');
  const attrs={...snapshot.baseAttrs}, accumulated={},unresolved=[];
  for(const [i,m] of result.modifiers.entries()){
   if(!m||!VALID.has(m.operation)||!isNum(m.value)||typeof m.stat_key!=='string')throw Error('Invalid modifier '+i);
   const key=m.stat_key+'|'+m.operation;
   if(ATTR[m.stat_key]&&m.operation==='flat'){
    const a=ATTR[m.stat_key];attrs[a]=(attrs[a]||0)+m.value;
   }else if(GLOBAL[m.stat_key]&&['flat','percent'].includes(m.operation)){
    accumulated[key]=(accumulated[key]||0)+m.value;
   }else unresolved.push({...m,reason:m.operation==='extra_attacks'?'target_weapon_and_attack_policy_pending':'requires_combat_or_separate_rule'});
  }
  const raw=reference.calculate({...snapshot,baseAttrs:attrs,setEffects:{},resonanceBonus:{}});
  const hpFlat=accumulated['hp|flat']||0,hpPercent=accumulated['hp|percent']||0;
  const armorFlat=accumulated['armor|flat']||0,armorPercent=accumulated['armor|percent']||0;
  // Percentage armor applies only to equipment armor, as in the existing heroDefense formula.
  const defense={...raw.defense,
   hp:Math.round(raw.defense.hp*(1+hpPercent/100)+hpFlat),
   armor:raw.defense.armor+Math.round(raw.defense.rawArmor*armorPercent/100)+armorFlat,
   acc:raw.defense.acc+(accumulated['accuracy|flat']||0),
   dodge:raw.defense.dodge+(accumulated['dodge|flat']||0),
   setArmor:armorPercent};
  const pendingSignals=(result.signals||[]).filter(s=>s&&s.type!=='set_incomplete');
  return {attributes:raw.attributes,defense,attacks:raw.attacks,attackCount:raw.attackCount,
   applied:accumulated,unresolved,pendingSignals,
   complete:unresolved.length===0&&pendingSignals.length===0,
   status:'diagnostic_only',legacyAttackRules:true};
 }
 return Object.freeze({preview});
});
