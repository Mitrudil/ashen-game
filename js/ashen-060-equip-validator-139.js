/* ASHEN 0.6 — etap 139: walidator PRZED założeniem, wyłącznie diagnostyczny. */
(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./ashen-060-read-bridge-134.js'):root.Ashen060ReadBridge134,
                    typeof module==='object'&&module.exports?require('./ashen-060-equip-audit-135.js'):root.Ashen060EquipAudit135);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.Ashen060EquipValidator139=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(bridge,audit){
'use strict';
const ATTRS=new Set(['str','dex','end','per','int','cha']);
function validateEquip(input){
 const errors=[],warnings=[];
 const result=(status,details={})=>Object.freeze({schema:'ashen-060-equip-validator-139',readOnly:true,authoritative:false,status,allowedToCommit:false,errors:Object.freeze([...errors]),warnings:Object.freeze([...warnings]),...details});
 if(!bridge||!audit||typeof bridge.indexCatalog!=='function'||typeof audit.slotCompatible!=='function')return result('blocked',{errors:['Brakuje modułów 134/135']});
 if(!input||typeof input!=='object'||!input.snapshot||typeof input.snapshot!=='object'||!Array.isArray(input.snapshot.inventory)||!input.snapshot.equip||typeof input.snapshot.equip!=='object'||Array.isArray(input.snapshot.equip))return result('blocked',{errors:['Brak prawidłowej kopii wyposażenia']});
 let idx;try{idx=bridge.indexCatalog(input.catalog);}catch(e){return result('blocked',{errors:['Niepoprawny katalog 100 baz: '+e.message]});}
 const {snapshot}=input;
 if(typeof input.uid!=='string'||!input.uid.trim())errors.push('Niepoprawny UID');
 if(!audit.SLOTS.includes(input.slot))errors.push('Nieznany slot');
 if(input.activeMission===true||Boolean(snapshot.mission))errors.push('Zmiana wyposażenia zabroniona podczas wyprawy');
 if(input.activeMission!==true&&input.activeMission!==false&&snapshot.mission==null)warnings.push('Brak potwierdzonego stanu wyprawy — potrzebna kontrola w grze');
 if(errors.length)return result('blocked');
 const matched=snapshot.inventory.filter(i=>i&&i.uid===input.uid);
 if(matched.length!==1){errors.push(matched.length?'Powtórzony UID':'UID nie należy do przekazanego plecaka');return result('blocked');}
 const item=matched[0], base=idx.modern.get(item.id)||idx.legacy.get(item.id);
 if(!base)return result('review',{warnings:[...warnings,'Przedmiot spoza katalogu 100 baz — możliwy unikat; bez automatycznej decyzji']});
 if(!audit.slotCompatible(input.slot,base))errors.push('Przedmiot nie pasuje do slotu');
 if(item.locked===true)errors.push('Przedmiot jest zablokowany');
 if(!Number.isInteger(snapshot.level)||snapshot.level<1)warnings.push('Brak wiarygodnego poziomu postaci');
 else if(Number.isFinite(base.requiredLevel)&&snapshot.level<base.requiredLevel)errors.push('Wymagany poziom '+base.requiredLevel);
 if(base.requiredAttribute){
  if(!ATTRS.has(base.requiredAttribute)||!Number.isFinite(base.requiredValue))warnings.push('Nieobsługiwane wymaganie atrybutu');
  else if(!snapshot.attrs||!Number.isFinite(snapshot.attrs[base.requiredAttribute]))warnings.push('Brak potwierdzonej wartości atrybutu '+base.requiredAttribute);
  else if(snapshot.attrs[base.requiredAttribute]<base.requiredValue)errors.push('Wymagany '+base.requiredAttribute+' ≥ '+base.requiredValue);
 }
 if(input.certified!==undefined||item.certified!==undefined)warnings.push('Poświadczenia z klienta nie są dowodem pierwszego legalnego założenia');
 const current=[];
 for(const [slot,uid] of Object.entries(snapshot.equip))if(uid===input.uid)current.push(slot);
 if(current.length>1)errors.push('UID jest już założony w kilku slotach');
 const equipAudit=audit.inspectEquipment(snapshot,input.catalog);
 if(equipAudit.rows.some(r=>r.status!=='ok'&&r.uid!==input.uid))warnings.push('Inne wyposażenie wymaga kontroli — przed operacją sprawdź cały zestaw');
 if(errors.length)return result('blocked',{uid:input.uid,slot:input.slot,modernId:base.modernId});
 if(warnings.length)return result('review',{uid:input.uid,slot:input.slot,modernId:base.modernId});
 return result('eligibleOfflineOnly',{uid:input.uid,slot:input.slot,modernId:base.modernId,note:'Ocena lokalna, NIE autoryzuje zapisu ani wyposażenia w Supabase'});
}
return Object.freeze({validateEquip});
});
