/* ASHEN 0.6.0 — etap 24. Izolowana symulacja efektów Z, bez wpływu na PvE/PvP. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060EffectPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODIFIERS=new Set(['damage_percent','armor_flat','accuracy_flat','penetration_flat','initiative_flat']);
 const DEFAULT_DURATIONS=Object.freeze({damage_percent:1,armor_flat:2,accuracy_flat:2,penetration_flat:1,initiative_flat:1});
 function valid(condition,message){if(!condition)throw Error(message)}
 function number(x){return typeof x==='number'&&Number.isFinite(x)}
 function initialState(input){
  valid(input&&number(input.maxHp)&&input.maxHp>0,'Podaj dodatnie maxHp');
  valid(number(input.hp)&&input.hp>=0&&input.hp<=input.maxHp,'Podaj hp w zakresie 0..maxHp');
  return {hp:input.hp,maxHp:input.maxHp,shield:0,round:0,statuses:[],modifiers:{},events:[]};
 }
 function aggregate(statuses){
  const result={};for(const status of statuses)result[status.type]=(result[status.type]||0)+status.value;
  return result;
 }
 function simulate(report,initial,options={}){
  valid(report&&report.status==='diagnostic_only'&&Array.isArray(report.events),'Wymagany raport diagnostyczny etapu 22/23');
  valid(options&&typeof options==='object'&&!Array.isArray(options),'Błędne opcje');
  const durations={...DEFAULT_DURATIONS,...(options.durations||{})};
  for(const [type,rounds] of Object.entries(durations))valid(MODIFIERS.has(type)&&Number.isInteger(rounds)&&rounds>=1&&rounds<=20,'Błędny czas trwania '+type);
  const state=initialState(initial);let previousRound=0;let closed=false;
  for(const event of report.events){
   valid(event&&typeof event.type==='string'&&Number.isInteger(event.round)&&event.round>=0,'Nieprawidłowe zdarzenie');
   valid(event.round>=previousRound&&event.round<=previousRound+1,'Nieprawidłowa kolejność rund');
   valid(!closed,'Zdarzenie po końcu walki');
   const step={type:event.type,round:event.round,hpBefore:state.hp,shieldBefore:state.shield,expired:[],applied:[],blocked:[],damage:{incoming:0,absorbed:0,toHp:0}};
   if(event.type==='round_start'){
    valid(event.round===previousRound+1,'round_start musi rozpoczynać następną rundę');
    const keep=[];for(const s of state.statuses){if(s.untilRound<event.round)step.expired.push({key:s.key,type:s.type});else keep.push(s)}
    state.statuses=keep;
   }
   state.round=event.round;previousRound=event.round;
   // Obrażenia zdarzenia są przetwarzane PRZED premią aktywowaną przez damage_taken.
   if(event.type==='damage_taken'){
    const amount=event.amount===undefined?0:event.amount;
    valid(number(amount)&&amount>=0,'Nieprawidłowe obrażenia');
    const absorbed=Math.min(state.shield,amount);
    state.shield-=absorbed;
    const toHp=Math.min(state.hp,amount-absorbed);
    state.hp-=toHp;
    step.damage={incoming:amount,absorbed,toHp};
   }
   valid(Array.isArray(event.activations),'Brak tablicy aktywacji');
   for(const a of event.activations){
    valid(a&&a.effect&&typeof a.effect.type==='string','Nieprawidłowa aktywacja');
    const {type,value}=a.effect;
    if(type==='status_marker'||type==='extra_attacks'){
     step.blocked.push({key:a.key,type,reason:'Wymaga integracji z silnikiem walki'});continue;
    }
    valid(number(value)&&value>=0,'Nieprawidłowa wartość efektu');
    if(type==='heal_flat'){
     const healed=Math.min(value,state.maxHp-state.hp);state.hp+=healed;
     step.applied.push({key:a.key,type,value,actual:healed});
    }else if(type==='shield_flat'){
     state.shield+=value;step.applied.push({key:a.key,type,value,actual:value});
    }else if(MODIFIERS.has(type)){
     const duration=durations[type];
     state.statuses.push({key:a.key,type,value,startedRound:event.round,untilRound:Math.max(1,event.round)+duration-1});
     step.applied.push({key:a.key,type,value,durationRounds:duration});
    }else step.blocked.push({key:a.key,type,reason:'Nieznany efekt'});
   }
   state.modifiers=aggregate(state.statuses);
   step.hpAfter=state.hp;step.shieldAfter=state.shield;step.modifiers={...state.modifiers};
   state.events.push(step);
   if(event.type==='battle_end')closed=true;
  }
  return {status:'diagnostic_only',readyForLive:false,balanceStatus:'proposal_not_approved',
   hp:state.hp,maxHp:state.maxHp,shield:state.shield,roundsObserved:state.round,
   modifiers:{...state.modifiers},statuses:state.statuses.map(s=>({...s})),events:state.events,
   notes:['Wartości i czas trwania efektów są propozycją do testów, nie zatwierdzonym balansem.',
    'damage_taken obniża PŻ przed aktywacją nowej tarczy; osłona chroni przed następnym ciosem.',
    'Modyfikatory są jedynie wykazywane: nie wpływają na rzeczywiste obrażenia i celność.',
    'Nie synchronizuje danych z Supabase ani nie zmienia aktywnego PvE/PvP.']};
 }
 return Object.freeze({simulate,DEFAULT_DURATIONS});
});
