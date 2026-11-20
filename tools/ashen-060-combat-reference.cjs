/* ASHEN 0.6.0 etap 17. Pure mathematical replica of weapon part of statsOf.
 * Does not implement actor stats, Z powers, PvP attack sequence or artifact effects. */
const DATA=require('../data/ashen-060-combat-contract.json');
const LEGACY=[1,1.14,1.32,1.58,1.95],MODERN=[1,1.12,1.26,1.42,1.60];
const WORKSHOP=[0,.028,.056,.084,.112,.14];
function preview(item){
 if(!item||typeof item!=='object')throw Error('item required');
 const w=DATA.weapons[item.id];if(!w)throw Error('unknown weapon');
 const modern=item.qualitySchema==='ashen-v06';
 if(item.qualitySchema&&!['legacy-v05','ashen-v06'].includes(item.qualitySchema))throw Error('invalid quality schema');
 const rarity=item.rarity,upgrade=item.upgrade??0;
 if(!Number.isInteger(rarity)||rarity<0||rarity>4)throw Error('invalid rarity');
 if(!Number.isInteger(upgrade)||upgrade<0||upgrade>5)throw Error('invalid upgrade');
 if(modern && item.quality!==['zwykly','rzadki','epicki','legendarny','mityczny'][rarity])throw Error('invalid modern quality');
 let damagePct=0,accuracy=0,critPp=0,armorPen=0,extraAttacks=0,bonus={...w.bonus};
 for(const kind of ['prefix','suffix']){
  const id=item[kind];if(!id)continue;
  const mod=DATA.weaponAffixes.find(x=>x.id===id&&x.kind===kind);
  if(!mod||!mod.allowedWeapons.includes(item.id))throw Error('invalid '+kind+' for '+item.id);
  damagePct+=mod.damagePct||0;accuracy+=mod.accuracy||0;critPp+=mod.critPp||0;armorPen+=mod.armorPen||0;extraAttacks+=mod.extraAttacks||0;
  for(const [k,v] of Object.entries(mod.bonus||{}))bonus[k]=(bonus[k]||0)+v;
 }
 const mult=(modern?MODERN:LEGACY)[rarity],factor=w.scale*mult*(1+damagePct/100)*(1+WORKSHOP[upgrade]);
 return {id:item.id,qualitySchema:modern?'ashen-v06':'legacy-v05',rarity,upgrade,
 min:Math.max(1,Math.round(w.min*factor)),max:Math.max(1,Math.round(w.max*factor)),
 baseAttacks:w.attacks,extraAttacks,accuracy:w.accuracy+accuracy,critPp:w.crit+critPp,
 armorPen:w.pen+armorPen,critMultiplier:w.critMultiplier,bonus};
}
module.exports={preview,DATA};
