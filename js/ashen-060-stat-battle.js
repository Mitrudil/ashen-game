/* ASHEN 0.6.0 / etap 26 — deterministyczne rozstrzyganie ataków na bazie statystyk.
 * Diagnostyka: parametry prawdopodobieństw są propozycją do balansu, NIE kodem serwera.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060StatBattle=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 const check=(ok,msg)=>{if(!ok)throw Error(msg)};
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 const chance=(n)=>clamp(n,0,100);
 function validRolls(rolls){
  check(rolls&&typeof rolls==='object','Brak jawnych rzutów testowych');
  for(const key of ['hit','dodge','critical','damage'])check(finite(rolls[key])&&rolls[key]>=0&&rolls[key]<1,'Nieprawidłowy rzut '+key);
 }
 function validCombatant(c,id){
  check(c&&c.defense&&Array.isArray(c.attacks)&&c.attacks.length>0,'Brak statystyk postaci '+id);
  for(const key of ['hp','acc','dodge','armor'])check(finite(c.defense[key])&&c.defense[key]>=0,'Nieprawidłowa statystyka '+id+'.'+key);
  check(c.defense.hp>0,'PŻ muszą być dodatnie');
 }
 function resolveStrike(attack,attacker,defender,rolls,options={}){
  validCombatant(attacker,'atakującej');validCombatant(defender,'broniącej');validRolls(rolls);
  check(attack&&finite(attack.min)&&finite(attack.max)&&attack.min>=0&&attack.max>=attack.min,'Nieprawidłowy zakres broni');
  check(finite(attack.attributeDamage)&&finite(attack.accuracy)&&finite(attack.power)&&attack.power>0,'Nieprawidłowe parametry ataku');
  for(const k of ['critChance','critMultiplier','penetration','accuracyBonus','damageBonusPercent'])
   if(options[k]!==undefined)check(finite(options[k]),'Nieprawidłowy parametr '+k);
  const criticalChance=chance(options.critChance??5);
  const criticalMultiplier=options.critMultiplier??1.5;
  check(criticalMultiplier>=1&&criticalMultiplier<=5,'Nieprawidłowy mnożnik krytyka');
  const penetration=Math.max(0,options.penetration??0);
  const hitChance=chance(clamp(65+(attacker.defense.acc+attack.accuracy+(options.accuracyBonus??0)-defender.defense.dodge)*0.4,5,95));
  const dodgeChance=chance(clamp(3+defender.defense.dodge*0.18,0,35));
  const baseRoll=Math.round(attack.min+(attack.max-attack.min)*rolls.damage);
  const baseDamage=Math.max(0,Math.round((baseRoll+attack.attributeDamage)*attack.power*(1+(options.damageBonusPercent??0)/100)));
  let outcome='hit',critical=false,damage=0;
  if(rolls.hit>=hitChance/100)outcome='miss';
  else if(rolls.dodge<dodgeChance/100)outcome='dodge';
  else{
   critical=rolls.critical<criticalChance/100;
   outcome=critical?'critical_hit':'hit';
   const armor=Math.max(0,defender.defense.armor-penetration);
   damage=Math.max(1,Math.round(baseDamage*(critical?criticalMultiplier:1)-armor));
  }
  return {outcome,damage,baseDamage,critical,hitChance,dodgeChance,criticalChance,
   effectiveArmor:Math.max(0,defender.defense.armor-penetration),status:'diagnostic_only'};
 }
 // Wejście: raporty postaci z calculate()/preview() oraz lista akcji z indeksami ataków i jawnymi rzutami.
 function simulate(config,deps){
  check(config&&Array.isArray(config.rounds)&&config.rounds.length>=1&&config.rounds.length<=20,'Wymagane 1–20 rund');
  check(deps&&deps.battle&&typeof deps.battle.simulate==='function'&&deps.trigger&&deps.effect,'Brak modułów etapów 22/24/25');
  const resolved={},details=[];
  for(const id of ['a','b']){
   check(config[id]&&config[id].stats,'Brak statystyk '+id);
   validCombatant(config[id].stats,id);
   check(config[id].signals&&config[id].rules,'Brak reguł Z '+id);
   const {stats,...rest}=config[id];
   const maxHp=config[id].maxHp??stats.defense.hp;
   const hp=config[id].hp??maxHp;
   check(finite(maxHp)&&maxHp>0&&finite(hp)&&hp>0&&hp<=maxHp,'Nieprawidłowe PŻ '+id);
   resolved[id]={...rest,hp,maxHp};
  }
  for(const actions of config.rounds){
   check(Array.isArray(actions)&&actions.length<=24,'Błędna liczba ataków w rundzie');
   for(const act of actions){
    check(act&&['a','b'].includes(act.attacker),'Błędny atakujący');
    const source=config[act.attacker].stats;
    check(Number.isInteger(act.attackIndex)&&act.attackIndex>=0&&act.attackIndex<source.attacks.length,'Nieistniejący atak broni');
    validRolls(act.rolls);
   }
  }
  function resolveAction(action,context){
   const source=config[context.attacker].stats;
   const target=config[context.victim].stats;
   const offensive=context.actors[context.attacker].modifiers;
   const defensive=context.actors[context.victim].modifiers;
   const boostedTarget={...target,defense:{...target.defense,armor:target.defense.armor+(defensive.armor_flat||0)}};
   const options={...action.options,
    accuracyBonus:(action.options?.accuracyBonus||0)+(offensive.accuracy_flat||0),
    damageBonusPercent:(action.options?.damageBonusPercent||0)+(offensive.damage_percent||0),
    penetration:(action.options?.penetration||0)+(offensive.penetration_flat||0)};
   const strike=resolveStrike(source.attacks[action.attackIndex],source,boostedTarget,action.rolls,options);
   const detailsForStrike={round:context.round,action:context.action,attacker:context.attacker,victim:context.victim,
    attackIndex:action.attackIndex,modifiersUsed:{attacker:{...offensive},defender:{...defensive}},...strike};
   details.push(detailsForStrike);
   return {outcome:strike.outcome,damage:strike.damage,details:detailsForStrike};
  }
  const battle=deps.battle.simulate({...resolved,rounds:config.rounds}, {...deps,resolveAction});
  // Statystyki diagnostyczne pochodzą wyłącznie z rozstrzygniętych ataków;
  // nie są wykorzystywane przez aktywny silnik gry.
  const outcomeCounts={hit:0,critical_hit:0,dodge:0,miss:0};
  let totalDamage=0;
  for(const strike of details){outcomeCounts[strike.outcome]++;totalDamage+=strike.damage;}
  const unsupported=[];
  for(const id of ['a','b']){
   for(const sig of battle.unresolved[id]||[])unsupported.push({actor:id,source:sig.key,reason:'no_rule'});
   for(const [key,rule] of Object.entries(config[id].rules)){
    if(rule.effect?.type==='extra_attacks'||rule.effect?.type==='initiative_flat'||rule.effect?.type==='status_marker')
     unsupported.push({actor:id,source:key,reason:'no_combat_integration',effect:rule.effect.type});
   }
  }
  const audit={strikes:details.length,damage:totalDamage,outcomes:outcomeCounts,
   rounds:battle.roundsPlayed,winner:battle.winner,draw:battle.draw,
   incompleteMechanics:unsupported,readyForProduction:false};
  return {status:'diagnostic_only',readyForLive:false,balanceStatus:'proposal_not_approved',audit,
   battle,strikes:details,
   limitations:['Progi trafienia/uniku/krytyka i redukcja pancerza nadal są propozycją balansu.',
    'Rzuty są jawnie przekazane, bez losowania i synchronizacji Supabase.',
    'Aktywne bonusy do celności, obrażeń, pancerza i przebicia wpływają na kolejne rozstrzygane ataki.',
    'Efekty Z wyzwalane trafieniem lub unikiem działają od następnego ataku, nie wstecz.',
    'Dodatkowe ataki, inicjatywa i rezonanse bez reguł pozostają nieaktywne.',
    'Wciąż jest to diagnostyka, nie serwerowy silnik walki.']};
 }
 return Object.freeze({resolveStrike,simulate});
});
