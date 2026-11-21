/* ASHEN 0.6.0 — etap 22. Izolowany harmonogram Z/rezonansów (podgląd).
 * Reguły są jawnie dostarczane przez testującego; bez automatycznego balansu.
 * Nie stosuje obrażeń, tarcz ani statusów do postaci/PvP.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060TriggerPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const ALLOWED_EVENTS=new Set(['battle_start','round_start','dodge','hit','miss','critical_hit','damage_taken','hp_below_threshold','round_end','battle_end']);
 const ALLOWED_TYPES=new Set(['set_z','resonance']);
 const ALLOWED_EFFECTS=new Set(['damage_percent','armor_flat','shield_flat','heal_flat','accuracy_flat','penetration_flat','initiative_flat','extra_attacks','status_marker']);
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const valid=(b,msg)=>{if(!b)throw Error(msg)};
 const positiveInt=n=>Number.isInteger(n)&&n>=1;
 const keyOf=s=>s.type+':'+s.family;
 function normalizeSignals(result){
  valid(result&&Array.isArray(result.signals),'Wymagane sygnały zestawów/artefaktów');
  const seen=new Set();return result.signals.filter(s=>s&&ALLOWED_TYPES.has(s.type)).map(s=>{
   valid(typeof s.family==='string'&&s.family.trim(),'Sygnał bez rodziny');
   const key=keyOf(s);valid(!seen.has(key),'Powtórzony sygnał: '+key);seen.add(key);
   if(s.type==='resonance')valid(s.active===true&&Number.isInteger(s.count)&&s.count>=3,'Rezonans wymaga min. trzech artefaktów');
   if(s.type==='set_z')valid(typeof s.name==='string'&&s.name.trim(),'Brak nazwy efektu Z');
   return {key,type:s.type,family:s.family,name:s.name||null};
  });
 }
 function checkRule(rule){
  valid(rule&&typeof rule==='object'&&!Array.isArray(rule),'Reguła musi być obiektem');
  valid(ALLOWED_EVENTS.has(rule.trigger),'Nieobsługiwany wyzwalacz: '+rule.trigger);
  valid(['battle','round'].includes(rule.limitScope),'limitScope musi być battle lub round');
  valid(positiveInt(rule.maxActivations),'maxActivations musi być dodatnią liczbą całkowitą');
  valid(rule.effect&&ALLOWED_EFFECTS.has(rule.effect.type),'Nieznany typ efektu');
  valid((rule.effect.type==='status_marker'&&typeof rule.effect.value==='string'&&rule.effect.value.length>0&&rule.effect.value.length<=80)||
   (rule.effect.type!=='status_marker'&&Number.isFinite(rule.effect.value)&&rule.effect.value>=0&&
    (rule.effect.type!=='extra_attacks'||Number.isInteger(rule.effect.value))), 'Nieprawidłowa wartość efektu');
  valid(rule.actor===undefined||['self','opponent'].includes(rule.actor),'Nieznany wykonawca zdarzenia');
  valid(rule.cooldownRounds===undefined||(Number.isInteger(rule.cooldownRounds)&&rule.cooldownRounds>=0),'Nieprawidłowy cooldown');
  return {trigger:rule.trigger,actor:rule.actor||'self',limitScope:rule.limitScope,maxActivations:rule.maxActivations,
   cooldownRounds:rule.cooldownRounds||0,effect:{type:rule.effect.type,value:rule.effect.value}};
 }
 function simulate(result,history,proposedRules={}){
  const signals=normalizeSignals(result);
  valid(Array.isArray(history),'Historia zdarzeń musi być tablicą');
  valid(proposedRules&&typeof proposedRules==='object'&&!Array.isArray(proposedRules),'Reguły muszą być mapą');
  const active=new Map(signals.map(s=>[s.key,s]));
  const rules=new Map();
  for(const [key,rule] of Object.entries(proposedRules)){
   valid(active.has(key),'Reguła dla nieaktywnego sygnału: '+key);
   rules.set(key,checkRule(rule));
  }
  const pending=signals.filter(s=>!rules.has(s.key));
  const counters=new Map(),events=[];let round=0,started=false,ended=false;
  for(const [index,event] of history.entries()){
   valid(event&&ALLOWED_EVENTS.has(event.type),'Nieznane zdarzenie nr '+index);
   valid(event.actor===undefined||['self','opponent'].includes(event.actor),'Nieznany wykonawca zdarzenia');
   if(event.type==='battle_start'){valid(!started&&!ended,'Walka może rozpocząć się tylko raz');started=true;}
   else valid(started&&!ended,'Zdarzenie poza rozpoczętą walką');
   if(event.type==='round_start'){valid(!own(event,'round')||event.round===round+1,'Nieprawidłowa kolejność rund');round++;}
   if(event.type==='battle_end')ended=true;
   const activations=[],blocked=[];
   for(const s of signals){
    const rule=rules.get(s.key);if(!rule||rule.trigger!==event.type||rule.actor!==(event.actor||'self'))continue;
    const c=counters.get(s.key)||{battle:0,round:0,lastRound:null};
    if(rule.limitScope==='round'&&c.lastRound!==round)c.round=0;
    const n=rule.limitScope==='round'?c.round:c.battle;
    if(n>=rule.maxActivations){blocked.push({key:s.key,reason:'limit'});continue;}
    if(rule.cooldownRounds>0&&c.lastRound!==null&&round-c.lastRound<=rule.cooldownRounds){blocked.push({key:s.key,reason:'cooldown'});continue;}
    c.battle++;c.round++;c.lastRound=round;counters.set(s.key,c);
    activations.push({key:s.key,sourceType:s.type,round,effect:{...rule.effect},diagnosticOnly:true});
   }
   events.push({index,type:event.type,actor:event.actor||'self',round,activations,blocked});
  }
  return {status:'diagnostic_only',readyForLive:false,roundsObserved:round,events,
   unresolvedSignals:pending,configuredSignals:signals.length-pending.length,
   notes:['Reguły są propozycjami wejściowymi, nie zatwierdzonym balansem','Efekty opisano, ale nie zastosowano do PŻ, ekwipunku ani PvP','Reguły serwerowe i synchronizacja walk pozostają do wdrożenia']};
 }
 return Object.freeze({simulate,normalizeSignals,checkRule,ALLOWED_EVENTS:Object.freeze([...ALLOWED_EVENTS]),ALLOWED_EFFECTS:Object.freeze([...ALLOWED_EFFECTS])});
});
