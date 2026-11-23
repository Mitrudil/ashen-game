/* ASHEN 0.6 — etap 141. Planowanie pełnego zestawu: wyłącznie odczyt, bez autoryzacji. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./ashen-060-read-bridge-134.js'):root.Ashen060ReadBridge134,
 typeof module==='object'&&module.exports?require('./ashen-060-equip-audit-135.js'):root.Ashen060EquipAudit135);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060PresetPlan141=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(bridge,audit){
'use strict';
const ATTRS=Object.freeze(['str','dex','end','per','int','cha']);
const OWN=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
function plan(input){
 const errors=[],warnings=[];
 const finish=(status,details={})=>Object.freeze({schema:'ashen-060-preset-plan-141',readOnly:true,authoritative:false,allowedToCommit:false,status,errors:Object.freeze([...errors]),warnings:Object.freeze([...warnings]),...details});
 if(!bridge||!audit||!Array.isArray(audit.SLOTS))return finish('blocked',{errors:['Brak modułów 134/135']});
 if(!input||typeof input!=='object'||!input.snapshot||typeof input.snapshot!=='object')return finish('blocked',{errors:['Brak kopii postaci']});
 const s=input.snapshot;
 if(!Array.isArray(s.inventory)||!s.equip||typeof s.equip!=='object'||Array.isArray(s.equip))return finish('blocked',{errors:['Niepoprawny plecak lub wyposażenie']});
 if(!input.targetEquip||typeof input.targetEquip!=='object'||Array.isArray(input.targetEquip))return finish('blocked',{errors:['Niepoprawny docelowy zestaw']});
 if(input.activeMission!==false||s.mission!=null)errors.push('Brak potwierdzenia braku aktywnej wyprawy lub wyprawa trwa');
 if(!Number.isInteger(s.level)||s.level<1)errors.push('Niepoprawny poziom postaci');
 const baseAttrs=s.baseAttrs;
 if(!baseAttrs||typeof baseAttrs!=='object'||Array.isArray(baseAttrs)||ATTRS.some(a=>!Number.isFinite(baseAttrs[a])))warnings.push('Brak pełnych bazowych atrybutów postaci');
 const bonuses=input.itemAttributeBonuses;
 if(!bonuses||typeof bonuses!=='object'||Array.isArray(bonuses))warnings.push('Brak kompletnych premii po UID');
 let idx;
 try{idx=bridge.indexCatalog(input.catalog)}catch(e){errors.push('Błędny katalog: '+e.message);return finish('blocked')}
 const byUid=new Map();
 for(const item of s.inventory){
  if(!item||typeof item.uid!=='string'||!item.uid.trim()||typeof item.id!=='string'||!item.id.trim()){
   errors.push('Niepoprawne uid lub id w plecaku');continue;
  }
  if(byUid.has(item.uid))errors.push('Powtórzony UID: '+item.uid);
  byUid.set(item.uid,item);
 }
 const slots=audit.SLOTS;
 for(const key of Object.keys(input.targetEquip))if(!slots.includes(key))errors.push('Nieznany slot docelowy: '+key);
 for(const key of Object.keys(s.equip))if(!slots.includes(key))warnings.push('Nieznany slot źródłowy: '+key);
 const target={},seen=new Set(),resolved=[],rows=[];
 for(const slot of slots){
  if(!OWN(input.targetEquip,slot)){errors.push('Docelowy zestaw nie określa slotu '+slot);continue;}
  const uid=input.targetEquip[slot];
  if(uid===null||uid===''){target[slot]=null;continue;}
  if(typeof uid!=='string'||!uid.trim()){errors.push('Niepoprawny UID w slocie '+slot);continue;}
  target[slot]=uid;
  if(seen.has(uid)){errors.push('UID występuje w kilku slotach: '+uid);continue;}
  seen.add(uid);
  const item=byUid.get(uid);
  if(!item){errors.push('Przedmiot spoza plecaka: '+uid);continue;}
  if(item.locked===true)errors.push('Zablokowany przedmiot: '+uid);
  const def=idx.modern.get(item.id)||idx.legacy.get(item.id);
  if(!def){warnings.push('Nieznana baza UID '+uid+' — możliwy unikat');rows.push({slot,uid,status:'review'});continue;}
  if(!audit.slotCompatible(slot,def))errors.push('Niewłaściwy slot '+slot+' dla UID '+uid);
  resolved.push({slot,uid,item,def});
  rows.push({slot,uid,modernId:def.modernId,status:'mapped'});
 }
 const right=resolved.find(x=>x.slot==='right');
 if(right&&right.def.handMode==='2h'&&target.left)errors.push('Broń dwuręczna zajmuje obie ręce');
 // Nie dopuszczamy użycia certyfikatu ze strony klienta jako wyjątku od wymagań.
 if(input.certified!==undefined||input.certificates!==undefined||resolved.some(x=>x.item.certified!==undefined))warnings.push('Poświadczenie z przeglądarki nie jest dowodem legalnego założenia');
 const computed={};
 if(baseAttrs&&ATTRS.every(a=>Number.isFinite(baseAttrs[a]))&&bonuses){
  for(const attr of ATTRS)computed[attr]=baseAttrs[attr];
  for(const x of resolved){
   const b=bonuses[x.uid];
   if(!b||typeof b!=='object'||Array.isArray(b)){warnings.push('Niepełne premie UID '+x.uid);continue;}
   let valid=true;
   for(const [attr,val] of Object.entries(b)){
    if(!ATTRS.includes(attr)||!Number.isFinite(val)){errors.push('Niepoprawna premia '+attr+' dla UID '+x.uid);valid=false;}
   }
   if(valid)for(const a of ATTRS)computed[a]+=b[a]||0;
  }
  // Bonusy setów, afiksów i artefaktów nie mogą być domyślnie wyliczane z samych nazw.
  if(input.completeBonuses!==true)warnings.push('Niepotwierdzona kompletność bonusów setów, afiksów i artefaktów');
 }else warnings.push('Nie da się wyliczyć docelowych atrybutów');
 for(const x of resolved){
  const d=x.def;
  if(Number.isFinite(d.requiredLevel)&&s.level<d.requiredLevel)errors.push('Wymagany poziom '+d.requiredLevel+' dla UID '+x.uid);
  if(d.requiredAttribute){
   if(!ATTRS.includes(d.requiredAttribute)||!Number.isFinite(d.requiredValue))warnings.push('Niepoprawne wymagania bazy UID '+x.uid);
   else if(!Number.isFinite(computed[d.requiredAttribute]))warnings.push('Nieznany atrybut wymagany przez UID '+x.uid);
   else if(computed[d.requiredAttribute]<d.requiredValue)errors.push('Niespełniony atrybut '+d.requiredAttribute+' dla UID '+x.uid);
  }
 }
 const status=errors.length?'blocked':warnings.length?'review':'eligibleOfflineOnly';
 return finish(status,{
  targetEquip:Object.freeze({...target}),
  targetAttributes:Object.freeze({...computed}),
  slots:Object.freeze(rows.map(x=>Object.freeze({...x}))),
  changedSlots:Object.freeze(slots.filter(slot=>OWN(target,slot)&&(s.equip[slot]||null)!==target[slot])),
  note:'To wyłącznie plan diagnostyczny. Nie sprawdza transakcji serwera, własności w Supabase, certyfikacji pierwszego założenia ani równoległych zmian.'
 });
}
return Object.freeze({plan,ATTRS});
});
