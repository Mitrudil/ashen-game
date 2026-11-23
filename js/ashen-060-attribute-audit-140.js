/* ASHEN 0.6 — etap 140. Diagnostyka premii do atrybutów, bez zapisów. */
(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./ashen-060-equip-validator-139.js'):root.Ashen060EquipValidator139,
 typeof module==='object'&&module.exports?require('./ashen-060-equip-audit-135.js'):root.Ashen060EquipAudit135);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060AttributeAudit140=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(validator,audit){
'use strict';
const ATTRS=Object.freeze(['str','dex','end','per','int','cha']);
const attrSet=new Set(ATTRS);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function evaluate(input){
 const errors=[],warnings=[];
 const finish=(status,extra={})=>Object.freeze({schema:'ashen-060-attribute-audit-140',readOnly:true,authoritative:false,allowedToCommit:false,status,errors:Object.freeze([...errors]),warnings:Object.freeze([...warnings]),...extra});
 if(!input||typeof input!=='object'||!input.snapshot||!Array.isArray(input.snapshot.inventory)||!input.snapshot.equip||typeof input.snapshot.equip!=='object'||Array.isArray(input.snapshot.equip)){
  errors.push('Brak prawidłowej kopii postaci');return finish('blocked');
 }
 if(!validator||typeof validator.validateEquip!=='function'||!audit||!Array.isArray(audit.SLOTS)){
  errors.push('Brak modułów 135/139');return finish('blocked');
 }
 const s=input.snapshot;
 if(!s.baseAttrs||typeof s.baseAttrs!=='object'||Array.isArray(s.baseAttrs)){
  warnings.push('Nie podano atrybutów bazowych; nie wolno zgadywać premii z wyposażenia');return finish('review');
 }
 const base={};
 for(const a of ATTRS){
  if(!Number.isFinite(s.baseAttrs[a]))errors.push('Niepoprawna bazowa wartość '+a);
  else base[a]=s.baseAttrs[a];
 }
 if(errors.length)return finish('blocked');
 // Bonusy pochodzą z jawnych danych diagnostycznych. Nie interpretujemy afiksów ani setów z nazwy.
 if(!input.itemAttributeBonuses||typeof input.itemAttributeBonuses!=='object'||Array.isArray(input.itemAttributeBonuses)){
  warnings.push('Brak jawnych premii przedmiotów po UID; nie wyliczamy statystyk z przypuszczeń');return finish('review',{baseAttrs:Object.freeze(base)});
 }
 const items=new Map();
 for(const item of s.inventory){
  if(!item||typeof item.uid!=='string'||!item.uid.trim()){errors.push('Niepoprawny UID w plecaku');continue;}
  if(items.has(item.uid))errors.push('Powtórzony UID w plecaku: '+item.uid);
  items.set(item.uid,item);
 }
 if(errors.length)return finish('blocked');
 const used=new Set(), sums=Object.fromEntries(ATTRS.map(a=>[a,0])),sources=[];
 for(const slot of audit.SLOTS){
  const uid=s.equip[slot];if(uid==null||uid==='')continue;
  if(typeof uid!=='string'||!items.has(uid)){errors.push('Slot '+slot+' wskazuje UID poza plecakiem');continue;}
  if(used.has(uid)){errors.push('UID założony wielokrotnie: '+uid);continue;}
  used.add(uid);
  if(!own(input.itemAttributeBonuses,uid)){
   warnings.push('Brak informacji o premiach UID '+uid);continue;
  }
  const bonuses=input.itemAttributeBonuses[uid];
  if(!bonuses||typeof bonuses!=='object'||Array.isArray(bonuses)){
   errors.push('Niepoprawne premie UID '+uid);continue;
  }
  for(const [attr,val] of Object.entries(bonuses)){
   if(!attrSet.has(attr)||!Number.isFinite(val))errors.push('Nieobsługiwana premia '+attr+' dla UID '+uid);
  }
  if(Object.entries(bonuses).some(([a,v])=>!attrSet.has(a)||!Number.isFinite(v)))continue;
  for(const a of ATTRS)sums[a]+=bonuses[a]||0;
  sources.push(Object.freeze({slot,uid,bonuses:Object.freeze({...bonuses})}));
 }
 if(errors.length)return finish('blocked');
 if(warnings.length)return finish('review',{baseAttrs:Object.freeze(base),sources:Object.freeze(sources)});
 const computed=Object.fromEntries(ATTRS.map(a=>[a,base[a]+sums[a]]));
 // Snapshot.attrs may include set/conditional bonuses not supplied above. Report, never silently overwrite.
 if(s.attrs&&typeof s.attrs==='object'){
  for(const a of ATTRS){
   if(!Number.isFinite(s.attrs[a])||Math.abs(s.attrs[a]-computed[a])>1e-8)warnings.push('Niezgodne atrybuty '+a+': kopia ≠ suma bazowa + jawne premie');
  }
 }else warnings.push('Brak porównawczych statystyk bieżących postaci');
 const candidate=s.inventory.find(i=>i&&i.uid===input.uid);
 // Nie dokonujemy operacji założenia; kontrola jest wykonywana na ORYGINALNYM stanie.
 const preview=validator.validateEquip({...input,snapshot:{...s,attrs:computed}});
 if(preview.status==='blocked')errors.push(...preview.errors);
 if(preview.status==='review')warnings.push(...preview.warnings);
 const consistency=warnings.length?'review':errors.length?'blocked':'consistentOfflineOnly';
 return finish(errors.length?'blocked':consistency,{
  baseAttrs:Object.freeze(base),attributeBonuses:Object.freeze({...sums}),computedAttrs:Object.freeze(computed),
  sources:Object.freeze(sources),uid:input.uid||null,slot:input.slot||null,
  itemPresent:!!candidate,validatorStatus:preview.status,
  note:'Wyłącznie diagnostyka. Pominięte efekty zestawów, afiksów, artefaktów i premii warunkowych muszą być podane jawnie jako kompletne wartości. Serwer ma ponownie zweryfikować całość.'
 });
}
return Object.freeze({evaluate,ATTRS});
});
