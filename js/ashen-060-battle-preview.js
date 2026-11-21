/* ASHEN 0.6.0 — etap 25: odtwarzanie scenariuszy pojedynku, tylko diagnostyka.
 * Trafienia i podstawowe obrażenia są dostarczone jawnie, bez RNG lub synchronizacji PvP.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060BattlePreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const valid=(p,msg)=>{if(!p)throw Error(msg)};
 const number=n=>typeof n==='number'&&Number.isFinite(n);
 const other=id=>id==='a'?'b':'a';
 function simulate(config,dependencies){
  valid(config&&Array.isArray(config.rounds)&&config.rounds.length>=1&&config.rounds.length<=20,'Wymagane 1–20 rund');
  valid(dependencies&&dependencies.trigger&&dependencies.effect,'Brak modułów etapu 22/24');
  const {trigger,effect}=dependencies;
  valid(typeof trigger.simulate==='function'&&typeof effect.simulate==='function','Nieprawidłowe moduły');
  valid(config.hpThreshold===undefined||(number(config.hpThreshold)&&config.hpThreshold>0&&config.hpThreshold<=1),'Nieprawidłowy próg PŻ');
  const actors={};const histories={a:[],b:[]};const logs=[];
  for(const id of ['a','b']){
   const p=config[id];
   valid(p&&number(p.maxHp)&&p.maxHp>0&&number(p.hp)&&p.hp>0&&p.hp<=p.maxHp,'Nieprawidłowe PŻ postaci '+id);
   valid(p.signals&&Array.isArray(p.signals.signals)&&p.rules&&typeof p.rules==='object','Brak sygnałów/reguł '+id);
   actors[id]={id,name:typeof p.name==='string'?p.name:id,maxHp:p.maxHp,hp:p.hp,shield:0,modifiers:{}};
  }
  function evaluate(id){
   const c=config[id];
   const triggerReport=trigger.simulate(c.signals,histories[id],c.rules);
   const diagnosticEvents=triggerReport.events.map((evt,i)=>({
    type:evt.type,round:evt.round,activations:evt.activations,
    ...(histories[id][i].amount===undefined?{}:{amount:histories[id][i].amount})
   }));
   const result=effect.simulate({...triggerReport,events:diagnosticEvents},{hp:c.hp,maxHp:c.maxHp},c.effectOptions||{});
   const state=actors[id];state.hp=result.hp;state.shield=result.shield;state.modifiers=result.modifiers;
   return result.events[result.events.length-1];
  }
  function add(type,round,who,damage){
   const effects={};
   for(const id of ['a','b']){
    const e={type,actor:who===null?'self':who===id?'self':'opponent'};
    if(type==='round_start')e.round=round;
    if(type==='damage_taken'&&id===who&&damage!==undefined)e.amount=damage;
    histories[id].push(e);
    effects[id]=evaluate(id);
   }
   return effects;
  }
  // Typ obrażeń jest zdarzeniem ofiary; pozostałe zdarzenia są perspektywą atakującego.
  function addDamage(round,victim,amount){
   for(const id of ['a','b']){
    const e={type:'damage_taken',actor:victim===id?'self':'opponent'};
    if(id===victim)e.amount=amount;
    histories[id].push(e);
   }
   return {a:evaluate('a'),b:evaluate('b')};
  }
  add('battle_start',0,null);
  let winner=null,roundsPlayed=0;
  for(let i=0;i<config.rounds.length;i++){
   const round=i+1;const actions=config.rounds[i];
   valid(Array.isArray(actions)&&actions.length<=24,'Runda może mieć maksymalnie 24 zdarzenia ataku');
   if(winner)break;
   roundsPlayed=round;add('round_start',round,null);
   for(const [j,action] of actions.entries()){
    valid(action&&['a','b'].includes(action.attacker),'Nieprawidłowy atakujący');
    valid(['hit','critical_hit','miss','dodge'].includes(action.outcome),'Nieznany wynik ataku');
    const attacker=action.attacker,victim=other(attacker);
    valid(number(action.damage)&&action.damage>=0&&(action.outcome==='hit'||action.outcome==='critical_hit'||action.damage===0),'Nieprawidłowe obrażenia');
    valid(actors[attacker].hp>0&&actors[victim].hp>0,'Nie można atakować po zakończeniu walki');
    const before={hp:actors[victim].hp,shield:actors[victim].shield};
    const steps=[];
    if(action.outcome==='dodge')steps.push(add('dodge',round,victim));
    else if(action.outcome==='miss')steps.push(add('miss',round,attacker));
    else{
     steps.push(add('hit',round,attacker));
     if(action.outcome==='critical_hit')steps.push(add('critical_hit',round,attacker));
     steps.push(addDamage(round,victim,action.damage));
     if(actors[victim].hp/actors[victim].maxHp<=(config.hpThreshold===undefined?0.3:config.hpThreshold))
      steps.push(add('hp_below_threshold',round,victim));
    }
    logs.push({round,action:j+1,attacker,victim,outcome:action.outcome,baseDamage:action.damage,
     hpBefore:before.hp,hpAfter:actors[victim].hp,shieldBefore:before.shield,shieldAfter:actors[victim].shield,
     events:steps.map(s=>({a:s.a.applied,b:s.b.applied,blocked:{a:s.a.blocked,b:s.b.blocked}}))});
    if(actors[victim].hp<=0){winner=attacker;break;}
   }
   add('round_end',round,null);
  }
  add('battle_end',roundsPlayed,null);
  const unresolved={};
  for(const id of ['a','b']){
   const r=trigger.simulate(config[id].signals,histories[id],config[id].rules);
   unresolved[id]=r.unresolvedSignals;
  }
  return {status:'diagnostic_only',readyForLive:false,balanceStatus:'proposal_not_approved',
   winner,draw:winner===null,roundsPlayed,actors,log:logs,unresolved,
   limitations:['Wyniki trafień, uników i bazowe obrażenia są danymi scenariusza, a nie wyliczeniem silnika.',
    'Modyfikatory obrażeń/pancerza/celności i dodatkowe ataki nie zmieniają przebiegu pojedynku.',
    'Premie Z i progi PŻ są propozycją balansu, bez synchronizacji Supabase/PvP.']};
 }
 return Object.freeze({simulate});
});
