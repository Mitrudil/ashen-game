/* ASHEN 0.6 — adapter podglądu artefaktów w rzeczywistym oknie przedmiotu.
 * Funkcje wyłącznie odczytowe; nie modyfikują ekwipunku, gniazd ani statystyk PvP.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060EquipmentPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CATEGORY_BY_SLOT={right:'weapon_main',left:'weapon_off',outer:'jacket',shirt:'shirt',pants:'pants',boots:'boots',head:'head',hands:'gloves',extra:'accessory1',extra2:'accessory2',extra3:'accessory3'};
function categoryOfGameSlot(slot){return CATEGORY_BY_SLOT[slot]||null}
function artifactChoices(catalog,slot,engine){
 const mapped=categoryOfGameSlot(slot);if(!mapped||!engine||!catalog)return [];
 const cat=engine.SLOT_CATEGORY[mapped];
 const names=[...new Set(catalog.artifact_effects.map(e=>e.artifact))];
 return names.map(name=>{
  const effect=catalog.artifact_effects.find(e=>e.artifact===name&&e.slot_category===cat);
  if(!effect)return null;
  const item={id:'preview-only',socketCapacity:1,socketedArtifacts:[name]};
  const result=engine.compute({items:{[mapped]:item}},catalog);
  return {name,family:effect.family,stat_key:result.modifiers[0].stat_key,operation:result.modifiers[0].operation,value:result.modifiers[0].value,condition:result.modifiers[0].activation_condition};
 }).filter(Boolean)
}
function compareEquipped(before,after,catalog,engine){
 const snapshot=equipped=>({items:Object.fromEntries(Object.entries(equipped||{}).filter(([s,v])=>categoryOfGameSlot(s)&&v&&Number.isInteger(v.socketCapacity)).map(([s,v])=>[categoryOfGameSlot(s),{id:v.id,socketCapacity:v.socketCapacity,socketedArtifacts:v.socketedArtifacts||[]}]))});
 return {before:engine.compute(snapshot(before),catalog),after:engine.compute(snapshot(after),catalog)};
}
return Object.freeze({CATEGORY_BY_SLOT,categoryOfGameSlot,artifactChoices,compareEquipped});
});
