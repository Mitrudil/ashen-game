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
  const resolved={},plan=[],details=[];
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
  for(let i=0;i<config.rounds.length;i++){
   const actions=config.rounds[i];check(Array.isArray(actions)&&actions.length<=24,'Błędna liczba ataków w rundzie');
   const result=[];
   for(let j=0;j<actions.length;j++){
    const act=actions[j];check(act&&['a','b'].includes(act.attacker),'Błędny atakujący');
    const target=act.attacker==='a'?'b':'a';
    const source=config[act.attacker].stats,defender=config[target].stats;
    check(Number.isInteger(act.attackIndex)&&act.attackIndex>=0&&act.attackIndex<source.attacks.length,'Nieistniejący atak broni');
    const strike=resolveStrike(source.attacks[act.attackIndex],source,defender,act.rolls,act.options||{});
    result.push({attacker:act.attacker,outcome:strike.outcome,damage:strike.damage});
    details.push({round:i+1,action:j+1,attacker:act.attacker,victim:target,attackIndex:act.attackIndex,...strike});
   }
   plan.push(result);
  }
  const battle=deps.battle.simulate({...resolved,rounds:plan},deps);
  return {status:'diagnostic_only',readyForLive:false,balanceStatus:'proposal_not_approved',
   battle,strikes:details,rounds:plan,
   limitations:['Progi trafienia/uniku/krytyka i redukcja pancerza są propozycją, nie zatwierdzonymi regułami PvP.',
    'Rzuty są jawnie przekazane, bez losowania i bez synchronizacji Supabase.',
    'Aktywne modyfikatory statusów Z nie zmieniają jeszcze obliczanych trafień/obrażeń.',
    'Wciąż obowiązuje wyłącznie diagnostyka — nie jest to serwerowy silnik walki.']};
 }
 return Object.freeze({resolveStrike,simulate});
});
