/* ASHEN 0.6.0 — etap 15. Fail-closed gate for publishing combat snapshots.
 * This is NOT server-side verification. Do not enable v0.6 drops until the
 * server independently validates modern equipment and reproduces its stats.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060PvpContract=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function error(code,detail){const e=new Error(detail);e.code=code;throw e}
const owned=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function auditSave(save,quality){
 if(!save||typeof save!=='object'||!Array.isArray(save.inventory)||!save.equip||typeof save.equip!=='object')error('INVALID_SAVE','Brak prawidłowego ekwipunku postaci.');
 if(!quality||typeof quality.describe!=='function')error('INVALID_API','Moduł jakości nie jest gotowy.');
 const uidSet=new Set(),items=new Map();let modernCount=0,legacyCount=0,sockets=0;
 for(const item of save.inventory){
  if(!item||typeof item.uid!=='string'||!item.uid||uidSet.has(item.uid))error('INVALID_INVENTORY','Nieprawidłowy lub powielony identyfikator przedmiotu.');
  uidSet.add(item.uid);items.set(item.uid,item);
  let d;try{d=quality.describe(item)}catch(_){error('INVALID_QUALITY','W zapisie znaleziono przedmiot z nieprawidłową jakością.');}
  if(d.schema==='ashen-v06')modernCount++;else legacyCount++;
  if(owned(item,'socketCapacity')){
   if(!Number.isInteger(item.socketCapacity)||item.socketCapacity<0||item.socketCapacity>3)error('INVALID_SOCKET','Nieprawidłowa liczba gniazd.');
   sockets+=item.socketCapacity;
  }
  if(owned(item,'socketedArtifacts')){
   if(!Array.isArray(item.socketedArtifacts)||!Number.isInteger(item.socketCapacity)||item.socketedArtifacts.length>item.socketCapacity)error('INVALID_SOCKET','Artefakty nie mieszczą się w gniazdach.');
  }
 }
 const equipped=new Set();let equippedModern=0;
 for(const uid of Object.values(save.equip)){
  if(uid===null||uid===undefined||uid==='')continue;
  if(typeof uid!=='string'||!items.has(uid)||equipped.has(uid))error('INVALID_EQUIPMENT','Założony przedmiot nie istnieje lub został przypisany do dwóch slotów.');
  equipped.add(uid);
  if(quality.describe(items.get(uid)).schema==='ashen-v06')equippedModern++;
 }
 return Object.freeze({modernCount,legacyCount,equippedModern,equippedCount:equipped.size,socketCapacity:sockets});
}
// Canonical equipped-item manifest: read only, deterministic and bounded.
// A server must compare this against its own cloud-save row; it is not proof of stat parity.
const EQUIPMENT_SLOTS=Object.freeze(['right','left','head','shirt','outer','hands','pants','boots','extra','extra2','extra3']);
function equipmentManifest(save,quality){
 auditSave(save,quality);
 const byUid=new Map(save.inventory.map(x=>[x.uid,x]));
 const entries=[];
 for(const slot of EQUIPMENT_SLOTS){
  const uid=save.equip[slot];if(!uid)continue;
  const item=byUid.get(uid),q=quality.describe(item);
  entries.push({slot,uid,id:item.id,qualitySchema:q.schema,rarity:q.index,
   socketCapacity:item.socketCapacity??0});
 }
 return entries;
}
// PvP 0.5 cannot calculate equipped 0.6 gear yet. Reject an attack rather
// than silently using a previously published combat snapshot.
function assertOnlineAttackEligible(save,quality){
 const audit=auditSave(save,quality);
 if(audit.equippedModern)error('PVP_MODERN_UNSUPPORTED','PvP online wymaga aktualizacji serwera dla przedmiotów 0.6. Zapis postaci i walki PvE działają normalnie.');
 return audit;
}
function assertSnapshot(snapshot){
 if(!snapshot||typeof snapshot!=='object'||!Array.isArray(snapshot.attacks)||snapshot.attacks.length<1||snapshot.attacks.length>8)error('INVALID_SNAPSHOT','Migawka PvP ma nieprawidłową liczbę ataków.');
 for(const k of ['hp','armor','acc','dodge']){
  if(!Number.isFinite(snapshot[k])||snapshot[k]<0||(k==='hp'&&snapshot[k]<1))error('INVALID_SNAPSHOT','Migawka PvP zawiera nieprawidłowe '+k+'.');
 }
 if(!Array.isArray(snapshot.activeSets)||!snapshot.setEffects||typeof snapshot.setEffects!=='object')error('INVALID_SNAPSHOT','Migawka PvP nie zawiera zestawów X/Y/Z.');
 for(const w of snapshot.attacks){
  if(!w||!w.weapon||typeof w.weapon!=='object'||!['left','right'].includes(w.hand)||!Number.isFinite(w.power)||w.power<=0||w.power>2)error('INVALID_SNAPSHOT','Migawka PvP zawiera nieprawidłowy atak.');
  for(const k of ['min','max'])if(!Number.isFinite(w.weapon[k])||w.weapon[k]<1||w.weapon[k]>2000)error('INVALID_SNAPSHOT','Migawka PvP ma nieprawidłowe obrażenia broni.');
  if(w.weapon.max<w.weapon.min)error('INVALID_SNAPSHOT','Maksymalne obrażenia są mniejsze od minimalnych.');
 }
 return true;
}
function assertReady(save,snapshot,quality,build){
 const audit=auditSave(save,quality);assertSnapshot(snapshot);
 // An innocuous build flag is not proof of server compatibility.
 // A separate server-verified capability protocol is required before accepting modern items.
 // Przedmioty w plecaku nie modyfikują migawki; serwer przechowuje je tylko
 // w prywatnym JSON zapisu. Założenie choć jednego pozostaje zabronione.
 if(audit.equippedModern)error('MODERN_EQUIPPED_NOT_SUPPORTED','Zdejmij przedmioty jakości 0.6 przed publikacją PvP. Serwer nie wylicza jeszcze ich statystyk.');
 if(build?.modernDropsEnabled===true)error('UNSAFE_BUILD','Nowy generator jakości włączono bez potwierdzonej zgodności serwera PvP.');
 return audit;
}
return Object.freeze({auditSave,equipmentManifest,assertSnapshot,assertReady,assertOnlineAttackEligible,EQUIPMENT_SLOTS});
});
