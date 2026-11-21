/* ASHEN 0.6.0 / etap 29 — pierwszy most do prawdziwych Starć PvE.
 * Trafienie, unik i krytyk z nowego resolvera; obrażenia i efekty Z
 * pozostają w istniejącym silniku do kolejnego etapu migracji.
 */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./ashen-060-stat-battle.js'):root.Ashen060StatBattle);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060PveBridge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(stat){
 'use strict';
 function outcome(config,random){
  if(!stat||typeof stat.resolveStrike!=='function')throw Error('Brak resolvera 0.6.0');
  if(typeof random!=='function')throw Error('Brak generatora losowego');
  const a=config.attacker,d=config.defender,w=config.attack;
  const combatant=x=>({defense:{hp:Math.max(1,Number(x.hp)||1),acc:Math.max(0,Number(x.acc)||0),dodge:Math.max(0,Number(x.dodge)||0),armor:Math.max(0,Number(x.armor)||0)},attacks:[{min:1,max:1,attributeDamage:0,accuracy:0,power:1}]});
  const rolls={hit:random(),dodge:random(),critical:random(),damage:random()};
  const strike=stat.resolveStrike({min:Math.max(0,Number(w.min)||0),max:Math.max(0,Number(w.max)||0),attributeDamage:0,accuracy:Number(w.accuracy)||0,power:1},combatant(a),combatant(d),rolls,{critChance:config.critChance??5});
  return {outcome:strike.outcome,critical:strike.critical,hitChance:strike.hitChance,dodgeChance:strike.dodgeChance};
 }
 // Jednolity tor krytyka: mnożnik działa przed redukcją przez pancerz.
 // Używamy go tylko w rzeczywistych Starciach 0.6.0.
 function impact(raw,armor,penetration=0,critical=false,critMultiplier=1.6){
  if(!Number.isFinite(raw)||raw<0||!Number.isFinite(critMultiplier)||critMultiplier<1||critMultiplier>5)
   throw Error('Nieprawidłowe obrażenia lub mnożnik krytyka');
  const scaled=critical?raw*critMultiplier:raw;
  const result=damage(scaled,armor,penetration);
  return {damage:result.damage,normalDamage:critical?damage(raw,armor,penetration).damage:result.damage,
   effectiveArmor:result.effectiveArmor,critical:!!critical};
 }
 function damage(raw,armor,penetration=0){
  if(!stat||typeof stat.resolveDamage!=='function')throw Error('Brak kalkulatora obrażeń 0.6.0');
  return stat.resolveDamage(raw,armor,penetration);
 }
 // Kolejność działa w rzeczywistych Starciach; identyczne rzuty dają identyczny wynik.
 function initiativeOrder(config){
  const keys=['heroDex','heroInitiative','enemyInitiative','heroRoll','enemyRoll'];
  if(!config||keys.some(k=>!Number.isFinite(config[k])))throw Error('Nieprawidłowa inicjatywa');
  if(config.heroRoll<1||config.heroRoll>20||config.enemyRoll<1||config.enemyRoll>20)
   throw Error('Rzuty inicjatywy poza zakresem 1–20');
  const hero=config.heroRoll+config.heroDex+config.heroInitiative;
  const enemy=config.enemyRoll+config.enemyInitiative;
  return hero>=enemy?['hero','foe']:['foe','hero'];
 }
 return Object.freeze({outcome,damage,impact,initiativeOrder});
});
